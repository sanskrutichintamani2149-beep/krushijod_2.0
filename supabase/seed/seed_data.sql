-- =====================================================================
-- KRUSHIजोड (Krushi Zod) - SUPABASE SEED DATA SCRIPT
-- Seed File: seed_data.sql
-- =====================================================================

-- Insert Labour Categories
INSERT INTO labour_categories (code, name_en, name_mr, name_hi, icon_name, avg_daily_wage_range) VALUES
('LAND_PREP', 'Land Preparation', 'जमीन तयार करणे', 'भूमि की तैयारी', 'Shovel', '₹400 - ₹600'),
('SOWING', 'Seed Sowing & Transplanting', 'पेरणी व लावणी', 'बीज बुआई व रोपाई', 'Sprout', '₹450 - ₹650'),
('WEEDING', 'Manual Weeding', 'खुरपणी व तण काढणे', 'निराई-गुड़ाई', 'Scissors', '₹350 - ₹500'),
('SPRAYING', 'Pesticide & Fertilizer Spraying', 'औषध फवारणी', 'कीटनाशक छिड़काव', 'Wind', '₹500 - ₹750'),
('HARVESTING', 'Harvesting & Threshing', 'कापणी व मळणी', 'कटाई व मड़ाई', 'Wheat', '₹500 - ₹800'),
('POST_HARVEST', 'Sorting, Packing & Loading', 'ग्रेडिंग, पॅकिंग व भरती', 'छंटाई व लोडिंग', 'Package', '₹400 - ₹600'),
('GENERAL', 'General Farm Maintenance', 'साधारण शेतकामे', 'सामान्य कृषि कार्य', 'UserCheck', '₹350 - ₹550')
ON CONFLICT (code) DO NOTHING;
