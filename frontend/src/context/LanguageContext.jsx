import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    app_title: 'Family Legacy Memorial',
    home: 'Home',
    admin: 'Admin',
    login: 'Admin Login',
    living: 'Living',
    deceased: 'Departed',
    born: 'Born',
    died: 'Died',
    age: 'Age',
    hide_living: 'Hide Living Members',
    show_living: 'Show Living Members',
    years: 'years',
    biography: 'Biography',
    timeline: 'Timeline of Life',
    gallery: 'Photo Gallery',
    videos: 'Videos & Memories',
    tree: 'Family Tree',
    messages: 'Memorial Tributes',
    leave_message: 'Leave a Message',
    your_name: 'Your Name',
    your_message: 'Write a tribute...',
    submit_message: 'Submit Message',
    light_candle: 'Light a Candle',
    lit_candles: 'Candles Lit',
    grave_location: 'Grave Location',
    navigate_maps: 'Navigate in Maps',
    audio_memories: 'Voice Clips & Memories',
    back_to_site: 'Back to Site',
    logout: 'Logout',
    featured_families: 'Featured Families',
    members_count: 'members',
    departed_count: 'departed',
    living_count: 'living',
    place_of_birth: 'Place of Birth',
    place_of_death: 'Place of Death',
    occupation: 'Occupation',
    education: 'Education',
    awards: 'Awards',
    hobbies: 'Hobbies',
    religion: 'Religion',
    details: 'Personal Details',
    relationships: 'Family Relationships',
    family_heads: 'Family Heads',
    spouse: 'Spouse',
    sons: 'Sons',
    daughters: 'Daughters',
    no_spouse: 'No spouse listed',
    photos: 'Photos',
    tribute_approval_notice: 'Thank you for your message. It will be displayed after admin review.',
    zoom_in: 'Zoom In',
    zoom_out: 'Zoom Out',
    reset: 'Reset',
    settings: 'Settings',
    admin_settings: 'Admin Settings',
    hide_living: 'Hide Living Members',
    show_living: 'Show Living Members',
    candle_intro: 'Keep their memory shining. Light a virtual candle in their honor.',
    cemetery: 'Cemetery',
    plot: 'Plot Number',
    section: 'Section',
    loading: 'Loading memorial details...',
    not_found: 'Memorial member not found.',
    close: 'Close'
  },
  ml: {
    app_title: 'കുടുംബ സ്മരണിക',
    home: 'ഹോം',
    admin: 'അഡ്മിൻ',
    login: 'അഡ്മിൻ ലോഗിൻ',
    living: 'ജീവിച്ചിരിക്കുന്നു',
    deceased: 'മൺമറഞ്ഞവർ',
    born: 'ജനനം',
    died: 'മരണം',
    age: 'പ്രായം',
    hide_living: 'ജീവിച്ചിരിക്കുന്നവർ മറയ്ക്കുക',
    show_living: 'ജീവിച്ചിരിക്കുന്നവർ കാണിക്കുക',
    years: 'വയസ്സ്',
    biography: 'ജീവചരിത്രം',
    timeline: 'ജീവിതരേഖ',
    gallery: 'ചിത്രശാല',
    videos: 'വീഡിയോകൾ & ഓർമ്മകൾ',
    tree: 'കുടുംബവൃക്ഷം',
    messages: 'സ്മരണാഞ്ജലികൾ',
    leave_message: 'സന്ദേശം അയക്കുക',
    your_name: 'നിങ്ങളുടെ പേര്',
    your_message: 'ആദരാഞ്ജലി സന്ദേശം എഴുതുക...',
    submit_message: 'സമർപ്പിക്കുക',
    light_candle: 'മെഴുകുതിരി തെളിയിക്കുക',
    lit_candles: 'തെളിയിച്ച മെഴുകുതിരികൾ',
    grave_location: 'കല്ലറയുടെ സ്ഥാനം',
    navigate_maps: 'ഗൂഗിൾ മാപ്സിൽ കാണുക',
    audio_memories: 'ശബ്ദരേഖകൾ & ഓർമ്മകൾ',
    back_to_site: 'സൈറ്റിലേക്ക് മടങ്ങുക',
    logout: 'ലോഗൗട്ട്',
    featured_families: 'പ്രധാന കുടുംബങ്ങൾ',
    members_count: 'അംഗങ്ങൾ',
    departed_count: 'മൺമറഞ്ഞവർ',
    living_count: 'ജീവിച്ചിരിക്കുന്നവർ',
    place_of_birth: 'ജനിച്ച സ്ഥലം',
    place_of_death: 'മരിച്ച സ്ഥലം',
    occupation: 'തൊഴിൽ',
    education: 'വിദ്യാഭ്യാസം',
    awards: 'അംഗീകാരങ്ങൾ',
    hobbies: 'വിനോദങ്ങൾ',
    religion: 'മതം',
    details: 'വ്യക്തിഗത വിവരങ്ങൾ',
    relationships: 'കുടുംബ ബന്ധങ്ങൾ',
    family_heads: 'കുടുംബ മാനേജർ',
    spouse: 'പതി / ഭാര്യ',
    sons: 'മക്കൾ (അണിയൻ)',
    daughters: 'മക്കൾ (കുമാരിമാർ)',
    no_spouse: 'ഭർത്താവോ ഭാര്യയോ ഇല്ല',
    photos: 'ചിത്രങ്ങൾ',
    tribute_approval_notice: 'നിങ്ങളുടെ संदेशത്തിന് നന്ദി. അഡ്മിൻ അംഗീകരിച്ചതിനു ശേഷം ഇത് കാണിക്കുന്നതാണ്.',
    zoom_in: 'വലുതാക്കുക',
    zoom_out: 'ചെറുതാക്കുക',
    reset: 'യഥാസ്ഥാനത്താക്കുക',
    settings: 'ക്രമീകരണങ്ങൾ',
    admin_settings: 'അഡ്മിൻ ക്രമീകരണങ്ങൾ',
    hide_living: 'ജീവിച്ചിരിക്കുന്നവർ മറയ്ക്കുക',
    show_living: 'ജീവിച്ചിരിക്കുന്നവർ കാണിക്കുക',
    candle_intro: 'അവരുടെ ഓർമ്മകൾ നിലനിർത്താൻ ഒരു വെർച്വൽ മെഴുകുതിരി തെളിയിക്കുക.',
    cemetery: 'ശ്മശാനം',
    plot: 'കല്ലറ നമ്പർ',
    section: 'സെക്ഷൻ',
    loading: 'വിവരങ്ങൾ ശേഖരിക്കുന്നു...',
    not_found: 'കണ്ടെത്താനായില്ല.',
    close: 'അടയ്ക്കുക'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('family_memorial_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('family_memorial_lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  // Helper to get translated field or fallback to English
  const getField = (obj, field) => {
    if (!obj) return '';
    if (language === 'ml' && obj[`${field}_ml`]) {
      return obj[`${field}_ml`];
    }
    return obj[field] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getField }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
