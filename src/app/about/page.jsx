'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolioData } from '@/context/PortfolioDataContext';
import AppointmentModal from '@/components/AppointmentModal';
import {
  Award,
  GraduationCap,
  Building,
  Heart,
  Calendar,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

export default function AboutPage() {
  const { t, getL, toDigits } = useLanguage();
  const { data } = usePortfolioData();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const profile = data?.profile || {};

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <span className="badge-tag">
            <Stethoscope size={13} /> {t('navAbout')}
          </span>
          <h1 className="section-title">
            {t('aboutHeading')}
          </h1>
          <p className="section-desc">
            {t('aboutSubheading')}
          </p>
        </div>

        {/* 2-Column Hero Profile Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '60px'
        }}>
          {/* Photo */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              maxWidth: '400px',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              border: '4px solid var(--bg-surface)'
            }}>
              <img
                src={profile.photo || '/images/doctor.jpg'}
                alt={profile.name}
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Intro & Credentials */}
          <div>
            <div className="status-indicator" style={{ marginBottom: '14px' }}>
              <span className="pulse-dot" />
              <span>{t('availableToday')}</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>
              {getL(profile, 'name')}
            </h2>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px' }}>
              {getL(profile, 'designation')}
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
              {getL(profile, 'degrees')}
            </div>

            <p style={{ fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--text-main)', marginBottom: '24px' }}>
              {getL(profile, 'shortBio')}
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button onClick={() => setIsBookingOpen(true)} className="btn btn-primary">
                <Calendar size={18} />
                <span>{t('bookAppointment')}</span>
              </button>
              <a href={`tel:${profile.emergencyPhone}`} className="btn btn-secondary">
                <ShieldCheck size={18} />
                <span>Emergency: {profile.emergencyPhone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Full Detailed Biography */}
        <div className="card" style={{ marginBottom: '50px', padding: '36px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={22} color="var(--primary)" />
            <span>Comprehensive Professional Profile</span>
          </h3>
          <div style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'var(--text-main)',
            whiteSpace: 'pre-line'
          }}>
            {getL(profile, 'fullBio')}
          </div>
        </div>

        {/* Qualifications & Medical Philosophy Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {/* Qualifications */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                {t('qualifications')}
              </h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-heading)' }}>MBBS (Dhaka Medical College)</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Top academic standing, internship in Internal Medicine and Surgery</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-heading)' }}>FCPS (Internal Medicine)</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bangladesh College of Physicians and Surgeons (BCPS)</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-heading)' }}>MD (Cardiology)</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>National Institute of Cardiovascular Diseases (NICVD)</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-heading)' }}>MRCP (UK)</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Royal Colleges of Physicians, United Kingdom</span>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-heading)' }}>FACC (USA)</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fellow of the American College of Cardiology</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Philosophy */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                {t('carePhilosophy')}
              </h3>
            </div>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'var(--text-main)',
              fontStyle: 'italic',
              marginBottom: '20px',
              padding: '16px',
              background: 'var(--bg-surface-alt)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--accent)'
            }}>
              "{getL(profile, 'philosophy')}"
            </p>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              We believe in evidence-driven precision diagnostics, transparent communication with family members, and ethical, personalized therapeutic strategies designed to minimize complications and foster long-term cardiac longevity.
            </p>
          </div>
        </div>

        {/* Bottom Booking CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>
            Consult Prof. Dr. Aris Patel For Your Heart Care
          </h3>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '650px', margin: '0 auto 24px auto' }}>
            Book your serial number online or call our chamber desks directly to confirm your consultation schedule.
          </p>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="btn btn-secondary btn-lg"
            style={{ color: 'var(--primary)', fontWeight: 700 }}
          >
            <Calendar size={20} />
            <span>{t('bookAppointment')}</span>
          </button>
        </div>
      </div>

      <AppointmentModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
