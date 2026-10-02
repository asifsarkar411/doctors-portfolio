'use client';

import React from 'react';
import NextLink from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolioData } from '@/context/PortfolioDataContext';
import {
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldAlert,
  Lock,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const { t, getL, toDigits } = useLanguage();
  const { data } = usePortfolioData();
  const profile = data?.profile || {};
  const chambers = data?.chambers || [];

  return (
    <footer style={{
      backgroundColor: 'var(--bg-footer)',
      color: 'var(--text-on-footer)',
      paddingTop: '60px',
      paddingBottom: '30px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="container">
        {/* Emergency Notice Card */}
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          marginBottom: '50px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldAlert size={24} />
          </div>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <strong style={{ color: '#fca5a5', display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>
              {t('emergencyNotice')}
            </strong>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              24/7 Cardiac Emergency Helpline: <a href={`tel:${profile.emergencyPhone || '+8801999887766'}`} style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'underline' }}>{profile.emergencyPhone || '+880 1999-887766'}</a>
            </span>
          </div>
        </div>

        {/* 4 Column Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Column 1: Doctor Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <HeartPulse size={22} />
              </div>
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>
                  {getL(profile, 'name') || 'Prof. Dr. Aris Patel'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {t('bmdcRegNo')} {profile.bmdcReg || 'A-38914'}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '18px' }}>
              {getL(profile, 'shortBio')}
            </p>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              <strong>{getL(profile, 'degrees')}</strong>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px', letterSpacing: '-0.01em' }}>
              {t('quickLinks')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <NextLink href="/" style={{ color: '#94a3b8', transition: 'var(--transition)' }}>{t('navHome')}</NextLink>
              </li>
              <li>
                <NextLink href="/about" style={{ color: '#94a3b8', transition: 'var(--transition)' }}>{t('navAbout')}</NextLink>
              </li>
              <li>
                <NextLink href="/chambers" style={{ color: '#94a3b8', transition: 'var(--transition)' }}>{t('navChambers')}</NextLink>
              </li>
              <li>
                <NextLink href="/schedule" style={{ color: '#94a3b8', transition: 'var(--transition)' }}>{t('navSchedule')}</NextLink>
              </li>
              <li>
                <NextLink href="/contact" style={{ color: '#94a3b8', transition: 'var(--transition)' }}>{t('navContact')}</NextLink>
              </li>
              <li>
                <NextLink href="/admin" style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Lock size={13} /> {t('adminAccess')}
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Chambers Summary */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px' }}>
              {t('chambersHeading')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
              {chambers.slice(0, 3).map((ch) => (
                <div key={ch.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '10px' }}>
                  <strong style={{ color: '#ffffff', display: 'block' }}>{getL(ch, 'name')}</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block' }}>{getL(ch, 'visitingDays')} ({getL(ch, 'visitingHours')})</span>
                  <a href={`tel:${ch.serialPhone}`} style={{ color: '#38bdf8', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                    <Phone size={11} /> {ch.serialPhone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Official Hotline & Contact */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px' }}>
              {t('contactHeading')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="var(--primary)" />
                <a href={`tel:${profile.phone}`} style={{ color: '#cbd5e1' }}>{profile.phone}</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="var(--primary)" />
                <a href={`mailto:${profile.email}`} style={{ color: '#cbd5e1' }}>{profile.email}</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ color: '#94a3b8' }}>{getL(profile, 'address')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} {getL(profile, 'name')}. {t('copyright')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <NextLink href="/admin" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Lock size={12} /> {t('adminAccess')}
            </NextLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
