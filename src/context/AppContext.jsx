import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
import { mockEquipment, mockLabour, mockNewDealers, mockChats, mockBookings } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Multilingual Support
  const [lang, setLang] = useState(() => localStorage.getItem('krushijod_lang') || 'en');
  const t = translations[lang] || translations.en;

  // 2. User Role & Auth
  const [userRole, setUserRole] = useState(() => localStorage.getItem('krushijod_role') || 'Farmer');
  const [userProfile, setUserProfile] = useState({
    name: "Ramrao Patil",
    phone: "+91 98221 44556",
    location: "Kopargaon, Nashik",
    role: "Farmer"
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

  // Actions
  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
    }
  };

  const switchRole = (newRole) => {
    setUserRole(newRole);
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
    setEquipmentList(prev => [equipObj, ...prev]);
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
      userProfile,
      isLoginModalOpen,
      setIsLoginModalOpen,
      activeTab,
      setActiveTab,
      selectedEquipmentDetail,
      setSelectedEquipmentDetail,
      equipmentList,
      labourList,
      dealerList,
      compareList,
      toggleCompare,
      bookings,
      addBooking,
      addEquipmentListing,
      updateLabourAvailability,
      chats,
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
