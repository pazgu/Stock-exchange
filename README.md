# 📈 Stock Exchange Data Website

A dynamic, performance-optimized multi-page web application that allows users to search for NASDAQ stocks in real-time, view detailed company profiles, and analyze historical price trends using interactive data visualizations.

---

## 🚀 Features

### 🔍 Main Dashboard (Search Page)
* **Real-Time Auto-Search:** Leverages custom **Debouncing** logic to initiate automated searches seamlessly as the user types, without needing to hit a submit button.
* **API Call Optimization (Batching):** Instead of executing isolated fetch actions per listing, the platform extracts and condenses company tickers to process metadata via single, unified **Batch Requests**—safeguarding daily call quotas.
* **Enriched Results:** Displays responsive list layouts displaying the official corporate logo, ticker name, and active percentage shifts (dynamically colored in green or red based on market performance).

### 🏢 Company Profile Page
* **Deep Dynamic Linking:** Parses incoming URL query parameters (`?symbol=...`) asynchronously to dynamically assemble corporate dashboards.
* **Detailed Analytics:** Shows live stock pricing alongside interactive, responsive charts showcasing historical line series data via **Chart.js**.

---

## 🛠️ Tech Stack & Tools

* **Frontend:** Vanilla HTML5, Semantic CSS3 (Flexbox & Responsive Layouts)
* **Logic & Execution:** Vanilla Asynchronous JavaScript (ES6+, Async/Await, Fetch API)
* **Data Visualization:** Chart.js (CDN Integration)
* **Data Provider:** Financial Modeling Prep (FMP) API

---

## 💡 Architecture & Performance Decisions

### 1. The Debounce Mechanism
To enforce stability and respect the API's strict daily limits, typing inputs are wrapper-controlled by a **500ms Debounce utility**. The network request only fires once the user stops typing, preventing excessive requests on every single keystroke.

### 2. Batching Endpoint Queries
Instead of initiating 10 separate API queries for 10 search results (which would quickly drain the daily limit), the engine maps out symbols into a single comma-separated string (e.g., `AAPL,MSFT,GOOG`). This bundles information mapping down to just **2 overall API hits** per search sequence.

---

## 📦 Project Structure

```text
├── index.html          # Main search engine and dashboard view
├── style.css           # Global typography, structural rules & search styles
├── script.js          # Live search execution, debouncer, and batch-fetching pipeline
├── company.html        # Targeted profile data canvas
├── company.css         # Price indicators, responsive graphs, and card layout CSS
└── company.js          # URL parsing, parallel endpoint fetches, and Chart.js rendering
