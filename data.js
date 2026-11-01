/**
 * GaonKaam - Village Employment & Local Commerce Portal
 * Core Database, Visual Assets & Localization Dictionary
 */

// SVG Visual Assets for Rural Workers, Stores, Products, and Work Sites
const GAON_ASSETS = {
  // Realistic Rural Worker Avatars
  carpenterAvatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%23fef3c7"/><circle cx="60" cy="46" r="26" fill="%23d97706"/><path d="M38 34 Q60 18 82 34 Q86 42 78 44 Q60 28 42 44 Z" fill="%23b45309"/><circle cx="52" cy="45" r="3" fill="%23ffffff"/><circle cx="68" cy="45" r="3" fill="%23ffffff"/><path d="M50 56 Q60 64 70 56" stroke="%23ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M24 106 C24 82 40 76 60 76 C80 76 96 82 96 106 Z" fill="%231e3a8a"/><rect x="52" y="76" width="16" height="30" fill="%23f59e0b"/><path d="M82 66 L98 50 L104 56 L88 72 Z" fill="%2378350f"/><rect x="80" y="68" width="6" height="16" fill="%2394a3b8"/></svg>`,

  masonAvatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%23fee2e2"/><circle cx="60" cy="48" r="25" fill="%23ea580c"/><rect x="34" y="24" width="52" height="18" rx="8" fill="%23facc15"/><circle cx="52" cy="48" r="3" fill="%23ffffff"/><circle cx="68" cy="48" r="3" fill="%23ffffff"/><path d="M52 58 Q60 64 68 58" stroke="%23ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M25 106 C25 84 42 78 60 78 C78 78 95 84 95 106 Z" fill="%23dc2626"/><rect x="54" y="78" width="12" height="28" fill="%23ffffff"/><path d="M85 65 L98 75 L88 88 Z" fill="%2394a3b8"/></svg>`,

  farmLabourAvatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%23dcfce7"/><circle cx="60" cy="46" r="24" fill="%2316a34a"/><path d="M30 42 Q60 12 90 42 Q60 34 30 42 Z" fill="%23ca8a04"/><circle cx="52" cy="46" r="3" fill="%23ffffff"/><circle cx="68" cy="46" r="3" fill="%23ffffff"/><circle cx="60" cy="38" r="2" fill="%23dc2626"/><path d="M52 56 Q60 62 68 56" stroke="%23ffffff" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M26 106 C26 84 40 76 60 76 C80 76 94 84 94 106 Z" fill="%230284c7"/><circle cx="60" cy="90" r="4" fill="%23facc15"/></svg>`,

  electricianAvatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%23e0f2fe"/><circle cx="60" cy="48" r="25" fill="%230284c7"/><rect x="36" y="24" width="48" height="16" rx="6" fill="%230369a1"/><path d="M58 20 L66 20 L62 26 L68 26 L56 36 L58 28 L54 28 Z" fill="%23facc15"/><circle cx="52" cy="48" r="3" fill="%23ffffff"/><circle cx="68" cy="48" r="3" fill="%23ffffff"/><path d="M52 58 Q60 64 68 58" stroke="%23ffffff" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M26 106 C26 84 42 78 60 78 C78 78 94 84 94 106 Z" fill="%23334155"/></svg>`,

  storeAvatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%23fef9c3"/><rect x="18" y="30" width="84" height="65" rx="8" fill="%23166534"/><path d="M14 30 L60 12 L106 30 Z" fill="%2314532d"/><rect x="30" y="44" width="60" height="18" rx="4" fill="%23facc15"/><text x="60" y="57" font-size="9" font-family="sans-serif" font-weight="bold" fill="%2314532d" text-anchor="middle">KISAN STORE</text><rect x="44" y="66" width="32" height="29" fill="%23ca8a04"/><rect x="24" y="68" width="14" height="18" rx="2" fill="%23e2e8f0"/><rect x="82" y="68" width="14" height="18" rx="2" fill="%23e2e8f0"/></svg>`,

  hirerAvatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="%23f3e8ff"/><circle cx="60" cy="46" r="24" fill="%239333ea"/><path d="M38 32 Q60 20 82 32 Q86 38 78 40 Q60 28 42 40 Z" fill="%237e22ce"/><circle cx="52" cy="46" r="3" fill="%23ffffff"/><circle cx="68" cy="46" r="3" fill="%23ffffff"/><path d="M52 56 Q60 62 68 56" stroke="%23ffffff" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M26 106 C26 84 40 76 60 76 C80 76 94 84 94 106 Z" fill="%23581c87"/><circle cx="60" cy="88" r="4" fill="%23facc15"/></svg>`,

  // Product Photos
  wheatSeedPhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140"><rect width="180" height="140" fill="%23fef3c7"/><rect x="45" y="25" width="90" height="95" rx="14" fill="%23d97706"/><path d="M55 25 Q90 12 125 25 Z" fill="%23b45309"/><rect x="55" y="45" width="70" height="55" rx="6" fill="%23ffffff"/><text x="90" y="62" font-size="11" font-family="sans-serif" font-weight="bold" fill="%2392400e" text-anchor="middle">CERTIFIED</text><text x="90" y="78" font-size="13" font-family="sans-serif" font-weight="900" fill="%2315803d" text-anchor="middle">WHEAT SEED</text><text x="90" y="92" font-size="10" font-family="sans-serif" fill="%23451a03" text-anchor="middle">PBW-502 · 40 KG</text><circle cx="90" cy="35" r="4" fill="%23fef08a"/></svg>`,

  dapFertilizerPhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140"><rect width="180" height="140" fill="%23e0f2fe"/><rect x="46" y="24" width="88" height="96" rx="12" fill="%230284c7"/><rect x="54" y="42" width="72" height="60" rx="6" fill="%23ffffff"/><text x="90" y="62" font-size="14" font-family="sans-serif" font-weight="900" fill="%230369a1" text-anchor="middle">IFFCO DAP</text><text x="90" y="78" font-size="11" font-family="sans-serif" font-weight="bold" fill="%23dc2626" text-anchor="middle">18:46:0</text><text x="90" y="92" font-size="9" font-family="sans-serif" fill="%230f172a" text-anchor="middle">50 KG NETT</text><circle cx="90" cy="33" r="5" fill="%2338bdf8"/></svg>`,

  buffaloMilkPhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140"><rect width="180" height="140" fill="%23f1f5f9"/><rect x="60" y="32" width="60" height="85" rx="10" fill="%2394a3b8"/><rect x="70" y="18" width="40" height="18" rx="4" fill="%2364748b"/><path d="M50 42 Q90 28 130 42" stroke="%23475569" stroke-width="4" fill="none"/><rect x="66" y="55" width="48" height="45" rx="4" fill="%23ffffff"/><text x="90" y="74" font-size="11" font-family="sans-serif" font-weight="900" fill="%230f172a" text-anchor="middle">PURE</text><text x="90" y="88" font-size="10" font-family="sans-serif" font-weight="bold" fill="%230284c7" text-anchor="middle">MILK 7.5%</text></svg>`,

  steelSicklePhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140"><rect width="180" height="140" fill="%23fef2f2"/><path d="M40 90 Q30 25 110 25 Q145 25 150 48 Q115 38 65 65 Q50 75 58 95 Z" fill="%2364748b" stroke="%23334155" stroke-width="2"/><rect x="42" y="90" width="16" height="38" rx="4" transform="rotate(-15 42 90)" fill="%2378350f"/><circle cx="110" cy="32" r="3" fill="%23ffffff"/></svg>`,

  // Work Done Site Photos
  siteSchoolWallPhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="%23fef3c7"/><rect x="10" y="35" width="140" height="55" fill="%23b45309"/><line x1="10" y1="50" x2="150" y2="50" stroke="%23ffffff" stroke-width="2"/><line x1="10" y1="65" x2="150" y2="65" stroke="%23ffffff" stroke-width="2"/><line x1="10" y1="80" x2="150" y2="80" stroke="%23ffffff" stroke-width="2"/><line x1="35" y1="35" x2="35" y2="50" stroke="%23ffffff" stroke-width="2"/><line x1="75" y1="35" x2="75" y2="50" stroke="%23ffffff" stroke-width="2"/><line x1="115" y1="35" x2="115" y2="50" stroke="%23ffffff" stroke-width="2"/><line x1="55" y1="50" x2="55" y2="65" stroke="%23ffffff" stroke-width="2"/><line x1="95" y1="50" x2="95" y2="65" stroke="%23ffffff" stroke-width="2"/><line x1="35" y1="65" x2="35" y2="80" stroke="%23ffffff" stroke-width="2"/><line x1="75" y1="65" x2="75" y2="80" stroke="%23ffffff" stroke-width="2"/><rect x="60" y="15" width="40" height="20" fill="%23f59e0b"/><text x="80" y="29" font-size="8" font-weight="bold" fill="%23ffffff" text-anchor="middle">PRIMARY SCHOOL</text></svg>`,

  siteTempleDoorPhoto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="%23e2e8f0"/><rect x="40" y="15" width="80" height="80" rx="8" fill="%2378350f"/><rect x="46" y="22" width="32" height="68" fill="%2392400e"/><rect x="82" y="22" width="32" height="68" fill="%2392400e"/><circle cx="74" cy="55" r="3" fill="%23facc15"/><circle cx="86" cy="55" r="3" fill="%23facc15"/><path d="M52 35 Q62 28 72 35" stroke="%23facc15" stroke-width="1.5" fill="none"/><path d="M88 35 Q98 28 108 35" stroke="%23facc15" stroke-width="1.5" fill="none"/><path d="M40 15 Q80 2 120 15 Z" fill="%23b45309"/></svg>`
};

const GAON_DATA = {
  // Pre-loaded Indian Pincodes and Districts/Blocks/Villages
  locations: [
    {
      pincode: "231216",
      state: "Uttar Pradesh",
      district: "Sonbhadra",
      block: "Robertsganj",
      villages: ["Sundarpur", "Rajpura", "Nayagaon", "Kheda", "Rampur", "Block Town", "Ghurawal", "Pipri"]
    },
    {
      pincode: "231217",
      state: "Uttar Pradesh",
      district: "Sonbhadra",
      block: "Chopan",
      villages: ["Chopan Dehat", "Agori", "Kari", "Patwadh", "Kota"]
    },
    {
      pincode: "221002",
      state: "Uttar Pradesh",
      district: "Varanasi",
      block: "Harhua",
      villages: ["Kazi Sarai", "Shivpur Dehat", "Babatpur", "Birbhanpur", "Tarna"]
    },
    {
      pincode: "201301",
      state: "Uttar Pradesh",
      district: "Gautam Buddha Nagar",
      block: "Bisrakh",
      villages: ["Chhapraula", "Shahberi", "Patwari", "Haibatpur", "Bhangel"]
    },
    {
      pincode: "801108",
      state: "Bihar",
      district: "Patna",
      block: "Bihta",
      villages: ["Amhara", "Maner", "Daulatpur", "Raghopur", "Sikandarpur"]
    },
    {
      pincode: "842001",
      state: "Bihar",
      district: "Muzaffarpur",
      block: "Kanti",
      villages: ["Kanti Khas", "Damodarpur", "Madkar", "Bahuara", "Kolhua"]
    },
    {
      pincode: "303007",
      state: "Rajasthan",
      district: "Jaipur",
      block: "Sanganer",
      villages: ["Bagru", "Mahapura", "Bhankrota", "Neota", "Muhana"]
    },
    {
      pincode: "302028",
      state: "Rajasthan",
      district: "Jaipur",
      block: "Amber",
      villages: ["Kukas", "Achrol", "Chandwaji", "Bhatton Ki Gali", "Khora Meena"]
    },
    {
      pincode: "482001",
      state: "Madhya Pradesh",
      district: "Jabalpur",
      block: "Panagar",
      villages: ["Panagar Dehat", "Singod", "Badhaiya", "Umaria", "Nunsar"]
    },
    {
      pincode: "132001",
      state: "Haryana",
      district: "Karnal",
      block: "Gharaunda",
      villages: ["Kohand", "Bastara", "Kutail", "Chaura", "Arainpura"]
    }
  ],

  // 12 Types of Work from PDF Page 2
  workCategories: [
    { id: "carpenter", letter: "C", nameEn: "Carpenter", nameHi: "बढ़ई", count: 6, icon: "hammer" },
    { id: "mason", letter: "M", nameEn: "Mason", nameHi: "राजमिस्त्री", count: 3, icon: "brick-wall" },
    { id: "electrician", letter: "E", nameEn: "Electrician", nameHi: "बिजली मिस्त्री", count: 2, icon: "zap" },
    { id: "plumber", letter: "P", nameEn: "Plumber", nameHi: "नल मिस्त्री", count: 2, icon: "wrench" },
    { id: "farm_labour", letter: "F", nameEn: "Farm labour", nameHi: "खेत मज़दूर", count: 4, icon: "wheat" },
    { id: "driver", letter: "D", nameEn: "Driver", nameHi: "ड्राइवर", count: 2, icon: "truck" },
    { id: "painter", letter: "P", nameEn: "Painter", nameHi: "पेंटर", count: 1, icon: "paint-brush" },
    { id: "welder", letter: "W", nameEn: "Welder", nameHi: "वेल्डर", count: 1, icon: "flame" },
    { id: "tailor", letter: "T", nameEn: "Tailor", nameHi: "दर्ज़ी", count: 2, icon: "scissors" },
    { id: "mechanic", letter: "M", nameEn: "Mechanic", nameHi: "मैकेनिक", count: 1, icon: "cog" },
    { id: "cook", letter: "C", nameEn: "Cook", nameHi: "हलवाई", count: 1, icon: "utensils" },
    { id: "helper", letter: "H", nameEn: "Helper", nameHi: "मज़दूर", count: 2, icon: "user-check" }
  ],

  // Initial Seed Workers with Real Photos and Past Work Locations (कार्य स्थल)
  initialWorkers: [
    {
      id: "w-1",
      initials: "BL",
      name: "Bhola Lal",
      photo: GAON_ASSETS.carpenterAvatar,
      category: "carpenter",
      skillNameEn: "Carpenter",
      skillNameHi: "बढ़ई",
      experience: 15,
      rating: 4.8,
      jobsCompleted: 85,
      dailyRate: 750,
      phone: "+91 98765 12010",
      village: "Sundarpur",
      distanceKm: 0,
      status: "available",
      statusEn: "Available today",
      statusHi: "आज उपलब्ध",
      verified: true,
      bio: "Master woodworker, specialist in door framing, furniture, wooden ploughs, and roof beams.",
      workSites: [
        {
          siteName: "Sundarpur Gram Panchayat Hall",
          workType: "Teakwood Door Frames & Member Chairs",
          year: "2023",
          photo: GAON_ASSETS.siteTempleDoorPhoto
        },
        {
          siteName: "Robertsganj Main Temple",
          workType: "Mandap Carved Wooden Pillars",
          year: "2024",
          photo: GAON_ASSETS.siteTempleDoorPhoto
        },
        {
          siteName: "Rampur Sarpanch House",
          workType: "Roof Beams and Window Shuttering",
          year: "2022",
          photo: null
        }
      ]
    },
    {
      id: "w-2",
      initials: "MV",
      name: "Mohan Vishwakarma",
      photo: GAON_ASSETS.carpenterAvatar,
      category: "carpenter",
      skillNameEn: "Carpenter",
      skillNameHi: "बढ़ई",
      experience: 9,
      rating: 4.6,
      jobsCompleted: 52,
      dailyRate: 650,
      phone: "+91 97654 34182",
      village: "Sundarpur",
      distanceKm: 0,
      status: "available",
      statusEn: "Available today",
      statusHi: "आज उपलब्ध",
      verified: true,
      bio: "Expert in home woodwork, window frames, beds, cupboards, and repair.",
      workSites: [
        {
          siteName: "Sundarpur Health Center",
          workType: "Wooden Exam Tables & Cabinets",
          year: "2023",
          photo: null
        },
        {
          siteName: "Kheda Primary School",
          workType: "Classroom Benches (30 sets)",
          year: "2022",
          photo: null
        }
      ]
    },
    {
      id: "w-3",
      initials: "IA",
      name: "Imran Ansari",
      photo: GAON_ASSETS.carpenterAvatar,
      category: "carpenter",
      skillNameEn: "Carpenter",
      skillNameHi: "बढ़ई",
      experience: 11,
      rating: 4.7,
      jobsCompleted: 47,
      dailyRate: 700,
      phone: "+91 99345 77021",
      village: "Nayagaon",
      distanceKm: 6,
      status: "busy",
      statusEn: "Busy · free next week",
      statusHi: "व्यस्त · अगले हफ्ते खाली",
      verified: true,
      bio: "Specializes in decorative woodwork, wedding pandal wood structure, and wooden doors.",
      workSites: [
        {
          siteName: "Nayagaon Marriage Hall",
          workType: "Grand Wooden Entrance Arch",
          year: "2024",
          photo: null
        }
      ]
    },
    {
      id: "w-4",
      initials: "GS",
      name: "Ganesh Sharma",
      photo: GAON_ASSETS.carpenterAvatar,
      category: "carpenter",
      skillNameEn: "Carpenter",
      skillNameHi: "बढ़ई",
      experience: 6,
      rating: 4.5,
      jobsCompleted: 31,
      dailyRate: 600,
      phone: "+91 94567 22904",
      village: "Rajpura",
      distanceKm: 9,
      status: "available",
      statusEn: "Available today",
      statusHi: "आज उपलब्ध",
      verified: true,
      bio: "Quick repairs, wooden carts, modern plyboard cupboards, and roof work.",
      workSites: [
        {
          siteName: "Rajpura Grain Mandi",
          workType: "Tractor Trolley Wooden Extensions",
          year: "2024",
          photo: null
        }
      ]
    },
    {
      id: "w-5",
      initials: "RM",
      name: "Raju Mistri",
      photo: GAON_ASSETS.carpenterAvatar,
      category: "carpenter",
      skillNameEn: "Carpenter",
      skillNameHi: "बढ़ई",
      experience: 20,
      rating: 4.9,
      jobsCompleted: 140,
      dailyRate: 850,
      phone: "+91 96543 55318",
      village: "Block Town",
      distanceKm: 28,
      status: "busy",
      statusEn: "Busy · free next week",
      statusHi: "व्यस्त · अगले हफ्ते खाली",
      verified: true,
      bio: "Senior artisan for complete haveli and temple wooden carving, modular wooden setups.",
      workSites: [
        {
          siteName: "Sonbhadra Heritage Haveli",
          workType: "Restoration of Antique Carved Wooden Jali",
          year: "2021",
          photo: GAON_ASSETS.siteTempleDoorPhoto
        }
      ]
    },
    {
      id: "w-6",
      initials: "SK",
      name: "Suresh Kumar",
      photo: GAON_ASSETS.masonAvatar,
      category: "mason",
      skillNameEn: "Mason",
      skillNameHi: "राजमिस्त्री",
      experience: 12,
      rating: 4.8,
      jobsCompleted: 64,
      dailyRate: 700,
      phone: "+91 98234 44109",
      village: "Sundarpur",
      distanceKm: 0,
      status: "available",
      statusEn: "Available today",
      statusHi: "आज उपलब्ध",
      verified: true,
      bio: "Expert bricklayer, boundary walls, RCC roof slab casting, and plastering.",
      workSites: [
        {
          siteName: "Sundarpur Primary School",
          workType: "Boundary Wall & Main Gate Masonry",
          year: "2023",
          photo: GAON_ASSETS.siteSchoolWallPhoto
        },
        {
          siteName: "Kisan Seva Kendra, Rajpura",
          workType: "Warehouse Floor Concrete & Brick Pillars",
          year: "2024",
          photo: GAON_ASSETS.siteSchoolWallPhoto
        },
        {
          siteName: "Nayagaon 2-Storey House",
          workType: "Complete Brick Masonry & Plaster",
          year: "2022",
          photo: null
        }
      ]
    },
    {
      id: "w-7",
      initials: "MD",
      name: "Meena Devi",
      photo: GAON_ASSETS.farmLabourAvatar,
      category: "farm_labour",
      skillNameEn: "Farm labour",
      skillNameHi: "खेत मज़दूर",
      experience: 8,
      rating: 4.9,
      jobsCompleted: 120,
      dailyRate: 400,
      phone: "+91 98112 39014",
      village: "Kheda",
      distanceKm: 3,
      status: "available",
      statusEn: "Available today",
      statusHi: "आज उपलब्ध",
      verified: true,
      bio: "Hardworking farm team leader: harvesting, weeding, sowing, paddy transplantation, wheat reaping.",
      workSites: [
        {
          siteName: "Chaudhary Farm, Sundarpur",
          workType: "12 Acres Wheat Harvesting & Threshing",
          year: "2024",
          photo: null
        },
        {
          siteName: "Kheda Gram Panchayat Field",
          workType: "Paddy Nursery Preparation & Sowing",
          year: "2023",
          photo: null
        }
      ]
    },
    {
      id: "w-8",
      initials: "AP",
      name: "Arjun Prasad",
      photo: GAON_ASSETS.electricianAvatar,
      category: "electrician",
      skillNameEn: "Electrician",
      skillNameHi: "बिजली मिस्त्री",
      experience: 5,
      rating: 4.6,
      jobsCompleted: 38,
      dailyRate: 650,
      phone: "+91 97890 88219",
      village: "Rajpura",
      distanceKm: 12,
      status: "free_thu",
      statusEn: "Free from Thu",
      statusHi: "गुरुवार से उपलब्ध",
      verified: true,
      bio: "Tubewell electric motor winding, home wiring, solar panel connection, starter repairs.",
      workSites: [
        {
          siteName: "Sundarpur Community Tubewell",
          workType: "7.5 HP Submersible Starter Overhaul",
          year: "2024",
          photo: null
        },
        {
          siteName: "Rajpura Cold Storage",
          workType: "3-Phase Power Distribution Panel",
          year: "2023",
          photo: null
        }
      ]
    }
  ],

  // Initial Products for Gaon Bazaar with real photos
  initialProducts: [
    {
      id: "p-1",
      name: "Wheat seed (certified)",
      nameHi: "गेहूँ का प्रमाणित बीज (PBW 502)",
      photo: GAON_ASSETS.wheatSeedPhoto,
      price: 1250,
      unit: "40 kg bag",
      shopName: "Sharma Beej Bhandar",
      shopOwner: "Ramakant Sharma",
      shopPhoto: GAON_ASSETS.storeAvatar,
      shopPhone: "+91 98390 11223",
      category: "seeds",
      village: "Sundarpur",
      distanceText: "Pick up · 400 m",
      deliveryType: "pickup",
      stock: 35,
      canBuy: "nearby",
      canDeliver: true,
      description: "High germination rate government certified variety. Heavy grain yield."
    },
    {
      id: "p-2",
      name: "DAP fertiliser",
      nameHi: "डी.ए.पी. खाद (इफको 50 किग्रा)",
      photo: GAON_ASSETS.dapFertilizerPhoto,
      price: 1350,
      unit: "50 kg bag",
      shopName: "Kisan Khad Kendra",
      shopOwner: "Brijesh Maurya",
      shopPhoto: GAON_ASSETS.storeAvatar,
      shopPhone: "+91 98450 66778",
      category: "fertilizer",
      village: "Sundarpur",
      distanceText: "Pick up · 1 km",
      deliveryType: "pickup",
      stock: 60,
      canBuy: "nearby",
      canDeliver: false,
      description: "100% genuine IFFCO DAP fertilizer. Ideal for Rabi wheat sowing."
    },
    {
      id: "p-3",
      name: "Fresh buffalo milk",
      nameHi: "ताज़ा शुद्ध भैंस का दूध (फैट 7.5%)",
      photo: GAON_ASSETS.buffaloMilkPhoto,
      price: 60,
      unit: "litre",
      shopName: "Yadav Dairy",
      shopOwner: "Santosh Yadav",
      shopPhoto: GAON_ASSETS.storeAvatar,
      shopPhone: "+91 97120 44332",
      category: "dairy",
      village: "Sundarpur",
      distanceText: "Home delivery",
      deliveryType: "delivery",
      stock: 80,
      canBuy: "village",
      canDeliver: true,
      description: "Pure morning and evening fresh milk directly from farm. No chemicals."
    },
    {
      id: "p-4",
      name: "Steel sickle (hansiya)",
      nameHi: "स्टील दरांती / हंसिया (मजबूत धार)",
      photo: GAON_ASSETS.steelSicklePhoto,
      price: 180,
      unit: "piece",
      shopName: "Lohar Tools",
      shopOwner: "Badri Lohar",
      shopPhoto: GAON_ASSETS.storeAvatar,
      shopPhone: "+91 94150 99881",
      category: "tools",
      village: "Sundarpur",
      distanceText: "Pick up · 700 m",
      deliveryType: "pickup",
      stock: 22,
      canBuy: "nearby",
      canDeliver: true,
      description: "Hand-forged hardened carbon steel sickle for fast crop reaping. Long life wooden grip."
    }
  ],

  // Initial Hirer Job Posts
  initialJobs: [
    {
      id: "j-1",
      title: "Need 4 Farm Labourers for Wheat Sowing",
      titleHi: "गेहूँ बुवाई के लिए 4 खेत मज़दूर चाहिए",
      hirerName: "Chaudhary Virendra Singh",
      hirerPhone: "+91 98210 55443",
      category: "farm_labour",
      workersCount: 4,
      duration: "3 days",
      dailyWage: 450,
      village: "Sundarpur",
      postedTime: "2 hours ago",
      notes: "Lunch and tea provided on the field. Work starts 7:00 AM."
    },
    {
      id: "j-2",
      title: "Mason and Helper for Boundary Wall",
      titleHi: "बाउंड्री वॉल के लिए राजमिस्त्री और हेल्पर चाहिए",
      hirerName: "Mahesh Gupta",
      hirerPhone: "+91 97200 12345",
      category: "mason",
      workersCount: 2,
      duration: "5 days",
      dailyWage: 750,
      village: "Sundarpur",
      postedTime: "Yesterday",
      notes: "Bricks and cement already arrived at site. Immediate start."
    }
  ],

  // Initial Store Orders for Shop Owner Management (User Request)
  initialOrders: [
    {
      id: "ORD-101",
      shopName: "Sharma Beej Bhandar",
      customerName: "Chaudhary Virendra Singh",
      customerPhone: "+91 98210 55443",
      customerVillage: "Sundarpur (Near East Field)",
      deliveryType: "pickup", // "pickup" or "delivery"
      status: "pending", // "pending", "ready", "completed", "cancelled"
      orderDate: "Today, 10:30 AM",
      items: [
        { name: "Wheat seed (certified)", price: 1250, unit: "40 kg bag", qty: 2 }
      ],
      totalAmount: 2500,
      notes: "Will pick up by tractor trolley around 5 PM."
    },
    {
      id: "ORD-102",
      shopName: "Sharma Beej Bhandar",
      customerName: "Mahesh Gupta",
      customerPhone: "+91 97200 12345",
      customerVillage: "Rajpura (Near Bus Stand)",
      deliveryType: "delivery",
      status: "completed",
      orderDate: "Yesterday, 04:15 PM",
      items: [
        { name: "Wheat seed (certified)", price: 1250, unit: "40 kg bag", qty: 1 }
      ],
      totalAmount: 1250,
      notes: "Delivered to shop at bus stand."
    },
    {
      id: "ORD-103",
      shopName: "Sharma Beej Bhandar",
      customerName: "Santosh Yadav",
      customerPhone: "+91 97120 44332",
      customerVillage: "Sundarpur (Yadav Basti)",
      deliveryType: "pickup",
      status: "pending",
      orderDate: "Today, 01:15 PM",
      items: [
        { name: "Wheat seed (certified)", price: 1250, unit: "40 kg bag", qty: 3 }
      ],
      totalAmount: 3750,
      notes: "Urgent required for tomorrow wheat sowing."
    },
    {
      id: "ORD-104",
      shopName: "Lohar Tools",
      customerName: "Ramesh Patel",
      customerPhone: "+91 94123 77801",
      customerVillage: "Sundarpur",
      deliveryType: "pickup",
      status: "pending",
      orderDate: "Today, 11:45 AM",
      items: [
        { name: "Steel sickle (hansiya)", price: 180, unit: "piece", qty: 3 }
      ],
      totalAmount: 540,
      notes: "Need sharpened before pickup."
    },
    {
      id: "ORD-105",
      shopName: "Kisan Khad Kendra",
      customerName: "Dharmendra Yadav",
      customerPhone: "+91 93012 55678",
      customerVillage: "Nayagaon",
      deliveryType: "delivery",
      status: "completed",
      orderDate: "28 Oct 2026",
      items: [
        { name: "DAP fertiliser", price: 1350, unit: "50 kg bag", qty: 2 }
      ],
      totalAmount: 2700,
      notes: "Delivered by tempo."
    }
  ],

  // MNREGA Government Village Works & Master Roll (User Request)
  mnregaProjects: [
    {
      id: "MNR-SUNDAR-01",
      village: "Sundarpur",
      block: "Robertsganj",
      title: "Amrit Sarovar Pond De-Silting & Beautification",
      titleHi: "अमृत सरोवर तालाब गहरीकरण एवं सुंदरीकरण",
      projectCode: "UP-SON-2026-0891",
      sanctionedWage: 260, // ₹ / day official govt rate
      totalDays: 60,
      daysCompleted: 24,
      totalBudget: 468000,
      workersNeeded: 20,
      status: "active",
      gramRozgarSevak: "Dinesh Kumar (Rozgar Sevak)",
      contactPhone: "+91 94567 11223",
      workSiteLandmark: "Sundarpur Purana Pokhra (East Field)",
      description: "De-silting 4-acre community pond, strengthening boundary embankments, and constructing rainwater inflow canal."
    },
    {
      id: "MNR-SUNDAR-02",
      village: "Sundarpur",
      block: "Robertsganj",
      title: "Field Irrigation Drainage Canal Construction",
      titleHi: "सिंचाई हेतु पक्की नाली एवं बंधा निर्माण",
      projectCode: "UP-SON-2026-0892",
      sanctionedWage: 260,
      totalDays: 45,
      daysCompleted: 12,
      totalBudget: 280000,
      workersNeeded: 15,
      status: "active",
      gramRozgarSevak: "Dinesh Kumar (Rozgar Sevak)",
      contactPhone: "+91 94567 11223",
      workSiteLandmark: "West Boundary Canal, Sundarpur",
      description: "1.2 km irrigation channel laying to avoid field waterlogging and connect with canal feeder."
    },
    {
      id: "MNR-SUNDAR-03",
      village: "Sundarpur",
      block: "Robertsganj",
      title: "Panchayat Social Forestry & Tree Plantation",
      titleHi: "ग्राम पंचायत सामाजिक वानिकी एवं पौधरोपण",
      projectCode: "UP-SON-2026-0893",
      sanctionedWage: 260,
      totalDays: 30,
      daysCompleted: 30,
      totalBudget: 156000,
      workersNeeded: 10,
      status: "completed",
      gramRozgarSevak: "Dinesh Kumar (Rozgar Sevak)",
      contactPhone: "+91 94567 11223",
      workSiteLandmark: "Primary School & Graveyard Boundary",
      description: "500 fruit and timber tree saplings planted and tree-guards installed."
    }
  ],

  // MNREGA Registered Workers with Job Cards & Digital Attendance (NMMS)
  mnregaWorkers: [
    {
      id: "MW-01",
      jobCardNo: "UP-05-231-014/001",
      name: "Ramlal Kol",
      village: "Sundarpur",
      gender: "Male",
      category: "Unskilled Labour",
      aadhaarLinked: true,
      dbtActive: true,
      phone: "+91 98345 11029",
      assignedProject: "MNR-SUNDAR-01",
      daysWorked: 28,
      status: "present" // 'present' or 'absent'
    },
    {
      id: "MW-02",
      jobCardNo: "UP-05-231-014/002",
      name: "Phoolmati Devi",
      village: "Sundarpur",
      gender: "Female",
      category: "Unskilled Labour",
      aadhaarLinked: true,
      dbtActive: true,
      phone: "+91 97123 44556",
      assignedProject: "MNR-SUNDAR-01",
      daysWorked: 34,
      status: "present"
    },
    {
      id: "MW-03",
      jobCardNo: "UP-05-231-014/003",
      name: "Chhotey Lal Yadav",
      village: "Sundarpur",
      gender: "Male",
      category: "Unskilled Labour",
      aadhaarLinked: true,
      dbtActive: true,
      phone: "+91 98456 77889",
      assignedProject: "MNR-SUNDAR-01",
      daysWorked: 20,
      status: "absent"
    },
    {
      id: "MW-04",
      jobCardNo: "UP-05-231-014/004",
      name: "Shanti Devi",
      village: "Sundarpur",
      gender: "Female",
      category: "Mate / Supervisor",
      aadhaarLinked: true,
      dbtActive: true,
      phone: "+91 96543 22110",
      assignedProject: "MNR-SUNDAR-01",
      daysWorked: 45,
      status: "present"
    },
    {
      id: "MW-05",
      jobCardNo: "UP-05-231-014/005",
      name: "Bablu Bind",
      village: "Sundarpur",
      gender: "Male",
      category: "Unskilled Labour",
      aadhaarLinked: true,
      dbtActive: true,
      phone: "+91 95432 11987",
      assignedProject: "MNR-SUNDAR-01",
      daysWorked: 16,
      status: "present"
    },
    {
      id: "MW-06",
      jobCardNo: "UP-05-231-014/006",
      name: "Kismati Devi",
      village: "Sundarpur",
      gender: "Female",
      category: "Unskilled Labour",
      aadhaarLinked: true,
      dbtActive: true,
      phone: "+91 94321 00987",
      assignedProject: "MNR-SUNDAR-01",
      daysWorked: 22,
      status: "present"
    },
    {
      id: "MW-07",
      jobCardNo: "UP-05-231-014/007",
      name: "Mangru Prasad",
      village: "Sundarpur",
      gender: "Male",
      category: "Unskilled Labour",
      aadhaarLinked: true,
      dbtActive: true,
      phone: "+91 93210 99876",
      assignedProject: "MNR-SUNDAR-01",
      daysWorked: 19,
      status: "absent"
    },
    {
      id: "MW-08",
      jobCardNo: "UP-05-231-014/008",
      name: "Guddi Devi",
      village: "Sundarpur",
      gender: "Female",
      category: "Unskilled Labour",
      aadhaarLinked: true,
      dbtActive: true,
      phone: "+91 92109 88765",
      assignedProject: "MNR-SUNDAR-01",
      daysWorked: 31,
      status: "present"
    }
  ],

  // Work Owner's Hired Workers & Daily Attendance Register (User Request)
  initialHiredWorkers: [
    {
      hiredId: "HW-01",
      workerId: "w-2",
      workerName: "Suresh Kumar",
      workerTradeEn: "Mason (Rajmistri)",
      workerTradeHi: "राजमिस्त्री (Mason)",
      workerPhone: "+91 98112 23344",
      workerPhoto: GAON_ASSETS.masonAvatar,
      village: "Sundarpur",
      projectTitle: "Boundary Wall & Verandah Construction",
      projectTitleHi: "चारदीवारी एवं बरामदा निर्माण कार्य",
      dailyWage: 600,
      hireDate: "24 Oct 2026",
      status: "active",
      attendance: [
        { date: "25 Oct", dayName: "Sun", status: "P" },
        { date: "26 Oct", dayName: "Mon", status: "P" },
        { date: "27 Oct", dayName: "Tue", status: "P" },
        { date: "28 Oct", dayName: "Wed", status: "A" },
        { date: "29 Oct", dayName: "Thu", status: "P" },
        { date: "30 Oct", dayName: "Fri", status: "P" },
        { date: "31 Oct", dayName: "Sat", status: "P" }
      ]
    },
    {
      hiredId: "HW-02",
      workerId: "w-3",
      workerName: "Meena Devi",
      workerTradeEn: "Farm Labour (Khet Mazdoor)",
      workerTradeHi: "खेत मज़दूर (Farm Labour)",
      workerPhone: "+91 97234 56789",
      workerPhoto: GAON_ASSETS.farmLabourAvatar,
      village: "Sundarpur",
      projectTitle: "Paddy Harvesting & Wheat Field Prep",
      projectTitleHi: "धान कटाई एवं गेहूँ बुवाई तैयारी",
      dailyWage: 420,
      hireDate: "26 Oct 2026",
      status: "active",
      attendance: [
        { date: "26 Oct", dayName: "Mon", status: "P" },
        { date: "27 Oct", dayName: "Tue", status: "P" },
        { date: "28 Oct", dayName: "Wed", status: "P" },
        { date: "29 Oct", dayName: "Thu", status: "A" },
        { date: "30 Oct", dayName: "Fri", status: "P" },
        { date: "31 Oct", dayName: "Sat", status: "A" }
      ]
    }
  ],

  // Worker's Own Attendance & Work Records (User Request)
  initialWorkerAttendance: {
    employerName: "Chaudhary Virendra Singh",
    employerPhone: "+91 98210 55443",
    projectTitle: "Boundary Wall & Verandah Construction",
    projectTitleHi: "चारदीवारी एवं बरामदा निर्माण कार्य",
    dailyWage: 650,
    startDate: "24 Oct 2026",
    status: "active",
    todayStatus: "P",
    isAvailable: true,
    history: [
      { date: "24 Oct", dayName: "Sat", status: "P" },
      { date: "25 Oct", dayName: "Sun", status: "P" },
      { date: "26 Oct", dayName: "Mon", status: "P" },
      { date: "27 Oct", dayName: "Tue", status: "P" },
      { date: "28 Oct", dayName: "Wed", status: "A" },
      { date: "29 Oct", dayName: "Thu", status: "P" },
      { date: "30 Oct", dayName: "Fri", status: "P" },
      { date: "31 Oct", dayName: "Sat", status: "P" }
    ],
    mnregaLinked: {
      projectCode: "UP-SON-2026-0891",
      projectName: "Amrit Sarovar Pond De-Silting",
      projectNameHi: "अमृत सरोवर तालाब गहरीकरण एवं सुंदरीकरण",
      wage: 260,
      daysCompleted: 24,
      dbtStatus: "Credited to Bank Account (DBT Active)"
    }
  },

  // Bilingual Dictionary
  i18n: {
    en: {
      appName: "GaonKaam",
      tagline: "Work, workers and goods — in your village and beyond.",
      namaste: "Namaste!",
      whatDoYouWant: "What do you want to do?",
      whatDoYouWantSub: "Select your role or task to proceed",
      changeLocation: "Change",
      speakBtn: "Speak instead of typing · बोलकर बताएं",
      alreadyRegistered: "Already registered? Log in with phone",
      logout: "Log out",
      logoutConfirm: "Are you sure you want to log out from this profile?",
      guestUser: "Guest",
      addProfile: "+ Add Profile",
      
      // Work Done Locations
      workSitesTitle: "Where have you done work before? (Past Work Sites)",
      workSitesSub: "List village projects, sites, or landmarks you completed",
      addWorkSiteBtn: "+ Add Another Work Site",
      siteNameLabel: "Site / Village Landmark Name",
      workTypeDoneLabel: "Work Done / Project Type",
      yearLabel: "Year / Duration",
      uploadWorkPhoto: "Attach Work Done Photo (Optional)",

      // First Interface (Location)
      locTitle: "Select Your Village & Area",
      locSubtitle: "Access local workers, daily jobs, and village bazaar",
      orMethod: "— OR SEARCH BY DISTRICT & BLOCK —",
      pincodeLabel: "Enter 6-Digit Area Pincode",
      pincodePlaceholder: "e.g. 231216",
      detectLocBtn: "Detect My Location Automatically",
      stateLabel: "State",
      districtLabel: "District",
      blockLabel: "Block / Tehsil",
      villageLabel: "Village / Town",
      selectOption: "-- Select --",
      enterVillageBtn: "Enter Village Portal",
      quickTry: "Quick Demo Villages:",

      // 3 Main Roles (Page 1)
      roleWorkerTitle: "I want work",
      roleWorkerSub: "काम चाहिए · daily wage, farm, building",
      roleHireTitle: "I want to hire",
      roleHireSub: "मज़दूर / कारीगर चाहिए · masons, labour",
      roleMarketTitle: "Buy or sell goods",
      roleMarketSub: "बाज़ार · seeds, tools, produce",

      // Navigation Bar
      navWork: "Work",
      navHire: "Hire",
      navMarket: "Market",
      navSell: "Sell",
      navProfile: "Profile",

      // Screen 2: All Work
      allWorkTitle: "All work",
      allWorkSubtitle: "pick a type of work",
      searchWorkPlaceholder: "Search carpenter, mason, driver...",
      typesBanner: "12 types of work · {count} workers",
      tapToSee: "Tap to see workers",
      available: "available",

      // Screen 3: Category Workers
      workersLabel: "people",
      distVillage: "My village",
      dist10km: "10 km",
      dist50km: "50 km",
      distAnywhere: "Anywhere",
      availableToday: "Available today",
      busyFreeNextWeek: "Busy · free next week",
      callNow: "Call Worker",

      // Screen 4: Hire Workers
      hireHeaderTitle: "Hire workers",
      hireHeaderSubtitle: "verified by phone",
      postJobCardTitle: "Post a job instead",
      postJobCardSub: "Workers nearby will call you",
      workersNearYou: "workers near you",
      within25km: "Within 25 km",
      perDay: "per day",
      hireBtn: "Hire · बुलाएं",
      profileBtn: "Profile",

      // Screen 5: Gaon Bazaar
      bazaarTitle: "Gaon Bazaar",
      bazaarSubtitle: "buy from local dealers",
      searchBazaarPlaceholder: "Seeds, fertiliser, tools, milk...",
      inMyVillage: "In my village",
      nearbyVillages: "Nearby villages",
      outsideDelivery: "Outside · delivery",
      soldIn: "Sold in",
      categories: "Categories",
      addBuy: "Add · खरीदें",
      cart: "Cart",
      itemsInCart: "items in your cart",
      checkoutBtn: "Proceed to Order",

      // Screen 6: Sell a Product / Store Manager
      sellHeaderTitle: "Sell a product",
      sellHeaderSubtitle: "Post item to village market",
      addPhotos: "Add product photo · फोटो लें",
      productNameLabel: "Product name",
      productNamePlaceholder: "e.g. Wheat seed (certified)",
      priceLabel: "Price (₹)",
      perLabel: "Per",
      stockLabel: "Stock available",
      stockPlaceholder: "e.g. 35 bags / 50 litres",
      whoCanBuyLabel: "Who can buy? · किसे बेचें?",
      onlyMyVillage: "Only my village",
      onlyMyVillageSub: "Sundarpur buyers pick up from shop",
      nearbyVillagesRadio: "Nearby villages",
      nearbyVillagesSub: "Up to 25 km around you",
      everywhereRadio: "Everywhere",
      everywhereSub: "Any buyer · you ship or deliver",
      canDeliverToggle: "I can deliver",
      publishListingBtn: "Publish listing · बेचना शुरू करें",

      // Profile Creation (3 Roles)
      createProfileTitle: "Create Your Profile",
      createProfileSub: "Register with your verified village details & photos",
      workerTab: "Worker Profile",
      hirerTab: "Hirer Profile",
      storeTab: "Store Manager",

      // Form Fields
      fullName: "Full Name",
      phone: "Mobile Phone (10 digits)",
      primarySkill: "Primary Skill / Work Type",
      experienceYears: "Years of Experience",
      expectedWage: "Daily Wage Rate (₹ / day)",
      shopName: "Shop / Business Name",
      shopCategory: "Shop Category",
      workNeeded: "Work Type Usually Needed",
      saveProfile: "Save Profile & Activate",
      successMsg: "Profile created successfully!",

      // Shop Owner Orders Dashboard
      ordersDashboardTitle: "Shop Orders Manager",
      ordersDashboardSub: "Manage customer orders & fulfillment",
      allOrdersTab: "All Orders",
      pendingTab: "Pending Orders",
      completedTab: "Completed",
      totalOrdersKpi: "Total Orders",
      pendingOrdersKpi: "Pending",
      completedOrdersKpi: "Completed",
      totalRevenueKpi: "Total Sales",
      customerInfo: "Customer Details",
      orderItemsLabel: "Items Ordered",
      markReadyBtn: "Mark Ready for Pickup",
      markCompletedBtn: "Mark Delivered & Completed ✓",
      cancelOrderBtn: "Cancel Order ✕",
      storePickupBadge: "🏬 Shop Pickup",
      homeDeliveryBadge: "🏠 Home Delivery",
      manageOrdersBtn: "📦 View Shop Orders",

      // MNREGA Portal & Attendance (User Request)
      mnregaTitle: "MGNREGA Village Works & Master Roll",
      mnregaSub: "Government rural projects, job cards & daily attendance (NMMS)",
      mnregaProjectsTab: "Govt Works & Projects",
      mnregaAttendanceTab: "Digital Muster Roll (हाजिरी)",
      mnregaWorkersTab: "Job Card Workers",
      sanctionedWageLabel: "Govt Wage: ₹260 / day",
      totalWorkersEnrolled: "Enrolled Workers",
      presentTodayLabel: "Present Today",
      absentTodayLabel: "Absent",
      todayWagesPayable: "Today's Wage Pool",
      markAllPresentBtn: "✓ Mark All Present",
      resetAttendanceBtn: "Reset Attendance",
      submitMusterRollBtn: "Submit Muster Roll (NMMS डिजिटल हाजिरी) ›",
      applyMnregaWorkBtn: "+ Request MNREGA Work / Job Card",

      // Work Owner's Hired Workers & Attendance (User Request)
      hiredWorkersTitle: "My Hired Workers & Daily Attendance Register",
      hiredWorkersSubtitle: "Track daily attendance, present & absent days, and wages due",
      hireConfirmTitle: "Hire Worker & Add to My Team",
      hireConfirmSub: "Agree on daily wage and start your daily work attendance register",
      taskProjectName: "Task / Work Project Name",
      taskProjectPlaceholder: "e.g. Boundary wall cementing, wheat field harvesting...",
      agreedDailyWage: "Agreed Daily Wage (₹ / day)",
      startDate: "Work Start Date",
      confirmHireBtn: "✓ Confirm Hire & Add to My Profile",
      alreadyHiredBadge: "Currently on your team",
      activeWorkersCount: "Active Hired Workers",
      totalPresentDays: "Total Days Present",
      totalAbsentDays: "Total Days Absent",
      totalWagesPayable: "Total Wages Due (₹)",
      markPresent: "Mark Present (P)",
      markAbsent: "Mark Absent (A)",
      addAttendanceDay: "+ Add Day to Register",
      removeHiredWorker: "End Contract / Remove",
      noHiredWorkersMsg: "No workers currently hired. Browse verified local workers and click 'Hire' to add them to your team.",
      browseWorkersBtn: "Browse & Hire Workers ›",
      whatsappAttendanceSlip: "Share Attendance Slip on WhatsApp",
      attendanceSavedToast: "Attendance updated successfully!",

      // Role-Based Dedicated Interfaces (User Request)
      workerPortalTitle: "Worker Portal",
      hirerPortalTitle: "Work Owner Portal",
      storePortalTitle: "Shop Owner Portal",
      switchRoleBtn: "Switch Role",
      availableTodayBadge: "Available Today",
      busyBadge: "Busy on Job",
      nearbyWorkHeader: "Nearby Work Opportunities",
      nearbyWorkSub: "Jobs posted by village hirers and builders nearby",
      applyForJobBtn: "✓ Apply for Job",
      callEmployerBtn: "📞 Call Employer",
      myAttendanceHeader: "My Work Attendance & Earnings",
      myAttendanceSub: "Your daily presence (P) / absence (A) marked by employers",
      myWorkSitesHeader: "My Work Experience & Completed Sites",
      myWorkSitesSub: "Village sites & landmarks you have completed",
      workOwnerHiredSection: "My Hired Team & Daily Attendance Register",
      workOwnerJobsSection: "My Active Job Posts",
      shopOwnerOrdersSection: "Customer Orders Management",
      shopOwnerProductsSection: "My Store Products in Gaon Bazaar",
      addStoreProductBtn: "+ Add New Product to Store"
    },
    hi: {
      appName: "गाँवकाम",
      tagline: "काम, कारीगर और सामान — आपके गाँव और आस-पास।",
      namaste: "नमस्ते!",
      whatDoYouWant: "आप क्या करना चाहते हैं?",
      whatDoYouWantSub: "आगे बढ़ने के लिए अपनी भूमिका चुनें",
      changeLocation: "बदलें",
      speakBtn: "बोलकर बताएं · Speak instead of typing",
      alreadyRegistered: "पहले से पंजीकृत हैं? फ़ोन से लॉग इन करें",
      logout: "लॉग आउट",
      logoutConfirm: "क्या आप इस प्रोफ़ाइल से बाहर (लॉग आउट) होना चाहते हैं?",
      guestUser: "अतिथि",
      addProfile: "+ प्रोफ़ाइल जोड़ें",

      // Work Done Locations
      workSitesTitle: "पहले कहाँ-कहाँ काम किया? (कार्य स्थल)",
      workSitesSub: "अपने पूरे किए हुए गाँव के प्रोजेक्ट, मकान या निर्माण कार्य दर्ज करें",
      addWorkSiteBtn: "+ अन्य कार्य स्थल जोड़ें",
      siteNameLabel: "कार्य स्थल / गाँव या संस्था का नाम",
      workTypeDoneLabel: "किए गए काम का विवरण",
      yearLabel: "वर्ष / समय अवधि",
      uploadWorkPhoto: "किए गए कार्य की फोटो लगाएं (वैकल्पिक)",

      // First Interface (Location)
      locTitle: "अपना गाँव और क्षेत्र चुनें",
      locSubtitle: "स्थानीय कारीगर, दैनिक मज़दूरी और गाँव बाज़ार से जुड़ें",
      orMethod: "— या ज़िला और ब्लॉक से खोजें —",
      pincodeLabel: "6-अंकों का पिनकोड दर्ज करें",
      pincodePlaceholder: "उदा. 231216",
      detectLocBtn: "मेरा स्थान अपने आप पहचानें",
      stateLabel: "राज्य",
      districtLabel: "ज़िला",
      blockLabel: "ब्लॉक / तहसील",
      villageLabel: "गाँव / कस्बा",
      selectOption: "-- चुनें --",
      enterVillageBtn: "गाँव पोर्टल में प्रवेश करें",
      quickTry: "परीक्षण हेतु गाँव:",

      // 3 Main Roles (Page 1)
      roleWorkerTitle: "काम चाहिए",
      roleWorkerSub: "daily wage, farm, building · दिहाड़ी, खेत, मकान",
      roleHireTitle: "मज़दूर / कारीगर चाहिए",
      roleHireSub: "masons, labour · मिस्त्री, मज़दूर बुलाएं",
      roleMarketTitle: "बाज़ार · सामान खरीदें/बेचें",
      roleMarketSub: "seeds, tools, produce · बीज, खाद, औजार, दूध",

      // Navigation Bar
      navWork: "काम",
      navHire: "कारीगर",
      navMarket: "बाज़ार",
      navSell: "सामान बेचें",
      navProfile: "मेरी प्रोफ़ाइल",

      // Screen 2: All Work
      allWorkTitle: "सभी काम",
      allWorkSubtitle: "काम का प्रकार चुनें",
      searchWorkPlaceholder: "बढ़ई, राजमिस्त्री, ड्राइवर खोजें...",
      typesBanner: "12 प्रकार के काम · {count} कारीगर",
      tapToSee: "कारीगर देखने के लिए टैप करें",
      available: "उपलब्ध",

      // Screen 3: Category Workers
      workersLabel: "कारीगर",
      distVillage: "मेरा गाँव",
      dist10km: "10 किमी",
      dist50km: "50 किमी",
      distAnywhere: "कहीं भी",
      availableToday: "आज उपलब्ध",
      busyFreeNextWeek: "व्यस्त · अगले हफ्ते खाली",
      callNow: "फ़ोन मिलाएं",

      // Screen 4: Hire Workers
      hireHeaderTitle: "कारीगर बुलाएं",
      hireHeaderSubtitle: "फ़ोन द्वारा सत्यापित",
      postJobCardTitle: "काम पोस्ट करें",
      postJobCardSub: "आस-पास के मज़दूर आपसे संपर्क करेंगे",
      workersNearYou: "कारीगर आपके पास",
      within25km: "25 किमी के दायरे में",
      perDay: "प्रति दिन",
      hireBtn: "बुलाएं · Hire",
      profileBtn: "प्रोफ़ाइल",

      // Screen 5: Gaon Bazaar
      bazaarTitle: "गाँव का बाज़ार",
      bazaarSubtitle: "स्थानीय दुकानदारों से सीधे खरीदें",
      searchBazaarPlaceholder: "बीज, खाद, औजार, दूध...",
      inMyVillage: "मेरे गाँव में",
      nearbyVillages: "आस-पास के गाँव",
      outsideDelivery: "बाहरी · होम डिलीवरी",
      soldIn: "गाँव में उपलब्ध:",
      categories: "श्रेणियाँ",
      addBuy: "खरीदें · Add",
      cart: "झोला / कार्ट",
      itemsInCart: "सामान कार्ट में मौजूद",
      checkoutBtn: "ऑर्डर कन्फर्म करें",

      // Screen 6: Sell a Product / Store Manager
      sellHeaderTitle: "सामान बेचें",
      sellHeaderSubtitle: "गाँव बाज़ार में अपनी दुकान का सामान जोड़ें",
      addPhotos: "सामान की फोटो लगाएं · Add photos",
      productNameLabel: "सामान का नाम",
      productNamePlaceholder: "उदा. गेहूँ का बीज (प्रमाणित)",
      priceLabel: "कीमत (₹)",
      perLabel: "प्रति इकाई (Per)",
      stockLabel: "उपलब्ध स्टॉक",
      stockPlaceholder: "उदा. 35 बोरी / 50 लीटर",
      whoCanBuyLabel: "किसे बेचें? · Who can buy?",
      onlyMyVillage: "सिर्फ मेरे गाँव में",
      onlyMyVillageSub: "गाँव के ग्राहक दुकान से उठाएंगे",
      nearbyVillagesRadio: "आस-पास के गाँव",
      nearbyVillagesSub: "आपके 25 किमी के दायरे में",
      everywhereRadio: "कहीं भी",
      everywhereSub: "कोई भी खरीदार · आप पहुँचाएंगे या पार्सल करेंगे",
      canDeliverToggle: "मैं पहुँचा सकता हूँ (होम डिलीवरी)",
      publishListingBtn: "बेचना शुरू करें · Publish listing",

      // Profile Creation (3 Roles)
      createProfileTitle: "अपनी प्रोफ़ाइल बनाएं",
      createProfileSub: "अपने गाँव में अपनी आधिकारिक प्रोफ़ाइल व फोटो जोड़ें",
      workerTab: "कामगार / कारीगर",
      hirerTab: "काम देने वाले (ग्राहक)",
      storeTab: "दुकानदार (स्टोर मैनेजर)",

      // Form Fields
      fullName: "पूरा नाम",
      phone: "मोबाइल नंबर (10 अंक)",
      primarySkill: "मुख्य काम / हुनर",
      experienceYears: "कार्य अनुभव (वर्ष)",
      expectedWage: "दैनिक मज़दूरी (₹ / दिन)",
      shopName: "दुकान / स्टोर का नाम",
      shopCategory: "दुकान का प्रकार",
      workNeeded: "अक्सर किस काम की जरूरत होती है",
      saveProfile: "प्रोफ़ाइल सुरक्षित करें",
      successMsg: "आपकी प्रोफ़ाइल सफलतापूर्वक बन गई है!",

      // Shop Owner Orders Dashboard (Hindi)
      ordersDashboardTitle: "दुकानदार ऑर्डर प्रबंधन",
      ordersDashboardSub: "ग्राहकों के ऑर्डर देखें और डिलीवर करें",
      allOrdersTab: "सभी ऑर्डर",
      pendingTab: "पेंडिंग (लंबित)",
      completedTab: "पूरे हुए (डिलीवर)",
      totalOrdersKpi: "कुल ऑर्डर",
      pendingOrdersKpi: "पेंडिंग",
      completedOrdersKpi: "पूरे हुए",
      totalRevenueKpi: "कुल बिक्री",
      customerInfo: "ग्राहक का विवरण",
      orderItemsLabel: "मंगवाया गया सामान",
      markReadyBtn: "उठाने हेतु तैयार करें",
      markCompletedBtn: "डिलीवर व पूरा हुआ दर्ज करें ✓",
      cancelOrderBtn: "रद्द करें ✕",
      storePickupBadge: "🏬 दुकान से पिकअप",
      homeDeliveryBadge: "🏠 होम डिलीवरी",
      manageOrdersBtn: "📦 दुकान के ऑर्डर देखें",

      // MNREGA Portal & Attendance (Hindi)
      mnregaTitle: "मनरेगा सरकारी कार्य एवं मस्टर रोल",
      mnregaSub: "गाँव के सरकारी विकास कार्य, जॉब कार्ड एवं दैनिक डिजिटल हाजिरी",
      mnregaProjectsTab: "सरकारी कार्य व योजनाएं",
      mnregaAttendanceTab: "डिजिटल मस्टर रोल (हाजिरी)",
      mnregaWorkersTab: "जॉब कार्ड धारक",
      sanctionedWageLabel: "सरकारी दर: ₹260 / दिन",
      totalWorkersEnrolled: "कुल पंजीकृत मज़दूर",
      presentTodayLabel: "आज उपस्थित",
      absentTodayLabel: "अनुपस्थित",
      todayWagesPayable: "आज की कुल मजदूरी",
      markAllPresentBtn: "✓ सभी को उपस्थित करें",
      resetAttendanceBtn: "हाजिरी रीसेट करें",
      submitMusterRollBtn: "मस्टर रोल सबमिट करें (NMMS डिजिटल हाजिरी) ›",
      applyMnregaWorkBtn: "+ मनरेगा काम मांगें / जॉब कार्ड",

      // Work Owner's Hired Workers & Attendance (Hindi)
      hiredWorkersTitle: "मेरे रखे गए मज़दूर एवं दैनिक हाजिरी रजिस्टर",
      hiredWorkersSubtitle: "दैनिक उपस्थिति, उपस्थित/अनुपस्थित दिन एवं देय मजदूरी दर्ज करें",
      hireConfirmTitle: "मज़दूर को काम पर रखें एवं टीम में जोड़ें",
      hireConfirmSub: "दैनिक मजदूरी तय करें और आज से हाजिरी रजिस्टर शुरू करें",
      taskProjectName: "काम / प्रोजेक्ट का नाम",
      taskProjectPlaceholder: "उदा. चारदीवारी निर्माण, धान कटाई, खेत की जुताई...",
      agreedDailyWage: "तय दैनिक मजदूरी (₹ / दिन)",
      startDate: "काम शुरू होने की तारीख",
      confirmHireBtn: "✓ काम पर रखें और मेरी प्रोफ़ाइल में जोड़ें",
      alreadyHiredBadge: "आपकी टीम में शामिल",
      activeWorkersCount: "कुल रखे गए मज़दूर",
      totalPresentDays: "कुल उपस्थित दिन",
      totalAbsentDays: "कुल अनुपस्थित दिन",
      totalWagesPayable: "कुल देय मजदूरी (₹)",
      markPresent: "उपस्थित दर्ज करें (P)",
      markAbsent: "अनुपस्थित दर्ज करें (A)",
      addAttendanceDay: "+ नया दिन / तारीख जोड़ें",
      removeHiredWorker: "काम समाप्त / हटाएं",
      noHiredWorkersMsg: "वर्तमान में कोई मज़दूर काम पर नहीं रखा गया है। कारीगरों को खोजें और 'Hire' दबाकर अपनी टीम में जोड़ें।",
      browseWorkersBtn: "कारीगर खोजें व काम पर रखें ›",
      whatsappAttendanceSlip: "व्हाट्सएप पर हाजिरी पर्ची भेजें",
      attendanceSavedToast: "हाजिरी सफलतापूर्वक अपडेट हो गई!",

      // Role-Based Dedicated Interfaces (Hindi)
      workerPortalTitle: "कामगार पोर्टल (Worker)",
      hirerPortalTitle: "काम मालिक पोर्टल (Work Owner)",
      storePortalTitle: "दुकानदार पोर्टल (Shop Owner)",
      switchRoleBtn: "भूमिका बदलें",
      availableTodayBadge: "आज उपलब्ध हैं",
      busyBadge: "काम पर व्यस्त हैं",
      nearbyWorkHeader: "आस-पास उपलब्ध काम (जॉब्स)",
      nearbyWorkSub: "गाँव के किसानों व मकान मालिकों द्वारा पोस्ट किए गए काम",
      applyForJobBtn: "✓ काम के लिए आवेदन करें",
      callEmployerBtn: "📞 मालिक को फ़ोन करें",
      myAttendanceHeader: "मेरी हाजिरी एवं कमाई का हिसाब",
      myAttendanceSub: "मालिकों द्वारा दर्ज की गई आपकी उपस्थिति (P) / अनुपस्थिति (A)",
      myWorkSitesHeader: "मेरा कार्य अनुभव व पूर्व कार्य स्थल",
      myWorkSitesSub: "आपके द्वारा पूर्व में पूरे किए गए गाँव के प्रोजेक्ट",
      workOwnerHiredSection: "मेरे रखे गए मजदूर एवं दैनिक हाजिरी रजिस्टर",
      workOwnerJobsSection: "मेरे द्वारा पोस्ट किए गए काम",
      shopOwnerOrdersSection: "ग्राहक ऑर्डर प्रबंधन",
      shopOwnerProductsSection: "गाँव बाज़ार में मेरी दुकान का सामान",
      addStoreProductBtn: "+ दुकान में नया सामान जोड़ें"
    }
  }
};
