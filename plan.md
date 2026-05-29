# Implementation Plan - Video Downloader Pro (Web Version)

## Scope Summary
Build a mobile-first web application that mimics the functionality of a social media video downloader. Since this is a browser-based environment, "downloading" will be simulated or handled via standard browser download triggers where possible, and device storage will be represented by `localStorage` and browser download history.

### Non-Goals
- Native Android features (APK generation, hardware-level background services).
- Actual bypassing of social media DRM/private APIs (which usually require backend proxies or specific headers prohibited in standard frontend environments).
- AdMob integration (AdMob is for native mobile; will use placeholders for UI representation).

## Assumptions & Risks
- **Persistence:** All "download history" and "favorites" will be stored in `localStorage`.
- **Media Access:** Fetching video URLs from TikTok/Instagram often requires a backend or third-party API due to CORS. This plan assumes we will provide a clean UI and a simulated/mocked download service that users can extend with their own API keys or proxy services.
- **Browser Constraints:** The "Built-in Browser" will be a simulated interface or an iframe-based preview where possible (though many sites block iframe embedding).

## Affected Areas
- **Frontend:** React (Vite), Tailwind CSS, Lucide icons, Framer Motion for animations.
- **Data Layer:** `localStorage` for history, favorites, and settings (Dark/Light mode).
- **Navigation:** React Router for the 8 specified screens.

## Ordered Phases

### Phase 1: Foundation & Navigation (frontend_engineer)
- Set up React Router with the 8 screens: Splash, Home, URL Downloader, Browser, Download Manager, Gallery, Settings, About.
- Implement the Splash screen with a fade-out animation.
- Create a persistent bottom navigation bar for mobile-first feel.
- Set up Theme Provider for Dark/Light mode.

### Phase 2: Core UI Components (frontend_engineer)
- Implement Material 3 inspired components (Cards, Inputs, Buttons).
- Create the "Home Screen" with quick-access icons for social platforms.
- Create "URL Downloader Screen" with auto-paste functionality (using `navigator.clipboard` if permitted).

### Phase 3: Simulated Download Logic & Manager (frontend_engineer)
- Implement a `DownloadProvider` to manage global download state (queue, progress, history).
- Build the "Download Manager" screen to show active downloads with progress bars.
- Build the "Downloads Gallery" to view "saved" items from `localStorage`.

### Phase 4: Multimedia & Extra Features (frontend_engineer)
- Integrate a basic video player (using `<video>`) and image viewer for the gallery.
- Add "Video to MP3" UI toggle (simulated conversion).
- Implement QR code scanner UI (placeholder or simple library).
- Add "Download Statistics" dashboard using mock data.

### Phase 5: Polishing & Monetization Placeholders (quick_fix_engineer)
- Add "Ad" placeholders (Banners and Rewarded Ad buttons) as per requirements.
- Finalize animations and transitions.
- Ensure multi-language structure (i18next or simple object-based translation).
- Clean up CSS and responsive tweaks for mobile/tablet.

## Specialist Assignments
- **frontend_engineer:** Phases 1, 2, 3, 4.
- **quick_fix_engineer:** Phase 5 and final UI refinements.
