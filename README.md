# AvoLog

AvoLog is a full-stack plant care journal built for tracking avocado propagation, growth, repotting, water changes, photos, and public care updates.

It started as a personal avocado tracker, then grew into a multi-user app with authentication, privacy controls, a public feed, comments, likes, photo galleries, bulk care logging, and plant lineage tracking for split seeds.

The app is designed around a real care workflow: some plants are still in water, some have moved into soil, some are parent records for split seeds, and not every care log belongs on a public feed.

## Live Demo https://avocado-app-mu.vercel.app/

Demo account:

```txt
Email: demo@avolog.com
Password: D3m0Pa$$w0rd783!
```

## Tech Stack

### Frontend

- Next.js App Router
- TypeScript
- React Server Components
- Client Components where interactivity is required
- Tailwind CSS
- Lucide React icons

### Backend and Data

- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Row Level Security policies
- Server Actions for mutations
- Vercel deployment

## Core Features

### Plant Tracking

Users can create plant profiles with:

- name
- start date
- stage
- location
- container type
- soil / water care mode
- notes
- public or private visibility

The `in_soil` flag is one of the more important fields in the app. Container type describes the physical setup, but `in_soil` controls the care workflow. A plant can be in a tall jar, a water glass, a pot, or outside. The app needs to know whether it should receive a water change or watering.

### Care Logs

Each plant can have many care logs. A care log can include:

- action type
- care date
- notes
- privacy setting
- one or more photos

Care actions are context-aware. Water-propagation plants get options like water changes and root growth. Soil plants get options like watering, fertilizing, pruning, pest checks, and mulching.

### Multiple Photos Per Care Log

A care log can have a photo gallery. Photos are stored in a separate `care_log_photos` table instead of being squeezed into repeated columns on `care_logs`.

This gives the app a clean one-to-many relationship:

```txt
plants
  -> care_logs
      -> care_log_photos
```

The original `care_logs.photo_url` field is kept as a fallback preview image for dashboard cards and older records.

### Public Feed

Public care logs from public plants appear in the feed. The feed supports:

- plant owner display
- care action badge
- notes
- photo carousel
- likes
- comments

Privacy is handled at both plant and care log level:

- A private plant hides all of its logs from the feed.
- A private care log hides only that specific log.
- Public plant + public log means the log can appear in the feed.

### Likes and Comments

The social layer is intentionally lightweight. Users can like care logs and comment on public care updates.

The related tables are separate from the main log table:

```txt
care_log_likes
care_log_comments
```

This keeps interaction data from polluting the core plant care records.

### Plant Lineage

AvoLog supports parent-child plant relationships through `parent_plant_id`.

This was added for split seeds, such as a single avocado seed that separated into two viable halves. The original plant can remain as the origin record, while each half becomes its own active plant with its own logs and photos.

Example:

```txt
Gemini
  -> Gemma
  -> Nia
```

This keeps the biological origin intact without forcing two living plants into one record.

### Bulk Care Logging

Users can create care logs for multiple plants at once.

Bulk logging supports care groups:

- all plants
- soil plants only
- water plants only

The action dropdown changes based on the group. For example, water plants should not receive a “watered” action because their correct care workflow is usually “water change.”

## Architecture

AvoLog uses the Next.js App Router with a mix of Server Components and Client Components.

Server Components are used for data-heavy pages such as:

- dashboard
- plant detail pages
- feed
- legal pages

Client Components are used for UI that needs browser state:

- modals
- typeahead selects
- form submission feedback
- dropdown menus
- photo carousels
- loading links
- compressed image inputs

This split keeps most data fetching close to the server while still allowing rich UI behavior where it matters.

## Data Model Overview

### `profiles`

Stores public account metadata.

Typical fields:

```txt
id
full_name
username
avatar_url
```

The `profiles.id` maps to the Supabase Auth user id.

### `plants`

Stores each plant profile.

Important fields:

```txt
id
user_id
name
started_at
stage
location
container_type
notes
is_private
in_soil
parent_plant_id
created_at
updated_at
```

Design notes:

- `user_id` controls ownership.
- `is_private` controls visibility.
- `in_soil` controls care behavior.
- `parent_plant_id` supports plant lineage.
- `container_type` stays descriptive instead of driving workflow rules by itself.

### `care_logs`

Stores care events for plants.

Important fields:

```txt
id
plant_id
user_id
action_type
action_date
notes
photo_url
is_private
created_at
```

Design notes:

- `action_date` is the date the user says the care happened.
- `created_at` is the actual database creation timestamp.
- The dashboard can sort by care date, then use `created_at` as a tie-breaker.
- `photo_url` is a legacy / preview fallback. The full gallery lives in `care_log_photos`.

### `care_log_photos`

Stores galleries for care logs.

```txt
id
care_log_id
user_id
photo_url
storage_path
created_at
```

This lets one care log have many photos without changing the care log schema every time photo handling grows.

### `care_log_likes`

Stores likes on care logs.

```txt
id
care_log_id
user_id
created_at
```

A uniqueness rule prevents duplicate likes by the same user on the same log.

### `care_log_comments`

Stores comments on care logs.

```txt
id
care_log_id
user_id
body
created_at
```

Comments join back to profiles so the feed can show usernames and avatars.

## Important Design Decisions

### Server Actions for Mutations

Create, update, delete, like, comment, and bulk log operations are handled through Server Actions.

This keeps mutation logic close to the server and avoids exposing database write logic in browser-side components. Client components call actions through forms, then show loading states and toast messages.

### Typeahead Selects Instead of Plain Selects

AvoLog uses reusable typeahead components for values like:

- plant stage
- container type
- action type

The typeahead always shows the full option list when opened, even if a value is already selected. Typing filters the options. This is intentional because many users click a select expecting to see all valid values first.

### `in_soil` as an Operational Flag

The app does not infer watering behavior only from container type. A plant may move from one jar to another, and that should not mark it as a soil plant.

The `in_soil` flag answers the operational question:

```txt
Should this plant be watered, or should its water be changed?
```

That separates physical description from care workflow.

### Separate Photo Table

A single `photo_url` field worked for the first version, but it broke down once care logs needed multiple photos.

Moving photos into `care_log_photos` gives the app:

- multiple photos per log
- gallery support
- better long-term schema
- easier migration from old single-photo records

### Parent Plant Relationships

Split seeds and propagated plants need lineage. AvoLog uses `parent_plant_id` rather than duplicating notes or inventing a separate grouping system.

This allows one plant to become the origin for multiple active plants while keeping each child plant independently trackable.

### Public Feed Privacy Rules

The feed only shows care logs where:

```txt
plant.is_private = false
care_log.is_private = false
```

That means users can hide an entire plant or hide a single care log.

This was a deliberate product decision because not every plant update needs the same audience.

## Access Control and Privacy

The app uses Supabase Auth and ownership checks so users can manage their own plants, logs, comments, and photos.

Privacy controls exist at two levels:

- plant-level privacy
- care-log-level privacy

There are also legal and safety pages:

- Privacy Policy
- Terms of Use
- Disclaimer
- Community Guidelines

These are included because the app stores user-generated content, photos, comments, usernames, timestamps, and potentially personal information inside notes or images.

## Image Handling

Image uploads use client-side compression before submission. This reduces payload size and keeps uploads more manageable.

Care log photos are stored in Supabase Storage, with database records stored in `care_log_photos`.

The app displays images through a reusable photo carousel, so long feeds and plant histories do not become huge vertical stacks of images.

## Loading and Form Feedback

Reusable loading components are used across the app:

- `Spinner`
- `SubmitButton`
- `LoadingLink`

Forms use pending states through `useActionState` or `useFormStatus`. Links use a client wrapper that shows a spinner during route navigation.

Validation errors return structured action results instead of throwing whenever possible. This prevents normal user mistakes, such as missing a field, from becoming full error pages.

## Folder Structure

```txt
src
  app
    actions
      plant-actions.ts
    feed
      page.tsx
    plants
      [id]
        page.tsx
      new
        page.tsx
        actions.ts
    privacy
      page.tsx
    terms
      page.tsx
    disclaimer
      page.tsx
    community-guidelines
      page.tsx
    utilities
      format.ts
    page.tsx

  components
    ActionFormButton.tsx
    ActionTypeahead.tsx
    BulkCareLogForm.tsx
    CareLogComments.tsx
    CareLogForm.tsx
    CareLogLikeButton.tsx
    CompressedImageInput.tsx
    ContainerTypeahead.tsx
    CreateChildPlantButton.tsx
    EditCareLogButton.tsx
    EditPlantButton.tsx
    Footer.tsx
    Header.tsx
    LoadingLink.tsx
    PhotoCarousel.tsx
    PlantStageTypeahead.tsx
    PlantTypeaheadSelect.tsx
    Spinner.tsx
    SubmitButton.tsx
    TypeaheadSelect.tsx

  lib
    supabase.ts
    supabase-server.ts
    getLogTypeMeta.ts

  types
    plant.ts
    care-log.ts
```

## Running Locally

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```txt
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Database Requirements

At minimum, the Supabase project needs:

```txt
profiles
plants
care_logs
care_log_photos
care_log_likes
care_log_comments
```

It also needs Supabase Auth enabled and appropriate RLS policies for:

- users managing their own plants
- users managing their own care logs
- public feed reads for public plants and public logs
- photo reads for public logs
- likes and comments by authenticated users

## Future Improvements

Potential next steps:

- account deletion flow
- delete comment button
- edit comment support
- report post/comment
- user profile pages
- plant search and filters
- dashboard stats
- care streaks
- plant timeline view
- better gallery management
- photo deletion from storage
- export user data
- stronger demo seeding flow
- automated RLS tests

## Why I Built This

AvoLog came from an actual tracking problem: I had multiple avocado seeds at different stages, and the simple version of “plant tracker” stopped being enough.

Some plants were in water. Some moved to soil. Some had photos. Some split into separate plants. Some care updates belonged in a feed, and some needed to stay private.

So the app became a small but real system for modeling plant care as it actually happens: messy, specific, visual, and full of edge cases.
