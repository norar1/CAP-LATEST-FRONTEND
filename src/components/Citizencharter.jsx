import { useState } from 'react';

function CitizenCharter({ currentPage, setCurrentPage, handleLogout, BFP }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = 'https://region5.bfp.gov.ph/wp-content/uploads/2022/09/CITIZENS-CHARTER-2022.pdf';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
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
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'home' 
                    ? 'bg-white text-blue-600 font-semibold' 
                    : 'text-white hover:text-blue-200 hover:bg-blue-700/30'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('charter')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'charter' 
                    ? 'bg-white text-red-600 font-semibold' 
                    : 'text-white hover:text-red-200 hover:bg-red-700/30'
                }`}
              >
                Citizen's Charter
              </button>
              <button 
                onClick={() => setCurrentPage('about')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'about' 
                    ? 'bg-white text-blue-600 font-semibold' 
                    : 'text-white hover:text-blue-200 hover:bg-blue-700/30'
                }`}
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
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                    currentPage === 'home'
                      ? 'bg-white text-blue-600 font-semibold'
                      : 'text-white hover:text-blue-200 hover:bg-blue-700/30'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('charter');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                    currentPage === 'charter'
                      ? 'bg-white text-red-600 font-semibold'
                      : 'text-white hover:text-red-200 hover:bg-red-700/30'
                  }`}
                >
                  Citizen's Charter
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('about');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                    currentPage === 'about'
                      ? 'bg-white text-blue-600 font-semibold'
                      : 'text-white hover:text-blue-200 hover:bg-blue-700/30'
                  }`}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">BFP Citizen's Charter</h2>
          <p className="text-xl text-gray-700">Fire Safety Services & Requirements</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-3xl shadow-2xl p-16 text-center border border-blue-200/50">
            <div className="mb-12">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <div className="text-white text-6xl">📋</div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Download BFP Citizen's Charter
              </h3>
              <p className="text-xl text-gray-700 mb-12">
                Get the complete guide for Fire Safety services, requirements, and procedures.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gradient-to-br from-blue-100 to-red-100 rounded-2xl p-8 border border-blue-200/50">
                <div className="text-5xl mb-4">📝</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Complete Guide</h4>
                <p className="text-gray-700">All requirements and procedures in one document</p>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-blue-100 rounded-2xl p-8 border border-red-200/50">
                <div className="text-5xl mb-4">⏱️</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Processing Times</h4>
                <p className="text-gray-700">Know exactly how long each step takes</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-red-100 rounded-2xl p-8 border border-blue-200/50">
                <div className="text-5xl mb-4">💰</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Fee Structure</h4>
                <p className="text-gray-700">Complete breakdown of all applicable fees</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-12 mb-12 border border-blue-200/30">
              <h4 className="text-2xl font-bold text-gray-900 mb-8">What's Included:</h4>
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-4"></span>
                    Transaction Classifications
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-4"></span>
                    Step-by-step Process Flow
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-4"></span>
                    Required Documents Checklist
                  </li>
                </ul>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-4"></span>
                    Fee Computation Examples
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-4"></span>
                    Contact Information
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-4"></span>
                    Important Notices & Warnings
                  </li>
                </ul>
              </div>
            </div>

            <button 
              onClick={handleDownload}
              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold py-6 px-16 rounded-2xl text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="flex items-center justify-center space-x-4">
                <span className="text-2xl">🔗</span>
                <span>Go to Official Charter</span>
              </span>
            </button>

            <p className="text-gray-600 mt-6">
              Opens official BFP Region 5 Citizen's Charter PDF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CitizenCharter;