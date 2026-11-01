/**
 * GaonKaam - Village Employment & Local Commerce Application Logic
 * Enhanced with Photos, Work Locations (कार्य स्थल), and Logout functionality
 */

// Application State
const AppState = {
  currentLang: 'en', // 'en' or 'hi'
  currentLocation: null, // { pincode, state, district, block, village }
  activeScreen: 'location_gate', // 'location_gate', 'home_hub', 'all_work', 'category_workers', 'hire_workers', 'bazaar', 'sell_product', 'profile_creator'
  selectedCategory: 'carpenter',
  distanceFilter: 'anywhere', // 'village', '10km', '50km', 'anywhere'
  bazaarFilter: 'in_village', // 'in_village', 'nearby', 'outside'
  cart: [],
  workers: [],
  products: [],
  jobs: [],
  orders: [], // Store customer orders
  orderStatusFilter: 'all', // 'all', 'pending', 'completed'
  mnregaProjects: [], // MNREGA Village Government Projects
  mnregaWorkers: [], // MNREGA Job Card Workers & Attendance
  mnregaActiveTab: 'attendance', // 'attendance', 'projects', 'workers'
  hiredWorkers: [], // Workers hired by the work owner / employer (User Request)
  workerAttendance: null, // Worker's own attendance, work start/end & earnings (User Request)
  profileActiveTab: 'register', // 'register' or 'profile'
  currentRole: 'worker', // 'worker', 'hirer', 'store_manager'
  activeUserProfile: null,
  registeredUsers: [], // Persistent registry of all created profiles for permanent login
  roleSectionTabs: {
    worker: 'profile', // 'profile', 'jobs', 'nrega', 'attendance'
    hirer: 'workers',  // 'workers', 'attendance', 'jobs', 'nrega', 'profile'
    store_manager: 'orders' // 'orders', 'products', 'profile', 'market'
  },
  roleStatuses: {
    worker: 'available',      // 'available', 'occupied', 'unavailable'
    hirer: 'hiring',          // 'hiring', 'in_progress', 'no_work'
    store_manager: 'open'     // 'open', 'delivery', 'closed'
  },
  isDesktopView: false,

  // Temporary Form States for Uploads
  tempProfilePhoto: null,
  tempStorePhoto: null,
  tempProductPhoto: null,
  tempWorkSites: []
};

// ==========================================================================
// Initialization & LocalStorage Hydration
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initLocationForm();
  renderApp();
  setupEventListeners();
});

function initStorage() {
  // Load or seed workers
  const savedWorkers = localStorage.getItem('gaon_workers_v2');
  if (savedWorkers) {
    AppState.workers = JSON.parse(savedWorkers);
  } else {
    AppState.workers = [...GAON_DATA.initialWorkers];
    saveWorkers();
  }

  // Load or seed products
  const savedProducts = localStorage.getItem('gaon_products_v2');
  if (savedProducts) {
    AppState.products = JSON.parse(savedProducts);
  } else {
    AppState.products = [...GAON_DATA.initialProducts];
    saveProducts();
  }

  // Load or seed jobs
  const savedJobs = localStorage.getItem('gaon_jobs');
  if (savedJobs) {
    AppState.jobs = JSON.parse(savedJobs);
  } else {
    AppState.jobs = [...GAON_DATA.initialJobs];
    saveJobs();
  }

  // Load or seed store orders (User Request)
  const savedOrders = localStorage.getItem('gaon_orders_v2');
  if (savedOrders) {
    AppState.orders = JSON.parse(savedOrders);
  } else {
    AppState.orders = [...GAON_DATA.initialOrders];
    saveOrders();
  }

  // Load or seed MNREGA Projects & Workers (User Request)
  const savedMnregaProj = localStorage.getItem('gaon_mnrega_proj_v1');
  if (savedMnregaProj) {
    AppState.mnregaProjects = JSON.parse(savedMnregaProj);
  } else {
    AppState.mnregaProjects = [...GAON_DATA.mnregaProjects];
    saveMnregaProjects();
  }

  const savedMnregaWorkers = localStorage.getItem('gaon_mnrega_workers_v1');
  if (savedMnregaWorkers) {
    AppState.mnregaWorkers = JSON.parse(savedMnregaWorkers);
  } else {
    AppState.mnregaWorkers = [...GAON_DATA.mnregaWorkers];
    saveMnregaWorkers();
  }

  // Load or seed hired workers (User Request: Hired workers & daily attendance)
  const savedHiredWorkers = localStorage.getItem('gaon_hired_workers_v1');
  if (savedHiredWorkers) {
    AppState.hiredWorkers = JSON.parse(savedHiredWorkers);
  } else {
    AppState.hiredWorkers = [...GAON_DATA.initialHiredWorkers];
    saveHiredWorkers();
  }

  // Load cart
  const savedCart = localStorage.getItem('gaon_cart');
  if (savedCart) {
    AppState.cart = JSON.parse(savedCart);
  } else {
    AppState.cart = [
      { id: 'p-1', name: 'Wheat seed (certified)', price: 1250, unit: '40 kg bag', qty: 1, shopName: 'Sharma Beej Bhandar' },
      { id: 'p-4', name: 'Steel sickle (hansiya)', price: 180, unit: 'piece', qty: 1, shopName: 'Lohar Tools' }
    ];
    saveCart();
  }

  // Load saved location or default to Sundarpur so the portal opens immediately
  const savedLoc = localStorage.getItem('gaon_location');
  if (savedLoc) {
    AppState.currentLocation = JSON.parse(savedLoc);
  } else {
    AppState.currentLocation = {
      pincode: '231216',
      state: 'Uttar Pradesh',
      district: 'Sonbhadra',
      block: 'Robertsganj',
      village: 'Sundarpur'
    };
    saveLocation(AppState.currentLocation);
  }
  AppState.activeScreen = 'home_hub';

  // Load saved language
  const savedLang = localStorage.getItem('gaon_lang');
  if (savedLang) {
    AppState.currentLang = savedLang;
  }

  // Load or seed persistent registered users for login across logouts
  // Load or seed attendance correction queries (User Request: Worker attendance dispute & correction query)
  const savedQueries = localStorage.getItem('gaon_attendance_queries_v1');
  if (savedQueries) {
    try {
      AppState.attendanceQueries = JSON.parse(savedQueries);
    } catch (e) {
      AppState.attendanceQueries = [];
    }
  } else {
    AppState.attendanceQueries = [
      {
        id: "AQ-101",
        workerName: "nkx k",
        workerPhone: "+91 98077 00770",
        workerTrade: "Electrician",
        category: "private",
        targetEmployer: "Chaudhary Virendra Singh",
        targetEmployerPhone: "9821055443",
        date: "28 Oct 2026 (Wednesday)",
        disputeType: "marked_absent",
        reason: "Marked absent on 28 Oct but worked full 8 hours on North Wall Verandah wiring.",
        status: "pending",
        createdAt: "30 Oct 2026, 06:30 PM",
        resolutionNote: ""
      }
    ];
    saveAttendanceQueries();
  }

  const savedRegisteredUsers = localStorage.getItem('gaon_registered_users_v1');
  if (savedRegisteredUsers) {
    try { AppState.registeredUsers = JSON.parse(savedRegisteredUsers); } catch(e){}
  } else {
    AppState.registeredUsers = [
      {
        phone: "9807700770",
        name: "nkx k",
        role: "worker",
        roleTitle: "Electrician",
        dailyRate: 450,
        experience: 3,
        village: "Roorkee",
        workSites: [
          { siteName: "Roorkee Market Wiring", workType: "Electrical Installation", year: "2023" },
          { siteName: "Village Substation Connection", workType: "Main Line Repair", year: "2024" }
        ]
      },
      {
        phone: "9876543210",
        name: "Ramesh Sharma",
        role: "worker",
        roleTitle: "Mason (राजमिस्त्री)",
        dailyRate: 650,
        experience: 8,
        village: "Sundarpur",
        workSites: [
          { siteName: "Sundarpur Primary School", workType: "Main Gate & Wall Work", year: "2023" },
          { siteName: "Shiv Mandir Boundary", workType: "Temple Verandah Plaster", year: "2024" }
        ]
      },
      {
        phone: "9821055443",
        name: "Chaudhary Virendra Singh",
        role: "hirer",
        roleTitle: "Work Owner (काम मालिक)",
        village: "Sundarpur"
      },
      {
        phone: "9833322110",
        name: "Radheshyam Sharma",
        shopName: "Sharma Beej Bhandar",
        shopCategory: "Seeds, Fertilizers & Farm Tools",
        role: "store_manager",
        roleTitle: "Shop Owner (दुकानदार)",
        village: "Sundarpur"
      }
    ];
    saveRegisteredUsers();
  }

  // Load saved active profile
  const savedProfile = localStorage.getItem('gaon_active_profile');
  if (savedProfile) {
    AppState.activeUserProfile = JSON.parse(savedProfile);
    AppState.currentRole = AppState.activeUserProfile.role || 'worker';
  }

  // Load or seed worker's own attendance & work status (User Request)
  const savedWorkerAtt = localStorage.getItem('gaon_worker_att_v1');
  if (savedWorkerAtt) {
    AppState.workerAttendance = JSON.parse(savedWorkerAtt);
  } else {
    AppState.workerAttendance = { ...GAON_DATA.initialWorkerAttendance };
    saveWorkerAttendance();
  }

  // Load role sub-section tabs and statuses
  const savedTabs = localStorage.getItem('gaon_role_section_tabs');
  if (savedTabs) {
    try { AppState.roleSectionTabs = Object.assign(AppState.roleSectionTabs, JSON.parse(savedTabs)); } catch(e){}
  }
  const savedStatuses = localStorage.getItem('gaon_role_statuses');
  if (savedStatuses) {
    try { AppState.roleStatuses = Object.assign(AppState.roleStatuses, JSON.parse(savedStatuses)); } catch(e){}
  }

  // Load current chosen role or default to worker
  const savedRole = localStorage.getItem('gaon_current_role');
  if (savedRole) {
    AppState.currentRole = savedRole;
  } else if (AppState.activeUserProfile?.role) {
    AppState.currentRole = AppState.activeUserProfile.role;
  } else {
    AppState.currentRole = 'worker';
  }
}

function saveWorkerAttendance() {
  localStorage.setItem('gaon_worker_att_v1', JSON.stringify(AppState.workerAttendance));
}

function saveAttendanceQueries() {
  localStorage.setItem('gaon_attendance_queries_v1', JSON.stringify(AppState.attendanceQueries || []));
}

function openAttendanceQueryModal(category = 'private') {
  const isHi = AppState.currentLang === 'hi';
  const catInput = document.getElementById('queryCategory');
  const empDisplay = document.getElementById('queryEmployerDisplay');
  const dateSelect = document.getElementById('queryDateSelect');
  
  if (catInput) catInput.value = category;
  
  if (category === 'mnrega') {
    if (empDisplay) empDisplay.value = 'Dinesh Kumar (Rozgar Sevak / पंचायत मेट) · MNREGA';
    if (dateSelect) {
      dateSelect.innerHTML = `
        <option value="30 Oct 2026">30 Oct 2026 (Amrit Sarovar Pond Site)</option>
        <option value="29 Oct 2026">29 Oct 2026 (Amrit Sarovar Pond Site)</option>
        <option value="28 Oct 2026">28 Oct 2026 (Amrit Sarovar Pond Site)</option>
        <option value="27 Oct 2026">27 Oct 2026 (Pond Site)</option>
        <option value="Earlier Muster Roll Date">Earlier Muster Roll Date / पूर्व मस्टर रोल तारीख</option>
      `;
    }
  } else {
    const att = AppState.workerAttendance || GAON_DATA.initialWorkerAttendance;
    if (empDisplay) empDisplay.value = `${att.employerName || 'Chaudhary Virendra Singh'} (📞 ${att.employerPhone || '+91 98210 55443'})`;
    if (dateSelect && att.history) {
      dateSelect.innerHTML = att.history.map(h => 
        `<option value="${h.date} 2026 (${h.dayName || ''})">${h.date} 2026 - ${h.status === 'P' ? 'Marked Present (✓)' : 'Marked Absent (✕)'}</option>`
      ).join('');
    }
  }
  openModal('modalAttendanceQuery');
}

function handleAttendanceQuerySubmit(e) {
  e.preventDefault();
  const category = document.getElementById('queryCategory')?.value || 'private';
  const dateVal = document.getElementById('queryDateSelect')?.value || '28 Oct 2026';
  const typeVal = document.getElementById('queryTypeSelect')?.value || 'marked_absent';
  const reasonVal = document.getElementById('queryReasonInput')?.value?.trim();
  
  if (!reasonVal) return;

  const user = AppState.activeUserProfile || { name: 'nkx k', phone: '+91 98077 00770', roleTitle: 'Electrician' };
  const att = AppState.workerAttendance || GAON_DATA.initialWorkerAttendance;

  const newQuery = {
    id: 'AQ-' + Date.now(),
    workerName: user.name || 'nkx k',
    workerPhone: user.phone || '+91 98077 00770',
    workerTrade: user.roleTitle || user.trade || 'Worker',
    category: category,
    targetEmployer: category === 'mnrega' ? 'Dinesh Kumar (Rozgar Sevak)' : (att.employerName || 'Chaudhary Virendra Singh'),
    targetEmployerPhone: category === 'mnrega' ? '9456711223' : (att.employerPhone || '9821055443'),
    date: dateVal,
    disputeType: typeVal,
    reason: reasonVal,
    status: 'pending',
    createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    resolutionNote: ''
  };

  if (!AppState.attendanceQueries) AppState.attendanceQueries = [];
  AppState.attendanceQueries.unshift(newQuery);
  saveAttendanceQueries();

  closeModal('modalAttendanceQuery');
  const inputEl = document.getElementById('queryReasonInput');
  if (inputEl) inputEl.value = '';

  const isHi = AppState.currentLang === 'hi';
  showToast(isHi ? '✓ हाजिरी सुधार अनुरोध काम मालिक को भेज दिया गया है!' : '✓ Attendance correction query sent to Work Owner!');

  if (AppState.activeScreen === 'mnrega') {
    renderMnregaPortal();
  } else {
    renderDedicatedProfileScreen();
  }
}

function resolveAttendanceQuery(queryId, approve = true) {
  if (AppState.currentRole !== 'hirer') {
    showToast('⚠️ Only Work Owner can resolve attendance queries.');
    return;
  }
  const q = (AppState.attendanceQueries || []).find(item => item.id === queryId);
  if (!q) return;

  const isHi = AppState.currentLang === 'hi';

  if (approve) {
    q.status = 'resolved';
    q.resolutionNote = isHi ? 'मालिक द्वारा सुधार स्वीकार किया गया - उपस्थित (P) दर्ज' : 'Approved by Work Owner - marked Present (P)';
    
    // Automatically update attendance for this worker in AppState.workerAttendance & AppState.hiredWorkers
    if (AppState.workerAttendance && AppState.workerAttendance.history) {
      const histItem = AppState.workerAttendance.history.find(h => q.date.includes(h.date));
      if (histItem) {
        histItem.status = 'P';
        saveWorkerAttendance();
      }
    }
    if (AppState.hiredWorkers) {
      AppState.hiredWorkers.forEach(hw => {
        if (hw.attendance) {
          hw.attendance.forEach(day => {
            if (q.date.includes(day.date)) {
              day.status = 'P';
            }
          });
        }
      });
      saveHiredWorkers();
    }
    if (q.category === 'mnrega' && AppState.mnregaWorkers) {
      const mw = AppState.mnregaWorkers.find(w => w.name.toLowerCase() === q.workerName.toLowerCase() || q.workerName.toLowerCase().includes(w.name.toLowerCase()));
      if (mw) {
        mw.status = 'present';
        mw.daysWorked = (mw.daysWorked || 20) + 1;
        saveMnregaWorkers();
      }
    }

    saveAttendanceQueries();
    showToast(isHi ? `✓ अनुरोध स्वीकृत: ${q.workerName} की हाजिरी उपस्थित (P) दर्ज की गई!` : `✓ Approved: ${q.workerName} marked Present for ${q.date}!`);
  } else {
    q.status = 'rejected';
    q.resolutionNote = isHi ? 'मालिक द्वारा अस्वीकृत: रिकॉर्ड अनुसार कार्य अनुपस्थित था' : 'Declined: Record shows absent on this date';
    saveAttendanceQueries();
    showToast(isHi ? `✕ अनुरोध अस्वीकार किया गया` : `✕ Query declined`);
  }

  if (AppState.activeScreen === 'mnrega') {
    renderMnregaPortal();
  } else {
    renderDedicatedProfileScreen();
  }
}

function saveRegisteredUsers() {
  localStorage.setItem('gaon_registered_users_v1', JSON.stringify(AppState.registeredUsers || []));
}

function saveToRegisteredUsers(profile) {
  if (!profile || !profile.phone) return;
  if (!AppState.registeredUsers) AppState.registeredUsers = [];

  const cleanPhone = (profile.phone || '').replace(/\D/g, '').slice(-10);
  const existingIdx = AppState.registeredUsers.findIndex(u => (u.phone || '').replace(/\D/g, '').slice(-10) === cleanPhone);

  const cleanProfile = Object.assign({}, profile, { phone: cleanPhone.length === 10 ? cleanPhone : profile.phone });

  if (existingIdx >= 0) {
    AppState.registeredUsers[existingIdx] = cleanProfile;
  } else {
    AppState.registeredUsers.unshift(cleanProfile);
  }
  saveRegisteredUsers();
}

function saveWorkers() {
  localStorage.setItem('gaon_workers_v2', JSON.stringify(AppState.workers));
}

function saveProducts() {
  localStorage.setItem('gaon_products_v2', JSON.stringify(AppState.products));
}

function saveJobs() {
  localStorage.setItem('gaon_jobs', JSON.stringify(AppState.jobs));
}

function saveOrders() {
  localStorage.setItem('gaon_orders_v2', JSON.stringify(AppState.orders));
}

function saveMnregaProjects() {
  localStorage.setItem('gaon_mnrega_proj_v1', JSON.stringify(AppState.mnregaProjects));
}

function saveMnregaWorkers() {
  localStorage.setItem('gaon_mnrega_workers_v1', JSON.stringify(AppState.mnregaWorkers));
}

function saveHiredWorkers() {
  localStorage.setItem('gaon_hired_workers_v1', JSON.stringify(AppState.hiredWorkers));
}

function saveCart() {
  localStorage.setItem('gaon_cart', JSON.stringify(AppState.cart));
  updateCartBadge();
}

function saveLocation(loc) {
  AppState.currentLocation = loc;
  localStorage.setItem('gaon_location', JSON.stringify(loc));
}

// Translate helper
function t(key) {
  const langObj = GAON_DATA.i18n[AppState.currentLang] || GAON_DATA.i18n.en;
  return langObj[key] || GAON_DATA.i18n.en[key] || key;
}

// ==========================================================================
// Navigation & Screen Switching
// ==========================================================================
function navigateTo(screenId, params = {}) {
  AppState.activeScreen = screenId;
  if (params.category) {
    AppState.selectedCategory = params.category;
  }
  if (params.role) {
    AppState.currentRole = params.role;
  }
  renderApp();
  
  // Scroll viewport to top
  const viewport = document.getElementById('appViewport');
  if (viewport) viewport.scrollTop = 0;
}

// ==========================================================================
// First Interface: Location Logic
// ==========================================================================
function initLocationForm() {
  const pinInput = document.getElementById('pincodeInput');
  const stateSelect = document.getElementById('stateSelect');
  const districtSelect = document.getElementById('districtSelect');
  const blockSelect = document.getElementById('blockSelect');
  const villageSelect = document.getElementById('villageSelect');

  if (!stateSelect) return;

  // Populate unique states
  const states = [...new Set(GAON_DATA.locations.map(l => l.state))];
  stateSelect.innerHTML = `<option value="">-- ${t('selectOption')} --</option>` + 
    states.map(s => `<option value="${s}">${s}</option>`).join('');

  stateSelect.addEventListener('change', () => {
    const selectedState = stateSelect.value;
    const filtered = GAON_DATA.locations.filter(l => l.state === selectedState);
    const districts = [...new Set(filtered.map(l => l.district))];
    
    districtSelect.innerHTML = `<option value="">-- ${t('selectOption')} --</option>` + 
      districts.map(d => `<option value="${d}">${d}</option>`).join('');
    districtSelect.disabled = false;
    blockSelect.innerHTML = `<option value="">-- ${t('selectOption')} --</option>`;
    blockSelect.disabled = true;
    villageSelect.innerHTML = `<option value="">-- ${t('selectOption')} --</option>`;
    villageSelect.disabled = true;
  });

  districtSelect.addEventListener('change', () => {
    const selectedDistrict = districtSelect.value;
    const filtered = GAON_DATA.locations.filter(l => l.district === selectedDistrict);
    const blocks = [...new Set(filtered.map(l => l.block))];
    
    blockSelect.innerHTML = `<option value="">-- ${t('selectOption')} --</option>` + 
      blocks.map(b => `<option value="${b}">${b}</option>`).join('');
    blockSelect.disabled = false;
    villageSelect.innerHTML = `<option value="">-- ${t('selectOption')} --</option>`;
    villageSelect.disabled = true;
  });

  blockSelect.addEventListener('change', () => {
    const selectedBlock = blockSelect.value;
    const matched = GAON_DATA.locations.find(l => l.block === selectedBlock);
    if (matched) {
      villageSelect.innerHTML = `<option value="">-- ${t('selectOption')} --</option>` + 
        matched.villages.map(v => `<option value="${v}">${v}</option>`).join('') +
        `<option value="__custom__">+ Enter other village...</option>`;
      villageSelect.disabled = false;
      pinInput.value = matched.pincode;
    }
  });

  // Auto-detect pincode typing
  pinInput.addEventListener('input', (e) => {
    const pin = e.target.value.trim();
    if (pin.length === 6) {
      handlePincodeLookup(pin);
    }
  });
}

function handlePincodeLookup(pin) {
  const found = GAON_DATA.locations.find(l => l.pincode === pin);
  const feedback = document.getElementById('pincodeFeedback');
  const stateSelect = document.getElementById('stateSelect');
  const districtSelect = document.getElementById('districtSelect');
  const blockSelect = document.getElementById('blockSelect');
  const villageSelect = document.getElementById('villageSelect');

  if (found) {
    feedback.innerHTML = `<span style="color:#15803d; font-weight:700;">✓ Found: ${found.block} Block, ${found.district} (${found.state})</span>`;
    stateSelect.value = found.state;
    
    districtSelect.innerHTML = `<option value="${found.district}">${found.district}</option>`;
    districtSelect.value = found.district;
    districtSelect.disabled = false;

    blockSelect.innerHTML = `<option value="${found.block}">${found.block}</option>`;
    blockSelect.value = found.block;
    blockSelect.disabled = false;

    villageSelect.innerHTML = `<option value="">-- ${t('selectOption')} --</option>` + 
      found.villages.map(v => `<option value="${v}">${v}</option>`).join('') +
      `<option value="__custom__">+ Enter other village...</option>`;
    villageSelect.value = found.villages[0];
    villageSelect.disabled = false;
  } else {
    feedback.innerHTML = `<span style="color:#b45309;">PIN ${pin} verified! You can specify your village name below.</span>`;
  }
}

function selectDemoVillage(pin, villageName) {
  const loc = GAON_DATA.locations.find(l => l.pincode === pin);
  const finalLoc = {
    pincode: pin,
    state: loc ? loc.state : 'Uttar Pradesh',
    district: loc ? loc.district : 'Sonbhadra',
    block: loc ? loc.block : 'Robertsganj',
    village: villageName || (loc ? loc.villages[0] : 'Sundarpur')
  };
  saveLocation(finalLoc);
  showToast(`Welcome to ${finalLoc.village} (${finalLoc.pincode})!`);
  navigateTo('home_hub');
}

function submitLocationForm(e) {
  e?.preventDefault();
  const pinInput = document.getElementById('pincodeInput').value.trim();
  const districtSelect = document.getElementById('districtSelect').value;
  const blockSelect = document.getElementById('blockSelect').value;
  let villageSelect = document.getElementById('villageSelect').value;
  const stateSelect = document.getElementById('stateSelect').value || 'Uttar Pradesh';

  if (!pinInput && !districtSelect) {
    showToast('Please enter either a Pincode OR District & Block', 'error');
    return;
  }

  if (villageSelect === '__custom__' || !villageSelect) {
    villageSelect = prompt('Enter your Village or Gram Panchayat name:', 'Sundarpur') || 'Sundarpur';
  }

  const finalLoc = {
    pincode: pinInput || '231216',
    state: stateSelect,
    district: districtSelect || 'Sonbhadra',
    block: blockSelect || 'Robertsganj',
    village: villageSelect || 'Sundarpur'
  };

  saveLocation(finalLoc);
  showToast(`Welcome to ${finalLoc.village} Village Portal!`);
  navigateTo('home_hub');
}

function autoDetectLocation() {
  const feedback = document.getElementById('pincodeFeedback');
  feedback.innerHTML = `<span style="color:#0369a1;">Detecting your village via GPS...</span>`;
  
  setTimeout(() => {
    selectDemoVillage('231216', 'Sundarpur');
    feedback.innerHTML = `<span style="color:#15803d; font-weight:700;">✓ Location detected: Sundarpur, Sonbhadra (PIN: 231216)</span>`;
  }, 700);
}

// ==========================================================================
// Language Switching
// ==========================================================================
function switchLang(lang) {
  AppState.currentLang = lang;
  localStorage.setItem('gaon_lang', lang);
  renderApp();
  showToast(lang === 'hi' ? 'भाषा: हिंदी चुनी गई' : 'Language set to English');
}

// ==========================================================================
// LOGOUT FUNCTIONALITY (User Request Requirement)
// ==========================================================================
function handleUserLogout() {
  if (!AppState.activeUserProfile) {
    showToast('You are already browsing as a guest');
    return;
  }

  const userName = AppState.activeUserProfile.name || 'User';
  const confirmMsg = `${t('logoutConfirm')} (${userName})`;

  if (confirm(confirmMsg)) {
    AppState.activeUserProfile = null;
    localStorage.removeItem('gaon_active_profile');
    showToast(AppState.currentLang === 'hi' ? 'सफलतापूर्वक लॉग आउट किया गया' : 'Logged out successfully');
    navigateTo('home_hub');
  }
}

// ==========================================================================
// Render Engine
// ==========================================================================
function renderApp() {
  // Update Header Lang Toggle Buttons
  const btnEn = document.getElementById('btnLangEn');
  const btnHi = document.getElementById('btnLangHi');
  if (btnEn && btnHi) {
    btnEn.className = `lang-btn ${AppState.currentLang === 'en' ? 'active' : ''}`;
    btnHi.className = `lang-btn ${AppState.currentLang === 'hi' ? 'active' : ''}`;
  }

  // Update Header Location, Role Badge & User Profile Bar
  renderLocationHeader();
  renderHeaderUserBar();
  renderHeaderRoleBadge();

  // Screens Visibility
  const screens = [
    'screenLocationGate',
    'screenHomeHub',
    'screenAllWork',
    'screenCategoryWorkers',
    'screenHireWorkers',
    'screenBazaar',
    'screenSellProduct',
    'screenProfileCreator',
    'screenShopOrders',
    'screenMnrega'
  ];

  screens.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.add('hidden');
  });

  // Toggle active screen
  const targetMap = {
    'location_gate': 'screenLocationGate',
    'home_hub': 'screenHomeHub',
    'all_work': 'screenAllWork',
    'category_workers': 'screenCategoryWorkers',
    'hire_workers': 'screenHireWorkers',
    'bazaar': 'screenBazaar',
    'sell_product': 'screenSellProduct',
    'profile_creator': 'screenProfileCreator',
    'shop_orders': 'screenShopOrders',
    'mnrega': 'screenMnrega'
  };

  const activeEl = document.getElementById(targetMap[AppState.activeScreen]);
  if (activeEl) {
    activeEl.classList.remove('hidden');
  }

  // Render role-specific bottom navigation
  renderBottomNav();

  // Render specific content for active screen
  switch (AppState.activeScreen) {
    case 'home_hub':
      renderHomeHub();
      break;
    case 'all_work':
      renderAllWorkCategories();
      break;
    case 'category_workers':
      renderCategoryWorkers();
      break;
    case 'hire_workers':
      renderHireWorkersList();
      break;
    case 'bazaar':
      renderGaonBazaar();
      break;
    case 'sell_product':
      renderSellProductForm();
      break;
    case 'profile_creator':
      renderDedicatedProfileScreen();
      break;
    case 'shop_orders':
      renderShopOrders();
      break;
    case 'mnrega':
      renderMnregaPortal();
      break;
  }

  updateCartBadge();
}

function renderLocationHeader() {
  const locTitle = document.getElementById('currentLocText');
  const locTitleTop = document.getElementById('currentLocTextTop');
  const pin = AppState.currentLocation?.pincode || '247667';
  const village = AppState.currentLocation?.village || 'Roorkee';
  if (locTitle) {
    if (AppState.currentLocation) {
      locTitle.textContent = `${AppState.currentLocation.village} village · ${AppState.currentLocation.district}`;
    } else {
      locTitle.textContent = `Select Village · [Your district]`;
    }
  }
  if (locTitleTop) {
    locTitleTop.textContent = `${village} · PIN ${pin}`;
  }
}

function speakCurrentScreen() {
  const role = AppState.currentRole || 'worker';
  if (role === 'worker') {
    speakWorkerProfile();
  } else if (role === 'hirer') {
    speakHirerProfile();
  } else if (role === 'store_manager') {
    speakStoreProfile();
  }
}

// Render Top Bar User Info & Logout Button
function renderHeaderUserBar() {
  const userContainer = document.getElementById('headerUserBadgeContainer');
  if (!userContainer) return;

  if (AppState.activeUserProfile) {
    const u = AppState.activeUserProfile;
    const defaultAvatar = u.role === 'store_manager' ? GAON_ASSETS.storeAvatar : (u.role === 'hirer' ? GAON_ASSETS.hirerAvatar : GAON_ASSETS.carpenterAvatar);
    const photoSrc = u.photo || defaultAvatar;

    const bg = u.role === 'store_manager' ? '#153243' : (u.role === 'hirer' ? '#3b2d13' : '#1b4332');
    const color = u.role === 'store_manager' ? '#38bdf8' : (u.role === 'hirer' ? '#fef08a' : '#4ade80');
    const border = u.role === 'store_manager' ? '#0284c7' : (u.role === 'hirer' ? '#eab308' : '#2d6a4f');
    userContainer.innerHTML = `
      <div class="header-user-badge" onclick="navigateTo('profile_creator')">
        ${getDummyAvatarHTML(u.name, 32, 12, bg, color, border)}
        <div class="header-user-info">
          <span class="header-user-name">${u.name}</span>
          <span class="header-user-role">${u.roleTitle || u.role}</span>
        </div>
      </div>
      <button type="button" class="btn-header-logout" onclick="handleUserLogout()" title="${t('logout')}">
        <span>🚪</span>
        <span>${t('logout')}</span>
      </button>
    `;
  } else {
    const isHi = AppState.currentLang === 'hi';
    userContainer.innerHTML = `
      <button type="button" class="btn-header-login" onclick="openLoginModal()" title="${isHi ? 'पहले से बने प्रोफाइल में लॉगिन करें' : 'Log in to existing profile'}">
        <span>🔑</span>
        <span>${isHi ? 'लॉग इन' : 'Log in'}</span>
      </button>
      <button type="button" class="btn-header-register" onclick="navigateTo('profile_creator')" title="${isHi ? 'नया प्रोफाइल बनाएं' : 'Create new profile'}">
        <span>➕</span>
        <span>${isHi ? 'रजिस्टर' : 'Register'}</span>
      </button>
    `;
  }
}

function renderHeaderRoleBadge() {
  const badge = document.getElementById('headerRoleBadge');
  const icon = document.getElementById('headerRoleBadgeIcon');
  const text = document.getElementById('headerRoleBadgeText');
  if (!badge || !icon || !text) return;

  const isHi = AppState.currentLang === 'hi';

  if (AppState.currentRole === 'worker') {
    icon.textContent = '👷';
    text.textContent = isHi ? 'कामगार मोड' : 'Worker';
    badge.style.background = 'rgba(34, 197, 94, 0.25)';
    badge.style.borderColor = '#86efac';
  } else if (AppState.currentRole === 'hirer') {
    icon.textContent = '👨‍🌾';
    text.textContent = isHi ? 'काम मालिक मोड' : 'Work Owner';
    badge.style.background = 'rgba(234, 179, 8, 0.25)';
    badge.style.borderColor = '#fde047';
  } else if (AppState.currentRole === 'store_manager') {
    icon.textContent = '🏪';
    text.textContent = isHi ? 'दुकानदार मोड' : 'Shop Owner';
    badge.style.background = 'rgba(14, 165, 233, 0.25)';
    badge.style.borderColor = '#7dd3fc';
  }
}

function renderBottomNav() {
  const bottomNav = document.getElementById('bottomNavBar');
  if (!bottomNav) return;

  if (AppState.activeScreen === 'location_gate') {
    bottomNav.classList.add('hidden');
    return;
  }
  bottomNav.classList.remove('hidden');

  const isHi = AppState.currentLang === 'hi';
  const role = AppState.currentRole;
  const screen = AppState.activeScreen;

  if (role === 'worker') {
    bottomNav.innerHTML = `
      <button class="nav-item-btn ${(screen === 'home_hub' || screen === 'all_work' || screen === 'category_workers') ? 'active' : ''}" onclick="navigateTo('home_hub')">
        <span class="nav-icon">💼</span>
        <span>${isHi ? 'काम खोजें' : 'Nearby Jobs'}</span>
      </button>
      <button class="nav-item-btn ${(screen === 'worker_attendance') ? 'active' : ''}" onclick="navigateTo('home_hub')">
        <span class="nav-icon">📋</span>
        <span>${isHi ? 'मेरी हाजिरी' : 'Attendance'}</span>
      </button>
      <button class="nav-item-btn ${screen === 'mnrega' ? 'active' : ''}" onclick="navigateTo('mnrega')">
        <span class="nav-icon">🏛️</span>
        <span>${isHi ? 'मनरेगा' : 'MGNREGA'}</span>
      </button>
      <button class="nav-item-btn ${screen === 'profile_creator' ? 'active' : ''}" onclick="navigateTo('profile_creator')">
        <span class="nav-icon">👤</span>
        <span>${isHi ? 'मेरी प्रोफ़ाइल' : 'My CV'}</span>
      </button>
      <button class="nav-item-btn" onclick="openRoleSwitcherModal()">
        <span class="nav-icon">🔄</span>
        <span>${isHi ? 'बदलें' : 'Switch Role'}</span>
      </button>
    `;
  } else if (role === 'hirer') {
    bottomNav.innerHTML = `
      <button class="nav-item-btn ${screen === 'home_hub' ? 'active' : ''}" onclick="navigateTo('home_hub')">
        <span class="nav-icon">👥</span>
        <span>${isHi ? 'हाजिरी रजिस्टर' : 'Attendance'}</span>
      </button>
      <button class="nav-item-btn" onclick="openPostJobModal()">
        <span class="nav-icon">➕</span>
        <span>${isHi ? 'काम पोस्ट' : 'Post Job'}</span>
      </button>
      <button class="nav-item-btn ${(screen === 'hire_workers' || screen === 'category_workers') ? 'active' : ''}" onclick="navigateTo('hire_workers')">
        <span class="nav-icon">🔍</span>
        <span>${isHi ? 'कारीगर' : 'Hire'}</span>
      </button>
      <button class="nav-item-btn ${screen === 'all_work' ? 'active' : ''}" onclick="navigateTo('all_work')">
        <span class="nav-icon">📋</span>
        <span>${isHi ? 'सभी काम' : 'Categories'}</span>
      </button>
      <button class="nav-item-btn" onclick="openRoleSwitcherModal()">
        <span class="nav-icon">🔄</span>
        <span>${isHi ? 'बदलें' : 'Switch Role'}</span>
      </button>
    `;
  } else if (role === 'store_manager') {
    bottomNav.innerHTML = `
      <button class="nav-item-btn ${screen === 'shop_orders' ? 'active' : ''}" onclick="navigateTo('shop_orders')">
        <span class="nav-icon">📦</span>
        <span>${isHi ? 'ऑर्डर' : 'Orders'}</span>
      </button>
      <button class="nav-item-btn ${(screen === 'home_hub' || screen === 'bazaar') ? 'active' : ''}" onclick="navigateTo('home_hub')">
        <span class="nav-icon">🏬</span>
        <span>${isHi ? 'दुकान' : 'Products'}</span>
      </button>
      <button class="nav-item-btn ${screen === 'sell_product' ? 'active' : ''}" onclick="navigateTo('sell_product')">
        <span class="nav-icon">＋</span>
        <span>${isHi ? 'सामान जोड़ें' : 'Add Item'}</span>
      </button>
      <button class="nav-item-btn ${screen === 'profile_creator' ? 'active' : ''}" onclick="navigateTo('profile_creator')">
        <span class="nav-icon">👤</span>
        <span>${isHi ? 'स्टोर प्रोफ़ाइल' : 'Shop Profile'}</span>
      </button>
      <button class="nav-item-btn" onclick="openRoleSwitcherModal()">
        <span class="nav-icon">🔄</span>
        <span>${isHi ? 'बदलें' : 'Switch Role'}</span>
      </button>
    `;
  }
}

function selectAppRole(role) {
  AppState.currentRole = role;
  localStorage.setItem('gaon_current_role', role);

  // Set default persona profile for the chosen role
  if (role === 'worker') {
    AppState.activeUserProfile = {
      name: "nkx k",
      phone: "+91 98077 00770",
      role: "worker",
      roleTitle: "Electrician",
      dailyRate: 450,
      experience: 3,
      village: AppState.currentLocation?.village || "Roorkee",
      bio: "Electrician with 3 years experience in village wiring, motor pumps, and household repairs.",
      workSites: [
        { siteName: "Roorkee Market Wiring", workType: "Electrical Installation", year: "2023" },
        { siteName: "Village Substation Connection", workType: "Main Line Repair", year: "2024" }
      ]
    };
  } else if (role === 'hirer') {
    AppState.activeUserProfile = {
      name: "Chaudhary Virendra Singh",
      phone: "+91 98210 55443",
      role: "hirer",
      roleTitle: "Work Owner (काम देने वाले)",
      photo: GAON_ASSETS.hirerAvatar,
      village: AppState.currentLocation?.village || "Sundarpur"
    };
  } else if (role === 'store_manager') {
    AppState.activeUserProfile = {
      name: "Radheshyam Sharma",
      shopName: "Sharma Beej Bhandar",
      shopCategory: "Seeds, Fertilizer & Farm Tools",
      phone: "+91 98210 55443",
      role: "store_manager",
      roleTitle: "Shop Owner (दुकानदार)",
      storePhoto: GAON_ASSETS.storeAvatar,
      village: AppState.currentLocation?.village || "Sundarpur"
    };
  }
  localStorage.setItem('gaon_active_profile', JSON.stringify(AppState.activeUserProfile));
  saveToRegisteredUsers(AppState.activeUserProfile);

  closeModal('modalRoleSwitcher');
  AppState.activeScreen = 'home_hub';
  renderApp();

  const isHi = AppState.currentLang === 'hi';
  const roleNames = {
    'worker': isHi ? '👷 कामगार पोर्टल सक्रिय (Worker Mode)' : '👷 Worker Portal Activated',
    'hirer': isHi ? '👨‍🌾 काम मालिक पोर्टल सक्रिय (Work Owner Mode)' : '👨‍🌾 Work Owner Portal Activated',
    'store_manager': isHi ? '🏪 दुकानदार पोर्टल सक्रिय (Shop Owner Mode)' : '🏪 Shop Owner Portal Activated'
  };
  showToast(roleNames[role] || 'Role updated');
}

function openRoleSwitcherModal() {
  const choices = ['roleChoiceWorker', 'roleChoiceHirer', 'roleChoiceStore'];
  choices.forEach(c => document.getElementById(c)?.classList.remove('active'));

  if (AppState.currentRole === 'worker') document.getElementById('roleChoiceWorker')?.classList.add('active');
  else if (AppState.currentRole === 'hirer') document.getElementById('roleChoiceHirer')?.classList.add('active');
  else if (AppState.currentRole === 'store_manager') document.getElementById('roleChoiceStore')?.classList.add('active');

  openModal('modalRoleSwitcher');
}

// ==========================================================================
// Screen 2: Dedicated Role-Based Home Hub (User Request)
// ==========================================================================

// Helper Functions for Role Sections, Profiles & Dummy Characters
function getInitials(name) {
  if (!name) return 'GK';
  const clean = name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'GK';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Dummy Characters Avatar Generator (User Request)
function getDummyAvatarHTML(name, size = 58, fontSize = 22, bg = '#1b4332', color = '#4ade80', border = '#2d6a4f') {
  const initials = getInitials(name);
  return `<div class="dummy-char-avatar" style="width:${size}px; height:${size}px; font-size:${fontSize}px; background:${bg}; color:${color}; border:2px solid ${border};">${initials}</div>`;
}

// Dummy Characters Site Badge Generator
function getDummySiteBadgeHTML(siteName, workType = '', size = 44) {
  const nameLower = (siteName || '').toLowerCase();
  const icon = nameLower.includes('school') ? '🏫' :
               nameLower.includes('temple') || nameLower.includes('mandir') ? '🛕' :
               nameLower.includes('wall') || nameLower.includes('plaster') ? '🧱' :
               nameLower.includes('wire') || nameLower.includes('electric') ? '⚡' : '📍';
  const tag = (siteName || 'WRK').replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase() || 'WRK';
  return `
    <div style="width:${size}px; height:${size}px; border-radius:8px; background:#1b4332; border:1.5px solid #2d6a4f; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#4ade80; flex-shrink:0;">
      <span style="font-size:${Math.round(size * 0.36)}px; line-height:1;">${icon}</span>
      <span style="font-size:${Math.round(size * 0.2)}px; font-weight:800; color:#86efac; letter-spacing:0.5px;">${tag}</span>
    </div>
  `;
}

// Dummy Characters Product Badge Generator
function getDummyProductBadgeHTML(name, category = '', height = 80) {
  const lower = ((name || '') + ' ' + (category || '')).toLowerCase();
  const icon = lower.includes('seed') || lower.includes('beej') || lower.includes('wheat') ? '🌾' :
               lower.includes('urea') || lower.includes('khad') || lower.includes('dap') ? '🌱' :
               lower.includes('pesticide') || lower.includes('spray') || lower.includes('neem') ? '🧪' :
               lower.includes('tool') || lower.includes('kudal') || lower.includes('spade') || lower.includes('axe') ? '🛠️' :
               lower.includes('pipe') || lower.includes('pump') ? '🚰' : '📦';
  const tag = (name || 'PRD').replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase() || 'ITEM';
  return `
    <div class="dummy-char-product" style="width:100%; height:${height}px; margin-bottom:8px;">
      <span style="font-size:${Math.round(height * 0.34)}px; line-height:1;">${icon}</span>
      <span style="font-size:11px; font-weight:800; letter-spacing:1px; color:#f8fafc;">${tag}</span>
    </div>
  `;
}

function speakText(text) {
  if (!('speechSynthesis' in window)) {
    showToast('Voice playback is not supported on this browser');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = AppState.currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
  showToast(AppState.currentLang === 'hi' ? '🔊 आवाज में सुनाया जा रहा है...' : '🔊 Reading aloud...');
}

function speakWorkerProfile() {
  const isHi = AppState.currentLang === 'hi';
  const u = AppState.activeUserProfile || {
    name: "nkx k",
    roleTitle: "Electrician",
    dailyRate: 450,
    experience: 3,
    village: AppState.currentLocation?.village || "Roorkee",
    phone: "+91 98077 00770"
  };
  const text = isHi ?
    `${u.name}, ${u.roleTitle || 'कारीगर'}, अनुभव ${u.experience || 3} वर्ष। दैनिक दर ₹${u.dailyRate || 450} प्रति दिन। स्थान ${u.village}। फ़ोन ${u.phone}। आस-पास के 25 किलोमीटर तक काम के लिए उपलब्ध हैं।` :
    `${u.name}, ${u.roleTitle || 'Electrician'}, experience ${u.experience || 3} years. Daily rate ₹${u.dailyRate || 450} per day. Location ${u.village}. Phone ${u.phone}. Available within 25 kilometers.`;
  speakText(text);
}

function speakHirerProfile() {
  const isHi = AppState.currentLang === 'hi';
  const u = AppState.activeUserProfile || {
    name: "Chaudhary Virendra Singh",
    roleTitle: "Work Owner",
    village: AppState.currentLocation?.village || "Sundarpur"
  };
  const text = isHi ?
    `${u.name}, काम मालिक, स्थान ${u.village}। सक्रिय मजदूर टीम ${AppState.hiredWorkers.length} मजदूर। नए मजदूरों की भर्ती जारी है।` :
    `${u.name}, Work Owner at ${u.village}. Active team ${AppState.hiredWorkers.length} hired workers. Actively hiring.`;
  speakText(text);
}

function speakStoreProfile() {
  const isHi = AppState.currentLang === 'hi';
  const u = AppState.activeUserProfile || {
    name: "Radheshyam Sharma",
    shopName: "Sharma Beej Bhandar",
    shopCategory: "Seeds, Fertilizers & Farm Tools",
    village: AppState.currentLocation?.village || "Sundarpur"
  };
  const text = isHi ?
    `${u.shopName}, संचालक ${u.name}, श्रेणी ${u.shopCategory}। स्थान ${u.village} मुख्य बाजार। कुल उत्पाद ${AppState.products.length}। दुकान खुली है।` :
    `${u.shopName}, managed by ${u.name}, category ${u.shopCategory}. Located at ${u.village} Main Market. ${AppState.products.length} products listed. Shop is open.`;
  speakText(text);
}

function setRoleSectionTab(role, tabKey) {
  if (!AppState.roleSectionTabs) AppState.roleSectionTabs = {};
  AppState.roleSectionTabs[role] = tabKey;
  localStorage.setItem('gaon_role_section_tabs', JSON.stringify(AppState.roleSectionTabs));
  renderHomeHub();
}

function setRoleStatus(role, statusKey) {
  if (!AppState.roleStatuses) AppState.roleStatuses = {};
  AppState.roleStatuses[role] = statusKey;
  localStorage.setItem('gaon_role_statuses', JSON.stringify(AppState.roleStatuses));

  const isHi = AppState.currentLang === 'hi';
  const messages = {
    worker: {
      available: isHi ? '🟢 आप उपलब्ध हैं! ग्राहक आपको सीधे कॉल कर सकते हैं।' : '🟢 Available! Customers near you can call you directly.',
      occupied: isHi ? '🟡 आप व्यस्त हैं। ग्राहक आपको काम खत्म होने के बाद कॉल करेंगे।' : '🟡 Marked as Busy on Job.',
      unavailable: isHi ? '⚪ आप अनुपलब्ध हैं।' : '⚪ Marked as Unavailable.'
    },
    hirer: {
      hiring: isHi ? '🟢 मजदूर चाहिए! आस-पास के कारीगर संपर्क करेंगे।' : '🟢 Actively Hiring! Workers near you can contact you.',
      in_progress: isHi ? '🟡 काम जारी है।' : '🟡 Work in Progress.',
      no_work: isHi ? '⚪ अभी काम पूरा हो चुका है।' : '⚪ No active hiring currently.'
    },
    store_manager: {
      open: isHi ? '🟢 दुकान खुली है! ग्राहक सामान ऑर्डर कर सकते हैं।' : '🟢 Shop is Open for walk-in and orders.',
      delivery: isHi ? '🟡 केवल होम डिलीवरी उपलब्ध है।' : '🟡 Delivery Only mode active.',
      closed: isHi ? '🔴 दुकान आज बंद है।' : '🔴 Shop is Closed today.'
    }
  };

  const msg = (messages[role] && messages[role][statusKey]) || 'Status updated!';
  showToast(msg);
  renderHomeHub();
}

function removeUserProfile() {
  const isHi = AppState.currentLang === 'hi';
  if (confirm(isHi ? 'क्या आप सचमुच अपनी प्रोफाइल हटाना चाहते हैं?' : 'Are you sure you want to remove your profile?')) {
    AppState.activeUserProfile = null;
    localStorage.removeItem('gaon_active_profile');
    showToast(isHi ? 'प्रोफाइल हटा दी गई। आप कभी भी नई प्रोफाइल बना सकते हैं।' : 'Profile removed. You can create a new profile anytime.');
    renderApp();
  }
}

function renderHomeHub() {
  const container = document.getElementById('homeHubContent');
  if (!container) return;

  const isHi = AppState.currentLang === 'hi';
  const role = AppState.currentRole || 'worker';

  // Apply dark theme class to container for rural slate styling matching screenshot
  const mainCurved = document.querySelector('.main-curved-content');
  if (mainCurved) {
    mainCurved.classList.add('dark-portal-theme');
  }

  // 3-Button Role Mode Selector Bar
  const roleTabsHtml = `
    <div class="role-mode-selector-bar" style="margin-bottom:14px; background:#13251c; border:1px solid #1f3d2c;">
      <button class="role-tab-btn ${role === 'worker' ? 'active worker' : ''}" style="${role === 'worker' ? 'background:#1b4332; color:#4ade80; border:1px solid #22c55e;' : 'color:#94a3b8;'}" onclick="selectAppRole('worker')">
        👷 ${isHi ? 'कामगार मोड' : 'Worker'}
      </button>
      <button class="role-tab-btn ${role === 'hirer' ? 'active hirer' : ''}" style="${role === 'hirer' ? 'background:#1b4332; color:#4ade80; border:1px solid #22c55e;' : 'color:#94a3b8;'}" onclick="selectAppRole('hirer')">
        👨‍🌾 ${isHi ? 'काम मालिक' : 'Work Owner'}
      </button>
      <button class="role-tab-btn ${role === 'store_manager' ? 'active store_manager' : ''}" style="${role === 'store_manager' ? 'background:#1b4332; color:#4ade80; border:1px solid #22c55e;' : 'color:#94a3b8;'}" onclick="selectAppRole('store_manager')">
        🏪 ${isHi ? 'दुकानदार' : 'Shop Owner'}
      </button>
    </div>
  `;

  let roleContentHtml = '';
  if (role === 'worker') {
    roleContentHtml = renderWorkerDashboard();
  } else if (role === 'hirer') {
    roleContentHtml = renderHirerDashboard();
  } else if (role === 'store_manager') {
    roleContentHtml = renderShopOwnerDashboard();
  }

  container.innerHTML = `
    ${roleTabsHtml}
    ${roleContentHtml}

    <!-- Speak Instead of Typing Button (Page 1) -->
    <button class="speak-voice-btn" style="margin-top:20px; background:#13251c; border:1.5px solid #1f3d2c; color:#f8fafc;" onclick="openVoiceAssistant()">
      <span class="mic-icon">🎙️</span>
      <span>${t('speakBtn')}</span>
    </button>

    <!-- Already Registered Link (Page 1) -->
    <div class="login-link-row" style="color:#94a3b8;">
      <span>${AppState.currentLang === 'hi' ? 'पहले से पंजीकृत हैं?' : 'Already registered?'}</span>
      <a style="color:#4ade80; cursor:pointer;" onclick="openLoginModal()">${AppState.currentLang === 'hi' ? 'फ़ोन से लॉग इन करें' : 'Log in with phone'}</a>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 1. DEDICATED WORKER DASHBOARD (Matching User Screenshot Layout)
// --------------------------------------------------------------------------
function renderWorkerDashboard() {
  const isHi = AppState.currentLang === 'hi';
  const u = AppState.activeUserProfile || {
    name: "nkx k",
    roleTitle: "Electrician",
    dailyRate: 450,
    experience: 3,
    village: AppState.currentLocation?.village || "Roorkee",
    phone: "+91 98077 00770",
    workSites: [
      { siteName: "Roorkee Market Wiring", workType: "Electrical Installation", year: "2023", photo: GAON_ASSETS.siteSchoolWallPhoto },
      { siteName: "Village Substation Connection", workType: "Main Line Repair", year: "2024", photo: GAON_ASSETS.siteTempleDoorPhoto }
    ]
  };

  const status = (AppState.roleStatuses && AppState.roleStatuses.worker) || 'available';
  const activeTab = (AppState.roleSectionTabs && AppState.roleSectionTabs.worker) || 'profile';

  const statusLabels = {
    available: isHi ? 'उपलब्ध' : 'Available',
    occupied: isHi ? 'व्यस्त' : 'Occupied',
    unavailable: isHi ? 'अनुपलब्ध' : 'Unavailable'
  };
  const activeStatusLabel = statusLabels[status] || 'Available';
  const initials = getInitials(u.name);

  // Status Card HTML
  const statusCardHtml = `
    <div class="role-status-card">
      <div class="role-status-header">
        <div>
          <div class="role-status-title">${isHi ? 'मेरी स्थिति अभी' : 'My status right now'}</div>
          <div class="role-status-subtitle">${isHi ? 'बदलने के लिए टैप करें। ग्राहक तुरंत देखेंगे।' : 'Tap to change. Customers see it straight away.'}</div>
        </div>
      </div>
      <div class="role-status-pills-row">
        <button type="button" class="role-status-pill ${status === 'available' ? 'active available' : ''}" onclick="setRoleStatus('worker', 'available')">
          <span class="role-status-dot"></span>
          <span>${isHi ? 'उपलब्ध' : 'Available'}</span>
        </button>
        <button type="button" class="role-status-pill ${status === 'occupied' ? 'active occupied' : ''}" onclick="setRoleStatus('worker', 'occupied')">
          <span class="role-status-dot"></span>
          <span>${isHi ? 'व्यस्त' : 'Occupied'}</span>
        </button>
        <button type="button" class="role-status-pill ${status === 'unavailable' ? 'active unavailable' : ''}" onclick="setRoleStatus('worker', 'unavailable')">
          <span class="role-status-dot"></span>
          <span>${isHi ? 'अनुपलब्ध' : 'Unavailable'}</span>
        </button>
      </div>
    </div>
  `;

  // Horizontal Section Tabs Bar (Matching Screenshot)
  const tabsBarHtml = `
    <div class="role-section-tabs-bar">
      <button type="button" class="role-section-tab ${activeTab === 'profile' ? 'active' : ''}" onclick="setRoleSectionTab('worker', 'profile')">
        ${isHi ? 'मेरी प्रोफ़ाइल' : 'My profile'}
      </button>
      <button type="button" class="role-section-tab ${activeTab === 'jobs' ? 'active' : ''}" onclick="setRoleSectionTab('worker', 'jobs')">
        ${isHi ? 'आस-पास के काम' : 'Jobs near me'}
        <span class="role-tab-badge">${(AppState.jobs || []).length}</span>
      </button>
      <button type="button" class="role-section-tab ${activeTab === 'nrega' ? 'active' : ''}" onclick="setRoleSectionTab('worker', 'nrega')">
        ${isHi ? 'मनरेगा काम' : 'NREGA works'}
      </button>
      <button type="button" class="role-section-tab ${activeTab === 'attendance' ? 'active' : ''}" onclick="setRoleSectionTab('worker', 'attendance')">
        ${isHi ? 'हाजिरी' : 'Attendance'}
      </button>
    </div>
  `;

  // Content for Active Tab
  let tabContentHtml = '';

  if (activeTab === 'profile') {
    if (!AppState.activeUserProfile) {
      // Guest / Logged Out View with Login & Register Options
      tabContentHtml = `
        <div class="account-access-card">
          <div style="font-size:38px; margin-bottom:8px;">🔒</div>
          <h3 class="account-access-title">${isHi ? 'आप अभी लॉग आउट हैं (अतिथि मोड)' : 'You are currently logged out'}</h3>
          <p class="account-access-sub">${isHi ? 'क्या आपने पहले अपनी कारीगर प्रोफ़ाइल बनाई थी? अपनी हाजिरी, दैनिक मजदूरी, और ग्राहक कॉल्स देखने के लिए अपने मोबाइल नंबर से तुरंत लॉग इन करें।' : 'Created your profile before? Log in with your mobile number to view your daily attendance, earnings, and manage your work profile.'}</p>

          <div class="account-access-actions">
            <button type="button" class="btn-hire-primary" style="background:#16a34a; border:none; padding:11px 22px; border-radius:9px; color:#fff; font-size:14px; font-weight:800; cursor:pointer;" onclick="openLoginModal()">
              🔑 ${isHi ? 'फ़ोन नंबर से लॉग इन करें' : 'Log in with Mobile Number'}
            </button>
            <button type="button" class="role-status-pill" style="padding:11px 18px; font-size:13px; background:#0d1912; border-color:#1f3d2c; color:#f8fafc;" onclick="navigateTo('profile_creator')">
              ➕ ${isHi ? 'नई प्रोफ़ाइल बनाएं' : 'Create New Profile'}
            </button>
          </div>

          <div style="margin-top:16px; border-top:1px solid #1f3d2c; padding-top:14px;">
            <span style="font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:8px;">
              ⚡ ${isHi ? 'पहले से बने प्रोफाइल में त्वरित लॉगिन (1-क्लिक):' : 'Quick 1-Click Login for Existing Profiles:'}
            </span>
            <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
              <button type="button" class="demo-login-chip" onclick="quickLoginWithPhone('9807700770')">
                👷 <strong>nkx k</strong> (Electrician · 98077 00770)
              </button>
              <button type="button" class="demo-login-chip" onclick="quickLoginWithPhone('9876543210')">
                👷 <strong>Ramesh Sharma</strong> (Mason · 98765 43210)
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      // 2-Column Profile View for Logged-In Worker Matching Screenshot
      tabContentHtml = `
      <div class="role-profile-two-col">
        <!-- Left Column: Profile Details Card -->
        <div class="profile-details-card">
          <div class="profile-details-header">
            <div class="profile-avatar-circle">
              ${getDummyAvatarHTML(u.name, 58, 22, '#1b4332', '#4ade80', '#2d6a4f')}
            </div>
            <div class="profile-meta-main">
              <h3>${u.name}</h3>
              <div class="profile-meta-sub">${u.roleTitle || 'Electrician'} · ${u.experience || 3} yrs</div>
              <div class="profile-status-badge">
                <span class="role-status-dot" style="background:${status === 'available' ? '#22c55e' : (status === 'occupied' ? '#eab308' : '#ef4444')};"></span>
                <span>${activeStatusLabel}</span>
              </div>
            </div>
          </div>

          <!-- 2x2 Grid -->
          <div class="profile-2x2-grid">
            <div class="profile-grid-cell">
              <div class="profile-grid-label">${isHi ? 'दैनिक दर (₹)' : 'DAILY RATE (₹)'}</div>
              <div class="profile-grid-val">₹${u.dailyRate || 450}</div>
            </div>
            <div class="profile-grid-cell">
              <div class="profile-grid-label">${isHi ? 'फ़ोन' : 'PHONE'}</div>
              <div class="profile-grid-val">${u.phone || '+91 98077 00770'}</div>
            </div>
            <div class="profile-grid-cell">
              <div class="profile-grid-label">${isHi ? 'स्थान' : 'PLACE'}</div>
              <div class="profile-grid-val">${u.village || 'Roorkee'}, PIN ${AppState.currentLocation?.pincode || '247667'}</div>
            </div>
            <div class="profile-grid-cell">
              <div class="profile-grid-label">${isHi ? 'कितनी दूर जा सकते हैं?' : 'HOW FAR CAN YOU GO?'}</div>
              <div class="profile-grid-val">Nearby villages (25 km)</div>
            </div>
          </div>

          <!-- Work Sites & Photos -->
          <div style="margin-top:14px; border-top:1px solid #1f3d2c; padding-top:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:11.5px; font-weight:800; color:#94a3b8; text-transform:uppercase;">🏗️ ${isHi ? 'पूर्व कार्य स्थल व फ़ोटो' : 'Past Work Sites & Photos'}</span>
              <button class="role-change-btn" style="font-size:11.5px; margin:0;" onclick="navigateTo('profile_creator')">+ ${isHi ? 'फ़ोटो जोड़ें' : 'Add Photo'}</button>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${(u.workSites || []).map(s => `
                <div style="background:#0d1912; border:1px solid #1f3d2c; border-radius:10px; padding:8px 10px; display:flex; align-items:center; gap:10px;">
                  ${getDummySiteBadgeHTML(s.siteName, s.workType, 42)}
                  <div style="flex:1;">
                    <strong style="font-size:13px; color:#f8fafc;">${s.siteName}</strong>
                    <div style="font-size:11.5px; color:#94a3b8;">${s.workType} · ${s.year}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Listen Button -->
          <div style="margin-top:16px;">
            <button type="button" class="role-status-pill" style="width:auto; min-width:110px; background:#0d1912; border-color:#1f3d2c; color:#f8fafc;" onclick="speakWorkerProfile()">
              <span>🔊</span>
              <span>${isHi ? 'सुनें' : 'Listen'}</span>
            </button>
          </div>
        </div>

        <!-- Right Column: HOW OTHERS SEE YOU Preview Card -->
        <div class="profile-preview-card">
          <div class="preview-card-header-label">${isHi ? 'अन्य लोग आपकी प्रोफ़ाइल कैसे देखते हैं' : 'HOW OTHERS SEE YOU'}</div>
          
          <div class="preview-card-box">
            <div class="preview-card-top">
              <div class="preview-user-row">
                <div class="preview-avatar-mini">
                  ${getDummyAvatarHTML(u.name, 42, 16, '#1b4332', '#4ade80', '#2d6a4f')}
                </div>
                <div>
                  <div class="preview-name-row">
                    <span>${u.name}</span>
                    <span class="role-status-dot" style="background:#22c55e;"></span>
                  </div>
                  <div class="preview-sub-row">${u.roleTitle || 'Electrician'} · ${u.experience || 3} yrs</div>
                </div>
              </div>
              <div class="preview-rate-box">
                <div class="preview-rate-num">₹${u.dailyRate || 450}</div>
                <div class="preview-rate-label">${isHi ? 'प्रति दिन' : 'per day'}</div>
              </div>
            </div>

            <div class="preview-address-row">
              📍 ${u.village || 'Roorkee'}, PIN ${AppState.currentLocation?.pincode || '247667'}
            </div>

            <div class="preview-phone-row">
              <span>📞</span>
              <span>${u.phone || '+91 98077 00770'}</span>
            </div>

            <div style="margin-top:8px;">
              <span style="font-size:11px; font-weight:700; color:#4ade80; background:#1b3d2b; padding:2px 8px; border-radius:4px;">
                ● ${activeStatusLabel}
              </span>
            </div>
          </div>

          <div class="preview-actions-row">
            <button type="button" class="btn-profile-edit" onclick="navigateTo('profile_creator')">
              <span>✏️</span>
              <span>${isHi ? 'प्रोफ़ाइल संपादित करें' : 'Edit profile'}</span>
            </button>
            <button type="button" class="btn-profile-remove" onclick="removeUserProfile()">
              <span>🗑️</span>
              <span>${isHi ? 'प्रोफ़ाइल हटाएं' : 'Remove profile'}</span>
            </button>
          </div>
        </div>
      </div>
    `
    };
  } else if (activeTab === 'jobs') {
    // Jobs Near Me Listing
    const jobsList = AppState.jobs || [];
    tabContentHtml = `
      <div style="margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="font-size:16.5px; font-weight:800; color:#f8fafc; margin:0;">💼 ${isHi ? 'गाँव व आस-पास उपलब्ध काम' : 'Jobs Near Me'}</h3>
            <p style="font-size:12px; color:#94a3b8; margin:2px 0 0 0;">${jobsList.length} ${isHi ? 'मालिकों को तुरंत कारीगरों की जरूरत है' : 'hirers looking for workers nearby'}</p>
          </div>
          <button class="role-change-btn" style="margin:0;" onclick="navigateTo('all_work')">${isHi ? 'सभी देखें ›' : 'View All ›'}</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          ${jobsList.map(job => `
            <div class="worker-job-card" style="background:#13251c; border:1.5px solid #1f3d2c; border-radius:12px; padding:14px;">
              <div class="worker-job-header" style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div class="worker-job-title" style="font-size:15px; font-weight:800; color:#f8fafc;">${isHi ? (job.titleHi || job.title) : job.title}</div>
                  <div style="font-size:12px; color:#94a3b8; margin-top:2px;">
                    👤 ${job.hirerName} · 📍 ${job.village}
                  </div>
                </div>
                <div class="worker-job-wage-box" style="text-align:right;">
                  <div class="worker-job-wage" style="font-size:16px; font-weight:800; color:#4ade80;">₹${job.dailyWage}</div>
                  <div style="font-size:10px; color:#94a3b8;">${isHi ? 'प्रति दिन' : 'per day'}</div>
                </div>
              </div>

              <div class="worker-job-meta-row" style="display:flex; gap:6px; margin:10px 0; flex-wrap:wrap;">
                <span class="worker-job-meta-pill" style="background:#0d1912; border:1px solid #1f3d2c; color:#94a3b8; font-size:11px; padding:3px 8px; border-radius:6px;">👥 ${job.workersCount} ${isHi ? 'मजदूर' : 'needed'}</span>
                <span class="worker-job-meta-pill" style="background:#0d1912; border:1px solid #1f3d2c; color:#94a3b8; font-size:11px; padding:3px 8px; border-radius:6px;">⏱️ ${job.duration}</span>
                <span class="worker-job-meta-pill" style="background:#0d1912; border:1px solid #1f3d2c; color:#38bdf8; font-size:11px; padding:3px 8px; border-radius:6px;">✓ ${job.postedTime}</span>
              </div>

              ${job.notes ? `<div style="font-size:12px; color:#94a3b8; background:#0d1912; border-radius:8px; padding:8px 10px; margin-bottom:10px;">📝 ${job.notes}</div>` : ''}

              <div class="worker-job-actions" style="display:flex; gap:10px;">
                <button class="btn-hire-primary" style="flex:1; background:#16a34a; border:none; padding:8px 14px; border-radius:8px; color:#fff; font-weight:700; cursor:pointer;" onclick="applyForWorkerJob('${job.id}', '${job.hirerName}', '${job.hirerPhone}')">
                  ✓ ${isHi ? 'आवेदन करें' : 'Apply for Job'}
                </button>
                <button class="role-status-pill" style="flex:1; background:#0d1912; border-color:#1f3d2c; color:#f8fafc;" onclick="openCallDialog('${job.hirerName}', '${job.hirerPhone}', 'Work Hirer')">
                  📞 ${isHi ? 'मालिक को कॉल करें' : 'Call Hirer'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (activeTab === 'nrega') {
    // NREGA Works: Number and name of MNREGA workers available for both; other persons' attendance counts visible only by Work Owner
    const att = AppState.workerAttendance || GAON_DATA.initialWorkerAttendance;
    const village = AppState.currentLocation?.village || 'Sundarpur';
    let mnregaWorkers = AppState.mnregaWorkers.filter(w => (w.village || '').toLowerCase() === village.toLowerCase());
    if (mnregaWorkers.length === 0) mnregaWorkers = AppState.mnregaWorkers;

    const myMnregaQueries = (AppState.attendanceQueries || []).filter(q => q.category === 'mnrega');

    tabContentHtml = `
      <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:18px;">
        
        <!-- Scheme Overview & Worker's Personal Numbers -->
        <div style="background:#13251c; border:1.5px solid #22c55e; border-radius:14px; padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div>
              <span style="font-size:11px; font-weight:800; color:#4ade80; text-transform:uppercase; letter-spacing:0.5px;">🏛️ ${isHi ? 'मनरेगा सरकारी कार्य (पंचायती काम)' : 'MGNREGA Govt Works'}</span>
              <h3 style="font-size:17px; font-weight:800; color:#f8fafc; margin:4px 0 2px 0;">
                ${isHi ? att.mnregaLinked?.projectNameHi : att.mnregaLinked?.projectName}
              </h3>
              <p style="font-size:12px; color:#94a3b8; margin:0;">
                📍 ${village} Purana Pokhra · Code: UP-SON-2026-0891
              </p>
            </div>
            <span style="background:#1b4332; border:1px solid #22c55e; color:#4ade80; font-size:12px; font-weight:800; padding:4px 10px; border-radius:8px;">
              ₹${att.mnregaLinked?.wage || 260} / ${isHi ? 'दिन' : 'day'}
            </span>
          </div>

          <!-- Role-Based Privacy Notice -->
          <div class="restricted-role-banner" style="margin:10px 0;">
            <span style="font-size:18px;">🔒</span>
            <div>
              <strong>${isHi ? 'मनरेगा हाजिरी केवल कार्य मालिक / पंचायत मेट द्वारा प्रबंधित है' : 'MGNREGA Attendance Handled Solely by Work Owner / Mate'}</strong>
              <p>${isHi ? 'अन्य व्यक्तियों की दैनिक हाजिरी केवल कार्य मालिक देख सकते हैं। आप अपनी व्यक्तिगत उपस्थिति संख्या व गाँव के सभी श्रमिकों के नाम व कुल संख्या नीचे देख सकते हैं।' : 'Other workers’ daily attendance counts are visible only to the Work Owner / Mate. Your personal attendance numbers and all registered worker names & counts are available for both.'}</p>
            </div>
          </div>

          <!-- Worker's Personal Attendance Numbers (Only Present and Absent Numbers) -->
          <div class="hired-stats-summary-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin:12px 0;">
            <div class="hired-stat-card present" style="background:#0d1912; border:1px solid #22c55e; border-radius:10px; padding:10px; text-align:center;">
              <span class="hired-stat-val" style="font-size:17px; font-weight:800; color:#4ade80; display:block;">✓ 24 ${isHi ? 'दिन' : 'Days'}</span>
              <span class="hired-stat-label" style="font-size:11px; color:#94a3b8;">${isHi ? 'मेरी उपस्थिति (Present)' : 'My Present Days'}</span>
            </div>
            <div class="hired-stat-card absent" style="background:#0d1912; border:1px solid #ef4444; border-radius:10px; padding:10px; text-align:center;">
              <span class="hired-stat-val" style="font-size:17px; font-weight:800; color:#f87171; display:block;">✕ 2 ${isHi ? 'दिन' : 'Days'}</span>
              <span class="hired-stat-label" style="font-size:11px; color:#94a3b8;">${isHi ? 'मेरी अनुपस्थिति (Absent)' : 'My Absent Days'}</span>
            </div>
            <div class="hired-stat-card wages" style="background:#0d1912; border:1px solid #38bdf8; border-radius:10px; padding:10px; text-align:center;">
              <span class="hired-stat-val" style="font-size:17px; font-weight:800; color:#38bdf8; display:block;">₹6,240</span>
              <span class="hired-stat-label" style="font-size:11px; color:#94a3b8;">${isHi ? 'डीबीटी मजदूरी (DBT Paid)' : 'DBT Wages'}</span>
            </div>
          </div>

          <!-- Raise MNREGA Query Button -->
          <div style="display:flex; justify-content:space-between; align-items:center; background:#0d1912; border:1px dashed #f59e0b; border-radius:10px; padding:10px 12px; margin-top:8px;">
            <div style="font-size:12px; color:#cbd5e1;">
              ⚠️ ${isHi ? 'मनरेगा मस्टर रोल हाजिरी में कोई त्रुटि है?' : 'Dispute in MNREGA muster attendance?'}
            </div>
            <button type="button" class="btn-hire-primary" style="background:#f59e0b; color:#0f172a; font-size:12px; font-weight:800; border:none; padding:6px 12px; border-radius:7px; cursor:pointer;" onclick="openAttendanceQueryModal('mnrega')">
              🙋‍♂️ ${isHi ? 'सुधार अनुरोध भेजें' : 'Raise Query'}
            </button>
          </div>

          <!-- Worker's Raised MNREGA Queries -->
          ${myMnregaQueries.length > 0 ? `
            <div style="margin-top:10px; padding-top:10px; border-top:1px solid #1f3d2c;">
              <div style="font-size:12px; font-weight:700; color:#f8fafc; margin-bottom:6px;">
                📋 ${isHi ? 'मेरे मनरेगा हाजिरी सुधार अनुरोध:' : 'My MNREGA Correction Queries:'}
              </div>
              ${myMnregaQueries.map(q => `
                <div class="query-item-card" style="padding:8px 10px; margin-bottom:6px;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="font-size:12px; color:#f8fafc;">📅 ${q.date}</strong>
                    <span class="query-status-badge ${q.status}">${q.status === 'resolved' ? '✓ ' + (isHi ? 'सुधार स्वीकृत' : 'Resolved') : '⏳ ' + (isHi ? 'विचाराधीन' : 'Pending')}</span>
                  </div>
                  <div style="font-size:11.5px; color:#94a3b8; margin-top:3px;">${q.reason}</div>
                  ${q.resolutionNote ? `
                    <div style="font-size:11px; color:#4ade80; background:#1b4332; border-radius:6px; padding:4px 8px; margin-top:4px;">
                      💬 ${q.resolutionNote}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Registered MNREGA Workers Directory (Available for Both Worker and Work Owner) -->
        <div style="background:#13251c; border:1.5px solid #1f3d2c; border-radius:14px; padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div>
              <h3 style="font-size:15.5px; font-weight:800; color:#f8fafc; margin:0;">
                👥 ${isHi ? 'गाँव के पंजीकृत मनरेगा मज़दूर' : 'Registered MNREGA Workers'}
              </h3>
              <p style="font-size:11.5px; color:#94a3b8; margin:2px 0 0 0;">
                ${isHi ? 'श्रमिकों के नाम व संख्या दोनों के लिए उपलब्ध है · अन्य व्यक्तियों की दैनिक हाजिरी केवल कार्य मालिक के लिए उपलब्ध है' : 'Worker names & counts are available for both · Daily attendance counts restricted to Work Owner'}
              </p>
            </div>
            <span style="background:#1b4332; border:1px solid #22c55e; color:#4ade80; font-size:12.5px; font-weight:800; padding:4px 10px; border-radius:20px;">
              ${mnregaWorkers.length} ${isHi ? 'मज़दूर पंजीकृत' : 'Workers'}
            </span>
          </div>

          <!-- Roster of MNREGA Workers (Names and Job Card Numbers Available for Both) -->
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${mnregaWorkers.map(w => `
              <div class="mnrega-worker-card">
                <div class="mnrega-worker-left">
                  <div class="worker-avatar-badge">
                    ${getDummyAvatarHTML(w.name, 38, 14, '#1b4332', '#4ade80', '#2d6a4f')}
                  </div>
                  <div class="mnrega-worker-meta">
                    <h4>${w.name}</h4>
                    <div class="jobcard">🪪 ${w.jobCardNo}</div>
                    <div class="category">${w.category || 'Unskilled'} · ${w.village}</div>
                  </div>
                </div>
                <div style="text-align:right;">
                  <span style="font-size:11px; font-weight:700; color:#4ade80; background:#1b4332; padding:3px 8px; border-radius:6px; border:1px solid #22c55e;">
                    ✓ Job Card Active
                  </span>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn-hire-primary" style="width:100%; margin-top:14px; background:#16a34a; border:none; padding:10px 14px; border-radius:8px; color:#fff; font-weight:700; cursor:pointer;" onclick="navigateTo('mnrega')">
            🏛️ ${isHi ? 'संपूर्ण मनरेगा सरकारी पोर्टल खोलें ›' : 'Open Complete MNREGA Portal ›'}
          </button>
        </div>

      </div>
    `;
  } else if (activeTab === 'attendance') {
    // Attendance & Daily Earnings (Strictly Role-Based: Worker only sees present & absent count, cannot mark, can raise query)
    const att = AppState.workerAttendance || GAON_DATA.initialWorkerAttendance;
    const pCount = (att.history || []).filter(h => h.status === 'P').length;
    const aCount = (att.history || []).filter(h => h.status === 'A').length;
    const earnedWage = pCount * (att.dailyWage || 450);

    // Filter queries raised by this worker for this employer
    const myQueries = (AppState.attendanceQueries || []).filter(q => q.category === 'private');

    tabContentHtml = `
      <div class="worker-attendance-history-card" style="background:#13251c; border:1.5px solid #1f3d2c; border-radius:14px; padding:16px;">
        
        <!-- Role Permission Policy Notice -->
        <div class="restricted-role-banner">
          <span style="font-size:18px;">🔒</span>
          <div>
            <strong>${isHi ? 'हाजिरी प्रबंधन केवल काम मालिक द्वारा किया जाता है' : 'Attendance Register Managed Solely by Work Owner'}</strong>
            <p>${isHi ? 'आप यहाँ केवल अपनी कुल उपस्थिति (Present) व अनुपस्थिति (Absent) की संख्या देख सकते हैं। यदि किसी दिन की हाजिरी गलत दर्ज हुई है तो नीचे से सुधार अनुरोध (Query) दर्ज करें।' : 'As a worker, you can view your verified present & absent summary numbers and raise a correction query if any day is marked incorrectly.'}</p>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div>
            <strong style="font-size:15.5px; color:#f8fafc;">🏗️ ${isHi ? (att.projectTitleHi || att.projectTitle) : att.projectTitle}</strong>
            <p style="font-size:12px; color:#94a3b8; margin:2px 0 0 0;">
              ${isHi ? 'काम मालिक:' : 'Work Owner:'} <strong>${att.employerName}</strong> (📞 ${att.employerPhone})
            </p>
            <p style="font-size:11.5px; color:#64748b; margin:2px 0 0 0;">
              ${isHi ? 'तय दैनिक मजदूरी:' : 'Daily Wage Rate:'} ₹${att.dailyWage || 450}/day
            </p>
          </div>
          <span style="font-size:11.5px; font-weight:800; padding:4px 10px; border-radius:6px; background:#1b4332; color:#4ade80; border:1px solid #22c55e;">
            ✓ ${isHi ? 'आज उपस्थित (P)' : 'Today: Present'}
          </span>
        </div>

        <!-- Attendance Stats KPI Grid (Worker can ONLY see present and absent count) -->
        <div class="hired-stats-summary-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin:14px 0;">
          <div class="hired-stat-card present" style="background:#0d1912; border:1px solid #22c55e; border-radius:10px; padding:10px; text-align:center;">
            <span class="hired-stat-val" style="font-size:18px; font-weight:800; color:#4ade80; display:block;">✓ ${pCount} ${isHi ? 'दिन' : 'Days'}</span>
            <span class="hired-stat-label" style="font-size:11px; color:#94a3b8;">${isHi ? 'कुल उपस्थित (Present)' : 'Total Present'}</span>
          </div>
          <div class="hired-stat-card absent" style="background:#0d1912; border:1px solid #ef4444; border-radius:10px; padding:10px; text-align:center;">
            <span class="hired-stat-val" style="font-size:18px; font-weight:800; color:#f87171; display:block;">✕ ${aCount} ${isHi ? 'दिन' : 'Days'}</span>
            <span class="hired-stat-label" style="font-size:11px; color:#94a3b8;">${isHi ? 'कुल अनुपस्थित (Absent)' : 'Total Absent'}</span>
          </div>
          <div class="hired-stat-card wages" style="background:#0d1912; border:1px solid #38bdf8; border-radius:10px; padding:10px; text-align:center;">
            <span class="hired-stat-val" style="font-size:18px; font-weight:800; color:#38bdf8; display:block;">₹${earnedWage.toLocaleString('en-IN')}</span>
            <span class="hired-stat-label" style="font-size:11px; color:#94a3b8;">${isHi ? 'कुल देय मजदूरी' : 'Earned Wages'}</span>
          </div>
        </div>

        <!-- Read-Only Attendance Timeline (P/A display only, no editing) -->
        <div style="background:#0d1912; border:1px solid #1f3d2c; border-radius:10px; padding:12px; margin-top:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:12px; font-weight:700; color:#94a3b8;">
              📅 ${isHi ? 'दैनिक उपस्थिति रिकॉर्ड (केवल पठन हेतु):' : 'Daily Attendance Log (Read-Only):'}
            </span>
            <span style="font-size:10.5px; color:#64748b;">🔒 ${isHi ? 'संपादन केवल मालिक द्वारा' : 'Editing locked by owner'}</span>
          </div>
          <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:6px;">
            ${(att.history || []).map(h => `
              <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:48px; height:52px; border-radius:8px; border:1.5px solid ${h.status === 'P' ? '#22c55e' : '#ef4444'}; background:${h.status === 'P' ? '#1b4332' : '#3b1c1c'}; color:${h.status === 'P' ? '#4ade80' : '#f87171'}; flex-shrink:0;">
                <span style="font-size:9.5px; opacity:0.8;">${h.date}</span>
                <span style="font-size:15px; font-weight:800;">${h.status === 'P' ? 'P' : 'A'}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Raise Query Action Button -->
        <div style="margin-top:14px; background:#0d1912; border:1px dashed #f59e0b; border-radius:10px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:13px; font-weight:800; color:#f8fafc;">
              ❓ ${isHi ? 'किसी दिन की हाजिरी में सुधार चाहिए?' : 'Need attendance correction for any date?'}
            </div>
            <div style="font-size:11.5px; color:#94a3b8;">
              ${isHi ? 'यदि आप उपस्थित थे लेकिन अनुपस्थित दर्ज हुआ, तो सीधे मालिक को सुधार अनुरोध भेजें।' : 'Submit a direct query to Work Owner Chaudhary Virendra Singh for review.'}
            </div>
          </div>
          <button type="button" class="btn-hire-primary" style="background:#f59e0b; color:#0f172a; font-weight:800; border:none; padding:8px 14px; border-radius:8px; cursor:pointer; flex-shrink:0;" onclick="openAttendanceQueryModal('private')">
            🙋‍♂️ ${isHi ? 'सुधार अनुरोध दर्ज करें' : 'Raise Query'}
          </button>
        </div>

        <!-- Worker's Raised Queries List -->
        ${myQueries.length > 0 ? `
          <div style="margin-top:14px; border-top:1px solid #1f3d2c; padding-top:12px;">
            <div style="font-size:12.5px; font-weight:800; color:#f8fafc; margin-bottom:8px;">
              📋 ${isHi ? 'मेरे द्वारा भेजे गए सुधार अनुरोध (Correction Requests):' : 'My Correction Queries:'}
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${myQueries.map(q => `
                <div class="query-item-card">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                    <div>
                      <strong style="font-size:13px; color:#f8fafc;">📅 ${q.date}</strong>
                      <span style="font-size:11px; color:#94a3b8; margin-left:6px;">(${q.createdAt})</span>
                    </div>
                    <span class="query-status-badge ${q.status}">
                      ${q.status === 'resolved' ? '✓ ' + (isHi ? 'सुधार स्वीकृत (P दर्ज)' : 'Approved (P Marked)') : (q.status === 'rejected' ? '✕ ' + (isHi ? 'अस्वीकृत' : 'Declined') : '⏳ ' + (isHi ? 'मालिक समीक्षाधीन' : 'Pending Owner Review'))}
                    </span>
                  </div>
                  <div style="font-size:12px; color:#cbd5e1; margin-bottom:4px;">
                    <strong>${isHi ? 'समस्या:' : 'Reason:'}</strong> ${q.reason}
                  </div>
                  ${q.resolutionNote ? `
                    <div style="font-size:11px; color:#4ade80; background:#1b4332; border-radius:6px; padding:4px 8px; margin-top:4px;">
                      💬 <strong>${isHi ? 'मालिक का जवाब:' : 'Owner Note:'}</strong> ${q.resolutionNote}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  }

  return `
    <div class="role-portal-view">
      <button type="button" class="role-change-btn" onclick="openRoleSwitcherModal()">
        ‹ ${isHi ? 'रोल बदलें' : 'Change role'}
      </button>

      <div class="role-view-header">
        <h1 class="role-view-title">${isHi ? 'काम खोजें' : 'Find work'}</h1>
        <p class="role-view-sub">${isHi ? 'फ़ोटो के साथ अपनी कार्य प्रोफ़ाइल बनाएं। आस-पास के ग्राहक आपको सीधे कॉल करेंगे।' : 'Make your work profile with photos. Customers near you call you directly.'}</p>
      </div>

      ${statusCardHtml}
      ${tabsBarHtml}
      ${tabContentHtml}
    </div>
  `;
}

// --------------------------------------------------------------------------
// 2. DEDICATED WORK OWNER DASHBOARD (Matching Respective Sections)
// --------------------------------------------------------------------------
function renderHirerDashboard() {
  const isHi = AppState.currentLang === 'hi';
  const u = AppState.activeUserProfile || {
    name: "Chaudhary Virendra Singh",
    roleTitle: "Work Owner (काम मालिक)",
    phone: "+91 98210 55443",
    village: AppState.currentLocation?.village || "Sundarpur"
  };

  const status = (AppState.roleStatuses && AppState.roleStatuses.hirer) || 'hiring';
  const activeTab = (AppState.roleSectionTabs && AppState.roleSectionTabs.hirer) || 'workers';

  const statusLabels = {
    hiring: isHi ? 'मजदूर चाहिए' : 'Actively Hiring',
    in_progress: isHi ? 'काम जारी है' : 'Work in Progress',
    no_work: isHi ? 'अभी काम नहीं' : 'No Current Work'
  };
  const activeStatusLabel = statusLabels[status] || 'Actively Hiring';
  const initials = getInitials(u.name);

  // Status Card HTML
  const statusCardHtml = `
    <div class="role-status-card">
      <div class="role-status-header">
        <div>
          <div class="role-status-title">${isHi ? 'हायरिंग स्थिति अभी' : 'Hiring status right now'}</div>
          <div class="role-status-subtitle">${isHi ? 'अपडेट करने के लिए टैप करें। आस-पास के मजदूर देखेंगे।' : 'Tap to update. Workers near you see it.'}</div>
        </div>
      </div>
      <div class="role-status-pills-row">
        <button type="button" class="role-status-pill ${status === 'hiring' ? 'active' : ''}" onclick="setRoleStatus('hirer', 'hiring')">
          <span class="role-status-dot"></span>
          <span>${isHi ? 'मजदूर चाहिए' : 'Actively Hiring'}</span>
        </button>
        <button type="button" class="role-status-pill ${status === 'in_progress' ? 'active in_progress' : ''}" onclick="setRoleStatus('hirer', 'in_progress')">
          <span class="role-status-dot"></span>
          <span>${isHi ? 'काम जारी है' : 'Work in Progress'}</span>
        </button>
        <button type="button" class="role-status-pill ${status === 'no_work' ? 'active no_work' : ''}" onclick="setRoleStatus('hirer', 'no_work')">
          <span class="role-status-dot"></span>
          <span>${isHi ? 'अभी काम नहीं' : 'No Current Work'}</span>
        </button>
      </div>
    </div>
  `;

  // Horizontal Section Tabs Bar for Hirer
  const tabsBarHtml = `
    <div class="role-section-tabs-bar">
      <button type="button" class="role-section-tab ${activeTab === 'workers' ? 'active' : ''}" onclick="setRoleSectionTab('hirer', 'workers')">
        ${isHi ? 'कारीगर खोजें' : 'Find workers'}
      </button>
      <button type="button" class="role-section-tab ${activeTab === 'attendance' ? 'active' : ''}" onclick="setRoleSectionTab('hirer', 'attendance')">
        ${isHi ? 'हाजिरी व टीम' : 'Attendance'}
        <span class="role-tab-badge">${(AppState.hiredWorkers || []).length}</span>
      </button>
      <button type="button" class="role-section-tab ${activeTab === 'jobs' ? 'active' : ''}" onclick="setRoleSectionTab('hirer', 'jobs')">
        ${isHi ? 'मेरे काम' : 'My jobs'}
        <span class="role-tab-badge">${(AppState.jobs || []).length}</span>
      </button>
      <button type="button" class="role-section-tab ${activeTab === 'nrega' ? 'active' : ''}" onclick="setRoleSectionTab('hirer', 'nrega')">
        ${isHi ? 'मनरेगा काम' : 'NREGA works'}
      </button>
      <button type="button" class="role-section-tab ${activeTab === 'profile' ? 'active' : ''}" onclick="setRoleSectionTab('hirer', 'profile')">
        ${isHi ? 'मेरी प्रोफ़ाइल' : 'My profile'}
      </button>
    </div>
  `;

  // Content for Active Tab
  let tabContentHtml = '';

  if (activeTab === 'workers') {
    // Browse Workers & Artisans
    const workersList = AppState.workers || [];
    tabContentHtml = `
      <div style="margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="font-size:16.5px; font-weight:800; color:#f8fafc; margin:0;">🔍 ${isHi ? 'गाँव के सत्यापित कारीगर खोजें' : 'Find & Hire Verified Workers'}</h3>
            <p style="font-size:12px; color:#94a3b8; margin:2px 0 0 0;">${isHi ? 'आस-पास के राजमिस्त्री, बढ़ई, खेत मजदूर व इलेक्ट्रीशियन' : 'Verified village artisans available near you'}</p>
          </div>
          <button class="role-change-btn" style="margin:0;" onclick="navigateTo('hire_workers')">${isHi ? 'सभी देखें ›' : 'View All ›'}</button>
        </div>

        <!-- Category Filter Chips -->
        <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:8px; margin-bottom:12px;">
          <button class="cat-pill active" style="background:#1b4332; border:1px solid #22c55e; color:#4ade80;" onclick="navigateTo('category_workers', {category: 'farm_labour'})">🌾 Farm Labour</button>
          <button class="cat-pill" style="background:#13251c; border:1px solid #1f3d2c; color:#94a3b8;" onclick="navigateTo('category_workers', {category: 'mason'})">🧱 Mason</button>
          <button class="cat-pill" style="background:#13251c; border:1px solid #1f3d2c; color:#94a3b8;" onclick="navigateTo('category_workers', {category: 'carpenter'})">🪚 Carpenter</button>
          <button class="cat-pill" style="background:#13251c; border:1px solid #1f3d2c; color:#94a3b8;" onclick="navigateTo('category_workers', {category: 'electrician'})">⚡ Electrician</button>
          <button class="cat-pill" style="background:#13251c; border:1px solid #1f3d2c; color:#94a3b8;" onclick="navigateTo('category_workers', {category: 'plumber'})">🚰 Plumber</button>
        </div>

        <!-- Worker Cards List -->
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${workersList.slice(0, 4).map(w => `
            <div style="background:#13251c; border:1.5px solid #1f3d2c; border-radius:12px; padding:14px; display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; gap:12px; align-items:center;">
                <div class="profile-avatar-circle" style="width:48px; height:48px; font-size:17px;">
                  ${w.photo ? `<img src="${w.photo}" alt="${w.name}">` : getInitials(w.name)}
                </div>
                <div>
                  <strong style="font-size:14.5px; color:#f8fafc;">${w.name}</strong>
                  <div style="font-size:12px; color:#94a3b8;">${w.categoryTitle || w.category} · ${w.experience || 4} yrs</div>
                  <div style="font-size:11.5px; color:#4ade80; font-weight:700;">₹${w.dailyRate || 500} / day · 📍 ${w.village}</div>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:6px;">
                <button class="btn-hire-primary" style="background:#16a34a; border:none; padding:7px 12px; border-radius:8px; color:#fff; font-size:12px; font-weight:700; cursor:pointer;" onclick="openHireModal('${w.id}')">
                  🤝 ${isHi ? 'हायर करें' : 'Hire'}
                </button>
                <button class="role-status-pill" style="padding:6px 10px; font-size:11px; background:#0d1912; border-color:#1f3d2c; color:#f8fafc;" onclick="openCallDialog('${w.name}', '${w.phone}', '${w.category}')">
                  📞 ${isHi ? 'कॉल' : 'Call'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (activeTab === 'attendance') {
    // Attendance Matrix for Hired Workers
    tabContentHtml = `
      <div style="margin-bottom:18px;">
        ${renderHiredWorkersAttendanceSection()}
      </div>
    `;
  } else if (activeTab === 'jobs') {
    // My Jobs & Post a Job
    tabContentHtml = `
      <div style="margin-bottom:18px;">
        <div class="post-job-cta-card" style="margin-bottom:16px; background:#1b3d2b; border:1.5px solid #22c55e; border-radius:12px; padding:14px; cursor:pointer;" onclick="openPostJobModal()">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="font-size:15px; color:#f8fafc;">➕ ${isHi ? 'नया काम पोस्ट करें' : 'Post a New Job Requirement'}</strong>
              <p style="font-size:12px; color:#86efac; margin:3px 0 0 0;">${isHi ? 'खेत मजदूर, राजमिस्त्री या बढ़ई चाहिए? आस-पास के कारीगर सीधे संपर्क करेंगे।' : 'Need farm labourers, masons, carpenters? Local workers will call you.'}</p>
            </div>
            <span style="font-size:22px; color:#4ade80;">›</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h3 style="font-size:16px; font-weight:800; color:#f8fafc; margin:0;">📋 ${isHi ? 'मेरे सक्रिय काम पोस्ट' : 'My Active Job Posts'}</h3>
          <button class="role-change-btn" style="margin:0;" onclick="openPostJobModal()">+ ${isHi ? 'नया काम' : 'New Job'}</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          ${(AppState.jobs || []).map(j => `
            <div style="background:#13251c; border:1px solid #1f3d2c; border-radius:10px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="font-size:14px; color:#f8fafc;">${j.title}</strong>
                <div style="font-size:12px; color:#94a3b8;">₹${j.dailyWage}/day · ${j.workersCount} workers · ${j.duration}</div>
              </div>
              <span style="font-size:11px; font-weight:700; color:#4ade80; background:#1b3d2b; padding:3px 8px; border-radius:6px; border:1px solid #22c55e;">
                ✓ Active
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (activeTab === 'nrega') {
    // Village Panchayat Schemes
    tabContentHtml = `
      <div style="background:#13251c; border:1.5px solid #22c55e; border-radius:14px; padding:16px; margin-bottom:18px;">
        <span style="font-size:11px; font-weight:800; color:#4ade80; text-transform:uppercase; letter-spacing:0.5px;">🏛️ ${isHi ? 'गाँव में मनरेगा सार्वजनिक योजनाएं' : 'Panchayat Public Works'}</span>
        <h3 style="font-size:17px; font-weight:800; color:#f8fafc; margin:4px 0 2px 0;">Amrit Sarovar Pond De-Silting & Beautification</h3>
        <p style="font-size:12px; color:#94a3b8; margin:0;">गाँव सुंदरपुर · ब्लॉक रॉबर्ट्सगंज · कुल बजट ₹4,68,000</p>
        
        <div class="profile-2x2-grid" style="margin:12px 0;">
          <div class="profile-grid-cell">
            <div class="profile-grid-label">GOVT RATE</div>
            <div class="profile-grid-val" style="color:#4ade80;">₹260 / day</div>
          </div>
          <div class="profile-grid-cell">
            <div class="profile-grid-label">WORKERS ENROLLED</div>
            <div class="profile-grid-val">20 Workers</div>
          </div>
          <div class="profile-grid-cell">
            <div class="profile-grid-label">PROGRESS</div>
            <div class="profile-grid-val">24 / 60 Days</div>
          </div>
          <div class="profile-grid-cell">
            <div class="profile-grid-label">SUPERVISOR</div>
            <div class="profile-grid-val">Dinesh Kumar (Rozgar Sevak)</div>
          </div>
        </div>

        <button type="button" class="btn-hire-primary" style="width:100%; background:#16a34a; border:none; padding:10px 14px; border-radius:8px; color:#fff; font-weight:700; cursor:pointer;" onclick="navigateTo('mnrega')">
          🏛️ ${isHi ? 'गाँव का संपूर्ण मनरेगा मस्टर रोल देखें ›' : 'View Village MGNREGA Muster Roll ›'}
        </button>
      </div>
    `;
  } else if (activeTab === 'profile') {
    if (!AppState.activeUserProfile) {
      tabContentHtml = `
        <div class="account-access-card">
          <div style="font-size:38px; margin-bottom:8px;">🔒</div>
          <h3 class="account-access-title">${isHi ? 'आप अभी लॉग आउट हैं (अतिथि मोड)' : 'You are currently logged out'}</h3>
          <p class="account-access-sub">${isHi ? 'क्या आपने काम मालिक के रूप में प्रोफ़ाइल बनाई थी? अपनी हायर की गई टीम, हाजिरी रजिस्टर और पोस्ट किए गए काम देखने के लिए फ़ोन नंबर से लॉगिन करें।' : 'Created your work owner profile before? Log in with your mobile number to view your hired team, attendance registers, and job posts.'}</p>

          <div class="account-access-actions">
            <button type="button" class="btn-hire-primary" style="background:#16a34a; border:none; padding:11px 22px; border-radius:9px; color:#fff; font-size:14px; font-weight:800; cursor:pointer;" onclick="openLoginModal()">
              🔑 ${isHi ? 'फ़ोन नंबर से लॉग इन करें' : 'Log in with Mobile Number'}
            </button>
            <button type="button" class="role-status-pill" style="padding:11px 18px; font-size:13px; background:#0d1912; border-color:#1f3d2c; color:#f8fafc;" onclick="navigateTo('profile_creator')">
              ➕ ${isHi ? 'नई प्रोफ़ाइल बनाएं' : 'Create New Profile'}
            </button>
          </div>

          <div style="margin-top:16px; border-top:1px solid #1f3d2c; padding-top:14px;">
            <span style="font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:8px;">
              ⚡ ${isHi ? 'पहले से बने प्रोफाइल में त्वरित लॉगिन (1-क्लिक):' : 'Quick 1-Click Login for Existing Profiles:'}
            </span>
            <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
              <button type="button" class="demo-login-chip" onclick="quickLoginWithPhone('9821055443')">
                👨‍🌾 <strong>Chaudhary Virendra Singh</strong> (Work Owner · 98210 55443)
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      // Work Owner 2-Column Profile View
      tabContentHtml = `
      <div class="role-profile-two-col">
        <!-- Left Column: Details Card -->
        <div class="profile-details-card">
          <div class="profile-details-header">
            <div class="profile-avatar-circle">
              ${getDummyAvatarHTML(u.name, 58, 22, '#3b2d13', '#fef08a', '#eab308')}
            </div>
            <div class="profile-meta-main">
              <h3>${u.name}</h3>
              <div class="profile-meta-sub">${u.roleTitle || 'Work Owner'} · 📍 ${u.village}</div>
              <div class="profile-status-badge">
                <span class="role-status-dot" style="background:#22c55e;"></span>
                <span>${activeStatusLabel}</span>
              </div>
            </div>
          </div>

          <div class="profile-2x2-grid">
            <div class="profile-grid-cell">
              <div class="profile-grid-label">${isHi ? 'सक्रिय मजदूर टीम' : 'HIRED TEAM'}</div>
              <div class="profile-grid-val">${AppState.hiredWorkers.length} Workers Active</div>
            </div>
            <div class="profile-grid-cell">
              <div class="profile-grid-label">${isHi ? 'फ़ोन' : 'PHONE'}</div>
              <div class="profile-grid-val">${u.phone || '+91 98210 55443'}</div>
            </div>
            <div class="profile-grid-cell">
              <div class="profile-grid-label">${isHi ? 'स्थान' : 'PLACE'}</div>
              <div class="profile-grid-val">${u.village}, PIN ${AppState.currentLocation?.pincode || '231216'}</div>
            </div>
            <div class="profile-grid-cell">
              <div class="profile-grid-label">${isHi ? 'पसंदीदा कारीगर' : 'PREFERRED TRADES'}</div>
              <div class="profile-grid-val">Farm Labour, Mason, Helper</div>
            </div>
          </div>

          <div style="margin-top:16px;">
            <button type="button" class="role-status-pill" style="width:auto; min-width:110px; background:#0d1912; border-color:#1f3d2c; color:#f8fafc;" onclick="speakHirerProfile()">
              <span>🔊</span>
              <span>${isHi ? 'सुनें' : 'Listen'}</span>
            </button>
          </div>
        </div>

        <!-- Right Column: HOW WORKERS SEE YOU -->
        <div class="profile-preview-card">
          <div class="preview-card-header-label">${isHi ? 'कारीगर आपको कैसे देखते हैं' : 'HOW WORKERS SEE YOU'}</div>
          
          <div class="preview-card-box">
            <div class="preview-card-top">
              <div class="preview-user-row">
                <div class="preview-avatar-mini">
                  ${u.photo ? `<img src="${u.photo}" alt="${u.name}">` : initials}
                </div>
                <div>
                  <div class="preview-name-row">
                    <span>${u.name}</span>
                    <span class="role-status-dot" style="background:#22c55e;"></span>
                  </div>
                  <div class="preview-sub-row">👨‍🌾 ${isHi ? 'काम मालिक / किसान' : 'Verified Employer'}</div>
                </div>
              </div>
            </div>

            <div class="preview-address-row">
              📍 ${u.village}, PIN ${AppState.currentLocation?.pincode || '231216'}
            </div>

            <div class="preview-phone-row">
              <span>📞</span>
              <span>${u.phone || '+91 98210 55443'}</span>
            </div>

            <div style="margin-top:8px;">
              <span style="font-size:11px; font-weight:700; color:#4ade80; background:#1b3d2b; padding:2px 8px; border-radius:4px;">
                ● ${activeStatusLabel}
              </span>
            </div>
          </div>

          <div class="preview-actions-row">
            <button type="button" class="btn-profile-edit" onclick="navigateTo('profile_creator')">
              <span>✏️</span>
              <span>${isHi ? 'प्रोफ़ाइल संपादित करें' : 'Edit profile'}</span>
            </button>
            <button type="button" class="btn-profile-remove" onclick="removeUserProfile()">
              <span>🗑️</span>
              <span>${isHi ? 'प्रोफ़ाइल हटाएं' : 'Remove profile'}</span>
            </button>
          </div>
        </div>
      </div>
    `
    };
  }

  return `
    <div class="role-portal-view">
      <button type="button" class="role-change-btn" onclick="openRoleSwitcherModal()">
        ‹ ${isHi ? 'रोल बदलें' : 'Change role'}
      </button>

      <div class="role-view-header">
        <h1 class="role-view-title">${isHi ? 'मजदूर बुलाएं व काम कराएं' : 'Hire workers'}</h1>
        <p class="role-view-sub">${isHi ? 'सत्यापित गाँव के कारीगर खोजें, काम की जरूरत पोस्ट करें, और दैनिक हाजिरी ट्रैक करें।' : 'Find verified village artisans, post job requirements, and track daily attendance.'}</p>
      </div>

      ${statusCardHtml}
      ${tabsBarHtml}
      ${tabContentHtml}
    </div>
  `;
}

// --------------------------------------------------------------------------
// 3. DEDICATED SHOP OWNER DASHBOARD (Matching Respective Sections)
// --------------------------------------------------------------------------
function renderShopOwnerDashboard() {
  const isHi = AppState.currentLang === 'hi';
  const u = AppState.activeUserProfile || {
    name: "Radheshyam Sharma",
    shopName: "Sharma Beej Bhandar",
    shopCategory: "Seeds, Fertilizers & Farm Tools",
    phone: "+91 98210 55443",
    village: AppState.currentLocation?.village || "Sundarpur"
  };

  const status = (AppState.roleStatuses && AppState.roleStatuses.store_manager) || 'open';
  const activeTab = (AppState.roleSectionTabs && AppState.roleSectionTabs.store_manager) || 'orders';

  const pendingCount = AppState.orders.filter(o => o.status === 'pending' || o.status === 'ready').length;
  const completedCount = AppState.orders.filter(o => o.status === 'completed').length;
  const totalRevenue = AppState.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const myProducts = AppState.products || [];

  const statusLabels = {
    open: isHi ? 'दुकान खुली है' : 'Shop Open',
    delivery: isHi ? 'केवल डिलीवरी' : 'Delivery Only',
    closed: isHi ? 'दुकान बंद है' : 'Shop Closed'
  };
  const activeStatusLabel = statusLabels[status] || 'Shop Open';
  const initials = getInitials(u.shopName || u.name);

  // Status Card HTML
  const statusCardHtml = `
    <div class="role-status-card">
      <div class="role-status-header">
        <div>
          <div class="role-status-title">${isHi ? 'दुकान स्थिति अभी' : 'Shop status right now'}</div>
          <div class="role-status-subtitle">${isHi ? 'अपडेट करने के लिए टैप करें। गाँव वाले देखेंगे कि दुकान खुली है।' : 'Tap to update. Villagers see if you are open.'}</div>
        </div>
      </div>
      <div class="role-status-pills-row">
        <button type="button" class="role-status-pill ${status === 'open' ? 'active' : ''}" onclick="setRoleStatus('store_manager', 'open')">
          <span class="role-status-dot"></span>
          <span>${isHi ? 'दुकान खुली है' : 'Shop Open'}</span>
        </button>
        <button type="button" class="role-status-pill ${status === 'delivery' ? 'active delivery' : ''}" onclick="setRoleStatus('store_manager', 'delivery')">
          <span class="role-status-dot"></span>
          <span>${isHi ? 'केवल डिलीवरी' : 'Delivery Only'}</span>
        </button>
        <button type="button" class="role-status-pill ${status === 'closed' ? 'active closed' : ''}" onclick="setRoleStatus('store_manager', 'closed')">
          <span class="role-status-dot"></span>
          <span>${isHi ? 'दुकान बंद है' : 'Shop Closed'}</span>
        </button>
      </div>
    </div>
  `;

  // Horizontal Section Tabs Bar for Shop Owner
  const tabsBarHtml = `
    <div class="role-section-tabs-bar">
      <button type="button" class="role-section-tab ${activeTab === 'orders' ? 'active' : ''}" onclick="setRoleSectionTab('store_manager', 'orders')">
        ${isHi ? 'ग्राहक ऑर्डर' : 'Customer orders'}
        <span class="role-tab-badge">${pendingCount}</span>
      </button>
      <button type="button" class="role-section-tab ${activeTab === 'products' ? 'active' : ''}" onclick="setRoleSectionTab('store_manager', 'products')">
        ${isHi ? 'सामान व इन्वेंटरी' : 'Products'}
        <span class="role-tab-badge">${myProducts.length}</span>
      </button>
      <button type="button" class="role-section-tab ${activeTab === 'profile' ? 'active' : ''}" onclick="setRoleSectionTab('store_manager', 'profile')">
        ${isHi ? 'दुकान प्रोफ़ाइल' : 'My profile'}
      </button>
      <button type="button" class="role-section-tab ${activeTab === 'market' ? 'active' : ''}" onclick="setRoleSectionTab('store_manager', 'market')">
        ${isHi ? 'गाँव बाज़ार' : 'Village market'}
      </button>
    </div>
  `;

  // Content for Active Tab
  let tabContentHtml = '';

  if (activeTab === 'orders') {
    // Orders Management & KPIs
    tabContentHtml = `
      <div style="margin-bottom:18px;">
        <div class="kpi-orders-grid" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; margin-bottom:16px;">
          <div class="kpi-order-card" style="background:#13251c; border:1px solid #1f3d2c; border-radius:10px; padding:10px; text-align:center;">
            <div class="kpi-order-val" style="font-size:18px; font-weight:800; color:#f8fafc;">${AppState.orders.length}</div>
            <div class="kpi-order-lbl" style="font-size:11px; color:#94a3b8;">${isHi ? 'कुल ऑर्डर' : 'Total Orders'}</div>
          </div>
          <div class="kpi-order-card" style="background:#13251c; border:1px solid #eab308; border-radius:10px; padding:10px; text-align:center;">
            <div class="kpi-order-val" style="font-size:18px; font-weight:800; color:#fef08a;">${pendingCount}</div>
            <div class="kpi-order-lbl" style="font-size:11px; color:#94a3b8;">${isHi ? 'पेंडिंग' : 'Pending'}</div>
          </div>
          <div class="kpi-order-card" style="background:#13251c; border:1px solid #22c55e; border-radius:10px; padding:10px; text-align:center;">
            <div class="kpi-order-val" style="font-size:18px; font-weight:800; color:#4ade80;">${completedCount}</div>
            <div class="kpi-order-lbl" style="font-size:11px; color:#94a3b8;">${isHi ? 'पूरे हुए' : 'Completed'}</div>
          </div>
          <div class="kpi-order-card" style="background:#13251c; border:1px solid #38bdf8; border-radius:10px; padding:10px; text-align:center;">
            <div class="kpi-order-val" style="font-size:18px; font-weight:800; color:#38bdf8;">₹${totalRevenue.toLocaleString('en-IN')}</div>
            <div class="kpi-order-lbl" style="font-size:11px; color:#94a3b8;">${isHi ? 'कुल बिक्री' : 'Revenue'}</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="font-size:16px; font-weight:800; color:#f8fafc; margin:0;">📦 ${isHi ? 'ग्राहकों के ऑर्डर' : 'Incoming Customer Orders'}</h3>
          <button class="role-change-btn" style="margin:0;" onclick="navigateTo('shop_orders')">${isHi ? 'विस्तृत डैशबोर्ड ›' : 'Full Manager ›'}</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          ${AppState.orders.map(o => `
            <div style="background:#13251c; border:1.5px solid #1f3d2c; border-radius:12px; padding:14px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <strong style="font-size:14.5px; color:#f8fafc;">${o.id}: ${o.customerName}</strong>
                  <div style="font-size:12px; color:#94a3b8; margin:2px 0;">📍 ${o.customerVillage} · 📞 ${o.customerPhone}</div>
                  <div style="font-size:12px; color:#4ade80; font-weight:700;">${o.items.map(i => i.name).join(', ')} · ₹${o.totalAmount}</div>
                </div>
                <span style="font-size:11px; font-weight:700; padding:3px 8px; border-radius:6px; ${o.status === 'completed' ? 'background:#1b4332; color:#4ade80; border:1px solid #22c55e;' : 'background:#3b2d13; color:#fef08a; border:1px solid #eab308;'}">
                  ${o.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                </span>
              </div>

              <div style="display:flex; gap:8px; margin-top:12px;">
                ${o.status !== 'completed' ? `
                  <button type="button" class="btn-hire-primary" style="flex:1; background:#16a34a; border:none; padding:7px 12px; border-radius:8px; color:#fff; font-size:12px; font-weight:700; cursor:pointer;" onclick="updateOrderStatus('${o.id}', 'completed')">
                    ✓ ${isHi ? 'ऑर्डर पूरा मार्क करें' : 'Mark Completed'}
                  </button>
                ` : `
                  <span style="font-size:12px; color:#4ade80; font-weight:700;">✓ ${isHi ? 'डिलीवर हो चुका है' : 'Delivered & Settled'}</span>
                `}
                <button type="button" class="role-status-pill" style="padding:7px 12px; font-size:12px; background:#0d1912; border-color:#1f3d2c; color:#f8fafc;" onclick="openCallDialog('${o.customerName}', '${o.customerPhone}', 'Store Customer')">
                  📞 ${isHi ? 'ग्राहक को कॉल करें' : 'Call Customer'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (activeTab === 'products') {
    // Products & Inventory
    tabContentHtml = `
      <div style="margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="font-size:16.5px; font-weight:800; color:#f8fafc; margin:0;">🏬 ${isHi ? 'मेरी दुकान का सामान व इन्वेंटरी' : 'Shop Products & Stock'}</h3>
            <p style="font-size:12px; color:#94a3b8; margin:2px 0 0 0;">${myProducts.length} ${isHi ? 'सामान बिक्री हेतु गाँव बाज़ार में उपलब्ध हैं' : 'products listed for village buyers'}</p>
          </div>
          <button class="btn-hire-primary" style="background:#0284c7; border:none; padding:8px 12px; border-radius:8px; color:#fff; font-size:12px; font-weight:700; cursor:pointer;" onclick="navigateTo('sell_product')">
            + ${isHi ? 'नया सामान जोड़ें' : 'Add Product'}
          </button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:12px;">
          ${myProducts.map(p => `
            <div style="background:#13251c; border:1px solid #1f3d2c; border-radius:12px; padding:10px; display:flex; flex-direction:column;">
              ${getDummyProductBadgeHTML(p.name, p.category, 80)}
              <strong style="font-size:13.5px; color:#f8fafc; margin-bottom:2px;">${p.name}</strong>
              <div style="font-size:14px; font-weight:800; color:#4ade80;">₹${p.price} <span style="font-size:10.5px; color:#94a3b8;">/ ${p.unit}</span></div>
              <div style="font-size:11px; color:#38bdf8; margin:4px 0;">📦 Stock: ${p.stock || 'In Stock'}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (activeTab === 'profile') {
    if (!AppState.activeUserProfile) {
      tabContentHtml = `
        <div class="account-access-card">
          <div style="font-size:38px; margin-bottom:8px;">🔒</div>
          <h3 class="account-access-title">${isHi ? 'आप अभी लॉग आउट हैं (अतिथि मोड)' : 'You are currently logged out'}</h3>
          <p class="account-access-sub">${isHi ? 'क्या आपने दुकानदार के रूप में प्रोफ़ाइल बनाई थी? अपनी दुकान की इन्वेंटरी और ग्राहकों के नए ऑर्डर देखने के लिए फ़ोन नंबर से लॉगिन करें।' : 'Created your store profile before? Log in with your mobile number to view your shop inventory, orders, and sales revenue.'}</p>

          <div class="account-access-actions">
            <button type="button" class="btn-hire-primary" style="background:#16a34a; border:none; padding:11px 22px; border-radius:9px; color:#fff; font-size:14px; font-weight:800; cursor:pointer;" onclick="openLoginModal()">
              🔑 ${isHi ? 'फ़ोन नंबर से लॉग इन करें' : 'Log in with Mobile Number'}
            </button>
            <button type="button" class="role-status-pill" style="padding:11px 18px; font-size:13px; background:#0d1912; border-color:#1f3d2c; color:#f8fafc;" onclick="navigateTo('profile_creator')">
              ➕ ${isHi ? 'नई दुकान प्रोफ़ाइल बनाएं' : 'Create New Profile'}
            </button>
          </div>

          <div style="margin-top:16px; border-top:1px solid #1f3d2c; padding-top:14px;">
            <span style="font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:8px;">
              ⚡ ${isHi ? 'पहले से बने प्रोफाइल में त्वरित लॉगिन (1-क्लिक):' : 'Quick 1-Click Login for Existing Profiles:'}
            </span>
            <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
              <button type="button" class="demo-login-chip" onclick="quickLoginWithPhone('9833322110')">
                🏪 <strong>Sharma Beej Bhandar</strong> (Shop Owner · 98333 22110)
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      // Shop Owner 2-Column Profile View
      tabContentHtml = `
      <div class="role-profile-two-col">
        <!-- Left Column: Details Card -->
        <div class="profile-details-card">
          <div class="profile-details-header">
            <div class="profile-avatar-circle">
              ${getDummyAvatarHTML(u.shopName || u.name, 58, 20, '#153243', '#38bdf8', '#0284c7')}
            </div>
            <div class="profile-meta-main">
              <h3>${u.shopName || 'Sharma Beej Bhandar'}</h3>
              <div class="profile-meta-sub">${u.shopCategory || 'Seeds & Farm Supplies'} · 📍 ${u.village}</div>
              <div class="profile-status-badge">
                <span class="role-status-dot" style="background:#22c55e;"></span>
                <span>${activeStatusLabel}</span>
              </div>
            </div>
          </div>

          <div class="profile-2x2-grid">
            <div class="profile-grid-cell">
              <div class="profile-grid-label">${isHi ? 'कुल उत्पाद' : 'PRODUCTS LISTED'}</div>
              <div class="profile-grid-val">${AppState.products.length} Items Listed</div>
            </div>
            <div class="profile-grid-cell">
              <div class="profile-grid-label">${isHi ? 'दुकान फ़ोन' : 'PHONE'}</div>
              <div class="profile-grid-val">${u.phone || '+91 98210 55443'}</div>
            </div>
            <div class="profile-grid-cell">
              <div class="profile-grid-label">${isHi ? 'दुकान स्थान' : 'STORE LOCATION'}</div>
              <div class="profile-grid-val">Main Market, ${u.village}, PIN 231216</div>
            </div>
            <div class="profile-grid-cell">
              <div class="profile-grid-label">${isHi ? 'डिलीवरी दायरा' : 'DELIVERY RADIUS'}</div>
              <div class="profile-grid-val">Village + 10 km</div>
            </div>
          </div>

          <div style="margin-top:16px;">
            <button type="button" class="role-status-pill" style="width:auto; min-width:110px; background:#0d1912; border-color:#1f3d2c; color:#f8fafc;" onclick="speakStoreProfile()">
              <span>🔊</span>
              <span>${isHi ? 'सुनें' : 'Listen'}</span>
            </button>
          </div>
        </div>

        <!-- Right Column: HOW CUSTOMERS SEE YOUR SHOP -->
        <div class="profile-preview-card">
          <div class="preview-card-header-label">${isHi ? 'गाँव वाले आपकी दुकान कैसे देखते हैं' : 'HOW CUSTOMERS SEE YOUR SHOP'}</div>
          
          <div class="preview-card-box">
            <div class="preview-card-top">
              <div class="preview-user-row">
                <div class="preview-avatar-mini">
                  ${u.storePhoto ? `<img src="${u.storePhoto}" alt="${u.shopName}">` : initials}
                </div>
                <div>
                  <div class="preview-name-row">
                    <span>${u.shopName || 'Sharma Beej Bhandar'}</span>
                    <span class="role-status-dot" style="background:#22c55e;"></span>
                  </div>
                  <div class="preview-sub-row">🏪 ${u.shopCategory || 'Farm Supplies'}</div>
                </div>
              </div>
            </div>

            <div class="preview-address-row">
              📍 Main Market, ${u.village}, PIN 231216
            </div>

            <div class="preview-phone-row">
              <span>📞</span>
              <span>${u.phone || '+91 98210 55443'}</span>
            </div>

            <div style="margin-top:8px;">
              <span style="font-size:11px; font-weight:700; color:#4ade80; background:#1b3d2b; padding:2px 8px; border-radius:4px;">
                ● ${activeStatusLabel}
              </span>
            </div>
          </div>

          <div class="preview-actions-row">
            <button type="button" class="btn-profile-edit" onclick="navigateTo('profile_creator')">
              <span>✏️</span>
              <span>${isHi ? 'दुकान संपादित करें' : 'Edit profile'}</span>
            </button>
            <button type="button" class="btn-profile-remove" onclick="removeUserProfile()">
              <span>🗑️</span>
              <span>${isHi ? 'दुकान हटाएं' : 'Remove profile'}</span>
            </button>
          </div>
        </div>
      </div>
    `
    };
  } else if (activeTab === 'market') {
    // Village Market View
    tabContentHtml = `
      <div style="margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="font-size:16.5px; font-weight:800; color:#f8fafc; margin:0;">🌾 ${isHi ? 'गाँव बाज़ार में अन्य सामान व दरें' : 'Village Bazaar Listings'}</h3>
            <p style="font-size:12px; color:#94a3b8; margin:2px 0 0 0;">${isHi ? 'गाँव में बिक रहे बीज, खाद व औजारों की दरें देखें' : 'Current village prices for seeds, fertilizers, and tools'}</p>
          </div>
          <button class="role-change-btn" style="margin:0;" onclick="navigateTo('bazaar')">${isHi ? 'पूरा बाज़ार खोलें ›' : 'Open Bazaar ›'}</button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:12px;">
          ${(AppState.products || []).map(p => `
            <div style="background:#13251c; border:1px solid #1f3d2c; border-radius:12px; padding:10px;">
              <img src="${p.photo || GAON_ASSETS.wheatSeedPhoto}" style="width:100%; height:85px; object-fit:cover; border-radius:8px; margin-bottom:6px;" alt="${p.name}">
              <strong style="font-size:13px; color:#f8fafc; display:block;">${p.name}</strong>
              <div style="font-size:13px; font-weight:800; color:#4ade80;">₹${p.price} / ${p.unit}</div>
              <div style="font-size:11px; color:#94a3b8; margin-top:2px;">📍 ${p.shopName || 'Gaon Bazaar'}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="role-portal-view">
      <button type="button" class="role-change-btn" onclick="openRoleSwitcherModal()">
        ‹ ${isHi ? 'रोल बदलें' : 'Change role'}
      </button>

      <div class="role-view-header">
        <h1 class="role-view-title">${isHi ? 'गाँव की दुकान व ऑर्डर' : 'Village store & orders'}</h1>
        <p class="role-view-sub">${isHi ? 'अपनी दुकान की प्रोफाइल, ग्राहकों के ऑर्डर, इन्वेंटरी और गाँव बाज़ार प्रबंधित करें।' : 'Manage your shop profile, customer orders, product inventory, and village bazaar.'}</p>
      </div>

      ${statusCardHtml}
      ${tabsBarHtml}
      ${tabContentHtml}
    </div>
  `;
}


function toggleWorkerAvailability() {
  if (!AppState.workerAttendance) {
    AppState.workerAttendance = { ...GAON_DATA.initialWorkerAttendance };
  }
  AppState.workerAttendance.isAvailable = !AppState.workerAttendance.isAvailable;
  saveWorkerAttendance();
  renderHomeHub();

  const isHi = AppState.currentLang === 'hi';
  const statusMsg = AppState.workerAttendance.isAvailable ? 
    (isHi ? '🟢 आप अब आज काम के लिए उपलब्ध हैं!' : '🟢 You are now marked Available Today!') : 
    (isHi ? '🔴 आप काम पर व्यस्त दर्ज किए गए हैं!' : '🔴 You are marked Busy on Job!');
  showToast(statusMsg);
}

function applyForWorkerJob(jobId, hirerName, hirerPhone) {
  const isHi = AppState.currentLang === 'hi';
  showToast(isHi ? `✓ आवेदन सफल! ${hirerName} को आपका आवेदन पहुँच गया है।` : `✓ Applied! ${hirerName} received your interest.`);
  openCallDialog(hirerName, hirerPhone, 'Work Hirer');
}

// ==========================================================================
// Screen 3: All Work Categories (PDF Page 2)
// ==========================================================================
function renderAllWorkCategories() {
  const container = document.getElementById('categoriesGridContainer');
  const countBanner = document.getElementById('allWorkCountBanner');
  if (!container) return;

  const totalWorkers = AppState.workers.length;
  if (countBanner) {
    countBanner.innerHTML = `${GAON_DATA.workCategories.length} types of work · <strong>${totalWorkers} workers</strong> <span>${t('tapToSee')}</span>`;
  }

  container.innerHTML = GAON_DATA.workCategories.map(cat => {
    const catWorkers = AppState.workers.filter(w => w.category === cat.id);
    const count = catWorkers.length;
    const catName = AppState.currentLang === 'hi' ? cat.nameHi : cat.nameEn;
    const catSub = AppState.currentLang === 'hi' ? cat.nameEn : cat.nameHi;

    return `
      <div class="category-tile" onclick="openCategoryWorkers('${cat.id}')">
        <div class="category-letter-avatar ${cat.letter.toLowerCase()}">
          ${cat.letter}
        </div>
        <div class="category-name-en">${catName}</div>
        <div class="category-name-hi">${catSub}</div>
        <div class="category-count-sub">${count} ${t('available')}</div>
      </div>
    `;
  }).join('');
}

function openCategoryWorkers(catId) {
  AppState.selectedCategory = catId;
  navigateTo('category_workers', { category: catId });
}

// ==========================================================================
// Screen 4: Category Workers Listing (PDF Page 3 - Real Photos & Work Sites)
// ==========================================================================
function renderCategoryWorkers() {
  const headerTitle = document.getElementById('categoryWorkersHeaderTitle');
  const headerSub = document.getElementById('categoryWorkersHeaderSub');
  const listContainer = document.getElementById('categoryWorkersList');

  const catObj = GAON_DATA.workCategories.find(c => c.id === AppState.selectedCategory) || GAON_DATA.workCategories[0];
  const catName = AppState.currentLang === 'hi' ? catObj.nameHi : catObj.nameEn;
  const catSub = AppState.currentLang === 'hi' ? catObj.nameEn : catObj.nameHi;

  let filtered = AppState.workers.filter(w => w.category === catObj.id);

  if (AppState.distanceFilter === 'village') {
    const curVillage = AppState.currentLocation?.village || 'Sundarpur';
    filtered = filtered.filter(w => w.village.toLowerCase() === curVillage.toLowerCase() || w.distanceKm === 0);
  } else if (AppState.distanceFilter === '10km') {
    filtered = filtered.filter(w => w.distanceKm <= 10);
  } else if (AppState.distanceFilter === '50km') {
    filtered = filtered.filter(w => w.distanceKm <= 50);
  }

  if (headerTitle) headerTitle.textContent = catName;
  if (headerSub) headerSub.textContent = `${catSub} · ${filtered.length} ${t('workersLabel')}`;

  const pills = document.querySelectorAll('#categoryDistancePills .distance-pill');
  pills.forEach(p => {
    if (p.getAttribute('data-dist') === AppState.distanceFilter) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align:center; padding: 40px 16px; color:#64748b;">
        <p style="font-size:16px; font-weight:700;">No workers found in this distance radius.</p>
        <p style="font-size:13px; margin-top:4px;">Try selecting "Anywhere" or add your worker profile.</p>
        <button class="btn-hire-primary" style="margin: 16px auto; width: auto; padding: 8px 18px;" onclick="navigateTo('profile_creator')">
          + Register As A Worker
        </button>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filtered.map(w => {
    const isAvailable = w.status === 'available';
    const statusText = AppState.currentLang === 'hi' ? w.statusHi : w.statusEn;
    const distanceText = w.distanceKm === 0 ? w.village : `${w.distanceKm} km · ${w.village}`;
    const photoSrc = w.photo || GAON_ASSETS.carpenterAvatar;
    const sitesCount = (w.workSites && w.workSites.length) ? w.workSites.length : 0;

    return `
      <div class="worker-list-card">
        <div class="worker-card-main" onclick="openWorkerDetailsModal('${w.id}')">
          ${getDummyAvatarHTML(w.name, 54, 20, "#1b4332", "#4ade80", "#2d6a4f")}
          <div class="worker-detail-col">
            <div class="worker-name-row">
              <span class="worker-name-text">${w.name}</span>
              <span class="status-dot ${isAvailable ? 'available' : 'busy'}"></span>
            </div>
            <div class="worker-meta-row">
              ${distanceText} · ${w.experience} yrs · ★ ${w.rating}
            </div>
            ${sitesCount > 0 ? `
              <div class="worker-sites-pill">
                📍 ${sitesCount} ${AppState.currentLang === 'hi' ? 'कार्य स्थल (प्रोजेक्ट)' : 'Work Sites Done'}
              </div>
            ` : ''}
            <div class="worker-phone-row" style="font-size:11.5px; color:#64748b; margin-top:2px;">
              <span>📞 ${maskPhone(w.phone)}</span>
            </div>
            <div class="worker-status-text ${isAvailable ? 'available' : 'busy'}">
              ${statusText}
            </div>
          </div>
        </div>

        <button class="call-btn-circle" title="Call ${w.name}" onclick="openCallDialog('${w.name}', '${w.phone}', '${w.skillNameEn}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </button>
      </div>
    `;
  }).join('');
}

function setDistanceFilter(dist) {
  AppState.distanceFilter = dist;
  renderCategoryWorkers();
}

// ==========================================================================
// Screen 5: Hire Workers Directory (PDF Page 4)
// ==========================================================================
function renderHireWorkersList() {
  const listContainer = document.getElementById('hireWorkersListContainer');
  const countSpan = document.getElementById('hireNearCountText');
  const catPillsContainer = document.getElementById('hireCategoryPills');

  // Update Hired Team Banner (User Request)
  const hiredBannerBadge = document.getElementById('hiredBannerCountBadge');
  const hiredBannerTitle = document.getElementById('hiredBannerTitle');
  const hiredBannerSub = document.getElementById('hiredBannerSub');
  if (hiredBannerBadge) {
    const count = AppState.hiredWorkers.length;
    hiredBannerBadge.textContent = `${count} ${AppState.currentLang === 'hi' ? 'सक्रिय' : 'Active'}`;
  }
  if (hiredBannerTitle) {
    hiredBannerTitle.textContent = AppState.currentLang === 'hi' ? 'मेरे रखे गए मज़दूर एवं दैनिक हाजिरी रजिस्टर' : 'My Hired Workers & Daily Attendance Register';
  }
  if (hiredBannerSub) {
    hiredBannerSub.textContent = AppState.currentLang === 'hi' ? 'दैनिक उपस्थिति दर्ज करें और कुल देय मजदूरी देखें' : 'Track present/absent days and calculate total wages due';
  }

  const categories = [
    { id: 'all', nameEn: 'All', nameHi: 'सभी' },
    ...GAON_DATA.workCategories
  ];

  if (catPillsContainer) {
    catPillsContainer.innerHTML = categories.map(cat => {
      const activeClass = (AppState.selectedCategory === cat.id) || (cat.id === 'all' && AppState.selectedCategory === 'all') ? 'active' : '';
      const label = AppState.currentLang === 'hi' ? cat.nameHi : cat.nameEn;
      return `<button class="cat-pill ${activeClass}" onclick="filterHireByCategory('${cat.id}')">${label}</button>`;
    }).join('');
  }

  let list = AppState.workers;
  if (AppState.selectedCategory && AppState.selectedCategory !== 'all') {
    list = list.filter(w => w.category === AppState.selectedCategory);
  }

  if (countSpan) {
    countSpan.textContent = `${list.length} ${t('workersNearYou')}`;
  }

  if (listContainer) {
    listContainer.innerHTML = list.map(w => {
      const isAvailable = w.status === 'available';
      const statusText = AppState.currentLang === 'hi' ? w.statusHi : w.statusEn;
      const trade = AppState.currentLang === 'hi' ? w.skillNameHi : w.skillNameEn;
      const locText = w.distanceKm === 0 ? w.village : `${w.distanceKm} km · ${w.village}`;
      const photoSrc = w.photo || GAON_ASSETS.carpenterAvatar;
      const sitesCount = (w.workSites && w.workSites.length) ? w.workSites.length : 0;
      const isAlreadyHired = AppState.hiredWorkers.some(hw => hw.workerId === w.id);

      return `
        <div class="hire-worker-card">
          <div class="hire-card-top">
            <div class="hire-profile-info">
              ${getDummyAvatarHTML(w.name, 54, 20, "#1b4332", "#4ade80", "#2d6a4f")}
              <div class="hire-name-col">
                <h4>${w.name}</h4>
                <div class="hire-trade-text">${trade} · ${w.experience} yrs</div>
                <div class="hire-rating-row">
                  ★ ${w.rating} <span style="color:#64748b; font-weight:normal;">(${w.jobsCompleted} jobs)</span>
                </div>
              </div>
            </div>

            <div class="hire-rate-box">
              <div class="hire-price">₹${w.dailyRate}</div>
              <div class="hire-price-unit">${t('perDay')}</div>
            </div>
          </div>

          <div class="hire-tags-row">
            ${isAlreadyHired ? `<span class="badge-tag" style="background:#dcfce7; color:#15803d; font-weight:800;">✓ ${AppState.currentLang === 'hi' ? 'आपकी टीम में' : 'On Your Team'}</span>` : ''}
            <span class="badge-tag ${isAvailable ? 'available' : 'busy'}">${statusText}</span>
            <span class="badge-tag location">📍 ${locText}</span>
            ${sitesCount > 0 ? `<span class="badge-tag sites">🏗️ ${sitesCount} Work Sites</span>` : ''}
            ${w.verified ? '<span class="badge-tag" style="background:#ecfdf5; color:#047857;">✓ Verified</span>' : ''}
          </div>

          <div class="hire-actions-row">
            ${isAlreadyHired ? `
              <button class="btn-hire-primary" style="background:#15803d;" onclick="navigateTo('profile_creator')">
                📋 ${AppState.currentLang === 'hi' ? 'हाजिरी रजिस्टर' : 'Attendance'}
              </button>
            ` : `
              <button class="btn-hire-primary" onclick="openHireWorkerModal('${w.id}')">
                ✓ ${t('hireBtn')}
              </button>
            `}
            <button class="btn-profile-secondary" onclick="openCallDialog('${w.name}', '${w.phone}', '${w.skillNameEn}')">
              📞 ${AppState.currentLang === 'hi' ? 'फ़ोन' : 'Call'}
            </button>
            <button class="btn-profile-secondary" onclick="openWorkerDetailsModal('${w.id}')">
              ${t('profileBtn')}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
}

function filterHireByCategory(catId) {
  AppState.selectedCategory = catId;
  renderHireWorkersList();
}

// ==========================================================================
// Screen 6: Gaon Bazaar (PDF Page 5 - Real Photos)
// ==========================================================================
function renderGaonBazaar() {
  const container = document.getElementById('bazaarProductsGrid');
  const soldInTitle = document.getElementById('bazaarSoldInTitle');
  if (!container) return;

  const village = AppState.currentLocation?.village || 'Sundarpur';
  if (soldInTitle) {
    soldInTitle.textContent = `${t('soldIn')} ${village}`;
  }

  let list = AppState.products;
  if (AppState.bazaarFilter === 'in_village') {
    list = list.filter(p => p.canBuy === 'village' || p.village.toLowerCase() === village.toLowerCase());
  } else if (AppState.bazaarFilter === 'nearby') {
    list = list.filter(p => p.canBuy === 'village' || p.canBuy === 'nearby');
  }

  container.innerHTML = list.map(p => {
    const isInCart = AppState.cart.some(item => item.id === p.id);
    const prodName = AppState.currentLang === 'hi' ? p.nameHi : p.name;
    const photoSrc = p.photo || GAON_ASSETS.wheatSeedPhoto;
    const shopPhoto = p.shopPhoto || GAON_ASSETS.storeAvatar;

    return `
      <div class="product-bazaar-card">
        <div class="product-photo-box">
          ${getDummyProductBadgeHTML(p.name, p.category, 90)}
        </div>
        <div class="product-card-body">
          <div>
            <div class="product-card-title">${prodName}</div>
            <div class="product-card-price">₹${p.price.toLocaleString('en-IN')} <span class="product-unit-small">/ ${p.unit}</span></div>
            <div class="product-shop-badge">
              <img src="${shopPhoto}" class="product-shop-icon-img" alt="${p.shopName}">
              <span>${p.shopName}</span>
            </div>
            <div class="product-distance-badge">${p.distanceText}</div>
          </div>
          <button class="btn-add-to-cart ${isInCart ? 'in-cart' : ''}" onclick="toggleCartItem('${p.id}')">
            ${isInCart ? '✓ Added in Cart' : t('addBuy')}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function setBazaarFilter(filterType) {
  AppState.bazaarFilter = filterType;
  const pills = document.querySelectorAll('#bazaarFilterPills .bazaar-pill');
  pills.forEach(p => {
    if (p.getAttribute('data-filter') === filterType) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
  renderGaonBazaar();
}

function toggleCartItem(prodId) {
  const prod = AppState.products.find(p => p.id === prodId);
  if (!prod) return;

  const index = AppState.cart.findIndex(i => i.id === prodId);
  if (index >= 0) {
    AppState.cart.splice(index, 1);
    showToast(`Removed from cart`);
  } else {
    AppState.cart.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      unit: prod.unit,
      qty: 1,
      shopName: prod.shopName
    });
    showToast(`Added to cart: ${prod.name}`);
  }
  saveCart();
  renderGaonBazaar();
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-counter-badge');
  const count = AppState.cart.reduce((sum, item) => sum + item.qty, 0);
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ==========================================================================
// Screen 7: Sell a Product / Store Manager Interface (PDF Page 6 - Real Photos)
// ==========================================================================
function renderSellProductForm() {
  const shopSubtitle = document.getElementById('sellProductShopSub');
  
  let currentShop = 'Sharma Beej Bhandar';
  if (AppState.activeUserProfile && AppState.activeUserProfile.role === 'store_manager') {
    currentShop = AppState.activeUserProfile.shopName;
  }

  if (shopSubtitle) {
    shopSubtitle.textContent = `${t('sellHeaderSubtitle')} · ${currentShop}`;
  }
}

function handleProductPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    AppState.tempProductPhoto = e.target.result;
    const preview = document.getElementById('sellProdPhotoPreview');
    const label = document.getElementById('sellProdPhotoLabel');
    if (preview) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    }
    if (label) {
      label.textContent = '✓ Photo Attached (Tap to change)';
    }
    showToast('Product photo attached!');
  };
  reader.readAsDataURL(file);
}

function setPresetProductPhoto(presetKey) {
  const asset = GAON_ASSETS[presetKey];
  if (asset) {
    AppState.tempProductPhoto = asset;
    const preview = document.getElementById('sellProdPhotoPreview');
    const label = document.getElementById('sellProdPhotoLabel');
    if (preview) {
      preview.src = asset;
      preview.style.display = 'block';
    }
    if (label) {
      label.textContent = '✓ Preset Photo Selected';
    }
    showToast('Preset product photo selected!');
  }
}

function handlePublishListing(e) {
  e?.preventDefault();
  const nameInput = document.getElementById('prodNameInput').value.trim();
  const priceInput = parseInt(document.getElementById('prodPriceInput').value, 10);
  const unitInput = document.getElementById('prodUnitInput').value.trim();
  const stockInput = parseInt(document.getElementById('prodStockInput').value, 10) || 10;
  const canBuy = document.querySelector('input[name="whoCanBuy"]:checked')?.value || 'nearby';
  const canDeliver = document.getElementById('canDeliverSwitch').checked;
  const village = AppState.currentLocation?.village || 'Sundarpur';

  if (!nameInput || isNaN(priceInput) || !unitInput) {
    showToast('Please fill Product Name, Price, and Unit', 'error');
    return;
  }

  let shopName = 'Sharma Beej Bhandar';
  let shopPhone = '+91 98390 11223';
  let shopPhoto = GAON_ASSETS.storeAvatar;

  if (AppState.activeUserProfile && AppState.activeUserProfile.role === 'store_manager') {
    shopName = AppState.activeUserProfile.shopName;
    shopPhone = AppState.activeUserProfile.phone;
    if (AppState.activeUserProfile.storePhoto) {
      shopPhoto = AppState.activeUserProfile.storePhoto;
    }
  }

  const newProduct = {
    id: 'p-' + Date.now(),
    name: nameInput,
    nameHi: nameInput,
    photo: AppState.tempProductPhoto || GAON_ASSETS.wheatSeedPhoto,
    price: priceInput,
    unit: unitInput,
    shopName: shopName,
    shopOwner: 'Store Manager',
    shopPhoto: shopPhoto,
    shopPhone: shopPhone,
    category: 'general',
    village: village,
    distanceText: canDeliver ? 'Home delivery' : 'Pick up · 500 m',
    deliveryType: canDeliver ? 'delivery' : 'pickup',
    stock: stockInput,
    canBuy: canBuy,
    canDeliver: canDeliver,
    description: `Fresh stock available at ${shopName}, ${village}. Call to order.`
  };

  AppState.products.unshift(newProduct);
  saveProducts();

  showToast(`✓ Listing Published: ${nameInput} for ₹${priceInput}/${unitInput}!`);
  
  // Reset temp
  AppState.tempProductPhoto = null;

  navigateTo('bazaar');
}

// ==========================================================================
// DEDICATED PROFILE CREATOR & MANAGER (WITH PHOTOS, WORK SITES & LOGOUT)
// ==========================================================================
function renderDedicatedProfileScreen() {
  const container = document.getElementById('profileScreenContent');
  if (!container) return;

  // IF USER IS ALREADY LOGGED IN: Show Active Profile Dashboard
  if (AppState.activeUserProfile) {
    const u = AppState.activeUserProfile;
    const defaultAvatar = u.role === 'store_manager' ? GAON_ASSETS.storeAvatar : (u.role === 'hirer' ? GAON_ASSETS.hirerAvatar : GAON_ASSETS.carpenterAvatar);
    const photoSrc = u.photo || defaultAvatar;

    container.innerHTML = `
      <div class="active-profile-card">
        <div class="profile-header-main">
          ${getDummyAvatarHTML(u.name, 64, 24, u.role === "store_manager" ? "#153243" : (u.role === "hirer" ? "#3b2d13" : "#1b4332"), u.role === "store_manager" ? "#38bdf8" : (u.role === "hirer" ? "#fef08a" : "#4ade80"))}
          <div class="profile-main-meta">
            <h3>${u.name}</h3>
            <p>📞 ${u.phone}</p>
            <p>📍 ${AppState.currentLocation?.village || 'Sundarpur'}, ${AppState.currentLocation?.district || 'Sonbhadra'}</p>
            <div class="profile-role-badge">✓ ${u.roleTitle || u.role}</div>
          </div>
        </div>

        ${u.role === 'worker' ? `
          <div style="background:#ffffff; border-radius:10px; padding:12px; margin-top:4px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:13px; font-weight:700;">Daily Rate:</span>
              <span style="font-size:15px; font-weight:800; color:#15803d;">₹${u.dailyRate || 650} / day</span>
            </div>
            <div style="font-size:12px; color:#64748b; margin-top:4px;">
              ${u.bio || 'Rural verified worker with authentic village experience.'}
            </div>
          </div>

          <!-- Past Work Sites List -->
          <div class="work-sites-box">
            <div class="work-sites-header">
              <h4>🏗️ ${t('workSitesTitle')}</h4>
            </div>
            <div id="activeProfileSitesList">
              ${(u.workSites && u.workSites.length) ? u.workSites.map(s => `
                <div class="work-site-item">
                  <div class="work-site-info">
                    ${s.photo ? `<img src="${s.photo}" class="work-site-thumb" alt="${s.siteName}">` : '<div class="work-site-thumb" style="display:flex; align-items:center; justify-content:center; font-size:18px;">📍</div>'}
                    <div>
                      <div class="work-site-title">${s.siteName}</div>
                      <div class="work-site-desc">${s.workType}</div>
                      <div class="work-site-year">${s.year}</div>
                    </div>
                  </div>
                </div>
              `).join('') : '<p style="font-size:12px; color:#64748b;">No past work sites added yet. Click edit to add past projects.</p>'}
            </div>
          </div>
        ` : ''}

        ${u.role === 'store_manager' ? `
          <div style="background:#ffffff; border-radius:10px; padding:12px; display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <img src="${u.storePhoto || GAON_ASSETS.storeAvatar}" style="width:48px; height:48px; border-radius:8px; object-fit:cover;" alt="${u.shopName}">
              <div>
                <strong style="font-size:15px; color:#0f172a;">${u.shopName}</strong>
                <p style="font-size:12px; color:#64748b;">Category: ${u.shopCategory || 'Seeds & Farm Supplies'}</p>
              </div>
            </div>

            <!-- Orders Manager Shortcut Card -->
            <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:8px; padding:10px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="font-size:13px; color:#14532d;">📦 Customer Orders Dashboard</strong>
                <p style="font-size:11.5px; color:#166534;">
                  ${AppState.orders.filter(o => o.status === 'pending' || o.status === 'ready').length} Pending · ${AppState.orders.filter(o => o.status === 'completed').length} Completed
                </p>
              </div>
              <button class="btn-publish-listing" style="width:auto; padding:6px 12px; font-size:12px; background:#0284c7;" onclick="navigateTo('shop_orders')">
                View Orders ›
              </button>
            </div>

            <button class="btn-publish-listing" style="padding:9px;" onclick="navigateTo('sell_product')">
              + Post New Product to Bazaar
            </button>
          </div>
        ` : ''}

        <!-- Work Owner: Hired Workers & Daily Attendance Register (User Request) -->
        ${u.role === 'hirer' ? `
          ${renderHiredWorkersAttendanceSection()}
        ` : ''}

        ${u.role !== 'hirer' && AppState.hiredWorkers.length > 0 ? `
          <div style="margin-top:14px; border-top:1.5px dashed #cbd5e1; padding-top:12px;">
            ${renderHiredWorkersAttendanceSection()}
          </div>
        ` : ''}

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:8px;">
          <button type="button" class="btn-profile-secondary" onclick="openProfileEditForm()">
            ✏️ Edit Profile
          </button>
          <button type="button" class="btn-logout-full" onclick="handleUserLogout()">
            🚪 ${t('logout')}
          </button>
        </div>
      </div>
    `;
    return;
  }

  // IF GUEST: Show Tabs for Hired Workers & Attendance vs Profile Creation Form
  container.innerHTML = `
    <div style="display:flex; background:#e2e8f0; border-radius:10px; padding:3px; margin-bottom:14px;">
      <button type="button" class="lang-btn ${AppState.profileActiveTab === 'register' ? 'active' : ''}" style="flex:1; padding:8px 6px; border-radius:8px; font-weight:800; font-size:12px;" onclick="setProfileScreenTab('register')">
        👥 ${AppState.currentLang === 'hi' ? 'रखे गए मजदूर व हाजिरी' : 'My Hired Team & Attendance'} (${AppState.hiredWorkers.length})
      </button>
      <button type="button" class="lang-btn ${AppState.profileActiveTab === 'profile' ? 'active' : ''}" style="flex:1; padding:8px 6px; border-radius:8px; font-weight:800; font-size:12px;" onclick="setProfileScreenTab('profile')">
        👤 ${AppState.currentLang === 'hi' ? 'नई प्रोफ़ाइल बनाएं' : 'Create Profile'}
      </button>
    </div>
    <div id="guestProfileTabContent"></div>
  `;

  const tabContent = document.getElementById('guestProfileTabContent');
  if (AppState.profileActiveTab === 'register') {
    tabContent.innerHTML = renderHiredWorkersAttendanceSection();
  } else {
    renderProfileCreationForm(tabContent);
  }
}

function setProfileScreenTab(tab) {
  AppState.profileActiveTab = tab;
  renderDedicatedProfileScreen();
}

function openProfileEditForm() {
  const container = document.getElementById('profileScreenContent');
  if (!container) return;
  renderProfileCreationForm(container, true);
}

function renderProfileCreationForm(container, isEdit = false) {
  const existing = isEdit ? AppState.activeUserProfile : null;
  AppState.tempWorkSites = existing?.workSites ? [...existing.workSites] : [
    {
      siteName: "Sundarpur Primary School",
      workType: "Main Gate & Wall Work",
      year: "2023",
      photo: GAON_ASSETS.siteSchoolWallPhoto
    }
  ];

  AppState.tempProfilePhoto = existing?.photo || null;
  AppState.tempStorePhoto = existing?.storePhoto || null;

  const isHi = AppState.currentLang === 'hi';
  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:14px;">
      
      ${!isEdit ? `
        <!-- Already Registered Banner for Quick Login -->
        <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:12px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="font-size:13.5px; color:#14532d;">🔑 ${isHi ? 'पहले से प्रोफ़ाइल बनाई है?' : 'Already created a profile before?'}</strong>
            <p style="font-size:11.5px; color:#166534; margin:2px 0 0 0;">${isHi ? 'पुराने खाते में प्रवेश हेतु मोबाइल नंबर से तुरंत लॉगिन करें।' : 'Log in with your mobile number to access your existing account.'}</p>
          </div>
          <button type="button" class="btn-profile-secondary" style="background:#16a34a; color:#fff; border:none; padding:7px 14px; font-size:12px; font-weight:800; cursor:pointer;" onclick="openLoginModal()">
            ${isHi ? 'लॉग इन करें ›' : 'Log in ›'}
          </button>
        </div>
      ` : ''}
      
      <!-- Role Switcher Tabs -->
      <div class="profile-role-tabs">
        <button type="button" class="profile-role-tab-btn ${AppState.currentRole === 'worker' ? 'active' : ''}" onclick="selectProfileRole('worker')">
          🛠️ Worker (कारीगर)
        </button>
        <button type="button" class="profile-role-tab-btn ${AppState.currentRole === 'hirer' ? 'active' : ''}" onclick="selectProfileRole('hirer')">
          🤝 Hirer (मालिक)
        </button>
        <button type="button" class="profile-role-tab-btn ${AppState.currentRole === 'store_manager' ? 'active' : ''}" onclick="selectProfileRole('store_manager')">
          🏪 Store (दुकानदार)
        </button>
      </div>

      <!-- Main Form -->
      <form onsubmit="handleSaveEnhancedProfile(event)" style="display:flex; flex-direction:column; gap:14px;">
        
        <!-- Photo Upload Box -->
        <div class="avatar-upload-row">
          <img src="${AppState.tempProfilePhoto || GAON_ASSETS.carpenterAvatar}" id="profAvatarPreview" class="upload-avatar-preview" alt="Avatar">
          <div style="flex:1;">
            <label class="form-label">
              ${AppState.currentRole === 'store_manager' ? 'Owner / Store Photo (फोटो)' : 'Profile Photo / अपनी फोटो लगाएं'}
            </label>
            <input type="file" id="profPhotoFileInput" accept="image/*" style="display:none;" onchange="handleProfilePhotoUpload(event)">
            <div style="display:flex; gap:6px; margin-top:4px;">
              <button type="button" class="btn-profile-secondary" style="padding:5px 10px; font-size:11.5px;" onclick="document.getElementById('profPhotoFileInput').click()">
                📷 Upload Photo
              </button>
              <button type="button" class="btn-profile-secondary" style="padding:5px 10px; font-size:11.5px;" onclick="setPresetAvatar()">
                👤 Pick Avatar
              </button>
            </div>
          </div>
        </div>

        <!-- Common Name & Phone -->
        <div class="form-field-group">
          <label class="form-label">${t('fullName')} <span class="req">*</span></label>
          <input type="text" id="profNameInput" class="form-input-text" placeholder="e.g. Rameshwar Lal" value="${existing?.name || ''}" required>
        </div>

        <div class="form-field-group">
          <label class="form-label">${t('phone')} <span class="req">*</span></label>
          <input type="tel" id="profPhoneInput" class="form-input-text" placeholder="+91 98XXX XXXXX" value="${existing?.phone || ''}" required>
        </div>

        <!-- ROLE 1: WORKER SPECIFIC FORM -->
        <div id="roleWorkerSection" class="${AppState.currentRole === 'worker' ? '' : 'hidden'}" style="display:flex; flex-direction:column; gap:12px;">
          <div class="form-field-group">
            <label class="form-label">${t('primarySkill')} <span class="req">*</span></label>
            <select id="profSkillSelect" class="select-custom-field">
              ${GAON_DATA.workCategories.map(c => `
                <option value="${c.id}">${c.nameEn} (${c.nameHi})</option>
              `).join('')}
            </select>
          </div>

          <div class="form-row-two-col">
            <div class="form-field-group">
              <label class="form-label">${t('experienceYears')}</label>
              <input type="number" id="profExpInput" class="form-input-text" value="${existing?.experience || 8}" min="1">
            </div>
            <div class="form-field-group">
              <label class="form-label">${t('expectedWage')}</label>
              <input type="number" id="profWageInput" class="form-input-text" value="${existing?.dailyRate || 650}">
            </div>
          </div>

          <div class="form-field-group">
            <label class="form-label">Work Bio &amp; Skill Specialties</label>
            <textarea id="profBioInput" class="form-input-text" rows="2" placeholder="e.g. Experienced in boundary walls, temple carving, field tractor mechanics.">${existing?.bio || ''}</textarea>
          </div>

          <!-- WHERE HE OR SHE HAS DONE WORK SECTION (User Request) -->
          <div class="work-sites-box">
            <div class="work-sites-header">
              <div>
                <h4>🏗️ ${t('workSitesTitle')}</h4>
                <p style="font-size:11px; color:#64748b;">${t('workSitesSub')}</p>
              </div>
            </div>

            <!-- Dynamic Sites Repeater -->
            <div id="profWorkSitesRepeater">
              ${renderWorkSitesItemsHTML()}
            </div>

            <!-- Add Site Inputs -->
            <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px; display:flex; flex-direction:column; gap:8px;">
              <input type="text" id="newSiteName" class="form-input-text" placeholder="Village Site (e.g. Rampur Primary School)">
              <input type="text" id="newSiteWork" class="form-input-text" placeholder="Work Completed (e.g. 500ft Boundary Wall Plaster)">
              <div class="form-row-two-col">
                <input type="text" id="newSiteYear" class="form-input-text" placeholder="Year / Duration (e.g. 2023 · 15 days)" value="2023">
                <input type="file" id="newSitePhotoInput" accept="image/*" style="display:none;" onchange="handleWorkSitePhotoUpload(event)">
                <button type="button" class="btn-profile-secondary" onclick="document.getElementById('newSitePhotoInput').click()">
                  📷 Work Photo
                </button>
              </div>
              <div id="newSitePhotoNotice" style="font-size:11px; color:#15803d; font-weight:700;"></div>
              <button type="button" class="btn-add-site-outline" onclick="handleAddWorkSiteItem()">
                ${t('addWorkSiteBtn')}
              </button>
            </div>
          </div>
        </div>

        <!-- ROLE 2: HIRER SPECIFIC FORM -->
        <div id="roleHirerSection" class="${AppState.currentRole === 'hirer' ? '' : 'hidden'}" style="display:flex; flex-direction:column; gap:12px;">
          <div class="form-field-group">
            <label class="form-label">${t('workNeeded')}</label>
            <input type="text" id="profHirerNeeded" class="form-input-text" placeholder="e.g. Farm harvesting, building boundary wall, wiring" value="${existing?.workNeeded || ''}">
          </div>

          <div class="form-field-group">
            <label class="form-label">Farm / House Landmark</label>
            <input type="text" id="profHirerLandmark" class="form-input-text" placeholder="e.g. Near Shiv Temple, Sundarpur" value="${existing?.landmark || ''}">
          </div>
        </div>

        <!-- ROLE 3: STORE MANAGER SPECIFIC FORM -->
        <div id="roleStoreSection" class="${AppState.currentRole === 'store_manager' ? '' : 'hidden'}" style="display:flex; flex-direction:column; gap:12px;">
          <!-- Storefront Photo Upload -->
          <div class="photo-upload-dropzone" onclick="document.getElementById('storePhotoFileInput').click()">
            <input type="file" id="storePhotoFileInput" accept="image/*" style="display:none;" onchange="handleStorePhotoUpload(event)">
            <span style="font-size:26px;">🏪</span>
            <strong style="font-size:13px; color:var(--primary-green);">Upload Storefront Photo (दुकान की फोटो)</strong>
            <p style="font-size:11px; color:#64748b;">Show your shop front, shutter, or signboard to village buyers</p>
            <img id="storePhotoPreview" src="${AppState.tempStorePhoto || ''}" style="${AppState.tempStorePhoto ? 'display:block;' : 'display:none;'}" class="photo-preview-box" alt="Store Photo">
          </div>

          <div class="form-field-group">
            <label class="form-label">${t('shopName')} <span class="req">*</span></label>
            <input type="text" id="profShopNameInput" class="form-input-text" placeholder="e.g. Kisan Khad Beej Bhandar" value="${existing?.shopName || 'Sharma Beej Bhandar'}">
          </div>

          <div class="form-field-group">
            <label class="form-label">${t('shopCategory')}</label>
            <select id="profShopCatSelect" class="select-custom-field">
              <option value="seeds">Seeds &amp; Fertilizer (बीज व खाद)</option>
              <option value="dairy">Dairy &amp; Milk Products (डेयरी)</option>
              <option value="tools">Hardware &amp; Farm Tools (औजार)</option>
              <option value="building">Building Materials (सीमेंट, सरिया)</option>
              <option value="grocery">General Village Store (किराना)</option>
            </select>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn-publish-listing" style="margin-top:6px;">
          ✓ ${t('saveProfile')}
        </button>

        ${isEdit ? `
          <button type="button" class="btn-logout-full" onclick="handleUserLogout()">
            🚪 ${t('logout')}
          </button>
        ` : ''}
      </form>
    </div>
  `;
}

function selectProfileRole(role) {
  AppState.currentRole = role;
  const container = document.getElementById('profileScreenContent');
  if (container) {
    renderProfileCreationForm(container, false);
  }
}

function handleProfilePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    AppState.tempProfilePhoto = evt.target.result;
    const preview = document.getElementById('profAvatarPreview');
    if (preview) preview.src = evt.target.result;
    showToast('Profile photo updated!');
  };
  reader.readAsDataURL(file);
}

function setPresetAvatar() {
  const avatars = [GAON_ASSETS.carpenterAvatar, GAON_ASSETS.masonAvatar, GAON_ASSETS.farmLabourAvatar, GAON_ASSETS.electricianAvatar, GAON_ASSETS.storeAvatar, GAON_ASSETS.hirerAvatar];
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
  AppState.tempProfilePhoto = randomAvatar;
  const preview = document.getElementById('profAvatarPreview');
  if (preview) preview.src = randomAvatar;
  showToast('Preset avatar selected!');
}

function handleStorePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    AppState.tempStorePhoto = evt.target.result;
    const preview = document.getElementById('storePhotoPreview');
    if (preview) {
      preview.src = evt.target.result;
      preview.style.display = 'block';
    }
    showToast('Storefront photo attached!');
  };
  reader.readAsDataURL(file);
}

let tempWorkSitePhoto = null;
function handleWorkSitePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    tempWorkSitePhoto = evt.target.result;
    const notice = document.getElementById('newSitePhotoNotice');
    if (notice) notice.textContent = '✓ Work photo attached!';
    showToast('Work photo attached!');
  };
  reader.readAsDataURL(file);
}

function handleAddWorkSiteItem() {
  const name = document.getElementById('newSiteName')?.value.trim();
  const work = document.getElementById('newSiteWork')?.value.trim();
  const year = document.getElementById('newSiteYear')?.value.trim() || '2023';

  if (!name || !work) {
    showToast('Please enter Site Name and Work Done', 'error');
    return;
  }

  AppState.tempWorkSites.push({
    siteName: name,
    workType: work,
    year: year,
    photo: tempWorkSitePhoto || GAON_ASSETS.siteSchoolWallPhoto
  });

  tempWorkSitePhoto = null;
  const repeater = document.getElementById('profWorkSitesRepeater');
  if (repeater) {
    repeater.innerHTML = renderWorkSitesItemsHTML();
  }

  // Clear inputs
  document.getElementById('newSiteName').value = '';
  document.getElementById('newSiteWork').value = '';
  document.getElementById('newSitePhotoNotice').textContent = '';
  showToast('Work site added to your portfolio!');
}

function removeWorkSiteItem(idx) {
  AppState.tempWorkSites.splice(idx, 1);
  const repeater = document.getElementById('profWorkSitesRepeater');
  if (repeater) {
    repeater.innerHTML = renderWorkSitesItemsHTML();
  }
}

function renderWorkSitesItemsHTML() {
  if (!AppState.tempWorkSites || AppState.tempWorkSites.length === 0) {
    return `<p style="font-size:12px; color:#64748b; padding:4px 0;">No past work sites added yet.</p>`;
  }

  return AppState.tempWorkSites.map((s, idx) => `
    <div class="work-site-item">
      <div class="work-site-info">
        ${s.photo ? `<img src="${s.photo}" class="work-site-thumb" alt="${s.siteName}">` : '<div class="work-site-thumb" style="display:flex; align-items:center; justify-content:center; font-size:16px;">📍</div>'}
        <div>
          <div class="work-site-title">${s.siteName}</div>
          <div class="work-site-desc">${s.workType}</div>
          <div class="work-site-year">${s.year}</div>
        </div>
      </div>
      <button type="button" class="btn-remove-site" onclick="removeWorkSiteItem(${idx})">✕</button>
    </div>
  `).join('');
}

function handleSaveEnhancedProfile(e) {
  e?.preventDefault();
  const name = document.getElementById('profNameInput').value.trim();
  const phone = document.getElementById('profPhoneInput').value.trim();
  const village = AppState.currentLocation?.village || 'Sundarpur';

  if (!name || !phone) {
    showToast('Please enter your Name and Phone Number', 'error');
    return;
  }

  if (AppState.currentRole === 'worker') {
    const skillSelect = document.getElementById('profSkillSelect').value;
    const exp = parseInt(document.getElementById('profExpInput').value, 10) || 8;
    const wage = parseInt(document.getElementById('profWageInput').value, 10) || 650;
    const bio = document.getElementById('profBioInput').value.trim() || 'Experienced rural craftsman with authentic village work record.';

    const catObj = GAON_DATA.workCategories.find(c => c.id === skillSelect) || GAON_DATA.workCategories[0];
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'WK';

    const newWorker = {
      id: 'w-' + Date.now(),
      initials: initials,
      name: name,
      photo: AppState.tempProfilePhoto || GAON_ASSETS.carpenterAvatar,
      category: catObj.id,
      skillNameEn: catObj.nameEn,
      skillNameHi: catObj.nameHi,
      experience: exp,
      rating: 5.0,
      jobsCompleted: 1,
      dailyRate: wage,
      phone: phone.startsWith('+91') ? phone : '+91 ' + phone,
      village: village,
      distanceKm: 0,
      status: 'available',
      statusEn: 'Available today',
      statusHi: 'आज उपलब्ध',
      verified: true,
      bio: bio,
      workSites: [...AppState.tempWorkSites]
    };

    AppState.workers.unshift(newWorker);
    saveWorkers();

    AppState.activeUserProfile = {
      role: 'worker',
      roleTitle: `${catObj.nameEn} (${catObj.nameHi})`,
      name: name,
      phone: phone,
      photo: newWorker.photo,
      dailyRate: wage,
      experience: exp,
      bio: bio,
      workSites: [...AppState.tempWorkSites],
      workerId: newWorker.id
    };

  } else if (AppState.currentRole === 'hirer') {
    const workNeeded = document.getElementById('profHirerNeeded').value.trim() || 'Farm & home construction';
    const landmark = document.getElementById('profHirerLandmark').value.trim() || '';

    AppState.activeUserProfile = {
      role: 'hirer',
      roleTitle: 'Hirer / Employer (मालिक)',
      name: name,
      phone: phone,
      photo: AppState.tempProfilePhoto || GAON_ASSETS.hirerAvatar,
      workNeeded: workNeeded,
      landmark: landmark
    };

  } else if (AppState.currentRole === 'store_manager') {
    const shopName = document.getElementById('profShopNameInput').value.trim() || `${name}'s Store`;
    const shopCat = document.getElementById('profShopCatSelect').value || 'seeds';

    AppState.activeUserProfile = {
      role: 'store_manager',
      roleTitle: `Store Manager · ${shopName}`,
      name: name,
      phone: phone,
      photo: AppState.tempProfilePhoto || GAON_ASSETS.storeAvatar,
      storePhoto: AppState.tempStorePhoto || GAON_ASSETS.storeAvatar,
      shopName: shopName,
      shopCategory: shopCat
    };
  }

  localStorage.setItem('gaon_active_profile', JSON.stringify(AppState.activeUserProfile));
  showToast(t('successMsg'));
  renderApp();
}

// ==========================================================================
// Worker Detail Modal & Booking Call Dialog (With Work Sites List)
// ==========================================================================
function openWorkerDetailsModal(workerId) {
  const w = AppState.workers.find(worker => worker.id === workerId);
  if (!w) return;

  const content = document.getElementById('workerModalContent');
  if (content) {
    const isAvailable = w.status === 'available';
    const statusText = AppState.currentLang === 'hi' ? w.statusHi : w.statusEn;
    const trade = AppState.currentLang === 'hi' ? w.skillNameHi : w.skillNameEn;
    const photoSrc = w.photo || GAON_ASSETS.carpenterAvatar;

    content.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <img src="${photoSrc}" style="width:64px; height:64px; border-radius:14px; object-fit:cover; border:2px solid #bbf7d0;" alt="${w.name}">
        <div>
          <h3 style="font-size:18px; font-weight:800; color:#0f172a;">${w.name}</h3>
          <div style="font-size:13px; color:#475569;">${trade} · ${w.experience} Years Experience</div>
          <div style="font-size:12.5px; color:#f59e0b; font-weight:700; margin-top:2px;">
            ★ ${w.rating} · (${w.jobsCompleted} village projects completed)
          </div>
        </div>
      </div>

      <div style="background:#f8fafc; border-radius:10px; padding:10px; margin-bottom:12px; display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <div>
          <span style="font-size:11px; color:#64748b;">Daily Wage:</span>
          <div style="font-size:15px; font-weight:800; color:#0f172a;">₹${w.dailyRate} / day</div>
        </div>
        <div>
          <span style="font-size:11px; color:#64748b;">Current Status:</span>
          <div style="font-size:12px; font-weight:700; color:${isAvailable ? '#15803d' : '#b45309'};">${statusText}</div>
        </div>
        <div>
          <span style="font-size:11px; color:#64748b;">Village Location:</span>
          <div style="font-size:12.5px; font-weight:600; color:#334155;">📍 ${w.village} (${w.distanceKm === 0 ? 'My village' : w.distanceKm + ' km'})</div>
        </div>
        <div>
          <span style="font-size:11px; color:#64748b;">Verification:</span>
          <div style="font-size:12.5px; font-weight:700; color:#047857;">✓ Aadhaar &amp; Phone</div>
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <h4 style="font-size:13px; font-weight:700; color:#1e293b; margin-bottom:4px;">Work Experience Summary:</h4>
        <p style="font-size:12.5px; color:#475569; line-height:1.4;">${w.bio}</p>
      </div>

      <!-- WHERE HE/SHE DONE WORK DISPLAY (User Requirement) -->
      <div style="margin-bottom:14px;">
        <h4 style="font-size:13.5px; font-weight:800; color:#0f172a; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <span>🏗️</span>
          <span>${AppState.currentLang === 'hi' ? 'पहले कहाँ-कहाँ काम किया (कार्य स्थल):' : 'Past Work Sites & Projects Completed:'}</span>
        </h4>

        <div style="display:flex; flex-direction:column; gap:8px;">
          ${(w.workSites && w.workSites.length > 0) ? w.workSites.map(s => `
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px; display:flex; align-items:center; gap:10px;">
              ${s.photo ? `<img src="${s.photo}" style="width:48px; height:48px; border-radius:6px; object-fit:cover;" alt="${s.siteName}">` : '<div style="width:48px; height:48px; border-radius:6px; background:#dcfce7; display:flex; align-items:center; justify-content:center; font-size:20px;">📍</div>'}
              <div style="flex:1;">
                <div style="font-size:13px; font-weight:700; color:#0f172a;">${s.siteName}</div>
                <div style="font-size:11.5px; color:#475569;">${s.workType}</div>
                <div style="font-size:10.5px; color:#15803d; font-weight:600;">Year: ${s.year}</div>
              </div>
            </div>
          `).join('') : '<p style="font-size:12px; color:#64748b;">No past work sites recorded.</p>'}
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <button class="btn-publish-listing" style="margin-top:2px;" onclick="openHireWorkerModal('${w.id}'); closeModal('modalWorkerDetails');">
          ✓ ${AppState.currentLang === 'hi' ? 'काम पर रखें और हाजिरी शुरू करें' : 'Hire Worker & Start Attendance Register'} ›
        </button>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
          <button class="btn-profile-secondary" onclick="openCallDialog('${w.name}', '${w.phone}', '${w.skillNameEn}')">
            📞 Call Direct
          </button>
          <button class="btn-profile-secondary" onclick="openWhatsApp('${w.phone}', 'Hello ${w.name}, I found your profile on GaonKaam in ${w.village}. Are you available for work?')">
            💬 WhatsApp
          </button>
        </div>
      </div>
    `;
  }

  openModal('modalWorkerDetails');
}

function openCallDialog(name, phone, role) {
  const content = document.getElementById('callDialogContent');
  if (content) {
    content.innerHTML = `
      <div class="call-dialog-content">
        <div class="call-avatar-big">📞</div>
        <h3 style="font-size:18px; font-weight:800; color:#0f172a;">Connect with ${name}</h3>
        <p style="font-size:13px; color:#64748b; margin-top:2px;">${role} · Direct Phone Contact</p>
        <div class="call-number-highlight">${phone}</div>
        <p style="font-size:12px; color:#047857; margin-bottom:14px;">Direct line with no middleman or fee</p>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <a href="tel:${phone.replace(/\s+/g, '')}" class="btn-hire-primary" style="text-decoration:none;">
            📞 Dial This Number Now
          </a>
          <button class="btn-profile-secondary" onclick="openWhatsApp('${phone}', 'Namaste ${name}, I am contacting you from GaonKaam.')">
            💬 Send WhatsApp Message
          </button>
        </div>
      </div>
    `;
  }
  openModal('modalCallConnect');
}

function openWhatsApp(phone, msg) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function maskPhone(p) {
  if (!p) return '+91 98XXX XXXXX';
  const parts = p.split(' ');
  if (parts.length >= 3) {
    return `${parts[0]} ${parts[1].substring(0, 2)}XXX X${parts[2].substring(1)}`;
  }
  return p.substring(0, 6) + 'XXXX' + p.substring(p.length - 2);
}

// ==========================================================================
// Post A Job Modal (Hirer Feature on Page 4)
// ==========================================================================
function openPostJobModal() {
  openModal('modalPostJob');
}

function handlePublishJob(e) {
  e?.preventDefault();
  const title = document.getElementById('jobTitleInput').value.trim();
  const cat = document.getElementById('jobCatSelect').value;
  const count = parseInt(document.getElementById('jobWorkersCount').value, 10) || 2;
  const wage = parseInt(document.getElementById('jobWageInput').value, 10) || 500;
  const duration = document.getElementById('jobDurationInput').value.trim() || '2 days';
  const notes = document.getElementById('jobNotesInput').value.trim() || 'Urgent requirement, tea & snacks provided.';
  const village = AppState.currentLocation?.village || 'Sundarpur';

  if (!title) {
    showToast('Please enter a Job Title', 'error');
    return;
  }

  let hirerName = 'Local Hirer';
  let hirerPhone = '+91 98765 00000';
  if (AppState.activeUserProfile && AppState.activeUserProfile.role === 'hirer') {
    hirerName = AppState.activeUserProfile.name;
    hirerPhone = AppState.activeUserProfile.phone;
  }

  const newJob = {
    id: 'j-' + Date.now(),
    title: title,
    titleHi: title,
    hirerName: hirerName,
    hirerPhone: hirerPhone,
    category: cat,
    workersCount: count,
    duration: duration,
    dailyWage: wage,
    village: village,
    postedTime: 'Just now',
    notes: notes
  };

  AppState.jobs.unshift(newJob);
  saveJobs();

  closeModal('modalPostJob');
  showToast(`✓ Job Posted: ${count} workers needed! Nearby workers notified.`);
}

// ==========================================================================
// Voice Assistant / "Speak Instead of Typing · बोलकर बताएं"
// ==========================================================================
let speechRecognition = null;

function openVoiceAssistant() {
  openModal('modalVoiceAssistant');
  const statusEl = document.getElementById('voiceStatusText');
  const resultEl = document.getElementById('voiceTranscriptResult');
  
  if (statusEl) statusEl.textContent = AppState.currentLang === 'hi' ? 'कृपया बोलें... (उदा. "मुझे बढ़ई चाहिए" या "गेहूं का बीज")' : 'Listening... (e.g. "Find carpenter" or "Wheat seed")';
  if (resultEl) resultEl.textContent = '...';

  startVoiceCapture();
}

function startVoiceCapture() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const statusEl = document.getElementById('voiceStatusText');
  const resultEl = document.getElementById('voiceTranscriptResult');

  if (SpeechRecognition) {
    try {
      speechRecognition = new SpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = AppState.currentLang === 'hi' ? 'hi-IN' : 'en-IN';

      speechRecognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (resultEl) resultEl.textContent = `"${transcript}"`;
        processVoiceCommand(transcript);
      };

      speechRecognition.onerror = () => {
        if (statusEl) statusEl.textContent = `Microphone not active. Tap a quick rural voice suggestion below:`;
      };

      speechRecognition.start();
    } catch (err) {
      if (statusEl) statusEl.textContent = 'Choose or speak a rural service below:';
    }
  } else {
    if (statusEl) statusEl.textContent = 'Choose or speak a rural service below:';
  }
}

function triggerVoiceSuggestion(phrase) {
  const resultEl = document.getElementById('voiceTranscriptResult');
  if (resultEl) resultEl.textContent = `"${phrase}"`;
  processVoiceCommand(phrase);
}

function processVoiceCommand(text) {
  const lower = text.toLowerCase();
  const statusEl = document.getElementById('voiceStatusText');
  if (statusEl) statusEl.textContent = 'Finding results for: ' + text;

  setTimeout(() => {
    closeModal('modalVoiceAssistant');
    if (lower.includes('बढ़ई') || lower.includes('carpenter')) {
      openCategoryWorkers('carpenter');
    } else if (lower.includes('मिस्त्री') || lower.includes('mason')) {
      openCategoryWorkers('mason');
    } else if (lower.includes('बिजली') || lower.includes('electrician')) {
      openCategoryWorkers('electrician');
    } else if (lower.includes('मज़दूर') || lower.includes('farm') || lower.includes('खेत')) {
      openCategoryWorkers('farm_labour');
    } else if (lower.includes('बीज') || lower.includes('खाद') || lower.includes('seed') || lower.includes('दूध')) {
      navigateTo('bazaar');
    } else {
      navigateTo('all_work');
    }

    showToast(`Voice Search: "${text}"`);
  }, 1000);
}

// ==========================================================================
// Cart & Checkout Modal
// ==========================================================================
function openCartModal() {
  const container = document.getElementById('cartItemsList');
  const totalAmount = document.getElementById('cartTotalAmount');
  
  if (!AppState.cart || AppState.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 30px 10px; color:#64748b;">
        <p style="font-size:16px; font-weight:700;">Your village shopping cart is empty</p>
        <button class="btn-hire-primary" style="margin: 16px auto; width:auto; padding:8px 18px;" onclick="closeModal('modalCart'); navigateTo('bazaar');">
          Open Gaon Bazaar
        </button>
      </div>
    `;
    if (totalAmount) totalAmount.textContent = '₹0';
  } else {
    let total = 0;
    container.innerHTML = AppState.cart.map((item, idx) => {
      const itemSubtotal = item.price * item.qty;
      total += itemSubtotal;
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #e2e8f0;">
          <div>
            <div style="font-size:14px; font-weight:700; color:#0f172a;">${item.name}</div>
            <div style="font-size:12px; color:#64748b;">🏪 ${item.shopName} · ₹${item.price} / ${item.unit}</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:800; font-size:14px;">₹${itemSubtotal.toLocaleString('en-IN')}</span>
            <button style="border:none; background:#fee2e2; color:#dc2626; border-radius:6px; padding:4px 8px; cursor:pointer;" onclick="removeCartItem(${idx})">✕</button>
          </div>
        </div>
      `;
    }).join('');
    if (totalAmount) totalAmount.textContent = `₹${total.toLocaleString('en-IN')}`;
  }

  openModal('modalCart');
}

function removeCartItem(idx) {
  AppState.cart.splice(idx, 1);
  saveCart();
  openCartModal();
  renderGaonBazaar();
}

function handleCheckout(e) {
  e?.preventDefault();
  if (AppState.cart.length === 0) {
    showToast('Your cart is empty', 'error');
    return;
  }

  const custName = document.getElementById('cartCustomerName')?.value.trim() || 'Chaudhary Virendra';
  const custPhone = document.getElementById('cartCustomerPhone')?.value.trim() || '+91 98210 55443';
  const deliveryType = document.getElementById('cartDeliveryType')?.value || 'pickup';
  const landmark = document.getElementById('cartCustomerLandmark')?.value.trim() || 'Near Village Center';
  const village = AppState.currentLocation?.village || 'Sundarpur';

  // Group items by shopName and create real orders for each shop
  const shopsInCart = [...new Set(AppState.cart.map(i => i.shopName))];
  
  shopsInCart.forEach(shop => {
    const shopItems = AppState.cart.filter(i => i.shopName === shop);
    const subtotal = shopItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const newOrder = {
      id: "ORD-" + Math.floor(100 + Math.random() * 900),
      shopName: shop,
      customerName: custName,
      customerPhone: custPhone,
      customerVillage: `${village} (${landmark})`,
      deliveryType: deliveryType,
      status: "pending",
      orderDate: "Just now",
      items: [...shopItems],
      totalAmount: subtotal,
      notes: deliveryType === 'delivery' ? 'Request home delivery to village address' : 'Customer will pick up from shop'
    };
    AppState.orders.unshift(newOrder);
  });

  saveOrders();
  AppState.cart = [];
  saveCart();
  closeModal('modalCart');
  renderGaonBazaar();
  
  showToast(`✓ Order Placed! Sent to ${shopsInCart.join(', ')}.`);
}

// ==========================================================================
// SHOP OWNER ORDERS MANAGEMENT DASHBOARD LOGIC (User Request)
// ==========================================================================
function renderShopOrders() {
  const container = document.getElementById('shopOrdersScreenContent');
  const titleEl = document.getElementById('ordersManagerTitle');
  const subEl = document.getElementById('ordersManagerShopSub');
  if (!container) return;

  let currentShop = 'Sharma Beej Bhandar';
  if (AppState.activeUserProfile && AppState.activeUserProfile.role === 'store_manager') {
    currentShop = AppState.activeUserProfile.shopName || currentShop;
  }

  if (titleEl) titleEl.textContent = t('ordersDashboardTitle');
  if (subEl) subEl.textContent = `${t('ordersDashboardSub')} · ${currentShop}`;

  // Filter orders for this shop
  let shopOrders = AppState.orders.filter(o => o.shopName.toLowerCase() === currentShop.toLowerCase());
  
  // If no orders for this shop name, show all available orders so the user can test
  if (shopOrders.length === 0) {
    shopOrders = AppState.orders;
  }

  // Calculate KPIs (User request: how many orders come, pending, completed)
  const totalOrders = shopOrders.length;
  const pendingOrders = shopOrders.filter(o => o.status === 'pending' || o.status === 'ready').length;
  const completedOrders = shopOrders.filter(o => o.status === 'completed').length;
  const totalRevenue = shopOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Status Filter
  let filtered = shopOrders;
  if (AppState.orderStatusFilter === 'pending') {
    filtered = shopOrders.filter(o => o.status === 'pending' || o.status === 'ready');
  } else if (AppState.orderStatusFilter === 'completed') {
    filtered = shopOrders.filter(o => o.status === 'completed');
  }

  container.innerHTML = `
    <!-- Top KPIs -->
    <div class="orders-kpi-grid">
      <div class="kpi-card total">
        <div class="kpi-value">${totalOrders}</div>
        <div class="kpi-label">${t('totalOrdersKpi')}</div>
      </div>
      <div class="kpi-card pending">
        <div class="kpi-value">${pendingOrders}</div>
        <div class="kpi-label">${t('pendingOrdersKpi')}</div>
      </div>
      <div class="kpi-card completed">
        <div class="kpi-value">${completedOrders}</div>
        <div class="kpi-label">${t('completedOrdersKpi')}</div>
      </div>
      <div class="kpi-card revenue">
        <div class="kpi-value">₹${totalRevenue.toLocaleString('en-IN')}</div>
        <div class="kpi-label">${t('totalRevenueKpi')}</div>
      </div>
    </div>

    <!-- Filter Buttons -->
    <div class="orders-filter-bar">
      <button class="order-filter-btn ${AppState.orderStatusFilter === 'all' ? 'active' : ''}" onclick="setOrderStatusFilter('all')">
        ${t('allOrdersTab')} (${totalOrders})
      </button>
      <button class="order-filter-btn ${AppState.orderStatusFilter === 'pending' ? 'active' : ''}" onclick="setOrderStatusFilter('pending')">
        ⏳ ${t('pendingTab')} (${pendingOrders})
      </button>
      <button class="order-filter-btn ${AppState.orderStatusFilter === 'completed' ? 'active' : ''}" onclick="setOrderStatusFilter('completed')">
        ✓ ${t('completedTab')} (${completedOrders})
      </button>
    </div>

    <!-- Orders Cards List -->
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${filtered.length === 0 ? `
        <div style="text-align:center; padding:35px 16px; background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; color:#64748b;">
          <p style="font-size:15px; font-weight:700;">No orders found in this filter.</p>
          <p style="font-size:12px; margin-top:4px;">When customers place orders in Gaon Bazaar, they appear here live.</p>
        </div>
      ` : filtered.map(order => renderSingleOrderCard(order)).join('')}
    </div>
  `;
}

function renderSingleOrderCard(order) {
  const isPending = order.status === 'pending';
  const isReady = order.status === 'ready';
  const isCompleted = order.status === 'completed';
  const isCancelled = order.status === 'cancelled';

  let statusBadgeClass = 'pending';
  let statusText = '⏳ Pending (लंबित)';
  if (isReady) {
    statusBadgeClass = 'ready';
    statusText = '📦 Ready for Pickup (तैयार)';
  } else if (isCompleted) {
    statusBadgeClass = 'completed';
    statusText = '✓ Completed (डिलीवर हो गया)';
  } else if (isCancelled) {
    statusBadgeClass = 'cancelled';
    statusText = '✕ Cancelled (रद्द)';
  }

  const isPickup = order.deliveryType === 'pickup';

  return `
    <div class="shop-order-card">
      <!-- Order Card Header -->
      <div class="order-card-header">
        <div class="order-id-badge">
          <span>📦 #${order.id}</span>
          <span style="font-weight:normal; color:#64748b;">· ${order.shopName}</span>
        </div>
        <div class="order-status-badge ${statusBadgeClass}">
          ${statusText}
        </div>
      </div>

      <!-- Customer Details (User requirement: Who placed the order) -->
      <div class="customer-detail-box">
        <div class="customer-row-main">
          <div class="customer-name-group">
            <div class="customer-avatar-icon">👤</div>
            <div>
              <div class="customer-name-text">${order.customerName}</div>
              <div class="customer-location-text">📍 ${order.customerVillage}</div>
            </div>
          </div>
          <span class="delivery-badge-chip ${isPickup ? 'pickup' : 'delivery'}">
            ${isPickup ? t('storePickupBadge') : t('homeDeliveryBadge')}
          </span>
        </div>

        <div class="customer-contact-actions">
          <a href="tel:${order.customerPhone.replace(/\\s+/g, '')}" class="btn-contact-small">
            📞 Call (${order.customerPhone})
          </a>
          <button class="btn-contact-small" onclick="openWhatsApp('${order.customerPhone}', 'Namaste ${order.customerName}, this is ${order.shopName} regarding your order #${order.id}.')">
            💬 WhatsApp
          </button>
        </div>
      </div>

      <!-- Items Ordered Table -->
      <table class="order-items-table">
        <tbody>
          ${order.items.map(i => `
            <tr>
              <td><strong>${i.name}</strong> <span style="font-size:11px; color:#64748b;">(${i.unit})</span></td>
              <td class="qty-col">x${i.qty}</td>
              <td class="price-col">₹${(i.price * i.qty).toLocaleString('en-IN')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Order Total Bar -->
      <div class="order-total-bar">
        <div>
          <span style="font-size:11px; color:#64748b;">Order Date: ${order.orderDate}</span><br/>
          ${order.notes ? `<span style="font-size:11px; color:#047857; font-weight:600;">Note: ${order.notes}</span>` : ''}
        </div>
        <div style="text-align:right;">
          <span style="font-size:11px; color:#64748b;">Total Bill:</span>
          <div class="order-total-amount">₹${order.totalAmount.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <!-- Shop Owner Status Action Buttons -->
      ${!isCompleted && !isCancelled ? `
        <div class="order-status-actions">
          ${isPending ? `
            <button class="btn-order-action ready" onclick="updateOrderStatus('${order.id}', 'ready')">
              📦 Mark Ready
            </button>
            <button class="btn-order-action complete" onclick="updateOrderStatus('${order.id}', 'completed')">
              ✓ Mark Delivered
            </button>
          ` : ''}
          ${isReady ? `
            <button class="btn-order-action complete" style="grid-column: span 2;" onclick="updateOrderStatus('${order.id}', 'completed')">
              ✓ Mark Delivered &amp; Completed
            </button>
          ` : ''}
          <button class="btn-order-action cancel" style="${isPending ? 'grid-column: span 2;' : ''}" onclick="updateOrderStatus('${order.id}', 'cancelled')">
            ✕ Cancel Order
          </button>
        </div>
      ` : `
        <div style="background:#f1f5f9; border-radius:6px; padding:6px 10px; font-size:11px; text-align:center; color:#475569; font-weight:600;">
          ${isCompleted ? '✓ Order has been fulfilled and delivered to customer' : '✕ This order was cancelled'}
        </div>
      `}
    </div>
  `;
}

function setOrderStatusFilter(filter) {
  AppState.orderStatusFilter = filter;
  renderShopOrders();
}

function updateOrderStatus(orderId, newStatus) {
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = newStatus;
  saveOrders();
  
  const statusLabels = {
    ready: 'Ready for Pickup / तैयार',
    completed: 'Delivered & Completed / पूरा हुआ ✓',
    cancelled: 'Cancelled / रद्द'
  };

  showToast(`Order #${orderId} marked as ${statusLabels[newStatus] || newStatus}!`);
  renderShopOrders();
}

// ==========================================================================
// Modal Helpers
// ==========================================================================
function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('active');
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('active');
}

function openLoginModal() {
  openModal('modalLogin');
  const input = document.getElementById('loginPhoneInput');
  if (input) setTimeout(() => input.focus(), 100);
}

function quickLoginWithPhone(phone) {
  const input = document.getElementById('loginPhoneInput');
  if (input) input.value = phone;
  handleLoginSubmit();
}

function handleLoginSubmit(e) {
  e?.preventDefault();
  const inputPhone = document.getElementById('loginPhoneInput') ? document.getElementById('loginPhoneInput').value.trim() : '';
  const cleanPhone = inputPhone.replace(/\D/g, '').slice(-10);

  if (!cleanPhone || cleanPhone.length < 10) {
    showToast('Please enter a valid 10-digit mobile number', 'error');
    return;
  }

  // 1. Search in persistent registered users
  let user = (AppState.registeredUsers || []).find(u => {
    const uPhone = (u.phone || '').replace(/\D/g, '').slice(-10);
    return uPhone === cleanPhone;
  });

  // 2. If not found in registeredUsers, check AppState.workers
  if (!user && AppState.workers) {
    const matchedWorker = AppState.workers.find(w => {
      const wPhone = (w.phone || '').replace(/\D/g, '').slice(-10);
      return wPhone === cleanPhone;
    });
    if (matchedWorker) {
      user = {
        role: 'worker',
        roleTitle: `${matchedWorker.skillNameEn} (${matchedWorker.skillNameHi})`,
        name: matchedWorker.name,
        phone: matchedWorker.phone,
        dailyRate: matchedWorker.dailyRate,
        experience: matchedWorker.experience || 3,
        village: matchedWorker.village || AppState.currentLocation?.village || 'Sundarpur',
        workSites: matchedWorker.workSites || []
      };
      saveToRegisteredUsers(user);
    }
  }

  // 3. If still not found, restore or create verified profile for this mobile number
  if (!user) {
    user = {
      role: AppState.currentRole || 'worker',
      roleTitle: AppState.currentRole === 'worker' ? 'Skilled Worker' : (AppState.currentRole === 'hirer' ? 'Work Owner' : 'Shop Owner'),
      name: `User ${cleanPhone.slice(-4)}`,
      phone: `+91 ${cleanPhone}`,
      village: AppState.currentLocation?.village || 'Sundarpur',
      workSites: []
    };
    saveToRegisteredUsers(user);
  }

  // Set active user profile and update role
  AppState.activeUserProfile = user;
  AppState.currentRole = user.role || AppState.currentRole || 'worker';
  localStorage.setItem('gaon_active_profile', JSON.stringify(user));
  localStorage.setItem('gaon_current_role', AppState.currentRole);

  closeModal('modalLogin');
  const isHi = AppState.currentLang === 'hi';
  showToast(isHi ? `स्वागत है ${user.name}! सफलतापूर्वक लॉग इन किया गया।` : `Welcome back, ${user.name}! Logged in successfully.`);
  renderApp();
}

// ==========================================================================
// Toast Helper
// ==========================================================================
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toastNotice');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// ==========================================================================
// Desktop vs Mobile View Toggle
// ==========================================================================
function toggleDeviceView() {
  AppState.isDesktopView = !AppState.isDesktopView;
  const wrapper = document.getElementById('appContainerWrapper');
  const toggleBtn = document.getElementById('deviceToggleBtn');

  if (wrapper) {
    wrapper.classList.toggle('full-desktop', AppState.isDesktopView);
  }

  if (toggleBtn) {
    toggleBtn.innerHTML = AppState.isDesktopView ? '📱 Switch to Mobile View' : '🖥️ Switch to Wide View';
  }
}

// ==========================================================================
// Event Listeners Setup
// ==========================================================================
function setupEventListeners() {
  const searchWorkInput = document.getElementById('searchWorkInput');
  if (searchWorkInput) {
    searchWorkInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderAllWorkCategories();
        return;
      }
      const grid = document.getElementById('categoriesGridContainer');
      const filtered = GAON_DATA.workCategories.filter(c => 
        c.nameEn.toLowerCase().includes(q) || 
        c.nameHi.includes(q)
      );
      grid.innerHTML = filtered.map(cat => {
        const catWorkers = AppState.workers.filter(w => w.category === cat.id);
        const count = catWorkers.length;
        const catName = AppState.currentLang === 'hi' ? cat.nameHi : cat.nameEn;
        const catSub = AppState.currentLang === 'hi' ? cat.nameEn : cat.nameHi;
        return `
          <div class="category-tile" onclick="openCategoryWorkers('${cat.id}')">
            <div class="category-letter-avatar ${cat.letter.toLowerCase()}">${cat.letter}</div>
            <div class="category-name-en">${catName}</div>
            <div class="category-name-hi">${catSub}</div>
            <div class="category-count-sub">${count} ${t('available')}</div>
          </div>
        `;
      }).join('');
    });
  }

  const searchBazaarInput = document.getElementById('searchBazaarInput');
  if (searchBazaarInput) {
    searchBazaarInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const container = document.getElementById('bazaarProductsGrid');
      const filtered = AppState.products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.nameHi.includes(q) || 
        p.shopName.toLowerCase().includes(q)
      );
      container.innerHTML = filtered.map(p => {
        const isInCart = AppState.cart.some(item => item.id === p.id);
        const prodName = AppState.currentLang === 'hi' ? p.nameHi : p.name;
        const photoSrc = p.photo || GAON_ASSETS.wheatSeedPhoto;
        return `
          <div class="product-bazaar-card">
            <div class="product-photo-box">
              ${getDummyProductBadgeHTML(p.name, p.category, 90)}
            </div>
            <div class="product-card-body">
              <div>
                <div class="product-card-title">${prodName}</div>
                <div class="product-card-price">₹${p.price.toLocaleString('en-IN')} <span class="product-unit-small">/ ${p.unit}</span></div>
                <div class="product-shop-badge">
                  <span>🏪 ${p.shopName}</span>
                </div>
                <div class="product-distance-badge">${p.distanceText}</div>
              </div>
              <button class="btn-add-to-cart ${isInCart ? 'in-cart' : ''}" onclick="toggleCartItem('${p.id}')">
                ${isInCart ? '✓ Added in Cart' : t('addBuy')}
              </button>
            </div>
          </div>
        `;
      }).join('');
    });
  }
}

// ==========================================================================
// MNREGA GOVT VILLAGE WORKS & DIGITAL ATTENDANCE (NMMS) (User Request)
// ==========================================================================
function renderMnregaPortal() {
  const container = document.getElementById('mnregaScreenContent');
  const titleEl = document.getElementById('mnregaHeaderTitle');
  const subEl = document.getElementById('mnregaHeaderSub');
  if (!container) return;

  const village = AppState.currentLocation?.village || 'Sundarpur';
  const block = AppState.currentLocation?.block || 'Robertsganj';

  if (titleEl) titleEl.textContent = t('mnregaTitle');
  if (subEl) subEl.textContent = `${village} Gram Panchayat · ${block} Block · ₹260 / day`;

  // Filter projects & workers for current village
  let projects = AppState.mnregaProjects.filter(p => p.village.toLowerCase() === village.toLowerCase());
  if (projects.length === 0) projects = AppState.mnregaProjects;

  let workers = AppState.mnregaWorkers.filter(w => w.village.toLowerCase() === village.toLowerCase());
  if (workers.length === 0) workers = AppState.mnregaWorkers;

  // Calculate Attendance KPIs (User request: how many workers are present)
  const totalEnrolled = workers.length;
  const presentCount = workers.filter(w => w.status === 'present').length;
  const absentCount = workers.filter(w => w.status === 'absent').length;
  const dailyWageRate = 260; // Govt sanctioned MGNREGA rate
  const totalWagePool = presentCount * dailyWageRate;

  container.innerHTML = `
    <!-- Top Govt Scheme Badge -->
    <div style="background:linear-gradient(135deg, #14532d, #166534); border-radius:12px; padding:12px 14px; color:#ffffff; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-size:11px; text-transform:uppercase; color:#86efac; font-weight:800; letter-spacing:0.5px;">Govt of India · MoRD &amp; Gram Panchayat</div>
        <div style="font-size:16px; font-weight:800; margin-top:2px;">🏛️ ${village} MGNREGA Master Roll</div>
        <div style="font-size:11.5px; color:#dcfce7; margin-top:2px;">Official Daily Wage: <strong>₹${dailyWageRate} / day</strong> · 100 Days Guarantee</div>
      </div>
      <button class="btn-muster-quick" style="background:#ffffff; color:#14532d; font-weight:800; border:none;" onclick="openJobCardApplicationModal()">
        + Job Card
      </button>
    </div>

    <!-- MNREGA Navigation Tabs -->
    <div class="mnrega-tab-bar">
      <button class="mnrega-tab-btn ${AppState.mnregaActiveTab === 'attendance' ? 'active' : ''}" onclick="setMnregaTab('attendance')">
        📋 ${t('mnregaAttendanceTab')}
      </button>
      <button class="mnrega-tab-btn ${AppState.mnregaActiveTab === 'projects' ? 'active' : ''}" onclick="setMnregaTab('projects')">
        🏗️ ${t('mnregaProjectsTab')} (${projects.length})
      </button>
      <button class="mnrega-tab-btn ${AppState.mnregaActiveTab === 'workers' ? 'active' : ''}" onclick="setMnregaTab('workers')">
        🪪 ${t('mnregaWorkersTab')} (${workers.length})
      </button>
    </div>

    <!-- Dynamic Tab Views -->
    ${AppState.mnregaActiveTab === 'attendance' ? renderAttendanceViewHTML(workers, totalEnrolled, presentCount, absentCount, totalWagePool) : ''}
    ${AppState.mnregaActiveTab === 'projects' ? renderProjectsViewHTML(projects) : ''}
    ${AppState.mnregaActiveTab === 'workers' ? renderJobCardWorkersViewHTML(workers) : ''}
  `;
}

function setMnregaTab(tab) {
  AppState.mnregaActiveTab = tab;
  renderMnregaPortal();
}

// 1. Digital Muster Roll Attendance View (User requirement: how many workers are present)
function renderAttendanceViewHTML(workers, total, present, absent, wagePool) {
  const isHi = AppState.currentLang === 'hi';
  const isWorkOwner = AppState.currentRole === 'hirer';

  if (!isWorkOwner) {
    // WORKER VIEW:
    // User requirement: "in mnrega attendence portal is handled by only work owner and data is visible only by work owner that how many attaendence of other persons but number and name of mnrega workers are available for both"
    const myMnregaQueries = (AppState.attendanceQueries || []).filter(q => q.category === 'mnrega');

    return `
      <!-- Role Restriction Banner -->
      <div class="restricted-role-banner" style="margin-top:14px;">
        <span style="font-size:22px;">🔒</span>
        <div>
          <strong>${isHi ? 'मनरेगा हाजिरी पोर्टल केवल काम मालिक / ग्राम पंचायत मेट द्वारा प्रबंधित है' : 'MGNREGA Attendance Portal Handled Solely by Work Owner / Mate'}</strong>
          <p>${isHi ? 'पंचायत पारदर्शिता एवं गोपनीयता नियमानुसार अन्य व्यक्तियों के व्यक्तिगत दैनिक हाजिरी आंकड़े व मस्टर रोल केवल कार्य मालिक द्वारा देखे व दर्ज किए जा सकते हैं। आप अपनी व्यक्तिगत उपस्थिति देख सकते हैं, और गाँव के सभी पंजीकृत श्रमिकों के नाम व कुल संख्या दोनों के लिए उपलब्ध हैं।' : 'Under Panchayat transparency rules, individual daily attendance records of other persons can only be viewed and marked by the Work Owner / Panchayat Mate. Your personal attendance is shown below, and the number and names of all enrolled MNREGA workers are available for both.'}</p>
        </div>
      </div>

      <!-- Worker's Personal Attendance KPI Cards (Worker only sees present and absent numbers) -->
      <div class="attendance-kpi-grid">
        <div class="att-card present">
          <div class="att-val">24</div>
          <div class="att-lbl">${isHi ? 'मेरी उपस्थिति (Present Days)' : 'My Present Days'}</div>
        </div>
        <div class="att-card absent">
          <div class="att-val">2</div>
          <div class="att-lbl">${isHi ? 'मेरी अनुपस्थिति (Absent Days)' : 'My Absent Days'}</div>
        </div>
        <div class="att-card wages">
          <div class="att-val">₹6,240</div>
          <div class="att-lbl">${isHi ? 'डीबीटी मजदूरी (DBT Paid)' : 'DBT Wages Earned'}</div>
        </div>
        <div class="att-card total">
          <div class="att-val">34</div>
          <div class="att-lbl">${isHi ? 'शेष गारंटी दिन (Remaining)' : 'Days Guarantee Left'}</div>
        </div>
      </div>

      <!-- Raise Query for MNREGA -->
      <div style="background:#13251c; border:1px dashed #f59e0b; border-radius:10px; padding:12px; margin:12px 0; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:13px; font-weight:800; color:#f8fafc;">
            ❓ ${isHi ? 'मनरेगा मस्टर रोल में हाजिरी गलत दर्ज हुई है?' : 'Dispute in your MNREGA muster attendance?'}
          </div>
          <div style="font-size:11.5px; color:#94a3b8;">
            ${isHi ? 'ग्राम पंचायत मेट / रोजगार सेवक दिनेश कुमार को सीधे सुधार अनुरोध भेजें।' : 'Submit a direct correction query to Panchayat Mate / Rozgar Sevak.'}
          </div>
        </div>
        <button type="button" class="btn-hire-primary" style="background:#f59e0b; color:#0f172a; font-weight:800; border:none; padding:8px 14px; border-radius:8px; cursor:pointer; flex-shrink:0;" onclick="openAttendanceQueryModal('mnrega')">
          🙋‍♂️ ${isHi ? 'सुधार अनुरोध दर्ज करें' : 'Raise Query'}
        </button>
      </div>

      <!-- Worker's Raised MNREGA Queries -->
      ${myMnregaQueries.length > 0 ? `
        <div style="margin-bottom:14px;">
          <div style="font-size:12.5px; font-weight:800; color:#f8fafc; margin-bottom:8px;">
            📋 ${isHi ? 'मेरे मनरेगा सुधार अनुरोध:' : 'My MNREGA Queries:'}
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${myMnregaQueries.map(q => `
              <div class="query-item-card">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <strong style="font-size:13px; color:#f8fafc;">📅 ${q.date}</strong>
                  <span class="query-status-badge ${q.status}">${q.status === 'resolved' ? '✓ ' + (isHi ? 'सुधार स्वीकृत' : 'Approved') : '⏳ ' + (isHi ? 'समीक्षाधीन' : 'Pending')}</span>
                </div>
                <div style="font-size:12px; color:#cbd5e1; margin-top:4px;">${q.reason}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Number and Name of MNREGA Workers (AVAILABLE FOR BOTH WORKER & WORK OWNER) -->
      <div style="background:#13251c; border:1px solid #1f3d2c; border-radius:12px; padding:14px; margin-top:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 style="font-size:15px; font-weight:800; color:#f8fafc; margin:0;">
              👥 ${isHi ? 'गाँव के पंजीकृत मनरेगा मज़दूर' : 'Enrolled MNREGA Workers'}
            </h3>
            <p style="font-size:11.5px; color:#94a3b8; margin:2px 0 0 0;">
              ${isHi ? 'संख्या व नाम दोनों के लिए उपलब्ध है · अन्य व्यक्तियों की दैनिक हाजिरी केवल कार्य मालिक देख सकते हैं' : 'Total number & worker names available for both · Individual daily attendance restricted to Work Owner'}
            </p>
          </div>
          <span style="background:#1b4332; border:1px solid #22c55e; color:#4ade80; font-size:12px; font-weight:800; padding:4px 10px; border-radius:16px;">
            ${workers.length} ${isHi ? 'मज़दूर' : 'Workers'}
          </span>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          ${workers.map(w => `
            <div class="mnrega-worker-card">
              <div class="mnrega-worker-left">
                <div class="worker-avatar-badge">
                  ${getDummyAvatarHTML(w.name, 38, 14, '#1b4332', '#4ade80', '#2d6a4f')}
                </div>
                <div class="mnrega-worker-meta">
                  <h4>${w.name}</h4>
                  <div class="jobcard">🪪 ${w.jobCardNo}</div>
                  <div class="category">${w.category || 'Unskilled'} · ${w.village}</div>
                </div>
              </div>
              <span style="font-size:11px; font-weight:700; color:#4ade80; background:#1b4332; padding:3px 8px; border-radius:6px; border:1px solid #22c55e;">
                ✓ Job Card Active
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // WORK OWNER VIEW:
  // Full attendance management, data of other persons, toggle switches, and query approvals
  const pendingMnregaQueries = (AppState.attendanceQueries || []).filter(q => q.category === 'mnrega' && q.status === 'pending');

  return `
    <!-- Work Owner Management Header Badge -->
    <div style="background:#1b4332; border:1px solid #22c55e; border-radius:8px; padding:8px 12px; margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-size:12px; font-weight:800; color:#4ade80;">👑 ${isHi ? 'कार्य मालिक / पंचायत मेट मोड: पूर्ण हाजिरी प्रबंधन अधिकृत' : 'Work Owner / Mate Mode: Full Muster Roll Authority'}</span>
      <span style="font-size:11px; color:#86efac;">${isHi ? 'सभी श्रमिकों की हाजिरी दर्ज व संपादित करें' : 'Mark & manage all workers'}</span>
    </div>

    <!-- Attendance KPI Cards Grid -->
    <div class="attendance-kpi-grid">
      <div class="att-card total">
        <div class="att-val">${total}</div>
        <div class="att-lbl">${t('totalWorkersEnrolled')}</div>
      </div>
      <div class="att-card present">
        <div class="att-val">${present}</div>
        <div class="att-lbl">${t('presentTodayLabel')}</div>
      </div>
      <div class="att-card absent">
        <div class="att-val">${absent}</div>
        <div class="att-lbl">${t('absentTodayLabel')}</div>
      </div>
      <div class="att-card wages">
        <div class="att-val">₹${wagePool.toLocaleString('en-IN')}</div>
        <div class="att-lbl">${t('todayWagesPayable')}</div>
      </div>
    </div>

    <!-- Muster Roll Actions Bar -->
    <div class="attendance-actions-bar">
      <div class="muster-date-pill">
        <span>📅</span>
        <span>Today, 31 Oct 2026</span>
      </div>
      <div style="display:flex; gap:6px;">
        <button class="btn-muster-quick" onclick="markAllMnregaPresent()">
          ${t('markAllPresentBtn')}
        </button>
        <button class="btn-muster-quick" onclick="resetMnregaAttendance()">
          ${t('resetAttendanceBtn')}
        </button>
      </div>
    </div>

    <!-- Pending MNREGA Queries from Workers -->
    ${pendingMnregaQueries.length > 0 ? `
      <div class="query-alert-box">
        <div class="query-alert-header">
          <strong style="font-size:13px; color:#fbbf24;">🔔 ${isHi ? 'मज़दूरों द्वारा भेजे गए मनरेगा हाजिरी सुधार अनुरोध:' : 'Pending MNREGA Attendance Correction Queries:'}</strong>
        </div>
        ${pendingMnregaQueries.map(q => `
          <div class="query-item-card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <strong style="font-size:13px; color:#f8fafc;">👤 ${q.workerName}</strong>
                <div style="font-size:11.5px; color:#38bdf8;">📅 ${q.date} · 💬 ${q.reason}</div>
              </div>
              <div style="display:flex; gap:6px;">
                <button type="button" class="btn-query-reject" onclick="resolveAttendanceQuery('${q.id}', false)">✕ Decline</button>
                <button type="button" class="btn-query-approve" onclick="resolveAttendanceQuery('${q.id}', true)">✓ Mark Present</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- Worker Attendance Cards List (Visible only to Work Owner with toggle buttons) -->
    <div style="display:flex; flex-direction:column; gap:8px;">
      ${workers.map(w => {
        const isPresent = w.status === 'present';
        return `
          <div class="worker-attendance-card ${isPresent ? 'present-border' : 'absent-border'}">
            <div class="worker-att-left">
              <div class="worker-jobcard-avatar">
                ${getDummyAvatarHTML(w.name, 38, 14, '#1b4332', '#4ade80', '#2d6a4f')}
              </div>
              <div class="worker-att-info">
                <h4>${w.name}</h4>
                <div class="jobcard-no-badge">🆔 ${w.jobCardNo}</div>
                <div class="worker-dbt-status">
                  ✓ Aadhaar Linked · ${w.daysWorked} / 100 days worked
                </div>
              </div>
            </div>

            <!-- Big Toggle Attendance Button (1-Click Present / Absent Toggle for Work Owner) -->
            <button class="btn-att-toggle ${isPresent ? 'present' : 'absent'}" onclick="toggleWorkerAttendance('${w.id}')">
              ${isPresent ? '✓ Present (उपस्थित)' : '✕ Absent (अनुपस्थित)'}
            </button>
          </div>
        `;
      }).join('')}
    </div>

    <!-- NMMS Site Geo-Photo Verification Card -->
    <div class="nmms-photo-card" onclick="triggerNmmsPhotoSim()">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:26px;">📷</span>
        <div>
          <strong style="font-size:13px; color:#14532d;">NMMS Work Site Geo-Tagged Photo</strong>
          <p style="font-size:11px; color:#166534;" id="nmmsPhotoStatus">Tap to capture worker site photo with GPS watermark</p>
        </div>
      </div>
      <button type="button" class="btn-muster-quick" style="background:#16a34a; color:#fff; border:none;">
        Take Photo
      </button>
    </div>

    <!-- Submit Muster Roll Button -->
    <button class="btn-publish-listing" style="margin-top:6px; background:#16a34a;" onclick="submitMnregaMusterRoll(${present}, ${wagePool})">
      ${t('submitMusterRollBtn')}
    </button>
  `;
}

// 2. Government Works & Projects View (User requirement: what work is from government)
function renderProjectsViewHTML(projects) {
  return `
    <div style="display:flex; flex-direction:column; gap:12px;">
      ${projects.map(p => {
        const progressPct = Math.round((p.daysCompleted / p.totalDays) * 100);
        const isActive = p.status === 'active';
        return `
          <div class="mnrega-project-card">
            <div class="project-header-row">
              <span class="project-scheme-code">🏛️ ${p.projectCode}</span>
              <span class="project-status-badge ${isActive ? 'active' : 'completed'}">
                ${isActive ? '🟢 Active Project (कार्य जारी)' : '✓ Completed'}
              </span>
            </div>

            <div>
              <div class="project-title-text">${AppState.currentLang === 'hi' ? p.titleHi : p.title}</div>
              <div style="font-size:12px; color:#475569; margin-top:2px;">📍 Landmark: ${p.workSiteLandmark}</div>
              <div style="font-size:12px; color:#64748b; margin-top:4px; line-height:1.35;">${p.description}</div>
            </div>

            <!-- Progress Bar -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; color:#334155;">
                <span>Sanctioned Days: ${p.daysCompleted} / ${p.totalDays} Days</span>
                <span>${progressPct}% Completed</span>
              </div>
              <div class="project-progress-bar-wrap">
                <div class="project-progress-bar-fill" style="width: ${progressPct}%;"></div>
              </div>
            </div>

            <!-- Metadata Grid -->
            <div class="project-meta-grid">
              <div><strong>Sanctioned Wage:</strong> ₹${p.sanctionedWage} / day</div>
              <div><strong>Workers Needed:</strong> ${p.workersNeeded} workers</div>
              <div><strong>Govt Budget:</strong> ₹${p.totalBudget.toLocaleString('en-IN')}</div>
              <div><strong>Rozgar Sevak:</strong> ${p.gramRozgarSevak}</div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:4px;">
              <button class="btn-hire-primary" style="padding:8px;" onclick="setMnregaTab('attendance')">
                📋 Take Attendance
              </button>
              <a href="tel:${p.contactPhone.replace(/\\s+/g, '')}" class="btn-profile-secondary" style="padding:8px; text-decoration:none;">
                📞 Call Rozgar Sevak
              </a>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 3. Registered Job Card Workers View
function renderJobCardWorkersViewHTML(workers) {
  const isHi = AppState.currentLang === 'hi';
  const isWorkOwner = AppState.currentRole === 'hirer';

  return `
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div style="background:#13251c; border:1px solid #1f3d2c; border-radius:10px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:14px; font-weight:800; color:#f8fafc;">
            👥 ${isHi ? 'गाँव के पंजीकृत मनरेगा मज़दूर सूची' : 'All Job Card Holders in Village'}
          </span>
          <div style="font-size:11px; color:#94a3b8;">
            ${isHi ? 'श्रमिकों के नाम व संख्या दोनों के लिए उपलब्ध है' : 'Worker count & names available for both'}
          </div>
        </div>
        <span style="background:#1b4332; border:1px solid #22c55e; color:#4ade80; font-size:12px; font-weight:800; padding:4px 10px; border-radius:14px;">
          ${workers.length} ${isHi ? 'मज़दूर' : 'Workers'}
        </span>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        ${workers.map(w => `
          <div class="mnrega-worker-card">
            <div class="mnrega-worker-left">
              <div class="worker-avatar-badge">
                ${getDummyAvatarHTML(w.name, 38, 14, '#1b4332', '#4ade80', '#2d6a4f')}
              </div>
              <div class="mnrega-worker-meta">
                <h4>${w.name}</h4>
                <div class="jobcard">🪪 Job Card: ${w.jobCardNo}</div>
                <div class="category">${w.category || 'Unskilled'} · ${w.village}</div>
              </div>
            </div>
            ${isWorkOwner ? `
              <a href="tel:${(w.phone || '').replace(/\s+/g, '')}" class="call-btn-circle" style="width:36px; height:36px; font-size:15px;" title="Call">
                📞
              </a>
            ` : `
              <span style="font-size:11px; font-weight:700; color:#4ade80; background:#1b4332; padding:3px 8px; border-radius:6px; border:1px solid #22c55e;">
                ✓ Job Card Active
              </span>
            `}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}


