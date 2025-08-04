import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import Greetings from './greetings';
import Profile from './profile';
import Logout from '../logout';

const data = [
  { name: 'Estimated Loan Limit', value: 1800000 },
  { name: 'Current Repayment', value: 1600000 },
];

const transactions = [
  { description: "June 2025 living allowance", date: "Fri, 25 Apr 2025", status: "Paid" },
  { description: "Living Allowance For Period (2025-05) - Mtn Channel", date: "Thu, 24 Apr 2025", status: "Paid" },
  { description: "April 2025 living allowance", date: "Fri, 28 Feb 2025", status: "Paid" },
  { description: "March 2025 living allowance", date: "Fri, 28 Feb 2025", status: "Paid" },
  { description: "Living Allowance For Period (2025-03) - Mtn Channel", date: "Thu, 27 Feb 2025", status: "Failed" },
];

const loanProducts = [
  { icon: "💻", name: "students" },
  { icon: "📘", name: "Tuition" },
  { icon: "☕", name: "Living Allowance" },
  { icon: "✅", name: "Laptop Consent" },
];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar is open by default

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      {/* Sidebar */}
       <aside
          className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative`}
        >
          <div className="p-6 text-xl font-bold text-blue-600 border-b border-gray-200">
            UNIDOC REQUEST SYSTEM
          </div>
          <nav className="mt-6">
            <ul className="space-y-2 px-4">
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center p-3 text-blue-600 bg-blue-50  hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/users"
                  className="flex items-center p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Users
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="flex items-center p-3 "
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
              </li>
              <li className="border-t border-gray-200 pt-4 mt-4">
                <Logout />
              </li>
            </ul>
          </nav>
        </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 mr-4 md:hidden"
            >
              ☰
            </button>
            <div className="text-lg font-semibold">Dashboard</div>
          </div>
          <div className="flex items-center space-x-4">
            <Profile />

          </div>
        </header>

        {/* Main Body */}
        <main className="p-6 overflow-y-auto">
          <Greetings />


          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
            <div className="bg-orange-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="font-medium">Staffs</h3>
                <p className="text-lg font-bold"> 1,276,500</p>
                <p>Status: Active</p>
              </div>
              <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center">0%</div>
            </div>

            <div className="bg-green-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="font-medium">Students</h3>
                <p className="text-lg font-bold"> 0</p>
                <p>Status: Active</p>
              </div>
              <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center">0%</div>
            </div>

            <div className="bg-purple-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="font-medium">Requests</h3>
                <p className="text-lg font-bold"> 1,640,000</p>
                <p>Status: Active</p>
              </div>
              <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center">0%</div>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="font-medium">Approved Request</h3>
                <p className="text-lg font-bold"> 3,096,900</p>
                <p>Status: Interest: 1,456,900</p>
              </div>
              <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center">0%</div>
            </div>
          </div>

          {/* Recent Transactions & Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
              <ul className="space-y-4">
                {transactions.map((tx, index) => (
                  <li key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <small className="text-gray-500">{tx.date}</small>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${tx.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {tx.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Loan Repayment</h3>
              <BarChart width={400} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </div>
          </div>

          {/* My Loan Products */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">My Loan Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {loanProducts.map((product, index) => (
                <div key={index} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{product.icon}</span>
                    <span>{product.name}</span>
                  </div>
                  <button className="text-gray-500">⋮</button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}