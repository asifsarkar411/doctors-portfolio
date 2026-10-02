'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { usePortfolioData } from '@/context/PortfolioDataContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Palette,
  User,
  Stethoscope,
  Building,
  Clock,
  Image as ImageIcon,
  FileText,
  Settings,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Database,
  Lock,
  Phone,
  Mail,
  Eye
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data, refreshData, updateSectionLocal } = usePortfolioData();
  const { customColors, updateCustomColors, themeMode, toggleThemeMode } = useTheme();
  const { lang, switchLanguage } = useLanguage();

  // Authentication check
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [saveStatus, setSaveStatus] = useState({ loading: false, msg: '', error: false });

  // Data states
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [aptFilter, setAptFilter] = useState('ALL');

  // Form states for editable sections
  const [profileForm, setProfileForm] = useState(null);
  const [themeForm, setThemeForm] = useState(null);
  const [servicesList, setServicesList] = useState([]);
  const [chambersList, setChambersList] = useState([]);
  const [schedulesList, setSchedulesList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [postsList, setPostsList] = useState([]);

  // Modal / Editing sub-states
  const [editingItem, setEditingItem] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  // Initial Auth & Data Load
  useEffect(() => {
    const token = localStorage.getItem('doctor_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setAuthenticated(true);
    loadAdminData();
  }, []);

  // Sync state when global data changes
  useEffect(() => {
    if (data) {
      if (data.profile) setProfileForm(JSON.parse(JSON.stringify(data.profile)));
      if (data.themeSettings) setThemeForm(JSON.parse(JSON.stringify(data.themeSettings)));
      if (data.services) setServicesList(JSON.parse(JSON.stringify(data.services)));
      if (data.chambers) setChambersList(JSON.parse(JSON.stringify(data.chambers)));
      if (data.schedules) setSchedulesList(JSON.parse(JSON.stringify(data.schedules)));
      if (data.gallery) setGalleryList(JSON.parse(JSON.stringify(data.gallery)));
      if (data.posts) setPostsList(JSON.parse(JSON.stringify(data.posts)));
    }
  }, [data]);

  const loadAdminData = async () => {
    try {
      const [aptRes, msgRes, statusRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/messages'),
        fetch('/api/admin/status')
      ]);
      const aptJson = await aptRes.json();
      const msgJson = await msgRes.json();
      const statusJson = await statusRes.json();

      if (aptJson.success) setAppointments(aptJson.appointments || []);
      if (msgJson.success) setMessages(msgJson.messages || []);
      if (statusJson.success) setDbStatus(statusJson.status);
    } catch (e) {
      console.warn('Error loading admin data:', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctor_admin_token');
    router.push('/admin/login');
  };

  // Section Save Helper
  const saveSection = async (sectionName, payload) => {
    setSaveStatus({ loading: true, msg: 'Saving changes...', error: false });
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: sectionName, data: payload })
      });
      const json = await res.json();
      if (json.success) {
        setSaveStatus({ loading: false, msg: 'Changes saved successfully!', error: false });
        updateSectionLocal(sectionName, payload);
        if (sectionName === 'themeSettings') {
          updateCustomColors(payload);
        }
        setTimeout(() => setSaveStatus({ loading: false, msg: '', error: false }), 3500);
      } else {
        setSaveStatus({ loading: false, msg: json.error || 'Failed to save', error: true });
      }
    } catch (err) {
      setSaveStatus({ loading: false, msg: err.message, error: true });
    }
  };

  // Appointment Status Updater
  const handleAptStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        setAppointments(prev => prev.map(a => (a.id === id || a._id === id) ? { ...a, status: newStatus } : a));
      }
    } catch (e) {
      alert('Error updating appointment status');
    }
  };

  // Appointment Delete
  const handleAptDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const res = await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setAppointments(prev => prev.filter(a => a.id !== id && a._id !== id));
      }
    } catch (e) {
      alert('Error deleting appointment');
    }
  };

  // Message Toggle Read
  const handleToggleMsgRead = async (id, currentRead) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: !currentRead })
      });
      const json = await res.json();
      if (json.success) {
        setMessages(prev => prev.map(m => (m.id === id || m._id === id) ? { ...m, read: !currentRead } : m));
      }
    } catch (e) {
      alert('Error updating message status');
    }
  };

  // Message Delete
  const handleMsgDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setMessages(prev => prev.filter(m => m.id !== id && m._id !== id));
      }
    } catch (e) {
      alert('Error deleting message');
    }
  };

  // Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }
    await saveSection('password', { newPassword });
    setNewPassword('');
    alert('Admin password updated successfully!');
  };

  // Reset to Defaults
  const handleResetData = async () => {
    if (!confirm('WARNING: This will reset all profile, services, chambers, and demo appointments to initial defaults. Continue?')) return;
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        alert('All portfolio content reset to defaults!');
        window.location.reload();
      }
    } catch (e) {
      alert('Error resetting data');
    }
  };

  if (!authenticated) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading Admin Portal...</div>;
  }

  const unreadMessagesCount = messages.filter(m => !m.read).length;
  const pendingAptsCount = appointments.filter(a => a.status === 'Pending').length;

  const filteredAppointments = aptFilter === 'ALL'
    ? appointments
    : appointments.filter(a => a.status.toLowerCase() === aptFilter.toLowerCase());

  // Preset Color Palettes for Doctor Theme
  const themePresets = [
    { name: 'Clinical Sky (Default)', primary: '#0284c7', accent: '#059669' },
    { name: 'Deep Hospital Blue', primary: '#2563eb', accent: '#0284c7' },
    { name: 'Emerald Healing', primary: '#059669', accent: '#0284c7' },
    { name: 'Medical Teal Care', primary: '#0d9488', accent: '#059669' },
    { name: 'Royal Amethyst', primary: '#7c3aed', accent: '#06b6d4' },
    { name: 'Cardiac Crimson', primary: '#e11d48', accent: '#f59e0b' }
  ];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Navigation Header */}
      <div style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Stethoscope size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.1 }}>
              Doctor Portfolio CMS
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Full Frontend Customizer & Patient Management
            </span>
          </div>
        </div>

        {/* Global Save Indicator & Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {saveStatus.msg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: saveStatus.error ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: saveStatus.error ? '#ef4444' : '#10b981'
            }}>
              {saveStatus.error ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
              <span>{saveStatus.msg}</span>
            </div>
          )}

          <NextLink href="/" target="_blank" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <Eye size={15} />
            <span>View Live Site</span>
            <ExternalLink size={12} />
          </NextLink>

          <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ gap: '6px' }}>
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Admin Dashboard Body with Tab Navigation */}
      <div className="container" style={{ paddingTop: '28px', paddingBottom: '60px', flex: 1 }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          borderBottom: '2px solid var(--border-color)',
          marginBottom: '28px'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
            { id: 'appointments', label: `Appointments (${pendingAptsCount} New)`, icon: <Calendar size={17} />, badge: pendingAptsCount },
            { id: 'messages', label: `Messages (${unreadMessagesCount})`, icon: <MessageSquare size={17} />, badge: unreadMessagesCount },
            { id: 'theme', label: 'Theme & Colors', icon: <Palette size={17} /> },
            { id: 'profile', label: 'Doctor Profile', icon: <User size={17} /> },
            { id: 'services', label: 'Specialties / Services', icon: <Stethoscope size={17} /> },
            { id: 'chambers', label: 'Chambers', icon: <Building size={17} /> },
            { id: 'schedules', label: 'Time Schedules', icon: <Clock size={17} /> },
            { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={17} /> },
            { id: 'posts', label: 'Health Posts', icon: <FileText size={17} /> },
            { id: 'settings', label: 'Database & Settings', icon: <Settings size={17} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.92rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)',
                background: activeTab === tab.id ? 'var(--primary)' : 'var(--bg-surface)',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-main)',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(var(--primary-rgb), 0.3)' : 'var(--shadow-sm)'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div>
            {/* Stat Counters Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div className="card" onClick={() => setActiveTab('appointments')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Appointments</span>
                  <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--primary)' }}>
                    <Calendar size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {appointments.length}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
                  {pendingAptsCount} pending confirmation
                </span>
              </div>

              <div className="card" onClick={() => setActiveTab('messages')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Inquiry Messages</span>
                  <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <MessageSquare size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {messages.length}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                  {unreadMessagesCount} unread messages
                </span>
              </div>

              <div className="card" onClick={() => setActiveTab('chambers')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Chambers</span>
                  <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
                    <Building size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {chambersList.length}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Dhaka visiting locations
                </span>
              </div>

              <div className="card" onClick={() => setActiveTab('services')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Specialties & Services</span>
                  <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                    <Stethoscope size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {servicesList.length}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Clinical cardiac procedures
                </span>
              </div>
            </div>

            {/* DB Status Banner */}
            <div className="card" style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: dbStatus?.connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(2, 132, 199, 0.15)',
                color: dbStatus?.connected ? '#10b981' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Database size={24} />
              </div>
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-heading)' }}>
                    Database Architecture: {dbStatus?.type === 'mongodb_atlas' ? 'MongoDB Atlas Cluster Connected' : 'Persistent Storage Mode'}
                  </strong>
                  <span className={`badge-status ${dbStatus?.connected ? 'confirmed' : 'pending'}`}>
                    {dbStatus?.connected ? 'Atlas Online' : 'Active'}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {dbStatus?.message || 'Ready for production deployment on Vercel with MongoDB Atlas.'}
                </p>
              </div>
              <button onClick={() => setActiveTab('settings')} className="btn btn-secondary btn-sm">
                Configure Atlas URI
              </button>
            </div>

            {/* Recent Appointments Preview */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Latest Patient Bookings
                </h3>
                <button onClick={() => setActiveTab('appointments')} className="btn btn-secondary btn-sm">
                  View All ({appointments.length})
                </button>
              </div>

              {appointments.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No appointments yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px' }}>Serial No</th>
                        <th style={{ padding: '10px' }}>Patient</th>
                        <th style={{ padding: '10px' }}>Phone</th>
                        <th style={{ padding: '10px' }}>Chamber</th>
                        <th style={{ padding: '10px' }}>Date</th>
                        <th style={{ padding: '10px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map(apt => (
                        <tr key={apt.id || apt._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                          <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--primary)' }}>{apt.serialNumber}</td>
                          <td style={{ padding: '12px 10px', fontWeight: 600 }}>{apt.patientName}</td>
                          <td style={{ padding: '12px 10px' }}>{apt.patientPhone}</td>
                          <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>{apt.chamberName}</td>
                          <td style={{ padding: '12px 10px' }}>{apt.appointmentDate || 'Upcoming'} ({apt.slot})</td>
                          <td style={{ padding: '12px 10px' }}>
                            <span className={`badge-status ${apt.status.toLowerCase()}`}>
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: APPOINTMENTS MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'appointments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Patient Appointments
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Manage patient appointment requests received from the online booking form.
                </p>
              </div>

              {/* Status Filters */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {['ALL', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setAptFilter(st)}
                    className={`btn btn-sm ${aptFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '14px 16px' }}>Serial</th>
                      <th style={{ padding: '14px 16px' }}>Patient Info</th>
                      <th style={{ padding: '14px 16px' }}>Contact</th>
                      <th style={{ padding: '14px 16px' }}>Chamber & Schedule</th>
                      <th style={{ padding: '14px 16px' }}>Symptoms / Notes</th>
                      <th style={{ padding: '14px 16px' }}>Status</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No appointments found for filter: {aptFilter}
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map(apt => (
                        <tr key={apt.id || apt._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 800, color: 'var(--primary)' }}>
                            {apt.serialNumber}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <strong style={{ display: 'block', color: 'var(--text-heading)' }}>{apt.patientName}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Age: {apt.patientAge || 'N/A'}, {apt.gender} ({apt.type})
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <a href={`tel:${apt.patientPhone}`} style={{ color: 'var(--primary)', fontWeight: 600, display: 'block' }}>
                              {apt.patientPhone}
                            </a>
                            {apt.patientEmail && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.patientEmail}</span>}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <strong style={{ display: 'block', color: 'var(--text-heading)' }}>{apt.chamberName}</strong>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              {apt.appointmentDate} @ {apt.slot}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', maxWidth: '240px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                            {apt.symptoms || 'General Checkup'}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <select
                              value={apt.status}
                              onChange={(e) => handleAptStatusChange(apt.id || apt._id, e.target.value)}
                              className="form-select"
                              style={{ padding: '4px 8px', fontSize: '0.82rem', fontWeight: 700 }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleAptDelete(apt.id || apt._id)}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '6px' }}
                              title="Delete Appointment"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CONTACT MESSAGES */}
        {/* ============================================================== */}
        {activeTab === 'messages' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Patient Inquiries & Messages
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Messages submitted by patients through the Contact Us page.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No messages received yet.
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id || msg._id}
                    className="card"
                    style={{
                      borderLeft: msg.read ? '4px solid var(--border-color)' : '4px solid var(--primary)',
                      background: msg.read ? 'var(--bg-card)' : 'var(--bg-surface-alt)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-heading)' }}>{msg.name}</strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '12px' }}>
                          {msg.email} • {msg.phone}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          onClick={() => handleToggleMsgRead(msg.id || msg._id, msg.read)}
                          className="btn btn-secondary btn-sm"
                        >
                          {msg.read ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Doctor Consultation')}`}
                          className="btn btn-primary btn-sm"
                        >
                          <Mail size={14} />
                          <span>Reply via Email</span>
                        </a>
                        <button
                          onClick={() => handleMsgDelete(msg.id || msg._id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '6px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {msg.subject && (
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '8px' }}>
                        Subject: {msg.subject}
                      </div>
                    )}

                    <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {msg.message}
                    </p>

                    <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Received: {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: THEME & COLOR CUSTOMIZER */}
        {/* ============================================================== */}
        {activeTab === 'theme' && themeForm && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Theme & Frontend Styling Customizer
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Change primary colors, accent colors, preset themes, and emergency banners. Changes update dynamically across the entire website!
              </p>
            </div>

            {/* Presets */}
            <div className="card" style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-heading)' }}>
                Curated Doctor Color Presets
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                {themePresets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setThemeForm(prev => ({ ...prev, primaryColor: preset.primary, accentColor: preset.accent }));
                      updateCustomColors({ primary: preset.primary, accent: preset.accent });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-alt)',
                      border: themeForm.primaryColor === preset.primary ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: preset.primary, display: 'inline-block' }} />
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: preset.accent, display: 'inline-block' }} />
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-heading)' }}>
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Pickers Form */}
            <div className="card" style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-heading)' }}>
                Custom Color Settings
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Primary Brand Color (Buttons, Badges, Links)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="color"
                      value={themeForm.primaryColor || '#0284c7'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setThemeForm(prev => ({ ...prev, primaryColor: val }));
                        updateCustomColors({ primary: val });
                      }}
                      style={{ width: '50px', height: '44px', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={themeForm.primaryColor || '#0284c7'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setThemeForm(prev => ({ ...prev, primaryColor: val }));
                        updateCustomColors({ primary: val });
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Accent Color (Highlights, Success Indicators)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="color"
                      value={themeForm.accentColor || '#059669'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setThemeForm(prev => ({ ...prev, accentColor: val }));
                        updateCustomColors({ accent: val });
                      }}
                      style={{ width: '50px', height: '44px', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={themeForm.accentColor || '#059669'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setThemeForm(prev => ({ ...prev, accentColor: val }));
                        updateCustomColors({ accent: val });
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Default Theme Mode</label>
                  <select
                    className="form-select"
                    value={themeForm.defaultTheme || 'light'}
                    onChange={(e) => setThemeForm({ ...themeForm, defaultTheme: e.target.value })}
                  >
                    <option value="light">Light Mode (Clean Hospital White)</option>
                    <option value="dark">Dark Mode (Sleek Deep Medical Navy)</option>
                  </select>
                </div>
              </div>

              {/* Emergency Banner Notice */}
              <div style={{ marginTop: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Emergency Helpline Notice (English)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={themeForm.bannerNotice || ''}
                    onChange={(e) => setThemeForm({ ...themeForm, bannerNotice: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Helpline Notice (বাংলা)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={themeForm.bannerNoticeBn || ''}
                    onChange={(e) => setThemeForm({ ...themeForm, bannerNoticeBn: e.target.value })}
                  />
                </div>
              </div>

              <button
                onClick={() => saveSection('themeSettings', themeForm)}
                className="btn btn-primary"
                style={{ marginTop: '14px' }}
              >
                <Save size={18} />
                <span>Save Theme Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: DOCTOR PROFILE & BIO */}
        {/* ============================================================== */}
        {activeTab === 'profile' && profileForm && (
          <div>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Doctor's Profile & Credentials
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Update doctor's photo, qualifications, headline, and biographies (Supports both English and Bangla).
                </p>
              </div>
              <button
                onClick={() => saveSection('profile', profileForm)}
                className="btn btn-primary"
              >
                <Save size={18} />
                <span>Save Profile</span>
              </button>
            </div>

            <div className="card" style={{ marginBottom: '30px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Doctor Name (English) *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.name || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Doctor Name (বাংলা) *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.nameBn || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, nameBn: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Designation / Specialty (English)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.designation || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, designation: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Designation / Specialty (বাংলা)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.designationBn || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, designationBn: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Degrees & Qualifications (English)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.degrees || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, degrees: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Degrees & Qualifications (বাংলা)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.degreesBn || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, degreesBn: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">BMDC Registration No.</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.bmdcReg || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, bmdcReg: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Doctor Profile Photo URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.photo || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, photo: e.target.value })}
                    placeholder="/images/doctor.jpg or https://..."
                  />
                </div>
              </div>

              {/* Counters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Years Experience</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profileForm.experienceYears || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Happy Patients</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.happyPatients || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, happyPatients: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Procedures Done</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.proceduresDone || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, proceduresDone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Awards Count</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.awardsCount || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, awardsCount: e.target.value })}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Serial Booking Hotline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.serialPhone || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, serialPhone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency 24/7 Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.emergencyPhone || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, emergencyPhone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Official Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profileForm.email || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Visiting Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.address || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  />
                </div>
              </div>

              {/* Biographies */}
              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label">Hero Headline (English)</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.heroHeadline || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, heroHeadline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hero Headline (বাংলা)</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.heroHeadlineBn || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, heroHeadlineBn: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Bio (English)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={profileForm.shortBio || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, shortBio: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Bio (বাংলা)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={profileForm.shortBioBn || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, shortBioBn: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Comprehensive Full Bio (English)</label>
                <textarea
                  className="form-textarea"
                  rows={6}
                  value={profileForm.fullBio || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, fullBio: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Comprehensive Full Bio (বাংলা)</label>
                <textarea
                  className="form-textarea"
                  rows={6}
                  value={profileForm.fullBioBn || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, fullBioBn: e.target.value })}
                />
              </div>

              <button
                onClick={() => saveSection('profile', profileForm)}
                className="btn btn-primary btn-lg"
                style={{ marginTop: '10px' }}
              >
                <Save size={18} />
                <span>Save All Profile Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: SERVICES / WHAT HE DOES */}
        {/* ============================================================== */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Specialties & Clinical Services
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Manage the procedures, treatments, and clinical specialties shown in "What He Does".
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    const newSrv = {
                      id: 'srv-' + Date.now(),
                      title: 'New Cardiac Specialty',
                      titleBn: 'নতুন হৃদরোগ চিকিৎসা',
                      category: 'Clinical Care',
                      categoryBn: 'ক্লিনিক্যাল কেয়ার',
                      icon: 'Activity',
                      shortDesc: 'Description of specialized cardiac treatment...',
                      shortDescBn: 'চিকিৎসার বিবরণ লিখুন...',
                      badge: 'Specialized',
                      badgeBn: 'বিশেষ সেবা',
                      features: ['Key procedure detail 1', 'Key procedure detail 2']
                    };
                    const updated = [newSrv, ...servicesList];
                    setServicesList(updated);
                    saveSection('services', updated);
                  }}
                  className="btn btn-primary"
                >
                  <Plus size={18} />
                  <span>Add Specialty</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {servicesList.map((srv, idx) => (
                <div key={srv.id} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <span className="badge-tag">Service #{idx + 1}</span>
                    <button
                      onClick={() => {
                        const updated = servicesList.filter(s => s.id !== srv.id);
                        setServicesList(updated);
                        saveSection('services', updated);
                      }}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={15} />
                      <span>Delete</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Service Title (English)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={srv.title}
                        onChange={(e) => {
                          const updated = [...servicesList];
                          updated[idx].title = e.target.value;
                          setServicesList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Service Title (বাংলা)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={srv.titleBn || ''}
                        onChange={(e) => {
                          const updated = [...servicesList];
                          updated[idx].titleBn = e.target.value;
                          setServicesList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-input"
                        value={srv.category}
                        onChange={(e) => {
                          const updated = [...servicesList];
                          updated[idx].category = e.target.value;
                          setServicesList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Badge Tag (e.g. Signature Care)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={srv.badge || ''}
                        onChange={(e) => {
                          const updated = [...servicesList];
                          updated[idx].badge = e.target.value;
                          setServicesList(updated);
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Description (English)</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={srv.shortDesc}
                      onChange={(e) => {
                        const updated = [...servicesList];
                        updated[idx].shortDesc = e.target.value;
                        setServicesList(updated);
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Description (বাংলা)</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={srv.shortDescBn || ''}
                      onChange={(e) => {
                        const updated = [...servicesList];
                        updated[idx].shortDescBn = e.target.value;
                        setServicesList(updated);
                      }}
                    />
                  </div>

                  <button
                    onClick={() => saveSection('services', servicesList)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Save size={15} />
                    <span>Save Service #{idx + 1}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: CHAMBERS */}
        {/* ============================================================== */}
        {activeTab === 'chambers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Hospital Chambers
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Manage hospital chambers, visiting times, fees, room numbers, and serial hotlines.
                </p>
              </div>
              <button
                onClick={() => {
                  const newCh = {
                    id: 'ch-' + Date.now(),
                    name: 'New Hospital Chamber',
                    nameBn: 'নতুন হাসপাতাল চেম্বার',
                    room: 'Room #101, 1st Floor',
                    roomBn: 'রুম #১০১, ১ম তলা',
                    address: 'Dhaka, Bangladesh',
                    addressBn: 'ঢাকা, বাংলাদেশ',
                    visitingDays: 'Saturday to Thursday',
                    visitingDaysBn: 'শনিবার হতে বৃহস্পতিবার',
                    visitingHours: '6:00 PM - 9:00 PM',
                    visitingHoursBn: 'সন্ধ্যা ৬:০০ - রাত ৯:০০',
                    consultationFee: '৳ 1,500',
                    reportReviewFee: '৳ 800',
                    serialPhone: '+880 1711-002233',
                    image: '/images/chamber1.jpg',
                    facilities: ['ECG on site', 'Air Conditioned', 'Pharmacy']
                  };
                  const updated = [...chambersList, newCh];
                  setChambersList(updated);
                  saveSection('chambers', updated);
                }}
                className="btn btn-primary"
              >
                <Plus size={18} />
                <span>Add Chamber</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {chambersList.map((ch, idx) => (
                <div key={ch.id} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="badge-tag">Chamber #{idx + 1}</span>
                    <button
                      onClick={() => {
                        const updated = chambersList.filter(c => c.id !== ch.id);
                        setChambersList(updated);
                        saveSection('chambers', updated);
                      }}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={15} />
                      <span>Delete</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Hospital Name (English)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ch.name}
                        onChange={(e) => {
                          const updated = [...chambersList];
                          updated[idx].name = e.target.value;
                          setChambersList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Hospital Name (বাংলা)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ch.nameBn || ''}
                        onChange={(e) => {
                          const updated = [...chambersList];
                          updated[idx].nameBn = e.target.value;
                          setChambersList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Room / Floor (English)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ch.room}
                        onChange={(e) => {
                          const updated = [...chambersList];
                          updated[idx].room = e.target.value;
                          setChambersList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Address (English)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ch.address}
                        onChange={(e) => {
                          const updated = [...chambersList];
                          updated[idx].address = e.target.value;
                          setChambersList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Visiting Days (English)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ch.visitingDays}
                        onChange={(e) => {
                          const updated = [...chambersList];
                          updated[idx].visitingDays = e.target.value;
                          setChambersList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Visiting Hours (English)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ch.visitingHours}
                        onChange={(e) => {
                          const updated = [...chambersList];
                          updated[idx].visitingHours = e.target.value;
                          setChambersList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Consultation Fee</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ch.consultationFee}
                        onChange={(e) => {
                          const updated = [...chambersList];
                          updated[idx].consultationFee = e.target.value;
                          setChambersList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Serial Phone Number</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ch.serialPhone}
                        onChange={(e) => {
                          const updated = [...chambersList];
                          updated[idx].serialPhone = e.target.value;
                          setChambersList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Google Maps Embed URL</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ch.mapEmbedUrl || ''}
                        onChange={(e) => {
                          const updated = [...chambersList];
                          updated[idx].mapEmbedUrl = e.target.value;
                          setChambersList(updated);
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => saveSection('chambers', chambersList)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Save size={15} />
                    <span>Save Chamber #{idx + 1}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: TIME SCHEDULES */}
        {/* ============================================================== */}
        {activeTab === 'schedules' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Time Schedules & Timetable
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Manage the consultation timetable days, times, and slot availability.
                </p>
              </div>
              <button
                onClick={() => {
                  const newSch = {
                    id: 'sch-' + Date.now(),
                    day: 'Saturday',
                    dayBn: 'শনিবার',
                    chamberName: chambersList[0]?.name || 'Evercare Hospital',
                    time: '5:00 PM - 9:00 PM',
                    timeBn: 'বিকেল ৫:০০ - রাত ৯:০০',
                    status: 'Available',
                    statusBn: 'বুকিং চলছে'
                  };
                  const updated = [...schedulesList, newSch];
                  setSchedulesList(updated);
                  saveSection('schedules', updated);
                }}
                className="btn btn-primary"
              >
                <Plus size={18} />
                <span>Add Time Slot</span>
              </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '14px 16px' }}>Day</th>
                      <th style={{ padding: '14px 16px' }}>Chamber</th>
                      <th style={{ padding: '14px 16px' }}>Time</th>
                      <th style={{ padding: '14px 16px' }}>Status</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedulesList.map((sch, idx) => (
                      <tr key={sch.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <input
                            type="text"
                            className="form-input"
                            value={sch.day}
                            onChange={(e) => {
                              const updated = [...schedulesList];
                              updated[idx].day = e.target.value;
                              setSchedulesList(updated);
                            }}
                            style={{ maxWidth: '140px' }}
                          />
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <input
                            type="text"
                            className="form-input"
                            value={sch.chamberName}
                            onChange={(e) => {
                              const updated = [...schedulesList];
                              updated[idx].chamberName = e.target.value;
                              setSchedulesList(updated);
                            }}
                          />
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <input
                            type="text"
                            className="form-input"
                            value={sch.time}
                            onChange={(e) => {
                              const updated = [...schedulesList];
                              updated[idx].time = e.target.value;
                              setSchedulesList(updated);
                            }}
                            style={{ maxWidth: '180px' }}
                          />
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <select
                            className="form-select"
                            value={sch.status}
                            onChange={(e) => {
                              const updated = [...schedulesList];
                              updated[idx].status = e.target.value;
                              setSchedulesList(updated);
                            }}
                            style={{ maxWidth: '140px' }}
                          >
                            <option value="Available">Available</option>
                            <option value="Almost Full">Almost Full</option>
                            <option value="Slot Full">Slot Full</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              const updated = schedulesList.filter(s => s.id !== sch.id);
                              setSchedulesList(updated);
                              saveSection('schedules', updated);
                            }}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '6px' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={() => saveSection('schedules', schedulesList)}
              className="btn btn-primary"
              style={{ marginTop: '20px' }}
            >
              <Save size={18} />
              <span>Save Schedule Timetable</span>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 9: GALLERY & BLOG POSTS */}
        {/* ============================================================== */}
        {activeTab === 'gallery' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Gallery Items
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Manage photos of chambers, medical conferences, and awards.
                </p>
              </div>
              <button
                onClick={() => {
                  const newGal = {
                    id: 'gal-' + Date.now(),
                    title: 'New Gallery Photo',
                    titleBn: 'নতুন ছবি',
                    category: 'Clinic',
                    image: '/images/chamber1.jpg',
                    caption: 'Modern healthcare facility.'
                  };
                  const updated = [...galleryList, newGal];
                  setGalleryList(updated);
                  saveSection('gallery', updated);
                }}
                className="btn btn-primary"
              >
                <Plus size={18} />
                <span>Add Photo</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {galleryList.map((item, idx) => (
                <div key={item.id} className="card" style={{ padding: '16px' }}>
                  <img src={item.image} alt={item.title} style={{ height: '140px', width: '100%', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Photo Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...galleryList];
                        updated[idx].title = e.target.value;
                        setGalleryList(updated);
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Image URL</label>
                    <input
                      type="text"
                      className="form-input"
                      value={item.image}
                      onChange={(e) => {
                        const updated = [...galleryList];
                        updated[idx].image = e.target.value;
                        setGalleryList(updated);
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Category</label>
                    <select
                      className="form-select"
                      value={item.category}
                      onChange={(e) => {
                        const updated = [...galleryList];
                        updated[idx].category = e.target.value;
                        setGalleryList(updated);
                      }}
                    >
                      <option value="Clinic">Clinic</option>
                      <option value="Conference">Conference</option>
                      <option value="Procedures">Procedures</option>
                      <option value="Awards">Awards</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      const updated = galleryList.filter(g => g.id !== item.id);
                      setGalleryList(updated);
                      saveSection('gallery', updated);
                    }}
                    className="btn btn-danger btn-sm"
                    style={{ width: '100%' }}
                  >
                    <Trash2 size={14} />
                    <span>Delete Photo</span>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => saveSection('gallery', galleryList)}
              className="btn btn-primary"
              style={{ marginTop: '24px' }}
            >
              <Save size={18} />
              <span>Save All Gallery Changes</span>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 10: HEALTH POSTS / BLOG */}
        {/* ============================================================== */}
        {activeTab === 'posts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Health Articles & Posts
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Publish cardiology advice, awareness tips, and medical updates.
                </p>
              </div>
              <button
                onClick={() => {
                  const newPost = {
                    id: 'post-' + Date.now(),
                    title: 'New Cardiac Awareness Article',
                    titleBn: 'নতুন হৃদরোগ সচেতনতামূলক নিবন্ধ',
                    category: 'Heart Health',
                    date: 'Oct 2, 2026',
                    readTime: '4 min read',
                    image: '/images/doctor.jpg',
                    excerpt: 'Essential tips for keeping your cardiovascular system resilient...',
                    excerptBn: 'হৃদপিণ্ড সুস্থ রাখার প্রয়োজনীয় পরামর্শ...',
                    content: 'Detailed article content here...'
                  };
                  const updated = [newPost, ...postsList];
                  setPostsList(updated);
                  saveSection('posts', updated);
                }}
                className="btn btn-primary"
              >
                <Plus size={18} />
                <span>Write New Article</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {postsList.map((post, idx) => (
                <div key={post.id} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="badge-tag">Post #{idx + 1}</span>
                    <button
                      onClick={() => {
                        const updated = postsList.filter(p => p.id !== post.id);
                        setPostsList(updated);
                        saveSection('posts', updated);
                      }}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={15} />
                      <span>Delete Post</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Article Title (English)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={post.title}
                        onChange={(e) => {
                          const updated = [...postsList];
                          updated[idx].title = e.target.value;
                          setPostsList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Article Title (বাংলা)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={post.titleBn || ''}
                        onChange={(e) => {
                          const updated = [...postsList];
                          updated[idx].titleBn = e.target.value;
                          setPostsList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-input"
                        value={post.category}
                        onChange={(e) => {
                          const updated = [...postsList];
                          updated[idx].category = e.target.value;
                          setPostsList(updated);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Article Image URL</label>
                      <input
                        type="text"
                        className="form-input"
                        value={post.image || ''}
                        onChange={(e) => {
                          const updated = [...postsList];
                          updated[idx].image = e.target.value;
                          setPostsList(updated);
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Summary / Excerpt (English)</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={post.excerpt}
                      onChange={(e) => {
                        const updated = [...postsList];
                        updated[idx].excerpt = e.target.value;
                        setPostsList(updated);
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Summary / Excerpt (বাংলা)</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={post.excerptBn || ''}
                      onChange={(e) => {
                        const updated = [...postsList];
                        updated[idx].excerptBn = e.target.value;
                        setPostsList(updated);
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Article Content</label>
                    <textarea
                      className="form-textarea"
                      rows={5}
                      value={post.content || ''}
                      onChange={(e) => {
                        const updated = [...postsList];
                        updated[idx].content = e.target.value;
                        setPostsList(updated);
                      }}
                    />
                  </div>

                  <button
                    onClick={() => saveSection('posts', postsList)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Save size={15} />
                    <span>Save Post #{idx + 1}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 11: DATABASE & SETTINGS */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                System Settings & MongoDB Atlas
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Manage authentication credentials, inspect MongoDB Atlas cluster connection, and reset database options.
              </p>
            </div>

            {/* Change Admin Password */}
            <div className="card" style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="var(--primary)" />
                <span>Change Admin Password</span>
              </h4>
              <form onSubmit={handleChangePassword} style={{ maxWidth: '440px' }}>
                <div className="form-group">
                  <label className="form-label">New Admin Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter at least 6 characters..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  Update Password
                </button>
              </form>
            </div>

            {/* MongoDB Atlas Setup Guide */}
            <div className="card" style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={18} color="var(--primary)" />
                <span>MongoDB Atlas & Vercel Deployment</span>
              </h4>
              <div style={{ background: 'var(--bg-surface-alt)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '18px', fontSize: '0.9rem', lineHeight: 1.7 }}>
                <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--text-heading)' }}>
                  How to link MongoDB Atlas for Vercel:
                </strong>
                <ol style={{ paddingLeft: '20px' }}>
                  <li>Log in to <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>MongoDB Atlas</a> and create a free Shared Cluster (M0).</li>
                  <li>Under <strong>Database Access</strong>, create a database user (e.g. <code>doctorAdmin</code> with password).</li>
                  <li>Under <strong>Network Access</strong>, add IP Address <code>0.0.0.0/0</code> (Allow Access from Anywhere) so Vercel can connect.</li>
                  <li>Click <strong>Connect</strong> → <strong>Drivers</strong> (Node.js) and copy your connection string:
                    <div style={{ background: '#090e17', color: '#38bdf8', padding: '10px 14px', borderRadius: '6px', marginTop: '6px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/doctors_portfolio?retryWrites=true&amp;w=majority
                    </div>
                  </li>
                  <li>In your project root, add it to <code>.env.local</code> or in <strong>Vercel Project Settings → Environment Variables</strong>:
                    <div style={{ background: '#090e17', color: '#10b981', padding: '8px 14px', borderRadius: '6px', marginTop: '6px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      MONGODB_URI=your_mongodb_atlas_connection_string
                    </div>
                  </li>
                </ol>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge-status confirmed">Atlas Ready</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Next.js App automatically connects when MONGODB_URI is provided.
                </span>
              </div>
            </div>

            {/* Reset to Defaults */}
            <div className="card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444', marginBottom: '8px' }}>
                Reset Portfolio to Default Demo Data
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                If you ever want to revert all modifications back to the default doctor sample data (bilingual bio, chambers, schedule, gallery, and demo appointments), click below:
              </p>
              <button onClick={handleResetData} className="btn btn-danger btn-sm">
                <RefreshCw size={14} />
                <span>Reset All Data to Factory Defaults</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
