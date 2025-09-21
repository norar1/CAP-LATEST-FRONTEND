import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessPermit from './Building.jsx';
import Occupancy from './Occupancy.jsx';
import FSIC from './BusinessFSIC.jsx';
import FireCases from './FireCases.jsx';
import BFP from "../assets/BFPLubao.png";

function AdminDashboard({ setIsAuthenticated }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [buildingStats, setBuildingStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [occupancyStats, setOccupancyStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [fsicStats, setFsicStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setUserData(user);
    setLoading(false);

    const handleResize = () => {
      if (window.innerWidth < 768 && sidebarOpen) setSidebarOpen(false);
      else if (window.innerWidth >= 1024 && !sidebarOpen) setSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  useEffect(() => {
    if (activeSection === 'dashboard') fetchStats();
  }, [activeSection]);

  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [activeSection]);

  const fetchStats = async () => {
    try {
      const [buildingResponse, occupancyResponse, fsicResponse] = await Promise.all([
        fetch('http://localhost:3000/api/building/GetPermit'),
        fetch('http://localhost:3000/api/occupancy/GetPermit'),
        fetch('http://localhost:3000/api/businessfsic/data/GetPermit')
      ]);

      const buildingData = await buildingResponse.json();
      const occupancyData = await occupancyResponse.json();
      const fsicData = await fsicResponse.json();

      const buildingCounts = { pending: 0, approved: 0, rejected: 0 };
      const occupancyCounts = { pending: 0, approved: 0, rejected: 0 };
      const fsicCounts = { pending: 0, approved: 0, rejected: 0 };
      
      if (buildingData.success && buildingData.permits) {
        buildingData.permits.forEach(permit => {
          if (permit.status === 'pending') buildingCounts.pending++;
          else if (permit.status === 'approved') buildingCounts.approved++;
          else if (permit.status === 'rejected') buildingCounts.rejected++;
        });
      }

      if (occupancyData.success && occupancyData.permits) {
        occupancyData.permits.forEach(permit => {
          if (permit.status === 'pending') occupancyCounts.pending++;
          else if (permit.status === 'approved') occupancyCounts.approved++;
          else if (permit.status === 'rejected') occupancyCounts.rejected++;
        });
      }

      if (fsicData.success && fsicData.permits) {
        fsicData.permits.forEach(permit => {
          if (permit.status === 'pending') fsicCounts.pending++;
          else if (permit.status === 'approved') fsicCounts.approved++;
          else if (permit.status === 'rejected') fsicCounts.rejected++;
        });
      }

      setBuildingStats(buildingCounts);
      setOccupancyStats(occupancyCounts);
      setFsicStats(fsicCounts);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const StatCard = ({ title, value, type, bgGradient, icon }) => (
    <div className={`group relative backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${bgGradient}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600 uppercase">{type}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          <div className="text-xs text-gray-600">{title}</div>
        </div>
        <div className="flex-shrink-0">
          <div className="p-2 rounded-lg bg-white/30">{icon}</div>
        </div>
      </div>
    </div>
  );

  const PermitSection = ({ title, stats, gradient, accentColor }) => (
    <div className={`relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl ${gradient}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <div className={`w-1 h-6 ${accentColor} rounded-full`}></div>
          {title}
        </h3>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 ${accentColor} rounded-full animate-pulse`}></div>
          <span className="text-xs text-gray-600">Live</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatCard 
          title="Pending"
          value={stats.pending}
          type="Pending"
          bgGradient="bg-gradient-to-br from-yellow-50 to-orange-50"
          icon={<svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
          title="Approved"
          value={stats.approved}
          type="Approved"
          bgGradient="bg-gradient-to-br from-green-50 to-emerald-50"
          icon={<svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
          title="Rejected"
          value={stats.rejected}
          type="Rejected"
          bgGradient="bg-gradient-to-br from-red-50 to-pink-50"
          icon={<svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-4">
      <PermitSection 
        title="Building Permits"
        stats={buildingStats}
        gradient="bg-gradient-to-br from-blue-50 to-red-50"
        accentColor="bg-gradient-to-r from-blue-500 to-red-500"
      />
      
      <PermitSection 
        title="Occupancy Permits"
        stats={occupancyStats}
        gradient="bg-gradient-to-br from-blue-50 to-red-50"
        accentColor="bg-gradient-to-r from-blue-500 to-red-500"
      />
      
      <PermitSection 
        title="Business Permits"
        stats={fsicStats}
        gradient="bg-gradient-to-br from-blue-50 to-red-50"
        accentColor="bg-gradient-to-r from-blue-500 to-red-500"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { section: 'businessPermit', title: 'Building', icon: '🏗️', colors: 'from-blue-500 to-red-500', bg: 'from-blue-50 to-red-50' },
          { section: 'occupancy', title: 'Occupancy', icon: '🏠', colors: 'from-blue-500 to-red-500', bg: 'from-blue-50 to-red-50' },
          { section: 'fsic', title: 'Business Permit', icon: '🛡️', colors: 'from-blue-500 to-red-500', bg: 'from-blue-50 to-red-50' },
          { section: 'fireCases', title: 'Fire Cases', icon: '🚨', colors: 'from-blue-500 to-red-500', bg: 'from-blue-50 to-red-50' }
        ].map((item, idx) => (
          <div key={idx} 
            onClick={() => setActiveSection(item.section)}
            className={`group relative backdrop-blur-xl bg-gradient-to-br ${item.bg} border border-white/30 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <h3 className="text-sm font-bold text-gray-800 mb-1">{item.title}</h3>
            <button className={`w-full bg-gradient-to-r ${item.colors} text-white py-1 px-3 rounded-lg text-xs font-medium hover:shadow-lg transition-all duration-300`}>
              Access
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'businessPermit':
        return <BusinessPermit onUpdateStats={fetchStats} />;
      case 'occupancy':
        return <Occupancy onUpdateStats={fetchStats} />;
      case 'fsic':
        return <FSIC onUpdateStats={fetchStats} />;
      case 'fireCases':
        return <FireCases />;
      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-red-50 to-red-100">
        <div className="relative backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 border-3 border-blue-500/30 border-t-red-500 rounded-full animate-spin"></div>
            <h2 className="text-xl font-bold text-gray-800">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-red-50 to-red-100">
      <div className={`backdrop-blur-xl bg-white/10 border-r border-white/20 fixed lg:relative z-30 h-screen ${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'} flex flex-col transition-all duration-300 ${sidebarOpen ? 'left-0' : '-left-64 lg:left-0'} shadow-xl`}>
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={BFP} alt="BFP" className={`transition-all duration-300 rounded-xl ${sidebarOpen ? 'h-12 w-12' : 'h-10 w-10'}`} />
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-gray-800">Lubao Fire</h1>
                  <p className="text-xs text-gray-600">Admin Portal</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-all lg:hidden"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-2 pb-4 overflow-y-auto">
          {[
            { section: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { section: 'businessPermit', label: 'Building', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
            { section: 'occupancy', label: 'Occupancy', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { section: 'fsic', label: 'Business Permit', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { section: 'fireCases', label: 'Fire Cases', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
          ].map((item) => (
            <button
              key={item.section}
              onClick={() => setActiveSection(item.section)}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-xl transition-all ${
                activeSection === item.section
                  ? 'bg-white/30 text-gray-800 shadow-md'
                  : 'text-gray-600 hover:bg-white/20 hover:text-gray-800'
              }`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/20 mt-auto">
          {userData && sidebarOpen && (
            <div className="mb-3 p-2 rounded-xl bg-white/20 border border-white/30">
              <div className="text-xs font-medium text-gray-800">{userData.email}</div>
              <div className="text-xs text-gray-600">Administrator</div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-500 to-red-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span className="ml-2">Sign Out</span>}
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="mr-3 p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all lg:hidden"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {activeSection === 'dashboard' ? 'Fire Station Dashboard' :
                 activeSection === 'businessPermit' ? 'Building Permits' :
                 activeSection === 'occupancy' ? 'Occupancy Permits' :
                 activeSection === 'fsic' ? 'Business Permit Management' :
                 activeSection === 'fireCases' ? 'Fire Cases' : ''}
              </h1>
              <p className="text-sm text-gray-600">
                {activeSection === 'dashboard' ? 'Monitor permit activities and system status' :
                 'Manage permits and certificates efficiently'}
              </p>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;