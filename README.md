# GaonKaam (गाँवकाम) - Rural Employment & Village Commerce Portal

An accessible, bilingual web application designed specifically for rural villages (गाँव), connecting local daily wage workers, hirers/contractors, and village store managers. Built faithfully following the **GaonKaam** mobile UI specifications.

---

## 🌟 Key Features & Interface Flow

### 1. First Interface: Village Access Gate (Pincode / District & Block)
* **Pincode Lookup**: Enter any 6-digit Indian PIN (e.g., `231216`, `231217`, `221002`, `801108`, `303007`). Automatically identifies the District, Block, and Village.
* **District & Block Selector**: Cascading selection: **State ➔ District ➔ Block / Tehsil ➔ Village**.
* **Quick Demo Chips**: 1-click test buttons for *Sundarpur (Sonbhadra)*, *Kheda*, *Maner*, *Bagru*.
* **GPS Auto-Detection**: Instant geolocation to local village portal.

---

### 2. Second Interface: Role Gateway (PDF Page 1)
* **Namaste! Header**: Forest Green branding, active village location display with quick **Change** link.
* **Bilingual Switcher**: Instant toggle between **EN (English)** and **हिंदी (Hindi)** across all screens.
* **Three Primary User Paths**:
  1. **I want work (काम चाहिए)**: Daily wage, farm, building workers.
  2. **I want to hire (मज़दूर / कारीगर चाहिए)**: Hirers seeking masons, farm labour, electricians, etc.
  3. **Buy or sell goods (बाज़ार)**: Seeds, tools, dairy, fertilizers.
* **Speak Instead of Typing (बोलकर बताएं)**: Integrated voice assistant with Web Speech recognition & Hindi speech commands.
* **Log In With Phone**: Simulated quick phone OTP authentication.

---

### 3. Three Manual Profile Types (Specified Formats)

1. **Worker Profile (कामगार / कारीगर)**:
   * Full Name, Mobile Number, Primary Skill (Carpenter, Mason, Electrician, Plumber, Farm Labour, Driver, Painter, Welder, Tailor, Mechanic, Cook, Helper).
   * Years of Experience, Daily Wage Rate (₹ / day).
   * Bio, Work Radius, Availability Status (*Available today* or *Busy · free next week*), and Verified Badge.
   * **Result**: Instantly listed in the village category explorer and hire directory!

2. **Hirer Profile (काम देने वाले / मालिक)**:
   * Hirer Name, Contact Number, Village / Farm landmark.
   * Typical Work Needed (Farm harvesting, construction, repairs).
   * **Job Broadcast Tool**: "+ Post a job instead" allows posting jobs with worker count, wage, duration, and notes.

3. **Store Manager Profile (दुकानदार / बाज़ार विक्रेता)**:
   * Shop Name (e.g. *Sharma Beej Bhandar*, *Kisan Khad Kendra*, *Yadav Dairy*, *Lohar Tools*).
   * Store Category (Seeds & Fertilizer, Dairy, Tools & Hardware, Building Material, Grocery).
   * Phone / WhatsApp & Delivery options.
   * **Store Manager Interface (PDF Page 6)**: Dedicated product upload tool (*Sell a product*).

---

### 4. Screen-by-Screen Implementation Matching PDF

| Page | Screen Title | Key Features Implemented |
|---|---|---|
| **Page 1** | **GaonKaam Home Hub** | Namaste greeting, location pill with change link, 3 role cards, voice search button, phone login. |
| **Page 2** | **All Work (सभी काम)** | Search bar, 12 work category cards (C, M, E, P, F, D, P, W, T, M, C, H) with worker counters. |
| **Page 3** | **Category Workers List** | e.g. Carpenters (6 people), distance filters (*My village*, *10 km*, *50 km*, *Anywhere*), call button. |
| **Page 4** | **Hire Workers** | Verified by phone, "+ Post a job instead" banner, daily wage rate (₹700/day), *Hire* & *Profile* buttons. |
| **Page 5** | **Gaon Bazaar** | Live cart badge (2), distance filters (*In my village*, *Nearby*, *Outside*), 2-col product grid with certified seeds, fertilizers, milk, sickles. |
| **Page 6** | **Sell a Product** | Photo upload, product name, price & unit, stock available, who can buy radio options, delivery toggle, publish button. |

---

## 🚀 How to Run the Website

### Option 1: Direct in Browser
Double-click `run_app.bat` or simply open `index.html` in any web browser (Chrome, Edge, Firefox).

### Option 2: Local Python Web Server
Open a terminal in this directory and run:
```bash
python -m http.server 8080
```
Then visit: `http://localhost:8080` in your web browser.

---

## 📱 Responsive & Frame Modes
* Includes a top toggle **"🖥️ Switch to Wide View / 📱 Switch to Mobile View"** allowing you to review the app either in the authentic smartphone frame (mirroring the PDF mockups) or in a spacious responsive desktop view.
