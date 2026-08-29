-- Disaster recovery tables and RPC functions for Supabase PostgreSQL
-- Runs against the existing Krushiजोड schema and preserves exact primary keys / relationships.

CREATE TABLE IF NOT EXISTS disaster_backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    backup_name TEXT NOT NULL,
    snapshot JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed', 'restored')),
    checksum TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    restored_at TIMESTAMPTZ,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS system_state (
    id TEXT PRIMARY KEY DEFAULT 'platform',
    blackout_active BOOLEAN NOT NULL DEFAULT FALSE,
    backup_id UUID REFERENCES disaster_backups(id) ON DELETE SET NULL,
    backup_created_at TIMESTAMPTZ,
    blackout_started_at TIMESTAMPTZ,
    blackout_ended_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (id = 'platform')
);

ALTER TABLE disaster_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_state ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM profiles p
        WHERE p.id = auth.uid()
          AND p.role = 'Admin'
    );
$$;

CREATE POLICY "Admins can manage disaster backups"
ON disaster_backups
FOR ALL
USING (is_admin_user())
WITH CHECK (is_admin_user());

CREATE POLICY "Admins can manage system state"
ON system_state
FOR ALL
USING (is_admin_user())
WITH CHECK (is_admin_user());

INSERT INTO system_state (id, blackout_active, backup_id, updated_at)
VALUES ('platform', FALSE, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION create_disaster_backup(
    p_snapshot JSONB,
    p_backup_name TEXT DEFAULT 'manual-backup'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_backup_id UUID;
    v_snapshot JSONB;
    v_checksum TEXT;
BEGIN
    IF NOT is_admin_user() THEN
        RAISE EXCEPTION 'Admin access required to create disaster backups';
    END IF;

    IF p_snapshot IS NULL OR jsonb_typeof(p_snapshot) <> 'object' THEN
        RAISE EXCEPTION 'Disaster backup snapshot must be a JSON object';
    END IF;

    v_snapshot := p_snapshot;
    v_checksum := md5(v_snapshot::text);

    INSERT INTO disaster_backups (backup_name, snapshot, checksum, created_by, status, created_at)
    VALUES (COALESCE(p_backup_name, 'manual-backup'), v_snapshot, v_checksum, auth.uid(), 'pending', NOW())
    RETURNING id INTO v_backup_id;

    RETURN v_backup_id;
END;
$$;

CREATE OR REPLACE FUNCTION verify_disaster_backup(p_backup_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_backup disaster_backups%ROWTYPE;
    v_checksum TEXT;
BEGIN
    IF NOT is_admin_user() THEN
        RAISE EXCEPTION 'Admin access required to verify disaster backups';
    END IF;

    SELECT * INTO v_backup
    FROM disaster_backups
    WHERE id = p_backup_id;

    IF v_backup.id IS NULL THEN
        RAISE EXCEPTION 'Backup % not found', p_backup_id;
    END IF;

    IF v_backup.snapshot IS NULL OR jsonb_typeof(v_backup.snapshot) <> 'object' THEN
        RAISE EXCEPTION 'Backup % snapshot is invalid', p_backup_id;
    END IF;

    v_checksum := md5(v_backup.snapshot::text);

    UPDATE disaster_backups
    SET status = 'verified', checksum = v_checksum, verified_at = NOW(), notes = COALESCE(notes, 'Backup integrity verified')
    WHERE id = p_backup_id;

    UPDATE system_state
    SET backup_id = p_backup_id,
        backup_created_at = NOW(),
        updated_at = NOW()
    WHERE id = 'platform';

    RETURN jsonb_build_object(
        'verified', TRUE,
        'backup_id', p_backup_id,
        'status', 'verified',
        'checksum', v_checksum,
        'verified_at', NOW()
    );
END;
$$;

CREATE OR REPLACE FUNCTION wipe_and_blackout(
    p_backup_id UUID,
    p_wipe_tables TEXT[] DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_backup disaster_backups%ROWTYPE;
    v_tables TEXT[];
    v_table_name TEXT;
    v_deleted_tables TEXT[] := ARRAY[]::TEXT[];
    v_started_at TIMESTAMPTZ := NOW();
BEGIN
    IF NOT is_admin_user() THEN
        RAISE EXCEPTION 'Admin access required to wipe platform data';
    END IF;

    SELECT * INTO v_backup
    FROM disaster_backups
    WHERE id = p_backup_id;

    IF v_backup.id IS NULL THEN
        RAISE EXCEPTION 'Backup % not found', p_backup_id;
    END IF;

    IF v_backup.status <> 'verified' THEN
        RAISE EXCEPTION 'Backup % must be verified before wipe', p_backup_id;
    END IF;

    v_tables := COALESCE(
        p_wipe_tables,
        ARRAY[
            'equipment_maintenance',
            'dealer_products',
            'reviews',
            'payments',
            'messages',
            'conversations',
            'verification_requests',
            'activity_history',
            'bookings',
            'equipment',
            'farmers',
            'labourers',
            'equipment_owners',
            'dealers'
        ]
    );

    BEGIN
        FOREACH v_table_name IN ARRAY v_tables
        LOOP
            IF to_regclass(v_table_name) IS NOT NULL THEN
                EXECUTE format('DELETE FROM %I', v_table_name);
                v_deleted_tables := array_append(v_deleted_tables, v_table_name);
            END IF;
        END LOOP;

        INSERT INTO system_state (id, blackout_active, backup_id, backup_created_at, blackout_started_at, updated_at)
        VALUES ('platform', TRUE, p_backup_id, v_backup.created_at, v_started_at, NOW())
        ON CONFLICT (id) DO UPDATE SET
            blackout_active = TRUE,
            backup_id = EXCLUDED.backup_id,
            backup_created_at = EXCLUDED.backup_created_at,
            blackout_started_at = COALESCE(system_state.blackout_started_at, EXCLUDED.blackout_started_at),
            blackout_ended_at = NULL,
            updated_at = NOW();

        RETURN jsonb_build_object(
            'backup_id', p_backup_id,
            'blackout_active', TRUE,
            'wipe_tables', to_jsonb(v_deleted_tables),
            'started_at', v_started_at
        );
    EXCEPTION WHEN OTHERS THEN
        RAISE;
    END;
END;
$$;

CREATE OR REPLACE FUNCTION restore_disaster_backup(p_backup_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_backup disaster_backups%ROWTYPE;
    v_snapshot JSONB;
    v_table_name TEXT;
    v_tables TEXT[] := ARRAY[
        'profiles',
        'farmers',
        'labourers',
        'equipment_owners',
        'dealers',
        'labour_categories',
        'equipment',
        'equipment_maintenance',
        'dealer_products',
        'bookings',
        'payments',
        'conversations',
        'messages',
        'reviews',
        'activity_history',
        'verification_requests'
    ];
    v_restored_tables TEXT[] := ARRAY[]::TEXT[];
    v_restore_started TIMESTAMPTZ := NOW();
BEGIN
    IF NOT is_admin_user() THEN
        RAISE EXCEPTION 'Admin access required to restore disaster backups';
    END IF;

    SELECT * INTO v_backup
    FROM disaster_backups
    WHERE id = p_backup_id;

    IF v_backup.id IS NULL THEN
        RAISE EXCEPTION 'Backup % not found', p_backup_id;
    END IF;

    v_snapshot := v_backup.snapshot;
    IF v_snapshot IS NULL OR jsonb_typeof(v_snapshot) <> 'object' THEN
        RAISE EXCEPTION 'Backup % snapshot is invalid', p_backup_id;
    END IF;

    BEGIN
        FOREACH v_table_name IN ARRAY v_tables
        LOOP
            IF jsonb_typeof(COALESCE(v_snapshot -> v_table_name, '[]'::jsonb)) = 'array' THEN
                EXECUTE format(
                    'DELETE FROM %I WHERE id IN (SELECT id FROM jsonb_to_recordset($1::jsonb) AS x(id UUID));',
                    v_table_name
                ) USING (v_snapshot -> v_table_name);

                EXECUTE format(
                    'INSERT INTO %I SELECT * FROM jsonb_populate_recordset(NULL::%s, $1::jsonb);',
                    v_table_name,
                    quote_ident(v_table_name)
                ) USING (v_snapshot -> v_table_name);

                v_restored_tables := array_append(v_restored_tables, v_table_name);
            END IF;
        END LOOP;

        UPDATE disaster_backups
        SET status = 'restored', restored_at = NOW(), notes = COALESCE(notes, 'Backup restored successfully')
        WHERE id = p_backup_id;

        INSERT INTO system_state (id, blackout_active, backup_id, blackout_ended_at, updated_at)
        VALUES ('platform', FALSE, p_backup_id, v_restore_started, NOW())
        ON CONFLICT (id) DO UPDATE SET
            blackout_active = FALSE,
            backup_id = EXCLUDED.backup_id,
            blackout_ended_at = COALESCE(system_state.blackout_ended_at, EXCLUDED.blackout_ended_at),
            updated_at = NOW();

        RETURN jsonb_build_object(
            'restored', TRUE,
            'backup_id', p_backup_id,
            'restored_tables', to_jsonb(v_restored_tables),
            'restored_at', NOW()
        );
    EXCEPTION WHEN OTHERS THEN
        RAISE;
    END;
END;
$$;

CREATE OR REPLACE FUNCTION restore_system_after_blackout(p_backup_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN restore_disaster_backup(p_backup_id);
END;
$$;
