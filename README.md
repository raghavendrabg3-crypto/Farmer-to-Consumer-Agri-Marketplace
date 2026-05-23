# Farmer-to-Consumer Agri Marketplace 🌾

An interactive, web-based direct commerce platform designed to eliminate middle-agent supply inefficiencies and connect regional farmers directly with retail consumers.

## About the Project
The Farmer-to-Consumer Agri Marketplace provides a streamlined digital directory where localized agricultural producers can register profiles and list live crop yields with custom pricing structures. Built as a decoupled Single Page Application (SPA), it allows retail buyers to discover fresh regional stock and place instant purchase orders through fluid UI interactions without frustrating page reloads or layout disruptions.

## Key Features
* **Role-Isolated Portals:** Separate, swappable user viewports optimized for Farmer Management Node actions and the public Consumer Storefront Hub.
* **Dynamic Inventory Discovery:** Real-time generation of active crop listing cards featuring custom glassmorphic components and layout styling filters.
* **Instant Checkout Overlay:** Lightbox modal processing form that lets buyers fill out delivery logistics and submit order requests instantly.
* **Fulfillment Management Stream:** Dedicated administrative dashboard where farmers track incoming pending buyer logs and execute single-click confirmation states.

## Tech Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Backend:** Node.js, Express.js
* **Database:** JSON File System (`db.json`) via Node's native `fs` module

## Repository Directory Layout Map
```text
agri-marketplace/
├── data/
│   └── db.json             # Persistent Local Marketplace JSON Data Store
├── public/                 # Static Frontend Presentation Assets
│   ├── index.html          # Core App Structural View Layout
│   └── app.js              # Frontend UI Interaction & Async API Logic
├── src/                    # Source folder to keep backend modular
│   ├── controllers/        # NEW: Holds data handling & business logic
│   │   ├── farmerController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   └── routes/             # Cleaner routing gates
│       ├── farmerRoutes.js
│       ├── productRoutes.js
│       └── orderRoutes.js
├── server.js               # Main Core Server Application Entry Script
├── package.json            # Project Dependencies Registry
└── README.md               # Project Landing Manual Runbook
