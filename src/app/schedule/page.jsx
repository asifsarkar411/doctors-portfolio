'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolioData } from '@/context/PortfolioDataContext';
import AppointmentModal from '@/components/AppointmentModal';
import {
  Clock,
  Calendar,
  Building,
  Filter,
  CheckCircle2,
  AlertCircle,
  Phone
} from 'lucide-react';

export default function SchedulePage() {
  const { t, getL, toDigits } = useLanguage();
  const { data } = usePortfolioData();
  const [selectedChamberFilter, setSelectedChamberFilter] = useState('ALL');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const schedules = data?.schedules || [];
  const chambers = data?.chambers || [];
  const profile = data?.profile || {};

  const filteredSchedules = selectedChamberFilter === 'ALL'
    ? schedules
    : schedules.filter(s => s.chamberId === selectedChamberFilter || s.chamberName.includes(selectedChamberFilter));

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="badge-tag">
            <Clock size={13} /> {t('navSchedule')}
          </span>
          <h1 className="section-title">
            {t('scheduleHeading')}
          </h1>
          <p className="section-desc">
            {t('scheduleSubheading')}
          </p>

          {/* Chamber Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '24px' }}>
            <button
              onClick={() => setSelectedChamberFilter('ALL')}
              className={`btn btn-sm ${selectedChamberFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {t('allChambers')}
            </button>
            {chambers.map(ch => (
              <button
                key={ch.id}
                onClick={() => setSelectedChamberFilter(ch.id)}
                className={`btn btn-sm ${selectedChamberFilter === ch.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {getL(ch, 'name')}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Table Card */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '18px 24px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                    {t('dayOfWeek')}
                  </th>
                  <th style={{ padding: '18px 24px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                    {t('chamberName')}
                  </th>
                  <th style={{ padding: '18px 24px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                    {t('timeSlot')}
                  </th>
                  <th style={{ padding: '18px 24px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                    {t('slotStatus')}
                  </th>
                  <th style={{ padding: '18px 24px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-heading)', textAlign: 'right' }}>
                    {t('action')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((sch) => (
                  <tr
                    key={sch.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background 0.2s'
                    }}
                  >
                    <td style={{ padding: '20px 24px', fontWeight: 800, fontSize: '1rem', color: 'var(--text-heading)' }}>
                      {getL(sch, 'day')}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <strong style={{ color: 'var(--text-heading)', display: 'block', fontSize: '0.95rem' }}>
                        {getL(sch, 'chamberName')}
                      </strong>
                    </td>
                    <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={15} color="var(--primary)" />
                        {getL(sch, 'time')}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span className={`badge-status ${sch.status === 'Available' ? 'confirmed' : 'pending'}`}>
                        {getL(sch, 'status')}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <button
                        onClick={() => setIsBookingOpen(true)}
                        className="btn btn-primary btn-sm"
                      >
                        <Calendar size={15} />
                        <span>{t('bookSlot')}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule Guidelines Note */}
        <div style={{
          marginTop: '40px',
          background: 'rgba(var(--primary-rgb), 0.08)',
          border: '1px solid rgba(var(--primary-rgb), 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          <Clock size={24} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '6px' }}>
              Patient Appointment Guidelines
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Please arrive at the chamber 15 minutes before your scheduled appointment time. Bring all previous medical records, ECG reports, Echocardiograms, angiogram discs, and current medications. For emergency serial assistance, call the chamber receptionist directly at <a href={`tel:${profile.serialPhone}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>{profile.serialPhone}</a>.
            </p>
          </div>
        </div>
      </div>

      <AppointmentModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
