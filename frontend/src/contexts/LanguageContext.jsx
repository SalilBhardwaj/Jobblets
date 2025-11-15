"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    home: "Home",
    postJob: "Post a Job",
    findWork: "Find Work",
    login: "Login",
    signup: "Sign Up",
    dashboard: "Dashboard",
    logout: "Logout",

    // Home page
    heroTitle: "Connect with Local Gig Workers",
    heroSubtitle:
      "Find trusted professionals for household and business needs in your area",
    searchPlaceholder: "Search for services...",
    searchButton: "Search",
    postJobCTA: "Post a Job",
    findWorkCTA: "Find Work",

    // Categories
    categories: "Popular Categories",
    housekeeping: "Housekeeping",
    plumbing: "Plumbing",
    tutoring: "Tutoring",
    driving: "Driving",
    cooking: "Cooking",
    gardening: "Gardening",

    // Auth
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    phone: "Phone Number",
    fullName: "Full Name",
    selectRole: "I want to",
    jobPoster: "Post Jobs",
    gigWorker: "Find Work",
    createAccount: "Create Account",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",

    // Job posting
    jobTitle: "Job Title",
    jobDescription: "Job Description",
    budget: "Budget",
    location: "Location",
    category: "Category",
    createJob: "Create Job",

    // Common
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    apply: "Apply",
    bid: "Bid",
    hire: "Hire",
    viewDetails: "View Details",
    loading: "Loading...",
  },
  hi: {
    // Navigation
    home: "होम",
    postJob: "नौकरी पोस्ट करें",
    findWork: "काम खोजें",
    login: "लॉगिन",
    signup: "साइन अप",
    dashboard: "डैशबोर्ड",
    logout: "लॉगआउट",

    // Home page
    heroTitle: "स्थानीय गिग वर्कर्स से जुड़ें",
    heroSubtitle:
      "अपने क्षेत्र में घरेलू और व्यावसायिक जरूरतों के लिए विश्वसनीय पेशेवर खोजें",
    searchPlaceholder: "सेवाओं की खोज करें...",
    searchButton: "खोजें",
    postJobCTA: "नौकरी पोस्ट करें",
    findWorkCTA: "काम खोजें",

    // Categories
    categories: "लोकप्रिय श्रेणियां",
    housekeeping: "हाउसकीपिंग",
    plumbing: "प्लंबिंग",
    tutoring: "ट्यूशन",
    driving: "ड्राइविंग",
    cooking: "खाना बनाना",
    gardening: "बागवानी",

    // Auth
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    phone: "फोन नंबर",
    fullName: "पूरा नाम",
    selectRole: "मैं चाहता हूं",
    jobPoster: "नौकरी पोस्ट करना",
    gigWorker: "काम खोजना",
    createAccount: "खाता बनाएं",
    haveAccount: "पहले से खाता है?",
    noAccount: "खाता नहीं है?",

    // Job posting
    jobTitle: "नौकरी का शीर्षक",
    jobDescription: "नौकरी का विवरण",
    budget: "बजट",
    location: "स्थान",
    category: "श्रेणी",
    createJob: "नौकरी बनाएं",

    // Common
    save: "सेव करें",
    cancel: "रद्द करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    apply: "आवेदन करें",
    bid: "बोली लगाएं",
    hire: "हायर करें",
    viewDetails: "विवरण देखें",
    loading: "लोड हो रहा है...",
  },
  mai: {
    // Navigation
    home: "घर",
    postJob: "काज पोस्ट करू",
    findWork: "काज खोजू",
    login: "लॉगिन",
    signup: "साइन अप",
    dashboard: "डैशबोर्ड",
    logout: "लॉगआउट",

    // Home page
    heroTitle: "स्थानीय गिग मजूर सब सँ जुड़ू",
    heroSubtitle:
      "अपन इलाका मे घरेलू आ व्यापारिक काजक लेल भरोसेमंद पेशेवर सब खोजू",
    searchPlaceholder: "सेवा सब खोजू...",
    searchButton: "खोजू",
    postJobCTA: "काज पोस्ट करू",
    findWorkCTA: "काज खोजू",

    // Categories
    categories: "लोकप्रिय श्रेणी सब",
    housekeeping: "घर सफाई",
    plumbing: "नल मिस्त्री",
    tutoring: "पढ़ाई",
    driving: "गाड़ी चलाबै",
    cooking: "खाना बनाबै",
    gardening: "बगिया काज",

    // Auth
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्डक पुष्टि करू",
    phone: "फोन नम्बर",
    fullName: "पूरा नाम",
    selectRole: "हम चाहै छी",
    jobPoster: "काज पोस्ट करब",
    gigWorker: "काज खोजब",
    createAccount: "खाता बनाउ",
    haveAccount: "पहिनहि खाता अछि?",
    noAccount: "खाता नहि अछि?",

    // Job posting
    jobTitle: "काजक शीर्षक",
    jobDescription: "काजक विवरण",
    budget: "बजट",
    location: "स्थान",
    category: "श्रेणी",
    createJob: "काज बनाउ",

    // Common
    save: "सेव करू",
    cancel: "रद्द करू",
    edit: "संपादन करू",
    delete: "मिटाउ",
    apply: "आवेदन करू",
    bid: "बोली लगाउ",
    hire: "काज पर राखू",
    viewDetails: "विवरण देखू",
    loading: "लोड भ रहल अछि...",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("jobblet-language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("jobblet-language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      if (prev === "en") return "hi";
      if (prev === "hi") return "mai";
      return "en";
    });
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
