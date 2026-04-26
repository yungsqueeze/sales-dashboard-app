# 📊 SalesLens — Business Analytics Dashboard

A full-stack-ready React dashboard that lets users upload CSV sales data
and instantly visualize revenue trends, top products, regional performance,
and category breakdowns.

---

## 🚀 Getting Started in VS Code

### Step 1 — Open the project
Unzip the folder and open it in VS Code:
- File → Open Folder → select `sales-dashboard`

### Step 2 — Open the terminal in VS Code
- Press: `Ctrl + `` ` (backtick) on Windows/Linux
- Press: `Cmd + `` ` on Mac

### Step 3 — Install dependencies
```bash
npm install
```
Wait for it to finish (usually 1–2 minutes).

### Step 4 — Start the app
```bash
npm start
Your browser will open at: http://localhost:3000

---

## 📁 Project Structure

```
sales-dashboard/
├── public/
│   ├── index.html          # HTML template
│   └── sample_data.csv     # Sample sales data for testing
├── src/
│   ├── App.js              # Main dashboard component
│   ├── App.css             # All styles
│   └── index.js            # React entry point
├── package.json            # Dependencies
└── README.md               # This file
```

---

## 📄 CSV Format

Your CSV must have these columns (headers are case-sensitive):

| Column   | Example        | Description               |
|----------|----------------|---------------------------|
| date     | 2024-01-15     | Transaction date (YYYY-MM-DD) |
| product  | Laptop Pro     | Product name              |
| category | Electronics    | Product category          |
| revenue  | 1299           | Price per unit            |
| units    | 3              | Units sold                |
| region   | North          | Sales region              |

---

## 📊 Features

- CSV file upload via drag & drop or file picker
- Sample data loader for instant demo
- 4 KPI stat cards (Total Revenue, Units Sold, Avg Order Value, Regions)
- Monthly revenue line chart
- Category breakdown donut chart
- Revenue by region bar chart
- Top 5 products bar chart
- Recent transactions table
- Fully responsive layout

---

## 🛠️ Tech Stack

- React 18
- Recharts (charts)
- PapaParse (CSV parsing)
- Lucide React (icons)
- Google Fonts (Syne + DM Mono)

---

## 🌐 Deploying to Vercel (Free)

1. Push your project to GitHub
2. Go to vercel.com and sign up
3. Click "New Project" → Import your GitHub repo
4. Click Deploy — done!

Your live URL will be: `https://your-project.vercel.app`

---

## 💼 Contra Portfolio Description

> "Built a full-stack analytics dashboard that allows business owners to upload
> their CSV sales data and instantly visualize revenue trends, top products,
> regional performance, and category breakdowns. Built with React, Recharts,
> and PapaParse — deployed on Vercel."

**Tags:** React, Data Visualization, Dashboard, Analytics, JavaScript, CSV
