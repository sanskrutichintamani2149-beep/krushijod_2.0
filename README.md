# Krushiजोड (Krushi Zod) – Complete Full-Stack Agricultural Platform

**Brand Name:** Krushi Zod / Krushiजोड  
**Concept:** Digital agricultural resource platform connecting farmers, agricultural labourers, equipment owners, and equipment dealers.

---

## 🌾 Project Overview

**Krushiजोड** is a production-structured agricultural technology platform designed to transform farm resource management across India. It connects four core participants through a unified digital ecosystem:

1. **Farmers**: Search and hire skilled farm labour, rent agricultural machinery, purchase new tractors/implements from authorized brand dealers, compare machinery side-by-side, estimate farm costs using AI, pay digitally via Razorpay, and maintain a permanent activity history timeline.
2. **Labourers**: Create skill profiles, set hourly/daily wage rates, toggle availability status, receive direct work requests, inspect **AI Wage Recommendations** (grounded against official minimum wage reference data), calculate earnings via the **AI Earnings Assistant**, and view permanent work history.
3. **Equipment Owners**: Register machinery with horsepower, RTO vehicle registration details, rental rates, and location. Track equipment maintenance logs, usage analytics, rental earnings, and broadcast GPS location.
4. **Equipment Dealers**: List brand-new machinery, display specifications and prices, receive farmer purchase inquiries, and manage buyer chat.
5. **Platform Admin**: Monitor platform health, GMV revenue, total user metrics, and process the **RTO Vehicle Verification Queue**.

---

## 🚀 Key Features

* **Multilingual i18n System**: Native support for **English**, **मराठी (Marathi)**, and **हिन्दी (Hindi)**.
* **3-Step Auth & Onboarding Flow**: Step 1 Language Selection → Step 2 User Role Selection → Step 3 Auth (Login, Sign Up, Password Recovery, Persistent Session).
* **Supabase Backend & PostgreSQL DB**: Relational database schema with Row Level Security (`supabase/migrations/20260819_init_schema.sql`), triggers, and seed data (`supabase/seed/seed_data.sql`).
* **Agricultural Activity History & Timeline**: Permanent database log tracking hired labour, rented equipment, dealer purchases, cancelled attempts, filterable by category and date.
* **Side-by-Side Equipment Comparison**: Evaluate 2+ machines across rental price, horsepower, RTO validity, maintenance log, condition, and distance.
* **RTO Vehicle Verification Workflow**: RC Book document upload, registration number verification, and admin approval status.
* **AI Wage Recommendation Engine**: AI calculation of fair market wage range based on category, location, and experience, clearly distinguished from official government minimum wage reference data.
* **AI Farm Cost Estimator**: Farm size + Crop + Task calculation engine for labour count and machinery rental budget.
* **Razorpay Payment Integration**: Order creation, checkout modal, signature verification structure, and transaction history.
* **Voice-to-Text & Text-to-Speech**: Web Speech API voice input for search/chat and 🔊 Listen button for reading aloud instructions.
* **Interactive Leaflet Maps**: Radius filtering, nearby provider markers, and last known location tracking for rented machinery.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, Vite, TypeScript, Lucide Icons, Canvas Confetti, Leaflet Maps
* **Backend & Database**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
* **Payments**: Razorpay Gateway Integration
* **AI & Automation**: Google Gemini API (`AI_API_KEY`), Apify Automation (`APIFY_API_TOKEN`)
* **Voice Features**: Browser Web Speech API (`webkitSpeechRecognition` & `speechSynthesis`)

---

## 🔑 Environment Variables (`.env`)

Copy `.env.example` to `.env` in the root directory:

```env
# 1. Supabase Integration
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here

# 2. Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourRazorpaySecretKeyHere

# 3. Google Maps Platform
MAPS_API_KEY=AIzaSyYourGoogleMapsApiKeyHere

# 4. AI API Key (Google Gemini API)
AI_API_KEY=AIzaSyYourGeminiApiKeyHere

# 5. Apify API Token
APIFY_API_TOKEN=apify_api_YourApifyTokenHere
```

---

## 🗄️ Supabase Setup & Database Migration

1. Create a project at [Supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Paste and execute the contents of `supabase/migrations/20260819_init_schema.sql`.
4. Run `supabase/seed/seed_data.sql` to populate initial categories and reference records.
5. Copy your **Supabase URL** and **Anon Key** to `.env`.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Production Build Test
npm run build

# Generate Complete Source ZIP
npm run zip
```

---

## 📦 Vercel Deployment

1. Push code to GitHub repository.
2. Import project into Vercel dashboard.
3. Set build command: `npm run build` and output directory: `dist`.
4. Add environment variables in Vercel project settings.
5. Deploy! `vercel.json` will automatically handle SPA client routing.
