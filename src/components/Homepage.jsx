import { useState } from 'react';

function HomePage({ currentPage, setCurrentPage, handleLogout, BFP }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Fire Safety Permits & Certificates
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Apply for various fire safety permits and certificates required for building construction, 
            business operations, and property occupancy compliance.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl shadow-xl p-8 border border-blue-200/50 hover:shadow-2xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-red-100 rounded-full flex items-center justify-center mr-6">
                <div className="text-blue-600 text-3xl">🏗️</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Building Permit</h3>
            </div>
            <p className="text-gray-700 mb-6 text-lg">Fire safety compliance for building construction and renovation</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-4"></span>
                Building fire safety evaluation
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-4"></span>
                Construction compliance check
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-4"></span>
                Fire prevention system review
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl shadow-xl p-8 border border-red-200/50 hover:shadow-2xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-blue-100 rounded-full flex items-center justify-center mr-6">
                <div className="text-red-600 text-3xl">🏠</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Occupancy Permit</h3>
            </div>
            <p className="text-gray-700 mb-6 text-lg">Certificate for safe building occupancy and use</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-4"></span>
                Property safety inspection
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-4"></span>
                Occupancy safety verification
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-4"></span>
                Fire safety certificate issuance
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl shadow-xl p-8 border border-blue-200/50 hover:shadow-2xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-red-100 rounded-full flex items-center justify-center mr-6">
                <div className="text-blue-600 text-3xl">🛡️</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Business Permit</h3>
            </div>
            <p className="text-gray-700 mb-6 text-lg">Comprehensive fire safety inspection and certification</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-4"></span>
                Detailed fire safety assessment
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-4"></span>
                Equipment and system verification
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-4"></span>
                Safety protocol compliance
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl shadow-xl p-12 mb-16 border border-blue-200/50">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Required Documents & Information</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-4"></span>
                <span className="text-gray-700">Property owner identification and details</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-4"></span>
                <span className="text-gray-700">Complete property or business address</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-4"></span>
                <span className="text-gray-700">Fire code compliance fee payment</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-4"></span>
                <span className="text-gray-700">Official receipt number for payments</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-4"></span>
                <span className="text-gray-700">Building plans or business details</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-4"></span>
                <span className="text-gray-700">Application control number</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Apply for Permits</h3>
          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
            <button 
              onClick={() => setCurrentPage('building-permit')}
              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Apply for Building Permit
            </button>
            <button 
              onClick={() => setCurrentPage('occupancy-permit')}
              className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Apply for Occupancy Permit
            </button>
            <button 
              onClick={() => setCurrentPage('fsic-application')}
              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Apply for Business Permit
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-8 shadow-lg text-center border border-blue-200/50 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-6">⚡</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4">Fast Processing</h4>
            <p className="text-gray-700">Quick turnaround time for all permit applications</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-8 shadow-lg text-center border border-red-200/50 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-6">✅</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4">Fully Compliant</h4>
            <p className="text-gray-700">All permits meet local fire safety regulations</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-8 shadow-lg text-center border border-blue-200/50 hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-6">🔒</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4">Secure Process</h4>
            <p className="text-gray-700">Safe and secure online application system</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;