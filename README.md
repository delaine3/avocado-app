# AvoLog

AvoLog is a full-stack plant care journal for tracking avocado propagation, growth, repotting, water changes, photos, and public care updates.

It started as my personal avocado tracker, then became a real multi-user app with authentication, privacy controls, a public feed, comments, likes, photo galleries, bulk care logging, and plant lineage tracking for split seeds.

The app follows the actual care workflow. Some plants are in water. Some have moved into soil. Some are parent records for split seeds. Some updates belong on the public feed. Some stay private.

## Live Demo

https://avocado-app-mu.vercel.app/

Demo account:

```txt
Email: demo@avolog.com
Password: D3m0Pa$$w0rd783!
```

## Tech Stack

### Frontend

* Next.js App Router
* TypeScript
* React Server Components
* Client Components
* Tailwind CSS
* Lucide React icons

### Backend and Data

* Supabase Postgres
* Supabase Auth
* Supabase Storage
* Row Level Security policies
* Server Actions
* Vercel deployment

## Core Features

### Plant Tracking

Users can create plant profiles with a name, start date, stage, location, container type, notes, privacy setting, and care mode.

The `in_soil` field defines the plant’s care workflow. Container type describes the physical setup. `in_soil` tells the app whether the plant needs watering or a water change.

A plant can move between jars, glasses, pots, and outdoor spaces while keeping the correct care behavior attached to its growing medium.

### Care Logs

Each plant can have many care logs. Logs can include:

* action type
* care date
* notes
* privacy setting
* one or more photos

Care actions change based on the plant’s care mode. Water-propagation plants get options like water changes and root growth. Soil plants get options like watering, fertilizing, pruning, pest checks, and mulching.

### Multiple Photos Per Care Log

Care logs can have photo galleries.

Photos live in a separate `care_log_photos` table, which gives the app a clean one-to-many relationship:

```txt
plants
  -> care_logs
      -> care_log_photos
```

The older `care_logs.photo_url` field stays as a fallback preview image for dashboard cards and older records.

### Public Feed

Public care logs from public plants appear in the feed.

The feed supports:

* plant owner display
* care action badges
* notes
* photo carousels
* likes
* comments

Privacy works at both plant and care log level:

```txt
private plant = all logs from that plant stay off the feed
private care log = that specific log stays hidden
public plant + public log = the log can appear in the feed
```

### Likes and Comments

The social layer is intentionally lightweight. Users can like and comment on public care updates.

Interactions are stored separately from the main care log table:

```txt
care_log_likes
care_log_comments
```

That keeps the plant care records organized.

### Plant Lineage

AvoLog supports parent-child plant relationships with `parent_plant_id`.

This was added because avocado seeds can split into two viable halves. The original seed can remain as the origin record, while each half becomes its own active plant with its own care history.

Example:

```txt
Gemini
  -> Gemma
  -> Nia
```

That keeps the biological origin intact while giving each living plant its own record.

### Bulk Care Logging

Users can create care logs for multiple plants at once.

Bulk logging supports:

* all plants
* soil plants only
* water plants only

The action dropdown changes based on the selected group. Soil plants get soil-care actions. Water plants get water-propagation actions.

## Architecture

AvoLog uses the Next.js App Router with a mix of Server Components and Client Components.

Server Components handle data-heavy pages like:

* dashboard
* plant detail pages
* feed
* legal pages

Client Components handle browser-side interaction like:

* modals
* typeahead selects
* form feedback
* dropdown menus
* photo carousels
* loading links
* compressed image inputs

## Data Model

### `profiles`

Stores public account metadata.

```txt
id
full_name
username
avatar_url
```

`profiles.id` maps to the Supabase Auth user id.

### `plants`

Stores each plant profile.

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

Key fields:

* `user_id` controls ownership
* `is_private` controls visibility
* `in_soil` controls care behavior
* `parent_plant_id` supports plant lineage
* `container_type` describes the plant’s physical setup

### `care_logs`

Stores care events.

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

`action_date` is the date the user says the care happened. `created_at` is when the record was created in the database.

The dashboard can sort by care date, then use `created_at` as a tie-breaker.

### `care_log_photos`

Stores care log galleries.

```txt
id
care_log_id
user_id
photo_url
storage_path
created_at
```

This lets one care log have many photos while keeping the care log schema clean.

### `care_log_likes`

Stores likes on care logs.

```txt
id
care_log_id
user_id
created_at
```

A uniqueness rule prevents the same user from liking the same log twice.

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

Create, update, delete, like, comment, and bulk log operations use Server Actions.

This keeps mutation logic close to the server. Client components call actions through forms, then show loading states and toast messages.

### Typeahead Selects

AvoLog uses reusable typeahead components for plant stage, container type, and action type.

The typeahead always opens with the full option list. Typing filters the list. This matches the way people tend to use selects: click first, browse options, then narrow down when needed.

### `in_soil` as a Care Flag

`in_soil` defines the care workflow directly.

A plant can move between containers while keeping the correct care behavior attached to its growing medium. The field defines whether the plant needs a water change or watering.

### Separate Photo Table

The first version used a single `photo_url`. Care logs later grew into galleries.

Moving photos into `care_log_photos` gives the app:

* multiple photos per log
* gallery support
* cleaner schema
* easier migration from old single-photo records

### Feed Privacy Rules

The feed shows logs where:

```txt
plant.is_private = false
care_log.is_private = false
```

Users can hide an entire plant or one specific log.

## Access Control and Privacy

AvoLog uses Supabase Auth and ownership checks so users can manage their own plants, logs, comments, and photos.

Privacy exists at two levels:

* plant privacy
* care log privacy

The app also includes:

* Privacy Policy
* Terms of Use
* Disclaimer
* Community Guidelines

These pages are included because the app stores user-generated content, photos, comments, usernames, timestamps, and notes that may contain personal information.

## Image Handling

Image uploads use client-side compression before submission. This keeps uploads more manageable.

Care log photos are stored in Supabase Storage, with database records stored in `care_log_photos`.

Images are displayed through a reusable photo carousel, so feeds and plant histories stay browsable.

## Loading and Form Feedback

Reusable loading components are used across the app:

* `Spinner`
* `SubmitButton`
* `LoadingLink`

Forms use pending states through `useActionState` or `useFormStatus`.

Validation errors return structured action results whenever possible. Missing fields show useful feedback and let the user continue.

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

It also needs Supabase Auth and RLS policies for:

* users managing their own plants
* users managing their own care logs
* public feed reads for public plants and public logs
* photo reads for public logs
* likes and comments by authenticated users

## Future Improvements

Possible next steps:

* account deletion 
* delete comment button
* edit comment support
* report post/comment
* user profile pages
* plant search and filters
* dashboard stats
* care streaks
* plant timeline view
* better gallery management
* photo deletion from storage
* export user data
* stronger demo seeding flow
* automated RLS tests

## Why I Built This

AvoLog came from an actual tracking problem: I had too many avocado seeds at too many different stages, and my simple tracker stopped being enough.

Some plants were in water. Some had moved to soil. Some had photos. Some split into separate plants. Some care updates belonged in a feed. Some needed to stay private.

So the app became a small, real system for modeling plant care as it happens.
