import { useState } from 'react';

function AboutUs({ currentPage, setCurrentPage, handleLogout, BFP }) {
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
          <h2 className="text-5xl font-bold text-gray-900 mb-6">About Lubao Fire Station</h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Serving the historic municipality of Lubao, Pampanga with dedication to fire safety and protection
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-3xl shadow-xl p-12 border border-blue-200/50">
            <div className="flex items-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-red-600 rounded-full flex items-center justify-center mr-6">
                <div className="text-white text-4xl">🏛️</div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Historical Significance</h3>
            </div>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Lubao, founded on September 14, 1571, is not just any municipality—it's the cradle of Kapampangan civilization and the oldest settlement in Pampanga. The town was established when Spanish conquistador Martin de Goiti, along with Lieutenant Antonio Carvajal and Augustinian missionaries, received the peaceful surrender of Datu Macabulus, the last chieftain of Lubao.
              </p>
              <p>
                Before Spanish colonization, Lubao was already one of the most prosperous settlements in Pampanga, heavily fortified and strategically located along major rivers. The municipality historically encompassed a vast kingdom that included present-day towns in Bataan, portions of Zambales, and several surrounding communities.
              </p>
              <p>
                The San Agustin Church, established in 1572, stands as one of the oldest churches in Pampanga and was declared an Important Cultural Property by the National Historical Commission.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-3xl shadow-xl p-12 border border-red-200/50">
            <div className="flex items-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-blue-600 rounded-full flex items-center justify-center mr-6">
                <div className="text-white text-4xl">🚒</div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">BFP Lubao Fire Station</h3>
            </div>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                The Bureau of Fire Protection was officially established on January 29, 1991, through Republic Act No. 6975, transforming from the Integrated National Police's Office of Fire Protection Service into a distinct government agency under the Department of Interior and Local Government.
              </p>
              <p>
                Our mission is clear: We commit to prevent and suppress destructive fires, investigate its causes; enforce Fire Code and other related laws; respond to man-made and natural disasters and other emergencies.
              </p>
              <p>
                Following the mandate that requires at least one fire station with adequate personnel, firefighting facilities, and equipment in every municipality, the Lubao Fire Station serves as a vital guardian of this historically significant community.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-3xl shadow-xl p-16 mb-16 border border-blue-200/50">
          <h3 className="text-4xl font-bold text-gray-900 mb-12 text-center">Fire Safety Excellence</h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-blue-600 text-5xl">⚡</div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">24/7</h4>
              <p className="text-gray-700 text-lg">Emergency Response</p>
              <p className="text-gray-600 text-sm mt-2">Always ready to serve</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-red-600 text-5xl">🏆</div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Excellence</h4>
              <p className="text-gray-700 text-lg">Award-Winning Service</p>
              <p className="text-gray-600 text-sm mt-2">Committed to quality</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-blue-600 text-5xl">🤝</div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Partnership</h4>
              <p className="text-gray-700 text-lg">Community Collaboration</p>
              <p className="text-gray-600 text-sm mt-2">Working together for safety</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-3xl shadow-xl p-16 mb-16 border border-red-200/50">
          <h3 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Services</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-red-600 text-3xl">🔥</div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Fire Suppression</h4>
              <p className="text-gray-700">24/7 emergency response for all fire incidents</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-blue-600 text-3xl">🛡️</div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Fire Prevention</h4>
              <p className="text-gray-700">Inspections and fire safety education programs</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-red-600 text-3xl">🔍</div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Fire Investigation</h4>
              <p className="text-gray-700">Determining causes and filing appropriate cases</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-blue-600 text-3xl">🚨</div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Emergency Response</h4>
              <p className="text-gray-700">Natural disasters and emergency situations</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-3xl shadow-xl p-16 border border-blue-200/50">
          <h3 className="text-4xl font-bold text-gray-900 mb-8 text-center">Heritage and Progress</h3>
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              From the ancient settlement that welcomed Spanish missionaries over 450 years ago to today's modern fire safety services, Lubao continues to blend its rich historical heritage with contemporary public safety excellence.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              The Lubao Fire Station stands as a modern guardian of this historic community, ensuring that the legacy of this cradle of Kapampangan civilization is protected for future generations while serving the evolving needs of our growing population.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;