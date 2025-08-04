

import { Link } from 'react-router-dom';
import Greetings from './greetings';
import Profile from './profile';
import Logout from '../logout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './model';
import StaffForm from './staffForm';
import StaffRegisterForm from './staffForm';
import RegisterStaffModal from './staffForm';


export default function AdminUsers() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar is open by default
    const [staffs, setStaffs] = useState([]);
    const [isModalVisible5, setIsModalVisible5] = useState(false); // required for modal toggle

    const fetchStaff = async () => {
        try {
            const response: any = await axios.get('http://localhost:7000/users/staff');
            setStaffs(response.data); // Adjust depending on API response structure
        } catch (error) {
            console.error('Failed to fetch staff members:', error);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);


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
                  className="flex items-center p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
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
                  className="flex items-center p-3  hover:bg-blue-50 hover:text-blue-600  transition-colors text-blue-600 bg-blue-50 rounded-lg"
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
                  className="flex items-center p-3  "
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

                    {/* My Loan Products */}
                    <div className="mt-8 bg-white p-6 rounded-lg shadow">
                        <div className='flex justify-between items-center mb-4'>
                                <h3 className="text-xl font-bold mb-4 text-blue-700 ">All Staff Members</h3>

                                <button
                                    onClick={() => setIsModalVisible5(true)}
                                    className="border p-2 rounded bg-blue-700 text-white hover:bg-blue-800 transition"
                                >
                                    + Add New User
                                </button>
                            </div>

                            {isModalVisible5 && (
                                <RegisterStaffModal
                                    onClose={() => {
                                        setIsModalVisible5(false);
                                        fetchStaff(); // Optionally reload on close
                                    }}
                                >
                                    
                                </RegisterStaffModal>
                            )}

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">#</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Full Name</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Phone</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Role</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Campus</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Faculty</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Department</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Created At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {staffs.map((staff: any, index) => (
                                        <tr key={staff.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2 capitalize">{staff.firstName} {staff.lastName}</td>
                                            <td className="px-4 py-2">{staff.email}</td>
                                            <td className="px-4 py-2">{staff.phoneNumber}</td>
                                            <td className="px-4 py-2 capitalize">{staff.roles}</td>
                                            <td className="px-4 py-2">{staff?.campus?.name || '-'}</td>
                                            <td className="px-4 py-2">{staff?.faculty?.name || '-'}</td>
                                            <td className="px-4 py-2">{staff?.department?.name || '-'}</td>
                                            <td className="px-4 py-2">{new Date(staff.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>



                </main>
            </div>
        </div>
    );
}