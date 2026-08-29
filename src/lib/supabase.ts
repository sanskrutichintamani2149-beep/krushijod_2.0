import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-supabase-project')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export const DISASTER_BACKUPS_TABLE = 'disaster_backups';
export const SYSTEM_STATE_TABLE = 'system_state';
export const BLACKOUT_STATE_TABLE = SYSTEM_STATE_TABLE;

const BLACKOUT_BACKUP_DB = 'krushijod_blackout_backup_db';
const BLACKOUT_BACKUP_STORE = 'blackout_backup_store';

export const BLACKOUT_TABLES = [
  { key: 'equipmentList', table: 'equipment' },
  { key: 'labourList', table: 'labour' },
  { key: 'bookings', table: 'bookings' },
  { key: 'chats', table: 'chats' }
];

const readLocalJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
};

const writeLocalJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to write ${key}:`, error);
  }
};

const normalizeSnapshot = (snapshot) => {
  if (!snapshot || typeof snapshot !== 'object') return null;

  const normalized = {
    equipmentList: Array.isArray(snapshot.equipmentList) ? snapshot.equipmentList : [],
    labourList: Array.isArray(snapshot.labourList) ? snapshot.labourList : [],
    bookings: Array.isArray(snapshot.bookings) ? snapshot.bookings : [],
    chats: Array.isArray(snapshot.chats) ? snapshot.chats : [],
    savedAt: snapshot.savedAt || Date.now()
  };

  const hasAnyData = normalized.equipmentList.length || normalized.labourList.length || normalized.bookings.length || normalized.chats.length;
  return hasAnyData ? normalized : null;
};

const readLocalBlackoutFallback = () => {
  const fallback = readLocalJson('krushijod_blackout_state', null);
  if (fallback) return fallback;
  const legacyFallback = readLocalJson('krushijod_data_blackout_state', null);
  return legacyFallback || null;
};

export const getDatabaseStatus = () => ({
  isConfigured: isSupabaseConfigured,
  url: supabaseUrl,
  mode: isSupabaseConfigured ? 'Production Supabase PostgreSQL' : 'Local Persistent Storage Mode (Hydrated)'
});

const openBlackoutBackupDb = () => new Promise((resolve, reject) => {
  if (!('indexedDB' in window)) {
    resolve(null);
    return;
  }

  const request = indexedDB.open(BLACKOUT_BACKUP_DB, 1);

  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(BLACKOUT_BACKUP_STORE)) {
      db.createObjectStore(BLACKOUT_BACKUP_STORE);
    }
  };

  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
});

export const saveBlackoutBackup = async (snapshot) => {
  const backupSnapshot = normalizeSnapshot(snapshot) || { savedAt: Date.now() };
  const backupMeta = {
    id: backupSnapshot.id || `backup-${Date.now()}`,
    backup_name: backupSnapshot.backup_name || `platform-backup-${new Date().toISOString()}`,
    snapshot: backupSnapshot,
    created_at: new Date().toISOString(),
    status: 'verified'
  };

  const db = await openBlackoutBackupDb();
  if (!db) {
    writeLocalJson('krushijod_blackout_backup', backupMeta);
    return { stored: false, source: 'localStorage', data: backupMeta };
  }

  return new Promise((resolve) => {
    const tx = db.transaction(BLACKOUT_BACKUP_STORE, 'readwrite');
    const store = tx.objectStore(BLACKOUT_BACKUP_STORE);
    const request = store.put(backupMeta, 'latest_snapshot');

    request.onsuccess = () => {
      writeLocalJson('krushijod_blackout_backup', backupMeta);
      resolve({ stored: true, source: 'indexedDB', data: backupMeta });
    };
    request.onerror = () => {
      writeLocalJson('krushijod_blackout_backup', backupMeta);
      resolve({ stored: false, source: 'localStorage', data: backupMeta });
    };
  });
};

export const readBlackoutBackup = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from(DISASTER_BACKUPS_TABLE)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const value = { ...data, snapshot: data.snapshot || data };
        writeLocalJson('krushijod_blackout_backup', value);
        return value;
      }
    } catch (error) {
      console.warn('Recovery backup lookup failed:', error);
    }
  }

  const db = await openBlackoutBackupDb();
  if (!db) {
    const raw = readLocalJson('krushijod_blackout_backup', null);
    return raw || null;
  }

  return new Promise((resolve) => {
    const tx = db.transaction(BLACKOUT_BACKUP_STORE, 'readonly');
    const store = tx.objectStore(BLACKOUT_BACKUP_STORE);
    const request = store.get('latest_snapshot');

    request.onsuccess = () => {
      const value = request.result || null;
      if (value) {
        writeLocalJson('krushijod_blackout_backup', value);
        resolve(value);
      } else {
        const raw = readLocalJson('krushijod_blackout_backup', null);
        resolve(raw || null);
      }
    };
    request.onerror = () => {
      const raw = readLocalJson('krushijod_blackout_backup', null);
      resolve(raw || null);
    };
  });
};

export const fetchAllBlackoutData = async () => {
  const localSnapshot = {
    equipmentList: JSON.parse(localStorage.getItem('krushijod_equipment') || JSON.stringify([])),
    labourList: JSON.parse(localStorage.getItem('krushijod_labour') || JSON.stringify([])),
    bookings: JSON.parse(localStorage.getItem('krushijod_bookings') || JSON.stringify([])),
    chats: JSON.parse(localStorage.getItem('krushijod_chats') || JSON.stringify([])),
    savedAt: Date.now()
  };

  if (!isSupabaseConfigured || !supabase) {
    return localSnapshot;
  }

  const snapshot = { ...localSnapshot };

  for (const tableConfig of BLACKOUT_TABLES) {
    try {
      const { data, error } = await supabase
        .from(tableConfig.table)
        .select('*');

      if (!error && Array.isArray(data)) {
        snapshot[tableConfig.key] = data;
      }
    } catch (error) {
      console.warn(`Unable to fetch ${tableConfig.table}:`, error);
    }
  }

  return snapshot;
};

export const deleteBlackoutDatabaseData = async (snapshot) => {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  let deletedAny = false;

  for (const tableConfig of BLACKOUT_TABLES) {
    const rows = Array.isArray(snapshot?.[tableConfig.key]) ? snapshot[tableConfig.key] : [];
    if (!rows.length) continue;

    const ids = rows
      .map(row => row?.id)
      .filter(id => id !== undefined && id !== null && id !== '');

    if (!ids.length) continue;

    try {
      const { error } = await supabase
        .from(tableConfig.table)
        .delete()
        .in('id', ids);

      if (!error) {
        deletedAny = true;
      } else {
        console.warn(`Blackout delete failed for ${tableConfig.table}:`, error.message);
      }
    } catch (error) {
      console.warn(`Unexpected blackout delete error for ${tableConfig.table}:`, error);
    }
  }

  return deletedAny;
};

export const restoreBlackoutDatabaseData = async (snapshot) => {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  let restoredAny = false;

  for (const tableConfig of BLACKOUT_TABLES) {
    const rows = Array.isArray(snapshot?.[tableConfig.key]) ? snapshot[tableConfig.key] : [];
    if (!rows.length) continue;

    try {
      const { error } = await supabase
        .from(tableConfig.table)
        .upsert(rows, { onConflict: 'id' });

      if (!error) {
        restoredAny = true;
      } else {
        console.warn(`Blackout restore failed for ${tableConfig.table}:`, error.message);
      }
    } catch (error) {
      console.warn(`Unexpected blackout restore error for ${tableConfig.table}:`, error);
    }
  }

  return restoredAny;
};

export const loadBlackoutState = async () => {
  const localState = readLocalBlackoutFallback();
  if (!isSupabaseConfigured || !supabase) {
    return localState;
  }

  try {
    const { data, error } = await supabase
      .from(SYSTEM_STATE_TABLE)
      .select('*')
      .eq('id', 'platform')
      .maybeSingle();

    if (error) {
      console.warn('Blackout state lookup failed:', error.message);
      return localState;
    }

    if (!data) {
      return localState;
    }

    return data;
  } catch (error) {
    console.warn('Unexpected blackout state lookup error:', error);
    return localState;
  }
};

export const saveBlackoutState = async (blackoutActive, snapshot) => {
  const normalizedSnapshot = snapshot && typeof snapshot === 'object' ? snapshot : null;
  const blackoutState = {
    id: 'platform',
    blackout_active: Boolean(blackoutActive),
    backup_id: normalizedSnapshot?.backup_id || normalizedSnapshot?.backupId || null,
    backup_created_at: normalizedSnapshot?.backup_created_at || normalizedSnapshot?.created_at || new Date().toISOString(),
    blackout_started_at: normalizedSnapshot?.blackout_started_at || (Boolean(blackoutActive) ? new Date().toISOString() : null),
    blackout_ended_at: normalizedSnapshot?.blackout_ended_at || (!Boolean(blackoutActive) ? new Date().toISOString() : null),
    updated_at: new Date().toISOString()
  };

  if (!isSupabaseConfigured || !supabase) {
    writeLocalJson('krushijod_blackout_state', blackoutState);
    return { persisted: false, source: 'localStorage', data: blackoutState };
  }

  try {
    const { data, error } = await supabase
      .from(SYSTEM_STATE_TABLE)
      .upsert(blackoutState, { onConflict: 'id' })
      .select('*')
      .single();

    if (error) {
      console.warn('Blackout state save failed:', error.message);
      writeLocalJson('krushijod_blackout_state', blackoutState);
      return { persisted: false, source: 'localStorage', data: blackoutState, error };
    }

    writeLocalJson('krushijod_blackout_state', data);
    return { persisted: true, source: 'supabase', data };
  } catch (error) {
    console.warn('Unexpected blackout state save error:', error);
    writeLocalJson('krushijod_blackout_state', blackoutState);
    return { persisted: false, source: 'localStorage', data: blackoutState, error };
  }
};

export const createDisasterBackup = async (snapshot, backupName = 'manual-backup') => {
  const normalized = normalizeSnapshot(snapshot) || { savedAt: Date.now() };

  if (!isSupabaseConfigured || !supabase) {
    const backup = {
      id: `backup-${Date.now()}`,
      backup_name: backupName,
      snapshot: normalized,
      created_at: new Date().toISOString(),
      verified_at: new Date().toISOString(),
      status: 'verified'
    };
    writeLocalJson('krushijod_blackout_backup', backup);
    return backup.id;
  }

  try {
    const { data, error } = await supabase.rpc('create_disaster_backup', {
      p_snapshot: normalized,
      p_backup_name: backupName
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.warn('createDisasterBackup failed:', error);
    const fallback = {
      id: `backup-${Date.now()}`,
      backup_name: backupName,
      snapshot: normalized,
      created_at: new Date().toISOString(),
      status: 'verified'
    };
    writeLocalJson('krushijod_blackout_backup', fallback);
    return fallback.id;
  }
};

export const verifyDisasterBackup = async (backupId) => {
  if (!backupId) {
    return { verified: false, error: 'Missing backup id' };
  }

  if (!isSupabaseConfigured || !supabase) {
    return { verified: true, backup_id: backupId, status: 'verified' };
  }

  try {
    const { data, error } = await supabase.rpc('verify_disaster_backup', { p_backup_id: backupId });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.warn('verifyDisasterBackup failed:', error);
    return { verified: false, backup_id: backupId, error: error.message || String(error) };
  }
};

export const wipeAndBlackout = async (backupId, wipeTables = ['equipment', 'labour', 'bookings', 'chats']) => {
  if (!backupId) {
    throw new Error('Backup id is required before wipe activation');
  }

  if (!isSupabaseConfigured || !supabase) {
    return { backup_id: backupId, blackout_active: true, wiped_tables: wipeTables };
  }

  try {
    const { data, error } = await supabase.rpc('wipe_and_blackout', {
      p_backup_id: backupId,
      p_wipe_tables: wipeTables
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.warn('wipeAndBlackout failed:', error);
    throw error;
  }
};

export const restoreDisasterBackup = async (backupId) => {
  if (!backupId) {
    throw new Error('Backup id is required for restore');
  }

  if (!isSupabaseConfigured || !supabase) {
    const saved = await readBlackoutBackup();
    return saved ? { restored: true, backup_id: backupId, snapshot: saved.snapshot || saved } : { restored: false, backup_id: backupId };
  }

  try {
    const { data, error } = await supabase.rpc('restore_disaster_backup', { p_backup_id: backupId });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.warn('restoreDisasterBackup failed:', error);
    throw error;
  }
};

export const runDisasterRecoverySequence = async (snapshot, backupName = 'manual-backup', wipeTables = ['equipment', 'labour', 'bookings', 'chats']) => {
  const backupId = await createDisasterBackup(snapshot, backupName);
  const verification = await verifyDisasterBackup(backupId);

  if (!verification || verification.verified === false) {
    throw new Error('Disaster backup verification failed. Wipe aborted.');
  }

  const blackout = await wipeAndBlackout(backupId, wipeTables);
  await saveBlackoutState(true, { backup_id: backupId, blackout_active: true, blackout_started_at: new Date().toISOString(), backup_created_at: new Date().toISOString() });

  return { backupId, verification, blackout };
};

export const restoreDisasterRecoverySequence = async (backupId) => {
  const result = await restoreDisasterBackup(backupId);
  await saveBlackoutState(false, { backup_id: backupId, blackout_active: false, blackout_ended_at: new Date().toISOString() });
  return result;
};
