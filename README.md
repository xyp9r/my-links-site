# 💻 root@v4mp.dev :~$

> **An interactive, terminal-themed personal portfolio and dashboard.**
> Live at: [v4mp.dev](https://v4mp.dev)

This is not just a static webpage. It's a fully dynamic dashboard built with Vanilla JavaScript, connecting to multiple APIs in real-time to display my current status, what I'm listening to, and my coding statistics.

## 🔌 Live Integrations (Real-Time Data)
* **🎵 Spotify / Last.fm API:** Displays the track I am currently listening to, complete with album art and a CSS equalizer animation.
* **⌨️ WakaTime API:** Pulls my coding activity for the day, top programming languages, and my most-used IDE over the last day.
* **🎮 Discord Status (Lanyard API):** Uses WebSockets to stream my live Discord presence (Online/Idle/DND) and current rich presence activity (e.g., what game I'm playing).
* **📱 Telegram Status:** Connects to a custom backend (`v4mp-tg-api`) via Server-Sent Events (SSE) to show my real-time Telegram online status.
* **👁️ Page Views:** Tracks unique visits using CounterAPI.

## 🎨 UI / UX Features
* **Matrix Rain Background:** A custom HTML5 Canvas animation running at 60fps.
* **Terminal Interface:** Designed to look and feel like a UNIX terminal, complete with a blinking text-typing effect.
* **Custom Context Menu:** Overrides the default browser right-click menu with a stylized terminal menu (Copy, Select All, Reload).
* **Responsive Design:** Fully optimized for both desktop and mobile viewing.
* **Live Clock:** Hardcoded to `Europe/Warsaw` timezone so visitors always know my local time.

## ⚙️ Tech Stack
* **HTML5** & **CSS3** (Flexbox, Grid, custom animations)
* **Vanilla JavaScript (ES6+)** (Async/Await, Fetch API, WebSockets, Canvas API)
* **No Frameworks** — 100% pure code.

## 📂 File Structure
* `index.html` - Main dashboard / terminal view.
* `projects.html` - Showcase of my latest tools and websites.
* `style.css` - Custom styling, animations, and mobile breakpoints.
* `script.js` - API fetching, logic, and DOM manipulation.
* `magic.js` - The logic behind the Matrix canvas background.

---
*Stay out of my system.*