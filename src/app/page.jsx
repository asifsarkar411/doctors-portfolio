'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolioData } from '@/context/PortfolioDataContext';
import AppointmentModal from '@/components/AppointmentModal';
import {
  Calendar,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  Users,
  Activity,
  Heart,
  ChevronRight,
  Stethoscope,
  CheckCircle2,
  Cpu,
  ShieldAlert,
  HeartPulse,
  Zap,
  ArrowRight,
  Eye,
  X
} from 'lucide-react';

export default function HomePage() {
  const { t, getL, toDigits } = useLanguage();
  const { data } = usePortfolioData();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedChamberForBooking, setSelectedChamberForBooking] = useState(null);
  const [activeGalleryCat, setActiveGalleryCat] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [activePostModal, setActivePostModal] = useState(null);

  const profile = data?.profile || {};
  const services = data?.services || [];
  const chambers = data?.chambers || [];
  const schedules = data?.schedules || [];
  const gallery = data?.gallery || [];
  const posts = data?.posts || [];

  const handleBookChamber = (chamber) => {
    setSelectedChamberForBooking(chamber);
    setIsBookingOpen(true);
  };

  // Icon mapping helper
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Activity': return <Activity size={24} />;
      case 'Cpu': return <Cpu size={24} />;
      case 'ShieldAlert': return <ShieldAlert size={24} />;
      case 'HeartPulse': return <HeartPulse size={24} />;
      case 'Zap': return <Zap size={24} />;
      case 'Award': return <Award size={24} />;
      default: return <Stethoscope size={24} />;
    }
  };

  const filteredGallery = activeGalleryCat === 'All'
    ? gallery
    : gallery.filter(item => item.category === activeGalleryCat);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        background: 'linear-gradient(180deg, var(--bg-surface-alt) 0%, var(--bg-page) 100%)',
        paddingTop: '60px',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '50px',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <div>
              {/* Doctor Status Badge */}
              <div className="status-indicator" style={{ marginBottom: '18px' }}>
                <span className="pulse-dot" />
                <span>{t('availableToday')}</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 800,
                color: 'var(--text-heading)',
                lineHeight: 1.18,
                letterSpacing: '-0.025em',
                marginBottom: '14px'
              }}>
                {getL(profile, 'name') || 'Prof. Dr. Aris Patel'}
              </h1>

              <div style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--primary)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={20} />
                <span>{getL(profile, 'designation')}</span>
              </div>

              <div style={{
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
                marginBottom: '20px',
                fontWeight: 500,
                lineHeight: 1.5
              }}>
                {getL(profile, 'degrees')}
                <span style={{ display: 'inline-block', marginLeft: '10px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 700 }}>
                  {t('bmdcRegNo')} {profile.bmdcReg}
                </span>
              </div>

              <p style={{
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'var(--text-main)',
                marginBottom: '30px',
                maxWidth: '600px'
              }}>
                {getL(profile, 'heroHeadline')} — {getL(profile, 'shortBio')}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="btn btn-primary btn-lg"
                >
                  <Calendar size={20} />
                  <span>{t('bookAppointment')}</span>
                </button>

                <a
                  href={`tel:${profile.serialPhone || '+8801811334455'}`}
                  className="btn btn-secondary btn-lg"
                >
                  <Phone size={20} />
                  <span>{t('callChamber')}</span>
                </a>
              </div>

              {/* 4 Key Counters */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '16px',
                paddingTop: '24px',
                borderTop: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {toDigits(profile.experienceYears || 16)}+
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {t('yearsExperience')}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {toDigits(profile.happyPatients || '15,000+')}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {t('happyPatients')}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {toDigits(profile.proceduresDone || '6,800+')}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {t('successfulProcedures')}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {toDigits(profile.awardsCount || '25+')}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {t('awardsRecognitions')}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Photo Column */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '430px',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '4px solid var(--bg-surface)'
              }}>
                {/* Image */}
                <img
                  src={profile.photo || '/images/doctor.jpg'}
                  alt={profile.name}
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />

                {/* Floating Bottom Card */}
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#0f172a'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Award size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', display: 'block', color: '#090e17' }}>
                      Fellow of American College of Cardiology
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      FACC (USA) & MRCP (London, UK)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "WHAT HE DOES" / SERVICES SECTION */}
      <section id="services" className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="badge-tag">
              <Stethoscope size={13} /> {t('servicesHeading')}
            </span>
            <h2 className="section-title">
              {t('servicesHeading')}
            </h2>
            <p className="section-desc">
              {t('servicesSubheading')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {services.map((service) => (
              <div
                key={service.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '18px'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(var(--primary-rgb), 0.1)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getIcon(service.icon)}
                    </div>
                    {service.badge && (
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(var(--accent-rgb), 0.12)',
                        color: 'var(--accent)'
                      }}>
                        {getL(service, 'badge')}
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--text-heading)',
                    marginBottom: '10px',
                    lineHeight: 1.3
                  }}>
                    {getL(service, 'title')}
                  </h3>

                  <p style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                    marginBottom: '18px'
                  }}>
                    {getL(service, 'shortDesc')}
                  </p>

                  {/* Feature bullet points */}
                  {service.features && (
                    <ul style={{
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginBottom: '20px'
                    }}>
                      {(getL(service, 'features') || service.features).map((feat, idx) => (
                        <li key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem',
                          color: 'var(--text-main)'
                        }}>
                          <CheckCircle2 size={15} color="var(--accent)" style={{ flexShrink: 0 }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {getL(service, 'category')}
                  </span>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <span>{t('consultNow')}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HIS WORKS & CLINICAL EXCELLENCE */}
      <section style={{
        background: 'var(--bg-surface-alt)',
        paddingTop: '70px',
        paddingBottom: '70px',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            <div>
              <span className="badge-tag">
                <Award size={13} /> {t('experienceStory')}
              </span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '16px', lineHeight: 1.25 }}>
                Pioneering Painless Trans-Radial Angioplasty & Emergency Cardiac Care
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px', fontSize: '1rem' }}>
                {getL(profile, 'shortBio')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '25px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-heading)', display: 'block', fontSize: '0.95rem' }}>Wrist Artery (Radial) Access</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Over 95% of procedures performed via wrist with same-day mobility and minimal pain.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-heading)', display: 'block', fontSize: '0.95rem' }}>Golden Hour Primary Angioplasty</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Emergency door-to-balloon PCI within 60 minutes for acute myocardial infarction.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-heading)', display: 'block', fontSize: '0.95rem' }}>Complex Stenting & Bifurcation PCI</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Utilizing IVUS and OCT intravascular imaging for optimal long-term vessel patency.</span>
                  </div>
                </div>
              </div>

              <NextLink href="/about" className="btn btn-primary">
                <span>{t('navAbout')}</span>
                <ChevronRight size={17} />
              </NextLink>
            </div>

            {/* Works Illustration / Image */}
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)'
            }}>
              <img
                src="/images/conference.jpg"
                alt="Cardiology Keynote"
                style={{ width: '100%', height: '360px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px', background: 'var(--bg-card)' }}>
                <strong style={{ display: 'block', color: 'var(--text-heading)', fontSize: '1rem', marginBottom: '6px' }}>
                  Global Research & Clinical Presentations
                </strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Invited faculty and researcher at international cardiovascular societies across Europe, America, and Asia.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHAMBERS & VISITING LOCATIONS */}
      <section id="chambers" className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="badge-tag">
              <MapPin size={13} /> {t('chambersHeading')}
            </span>
            <h2 className="section-title">
              {t('chambersHeading')}
            </h2>
            <p className="section-desc">
              {t('chambersSubheading')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {chambers.map((chamber) => (
              <div
                key={chamber.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  padding: 0
                }}
              >
                {/* Chamber Image */}
                <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={chamber.image || '/images/chamber1.jpg'}
                    alt={chamber.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(15, 23, 42, 0.85)',
                    color: '#38bdf8',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {chamber.consultationFee}
                  </div>
                </div>

                {/* Chamber Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>
                      {getL(chamber, 'name')}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '14px' }}>
                      <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{getL(chamber, 'address')}</span>
                    </div>

                    <div style={{
                      background: 'var(--bg-surface-alt)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginBottom: '18px',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('visitingDays')}:</span>
                        <strong>{getL(chamber, 'visitingDays')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('visitingHours')}:</span>
                        <strong>{getL(chamber, 'visitingHours')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('chamberRoom')}:</span>
                        <span>{getL(chamber, 'room')}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleBookChamber(chamber)}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '10px 14px', fontSize: '0.9rem' }}
                    >
                      <Calendar size={16} />
                      <span>{t('bookThisChamber')}</span>
                    </button>
                    <a
                      href={`tel:${chamber.serialPhone}`}
                      className="btn btn-secondary"
                      style={{ padding: '10px 14px' }}
                      title="Call Chamber"
                    >
                      <Phone size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <NextLink href="/chambers" className="btn btn-secondary">
              <span>{t('viewAllServices')}</span>
              <ChevronRight size={16} />
            </NextLink>
          </div>
        </div>
      </section>

      {/* 5. TIME SCHEDULE PREVIEW */}
      <section id="schedule" style={{ background: 'var(--bg-surface-alt)', paddingTop: '70px', paddingBottom: '70px' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge-tag">
              <Clock size={13} /> {t('scheduleHeading')}
            </span>
            <h2 className="section-title">
              {t('scheduleHeading')}
            </h2>
            <p className="section-desc">
              {t('scheduleSubheading')}
            </p>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ background: 'rgba(var(--primary-rgb), 0.08)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>{t('dayOfWeek')}</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>{t('chamberName')}</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>{t('timeSlot')}</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>{t('slotStatus')}</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', textAlign: 'right' }}>{t('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.slice(0, 5).map((sch) => (
                    <tr key={sch.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--text-heading)' }}>
                        {getL(sch, 'day')}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        {getL(sch, 'chamberName')}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {getL(sch, 'time')}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge-status ${sch.status === 'Available' ? 'confirmed' : 'pending'}`}>
                          {getL(sch, 'status')}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => setIsBookingOpen(true)}
                          className="btn btn-primary btn-sm"
                        >
                          <Calendar size={14} />
                          <span>{t('bookSlot')}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '16px 20px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
              <NextLink href="/schedule" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span>{t('viewSchedule')}</span>
                <ChevronRight size={16} />
              </NextLink>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PHOTO GALLERY */}
      <section id="gallery" className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="badge-tag">
              <Eye size={13} /> {t('galleryHeading')}
            </span>
            <h2 className="section-title">
              {t('galleryHeading')}
            </h2>
            <p className="section-desc">
              {t('gallerySubheading')}
            </p>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
              {['All', 'Clinic', 'Conference', 'Procedures', 'Awards'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveGalleryCat(cat)}
                  className={`btn btn-sm ${activeGalleryCat === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  {cat === 'All' ? t('allCategories') : (t('cat' + cat) || cat)}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="card card-hover"
                onClick={() => setLightboxImg(item)}
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {getL(item, 'category')}
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px', marginBottom: '6px' }}>
                    {getL(item, 'title')}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="modal-backdrop" onClick={() => setLightboxImg(null)}>
          <div style={{ maxWidth: '850px', width: '100%', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImg(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                border: 'none',
                padding: '8px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>
            <img src={lightboxImg.image} alt={lightboxImg.title} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', background: '#000' }} />
            <div style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>
                {getL(lightboxImg, 'title')}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {lightboxImg.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. POST CARDS WITH PHOTOS / HEALTH BLOG */}
      <section id="posts" style={{ background: 'var(--bg-surface-alt)', paddingTop: '70px', paddingBottom: '70px' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge-tag">
              <Activity size={13} /> {t('postsHeading')}
            </span>
            <h2 className="section-title">
              {t('postsHeading')}
            </h2>
            <p className="section-desc">
              {t('postsSubheading')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {posts.map((post) => (
              <div
                key={post.id}
                className="card card-hover"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={post.image || '/images/doctor.jpg'}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {getL(post, 'category')}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {post.date} • {post.readTime}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.35, marginBottom: '12px' }}>
                      {getL(post, 'title')}
                    </h3>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                      {getL(post, 'excerpt')}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '0 24px 24px 24px' }}>
                  <button
                    onClick={() => setActivePostModal(post)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  >
                    <span>{t('readArticle')}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Post Details Modal */}
      {activePostModal && (
        <div className="modal-backdrop" onClick={() => setActivePostModal(null)}>
          <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge-tag" style={{ margin: 0 }}>
                {getL(activePostModal, 'category')}
              </span>
              <button onClick={() => setActivePostModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={22} color="var(--text-muted)" />
              </button>
            </div>
            <div style={{ padding: '28px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.3, marginBottom: '14px' }}>
                {getL(activePostModal, 'title')}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Published on {activePostModal.date} by {profile.name}
              </div>
              <div style={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'var(--text-main)',
                whiteSpace: 'pre-line'
              }}>
                {getL(activePostModal, 'content') || getL(activePostModal, 'excerpt')}
              </div>
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => { setActivePostModal(null); setIsBookingOpen(true); }}>
                  <Calendar size={16} />
                  <span>Book Appointment with Doctor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Booking Modal */}
      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedChamberForBooking(null);
        }}
        preselectedChamber={selectedChamberForBooking}
      />
    </div>
  );
}
