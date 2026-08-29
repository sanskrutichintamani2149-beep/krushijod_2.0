-- =====================================================================
-- KRUSHIजोड (Krushi Zod) - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Migration: 20260819_init_schema.sql
-- Description: Complete production schema for agricultural resource platform
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. USERS & PROFILES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Farmer', 'Labour', 'EquipmentOwner', 'Dealer', 'Admin')),
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'mr', 'hi')),
    avatar_url TEXT,
    location_address TEXT NOT NULL,
    village TEXT,
    taluka TEXT,
    district TEXT,
    state TEXT DEFAULT 'Maharashtra',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 2. FARMERS EXTENSION TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    farm_size_acres NUMERIC(8, 2) DEFAULT 0,
    farming_type TEXT DEFAULT 'Organic & Traditional', -- Irrigated, Rainfed, Polyhouse
    primary_crops TEXT[] DEFAULT '{}',
    irrigation_source TEXT
);

-- ---------------------------------------------------------------------
-- 3. LABOURERS EXTENSION TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS labourers (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    skills TEXT[] DEFAULT '{}',
    work_categories TEXT[] DEFAULT '{}',
    experience_years INT DEFAULT 1,
    hourly_rate NUMERIC(8, 2) DEFAULT 0,
    daily_rate NUMERIC(8, 2) DEFAULT 0,
    working_radius_km INT DEFAULT 15,
    availability_status TEXT DEFAULT 'Available' CHECK (availability_status IN ('Available', 'Busy', 'Unavailable')),
    rating_avg NUMERIC(3, 2) DEFAULT 4.8,
    rating_count INT DEFAULT 12
);

-- ---------------------------------------------------------------------
-- 4. EQUIPMENT OWNERS EXTENSION TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS equipment_owners (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    business_name TEXT,
    total_listings INT DEFAULT 0,
    rto_verified BOOLEAN DEFAULT FALSE
);

-- ---------------------------------------------------------------------
-- 5. EQUIPMENT DEALERS EXTENSION TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dealers (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    dealership_name TEXT NOT NULL,
    gst_number TEXT,
    authorized_brands TEXT[] DEFAULT '{}',
    rating_avg NUMERIC(3, 2) DEFAULT 4.9
);

-- ---------------------------------------------------------------------
-- 6. AGRICULTURAL LABOUR CATEGORIES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS labour_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_mr TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    icon_name TEXT DEFAULT 'Users',
    avg_daily_wage_range TEXT DEFAULT '₹400 - ₹700',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 7. EQUIPMENT LISTINGS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    equipment_type TEXT NOT NULL, -- Tractor, Harvester, Rotavator, Seed Drill, Sprayer
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year_of_mfg INT,
    horsepower INT,
    capacity_spec TEXT,
    daily_rent_price NUMERIC(10, 2) NOT NULL,
    hourly_rent_price NUMERIC(10, 2),
    location_name TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    availability_status TEXT DEFAULT 'Available' CHECK (availability_status IN ('Available', 'Rented', 'Maintenance')),
    condition TEXT DEFAULT 'Excellent',
    image_url TEXT,
    gallery TEXT[] DEFAULT '{}',
    video_url TEXT,
    
    -- RTO Registration Fields
    rto_reg_number TEXT,
    rto_office TEXT,
    rto_validity_date DATE,
    rto_verification_status TEXT DEFAULT 'Pending' CHECK (rto_verification_status IN ('Pending', 'Submitted', 'Verified', 'Failed')),
    
    -- Maintenance Summary
    last_service_date DATE,
    maintenance_summary TEXT,
    rating_avg NUMERIC(3, 2) DEFAULT 4.8,
    rating_count INT DEFAULT 8,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 8. EQUIPMENT MAINTENANCE LOGS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS equipment_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    service_date DATE NOT NULL,
    maintenance_type TEXT NOT NULL, -- Engine Oil Change, Blade Replacement, General Overhaul
    cost NUMERIC(10, 2) DEFAULT 0,
    service_provider TEXT,
    notes TEXT,
    next_service_due DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 9. DEALER NEW EQUIPMENT PRODUCTS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dealer_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    sale_price NUMERIC(12, 2) NOT NULL,
    horsepower INT,
    specifications JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    warranty_years INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 10. BOOKINGS TABLE (Labour & Equipment Rentals)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT UNIQUE NOT NULL,
    farmer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- Labourer or Equipment Owner
    booking_type TEXT NOT NULL CHECK (booking_type IN ('Labour', 'EquipmentRental', 'DealerPurchase')),
    target_id UUID, -- Reference to equipment or labour profile
    
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INT DEFAULT 1,
    location_address TEXT NOT NULL,
    
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'Requested' CHECK (status IN ('Requested', 'Pending', 'Accepted', 'Rejected', 'PaymentPending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled')),
    payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Refunded', 'Failed')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 11. PAYMENTS TABLE (Razorpay Verification Logs)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    farmer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT DEFAULT 'UPI',
    status TEXT DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'PENDING', 'FAILED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 12. CONVERSATIONS & CHAT MESSAGES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_1 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    participant_2 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 13. REVIEWS & RATINGS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 14. PERMANENT ACTIVITY HISTORY TIMELINE TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('Labour', 'Equipment', 'Purchases', 'Payments', 'Bookings', 'System')),
    title TEXT NOT NULL,
    description TEXT,
    amount NUMERIC(10, 2),
    status TEXT NOT NULL,
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 15. RTO VERIFICATION REQUESTS TABLE (Admin Oversight)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- RTO RC Book, Aadhaar, Driving License
    registration_number TEXT,
    document_url TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    admin_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public read access for listings & public profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Equipment listings are viewable by everyone" ON equipment FOR SELECT USING (true);
CREATE POLICY "Equipment owners can manage own machinery" ON equipment FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Users can view relevant bookings" ON bookings FOR SELECT USING (auth.uid() = farmer_id OR auth.uid() = provider_id);
CREATE POLICY "Farmers can insert bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = farmer_id);
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
    auth.uid() IN (SELECT sender_id FROM messages WHERE conversation_id = messages.conversation_id)
);
