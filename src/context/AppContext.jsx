import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
import { mockEquipment, mockLabour, mockNewDealers, mockChats, mockBookings } from '../data/mockData';
import {
  loadBlackoutState,
  saveBlackoutState,
  saveBlackoutBackup,
  readBlackoutBackup,
  fetchAllBlackoutData,
  deleteBlackoutDatabaseData,
  restoreBlackoutDatabaseData,
  runDisasterRecoverySequence,
  restoreDisasterRecoverySequence,
  createDisasterBackup
} from '../lib/supabase';

const AppContext = createContext();
const RECOVERY_SNAPSHOT_KEY = 'krushijod_recovery_snapshot';
const RECOVERY_OUTBOX_KEY = 'krushijod_recovery_outbox';
const RECOVERY_STATUS_KEY = 'krushijod_recovery_status';
const DATA_BLACKOUT_KEY = 'krushijod_data_blackout';

const readLocalJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

const getDefaultRecoverySnapshot = () => ({
  equipmentList: mockEquipment,
  labourList: mockLabour,
  bookings: mockBookings,
  chats: mockChats,
  savedAt: Date.now()
});

const createValidRecoverySnapshot = (snapshot) => {
  const safeSnapshot = {
    equipmentList: Array.isArray(snapshot?.equipmentList) ? snapshot.equipmentList : [],
    labourList: Array.isArray(snapshot?.labourList) ? snapshot.labourList : [],
    bookings: Array.isArray(snapshot?.bookings) ? snapshot.bookings : [],
    chats: Array.isArray(snapshot?.chats) ? snapshot.chats : [],
    savedAt: snapshot?.savedAt || Date.now()
  };

  const hasAnyData = safeSnapshot.equipmentList.length || safeSnapshot.labourList.length || safeSnapshot.bookings.length || safeSnapshot.chats.length;
  return hasAnyData ? safeSnapshot : null;
};

export const AppProvider = ({ children }) => {
  // 1. Multilingual Support
  const [lang, setLang] = useState(() => localStorage.getItem('krushijod_lang') || 'en');
  const t = translations[lang] || translations.en;

  // 2. User Role & Auth
  const [userRole, setUserRole] = useState(() => localStorage.getItem('krushijod_role') || 'Farmer');
  const [isAdminAccessGranted, setIsAdminAccessGranted] = useState(() => localStorage.getItem('krushijod_admin_access') === 'true');
  const [userProfile, setUserProfile] = useState({
    name: "Ramrao Patil",
    phone: "+91 98221 44556",
    location: "Kopargaon, Nashik",
    role: "Farmer"
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDataBlackoutActive, setIsDataBlackoutActive] = useState(() => localStorage.getItem(DATA_BLACKOUT_KEY) === 'true');
  const [recoveryStatus, setRecoveryStatus] = useState(() => localStorage.getItem(RECOVERY_STATUS_KEY) || 'NORMAL');

  const getCurrentDataSnapshot = () => ({
    equipmentList: JSON.parse(localStorage.getItem('krushijod_equipment') || JSON.stringify(mockEquipment)),
    labourList: JSON.parse(localStorage.getItem('krushijod_labour') || JSON.stringify(mockLabour)),
    bookings: JSON.parse(localStorage.getItem('krushijod_bookings') || JSON.stringify(mockBookings)),
    chats: JSON.parse(localStorage.getItem('krushijod_chats') || JSON.stringify(mockChats)),
    savedAt: Date.now()
  });

  const hydrateBlackoutStateFromDb = async () => {
    const blackoutState = await loadBlackoutState();
    if (!blackoutState) return;

    const blackoutActive = Boolean(blackoutState.blackout_active);
    if (blackoutActive) {
      const savedSnapshot = blackoutState.snapshot_data || getCurrentDataSnapshot();
      setRecoverySnapshot(savedSnapshot);
      setIsDataBlackoutActive(true);
      setRecoveryStatus('BLACKOUT');
      setIsRecoveryDataActive(true);
      localStorage.setItem(DATA_BLACKOUT_KEY, 'true');
      localStorage.setItem(RECOVERY_STATUS_KEY, 'BLACKOUT');
      if (Array.isArray(savedSnapshot.equipmentList)) {
        localStorage.setItem('krushijod_equipment', JSON.stringify(savedSnapshot.equipmentList));
      }
      if (Array.isArray(savedSnapshot.labourList)) {
        localStorage.setItem('krushijod_labour', JSON.stringify(savedSnapshot.labourList));
      }
      if (Array.isArray(savedSnapshot.bookings)) {
        localStorage.setItem('krushijod_bookings', JSON.stringify(savedSnapshot.bookings));
      }
      if (Array.isArray(savedSnapshot.chats)) {
        localStorage.setItem('krushijod_chats', JSON.stringify(savedSnapshot.chats));
      }
      return;
    }

    setIsDataBlackoutActive(false);
    setRecoveryStatus('NORMAL');
    setIsRecoveryDataActive(false);
    localStorage.setItem(DATA_BLACKOUT_KEY, 'false');
    localStorage.setItem(RECOVERY_STATUS_KEY, 'NORMAL');
  };

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      const blackoutState = await loadBlackoutState();
      if (!isMounted || !blackoutState) return;

      const blackoutActive = Boolean(blackoutState.blackout_active);
      const snapshot = blackoutState.snapshot_data || getCurrentDataSnapshot();

      if (blackoutActive) {
        setRecoverySnapshot(snapshot);
        setIsDataBlackoutActive(true);
        setRecoveryStatus('BLACKOUT');
        setIsRecoveryDataActive(true);
      } else {
        setIsDataBlackoutActive(false);
        setRecoveryStatus('NORMAL');
        setIsRecoveryDataActive(false);
      }
    };

    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);
  const [pendingSyncItems, setPendingSyncItems] = useState(() => readLocalJson(RECOVERY_OUTBOX_KEY, []));
  const [recoverySnapshot, setRecoverySnapshot] = useState(() => {
    const snapshot = readLocalJson(RECOVERY_SNAPSHOT_KEY, null);
    return createValidRecoverySnapshot(snapshot || getDefaultRecoverySnapshot()) || getDefaultRecoverySnapshot();
  });
  const [isRecoveryDataActive, setIsRecoveryDataActive] = useState(false);
  const [syncInFlight, setSyncInFlight] = useState(false);

  // 3. Navigation State
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedEquipmentDetail, setSelectedEquipmentDetail] = useState(null);

  // 4. Market & Data State
  const [equipmentList, setEquipmentList] = useState(() => {
    const saved = localStorage.getItem('krushijod_equipment');
    return saved ? JSON.parse(saved) : mockEquipment;
  });

  const [labourList, setLabourList] = useState(() => {
    const saved = localStorage.getItem('krushijod_labour');
    return saved ? JSON.parse(saved) : mockLabour;
  });

  const [dealerList] = useState(mockNewDealers);

  // 5. Equipment Comparison List (Max 2 items)
  const [compareList, setCompareList] = useState([]);

  // 6. Bookings
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('krushijod_bookings');
    return saved ? JSON.parse(saved) : mockBookings;
  });

  // 7. Chats
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('krushijod_chats');
    return saved ? JSON.parse(saved) : mockChats;
  });
  const [activeChatId, setActiveChatId] = useState("chat-1");

  const visibleEquipmentList = isDataBlackoutActive ? (recoverySnapshot?.equipmentList || equipmentList) : equipmentList;
  const visibleLabourList = isDataBlackoutActive ? (recoverySnapshot?.labourList || labourList) : labourList;
  const visibleBookings = isDataBlackoutActive ? (recoverySnapshot?.bookings || bookings) : bookings;
  const visibleChats = isDataBlackoutActive ? (recoverySnapshot?.chats || chats) : chats;

  // 8. Razorpay Payment Modal State
  const [paymentState, setPaymentState] = useState({
    isOpen: false,
    itemTitle: '',
    amount: 0,
    bookingId: null,
    onSuccessCallback: null
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('krushijod_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('krushijod_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('krushijod_admin_access', String(Boolean(isAdminAccessGranted)));
  }, [isAdminAccessGranted]);

  useEffect(() => {
    localStorage.setItem(DATA_BLACKOUT_KEY, String(Boolean(isDataBlackoutActive)));
  }, [isDataBlackoutActive]);

  useEffect(() => {
    localStorage.setItem(RECOVERY_STATUS_KEY, recoveryStatus);
  }, [recoveryStatus]);

  useEffect(() => {
    localStorage.setItem(RECOVERY_OUTBOX_KEY, JSON.stringify(pendingSyncItems));
  }, [pendingSyncItems]);

  useEffect(() => {
    localStorage.setItem('krushijod_equipment', JSON.stringify(equipmentList));
  }, [equipmentList]);

  useEffect(() => {
    localStorage.setItem('krushijod_labour', JSON.stringify(labourList));
  }, [labourList]);

  useEffect(() => {
    localStorage.setItem('krushijod_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('krushijod_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    const latestSnapshot = createValidRecoverySnapshot({ equipmentList, labourList, bookings, chats, savedAt: Date.now() });
    if (!latestSnapshot) return;

    const snapshotToPersist = isDataBlackoutActive
      ? (recoverySnapshot && recoverySnapshot.savedAt > latestSnapshot.savedAt ? recoverySnapshot : latestSnapshot)
      : latestSnapshot;

    setRecoverySnapshot(prev => {
      if (isDataBlackoutActive) {
        return prev && prev.savedAt > latestSnapshot.savedAt ? prev : latestSnapshot;
      }
      return latestSnapshot;
    });

    localStorage.setItem(RECOVERY_SNAPSHOT_KEY, JSON.stringify(snapshotToPersist));
  }, [equipmentList, labourList, bookings, chats, isDataBlackoutActive]);

  useEffect(() => {
    const handleOffline = () => {
      const snapshot = createValidRecoverySnapshot({
        equipmentList,
        labourList,
        bookings,
        chats,
        savedAt: Date.now()
      }) || recoverySnapshot || getDefaultRecoverySnapshot();

      setRecoverySnapshot(snapshot);
      setIsRecoveryDataActive(true);
      setIsDataBlackoutActive(true);
      setRecoveryStatus('BLACKOUT');
      saveBlackoutState(true, snapshot);
    };

    const handleOnline = () => {
      const snapshot = createValidRecoverySnapshot({
        equipmentList,
        labourList,
        bookings,
        chats,
        savedAt: Date.now()
      }) || recoverySnapshot || getDefaultRecoverySnapshot();

      setRecoveryStatus('RESTORING');
      setIsDataBlackoutActive(false);
      setIsRecoveryDataActive(false);
      setRecoverySnapshot(snapshot);
      saveBlackoutState(false, snapshot);
      window.setTimeout(() => setRecoveryStatus('NORMAL'), 800);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [equipmentList, labourList, bookings, chats, recoverySnapshot]);

  // Actions
  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
    }
  };

  const switchRole = (newRole) => {
    setUserRole(newRole);
    setIsAdminAccessGranted(false);
    if (newRole === 'Farmer') {
      setUserProfile({ name: "Ramrao Patil", phone: "+91 98221 44556", location: "Kopargaon, Nashik", role: "Farmer" });
      setActiveTab('dashboard');
    } else if (newRole === 'Labour') {
      setUserProfile({ name: "Suresh Shinde", phone: "+91 98812 34567", location: "Kopargaon", role: "Labourer" });
      setActiveTab('labour-dashboard');
    } else if (newRole === 'EquipmentHolder') {
      setUserProfile({ name: "Vijay Pawar", phone: "+91 98220 12345", location: "Nashik", role: "Equipment Holder" });
      setActiveTab('holder-dashboard');
    } else if (newRole === 'Dealer') {
      setUserProfile({ name: "Shree Krushi Dealer", phone: "+91 98221 99001", location: "Ahmednagar", role: "Dealer" });
      setActiveTab('dealer');
    }
    setIsLoginModalOpen(false);
  };

  const logoutAdmin = () => {
    setIsAdminAccessGranted(false);
    setIsLoginModalOpen(false);
    setActiveTab('landing');
    setRecoveryStatus('NORMAL');
  };

  const validateAdminPassword = (enteredPassword) => {
    const trimmedPassword = String(enteredPassword ?? '').trim();
    const isValid = trimmedPassword === 'Sanskriti 2149';
    setIsAdminAccessGranted(isValid);
    return isValid;
  };

  const queuePendingSync = (actionType, payload) => {
    const item = {
      id: `${actionType}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      actionType,
      payload,
      createdAt: new Date().toISOString(),
      status: 'Pending Sync'
    };
    setPendingSyncItems(prev => [item, ...prev]);
    return item;
  };

  const restoreDataStore = async () => {
    if (syncInFlight) return;
    setSyncInFlight(true);
    setRecoveryStatus('RESTORING');

    const backupRecord = await readBlackoutBackup();
    const backupSnapshot = backupRecord?.snapshot || backupRecord || recoverySnapshot || getCurrentDataSnapshot();
    const backupId = backupRecord?.id || backupRecord?.backup_id || null;

    try {
      if (backupId) {
        await restoreDisasterRecoverySequence(backupId);
      } else {
        const restoreSuccess = await restoreBlackoutDatabaseData(backupSnapshot);
        await saveBlackoutState(false, backupSnapshot);
        if (!restoreSuccess) {
          throw new Error('Restore verification failed');
        }
      }

      setEquipmentList(Array.isArray(backupSnapshot.equipmentList) ? backupSnapshot.equipmentList : []);
      setLabourList(Array.isArray(backupSnapshot.labourList) ? backupSnapshot.labourList : []);
      setBookings(Array.isArray(backupSnapshot.bookings) ? backupSnapshot.bookings : []);
      setChats(Array.isArray(backupSnapshot.chats) ? backupSnapshot.chats : []);

      localStorage.setItem('krushijod_equipment', JSON.stringify(Array.isArray(backupSnapshot.equipmentList) ? backupSnapshot.equipmentList : []));
      localStorage.setItem('krushijod_labour', JSON.stringify(Array.isArray(backupSnapshot.labourList) ? backupSnapshot.labourList : []));
      localStorage.setItem('krushijod_bookings', JSON.stringify(Array.isArray(backupSnapshot.bookings) ? backupSnapshot.bookings : []));
      localStorage.setItem('krushijod_chats', JSON.stringify(Array.isArray(backupSnapshot.chats) ? backupSnapshot.chats : []));

      setRecoverySnapshot(backupSnapshot);
      setIsDataBlackoutActive(false);
      setIsRecoveryDataActive(false);
      setRecoveryStatus('RESTORED');
      localStorage.setItem(DATA_BLACKOUT_KEY, 'false');
      localStorage.setItem(RECOVERY_STATUS_KEY, 'RESTORED');
    } catch (error) {
      console.error('Restore failed:', error);
      setRecoveryStatus('RESTORE_PENDING');
      localStorage.setItem(RECOVERY_STATUS_KEY, 'RESTORE_PENDING');
    } finally {
      window.setTimeout(() => {
        setRecoveryStatus('NORMAL');
        localStorage.setItem(RECOVERY_STATUS_KEY, 'NORMAL');
        setSyncInFlight(false);
      }, 1200);
    }
  };

  const triggerDataBlackout = async () => {
    const currentSnapshot = await fetchAllBlackoutData();
    const backupSnapshot = {
      ...currentSnapshot,
      savedAt: Date.now()
    };

    try {
      const backupId = await createDisasterBackup(backupSnapshot, 'platform-blackout-backup');
      const verification = await runDisasterRecoverySequence(backupSnapshot, 'platform-blackout-backup');
      const finalBackupId = verification?.backupId || backupId;

      await saveBlackoutBackup({ ...backupSnapshot, backup_id: finalBackupId, backup_name: 'platform-blackout-backup' });
      await deleteBlackoutDatabaseData(backupSnapshot);

      setEquipmentList([]);
      setLabourList([]);
      setBookings([]);
      setChats([]);

      localStorage.setItem('krushijod_equipment', JSON.stringify([]));
      localStorage.setItem('krushijod_labour', JSON.stringify([]));
      localStorage.setItem('krushijod_bookings', JSON.stringify([]));
      localStorage.setItem('krushijod_chats', JSON.stringify([]));

      setRecoverySnapshot(backupSnapshot);
      setIsRecoveryDataActive(true);
      setIsDataBlackoutActive(true);
      setRecoveryStatus('BLACKOUT');

      await saveBlackoutState(true, { ...backupSnapshot, backup_id: finalBackupId, blackout_active: true, blackout_started_at: new Date().toISOString() });
      localStorage.setItem(DATA_BLACKOUT_KEY, 'true');
      localStorage.setItem(RECOVERY_STATUS_KEY, 'BLACKOUT');
      localStorage.setItem(RECOVERY_SNAPSHOT_KEY, JSON.stringify(backupSnapshot));
    } catch (error) {
      console.error('Disaster blackout failed:', error);
      setRecoveryStatus('BACKUP_FAILED');
      localStorage.setItem(RECOVERY_STATUS_KEY, 'BACKUP_FAILED');
      throw error;
    }
  };

  const simulateDataBlackout = async () => {
    await triggerDataBlackout();
  };

  const toggleCompare = (equipmentId) => {
    setCompareList(prev => {
      if (prev.includes(equipmentId)) {
        return prev.filter(id => id !== equipmentId);
      } else {
        if (prev.length >= 2) {
          alert("You can select a maximum of 2 machines for side-by-side comparison.");
          return [prev[1], equipmentId];
        }
        return [...prev, equipmentId];
      }
    });
  };

  const addBooking = (newBooking) => {
    const bookingObj = {
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newBooking,
      status: "Confirmed",
      paymentStatus: "Paid via Razorpay UPI"
    };

    if (isDataBlackoutActive) {
      queuePendingSync('booking', bookingObj);
      return bookingObj;
    }

    setBookings(prev => [bookingObj, ...prev]);
    return bookingObj;
  };

  const addEquipmentListing = (newEquip) => {
    const equipObj = {
      id: `eq-${Date.now()}`,
      availability: "Available",
      gallery: [newEquip.image],
      videoThumbnail: newEquip.image,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      currentLat: 20.005,
      currentLng: 73.78,
      ...newEquip
    };

    if (isDataBlackoutActive) {
      queuePendingSync('equipment', equipObj);
      return equipObj;
    }

    setEquipmentList(prev => [equipObj, ...prev]);
    return equipObj;
  };

  const updateLabourAvailability = (labourId, newStatus) => {
    setLabourList(prev => prev.map(l => l.id === labourId ? { ...l, availability: newStatus } : l));
  };

  const sendMessage = (chatId, text) => {
    if (!text.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChats(prev => prev.map(c => {
      if (c.chatId === chatId) {
        return {
          ...c,
          lastMsg: text,
          time: timeStr,
          messages: [...c.messages, { sender: userRole, text, time: timeStr }]
        };
      }
      return c;
    }));
  };

  const startChatWithUser = (peerName, peerPhone, peerRole) => {
    const existing = chats.find(c => c.peerPhone === peerPhone);
    if (existing) {
      setActiveChatId(existing.chatId);
    } else {
      const newChatId = `chat-${Date.now()}`;
      const newChat = {
        chatId: newChatId,
        peerName,
        peerPhone,
        peerRole,
        lastMsg: "Connected via Krushiजोड profile",
        time: "Just now",
        messages: [
          { sender: "System", text: `Chat started with ${peerName} (${peerPhone})`, time: "Just now" }
        ]
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChatId);
    }
    setActiveTab('chat');
  };

  const openPaymentModal = (itemTitle, amount, bookingDetails = null, onSuccessCallback = null) => {
    setPaymentState({
      isOpen: true,
      itemTitle,
      amount,
      bookingDetails,
      onSuccessCallback
    });
  };

  const closePaymentModal = () => {
    setPaymentState({ isOpen: false, itemTitle: '', amount: 0, bookingDetails: null, onSuccessCallback: null });
  };

  return (
    <AppContext.Provider value={{
      lang,
      changeLanguage,
      t,
      userRole,
      switchRole,
      logoutAdmin,
      validateAdminPassword,
      isAdminAccessGranted,
      userProfile,
      isLoginModalOpen,
      setIsLoginModalOpen,
      isDataBlackoutActive,
      recoveryStatus,
      pendingSyncItems,
      isRecoveryDataActive,
      simulateDataBlackout,
      restoreDataStore,
      activeTab,
      setActiveTab,
      selectedEquipmentDetail,
      setSelectedEquipmentDetail,
      equipmentList: visibleEquipmentList,
      labourList: visibleLabourList,
      dealerList,
      compareList,
      toggleCompare,
      bookings: visibleBookings,
      addBooking,
      addEquipmentListing,
      updateLabourAvailability,
      chats: visibleChats,
      activeChatId,
      setActiveChatId,
      sendMessage,
      startChatWithUser,
      paymentState,
      openPaymentModal,
      closePaymentModal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
