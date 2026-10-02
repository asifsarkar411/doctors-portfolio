'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    navHome: "Home",
    navAbout: "About Doctor",
    navServices: "What He Does",
    navChambers: "Chamber Details",
    navSchedule: "Time Schedule",
    navGallery: "Gallery",
    navBlog: "Health Posts",
    navContact: "Contact",
    bookAppointment: "Book Appointment",
    adminLogin: "Admin Login",
    callChamber: "Call Chamber",
    emergencyLine: "Emergency 24/7",
    bmdcRegNo: "BMDC Reg.",

    // Hero Section
    availableToday: "Available for Consultation Today",
    yearsExperience: "Years Experience",
    happyPatients: "Satisfied Patients",
    successfulProcedures: "Procedures Done",
    awardsRecognitions: "Awards & Honors",
    consultationHours: "Chamber Hours",
    viewSchedule: "View Schedule",
    doctorSpecialty: "Cardiology & Interventional Specialist",

    // What He Does / Services
    servicesHeading: "Clinical Specialties & Care",
    servicesSubheading: "Comprehensive, state-of-the-art cardiovascular treatments and diagnostic interventions.",
    viewAllServices: "View All Specialties",
    keyHighlights: "Key Clinical Procedures",
    consultNow: "Consult For This",

    // Chambers
    chambersHeading: "Chambers & Visiting Locations",
    chambersSubheading: "Consult Prof. Dr. Aris Patel at leading cardiac hospitals and specialized centers in Dhaka.",
    consultationFee: "Consultation Fee",
    reportReview: "Report Review",
    visitingDays: "Visiting Days",
    visitingHours: "Visiting Hours",
    serialPhone: "Serial Booking",
    chamberRoom: "Room / Floor",
    facilities: "Chamber Facilities",
    getDirections: "View Map & Directions",
    bookThisChamber: "Book at This Chamber",

    // Time Schedule
    scheduleHeading: "Weekly Consultation Schedule",
    scheduleSubheading: "Check chamber availability and book your priority appointment slot.",
    dayOfWeek: "Day",
    chamberName: "Hospital / Chamber",
    timeSlot: "Timings",
    slotStatus: "Slot Availability",
    action: "Action",
    bookSlot: "Book Slot",
    slotFull: "Slot Full",
    filterChamber: "Filter by Chamber",
    allChambers: "All Chambers",

    // Gallery
    galleryHeading: "Gallery & Medical Moments",
    gallerySubheading: "Glimpses of consultation chambers, international medical conferences, and patient awareness.",
    allCategories: "All",
    catClinic: "Clinic",
    catConference: "Conference",
    catProcedures: "Procedures",
    catAwards: "Awards",

    // Blog / Health Posts
    postsHeading: "Heart Health Insights & Articles",
    postsSubheading: "Expert guidance, preventive tips, and medical awareness directly from the cardiologist.",
    readArticle: "Read Full Article",
    readTime: "Read Time",
    latestPosts: "Latest Articles",
    shareArticle: "Share Article",

    // Appointment Booking Form
    appointmentTitle: "Book a Doctor's Appointment",
    appointmentSub: "Fill out the simple form below to reserve your priority serial number at your preferred chamber.",
    fullName: "Patient's Full Name",
    fullNamePlaceholder: "e.g. Md. Tanvir Hossain",
    phoneNumber: "Mobile Phone Number",
    phoneNumberPlaceholder: "e.g. 01711-XXXXXX",
    emailAddress: "Email Address (Optional)",
    emailPlaceholder: "e.g. patient@example.com",
    patientAge: "Patient's Age",
    patientAgePlaceholder: "e.g. 45",
    patientGender: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    selectChamber: "Select Preferred Chamber",
    selectDate: "Appointment Date",
    patientType: "Patient Type",
    typeNew: "New Patient (First Visit)",
    typeFollowUp: "Follow-up / Report Review",
    symptoms: "Brief Problem / Symptoms",
    symptomsPlaceholder: "Describe chest discomfort, high BP, palpitations, or reason for visit...",
    submitting: "Submitting Booking...",
    confirmBooking: "Confirm & Reserve Serial",
    bookingSuccess: "Appointment Booked Successfully!",
    bookingSuccessMsg: "Your serial request has been registered. Chamber reception will confirm your slot via SMS/Call.",
    serialNumberLabel: "Your Serial Number",
    bookAnother: "Book Another Appointment",

    // Contact
    contactHeading: "Get in Touch & Emergency Help",
    contactSubheading: "Have questions about reports, procedures, or need urgent cardiac guidance? Reach out.",
    sendMessage: "Send Direct Message",
    yourName: "Your Full Name",
    yourEmail: "Your Email Address",
    yourPhone: "Your Contact Number",
    subject: "Subject / Reason",
    messageContent: "Message Details",
    messagePlaceholder: "Write your inquiry, medical question, or report details here...",
    sendingMsg: "Sending Message...",
    msgSentSuccess: "Thank you! Your message has been sent to the doctor's office.",
    chamberHotlines: "Chamber Booking Hotlines",
    emergencyDesk: "24/7 Emergency Line",
    emailDesk: "Official Email",
    visitAddress: "Chamber Address",

    // About Page
    aboutHeading: "About Prof. Dr. Aris Patel",
    aboutSubheading: "A career dedicated to saving hearts, pioneering clinical care, and patient wellbeing.",
    qualifications: "Qualifications & Degrees",
    experienceStory: "Clinical Experience & Leadership",
    carePhilosophy: "Philosophy of Patient Care",
    hospitalAffiliations: "Hospital Affiliations",
    downloadCV: "Download Profile Summary",

    // Footer
    quickLinks: "Quick Navigation",
    emergencyNotice: "For immediate cardiac arrest or sudden severe breathing distress, please call emergency hotline or visit the nearest hospital emergency room without delay.",
    copyright: "All Rights Reserved. Registered Medical Specialist.",
    adminAccess: "Admin Portal",
    toggleLanguage: "বাংলা"
  },
  bn: {
    // Navigation
    navHome: "হোম",
    navAbout: "ডাক্তার সম্পর্কে",
    navServices: "চিকিৎসাসেবা ও বিশেষত্ব",
    navChambers: "চেম্বারসমূহ",
    navSchedule: "সময়সূচী",
    navGallery: "গ্যালারি",
    navBlog: "স্বাস্থ্য বার্তা",
    navContact: "যোগাযোগ",
    bookAppointment: "অ্যাপয়েন্টমেন্ট বুক করুন",
    adminLogin: "অ্যাডমিন লগইন",
    callChamber: "চেম্বারে কল করুন",
    emergencyLine: "জরুরি সেবা ২৪/৭",
    bmdcRegNo: "বিএমডিসি রেজি.",

    // Hero Section
    availableToday: "আজকে চেম্বারে রোগী দেখছেন",
    yearsExperience: "বছরের অভিজ্ঞতা",
    happyPatients: "সন্তুষ্ট রোগী",
    successfulProcedures: "সফল এনজিওগ্রাম ও প্রসিডিউর",
    awardsRecognitions: "জাতীয় ও আন্তর্জাতিক পুরস্কার",
    consultationHours: "চেম্বারের সময়",
    viewSchedule: "সময়সূচী দেখুন",
    doctorSpecialty: "হৃদরোগ ও ইন্টারভেনশনাল বিশেষজ্ঞ",

    // What He Does / Services
    servicesHeading: "চিকিৎসাসেবা ও বিশেষত্ব",
    servicesSubheading: "উন্নত প্রযুক্তি ও অভিজ্ঞতার সমন্বয়ে বিশ্বমানের হৃদরোগ চিকিৎসা ও পরীক্ষা সেবা।",
    viewAllServices: "সকল সেবাসমূহ দেখুন",
    keyHighlights: "মূল চিকিৎসা পদ্ধতি",
    consultNow: "এই সেবার জন্য পরামর্শ নিন",

    // Chambers
    chambersHeading: "চেম্বার ও রোগী দেখার স্থান",
    chambersSubheading: "ঢাকার শীর্ষস্থানীয় আধুনিক কার্ডিয়াক হাসপাতাল ও ক্লিনিকে প্রফেসর ডাঃ আরিস প্যাটেলের চেম্বার।",
    consultationFee: "ভিজিট ফি (নতুন রোগী)",
    reportReview: "রিপোর্ট পর্যালোচনা ফি",
    visitingDays: "রোগী দেখার দিনসমূহ",
    visitingHours: "রোগী দেখার সময়",
    serialPhone: "সিরিয়াল বুকিং নম্বর",
    chamberRoom: "রুম / তলা",
    facilities: "চেম্বারের সুবিধাসমূহ",
    getDirections: "ম্যাপ ও লোকেশন দেখুন",
    bookThisChamber: "এই চেম্বারে সিরিয়াল নিন",

    // Time Schedule
    scheduleHeading: "সাপ্তাহিক রোগী দেখার সময়সূচী",
    scheduleSubheading: "চেম্বারের সময়সূচী দেখে আপনার সুবিধাজনক দিনে আগে থেকেই সিরিয়াল নিশ্চিত করুন।",
    dayOfWeek: "বার / দিন",
    chamberName: "হাসপাতাল / চেম্বার",
    timeSlot: "সময়",
    slotStatus: "সিরিয়ালের অবস্থা",
    action: "পদক্ষেপ",
    bookSlot: "সিরিয়াল নিন",
    slotFull: "সিরিয়াল পূর্ণ",
    filterChamber: "চেম্বার ফিল্টার করুন",
    allChambers: "সকল চেম্বার",

    // Gallery
    galleryHeading: "ফটোগ্যালারি ও কর্মযজ্ঞ",
    gallerySubheading: "চেম্বার, আন্তর্জাতিক কনফারেন্স ও চিকিৎসা ক্যাম্পের বিশেষ মুহূর্তসমূহ।",
    allCategories: "সবগুলো",
    catClinic: "চেম্বার",
    catConference: "সম্মেলন",
    catProcedures: "চিকিৎসাসেবা",
    catAwards: "পুরস্কার",

    // Blog / Health Posts
    postsHeading: "হৃদরোগ সচেতনতা ও স্বাস্থ্য পরামর্শ",
    postsSubheading: "হৃদপিণ্ড সুস্থ রাখার আধুনিক পরামর্শ ও সঠিক তথ্য সরাসরি হৃদরোগ বিশেষজ্ঞের কাছ থেকে।",
    readArticle: "সম্পূর্ণ পড়ুন",
    readTime: "পড়ার সময়",
    latestPosts: "সাম্প্রতিক স্বাস্থ্য বার্তা",
    shareArticle: "শেয়ার করুন",

    // Appointment Booking Form
    appointmentTitle: "ডাক্তারের অ্যাপয়েন্টমেন্ট বুক করুন",
    appointmentSub: "নিচের সহজ ফর্মটি পূরণ করে আপনার পছন্দের চেম্বারে সহজে সিরিয়াল নিশ্চিত করুন।",
    fullName: "রোগীর পূর্ণ নাম",
    fullNamePlaceholder: "যেমন: মোঃ তানভীর হোসেন",
    phoneNumber: "মোবাইল ফোন নম্বর",
    phoneNumberPlaceholder: "যেমন: ০১৭১১-XXXXXX",
    emailAddress: "ইমেইল অ্যাড্রেস (ঐচ্ছিক)",
    emailPlaceholder: "যেমন: patient@example.com",
    patientAge: "রোগীর বয়স",
    patientAgePlaceholder: "যেমন: ৪৫",
    patientGender: "লিঙ্গ",
    genderMale: "পুরুষ",
    genderFemale: "মহিলা",
    genderOther: "অন্যান্য",
    selectChamber: "চেম্বার নির্বাচন করুন",
    selectDate: "অ্যাপয়েন্টমেন্টের তারিখ",
    patientType: "রোগীর ধরন",
    typeNew: "নতুন রোগী (প্রথম সাক্ষাত)",
    typeFollowUp: "পুরাতন রোগী / রিপোর্ট পর্যালোচনা",
    symptoms: "সমস্যা বা রোগের সংক্ষিপ্ত বিবরণ",
    symptomsPlaceholder: "বুকে ব্যথা, শ্বাসকষ্ট, উচ্চ রক্তচাপ বা অন্য কোনো সমস্যার বিবরণ লিখুন...",
    submitting: "সিরিয়াল বুক হচ্ছে...",
    confirmBooking: "সিরিয়াল নিশ্চিত করুন",
    bookingSuccess: "অ্যাপয়েন্টমেন্ট সফলভাবে বুক হয়েছে!",
    bookingSuccessMsg: "আপনার সিরিয়াল রিকোয়েস্ট গ্রহণ করা হয়েছে। চেম্বার থেকে কল বা এসএমএস করে সময় কনফার্ম করা হবে।",
    serialNumberLabel: "আপনার সিরিয়াল নম্বর",
    bookAnother: "আরেকটি অ্যাপয়েন্টমেন্ট নিন",

    // Contact
    contactHeading: "যোগাযোগ ও জরুরি সহায়তা",
    contactSubheading: "রিপোর্ট পর্যালোচনা, চেম্বার লোকেশন বা যে কোনো তথ্যের জন্য যোগাযোগ করুন।",
    sendMessage: "সরাসরি বার্তা পাঠান",
    yourName: "আপনার নাম",
    yourEmail: "আপনার ইমেইল",
    yourPhone: "যোগাযোগের ফোন নম্বর",
    subject: "বিষয়",
    messageContent: "বার্তার বিবরণ",
    messagePlaceholder: "আপনার প্রশ্ন, রিপোর্ট তথ্য বা বক্তব্য বিস্তারিত লিখুন...",
    sendingMsg: "বার্তা পাঠানো হচ্ছে...",
    msgSentSuccess: "ধন্যবাদ! আপনার বার্তা ডাক্তারের অফিসে সফলভাবে পৌঁছেছে।",
    chamberHotlines: "চেম্বার সিরিয়াল হটলাইন",
    emergencyDesk: "২৪/৭ জরুরি হটলাইন",
    emailDesk: "অফিসিয়াল ইমেইল",
    visitAddress: "চেম্বারের ঠিকানা",

    // About Page
    aboutHeading: "প্রফেসর ডাঃ আরিস প্যাটেল পরিচিতি",
    aboutSubheading: "মানবসেবা, উন্নত হৃদরোগ চিকিৎসা ও আধুনিক প্রযুক্তির প্রতি আজীবন নিষ্ঠাবান।",
    qualifications: "ডিগ্রি ও শিক্ষাগত যোগ্যতা",
    experienceStory: "চিকিৎসা অভিজ্ঞতা ও বিশেষ সাফল্য",
    carePhilosophy: "চিকিৎসা সেবার মূল দর্শন",
    hospitalAffiliations: "হাসপাতাল সংযুক্তি",
    downloadCV: "প্রোফাইল সারসংক্ষেপ",

    // Footer
    quickLinks: "গুরুত্বপূর্ণ লিঙ্ক",
    emergencyNotice: "হঠাৎ তীব্র বুকে ব্যথা, অজ্ঞান হয়ে যাওয়া বা মারাত্মক শ্বাসকষ্টের ক্ষেত্রে অবিলম্বে জরুরি হটলাইনে যোগাযোগ করুন অথবা নিকটস্থ হাসপাতালের জরুরি বিভাগে যান।",
    copyright: "সর্বস্বত্ব সংরক্ষিত। বাংলাদেশ মেডিকেল ও ডেন্টাল কাউন্সিল রেজিস্টার্ড বিশেষজ্ঞ চিকিৎসক।",
    adminAccess: "অ্যাডমিন প্যানেল",
    toggleLanguage: "English"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('doctor_lang');
      if (saved && (saved === 'en' || saved === 'bn')) {
        setLang(saved);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const switchLanguage = (newLang) => {
    const l = newLang || (lang === 'en' ? 'bn' : 'en');
    setLang(l);
    try {
      localStorage.setItem('doctor_lang', l);
    } catch (e) {
      // ignore
    }
  };

  const t = (key, fallback = '') => {
    return translations[lang]?.[key] || translations['en']?.[key] || fallback || key;
  };

  // Helper to dynamically get English or Bangla field from data object
  const getL = (item, field) => {
    if (!item) return '';
    if (lang === 'bn') {
      const bnField = field + 'Bn';
      if (item[bnField] !== undefined && item[bnField] !== null && item[bnField] !== '') {
        return item[bnField];
      }
    }
    return item[field] || '';
  };

  // Convert numbers to Bengali digits if lang is bn
  const toDigits = (num) => {
    if (num === null || num === undefined) return '';
    const str = String(num);
    if (lang !== 'bn') return str;
    const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return str.replace(/[0-9]/g, (w) => bnNums[+w]);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: switchLanguage, switchLanguage, t, getL, toDigits }}>
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
