import { useState, useEffect } from 'react';
import Logout from '../logout';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Modal from './model';
import Profile from '../adminDas/profile'; import { useNavigate } from 'react-router-dom';
import {

    LayoutDashboard,
    FileText,
    Archive,
    GraduationCap,
    Plus,
    Bell,
    Menu,
    X} from 'lucide-react';
import StudentForms from './forms';
import RecomandationRequests from './recoRequests';
import MyRequests from './myRequest';

const Requests = () => {
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
   
    const [selectedForm, setSelectedForm] = useState<'transcript' | 'recommendation' | 'toWhom'>('transcript');
  


    const menuItems = [
        {
            id: 'transcript',
            label: 'My Transcript Requests',
            //   icon: FileText,
            color: 'text-orange-400'
        },
        {
            id: 'recommendation',
            label: 'My Recommendation Requests',
            //   icon: Award,
            color: 'text-orange-400'
        },
        {
            id: 'toWhom',
            label: 'To Whom Requests',
            //   icon: Mail,
            color: 'text-orange-400'
        },
    ];

    const renderForm = () => {
        switch (selectedForm) {
            case 'transcript':
                return <MyRequests />
            case 'recommendation':
                return <RecomandationRequests />
            case 'toWhom':
                return <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">To Whom It May Concern</h2>    </div>;
            default:
                return null;
        }
    };

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

                const response: any = await axios.get(`http://localhost:7000/transcript-request/transcript?requestedbyId=${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setAllFiles(response.data || []);
                console.log('Transcript Requests:', response.data);

            } catch (error) {
                console.error('Error fetching transcript requests:', error);
            }
        };

        fetchTranscriptRequests();
    }, []);
    

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
                                <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
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

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <button
                            onClick={() => setIsModalVisible3(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New Request</span>
                        </button>

                        
                    </div>

                    {/* Requests Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="px-6 py- border-b border-gray-200">
                            <div className=" space-x-4 flex">
                                {menuItems.map((item) => {
                                    // const IconComponent = item.icon;
                                    const isActive = selectedForm === item.id;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedForm(item.id as typeof selectedForm)}
                                            className={` flex  items-center justify-between p-4  transition-all duration-200 text-left group ${isActive
                                                ? ' text-black bg-gray-50  border-b-gray-50'
                                                : 'text-gray-300  hover:text-black'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`} /> */}
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                            {/* <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-300'}`} /> */}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {renderForm()}



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
                    <StudentForms />
                </Modal>
            )}
        </div>
    );
};

export default Requests;


