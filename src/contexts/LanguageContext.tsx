'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'id';

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Home/Globe
    'home.title': 'GIS Portfolio',
    'home.subtitle': 'Explore my projects across the globe',
    'home.viewProject': 'View Project',
    'home.projects': 'Projects',
    'home.clickToExplore': 'Click markers to explore projects',
    
    // About
    'about.title': 'About Me',
    'about.skills': 'Skills & Expertise',
    'about.experience': 'Work Experience',
    'about.education': 'Education',
    'about.downloadCV': 'Download CV',
    'about.viewPortfolio': 'View Portfolio PDF',
    'about.summary': 'Professional Summary',
    
    // Contact
    'contact.title': 'Get In Touch',
    'contact.subtitle': 'Have a project in mind? Let\'s talk!',
    'contact.name': 'Your Name',
    'contact.email': 'Your Email',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Message sent successfully!',
    'contact.error': 'Failed to send message',
    
    // Project Detail
    'project.overview': 'Project Overview',
    'project.gallery': 'Gallery',
    'project.techStack': 'Tech Stack',
    'project.keyImpacts': 'Key Impacts',
    'project.location': 'Location',
    'project.year': 'Year',
    'project.viewLive': 'View Live Project',
    'project.backToGlobe': 'Back to Globe',
    
    // Chatbot
    'chat.title': 'Portfolio Assistant',
    'chat.placeholder': 'Ask about my projects...',
    'chat.send': 'Send',
    'chat.thinking': 'Thinking...',
    'chat.greeting': 'Hi! I can help you learn about the projects and skills in this portfolio. What would you like to know?',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.close': 'Close',
    'common.viewAll': 'View All',
  },
  id: {
    // Navigation
    'nav.home': 'Beranda',
    'nav.about': 'Tentang',
    'nav.contact': 'Kontak',
    
    // Home/Globe
    'home.title': 'Portofolio GIS',
    'home.subtitle': 'Jelajahi proyek saya di seluruh dunia',
    'home.viewProject': 'Lihat Proyek',
    'home.projects': 'Proyek',
    'home.clickToExplore': 'Klik penanda untuk menjelajahi proyek',
    
    // About
    'about.title': 'Tentang Saya',
    'about.skills': 'Keahlian & Kompetensi',
    'about.experience': 'Pengalaman Kerja',
    'about.education': 'Pendidikan',
    'about.downloadCV': 'Unduh CV',
    'about.viewPortfolio': 'Lihat PDF Portofolio',
    'about.summary': 'Ringkasan Profesional',
    
    // Contact
    'contact.title': 'Hubungi Saya',
    'contact.subtitle': 'Punya proyek? Mari diskusi!',
    'contact.name': 'Nama Anda',
    'contact.email': 'Email Anda',
    'contact.message': 'Pesan Anda',
    'contact.send': 'Kirim Pesan',
    'contact.sending': 'Mengirim...',
    'contact.success': 'Pesan berhasil dikirim!',
    'contact.error': 'Gagal mengirim pesan',
    
    // Project Detail
    'project.overview': 'Gambaran Proyek',
    'project.gallery': 'Galeri',
    'project.techStack': 'Teknologi',
    'project.keyImpacts': 'Dampak Utama',
    'project.location': 'Lokasi',
    'project.year': 'Tahun',
    'project.viewLive': 'Lihat Proyek',
    'project.backToGlobe': 'Kembali ke Globe',
    
    // Chatbot
    'chat.title': 'Asisten Portofolio',
    'chat.placeholder': 'Tanya tentang proyek saya...',
    'chat.send': 'Kirim',
    'chat.thinking': 'Berpikir...',
    'chat.greeting': 'Hai! Saya bisa membantu Anda mengetahui tentang proyek dan keahlian di portofolio ini. Apa yang ingin Anda ketahui?',
    
    // Common
    'common.loading': 'Memuat...',
    'common.error': 'Terjadi kesalahan',
    'common.close': 'Tutup',
    'common.viewAll': 'Lihat Semua',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const defaultT = (key: string): string => translations['en'][key] || key;

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: defaultT,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language | null;
    if (stored && (stored === 'en' || stored === 'id')) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
