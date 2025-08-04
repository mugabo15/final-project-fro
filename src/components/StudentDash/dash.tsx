import { useState, useEffect } from 'react';
import Logout from '../logout';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import RequestForm from './SchoolForm';
import TranscriptRequestForm from './SchoolForm';
import Modal from './model';
import Profile from '../adminDas/profile'; import { useNavigate } from 'react-router-dom';
import {

  LayoutDashboard,
  FileText,
  Archive,
  GraduationCap,
  Plus,
  Filter,
  Download,
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  FolderOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  User
} from 'lucide-react';
import StudentForms from './forms';

const DocumentsPage = () => {
  const [isModalVisible3, setIsModalVisible3] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  interface TranscriptRequest {
    id: string;
    regnumber?: string;
    description?: string;
    reason?: string;
    status?: string;
    fileurl?: string;
    [key: string]: any;
  }

  const [allFiles, setAllFiles] = useState<TranscriptRequest[]>([]);

  useEffect(() => {
    const fetchTranscriptRequests = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        interface MyJwtPayload {
          id?: string;
          [key: string]: any;
        }
        const decoded = jwtDecode<MyJwtPayload>(token);
        const userId = decoded?.id;
        if (!userId) return;

        const response: any = await axios.get(`http://localhost:7000/recomandation-request?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllFiles(response.data || []);
        console.log('all Requests:', response.data);

      } catch (error) {
        console.error('Error fetching all requests:', error);
      }
    };

    fetchTranscriptRequests();
  }, []);

  const folders = [
    { name: 'Provisional Transcripts', files: 14, size: '200MB', icon: '📜', color: 'bg-blue-50 border-blue-200' },
    { name: 'Recommendations', files: 1, size: '80KB', icon: '🏆', color: 'bg-green-50 border-green-200' },
    { name: 'To Whom It May Concern', files: 7, size: '130MB', icon: '📋', color: 'bg-purple-50 border-purple-200' }
  ];

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Request', icon: FileText, path: '/my-request' },
    { name: 'Archives', icon: Archive },
    { name: 'Certificates', icon: GraduationCap }
  ];

  const navigate = useNavigate();

  const handleNavClick = (item: typeof navItems[number]) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
      case 'recoveryApproved':
      case 'libraryApproved':
      case 'staffApproved':
      case 'deanApproved':
      case 'registrationApproved':
      case 'chancellorApproved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
      case 'recoveryRejected':
      case 'libraryRejected':
      case 'staffRejected':
      case 'deanRejected':
      case 'registrationRejected':
      case 'chancellorRejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };


  const getStatusStyle = (status: string | undefined) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';

      case 'approved':
      case 'recoveryApproved':
      case 'libraryApproved':
      case 'staffApproved':
      case 'deanApproved':
      case 'registrationApproved':
      case 'chancellorApproved':
        return 'bg-green-50 text-green-700 border-green-200';

      case 'rejected':
      case 'recoveryRejected':
      case 'libraryRejected':
      case 'staffRejected':
      case 'deanRejected':
      case 'registrationRejected':
      case 'chancellorRejected':
        return 'bg-red-50 text-red-700 border-red-200';

      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';

      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };


  const approvedStatuses = [
  'approved',
  'recoveryApproved',
  'libraryApproved',
  'staffApproved',
  'deanApproved',
  'registrationApproved',
  'chancellorApproved',
];

const rejectedStatuses = [
  'rejected',
  'recoveryRejected',
  'libraryRejected',
  'staffRejected',
  'deanRejected',
  'registrationRejected',
  'chancellorRejected',
];

const filteredFiles = allFiles.filter(file => {
  const matchesSearch =
    file.regnumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (file.description || file.reason)?.toLowerCase().includes(searchTerm.toLowerCase());

  let matchesStatus = true;

  if (selectedStatus !== 'all') {
    const status:any = file.status;

    if (selectedStatus === 'approved') {
      matchesStatus = approvedStatuses.includes(status);
    } else if (selectedStatus === 'rejected') {
      matchesStatus = rejectedStatuses.includes(status);
    } else {
      matchesStatus = status?.toLowerCase() === selectedStatus.toLowerCase();
    }
  }

  return matchesSearch && matchesStatus;
});


  const stats = [
    {
      label: 'Total Requests',
      value: allFiles.length,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      label: 'Approved',
      value: allFiles.filter((f:any) =>
        [
          'approved',
          'recoveryApproved',
          'libraryApproved',
          'staffApproved',
          'deanApproved',
          'registrationApproved',
          'chancellorApproved'
        ].includes(f.status)
      ).length,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      label: 'Pending',
      value: allFiles.filter(f => f.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      label: 'Rejected',
      value: allFiles.filter((f:any) =>
        [
          'rejected',
          'recoveryRejected',
          'libraryRejected',
          'staffRejected',
          'deanRejected',
          'registrationRejected',
          'chancellorRejected'
        ].includes(f.status)
      ).length,
      icon: XCircle,
      color: 'text-red-600',
    },
  ];


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 z-50 w-64 h-full bg-white shadow-xl border-r border-gray-200 transition-transform duration-300 ease-in-out flex flex-col`}>

        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">UniDoc</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Request System</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.path === window.location.pathname
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                onClick={() => handleNavClick(item)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center text-gray-600">
            <Logout />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Requests</h1>
                <p className="text-sm text-gray-500">Manage your academic documents</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <Profile />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() => setIsModalVisible3(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Request</span>
            </button>

            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Folders Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Folders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map((folder, index) => (
                <div
                  key={index}
                  className={`${folder.color} border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{folder.icon}</span>
                    <FolderOpen className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{folder.name}</h3>
                  <p className="text-sm text-gray-600">
                    {folder.files} {folder.files === 1 ? 'File' : 'Files'} • {folder.size}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Requests</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Student Name</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Doc Type</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Faculty</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Department</th>
                    {/* <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Program</th> */}
                    {/* <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Level</th> */}
                    {/* <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Phone</th> */}
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Reason</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {allFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      {/* <td className="py-4 px-6 text-gray-900">{file.regNumber}</td> */}
                      <td className="py-4 px-6 text-gray-700">{file.user?.firstName} {file.user?.lastName}</td>
                      <td className="py-4 px-6 text-gray-700">{file.documentType}</td>

                      <td className="py-4 px-6 text-gray-700">{file.facultyId?.name}</td>
                      <td className="py-4 px-6 text-gray-700">{file.departmentId?.name}</td>
                      {/* <td className="py-4 px-6 text-gray-700">{file.program}</td> */}
                      {/* <td className="py-4 px-6 text-gray-700">{file.level}</td> */}
                      {/* <td className="py-4 px-6 text-gray-700">{file.phoneNumber}</td> */}
                      <td className="py-4 px-6 text-gray-700">{file.reason || '—'}</td>

                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(file.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(file.status)}`}>
                            {file.status}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {file.fileUrl && (
                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors inline-flex"
                            download
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

              {allFiles.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No requests found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal for New Request */}
      {isModalVisible3 && (
        <Modal
          onClose={() => {
            setIsModalVisible3(false);
          }}
        >
          <StudentForms onSuccess={() => {
            setIsModalVisible3(false);
            // Refetch data after successful request
            const fetchTranscriptRequests = async () => {
              try {
                const token = localStorage.getItem('authToken');
                if (!token) return;

                interface MyJwtPayload {
                  id?: string;
                  [key: string]: any;
                }
                const decoded = jwtDecode<MyJwtPayload>(token);
                const userId = decoded?.id;
                if (!userId) return;

                const response: any = await axios.get(`http://localhost:7000/transcript-request/transcript?requestedbyId=${userId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                setAllFiles(response.data || []);

              } catch (error) {
                console.error('Error fetching transcript requests:', error);
              }
            };
            fetchTranscriptRequests();
          }} />
        </Modal>
      )}
    </div>
  );
};

export default DocumentsPage;