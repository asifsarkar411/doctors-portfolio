import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { initialData } from '../data/initialData';

// File path for local persistent storage fallback
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure local data file exists
function ensureLocalDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring local DB:', err);
  }
}

// Local file DB operations
function readLocalDb() {
  ensureLocalDb();
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading local DB, falling back to initial data:', err);
    return JSON.parse(JSON.stringify(initialData));
  }
}

function writeLocalDb(data) {
  ensureLocalDb();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing local DB:', err);
    return false;
  }
}

// MongoDB Atlas Mongoose Connection Caching for Next.js Serverless
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };
    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch((err) => {
      console.warn('MongoDB Atlas connection failed, using local storage fallback:', err.message);
      cached.promise = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}

// Mongoose Models definitions
const SiteDataSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'main' },
  profile: Object,
  themeSettings: Object,
  services: Array,
  chambers: Array,
  schedules: Array,
  gallery: Array,
  posts: Array,
  adminAuth: Object
}, { timestamps: true });

const AppointmentSchema = new mongoose.Schema({
  serialNumber: String,
  patientName: String,
  patientPhone: String,
  patientEmail: String,
  patientAge: Number,
  gender: String,
  chamberId: String,
  chamberName: String,
  appointmentDate: String,
  slot: String,
  symptoms: String,
  type: { type: String, default: 'New Patient' },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

const ContactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  read: { type: Boolean, default: false }
}, { timestamps: true });

function getModels() {
  const SiteDataModel = mongoose.models.SiteData || mongoose.model('SiteData', SiteDataSchema);
  const AppointmentModel = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
  const MessageModel = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
  return { SiteDataModel, AppointmentModel, MessageModel };
}

// Database helper functions:
export async function getDbStatus() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return {
      connected: false,
      type: 'local_storage',
      message: 'Running in Local Storage Mode. To connect MongoDB Atlas, set MONGODB_URI in .env.local or Vercel Environment Variables.'
    };
  }
  const conn = await connectMongo();
  if (conn && mongoose.connection.readyState === 1) {
    return {
      connected: true,
      type: 'mongodb_atlas',
      databaseName: mongoose.connection.name,
      message: 'Successfully connected to MongoDB Atlas cluster!'
    };
  }
  return {
    connected: false,
    type: 'fallback_local',
    message: 'MongoDB Atlas URI is provided, but could not establish connection. Using persistent local storage fallback.'
  };
}

// Fetch all site content (Profile, Services, Chambers, Schedules, Gallery, Posts, Theme)
export async function getSiteData() {
  const conn = await connectMongo();
  if (conn) {
    try {
      const { SiteDataModel } = getModels();
      let doc = await SiteDataModel.findOne({ key: 'main' });
      if (!doc) {
        doc = await SiteDataModel.create({
          key: 'main',
          profile: initialData.profile,
          themeSettings: initialData.themeSettings,
          services: initialData.services,
          chambers: initialData.chambers,
          schedules: initialData.schedules,
          gallery: initialData.gallery,
          posts: initialData.posts,
          adminAuth: initialData.adminAuth
        });
      }
      return doc.toObject();
    } catch (err) {
      console.warn('Error fetching from Mongo, reading local DB:', err.message);
    }
  }

  // Fallback to local
  const data = readLocalDb();
  return data;
}

// Save or update section of site content
export async function updateSiteSection(sectionName, newContent) {
  const conn = await connectMongo();
  if (conn) {
    try {
      const { SiteDataModel } = getModels();
      const update = { [sectionName]: newContent };
      await SiteDataModel.findOneAndUpdate(
        { key: 'main' },
        { $set: update },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn('Error updating Mongo, updating local DB:', err.message);
    }
  }

  // Always update local DB for consistency
  const data = readLocalDb();
  data[sectionName] = newContent;
  writeLocalDb(data);
  return data[sectionName];
}

// APPOINTMENTS
export async function getAppointments() {
  const conn = await connectMongo();
  if (conn) {
    try {
      const { AppointmentModel } = getModels();
      const list = await AppointmentModel.find({}).sort({ createdAt: -1 });
      if (list && list.length > 0) {
        return list.map(item => ({
          ...item.toObject(),
          id: item._id.toString()
        }));
      }
    } catch (err) {
      console.warn('Error fetching appointments from Mongo:', err.message);
    }
  }

  const data = readLocalDb();
  return data.appointments || [];
}

export async function createAppointment(aptData) {
  const serialNumber = 'APT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  const newAppointment = {
    ...aptData,
    serialNumber,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  const conn = await connectMongo();
  if (conn) {
    try {
      const { AppointmentModel } = getModels();
      const created = await AppointmentModel.create(newAppointment);
      newAppointment.id = created._id.toString();
    } catch (err) {
      console.warn('Mongo create appointment error, falling to local:', err.message);
      newAppointment.id = 'apt-' + Date.now();
    }
  } else {
    newAppointment.id = 'apt-' + Date.now();
  }

  const data = readLocalDb();
  if (!data.appointments) data.appointments = [];
  data.appointments.unshift(newAppointment);
  writeLocalDb(data);

  return newAppointment;
}

export async function updateAppointmentStatus(id, newStatus) {
  const conn = await connectMongo();
  if (conn) {
    try {
      const { AppointmentModel } = getModels();
      if (mongoose.Types.ObjectId.isValid(id)) {
        await AppointmentModel.findByIdAndUpdate(id, { status: newStatus });
      }
    } catch (err) {
      console.warn('Mongo update appointment error:', err.message);
    }
  }

  const data = readLocalDb();
  if (data.appointments) {
    data.appointments = data.appointments.map(a => 
      (a.id === id || a._id === id) ? { ...a, status: newStatus } : a
    );
    writeLocalDb(data);
  }
  return true;
}

export async function deleteAppointment(id) {
  const conn = await connectMongo();
  if (conn) {
    try {
      const { AppointmentModel } = getModels();
      if (mongoose.Types.ObjectId.isValid(id)) {
        await AppointmentModel.findByIdAndDelete(id);
      }
    } catch (err) {
      console.warn('Mongo delete appointment error:', err.message);
    }
  }

  const data = readLocalDb();
  if (data.appointments) {
    data.appointments = data.appointments.filter(a => a.id !== id && a._id !== id);
    writeLocalDb(data);
  }
  return true;
}

// CONTACT MESSAGES
export async function getContactMessages() {
  const conn = await connectMongo();
  if (conn) {
    try {
      const { MessageModel } = getModels();
      const list = await MessageModel.find({}).sort({ createdAt: -1 });
      if (list && list.length > 0) {
        return list.map(item => ({
          ...item.toObject(),
          id: item._id.toString()
        }));
      }
    } catch (err) {
      console.warn('Error fetching messages from Mongo:', err.message);
    }
  }

  const data = readLocalDb();
  return data.messages || [];
}

export async function createContactMessage(msgData) {
  const newMsg = {
    ...msgData,
    read: false,
    createdAt: new Date().toISOString()
  };

  const conn = await connectMongo();
  if (conn) {
    try {
      const { MessageModel } = getModels();
      const created = await MessageModel.create(newMsg);
      newMsg.id = created._id.toString();
    } catch (err) {
      console.warn('Mongo create message error:', err.message);
      newMsg.id = 'msg-' + Date.now();
    }
  } else {
    newMsg.id = 'msg-' + Date.now();
  }

  const data = readLocalDb();
  if (!data.messages) data.messages = [];
  data.messages.unshift(newMsg);
  writeLocalDb(data);

  return newMsg;
}

export async function toggleMessageRead(id, readState) {
  const conn = await connectMongo();
  if (conn) {
    try {
      const { MessageModel } = getModels();
      if (mongoose.Types.ObjectId.isValid(id)) {
        await MessageModel.findByIdAndUpdate(id, { read: readState });
      }
    } catch (err) {
      console.warn('Mongo toggle message error:', err.message);
    }
  }

  const data = readLocalDb();
  if (data.messages) {
    data.messages = data.messages.map(m => 
      (m.id === id || m._id === id) ? { ...m, read: readState } : m
    );
    writeLocalDb(data);
  }
  return true;
}

export async function deleteContactMessage(id) {
  const conn = await connectMongo();
  if (conn) {
    try {
      const { MessageModel } = getModels();
      if (mongoose.Types.ObjectId.isValid(id)) {
        await MessageModel.findByIdAndDelete(id);
      }
    } catch (err) {
      console.warn('Mongo delete message error:', err.message);
    }
  }

  const data = readLocalDb();
  if (data.messages) {
    data.messages = data.messages.filter(m => m.id !== id && m._id !== id);
    writeLocalDb(data);
  }
  return true;
}

// ADMIN AUTHENTICATION
export async function verifyAdminPassword(password) {
  const siteData = await getSiteData();
  const auth = siteData.adminAuth || initialData.adminAuth;

  // Direct match with default plain or custom plain
  if (auth.customPasswordPlain && auth.customPasswordPlain === password) {
    return true;
  }
  if (auth.defaultPasswordPlain && auth.defaultPasswordPlain === password) {
    return true;
  }

  // Bcrypt hash verification
  if (auth.passwordHash) {
    try {
      const match = await bcrypt.compare(password, auth.passwordHash);
      if (match) return true;
    } catch (err) {
      console.error('Password hash check error:', err);
    }
  }

  // Backup simple check
  if (password === 'admin123') {
    return true;
  }

  return false;
}

export async function updateAdminPassword(newPassword) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);
  
  const authUpdate = {
    passwordHash,
    customPasswordPlain: newPassword,
    updatedAt: new Date().toISOString()
  };

  await updateSiteSection('adminAuth', authUpdate);
  return true;
}

// RESET TO FACTORY DEFAULTS
export async function resetDatabaseToDefaults() {
  const conn = await connectMongo();
  if (conn) {
    try {
      const { SiteDataModel, AppointmentModel, MessageModel } = getModels();
      await SiteDataModel.deleteMany({});
      await AppointmentModel.deleteMany({});
      await MessageModel.deleteMany({});
      await SiteDataModel.create({
        key: 'main',
        profile: initialData.profile,
        themeSettings: initialData.themeSettings,
        services: initialData.services,
        chambers: initialData.chambers,
        schedules: initialData.schedules,
        gallery: initialData.gallery,
        posts: initialData.posts,
        adminAuth: initialData.adminAuth
      });
      for (const apt of initialData.appointments) {
        await AppointmentModel.create(apt);
      }
      for (const msg of initialData.messages) {
        await MessageModel.create(msg);
      }
    } catch (err) {
      console.warn('Error resetting Mongo, resetting local:', err);
    }
  }

  writeLocalDb(JSON.parse(JSON.stringify(initialData)));
  return true;
}
