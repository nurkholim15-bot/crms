import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Battery,
  Shield,
  Search,
  User,
  CheckCircle,
  TrendingUp,
  Layers,
  Radio,
  ExternalLink,
  ChevronRight,
  Eye,
  Activity,
  Zap
} from 'lucide-react';
import { getLiveCollectors, getCollectorRouteHistory, pingLocation } from '../services/api';

const GeoTrackerView = () => {
  const [collectors, setCollectors] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [routeHistory, setRouteHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Route Playback Animation States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Fetch live collectors
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getLiveCollectors(filterStatus !== 'ALL' ? { status: filterStatus } : {});
      setCollectors(res.data.data || []);
      setAnalytics(res.data.analytics || null);
      if (res.data.data && res.data.data.length > 0 && !selectedCollector) {
        handleSelectCollector(res.data.data[0]);
      }
    } catch (err) {
      console.error('Gagal mengambil data live collectors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Polling 15 detik
    return () => clearInterval(interval);
  }, [filterStatus]);

  // Pilih kolektor & load rekam jejak rute
  const handleSelectCollector = async (collector) => {
    setSelectedCollector(collector);
    setIsPlaying(false);
    setCurrentStepIndex(0);
    try {
      const res = await getCollectorRouteHistory(collector.collector_username);
      setRouteHistory(res.data.route || []);
    } catch (err) {
      console.error('Gagal mengambil riwayat rute:', err);
      setRouteHistory([]);
    }
  };

  // Playback timer effect
  useEffect(() => {
    let timer;
    if (isPlaying && routeHistory.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= routeHistory.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, routeHistory]);

  const handleSimulatePing = async () => {
    if (!selectedCollector) return;
    try {
      // Tambahkan pergeseran koordinat mikro
      const randomOffset = (Math.random() - 0.5) * 0.003;
      await pingLocation({
        collector_username: selectedCollector.collector_username,
        lat: Number((selectedCollector.current_lat + randomOffset).toFixed(6)),
        lng: Number((selectedCollector.current_lng + randomOffset).toFixed(6)),
        status: 'IN_TRANSIT',
        location_name: `Jl. Protokol Sudirman Kav. ${Math.floor(Math.random() * 50) + 1}`,
        activity_type: 'TRANSIT',
        speed_kmh: 38.5,
        battery_pct: Math.max(15, selectedCollector.battery_pct - 1),
      });
      fetchData();
      if (selectedCollector) {
        const res = await getCollectorRouteHistory(selectedCollector.collector_username);
        setRouteHistory(res.data.route || []);
      }
    } catch (err) {
      alert('Gagal simulasi ping: ' + err.message);
    }
  };

  const filteredCollectors = collectors.filter((c) => {
    const matchName = c.collector_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.collector_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.agency_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchName;
  });

  // Konversi koordinat Jakarta ke koordinat SVG Canvas (Lat -6.15 s/d -6.25, Lng 106.75 s/d 106.90)
  const mapCoords = (lat, lng) => {
    const minLat = -6.26;
    const maxLat = -6.14;
    const minLng = 106.76;
    const maxLng = 106.90;

    const x = ((lng - minLng) / (maxLng - minLng)) * 760 + 20;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 460 + 20;
    return { x: Math.max(20, Math.min(780, x)), y: Math.max(20, Math.min(480, y)) };
  };

  const getStatusBadge = (status, anomaly) => {
    if (anomaly) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 animate-pulse border border-rose-300">
          <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" />
          ANOMALY ALERT
        </span>
      );
    }
    switch (status) {
      case 'VISITING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
            VISITING
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <Navigation className="w-3 h-3 mr-1 text-blue-600" />
            IN TRANSIT
          </span>
        );
      case 'IDLE':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 mr-1 text-amber-600" />
            IDLE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & KPI Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GeoTracker - Real-time Field Collector Monitoring</h1>
              <p className="text-sm text-gray-500">
                Pemantauan GPS interaktif petugas lapangan, rekam rute harian, & deteksi anomali waktu jeda (Idle Anomaly)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh GPS
          </button>
          <button
            onClick={handleSimulatePing}
            className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <Zap className="w-4 h-4" />
            Simulasi Gerakan Kolektor
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kolektor Aktif</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{analytics.total_active}</div>
            <div className="text-xs text-gray-500 mt-1">Total armada di lapangan</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
            <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Sedang Kunjungan (Visiting)</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{analytics.visiting_count}</div>
            <div className="text-xs text-emerald-600 mt-1">Interaksi tatap muka aktif</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-sm">
            <div className="text-xs font-medium text-blue-700 uppercase tracking-wider">Dalam Perjalanan (Transit)</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{analytics.in_transit_count}</div>
            <div className="text-xs text-blue-600 mt-1">Mobilisasi rute tujuan</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-sm">
            <div className="text-xs font-medium text-amber-700 uppercase tracking-wider">Rata-rata Waktu Idle</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">{analytics.avg_idle_minutes} mnt</div>
            <div className="text-xs text-amber-600 mt-1">Batas wajar: maks 60 mnt</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-sm">
            <div className="text-xs font-medium text-rose-700 uppercase tracking-wider">Deteksi Anomali</div>
            <div className="text-2xl font-bold text-rose-700 mt-1 flex items-center">
              {analytics.anomaly_count}
              {analytics.anomaly_count > 0 && <span className="ml-2 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>}
            </div>
            <div className="text-xs text-rose-600 mt-1">Idle time & speed outlier</div>
          </div>
        </div>
      )}

      {/* Anomaly Banner jika ada */}
      {collectors.some((c) => c.anomaly_flag) && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-rose-800">
              Peringatan Supervisor: Terdeteksi Anomali Lapangan
            </h3>
            <div className="text-xs text-rose-700 mt-1">
              {collectors
                .filter((c) => c.anomaly_flag)
                .map((c) => (
                  <p key={c.id}>
                    • <strong>{c.collector_name}</strong> ({c.agency_name}): {c.anomaly_reason} (Posisi: {c.current_location_name})
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content: Map & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Live Map & Playback Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Map Header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Peta GPS DKI Jakarta & Koridor Penagihan
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                  Live GPS Track
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Terakhir update: {analytics ? analytics.last_sync : '-'}
              </div>
            </div>

            {/* Interactive Vector / SVG Map of Jakarta */}
            <div className="relative bg-slate-900 h-[480px] w-full select-none overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 500">
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                  </pattern>
                  <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                </defs>

                <rect width="800" height="500" fill="#0f172a" />
                <rect width="800" height="500" fill="url(#grid)" />

                {/* Arteri / Main Road Network Jakarta Simulation */}
                <path d="M 100 240 Q 250 260 400 245 T 700 250" fill="none" stroke="url(#roadGrad)" strokeWidth="8" strokeOpacity="0.4" />
                <path d="M 390 40 Q 405 220 410 460" fill="none" stroke="url(#roadGrad)" strokeWidth="10" strokeOpacity="0.5" />
                <path d="M 220 120 L 580 380" fill="none" stroke="url(#roadGrad)" strokeWidth="6" strokeOpacity="0.3" />
                <path d="M 280 440 L 520 80" fill="none" stroke="url(#roadGrad)" strokeWidth="6" strokeOpacity="0.3" />

                {/* Landmark Labels */}
                <text x="390" y="220" fill="#64748b" fontSize="11" fontWeight="bold">SUDIRMAN - THAMRIN</text>
                <text x="440" y="270" fill="#475569" fontSize="10">SCBD</text>
                <text x="210" y="150" fill="#475569" fontSize="10">GROGOL (JAKBAR)</text>
                <text x="560" y="230" fill="#475569" fontSize="10">MATRAMAN (JAKTIM)</text>
                <text x="460" y="390" fill="#475569" fontSize="10">FATMAWATI (JAKSEL)</text>
                <text x="340" y="90" fill="#475569" fontSize="10">MONAS / GAMBIR</text>

                {/* Animated Route Line for Selected Collector */}
                {routeHistory.length > 1 && (
                  <>
                    <polyline
                      points={routeHistory
                        .map((p) => {
                          const c = mapCoords(p.lat, p.lng);
                          return `${c.x},${c.y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="3"
                      strokeDasharray="6,4"
                      className="opacity-70"
                    />

                    {/* Sequential Route Stop Points */}
                    {routeHistory.map((pt, idx) => {
                      const pos = mapCoords(pt.lat, pt.lng);
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <g key={pt.id || idx}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={isCurrent ? 8 : 5}
                            fill={isCurrent ? '#4f46e5' : '#94a3b8'}
                            stroke="#ffffff"
                            strokeWidth={isCurrent ? 3 : 1.5}
                          />
                          <text
                            x={pos.x + 8}
                            y={pos.y + 4}
                            fill="#cbd5e1"
                            fontSize="9"
                            fontWeight="bold"
                          >
                            #{pt.sequence_order} {pt.activity_type}
                          </text>
                        </g>
                      );
                    })}
                  </>
                )}

                {/* Live Markers for all collectors */}
                {collectors.map((c) => {
                  const pos = mapCoords(c.current_lat, c.current_lng);
                  const isSelected = selectedCollector && selectedCollector.id === c.id;

                  let color = '#10b981'; // Green visiting
                  if (c.anomaly_flag) color = '#ef4444'; // Red anomaly
                  else if (c.status === 'IN_TRANSIT') color = '#3b82f6'; // Blue transit
                  else if (c.status === 'IDLE') color = '#f59e0b'; // Amber idle

                  return (
                    <g
                      key={c.id}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onClick={() => handleSelectCollector(c)}
                    >
                      {/* Pulse Circle for active/visiting */}
                      {(c.status === 'VISITING' || c.anomaly_flag) && (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="16"
                          fill={color}
                          opacity="0.25"
                          className="animate-ping"
                        />
                      )}

                      {/* Outer Ring if selected */}
                      {isSelected && (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="14"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeDasharray="3,2"
                        />
                      )}

                      {/* Main Marker Circle */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="9"
                        fill={color}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />

                      {/* Collector Short Initial */}
                      <text
                        x={pos.x}
                        y={pos.y + 3}
                        fill="#ffffff"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {c.collector_username.slice(-1).toUpperCase()}
                      </text>

                      {/* Floating Tooltip Label */}
                      <rect
                        x={pos.x - 45}
                        y={pos.y - 28}
                        width="90"
                        height="18"
                        rx="4"
                        fill="#1e293b"
                        stroke={isSelected ? '#818cf8' : '#334155'}
                        strokeWidth="1"
                        opacity="0.9"
                      />
                      <text
                        x={pos.x}
                        y={pos.y - 16}
                        fill="#f8fafc"
                        fontSize="8.5"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {c.collector_name.split(' ')[0]} ({c.status})
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Map Controls Overlay */}
              <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur border border-slate-700 rounded-lg p-2.5 text-xs text-slate-300 space-y-1.5 shadow-lg">
                <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                  Legenda Status GPS
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Visiting (Tatap Muka)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>In-Transit (Bergerak)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Idle (Diam)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>Anomaly (Mencurigakan)</span>
                </div>
              </div>

              {/* Quick Info Box for Selected Collector on Map */}
              {selectedCollector && (
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-3 text-xs text-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                      {selectedCollector.collector_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {selectedCollector.collector_name}
                      </div>
                      <div className="text-slate-400">
                        {selectedCollector.agency_name} • Posisi: {selectedCollector.current_location_name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
                      Baterai: {selectedCollector.battery_pct}%
                    </span>
                    <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
                      Akurasi: ±{selectedCollector.accuracy_meters}m
                    </span>
                    {getStatusBadge(selectedCollector.status, selectedCollector.anomaly_flag)}
                  </div>
                </div>
              )}
            </div>

            {/* Route Playback & Animated Controller */}
            {selectedCollector && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <Play className="w-4 h-4 text-indigo-600" />
                      Location History & Animated Route Playback
                    </h3>
                    <p className="text-xs text-gray-500">
                      Putar ulang visualisasi pergerakan riwayat rute harian ({routeHistory.length} titik tercatat)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      disabled={routeHistory.length === 0}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm ${
                        isPlaying
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {isPlaying ? 'Pause Playback' : 'Play Animated Route'}
                    </button>
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIndex(0);
                      }}
                      className="px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Timeline Stepper */}
                {routeHistory.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Titik Awal (Check-in Cabang)</span>
                      <span className="font-semibold text-indigo-700">
                        Titik #{currentStepIndex + 1} dari {routeHistory.length}: {routeHistory[currentStepIndex]?.location_name}
                      </span>
                      <span>Posisi Terkini</span>
                    </div>

                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max={routeHistory.length - 1}
                        value={currentStepIndex}
                        onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>

                    {/* Detail Titik Aktif Playback */}
                    {routeHistory[currentStepIndex] && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                            #{routeHistory[currentStepIndex].sequence_order}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {routeHistory[currentStepIndex].activity_type}
                          </span>
                          {routeHistory[currentStepIndex].debtor_name && (
                            <span className="text-gray-600">
                              (Debitur: {routeHistory[currentStepIndex].debtor_name})
                            </span>
                          )}
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-500">
                            {routeHistory[currentStepIndex].notes}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500">
                          <span>Durasi: {routeHistory[currentStepIndex].duration_minutes} mnt</span>
                          <span>Kecepatan: {routeHistory[currentStepIndex].speed_kmh} km/jam</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Collector List & Time Analytics Pane (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama kolektor / agensi..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
              {['ALL', 'VISITING', 'IN_TRANSIT', 'IDLE'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
                    filterStatus === st
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Collectors List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-700 uppercase tracking-wider">
              Daftar Petugas Lapangan ({filteredCollectors.length})
            </div>

            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
              {filteredCollectors.map((c) => {
                const isSelected = selectedCollector && selectedCollector.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCollector(c)}
                    className={`p-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-gray-900">{c.collector_name}</div>
                      {getStatusBadge(c.status, c.anomaly_flag)}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                      {c.agency_name}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {c.today_visits_count} Kunjungan
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        Idle: {c.today_idle_minutes}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Battery className="w-3 h-3 text-gray-400" />
                        {c.battery_pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Analytics Pane for Selected Collector */}
          {selectedCollector && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Time Analytics & Verifikasi Lapangan
                </h3>
                <p className="text-xs text-gray-500">
                  Rincian alokasi waktu produktif vs non-produktif hari ini
                </p>
              </div>

              {/* Progress Bar Analisis Waktu */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Waktu Kunjungan (Spent)</span>
                  <span className="text-emerald-700 font-bold">{selectedCollector.today_spent_minutes} mnt</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (selectedCollector.today_spent_minutes / 180) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Waktu Perjalanan (Transit)</span>
                  <span className="text-blue-700 font-bold">{selectedCollector.transit_time_minutes} mnt</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (selectedCollector.transit_time_minutes / 180) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Waktu Diam (Idle Time)</span>
                  <span className={`${selectedCollector.today_idle_minutes > 120 ? 'text-rose-700 font-bold' : 'text-amber-700 font-bold'}`}>
                    {selectedCollector.today_idle_minutes} mnt
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${selectedCollector.today_idle_minutes > 120 ? 'bg-rose-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, (selectedCollector.today_idle_minutes / 180) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Anomaly Check Details */}
              <div className={`p-3 rounded-lg border text-xs ${
                selectedCollector.anomaly_flag
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {selectedCollector.anomaly_flag ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  )}
                  {selectedCollector.anomaly_flag ? 'Anomali Terdeteksi' : 'Rute Lapangan Sesuai SOP'}
                </div>
                <div className="mt-1 text-[11px] leading-relaxed">
                  {selectedCollector.anomaly_flag
                    ? selectedCollector.anomaly_reason
                    : 'Tidak ditemukan pelanggaran batas idle time atau lonjakan koordinat abnormal.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeoTrackerView;
