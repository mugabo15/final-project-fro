import { useState } from 'react';

const ArchivesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Sample data for archives
  const archiveItems = [
    { 
      type: 'Certificate', 
      status: 'Expires in 6 Months', 
      date: 'May 19, 2025',
      action: 'Download',
      expired: false
    },
    { 
      type: 'Transcript', 
      status: 'Expired 24 days ago', 
      date: 'December 18, 2024',
      action: 'Pay now',
      expired: true
    },
    { 
      type: 'Recommendation', 
      status: 'Expires in 6 Months', 
      date: 'May 17, 2025',
      action: 'Download',
      expired: false
    }
  ];
  
  // Navigation items
  const navItems = [
    { name: 'Dashboard', icon: '📊', active: false },
    { name: 'My Request', icon: '📝', active: false },
    { name: 'Archives', icon: '📁', active: true },
    { name: 'Certificates', icon: '🎓', active: false }
  ];
  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed md:static md:translate-x-0 z-30 w-64 md:w-1/5 lg:w-1/6 h-full bg-gradient-to-b from-blue-500 to-blue-600 text-white flex flex-col transition-transform duration-300 ease-in-out`}>
        <div className="p-4 mb-6 flex justify-center">
          <div className="bg-blue-400 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
            UR
          </div>
        </div>
        
        {/* Navigation menu */}
        <div className="flex-1 px-2">
          {navItems.map((item, index) => (
            <div 
              key={index} 
              className={`my-2 py-3 px-4 rounded-md flex items-center ${
                item.active ? 'bg-blue-300 bg-opacity-30' : 'hover:bg-blue-400 hover:bg-opacity-30'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="text-sm md:text-base">{item.name}</span>
            </div>
          ))}
        </div>
        
        {/* Logout button */}
        <div className="p-6">
          <div className="flex items-center text-blue-200">
            <span className="mr-2">↪</span>
            <span>Logout</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b p-3 md:p-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button 
              className="mr-4 text-gray-500 md:hidden" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            
            <div className="mr-4 hidden sm:block">
              <img src="/api/placeholder/40/40" alt="Logo" className="h-8 md:h-10" />
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-32 xs:w-48 sm:w-64 bg-gray-50 px-3 py-1.5 rounded-full text-sm"
              />
              <span className="absolute right-3 top-1.5 text-gray-400 text-sm">🔍</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-6">
            <span className="text-blue-500 hidden xs:inline">🔄</span>
            <span className="text-blue-500">🔔</span>
            <span className="text-blue-500 hidden sm:inline">💬</span>
            <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>
            <span className="text-blue-500">👤</span>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-medium mb-4 md:mb-6">Archives</h1>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
            <button className="bg-blue-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center text-sm">
              <span className="mr-1">+</span> New
            </button>
            <button className="border border-gray-300 px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center text-sm">
              <span className="mr-1">🎚️</span> Filter
            </button>
            <button className="border border-gray-300 px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center text-sm ml-auto">
              <span className="mr-1">≡</span> 
              <span className="hidden xs:inline">Sort By:</span> Latest
            </button>
          </div>
          
          {/* Info text */}
          <div className="mb-6 text-gray-700">
            <p>These are your recent activities, stored temporaly</p>
            <p>you may re-download them within 180 days</p>
          </div>
          
          {/* Archive items */}
          <div className="space-y-4">
            {archiveItems.map((item, index) => (
              <div 
                key={index} 
                className="border border-blue-100 rounded-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="mb-4 md:mb-0">
                  <h3 className="font-medium text-lg">{item.type}</h3>
                  <div className="mt-2">
                    <span className={`inline-block px-4 py-1 rounded-full text-sm border ${
                      item.expired 
                        ? 'border-red-200 text-red-600' 
                        : 'border-blue-200 text-blue-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                  <div className="text-gray-700 font-medium">
                    {item.date}
                  </div>
                  
                  <button className="flex items-center justify-center border border-blue-300 rounded-xl px-6 py-2 text-blue-600 hover:bg-blue-50 ml-auto md:ml-0 w-full md:w-auto">
                    {item.action}
                    <svg 
                      className="ml-2 w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArchivesPage;