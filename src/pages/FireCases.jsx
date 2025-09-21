import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts';

function FireCasesDashboard() {
  const [fireCases, setFireCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    barangay: '',
    purok: '',
    date: '',
    year: new Date().getFullYear().toString(),
    damageCost: ''
  });

  const barangays = [
    'Balantacan', 'Bancal Sinubli', 'Bancal Pugad', 'Baruya (San Rafael)', 'Calangain', 
    'Concepcion', 'Del Carmen', 'De La Paz', 'Don Ignacio Dimson', 'Lourdes (Lauc Pau)', 
    'Prado Siongco', 'Remedios', 'San Agustin', 'San Antonio', 'San Francisco', 
    'San Isidro', 'San Jose Apunan', 'San Jose Gumi', 'San Juan (Poblacion)', 'San Matias', 
    'San Miguel', 'San Nicolas 1st (Poblacion)', 'San Nicolas 2nd', 'San Pablo 1st', 'San Pablo 2nd', 
    'San Pedro Palcarangan', 'San Pedro Saug', 'San Roque Arbol', 'San Roque Dau', 'San Vicente', 
    'Santa Barbara', 'Santa Catalina', 'Santa Cruz', 'Santa Lucia (Poblacion)', 'Santa Maria', 
    'Santa Monica', 'Santa Rita', 'Santa Teresa 1st', 'Santa Teresa 2nd', 'Santiago', 
    'Santo Domingo', 'Santo Niño (Prado Aruba or Prado Saba)', 'Santo Tomas (Poblacion)', 'Santo Cristo'
  ];

  const puroks = ['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6'];
  const years = ['2021', '2022', '2023', '2024', '2025'];
  const COLORS = ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#059669', '#0891b2', '#0284c7', '#3b82f6', '#6366f1'];

  useEffect(() => {
    fetchFireCases();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const fetchFireCases = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/firecases/getFire');
      if (response.ok) {
        const data = await response.json();
        setFireCases(data.fires || []);
      } else {
        setFireCases([]);
        showNotification('Failed to fetch fire cases', 'error');
      }
    } catch (error) {
      setFireCases([]);
      showNotification('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editMode 
        ? `http://localhost:3000/api/firecases/updateFire/${selectedCase._id}`
        : 'http://localhost:3000/firecases/createFire';
      
      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          damageCost: formData.damageCost.toString().replace(/,/g, '') + ' PHP'
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        setEditMode(false);
        resetForm();
        fetchFireCases();
        showNotification(
          editMode ? 'Fire incident updated successfully!' : 'Fire incident reported successfully!',
          'success'
        );
      } else {
        showNotification(
          editMode ? 'Failed to update fire incident' : 'Failed to report fire incident',
          'error'
        );
      }
    } catch (error) {
      showNotification('Error submitting form', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fire incident?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/firecases/deleteFire/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchFireCases();
          setSelectedCase(null);
          showNotification('Fire incident deleted successfully!', 'success');
        } else {
          showNotification('Failed to delete fire incident', 'error');
        }
      } catch (error) {
        showNotification('Error deleting fire case', 'error');
      }
    }
  };

  const handleEdit = (fireCase) => {
    const damageCost = fireCase.damageCost.replace(' PHP', '').replace(/,/g, '');
    setFormData({
      barangay: fireCase.barangay,
      purok: fireCase.purok,
      date: fireCase.date.split('T')[0],
      year: fireCase.year.toString(),
      damageCost: damageCost
    });
    setEditMode(true);
    setSelectedCase(fireCase);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      barangay: '',
      purok: '',
      date: '',
      year: new Date().getFullYear().toString(),
      damageCost: ''
    });
    setSelectedCase(null);
    setEditMode(false);
  };

  const getYearlyAnalysis = () => {
    if (!Array.isArray(fireCases)) return [];
    
    const yearlyData = {};
    fireCases.forEach(fireCase => {
      if (fireCase && fireCase.year) {
        const year = fireCase.year.toString();
        if (!yearlyData[year]) {
          yearlyData[year] = { 
            year, 
            cases: 0, 
            totalDamage: 0,
            averageDamage: 0
          };
        }
        yearlyData[year].cases += 1;
        
        const damage = parseInt(fireCase.damageCost?.replace(/[^\d]/g, '') || '0');
        yearlyData[year].totalDamage += damage;
      }
    });

    return Object.values(yearlyData).map(data => ({
      ...data,
      averageDamage: data.cases > 0 ? data.totalDamage / data.cases : 0
    })).sort((a, b) => a.year.localeCompare(b.year));
  };

  const getMonthlyTrendsDetailed = () => {
    if (!Array.isArray(fireCases)) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map(month => ({ month, cases: 0, damage: 0 }));
    
    fireCases.forEach(fireCase => {
      if (fireCase && fireCase.date) {
        try {
          const date = new Date(fireCase.date);
          const monthIndex = date.getMonth();
          const damage = parseInt(fireCase.damageCost?.replace(/[^\d]/g, '') || '0');
          
          monthlyData[monthIndex].cases += 1;
          monthlyData[monthIndex].damage += damage;
        } catch (error) {
          console.error('Error parsing date:', fireCase.date);
        }
      }
    });
    
    return monthlyData;
  };

  const getTopBarangays = () => {
    if (!Array.isArray(fireCases)) return [];
    
    const barangayStats = {};
    fireCases.forEach(fireCase => {
      if (fireCase && fireCase.barangay) {
        if (!barangayStats[fireCase.barangay]) {
          barangayStats[fireCase.barangay] = {
            barangay: fireCase.barangay,
            cases: 0,
            totalDamage: 0
          };
        }
        barangayStats[fireCase.barangay].cases += 1;
        const damage = parseInt(fireCase.damageCost?.replace(/[^\d]/g, '') || '0');
        barangayStats[fireCase.barangay].totalDamage += damage;
      }
    });
    
    return Object.values(barangayStats)
      .sort((a, b) => b.cases - a.cases)
      .slice(0, 10);
  };

  const getAnalytics = () => {
    if (!Array.isArray(fireCases)) {
      return { totalCases: 0, totalDamage: 0, averageDamage: 0, currentYearCases: 0 };
    }

    const currentYear = new Date().getFullYear();
    const currentYearCases = fireCases.filter(fireCase => {
      if (!fireCase || !fireCase.year) return false;
      return parseInt(fireCase.year) === currentYear;
    }).length;

    const totalDamage = fireCases.reduce((sum, fireCase) => {
      const damage = parseInt(fireCase.damageCost?.replace(/[^\d]/g, '') || '0');
      return sum + damage;
    }, 0);

    return {
      totalCases: fireCases.length,
      totalDamage,
      averageDamage: fireCases.length > 0 ? totalDamage / fireCases.length : 0,
      currentYearCases
    };
  };

  const getSeasonalData = () => {
    if (!Array.isArray(fireCases)) return [];
    
    const seasons = {
      'Dry Season (Nov-Apr)': 0,
      'Wet Season (May-Oct)': 0
    };
    
    fireCases.forEach(fireCase => {
      if (fireCase && fireCase.date) {
        try {
          const month = new Date(fireCase.date).getMonth();
          if (month >= 10 || month <= 3) {
            seasons['Dry Season (Nov-Apr)'] += 1;
          } else {
            seasons['Wet Season (May-Oct)'] += 1;
          }
        } catch (error) {
          console.error('Error parsing date:', fireCase.date);
        }
      }
    });

    return Object.entries(seasons).map(([season, value]) => ({ season, value }));
  };

  const analytics = getAnalytics();
  const yearlyData = getYearlyAnalysis();
  const monthlyData = getMonthlyTrendsDetailed();
  const topBarangays = getTopBarangays();
  const seasonalData = getSeasonalData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading fire cases data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fire Incident Tracker</h1>
              <p className="text-gray-600">Lubao, Pampanga - Fire Safety Data</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Report Incident</span>
            </button>
          </div>

          <div className="flex space-x-8 mb-6">
            {[
              { key: 'overview', label: 'Summary' },
              { key: 'yearly', label: 'By Year' },
              { key: 'monthly', label: 'By Month' },
              { key: 'cases', label: 'All Cases' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.key
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 5.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">All Fire Incidents</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalCases}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Year ({new Date().getFullYear()})</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.currentYearCases}</p>
                    <p className="text-xs text-gray-500">fire incidents</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Money Lost</p>
                    <p className="text-2xl font-bold text-gray-900">₱{analytics.totalDamage.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">from all fires</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Cost Per Fire</p>
                    <p className="text-2xl font-bold text-gray-900">₱{Math.round(analytics.averageDamage).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">typical damage</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">When Do Most Fires Happen?</h3>
                <p className="text-sm text-gray-600 mb-4">Compare dry season vs wet season fires</p>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={seasonalData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ season, value }) => `${value} fires`}
                    >
                      {seasonalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} fires`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm text-gray-600">
                  <p><span className="font-medium">Dry Season:</span> November to April (hotter months)</p>
                  <p><span className="font-medium">Wet Season:</span> May to October (rainy months)</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Areas with Most Fire Problems</h3>
                <p className="text-sm text-gray-600 mb-4">Barangays that need more fire safety attention</p>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {topBarangays.slice(0, 8).map((barangay, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{barangay.barangay}</p>
                        <p className="text-sm text-gray-600">{barangay.cases} fire incidents</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">₱{barangay.totalDamage.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Money Lost</p>
                      </div>
                    </div>
                  ))}
                </div>
                {topBarangays.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <p>No fire incidents recorded yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'yearly' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Fire Incidents by Year</h3>
              <p className="text-sm text-gray-600 mb-4">See how fire incidents and damage costs change each year</p>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="cases" orientation="left" label={{ value: 'Number of Fires', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="damage" orientation="right" label={{ value: 'Money Lost (PHP)', angle: 90, position: 'insideRight' }} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Total Money Lost' || name === 'Average Cost') {
                        return [`₱${value.toLocaleString()}`, name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="cases" dataKey="cases" name="Number of Fires" fill="#dc2626" />
                  <Line yAxisId="damage" type="monotone" dataKey="totalDamage" name="Total Money Lost" stroke="#ea580c" strokeWidth={3} />
                  <Line yAxisId="damage" type="monotone" dataKey="averageDamage" name="Average Cost" stroke="#d97706" strokeWidth={2} strokeDasharray="5 5" />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-gray-600 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
                  <span>Red bars = Number of fire incidents</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-orange-600 mr-2"></div>
                  <span>Orange line = Total money lost</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-yellow-600 border-dashed border-b-2 mr-2"></div>
                  <span>Dotted line = Average cost per fire</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Fire Growth Over Time</h3>
                <p className="text-sm text-gray-600 mb-4">Are fires getting more common?</p>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis label={{ value: 'Number of Fires', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} fires`, 'Incidents']} />
                    <Area type="monotone" dataKey="cases" stroke="#dc2626" fill="#fee2e2" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Money Lost Each Year</h3>
                <p className="text-sm text-gray-600 mb-4">How much damage fires cause</p>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis label={{ value: 'Cost (PHP)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value, name) => [`₱${value.toLocaleString()}`, name]} />
                    <Legend />
                    <Line type="monotone" dataKey="totalDamage" name="Total Cost" stroke="#dc2626" strokeWidth={3} />
                    <Line type="monotone" dataKey="averageDamage" name="Cost Per Fire" stroke="#ea580c" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Monthly Fire Pattern</h3>
              <p className="text-sm text-gray-600 mb-4">Which months have the most fires and damage</p>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="cases" orientation="left" label={{ value: 'Number of Fires', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="damage" orientation="right" label={{ value: 'Money Lost (PHP)', angle: 90, position: 'insideRight' }} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Money Lost') {
                        return [`₱${value.toLocaleString()}`, name];
                      }
                      return [`${value} fires`, name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="cases" dataKey="cases" name="Number of Fires" fill="#dc2626" />
                  <Line yAxisId="damage" type="monotone" dataKey="damage" name="Money Lost" stroke="#ea580c" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-gray-600">
                <p><span className="font-medium">Tip:</span> Higher bars mean more fires that month. Higher orange line means more money lost.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Fires Each Month</h3>
                <p className="text-sm text-gray-600 mb-4">Simple count of fire incidents by month</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Number of Fires', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} fires`, 'Total Incidents']} />
                    <Bar dataKey="cases" fill="#dc2626" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Problem Areas</h3>
                <p className="text-sm text-gray-600 mb-4">Barangays with the most fire incidents</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topBarangays} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" label={{ value: 'Number of Fires', position: 'insideBottom', offset: -10 }} />
                    <YAxis type="category" dataKey="barangay" width={120} />
                    <Tooltip formatter={(value) => [`${value} fires`, 'Total Incidents']} />
                    <Bar dataKey="cases" fill="#dc2626" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Fire Incident Records</h3>
                <p className="text-sm text-gray-600 mt-1">Complete list of reported fire cases</p>
              </div>
              
              {!Array.isArray(fireCases) || fireCases.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No fire incidents recorded</h3>
                  <p className="text-gray-500 mb-4">Start by reporting your first fire incident case.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                  >
                    Report First Incident
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {fireCases.map((fireCase, index) => (
                    <div
                      key={fireCase._id || index}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1" onClick={() => setSelectedCase(fireCase)}>
                          <div className="flex items-center space-x-3 mb-3 cursor-pointer">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {fireCase.barangay} - {fireCase.purok}
                            </h4>
                            <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              {fireCase.year}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 cursor-pointer">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium">Date:</span>
                              <span className="ml-1">{new Date(fireCase.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-medium">Location:</span>
                              <span className="ml-1">{fireCase.barangay}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <span className="font-medium">Damage:</span>
                              <span className="ml-1 font-semibold text-red-600">{fireCase.damageCost}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(fireCase);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(fireCase._id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editMode ? 'Edit Fire Incident' : 'Report Fire Incident'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Barangay</label>
                  <select
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="">Select Barangay</option>
                    {barangays.map(barangay => (
                      <option key={barangay} value={barangay}>{barangay}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purok</label>
                  <select
                    name="purok"
                    value={formData.purok}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    <option value="">Select Purok</option>
                    {puroks.map(purok => (
                      <option key={purok} value={purok}>{purok}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Incident</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    required
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Damage Cost (PHP)</label>
                <input
                  type="text"
                  name="damageCost"
                  value={formData.damageCost}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter damage cost (e.g., 500000)"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {editMode ? 'Update Incident' : 'Report Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCase && !showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Fire Incident Details</h2>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 716.343 5.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Fire Incident Report</h3>
                    <p className="text-red-700">Case ID: #{selectedCase._id}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{selectedCase.barangay}</p>
                    <p className="text-sm text-gray-600">{selectedCase.purok}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Incident</label>
                    <p className="mt-1 text-lg text-gray-900">{new Date(selectedCase.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <p className="mt-1 text-lg text-gray-900">{selectedCase.year}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Damage</label>
                    <p className="mt-1 text-2xl font-bold text-red-600">{selectedCase.damageCost}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(selectedCase)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedCase._id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FireCasesDashboard;