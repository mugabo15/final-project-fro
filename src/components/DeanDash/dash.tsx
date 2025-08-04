import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

import Logout from '../logout';
import Profile from '../adminDas/profile';
import Greetings from '../adminDas/greetings';

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
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="p-6 text-xl font-bold text-blue-600 text-center">UNIDOC REQUEST SYSTEM</div>
        <nav className="mt-10">
          <ul>
            <li className="py-2 px-6 hover:bg-blue-50 text-blue-600 flex items-center">
              Dashboard
            </li>
            <Link to="/requested-docs">
              <li className="py-2 px-6 hover:bg-blue-50 text-gray-600 flex items-center">
                Requested Docs
              </li>
            </Link>
            <Link to="/dean-settings">
              <li className="py-2 px-6 hover:bg-blue-50 text-gray-600 flex items-center cursor-pointer">
                {/* Settings */}
              </li>
            </Link>
            <li className="py-2 px-6 hover:bg-blue-50 text-gray-600 flex items-center mt-4 border-t pt-4">
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
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
            <div className="bg-orange-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
              <h3 className="font-medium">Total Requests</h3>
              <p className="text-lg font-bold"> 1,250</p>
              <p>Status: Processing</p>
              </div>
              <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center">+5%</div>
            </div>

            <div className="bg-green-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
              <h3 className="font-medium">Approved</h3>
              <p className="text-lg font-bold"> 980</p>
              <p>Status: Up to date</p>
              </div>
              <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center">+2%</div>
            </div>

            <div className="bg-purple-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
              <h3 className="font-medium">Pending</h3>
              <p className="text-lg font-bold"> 210</p>
              <p>Status: Awaiting Review</p>
              </div>
              <div className="bg-yellow-500 text-white w-10 h-10 rounded-full flex items-center justify-center">-1%</div>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
              <h3 className="font-medium">Rejected</h3>
              <p className="text-lg font-bold"> 60</p>
              <p>Status: Needs Attention</p>
              </div>
              <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center">+1%</div>
            </div>
            </div>

            {/* Recent Requests & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recent Requests</h3>
              <ul className="space-y-4">
              {[
                { description: "Transcript Request - John Doe", date: "Fri, 25 Apr 2025", status: "Approved" },
                { description: "Admission Letter - Jane Smith", date: "Thu, 24 Apr 2025", status: "Pending" },
                { description: "Certificate Collection - Alex Lee", date: "Wed, 23 Apr 2025", status: "Rejected" },
                { description: "Course Registration - Mary Ann", date: "Tue, 22 Apr 2025", status: "Approved" },
                { description: "ID Card Replacement - Chris Paul", date: "Mon, 21 Apr 2025", status: "Pending" },
              ].map((tx, index) => (
                <li key={index} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <small className="text-gray-500">{tx.date}</small>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  tx.status === 'Approved'
                  ? 'bg-green-100 text-green-700'
                  : tx.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
                }`}>
                  {tx.status}
                </span>
                </li>
              ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Requests Overview</h3>
              <BarChart width={400} height={300} data={[
              { name: 'Total', value: 1250 },
              { name: 'Approved', value: 980 },
              { name: 'Pending', value: 210 },
              { name: 'Rejected', value: 60 },
              ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </div>
            </div>

            {/* Document Types */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Document Types</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
              { icon: "📄", name: "Transcript" },
              { icon: "📜", name: "Certificate" },
              { icon: "📝", name: "Admission Letter" },
              { icon: "🆔", name: "ID Card" },
              ].map((doc, index) => (
              <div key={index} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                <div className="flex items-center">
                <span className="text-2xl mr-3">{doc.icon}</span>
                <span>{doc.name}</span>
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