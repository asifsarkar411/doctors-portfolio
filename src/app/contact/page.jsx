'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolioData } from '@/context/PortfolioDataContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

export default function ContactPage() {
  const { t, getL, toDigits } = useLanguage();
  const { data } = usePortfolioData();
  const profile = data?.profile || {};
  const chambers = data?.chambers || [];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setErrorMsg(json.error || 'Failed to send message.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error sending message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="badge-tag">
            <Mail size={13} /> {t('navContact')}
          </span>
          <h1 className="section-title">
            {t('contactHeading')}
          </h1>
          <p className="section-desc">
            {t('contactSubheading')}
          </p>
        </div>

        {/* 2 Column Layout: Form & Quick Contact Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Left: Contact Form */}
          <div className="card" style={{ padding: '36px', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>
              {t('sendMessage')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Send your inquiry, question about reports, or appointment assistance request. Your message is received directly by the doctor's administrative desk.
            </p>

            {submitted ? (
              <div style={{
                textAlign: 'center',
                padding: '30px 20px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 14px auto' }} />
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>
                  {t('msgSentSuccess')}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  We will get back to you by email or phone within 24 hours.
                </p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </button>
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

                <div className="form-group">
                  <label className="form-label">{t('yourName')} *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Md. Tanvir Hossain"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">{t('yourEmail')} *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('yourPhone')}</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="e.g. 01711-XXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('subject')}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Inquiry regarding Angiogram CD Review"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('messageContent')} *</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder={t('messagePlaceholder')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  disabled={submitting}
                >
                  <Send size={18} />
                  <span>{submitting ? t('sendingMsg') : t('sendMessage')}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Quick Contact Cards & Chambers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Emergency Hotline Card */}
            <div style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <ShieldAlert size={28} />
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {t('emergencyDesk')}
                </h4>
              </div>
              <p style={{ opacity: 0.9, fontSize: '0.9rem', marginBottom: '16px' }}>
                For acute chest pain, sudden breathlessness, or heart attack emergency:
              </p>
              <a
                href={`tel:${profile.emergencyPhone}`}
                className="btn btn-secondary btn-lg"
                style={{ width: '100%', color: '#dc2626', fontWeight: 800 }}
              >
                <Phone size={20} />
                <span>{profile.emergencyPhone || '+880 1999-887766'}</span>
              </a>
            </div>

            {/* Serial Phone Card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={20} />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {t('chamberHotlines')}
                </h4>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Serial booking & appointment confirmation desk:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href={`tel:${profile.serialPhone}`} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={15} /> {profile.serialPhone}
                </a>
                <a href={`tel:${profile.phone}`} style={{ color: 'var(--text-main)', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={15} /> {profile.phone}
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {t('emailDesk')}
                </h4>
              </div>
              <a href={`mailto:${profile.email}`} style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 600 }}>
                {profile.email}
              </a>
            </div>

            {/* Address */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {t('visitAddress')}
                </h4>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {getL(profile, 'address')}
              </p>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div style={{ marginTop: '30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span className="badge-tag">
              <HelpCircle size={13} /> Frequently Asked Questions
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              Common Patient Inquiries
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            <div className="card">
              <strong style={{ fontSize: '1rem', color: 'var(--text-heading)', display: 'block', marginBottom: '8px' }}>
                How can I bring previous ECG or Angiogram CDs?
              </strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Please bring all CD-ROMs, angiogram discs, previous ECG tracings, prescription slips, and recent lab blood reports during your consultation. Our chambers are equipped with high-resolution digital viewers to review your angiogram on the spot.
              </p>
            </div>

            <div className="card">
              <strong style={{ fontSize: '1rem', color: 'var(--text-heading)', display: 'block', marginBottom: '8px' }}>
                Can someone else book a serial on behalf of a patient?
              </strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Yes, family members or attendants can easily book online or call our serial booking hotline. Simply provide the patient's full name, age, and valid mobile number to receive the confirmation SMS.
              </p>
            </div>

            <div className="card">
              <strong style={{ fontSize: '1rem', color: 'var(--text-heading)', display: 'block', marginBottom: '8px' }}>
                Is consultation available for emergency hospital admission?
              </strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Prof. Dr. Aris Patel is available for acute coronary emergencies and primary PCI at Evercare Hospital and Square Hospital, Dhaka. Please notify the emergency department reception immediately upon arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
