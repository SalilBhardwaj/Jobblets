# 🧩 Jobblet – The Local Gig Marketplace

## 📖 Overview

**Jobblet** is a bilingual (English/Hindi) **hyperlocal gig marketplace** that connects **service providers** (maids, tutors, electricians, etc.) with **nearby employers or job seekers**.  
It simplifies informal hiring by enabling **quick listings**, **transparent communication**, and **automated workflows** — all within a **clean, scalable system**.

---

## ⚙️ Tech Stack

- **Frontend:** React.js, Redux Toolkit, Redux Persist, Tailwind CSS  
- **Backend:** Node.js, Express.js, Mongoose, JWT Authentication, Bcrypt  
- **Database:** MongoDB (with geolocation and indexing for nearby job search)  
- **Cloud & Tools:** Cloudinary (file uploads), Node-cron (cleanup jobs), GitHub (collaboration & CI)  
- **Deployment:** Render / Vercel

---

## 🚀 Features

### 👥 User Roles
- **Job Seeker:** Apply, bid, and manage job applications.  
- **Job Poster:** Post jobs, manage listings, review bids, and select applicants.  
- **Admin:** Monitor users, verify listings, remove spam, and view analytics.

### 🧾 Core Functionalities
- 🔐 **Secure Auth:** JWT-based login, role-based access, and input validation.  
- 🗺️ **Location-Based Jobs:** Filter listings by pincode/region for hyperlocal matching.  
- 🏗️ **Scalable Models:** Mongoose schemas for users, jobs, bids, notifications.  
- 🧹 **Automated Cleanup:** Cron jobs auto-archive expired listings and inactive applications.  
- 🌐 **Bilingual Support:** Full English + Hindi UI via i18next.  
- ☁️ **Cloud Uploads:** Cloudinary integration for images/docs.  
- 🔔 **Notifications:** Real-time alerts for job updates, bids, and approvals.  
- 🧠 **Smart Recommendations:** Suggest gigs based on location, skills, and activity.  
- 🧮 **Admin Dashboard:** Moderation, analytics, and platform controls.

---
