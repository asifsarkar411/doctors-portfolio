'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolioData } from '@/context/PortfolioDataContext';
import { X, Calendar, Clock, MapPin, CheckCircle2, User, Phone, Mail, AlertCircle } from 'lucide-react';

export default function AppointmentModal({ isOpen, onClose, preselectedChamber = null }) {
  const { t, getL, toDigits } = useLanguage();
  const { data } = usePortfolioData();
  const chambers = data?.chambers || [];

  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientAge: '',
    gender: 'Male',
    chamberId: preselectedChamber ? preselectedChamber.id : (chambers[0]?.id || ''),
    chamberName: preselectedChamber ? preselectedChamber.name : (chambers[0]?.name || ''),
    appointmentDate: '',
    slot: '5:30 PM',
    type: 'New Patient',
    symptoms: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChamberChange = (e) => {
    const chId = e.target.value;
    const selected = chambers.find(c => c.id === chId);
    setFormData(prev => ({
      ...prev,
      chamberId: chId,
      chamberName: selected ? selected.name : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.patientName || !formData.patientPhone) {
      setErrorMsg('Please enter patient name and mobile phone number.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        setSuccessResult(json.appointment);
      } else {
        setErrorMsg(json.error || 'Failed to submit appointment.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    setFormData({
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      patientAge: '',
      gender: 'Male',
      chamberId: chambers[0]?.id || '',
      chamberName: chambers[0]?.name || '',
      appointmentDate: '',
      slot: '5:30 PM',
      type: 'New Patient',
      symptoms: ''
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 28px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-surface)'
        }}>
          <div>
            <span className="badge-tag" style={{ margin: 0 }}>
              <Calendar size={13} /> {t('bookAppointment')}
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '6px', color: 'var(--text-heading)' }}>
              {t('appointmentTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: '50%'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '28px' }}>
          {successResult ? (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px auto'
              }}>
                <CheckCircle2 size={40} />
              </div>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>
                {t('bookingSuccess')}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
                {t('bookingSuccessMsg')}
              </p>

              <div style={{
                background: 'var(--bg-surface-alt)',
                border: '1px dashed var(--primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('serialNumberLabel')}:</span>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>{toDigits(successResult.serialNumber)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('fullName')}:</span>
                  <strong>{successResult.patientName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('chamberName')}:</span>
                  <strong>{successResult.chamberName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('selectDate')}:</span>
                  <strong>{successResult.appointmentDate || 'Upcoming Schedule'} ({successResult.slot})</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-secondary btn-sm" onClick={handleReset}>
                  {t('bookAnother')}
                </button>
                <button className="btn btn-primary btn-sm" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMsg && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#dc2626',
                  fontSize: '0.9rem',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Chamber Selector */}
              <div className="form-group">
                <label className="form-label">{t('selectChamber')} *</label>
                <select
                  className="form-select"
                  value={formData.chamberId}
                  onChange={handleChamberChange}
                  required
                >
                  {chambers.map(ch => (
                    <option key={ch.id} value={ch.id}>
                      {getL(ch, 'name')} — {getL(ch, 'visitingDays')} ({ch.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Name & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">{t('fullName')} *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={t('fullNamePlaceholder')}
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('phoneNumber')} *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder={t('phoneNumberPlaceholder')}
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Age, Gender & Patient Type */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">{t('patientAge')}</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder={t('patientAgePlaceholder')}
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('patientGender')}</label>
                  <select
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Male">{t('genderMale')}</option>
                    <option value="Female">{t('genderFemale')}</option>
                    <option value="Other">{t('genderOther')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('patientType')}</label>
                  <select
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="New Patient">{t('typeNew')}</option>
                    <option value="Report Review">{t('typeFollowUp')}</option>
                  </select>
                </div>
              </div>

              {/* Preferred Date & Time Slot */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">{t('selectDate')}</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('timeSlot')}</label>
                  <select
                    className="form-select"
                    value={formData.slot}
                    onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                  >
                    <option value="5:30 PM">5:30 PM (Evening Slot)</option>
                    <option value="6:30 PM">6:30 PM (Evening Slot)</option>
                    <option value="7:30 PM">7:30 PM (Night Slot)</option>
                    <option value="8:30 PM">8:30 PM (Night Slot)</option>
                    <option value="11:00 AM">11:00 AM (Friday Morning Slot)</option>
                  </select>
                </div>
              </div>

              {/* Symptoms / Note */}
              <div className="form-group">
                <label className="form-label">{t('symptoms')}</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder={t('symptomsPlaceholder')}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={submitting}
                >
                  {submitting ? t('submitting') : t('confirmBooking')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
