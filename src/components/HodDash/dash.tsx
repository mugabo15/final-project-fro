import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

import Logout from '../logout';
import Profile from '../adminDas/profile';
import Greetings from '../adminDas/greetings';

type Student = {
  id: number;
  // add other fields as needed
};

type Department = {
  id: number;
  name: string;
};

type Request = {
  id: number;
  documentType: string;
  status: string;
  createdAt: string;
  // add other fields as needed
};

export default function HDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    Promise.all([
      fetch('http://localhost:7000/users/students', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.json()),
      fetch('http://localhost:7000/settings/Departments/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.json()),
      fetch('http://localhost:7000/recomandation-request', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => res.json()),
    ]).then(([studentsData, departmentsData, requestsData]) => {
      // Normalize requests to ensure department/faculty names are available
      const normalizedRequests = (requestsData || []).map((req: any) => ({
        ...req,
        facultyName: req.facultyId?.name || '',
        departmentName: req.departmentId?.name || '',
        userName: req.user
          ? `${req.user.firstName} ${req.user.lastName}`
          : `${req.firstName || ''} ${req.lastName || ''}`,
      }));
      setStudents(studentsData || []);
      setDepartments(departmentsData || []);
      setRequests(normalizedRequests);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Calculate stats
  const studentsCount = students.length;
  const departmentsCount = departments.length;
  const requestsCount = requests.length;
  console.log('requestsCounts:', requestsCount);

  const approvedCount = requests.filter(r => r.status === 'approved' || r.status === 'libraryApproved').length;
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  // Recent requests (sorted by createdAt desc)
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Document types (unique)
  const docTypes = Array.from(new Set(requests.map(r => r.documentType)));

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

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
            <Link to="/hod-requested-docs">
              <li className="py-2 px-6 hover:bg-blue-50 text-gray-600 flex items-center">
                Requested Docs
              </li>
            </Link>
            <Link to="/hod-settings">
              <li className="py-2 px-6 hover:bg-blue-50 text-gray-600 flex items-center cursor-pointer">
                Settings
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

      {/* div Content */}
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

        {/* div Body */}
        <div className="p-6 overflow-y-auto">
          <Greetings />

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
            <div className="bg-orange-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="font-medium">Departments</h3>
                <p className="text-lg font-bold">{departmentsCount}</p>
                <p>Status: Active</p>
              </div>
              <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
                +{departmentsCount}
              </div>
            </div>

            <div className="bg-green-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="font-medium">Students</h3>
                <p className="text-lg font-bold">{studentsCount}</p>
                <p>Status: Verified</p>
              </div>
              <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
                +{studentsCount}
              </div>
            </div>

            <div className="bg-purple-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="font-medium">Document Requests</h3>
                <p className="text-lg font-bold">{requestsCount}</p>
                <p>Status: Pending</p>
              </div>
              <div className="bg-yellow-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
                +{pendingCount}
              </div>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="font-medium">Approved Documents</h3>
                <p className="text-lg font-bold">{approvedCount}</p>
                <p>Status: Completed</p>
              </div>
              <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
                +{approvedCount}
              </div>
            </div>
          </div>

          {/* Recent Requests & Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recent Requests</h3>
              <ul className="space-y-4">
                {recentRequests.map((tx, index) => (
                  <li key={tx.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{tx.documentType}</p>
                      <small className="text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</small>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${tx.status === 'approved' || tx.status === 'libraryApproved'
                      ? 'bg-green-100 text-green-700'
                      : tx.status === 'pending'
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
                { name: 'Pending', value: pendingCount },
                { name: 'Approved', value: approvedCount },
                { name: 'Rejected', value: rejectedCount },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </div>

          </div>
          {/* Document Types */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Document Types</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {docTypes.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📄</span>
                    <span>{doc}</span>
                  </div>
                  <button className="text-gray-500">⋮</button>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </div>

  );
}