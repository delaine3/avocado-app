# AvoLog

AvoLog is a simple, mobile-friendly app for tracking avocado plant growth, care, and progress over time.

It helps you stay consistent with plant care through logs, photos, and automated reminders.

---

## Live Demo

## https://avocado-app-mu.vercel.app/

## Features

- Track multiple avocado plants
- Add care logs (water changes, growth updates, notes)
- Upload photos for visual progress tracking
- Edit and delete logs and plants
- Bulk actions (log updates across all plants)
- Smart dashboard:
  - Shows most recent plant photo
  - Sorts plants by least recently cared for
- Typeahead plant search
- Automated email reminders for neglected plants (3+ days)

---

## Why I Built This

I wanted a lightweight system to track plant care without relying on generic note apps.

This project focuses on:

- building a clean full-stack CRUD system
- designing a mobile-friendly UI
- handling real-world concerns like image uploads and reminders

---

## Tech Stack

**Frontend**

- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Backend**

- Next.js Server Actions
- Supabase (PostgreSQL + Storage)

**Other**

- Resend (email reminders)
- Vercel (deployment + cron jobs)
- browser-image-compression (image optimization)

---

## Key Technical Decisions

### Image Compression

Phone images were too large to upload reliably, so images are compressed client-side before upload.

### Storage Strategy

Images are stored in Supabase Storage, with URLs saved in the database.

### Reminder System

A daily Vercel cron job checks plant care logs and sends a single email if any plants haven’t been tended in 3+ days.

### Data Model

- `plants`
- `care_logs` (linked via `plant_id`)

---

## Acknowledgements

Supabase
Vercel
Resend

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/avolog.git
cd avolog
```
