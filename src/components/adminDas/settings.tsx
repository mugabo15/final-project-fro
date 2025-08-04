import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from './model';
import CampusForm from './campusForm';
import SchoolForm from './SchoolForm';
import DepartmentForm from './DeparmentForm';
import Greetings from './greetings';
import Profile from './profile';
import Logout from '../logout';

interface CampusSetting {
  id: number;
  name: string;
  email: string | null;
  website: string | null;
  address: string[] | null;
  createdAt: string;
}

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [isModalVisible3, setIsModalVisible3] = useState(false);
  const [isModalVisible4, setIsModalVisible4] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [settings, setSettings] = useState<CampusSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [errorSchools, setErrorSchools] = useState('');
  const [currentCampusPage, setCurrentCampusPage] = useState(1);
  const [currentSchoolPage, setCurrentSchoolPage] = useState(1);
  const itemsPerPage = 4;

  const navigate = useNavigate();

  const fetchSettings = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(`http://localhost:7000/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Sort campuses by createdAt descending (newest first)
        console.log('campuses', res.data);
        const sorted = Array.isArray(res.data)
          ? [...res.data].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          : [];
        setSettings(sorted);
        setLoading(false);
        
        
      })
      .catch((err) => {
        console.error('Error fetching settings:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        } else {
          setError('Failed to load settings');
        }
        setLoading(false);
      });
  };

  const fetchSchools = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(`http://localhost:7000/settings/all/faculties`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Map "dean" to "deanOfSchool" for compatibility with UI
        const faculties = Array.isArray(res.data)
          ? res.data.map((faculty) => ({
              ...faculty,
              deanOfSchool: faculty.dean,
            }))
          : [];
        setSchools(faculties);
        setLoadingSchools(false);
      })
      .catch((err) => {
        console.error('Error fetching faculties:', err);
        setErrorSchools('Failed to load faculties');
        setLoadingSchools(false);
      });
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      // const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/settings/Departments/all`, {
      const res = await axios.get(`http://localhost:7000/settings/Departments/all`, {

        headers: { Authorization: `Bearer ${token}` },
      });
      // Map "dean" to "deanOfSchool" for UI compatibility
      const departments = Array.isArray(res.data)
        ? res.data.map((dept) => ({
            ...dept,
            deanOfSchool: dept.dean,
          }))
        : [];
      setDepartments(departments);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchSchools();
    fetchDepartments();
  }, []);

  // Pagination logic
  const totalCampusPages = Math.ceil(settings.length / itemsPerPage);
  const currentCampuses = settings.slice(
    (currentCampusPage - 1) * itemsPerPage,
    currentCampusPage * itemsPerPage
  );

  const totalSchoolPages = Math.ceil(schools.length / itemsPerPage);
  const currentSchools = schools.slice(
    (currentSchoolPage - 1) * itemsPerPage,
    currentSchoolPage * itemsPerPage
  );

  const handlePageChange = (type: 'campus' | 'school', page: number) => {
    if (type === 'campus') setCurrentCampusPage(page);
    else setCurrentSchoolPage(page);
  };

  const renderPagination = (type: 'campus' | 'school', currentPage: number, totalPages: number) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => handlePageChange(type, Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(type, Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden bg-white shadow-sm p-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-500 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex">
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
                  className="flex items-center p-3 text-blue-600 bg-blue-50 rounded-lg"
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
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div className="text-xl font-semibold text-gray-800">Settings</div>
            <div className="flex items-center space-x-4">
              <Profile />
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6 overflow-y-auto">
            <Greetings />
            
            {/* Campus Settings */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Campus Settings</h2>
                <button
                  onClick={() => setIsModalVisible2(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Campus
                </button>
              </div>

              {currentCampuses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No campuses found. Add your first campus to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCampuses.map((setting) => (
                    <div key={setting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-blue-600">{setting.name}</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        {setting.email && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {setting.email}
                          </div>
                        )}
                        {setting.website && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <a href={setting.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {setting.website}
                            </a>
                          </div>
                        )}
                        {setting.address && (
                          <div className="flex items-start">
                            <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{setting.address.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        Created: {new Date(setting.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {renderPagination('campus', currentCampusPage, totalCampusPages)}
            </div>

            {/* School Settings */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">School Settings</h2>
                <button
                  onClick={() => setIsModalVisible3(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add School
                </button>
              </div>

              {loadingSchools ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : errorSchools ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {errorSchools}
                </div>
              ) : currentSchools.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No schools found. Add your first school to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSchools.map((school) => (
                    <div key={school.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-blue-600">{school.name}</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Dean: {school.dean || 'Not specified'}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Departments: {school.departments || 'None'}
                        </div>
                        {school.campus?.name && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            Campus: {school.campus.name}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        Created: {new Date(school.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {renderPagination('school', currentSchoolPage, totalSchoolPages)}
            </div>

            {/* Department Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Department Settings</h2>
                <button
                  onClick={() => setIsModalVisible4(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Department
                </button>
              </div>

              {departments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No departments found. Add your first department to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.map((dept) => (
                    <div key={dept.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-blue-600">{dept.name}</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Dean: {dept.dean || 'Not specified'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      {isModalVisible2 && (
        <Modal onClose={() => setIsModalVisible2(false)}>
          <CampusForm
            onSuccess={() => {
              setIsModalVisible2(false);
              fetchSettings();
            }}
          />
        </Modal>
      )}

      {isModalVisible3 && (
        <Modal onClose={() => setIsModalVisible3(false)}>
          <SchoolForm
            onSuccess={() => {
              setIsModalVisible3(false);
              fetchSchools();
            }}
          />
        </Modal>
      )}

      {isModalVisible4 && (
        <Modal onClose={() => setIsModalVisible4(false)}>
          <DepartmentForm
            onSuccess={() => {
              setIsModalVisible4(false);
              fetchDepartments();
            }}
          />
        </Modal>
      )}
    </div>
  );
}