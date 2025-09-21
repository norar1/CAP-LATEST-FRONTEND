import { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';

function BuildingPermit({ onUpdateStats }) {
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [formData, setFormData] = useState({
    date_received: '',
    owner_establishment: '',
    location: '',
    fcode_fee: '',
    or_no: '',
    evaluated_by: '',
    date_released_fsec: '',
    control_no: '',
    payment_status: 'not_paid',
    last_payment_date: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState({});

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    filterBuildings();
  }, [buildings, searchQuery, selectedMonth, selectedYear]);

  const fetchBuildings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/building/GetPermit');
      const data = await response.json();
      if (data.success && data.permits) {
        setBuildings(data.permits);
      } else {
        setBuildings([]);
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setBuildings([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchBuildings();
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/api/building/search?query=${searchQuery}`);
      const data = await response.json();
      if (data.success && data.permits) {
        setBuildings(data.permits);
      } else {
        setBuildings([]);
      }
    } catch (error) {
      console.error('Error searching buildings:', error);
      setBuildings([]);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleSearch(); 
    }
  };

  const filterBuildings = () => {
    let filtered = [...buildings];
    
    if (selectedMonth) {
      filtered = filtered.filter(building => {
        const date = new Date(building.date_received);
        const month = date.getMonth() + 1;
        return month.toString() === selectedMonth;
      });
    }
    
    if (selectedYear) {
      filtered = filtered.filter(building => {
        const date = new Date(building.date_received);
        const year = date.getFullYear();
        return year.toString() === selectedYear;
      });
    }
    
    filtered.sort((a, b) => new Date(b.date_received) - new Date(a.date_received));
    
    setFilteredBuildings(filtered);
    setCurrentPage(1);
  };

  const getRowColor = (building) => {
    if (building.status === 'approved') {
      return 'bg-green-100 hover:bg-green-200';
    }
    
    const currentYear = new Date().getFullYear();
    const buildingPaid = building.payment_status === 'paid';
    
    const buildingPaymentYear = building.last_payment_date 
      ? new Date(building.last_payment_date).getFullYear() 
      : null;
    
    const buildingCurrentYear = buildingPaid && buildingPaymentYear === currentYear;
    
    if (buildingCurrentYear) {
      return 'bg-blue-100 hover:bg-blue-200';
    } else {
      return 'bg-red-100 hover:bg-red-200';
    }
  };

  const handlePaymentStatusChange = async (buildingId, newStatus) => {
    try {
      const updateData = {
        payment_status: newStatus,
        last_payment_date: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null
      };

      const response = await fetch(`http://localhost:3000/api/building/UpdatePaymentStatus/${buildingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchBuildings();
        if (onUpdateStats) {
          onUpdateStats();
        }
      } else {
        console.error('Failed to update payment status:', data.message);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:3000/api/building/UpdatePermit/${editingId}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormData({
          date_received: '',
          owner_establishment: '',
          location: '',
          fcode_fee: '',
          or_no: '',
          evaluated_by: '',
          date_released_fsec: '',
          control_no: '',
          payment_status: 'not_paid',
          last_payment_date: ''
        });
        setEditingId(null);
        setShowForm(false);
        fetchBuildings();
        if (onUpdateStats) {
          onUpdateStats();
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (building) => {
    setFormData({
      date_received: building.date_received,
      owner_establishment: building.owner_establishment,
      location: building.location,
      fcode_fee: building.fcode_fee,
      or_no: building.or_no,
      evaluated_by: building.evaluated_by,
      date_released_fsec: building.date_released_fsec,
      control_no: building.control_no,
      payment_status: building.payment_status || 'not_paid',
      last_payment_date: building.last_payment_date || ''
    });
    setEditingId(building._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/building/DeletePermit/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
          fetchBuildings();
          if (onUpdateStats) {
            onUpdateStats();
          }
        }
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const building = buildings.find(b => b._id === id);
    const confirmMessage = `Are you sure you want to ${newStatus === 'approved' ? 'approve' : newStatus === 'rejected' ? 'reject' : 'set to pending'} the permit for ${building?.owner_establishment}?${newStatus !== 'pending' ? '\n\nAn email notification will be sent to the user.' : ''}`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsUpdatingStatus(prev => ({ ...prev, [id]: true }));

    try {
      const response = await fetch(`http://localhost:3000/api/building/UpdateStatus/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(data.message + (newStatus !== 'pending' ? ' Email notification has been sent to the user.' : ''));
        
        fetchBuildings();
        if (onUpdateStats) {
          onUpdateStats();
        }
      } else {
        console.error('API returned error:', data.message || 'Unknown error');
        alert('Failed to update status: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('An error occurred while updating the status: ' + error.message);
    } finally {
      setIsUpdatingStatus(prev => ({ ...prev, [id]: false }));
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Building Permits');
    
    let dataToExport = [];
    
    if (selectedMonth === '' && selectedYear === '') {
      dataToExport = buildings;
    } else {
      dataToExport = filteredBuildings;
    }
    
    dataToExport.sort((a, b) => new Date(b.date_received) - new Date(a.date_received));
    
    worksheet.columns = [
      { header: 'Date Received', key: 'date_received', width: 15 },
      { header: 'Owner/Establishment', key: 'owner_establishment', width: 25 },
      { header: 'Location', key: 'location', width: 25 },
      { header: 'FCODE Fee', key: 'fcode_fee', width: 12 },
      { header: 'OR No.', key: 'or_no', width: 15 },
      { header: 'Evaluated By', key: 'evaluated_by', width: 20 },
      { header: 'Date Released FSEC', key: 'date_released_fsec', width: 18 },
      { header: 'Control No.', key: 'control_no', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Payment Status', key: 'payment_status', width: 20 },
      { header: 'Payment Date', key: 'last_payment_date', width: 18 }
    ];

    dataToExport.forEach(item => {
      worksheet.addRow({
        date_received: item.date_received,
        owner_establishment: item.owner_establishment,
        location: item.location,
        fcode_fee: item.fcode_fee,
        or_no: item.or_no,
        evaluated_by: item.evaluated_by,
        date_released_fsec: item.date_released_fsec,
        control_no: item.control_no,
        status: item.status || 'pending',
        payment_status: item.payment_status === 'paid' ? 'Paid' : 'Not Paid',
        last_payment_date: item.last_payment_date || 'N/A'
      });
    });

    worksheet.getRow(1).font = { bold: true };
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Building_Permits_Report.xlsx';
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBuildings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBuildings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 mx-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          &laquo;
        </button>
        <button
          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 mx-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          &lsaquo;
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => paginate(1)}
              className="px-2 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              1
            </button>
            {startPage > 2 && <span className="mx-1">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-2 py-1 mx-1 rounded ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="mx-1">...</span>}
            <button
              onClick={() => paginate(totalPages)}
              className="px-2 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-2 py-1 mx-1 rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          &rsaquo;
        </button>
        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-2 py-1 mx-1 rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          &raquo;
        </button>
      </div>
    );
  };

  const getRowSize = () => {
    if (filteredBuildings.length > 15) {
      return 'py-1 text-xs';
    } else if (filteredBuildings.length > 8) {
      return 'py-2 text-xs';
    }
    return 'py-2 md:py-3 text-xs md:text-sm';
  };

  const rowSize = getRowSize();

  const renderForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto pt-10 pb-10">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-5xl mx-4 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
          <h3 className="text-lg md:text-xl font-bold text-blue-700">
            Update Building Permit
          </h3>
          <button 
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Date Received</label>
              <input
                type="date"
                name="date_received"
                value={formData.date_received}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Owner/Establishment</label>
              <input
                type="text"
                name="owner_establishment"
                value={formData.owner_establishment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1 text-sm">FCODE Fee</label>
              <input
                type="number"
                name="fcode_fee"
                value={formData.fcode_fee}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1 text-sm">OR No.</label>
              <input
                type="text"
                name="or_no"
                value={formData.or_no}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Evaluated By</label>
              <input
                type="text"
                name="evaluated_by"
                value={formData.evaluated_by}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Date Released FSEC</label>
              <input
                type="date"
                name="date_released_fsec"
                value={formData.date_released_fsec}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Control No.</label>
              <input
                type="text"
                name="control_no"
                value={formData.control_no}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">Payment Status</label>
              <select
                name="payment_status"
                value={formData.payment_status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="not_paid">Not Paid</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {formData.payment_status === 'paid' && (
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Payment Date</label>
                <input
                  type="date"
                  name="last_payment_date"
                  value={formData.last_payment_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end sticky bottom-0 bg-white pt-2 border-t">
            <button 
              type="button" 
              onClick={() => {
                setFormData({
                  date_received: '',
                  owner_establishment: '',
                  location: '',
                  fcode_fee: '',
                  or_no: '',
                  evaluated_by: '',
                  date_released_fsec: '',
                  control_no: '',
                  payment_status: 'not_paid',
                  last_payment_date: ''
                });
                setEditingId(null);
                setShowForm(false);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {showForm && renderForm()}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
          <h3 className="text-lg md:text-xl font-bold text-blue-700">Building Permits</h3>
          
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex w-full md:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="px-4 py-2 border border-gray-300 rounded-l focus:outline-none w-full"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
            
            <button 
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center justify-center"
              title="Export to Excel"
            >
              <svg className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              Excel
            </button>
            
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none w-full md:w-auto"
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none w-full md:w-auto"
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-4 text-xs items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="paidThisYear"
              onChange={(e) => {
                if (e.target.checked) {
                  const overdueCheckbox = document.getElementById('overdue');
                  if (overdueCheckbox) overdueCheckbox.checked = false;
                  
                  const currentYear = new Date().getFullYear();
                  const paidBuildings = buildings.filter(building => 
                    building.payment_status === 'paid' && 
                    building.last_payment_date && 
                    new Date(building.last_payment_date).getFullYear() === currentYear
                  );
                  setFilteredBuildings(paidBuildings);
                  setCurrentPage(1);
                } else {
                  filterBuildings();
                }
              }}
              className="mr-2"
            />
            <label htmlFor="paidThisYear" className="cursor-pointer">Paid This Year</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="overdue"
              onChange={(e) => {
                if (e.target.checked) {
                  const paidCheckbox = document.getElementById('paidThisYear');
                  if (paidCheckbox) paidCheckbox.checked = false;
                  
                  const currentYear = new Date().getFullYear();
                  const overdueBuildings = buildings.filter(building => 
                    !building.payment_status || 
                    building.payment_status === 'not_paid' || 
                    (building.payment_status === 'paid' && 
                     building.last_payment_date && 
                     new Date(building.last_payment_date).getFullYear() < currentYear)
                  );
                  setFilteredBuildings(overdueBuildings);
                  setCurrentPage(1);
                } else {
                  filterBuildings();
                }
              }}
              className="mr-2"
            />
            <label htmlFor="overdue" className="cursor-pointer">Not Paid / Overdue</label>
          </div>
        </div>
        
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 table-fixed border-collapse">
            <thead className="bg-gray-100">
              <tr className="border-b border-gray-300">
                <th className="px-2 md:px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-24 md:w-28 border-r border-gray-200">Date Received</th>
                <th className="px-2 md:px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-36 md:w-40 border-r border-gray-200">Owner/Establishment</th>
                <th className="px-2 md:px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-36 md:w-40 border-r border-gray-200">Location</th>
                <th className="px-2 md:px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-20 md:w-24 border-r border-gray-200">FCODE Fee</th>
                <th className="px-2 md:px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-20 md:w-24 border-r border-gray-200">OR No.</th>
                <th className="px-2 md:px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-28 md:w-32 border-r border-gray-200">Evaluated By</th>
                <th className="px-2 md:px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-24 md:w-28 border-r border-gray-200">Date Released</th>
                <th className="px-2 md:px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-24 md:w-28 border-r border-gray-200">Control No.</th>
                <th className="px-2 md:px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-20 border-r border-gray-200">Status</th>
                <th className="px-2 md:px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-28 md:w-32 border-r border-gray-200">Payment</th>
                <th className="px-2 md:px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-24 md:w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((building, index) => (
                  <tr key={building._id} className={`border-b border-gray-200 ${getRowColor(building)}`}>
                    <td className={`px-2 md:px-3 ${rowSize} truncate border-r border-gray-200`}>{building.date_received}</td>
                    <td className={`px-2 md:px-3 ${rowSize} truncate border-r border-gray-200`}>{building.owner_establishment}</td>
                    <td className={`px-2 md:px-3 ${rowSize} truncate border-r border-gray-200`}>{building.location}</td>
                    <td className={`px-2 md:px-3 ${rowSize} truncate border-r border-gray-200`}>{building.fcode_fee}</td>
                    <td className={`px-2 md:px-3 ${rowSize} truncate border-r border-gray-200`}>{building.or_no}</td>
                    <td className={`px-2 md:px-3 ${rowSize} truncate border-r border-gray-200`}>{building.evaluated_by}</td>
                    <td className={`px-2 md:px-3 ${rowSize} truncate border-r border-gray-200`}>{building.date_released_fsec}</td>
                    <td className={`px-2 md:px-3 ${rowSize} truncate border-r border-gray-200`}>{building.control_no}</td>
                    <td className={`px-2 md:px-3 ${rowSize} border-r border-gray-200`}>
                      <span className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${building.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          building.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}>
                        {building.status || 'pending'}
                      </span>
                    </td>
                    <td className={`px-2 md:px-3 ${rowSize} border-r border-gray-200`}>
                      <select
                        value={building.payment_status || 'not_paid'}
                        onChange={(e) => handlePaymentStatusChange(building._id, e.target.value)}
                        className="w-full px-1 py-1 border border-gray-300 rounded text-xs"
                      >
                        <option value="not_paid">Not Paid</option>
                        <option value="paid">Paid</option>
                      </select>
                      {building.last_payment_date && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(building.last_payment_date).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className={`px-2 md:px-3 ${rowSize}`}>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(building)}
                          className="text-blue-600 hover:text-blue-900 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(building._id)}
                          className="text-red-600 hover:text-red-900 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                      
                      <div className="mt-1">
                        <select
                          value={building.status}
                          onChange={(e) => handleStatusChange(building._id, e.target.value)}
                          disabled={isUpdatingStatus[building._id]}
                          className={`text-xs w-full border border-gray-300 rounded px-1 py-0.5 ${
                            isUpdatingStatus[building._id] ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        {isUpdatingStatus[building._id] && (
                          <div className="text-xs text-blue-600 mt-1">Updating...</div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="px-6 py-4 text-center text-sm text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredBuildings.length > 0 && renderPagination()}
        
        {filteredBuildings.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 text-right">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBuildings.length)} of {filteredBuildings.length} records
          </div>
        )}
      </div>
    </>
  );
}

export default BuildingPermit;