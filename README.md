# 🩺 Doctor's Portfolio & Practice Management Web Application

A fully customized, modern, and production-ready Doctor's Portfolio web application built with **React**, **Next.js 14 (App Router)**, **JavaScript**, and **Vanilla CSS**. Designed with a doctor-professional aesthetic, bilingual support (**English & বাংলা**), light/dark mode, and an **Admin Control Panel** to customize every frontend detail, manage patient appointments, and inspect inquiries. Ready for deployment on **Vercel** with **MongoDB Atlas**.

---

## 🌟 Key Highlights & Features

### 1. 🏥 Patient-Facing Frontend
- **Home Page**:
  - Doctor's portrait photo & verification badges.
  - Doctor's credentials (`MBBS, FCPS, MD, MRCP UK, FACC USA`, BMDC Registration).
  - Live practice status indicator: *"Available for Consultation Today"*.
  - Experience & achievement counters (Years Experience, Satisfied Patients, Procedures, Awards).
  - **"What He Does" (Clinical Specialties)**: Dynamic cards with procedure bullet points, badges, and "Consult For This" action.
  - **Clinical Highlights & Works**: Trans-radial angioplasty, pacemaker implantation, primary PCI, and international cardiology research.
  - **Chambers Overview**: Hospital chambers with address, days, fees, and instant booking buttons.
  - **Weekly Schedule Preview**: Interactive table with slot status (*Available*, *Slot Full*).
  - **Gallery**: Lightbox modal with category filters (*Clinic*, *Conference*, *Procedures*, *Awards*).
  - **Health Posts / Blog**: Health tips and cardiac advice with "Read Full Article" modal.
- **About Page (`/about`)**: Full detailed biography, medical qualifications timeline, care philosophy, and hospital attachments.
- **Chambers Page (`/chambers`)**: Detailed chambers with addresses, room numbers, consultation & review fees, serial hotlines, facility badges, and embedded Google Maps.
- **Time Schedule Page (`/schedule`)**: Filterable weekly timetable with direct slot reservation.
- **Contact Page (`/contact`)**: Direct inquiry form that submits messages to the admin inbox, emergency 24/7 hotline cards, chamber phone numbers, and patient FAQs.
- **Interactive Appointment Booking Modal**: Multi-step booking form with chamber selection, date/slot choice, patient details, and auto-generated serial numbers (e.g. `APT-2026-0891`).
- **Navbar & Emergency Bar**:
  - Direct 24/7 emergency hotline & chamber serial phone numbers.
  - Prominent "Book Appointment" CTA button.
  - Language toggle button (**English ↔ বাংলা**).
  - Theme mode toggle button (**Light ↔ Dark**).
  - Mobile responsive drawer menu & floating mobile booking button.

---

### 2. 🌐 Bilingual Engine (English & বাংলা)
- Instant toggle between English and Bangla.
- Complete built-in translation dictionaries for UI, navigation, buttons, and form labels.
- Dual-language support for all data items (`name` / `nameBn`, `title` / `titleBn`, `shortBio` / `shortBioBn`, etc.) with intelligent fallback.
- Auto-conversion of numbers to Bengali digits (`১, ২, ৩...`) when viewing in Bangla.

---

### 3. 🎨 Doctor-Professional Theme & Live Customizer
- **Light & Dark Mode**: Clinical hospital white and deep medical navy modes with smooth CSS transitions.
- **Dynamic Theme Customizer** in Admin Panel:
  - Primary color picker with 6 doctor presets (*Clinical Sky*, *Deep Hospital Blue*, *Emerald Healing*, *Medical Teal*, *Royal Amethyst*, *Cardiac Crimson*).
  - Accent color picker.
  - Customizable emergency announcement banner text.

---

### 4. 🔐 Full-Featured Admin Control Panel (`/admin`)
Protected by secure password login (Default: `admin123`):
- **Overview Dashboard**: Stat cards for total appointments, pending requests, unread messages, active chambers, and database status.
- **Appointments Management**: Real-time list of all patient bookings, 1-click status updater (*Pending*, *Confirmed*, *Completed*, *Cancelled*), patient details, and delete option.
- **Messages Inbox**: View inquiries from the contact form, toggle read/unread status, and direct *Reply via Email* link.
- **Doctor Profile Customizer**: Edit name, title, degrees, BMDC number, photo URL, experience counters, hero headlines, bios, and emergency contact numbers in English and Bangla.
- **Services Customizer**: Add, edit, or delete specialties, badges, descriptions, and feature bullet points.
- **Chambers Customizer**: Add, edit, or delete visiting hospitals, addresses, visiting hours, fees, and Google Map URLs.
- **Schedules Customizer**: Manage weekly consultation timetable slots.
- **Gallery & Posts Manager**: Add, edit, and delete photos and health blog articles.
- **System Settings**: Change admin password, MongoDB Atlas connection monitor, and *Reset to Defaults* button.

---

## 🗄️ Database: MongoDB Atlas + Persistent Local Fallback

The app features a dual-layer data architecture in `src/lib/db.js`:
1. **Out-of-the-Box Mode**: If `MONGODB_URI` is not yet set, the app seamlessly runs using an internal persistent JSON store (`data/db.json`), ensuring it works immediately without setup hurdles.
2. **MongoDB Atlas Production Mode**: Once you provide `MONGODB_URI`, it automatically connects to your MongoDB Atlas cluster via Mongoose with connection pooling optimized for Vercel Serverless.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# App runs at: http://localhost:3000
# Admin panel at: http://localhost:3000/admin (Password: admin123)
```

---

## ☁️ Deploying to Vercel with GitHub & MongoDB Atlas

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit of full customized doctor portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### Step 2: Set Up MongoDB Atlas
1. Sign up/Log in at [MongoDB Atlas](https://cloud.mongodb.com).
2. Create a free Shared Cluster (M0).
3. Under **Database Access**, create a user (e.g., `doctorAdmin` with a password).
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere) so Vercel serverless functions can connect.
5. Click **Connect** → **Drivers** (Node.js) and copy the URI:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/doctors_portfolio?retryWrites=true&w=majority
   ```

### Step 3: Deploy on Vercel
1. Go to [Vercel](https://vercel.com) and import your GitHub repository.
2. In **Project Settings** → **Environment Variables**, add:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection string.
3. Click **Deploy**. Vercel will build and launch your live doctor portfolio!
