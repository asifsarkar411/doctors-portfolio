'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolioData } from '@/context/PortfolioDataContext';
import AppointmentModal from '@/components/AppointmentModal';
import {
  MapPin,
  Calendar,
  Phone,
  Clock,
  CheckCircle2,
  DollarSign,
  Building,
  Navigation,
  ShieldCheck
} from 'lucide-react';

export default function ChambersPage() {
  const { t, getL, toDigits } = useLanguage();
  const { data } = usePortfolioData();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedChamber, setSelectedChamber] = useState(null);

  const chambers = data?.chambers || [];

  const handleBook = (chamber) => {
    setSelectedChamber(chamber);
    setIsBookingOpen(true);
  };

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="badge-tag">
            <Building size={13} /> {t('navChambers')}
          </span>
          <h1 className="section-title">
            {t('chambersHeading')}
          </h1>
          <p className="section-desc">
            {t('chambersSubheading')}
          </p>
        </div>

        {/* Chambers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {chambers.map((chamber, index) => (
            <div
              key={chamber.id}
              className="card"
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                padding: 0,
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 0
              }}>
                {/* Chamber Photo & Map */}
                <div style={{ position: 'relative', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                  <img
                    src={chamber.image || '/images/chamber1.jpg'}
                    alt={chamber.name}
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />
                  {/* Google Map iframe */}
                  <div style={{ flex: 1, minHeight: '180px', width: '100%', position: 'relative' }}>
                    <iframe
                      title={`${chamber.name} Map`}
                      src={chamber.mapEmbedUrl || 'https://maps.google.com/maps?q=Dhaka&t=&z=13&ie=UTF8&iwloc=&output=embed'}
                      style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* Chamber Details Body */}
                <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                      <span className="badge-tag" style={{ margin: 0 }}>
                        Chamber #{toDigits(index + 1)}
                      </span>
                      <div style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(var(--primary-rgb), 0.12)',
                        color: 'var(--primary)',
                        fontWeight: 800,
                        fontSize: '0.95rem'
                      }}>
                        {t('consultationFee')}: {chamber.consultationFee}
                      </div>
                    </div>

                    <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>
                      {getL(chamber, 'name')}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '8px' }}>
                      <Building size={16} color="var(--primary)" />
                      <span>{getL(chamber, 'room')}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
                      <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{getL(chamber, 'address')}</span>
                    </div>

                    {/* Schedule & Fees Details Card */}
                    <div style={{
                      background: 'var(--bg-surface-alt)',
                      borderRadius: 'var(--radius-md)',
                      padding: '18px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '14px',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t('visitingDays')}</span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-heading)' }}>{getL(chamber, 'visitingDays')}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t('visitingHours')}</span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-heading)' }}>{getL(chamber, 'visitingHours')}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t('reportReview')}</span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-heading)' }}>{chamber.reportReviewFee || '৳ 800'}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t('serialPhone')}</span>
                        <a href={`tel:${chamber.serialPhone}`} style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 700 }}>
                          {chamber.serialPhone}
                        </a>
                      </div>
                    </div>

                    {/* Facilities Tags */}
                    {chamber.facilities && (
                      <div style={{ marginBottom: '24px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', display: 'block', marginBottom: '10px' }}>
                          {t('facilities')}:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {(getL(chamber, 'facilities') || chamber.facilities).map((fac, fIdx) => (
                            <span
                              key={fIdx}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.82rem',
                                padding: '5px 12px',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-main)'
                              }}
                            >
                              <CheckCircle2 size={13} color="var(--accent)" />
                              {fac}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleBook(chamber)}
                      className="btn btn-primary btn-lg"
                      style={{ flex: 1, minWidth: '220px' }}
                    >
                      <Calendar size={18} />
                      <span>{t('bookThisChamber')}</span>
                    </button>
                    <a
                      href={`tel:${chamber.serialPhone}`}
                      className="btn btn-secondary btn-lg"
                    >
                      <Phone size={18} />
                      <span>{t('callChamber')}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedChamber(null);
        }}
        preselectedChamber={selectedChamber}
      />
    </div>
  );
}
