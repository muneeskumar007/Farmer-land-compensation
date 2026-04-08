import { createContext, useContext, useState } from 'react';

const LangContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    // Nav
    appName: 'AgriComp',
    tagline: 'ML Land Compensation System',
    langToggle: 'தமிழ்',
    logout: 'Sign Out',
    profile: 'My Profile',
    notifications: 'Notifications',
    darkMode: 'Dark Mode',

    // Sidebar
    dashboard: 'Dashboard',
    landMap: 'Land Map',
    reports: 'Reports',
    analytics: 'Analytics',
    requests: 'Land Requests',
    farmerPortal: 'Farmer Portal',
    adminPortal: 'Admin Portal',

    // Landing
    heroTitle: 'Fair Compensation for Every Farmer',
    heroSub: 'Our intelligent ML system ensures you receive the true value of your land — transparent, fast, and bias-free.',
    getStarted: 'Start Free Assessment',
    haveAccount: 'I have an account',

    // Auth
    welcomeBack: 'Welcome back',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    phone: 'Mobile Number',
    state: 'State',
    district: 'District',
    farmerRole: 'Farmer',
    adminRole: 'Admin / Govt.',
    noAccount: "New farmer? Create an account",
    haveAccountQ: 'Already have an account?',
    demoCredentials: 'Demo Credentials',
    rememberMe: 'Remember me',
    forgotPass: 'Forgot password?',
    signingIn: 'Signing in...',
    creatingAcc: 'Creating...',
    continue: 'Continue →',
    back: '← Back',
    agreeTerms: 'I agree to the Terms & Conditions and Privacy Policy',

    // Farmer Dashboard
    goodMorning: 'வணக்கம்', // Vanakkam
    welcomeMsg: 'Submit your land details to get a fair ML-powered compensation estimate.',
    yourLocation: 'Your Location',
    totalSubmissions: 'Total Submissions',
    approved: 'Approved',
    pending: 'Pending',
    avgMlValue: 'Avg ML Value',
    landDetails: 'Land Details',
    landFormSub: 'Enter your land information for ML prediction',
    locationLabel: 'Land Location / Village Name',
    locationPlaceholder: 'e.g. Papanasam, Thanjavur, Tamil Nadu',
    pattaLabel: 'Patta Number (பட்டா எண்)',
    pattaPlaceholder: 'e.g. 1234',
    chittaLabel: 'Chitta / Survey Number (சிட்டா எண்)',
    chittaPlaceholder: 'e.g. 45/2A',
    detectLocation: 'Detect Location from Patta',
    detecting: 'Detecting...',
    pattaDetected: 'Location detected from Patta!',
    pattaError: 'Could not detect location. Please enter manually.',
    landSize: 'Land Size',
    soilType: 'Soil Type',
    primaryCrop: 'Primary Crop',
    infrastructure: 'Nearby Infrastructure',
    additionalDesc: 'Additional Description (optional)',
    descPlaceholder: 'Water sources, structures, nearby landmarks...',
    clearForm: 'Clear',
    getPrediction: 'Get ML Prediction',
    analyzing: 'Analyzing with AI...',
    readyForPrediction: 'Ready for Prediction',
    readyMsg: 'Fill in your land details and click "Get ML Prediction".',
    govtRate: 'Govt. Rate',
    mlPrediction: 'ML Prediction',
    modelConfidence: 'Model Confidence',
    valueComparison: 'Value Comparison',
    historicalTrend: 'Historical Trend',
    aiReasoning: 'AI Reasoning',
    keyFactors: 'Key Factors',
    recentSubmissions: 'Recent Submissions',
    viewAll: 'View All',
    location: 'Location',
    size: 'Size',
    mlValue: 'ML Value',
    govtValue: 'Govt. Value',
    status: 'Status',
    date: 'Date',

    // Map Page
    landMap_title: 'Land Location Map',
    landMap_sub: 'Draw your land boundary or click to select your location',
    howToSelect: 'How to Mark Your Land',
    step1_map: 'Click on the map to drop a pin on your land',
    step2_map: 'Or draw the boundary of your land using the Draw tool',
    step3_map: 'Or enter your Patta number above to auto-detect',
    selectedLocation: 'Selected Location',
    clickToPin: 'Click the map to mark your land location',
    drawBoundary: 'Draw Boundary',
    clearDraw: 'Clear Drawing',
    drawInstruction: 'Click points on the map to trace your land boundary. Double-click to finish.',
    copyCoords: 'Copy Coordinates',
    registeredPlots: 'Registered Plots',
    tips: 'Tips',
    tip1: 'Zoom in for precise selection',
    tip2: 'Use Draw to mark your land area',
    tip3: 'Patta number auto-locates your land',
    tip4: 'Your location is saved automatically',

    // Status
    statusPending: 'Pending',
    statusApproved: 'Approved',
    statusRejected: 'Rejected',

    // Admin
    adminDashboard: 'Admin Dashboard',
    adminSub: 'Monitor and manage all farmer land compensation requests',
    liveSystem: 'Live System',
    totalRequests: 'Total Requests',
    pendingReview: 'Pending Review',
    totalMLValue: 'Total ML Value',
    monthlySubmissions: 'Monthly Submissions',
    requestStatus: 'Request Status',
    recentRequests: 'Recent Requests',
    farmer: 'Farmer',
    approve: 'Approve',
    reject: 'Reject',
    requestDetails: 'Request Details',
    aiExplanation: 'AI Reasoning',

    // Profile
    myProfile: 'My Profile',
    manageAccount: 'Manage your account information',
    editProfile: 'Edit Profile',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    saving: 'Saving...',
    govtOfficer: 'Government Officer',
    registeredFarmer: 'Registered Farmer',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    memberSince: 'Member Since',
    accountSecurity: 'Account Security',
    changePassword: 'Change',
    dangerZone: 'Danger Zone',
    deleteAccount: 'Delete Account',

    // Reports
    compensationReports: 'Compensation Reports',
    viewDownload: 'View detailed ML analysis reports',
    downloadPDF: 'Download PDF',
    yourSubmissions: 'Your Submissions',
    noSubmissions: 'No submissions yet',
    landDetailsTitle: 'Land Details',
    governmentRate: 'Government Rate',
    difference: 'Difference',
    fiveYearTrend: '5-Year Trend',
    selectReport: 'Select a report from the left to view details',
  },

  ta: {
    // Nav
    appName: 'AgriComp',
    tagline: 'ML நில இழப்பீட்டு அமைப்பு',
    langToggle: 'English',
    logout: 'வெளியேறு',
    profile: 'என் சுயவிவரம்',
    notifications: 'அறிவிப்புகள்',
    darkMode: 'இருண்ட பயன்முறை',

    // Sidebar
    dashboard: 'டாஷ்போர்டு',
    landMap: 'நில வரைபடம்',
    reports: 'அறிக்கைகள்',
    analytics: 'பகுப்பாய்வு',
    requests: 'நில கோரிக்கைகள்',
    farmerPortal: 'விவசாயி போர்டல்',
    adminPortal: 'நிர்வாக போர்டல்',

    // Landing
    heroTitle: 'ஒவ்வொரு விவசாயிக்கும் நியாயமான இழப்பீடு',
    heroSub: 'நமது AI அமைப்பு உங்கள் நிலத்தின் உண்மையான மதிப்பை உறுதி செய்கிறது — வெளிப்படையான, விரைவான மற்றும் பாரபட்சமற்றது.',
    getStarted: 'இலவச மதிப்பீடு தொடங்கு',
    haveAccount: 'என்னிடம் கணக்கு உள்ளது',

    // Auth
    welcomeBack: 'வணக்கம்',
    signIn: 'உள்நுழைக',
    createAccount: 'கணக்கு உருவாக்கு',
    email: 'மின்னஞ்சல் முகவரி',
    password: 'கடவுச்சொல்',
    confirmPassword: 'கடவுச்சொல் உறுதிப்படுத்து',
    fullName: 'முழு பெயர்',
    phone: 'கைபேசி எண்',
    state: 'மாநிலம்',
    district: 'மாவட்டம்',
    farmerRole: 'விவசாயி',
    adminRole: 'நிர்வாகி / அரசு',
    noAccount: 'புதிய விவசாயி? கணக்கு உருவாக்கு',
    haveAccountQ: 'ஏற்கனவே கணக்கு உள்ளதா?',
    demoCredentials: 'டெமோ தகவல்',
    rememberMe: 'என்னை நினைவில் வை',
    forgotPass: 'கடவுச்சொல் மறந்தீர்களா?',
    signingIn: 'உள்நுழைகிறது...',
    creatingAcc: 'உருவாக்குகிறது...',
    continue: 'தொடர் →',
    back: '← திரும்பு',
    agreeTerms: 'விதிமுறைகள் மற்றும் தனியுரிமை கொள்கையை ஒப்புக்கொள்கிறேன்',

    // Farmer Dashboard
    goodMorning: 'வணக்கம்',
    welcomeMsg: 'நியாயமான இழப்பீடு மதிப்பீட்டிற்காக உங்கள் நில விவரங்களை சமர்ப்பிக்கவும்.',
    yourLocation: 'உங்கள் இடம்',
    totalSubmissions: 'மொத்த சமர்ப்பிப்புகள்',
    approved: 'அங்கீகரிக்கப்பட்டது',
    pending: 'நிலுவையில் உள்ளது',
    avgMlValue: 'சராசரி ML மதிப்பு',
    landDetails: 'நில விவரங்கள்',
    landFormSub: 'ML கணிப்பிற்கு உங்கள் நில தகவல்களை உள்ளிடவும்',
    locationLabel: 'நில இடம் / கிராம பெயர்',
    locationPlaceholder: 'எ.கா. பாபநாசம், தஞ்சாவூர், தமிழ்நாடு',
    pattaLabel: 'பட்டா எண்',
    pattaPlaceholder: 'எ.கா. 1234',
    chittaLabel: 'சிட்டா / கணக்கெடுப்பு எண்',
    chittaPlaceholder: 'எ.கா. 45/2A',
    detectLocation: 'பட்டா மூலம் இடம் கண்டறி',
    detecting: 'கண்டறிகிறது...',
    pattaDetected: 'பட்டா மூலம் இடம் கண்டறியப்பட்டது!',
    pattaError: 'இடத்தை கண்டறிய முடியவில்லை. கைமுறையாக உள்ளிடவும்.',
    landSize: 'நில அளவு',
    soilType: 'மண் வகை',
    primaryCrop: 'முதன்மை பயிர்',
    infrastructure: 'அருகில் உள்ள உள்கட்டமைப்பு',
    additionalDesc: 'கூடுதல் விவரங்கள் (விருப்பத்திற்கு)',
    descPlaceholder: 'நீர் ஆதாரங்கள், கட்டிடங்கள், அருகில் உள்ள இடங்கள்...',
    clearForm: 'அழி',
    getPrediction: 'ML கணிப்பு பெறு',
    analyzing: 'AI மூலம் பகுப்பாய்வு செய்கிறது...',
    readyForPrediction: 'கணிப்பிற்கு தயாராக உள்ளது',
    readyMsg: 'நில விவரங்களை நிரப்பி "ML கணிப்பு பெறு" என்பதை கிளிக் செய்யவும்.',
    govtRate: 'அரசு விகிதம்',
    mlPrediction: 'ML கணிப்பு',
    modelConfidence: 'மாதிரி நம்பகத்தன்மை',
    valueComparison: 'மதிப்பு ஒப்பீடு',
    historicalTrend: 'வரலாற்று போக்கு',
    aiReasoning: 'AI காரணம்',
    keyFactors: 'முக்கிய காரணிகள்',
    recentSubmissions: 'சமீபத்திய சமர்ப்பிப்புகள்',
    viewAll: 'அனைத்தும் காண்',
    location: 'இடம்',
    size: 'அளவு',
    mlValue: 'ML மதிப்பு',
    govtValue: 'அரசு மதிப்பு',
    status: 'நிலை',
    date: 'தேதி',

    // Map Page
    landMap_title: 'நில இடம் வரைபடம்',
    landMap_sub: 'உங்கள் நிலத்தை வரைந்து அல்லது பட்டா எண் மூலம் இடம் கண்டறியவும்',
    howToSelect: 'உங்கள் நிலத்தை எவ்வாறு குறிப்பிடுவது',
    step1_map: 'வரைபடத்தில் கிளிக் செய்து உங்கள் நில இடத்தை குறிக்கவும்',
    step2_map: 'அல்லது Draw கருவியால் நில எல்லையை வரையவும்',
    step3_map: 'அல்லது பட்டா எண் உள்ளிட்டு தானாக கண்டறியவும்',
    selectedLocation: 'தேர்ந்தெடுத்த இடம்',
    clickToPin: 'நில இடத்தை குறிக்க வரைபடத்தை கிளிக் செய்யவும்',
    drawBoundary: 'எல்லை வரை',
    clearDraw: 'வரைவை அழி',
    drawInstruction: 'நில எல்லையை குறிக்க வரைபடத்தில் புள்ளிகளை கிளிக் செய்யவும். முடிக்க இரட்டை கிளிக் செய்யவும்.',
    copyCoords: 'ஆய கடன்களை நகலெடு',
    registeredPlots: 'பதிவு செய்யப்பட்ட நிலங்கள்',
    tips: 'குறிப்புகள்',
    tip1: 'துல்லியமான தேர்வுக்கு பூதக்கண்ணாடி பயன்படுத்தவும்',
    tip2: 'நில பகுதியை குறிக்க Draw பயன்படுத்தவும்',
    tip3: 'பட்டா எண் மூலம் நிலம் தானாக கண்டறியப்படும்',
    tip4: 'உங்கள் இடம் தானாக சேமிக்கப்படும்',

    // Status
    statusPending: 'நிலுவையில்',
    statusApproved: 'அங்கீகரிக்கப்பட்டது',
    statusRejected: 'நிராகரிக்கப்பட்டது',

    // Admin
    adminDashboard: 'நிர்வாக டாஷ்போர்டு',
    adminSub: 'அனைத்து விவசாயி நில இழப்பீட்டு கோரிக்கைகளை கண்காணிக்கவும்',
    liveSystem: 'நேரடி அமைப்பு',
    totalRequests: 'மொத்த கோரிக்கைகள்',
    pendingReview: 'ஆய்வில் நிலுவை',
    totalMLValue: 'மொத்த ML மதிப்பு',
    monthlySubmissions: 'மாதாந்திர சமர்ப்பிப்புகள்',
    requestStatus: 'கோரிக்கை நிலை',
    recentRequests: 'சமீபத்திய கோரிக்கைகள்',
    farmer: 'விவசாயி',
    approve: 'அங்கீகரி',
    reject: 'நிராகரி',
    requestDetails: 'கோரிக்கை விவரங்கள்',
    aiExplanation: 'AI காரணம்',

    // Profile
    myProfile: 'என் சுயவிவரம்',
    manageAccount: 'உங்கள் கணக்கு தகவல்களை நிர்வகிக்கவும்',
    editProfile: 'சுயவிவரம் திருத்து',
    saveChanges: 'மாற்றங்களை சேமி',
    cancel: 'ரத்து செய்',
    saving: 'சேமிக்கிறது...',
    govtOfficer: 'அரசு அதிகாரி',
    registeredFarmer: 'பதிவு செய்யப்பட்ட விவசாயி',
    emailAddress: 'மின்னஞ்சல் முகவரி',
    phoneNumber: 'கைபேசி எண்',
    memberSince: 'உறுப்பினர் ஆனது முதல்',
    accountSecurity: 'கணக்கு பாதுகாப்பு',
    changePassword: 'மாற்று',
    dangerZone: 'அபாய மண்டலம்',
    deleteAccount: 'கணக்கை நீக்கு',

    // Reports
    compensationReports: 'இழப்பீட்டு அறிக்கைகள்',
    viewDownload: 'விரிவான ML பகுப்பாய்வு அறிக்கைகளை பார்க்கவும்',
    downloadPDF: 'PDF பதிவிறக்கு',
    yourSubmissions: 'உங்கள் சமர்ப்பிப்புகள்',
    noSubmissions: 'இன்னும் சமர்ப்பிக்கவில்லை',
    landDetailsTitle: 'நில விவரங்கள்',
    governmentRate: 'அரசு விகிதம்',
    difference: 'வித்தியாசம்',
    fiveYearTrend: '5 ஆண்டு போக்கு',
    selectReport: 'விவரங்களை காண இடதுபுறம் அறிக்கையை தேர்ந்தெடுக்கவும்',
  },
};

// Bilingual soil/crop options
export const SOIL_OPTIONS = {
  en: ['Alluvial', 'Black Cotton', 'Red Laterite', 'Sandy Loam', 'Clay', 'Loamy'],
  ta: ['வண்டல் மண்', 'கரிசல் மண்', 'சிவப்பு பாறை மண்', 'மணல் கலந்த மண்', 'களிமண்', 'பஞ்சு மண்'],
};

export const CROP_OPTIONS = {
  en: ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Groundnut', 'Banana', 'Mango', 'Vegetables', 'Pulses'],
  ta: ['நெல்', 'கோதுமை', 'பருத்தி', 'கரும்பு', 'நிலக்கடலை', 'வாழை', 'மாம்பழம்', 'காய்கறிகள்', 'பருப்பு வகைகள்'],
};

export const INFRA_OPTIONS = {
  en: [
    { value: 'None', label: 'None' },
    { value: 'Highway', label: 'National/State Highway' },
    { value: 'Railway', label: 'Railway Line' },
    { value: 'Both', label: 'Both Highway & Railway' },
  ],
  ta: [
    { value: 'None', label: 'இல்லை' },
    { value: 'Highway', label: 'தேசிய / மாநில நெடுஞ்சாலை' },
    { value: 'Railway', label: 'ரயில் பாதை' },
    { value: 'Both', label: 'நெடுஞ்சாலை மற்றும் ரயில் இரண்டும்' },
  ],
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('agri_lang') || 'en');

  const toggle = () => {
    const next = lang === 'en' ? 'ta' : 'en';
    setLang(next);
    localStorage.setItem('agri_lang', next);
  };

  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
