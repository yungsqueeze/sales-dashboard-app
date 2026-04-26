import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Upload, TrendingUp, DollarSign, Package, MapPin, RefreshCw } from 'lucide-react';
import './App.css';

const COLORS = ['#00ff87', '#00d4ff', '#ff6b6b', '#ffd93d', '#c77dff', '#ff9a3c'];

function parseData(raw) {
  return raw.filter(r => r.date && r.revenue);
}

function getMonthlyRevenue(data) {
  const map = {};
  data.forEach(r => {
    const month = r.date.slice(0, 7);
    map[month] = (map[month] || 0) + parseFloat(r.revenue) * parseInt(r.units);
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month: month.slice(5) + '/' + month.slice(2, 4), revenue }));
}

function getTopProducts(data) {
  const map = {};
  data.forEach(r => {
    map[r.product] = (map[r.product] || 0) + parseFloat(r.revenue) * parseInt(r.units);
  });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, revenue]) => ({ name, revenue }));
}

function getCategoryBreakdown(data) {
  const map = {};
  data.forEach(r => {
    map[r.category] = (map[r.category] || 0) + parseFloat(r.revenue) * parseInt(r.units);
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function getRegionData(data) {
  const map = {};
  data.forEach(r => {
    map[r.region] = (map[r.region] || 0) + parseFloat(r.revenue) * parseInt(r.units);
  });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .map(([region, revenue]) => ({ region, revenue }));
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color + '22', color }}>
        <Icon size={20} />
      </div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <h3 className="stat-value">{value}</h3>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const processFile = (file) => {
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = parseData(results.data);
        setData(parsed);
        setLoaded(true);
      }
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) processFile(file);
  }, []);

  const loadSample = () => {
    fetch('/sample_data.csv')
      .then(r => r.text())
      .then(text => {
        const results = Papa.parse(text, { header: true, skipEmptyLines: true });
        setData(parseData(results.data));
        setFileName('sample_data.csv');
        setLoaded(true);
      });
  };

  const reset = () => { setData([]); setFileName(''); setLoaded(false); };

  const totalRevenue = data.reduce((s, r) => s + parseFloat(r.revenue) * parseInt(r.units), 0);
  const totalUnits = data.reduce((s, r) => s + parseInt(r.units), 0);
  const uniqueProducts = [...new Set(data.map(r => r.product))].length;
  const uniqueRegions = [...new Set(data.map(r => r.region))].length;

  const monthly = getMonthlyRevenue(data);
  const topProducts = getTopProducts(data);
  const categories = getCategoryBreakdown(data);
  const regions = getRegionData(data);

  const fmt = (n) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">📊</div>
          <div>
            <h1 className="header-title">SalesLens</h1>
            <p className="header-sub">Business Analytics Dashboard</p>
          </div>
        </div>
        {loaded && (
          <button className="reset-btn" onClick={reset}>
            <RefreshCw size={14} /> Reset
          </button>
        )}
      </header>

      {!loaded ? (
        <div className="upload-screen">
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <Upload size={40} className="upload-icon" />
            <h2>Drop your CSV file here</h2>
            <p>or click to browse your files</p>
            <label className="file-btn">
              Choose File
              <input type="file" accept=".csv" onChange={handleFile} hidden />
            </label>
            <div className="divider"><span>or</span></div>
            <button className="sample-btn" onClick={loadSample}>
              Load Sample Data
            </button>
            <p className="csv-hint">CSV must have: date, product, category, revenue, units, region</p>
          </div>
        </div>
      ) : (
        <main className="dashboard">
          <div className="file-badge">📁 {fileName} — {data.length} records loaded</div>

          {/* Stat Cards */}
          <div className="stats-grid">
            <StatCard icon={DollarSign} label="Total Revenue" value={fmt(totalRevenue)} sub={`${monthly.length} months`} color="#00ff87" />
            <StatCard icon={Package} label="Units Sold" value={totalUnits.toLocaleString()} sub={`${uniqueProducts} products`} color="#00d4ff" />
            <StatCard icon={TrendingUp} label="Avg Order Value" value={fmt(totalRevenue / data.length)} sub="per transaction" color="#c77dff" />
            <StatCard icon={MapPin} label="Regions" value={uniqueRegions} sub="sales territories" color="#ffd93d" />
          </div>

          {/* Charts Row 1 */}
          <div className="charts-row">
            <div className="chart-card wide">
              <h3 className="chart-title">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#888" tick={{ fill: '#aaa', fontSize: 12 }} />
                  <YAxis stroke="#888" tick={{ fill: '#aaa', fontSize: 12 }} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'} />
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1a1a2e', border: '1px solid #00ff8733', borderRadius: 8, color: '#fff' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#00ff87" strokeWidth={2.5} dot={{ fill: '#00ff87', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Category Split</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={categories} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                    {categories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 8, color: '#fff' }} />
                  <Legend formatter={(v) => <span style={{ color: '#ccc', fontSize: 12 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="charts-row">
            <div className="chart-card">
              <h3 className="chart-title">Revenue by Region</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={regions} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" stroke="#888" tick={{ fill: '#aaa', fontSize: 11 }} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'} />
                  <YAxis type="category" dataKey="region" stroke="#888" tick={{ fill: '#aaa', fontSize: 12 }} width={50} />
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                    {regions.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card wide">
              <h3 className="chart-title">Top Products by Revenue</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#888" tick={{ fill: '#aaa', fontSize: 11 }} />
                  <YAxis stroke="#888" tick={{ fill: '#aaa', fontSize: 11 }} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'} />
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {topProducts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="chart-card">
            <h3 className="chart-title">Recent Transactions</h3>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th><th>Product</th><th>Category</th>
                    <th>Units</th><th>Revenue</th><th>Region</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(-10).reverse().map((r, i) => (
                    <tr key={i}>
                      <td>{r.date}</td>
                      <td>{r.product}</td>
                      <td><span className="badge">{r.category}</span></td>
                      <td>{r.units}</td>
                      <td className="green">{fmt(parseFloat(r.revenue) * parseInt(r.units))}</td>
                      <td>{r.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
