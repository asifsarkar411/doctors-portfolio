'use client';

import React, { useState } from 'react';
import Link from 'next/router'; // We use next/link in Next.js App Router
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { usePortfolioData } from '@/context/PortfolioDataContext';
import AppointmentModal from './AppointmentModal';
import {
  Phone,
  Mail,
  HeartPulse,
  Calendar,
  Globe,
  Sun,
  Moon,
  Lock,
  Menu,
  X,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { lang, switchLanguage, t, getL } = useLanguage();
  const { themeMode, toggleThemeMode } = useTheme();
  const { data } = usePortfolioData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const profile = data?.profile || {};
  const themeSettings = data?.themeSettings || {};

  const navLinks = [
    { name: t('navHome'), href: '/' },
    { name: t('navAbout'), href: '/about' },
    { name: t('navServices'), href: '/#services' },
    { name: t('navChambers'), href: '/chambers' },
    { name: t('navSchedule'), href: '/schedule' },
    { name: t('navGallery'), href: '/#gallery' },
    { name: t('navBlog'), href: '/#posts' },
    { name: t('navContact'), href: '/contact' }
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Emergency / Hotline Bar */}
      <div className="top-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <a href={`tel:${profile.emergencyPhone || '+8801999887766'}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontWeight: '700' }}>
              <Phone size={14} />
              <span>{t('emergencyLine')}: {profile.emergencyPhone || '+880 1999-887766'}</span>
            </a>
            <a href={`tel:${profile.serialPhone || '+8801811334455'}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} />
              <span>{t('serialPhone')}: {profile.serialPhone || '+880 1811-334455'}</span>
            </a>
            <a href={`mailto:${profile.email || 'dr.arispatel.cardio@gmail.com'}`} style={{ display: 'none', alignItems: 'center', gap: '6px' }} className="desktop-email">
              <Mail size={14} />
              <span>{profile.email || 'dr.arispatel.cardio@gmail.com'}</span>
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Visiting status pill */}
            <div className="status-indicator" style={{ padding: '3px 10px', fontSize: '0.78rem' }}>
              <span className="pulse-dot" />
              <span>{t('availableToday')}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => switchLanguage()}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '4px 10px',
                fontSize: '0.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: 'var(--radius-full)'
              }}
              title="Change Language"
            >
              <Globe size={13} />
              <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleThemeMode}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {themeMode === 'dark' ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#64748b" />}
            </button>

            {/* Admin Link */}
            <NextLink
              href="/admin"
              className="btn btn-secondary btn-sm"
              style={{
                padding: '4px 10px',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Admin Panel"
            >
              <Lock size={12} />
              <span style={{ display: 'none' }} className="admin-text">{t('adminLogin')}</span>
            </NextLink>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <header className="glass-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          {/* Brand Logo */}
          <NextLink href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.35)'
            }}>
              <HeartPulse size={26} />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', display: 'block', lineHeight: 1.15 }}>
                {getL(profile, 'name') || 'Prof. Dr. Aris Patel'}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} /> {getL(profile, 'designation') || 'Senior Consultant Cardiologist'}
              </span>
            </div>
          </NextLink>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '22px' }} className="desktop-nav">
            {navLinks.map((link) => (
              <NextLink
                key={link.name}
                href={link.href}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: isActive(link.href) ? 'var(--primary)' : 'var(--text-main)',
                  transition: 'var(--transition)',
                  position: 'relative',
                  padding: '6px 0'
                }}
              >
                {link.name}
                {isActive(link.href) && (
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '2px'
                  }} />
                )}
              </NextLink>
            ))}
          </nav>

          {/* Action Area: Book Appointment CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="btn btn-primary"
              style={{ display: 'none' }}
              id="desktop-book-btn"
            >
              <Calendar size={17} />
              <span>{t('bookAppointment')}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', padding: '8px', borderRadius: 'var(--radius-md)' }}
              id="mobile-toggle-btn"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-color)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {navLinks.map((link) => (
              <NextLink
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: isActive(link.href) ? 'var(--primary)' : 'var(--text-main)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive(link.href) ? 'rgba(var(--primary-rgb), 0.08)' : 'transparent'
                }}
              >
                {link.name}
              </NextLink>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsBookingOpen(true);
              }}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Calendar size={18} />
              <span>{t('bookAppointment')}</span>
            </button>
          </div>
        )}
      </header>

      {/* Floating Appointment Modal */}
      <AppointmentModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      {/* Mobile Floating Booking Action Button */}
      <div className="floating-book-btn">
        <button
          onClick={() => setIsBookingOpen(true)}
          className="btn btn-primary btn-lg"
          style={{ borderRadius: 'var(--radius-full)', gap: '10px' }}
        >
          <Calendar size={20} />
          <span>{t('bookAppointment')}</span>
        </button>
      </div>

      <style jsx>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          #desktop-book-btn {
            display: inline-flex !important;
          }
          #mobile-toggle-btn {
            display: none !important;
          }
          .desktop-email {
            display: inline-flex !important;
          }
          .admin-text {
            display: inline !important;
          }
        }
      `}</style>
    </>
  );
}
