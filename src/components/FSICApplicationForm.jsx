import { useState } from 'react';
import ApiService from '../services/api';

function FSICApplicationForm({ currentPage, setCurrentPage, handleLogout, BFP, isLoading, setIsLoading }) {
  const [formData, setFormData] = useState({
    contact_number: '',
    business_name: '',
    owner: '',
    brgy: '',
    complete_address: '',
    floor_area: '',
    no_of_storeys: '',
    rental: 'N',
    nature_of_business: '',
    bir_tin: '',
    expiry: '',
    amount_paid: '',
    or_number: '',
    date_applied: '',
    type_of_occupancy: '',
    date_released: ''
  });

  const [submitStatus, setSubmitStatus] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setSubmitStatus('');
    
    try {
      const result = await ApiService.createFSIC(formData);
      
      setSubmitStatus('success');
      setShowPopup(true);
      setFormData({
        contact_number: '',
        business_name: '',
        owner: '',
        brgy: '',
        complete_address: '',
        floor_area: '',
        no_of_storeys: '',
        rental: 'N',
        nature_of_business: '',
        bir_tin: '',
        expiry: '',
        amount_paid: '',
        or_number: '',
        date_applied: '',
        type_of_occupancy: '',
        date_released: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleContactNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      handleChange('contact_number', value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-red-50 to-blue-100">
      <nav className="bg-gradient-to-r from-blue-600 to-red-600 shadow-lg border-b-4 border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <img src={BFP} alt="BFP Lubao" className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-white">Lubao Fire Station</h1>
                <p className="text-blue-100 text-sm">Management System</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setCurrentPage('home')}
                className="text-white hover:text-blue-200 hover:bg-blue-700/30 px-4 py-2 rounded-lg transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('charter')}
                className="text-white hover:text-red-200 hover:bg-red-700/30 px-4 py-2 rounded-lg transition-colors"
              >
                Citizen's Charter
              </button>
              <button 
                onClick={() => setCurrentPage('about')}
                className="text-white hover:text-blue-200 hover:bg-blue-700/30 px-4 py-2 rounded-lg transition-colors"
              >
                About Us
              </button>
              <button 
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors font-semibold"
              >
                Logout
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-200 hover:bg-blue-700/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {!isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-r from-blue-700 to-red-700">
                <button
                  onClick={() => {
                    setCurrentPage('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-blue-200 hover:bg-blue-700/30 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('charter');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-red-200 hover:bg-red-700/30 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Citizen's Charter
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('about');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-blue-200 hover:bg-blue-700/30 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  About Us
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Building Permit</h2>
          <p className="text-xl text-gray-600">Application Form</p>
        </div>

        {submitStatus === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 max-w-4xl mx-auto">
            <div className="flex items-center">
              <span className="text-xl mr-3">❌</span>
              <span className="font-medium">Error submitting application. Please check your authentication and try again.</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-5xl mx-auto border border-gray-100">
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Date Applied</label>
                <input
                  type="date"
                  value={formData.date_applied}
                  onChange={(e) => handleChange('date_applied', e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Contact Number</label>
                <input
                  type="text"
                  value={formData.contact_number}
                  onChange={handleContactNumberChange}
                  placeholder="09129876543"
                  maxLength="11"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Business Name</label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => handleChange('business_name', e.target.value)}
                  placeholder="Maria's Bakery"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Owner</label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => handleChange('owner', e.target.value)}
                  placeholder="Maria Santos"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Barangay</label>
                <input
                  type="text"
                  value={formData.brgy}
                  onChange={(e) => handleChange('brgy', e.target.value)}
                  placeholder="Barangay 456"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Complete Address</label>
                <input
                  type="text"
                  value={formData.complete_address}
                  onChange={(e) => handleChange('complete_address', e.target.value)}
                  placeholder="456 Maligaya St., Barangay 456, Zone 3"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Floor Area (sq.m)</label>
                <input
                  type="number"
                  value={formData.floor_area}
                  onChange={(e) => handleChange('floor_area', e.target.value)}
                  placeholder="60"
                  min="1"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Number of Storeys</label>
                <input
                  type="number"
                  value={formData.no_of_storeys}
                  onChange={(e) => handleChange('no_of_storeys', e.target.value)}
                  placeholder="2"
                  min="1"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Rental</label>
                <select
                  value={formData.rental}
                  onChange={(e) => handleChange('rental', e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                >
                  <option value="N">No</option>
                  <option value="Y">Yes</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Nature of Business</label>
                <input
                  type="text"
                  value={formData.nature_of_business}
                  onChange={(e) => handleChange('nature_of_business', e.target.value)}
                  placeholder="Food Services"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">BIN #</label>
                <input
                  type="text"
                  value={formData.bir_tin}
                  onChange={(e) => handleChange('bir_tin', e.target.value)}
                  placeholder="019-08-XXXX-XXXXXXX"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiry}
                  onChange={(e) => handleChange('expiry', e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Type of Occupancy</label>
                <input
                  type="text"
                  value={formData.type_of_occupancy}
                  onChange={(e) => handleChange('type_of_occupancy', e.target.value)}
                  placeholder="Commercial"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Amount Paid (₱)</label>
                <input
                  type="number"
                  value={formData.amount_paid}
                  onChange={(e) => handleChange('amount_paid', e.target.value)}
                  placeholder="2000"
                  min="0"
                  step="0.01"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-3 text-lg">Official Receipt Number</label>
                <input
                  type="text"
                  value={formData.or_number}
                  onChange={(e) => handleChange('or_number', e.target.value)}
                  placeholder="OR-20250804-002"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-900 font-semibold mb-3 text-lg">Date Released</label>
              <input
                type="date"
                value={formData.date_released}
                onChange={(e) => handleChange('date_released', e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg"
              />
            </div>

            <div className="flex gap-6 pt-8">
              <button
                onClick={() => setCurrentPage('home')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors text-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Business Permit'
                )}
              </button>
            </div>
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-12 max-w-md mx-4 shadow-2xl">
              <div className="text-center">
                <div className="text-8xl mb-6">🎉</div>
                <h3 className="text-3xl font-bold text-green-600 mb-6">FSIC Application Submitted!</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Your Building Permit application has been successfully submitted. 
                  You will receive updates on the processing status.
                </p>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setCurrentPage('home');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-semibold py-4 px-12 rounded-xl transition-colors text-lg"
                  >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FSICApplicationForm;