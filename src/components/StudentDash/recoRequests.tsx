import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Modal from './model';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Archive,
    GraduationCap,
    Download,
    Search,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronDown
} from 'lucide-react';
import StudentForms from './forms';

interface RecomandationRequest {
    id: number;
    regnumber: string;
    reason: string;
    description: string;
    fileurl: string | null;
    status: string;
    levelOfStudy: string;
    createdAt: string;
    school?: { name: string };
    department?: { name: string };
    requestedBy?: { firstName: string; lastName: string; email: string };
    assignedTo?: { firstName: string; lastName: string; email: string };
    [key: string]: any;
}

const RecomandationRequests = () => {
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [allFiles, setAllFiles] = useState<RecomandationRequest[]>([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<RecomandationRequest | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecomandationRequests = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;

                interface MyJwtPayload {
                    id?: string | number;
                    [key: string]: any;
                }
                const decoded = jwtDecode<MyJwtPayload>(token);
                const userId = decoded?.id;
                if (!userId) return;

                const response = await axios.get(
                    `http://localhost:7000/recomandation-request/recomandation?requestedbyId=${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setAllFiles(response.data || []);
            } catch (error) {
                console.error('Error fetching recomandation requests:', error);
            }
        };

        fetchRecomandationRequests();
    }, []);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'My Request', icon: FileText, path: '/my-request' },
        { name: 'Archives', icon: Archive },
        { name: 'Certificates', icon: GraduationCap }
    ];

    const handleNavClick = (item: typeof navItems[number]) => {
        if (item.path) {
            navigate(item.path);
        }
    };

    const getStatusIcon = (status: string | undefined) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'PENDING':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'REJECTED':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusStyle = (status: string | undefined) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'PENDING':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'REJECTED':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const filteredFiles = allFiles.filter(file => {
        const matchesSearch =
            file.regnumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.school?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.department?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || file.status?.toLowerCase() === selectedStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    function timeAgo(createdAt: string): string {
        if (!createdAt) return "-";
        const date = new Date(createdAt);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return `${interval} year${interval > 1 ? "s" : ""} ago`;

        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return `${interval} month${interval > 1 ? "s" : ""} ago`;

        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return `${interval} day${interval > 1 ? "s" : ""} ago`;

        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return `${interval} hour${interval > 1 ? "s" : ""} ago`;

        interval = Math.floor(seconds / 60);
        if (interval >= 1) return `${interval} minute${interval > 1 ? "s" : ""} ago`;

        return "just now";
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-auto p-6">
                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                    {/* Requests Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Reg Number</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">School</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Department</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Reason</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Status</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Requested</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredFiles.map((file) => (
                                        <tr key={file.id} className="hover:bg-gray-50">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    <FileText className="w-5 h-5 text-gray-400" />
                                                    <span className="font-medium text-gray-900">{file.regnumber}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-700">{file.school?.name || '-'}</td>
                                            <td className="py-4 px-6 text-gray-700">{file.department?.name || '-'}</td>
                                            <td className="py-4 px-6 text-gray-700">{file.reason}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(file.status)}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(file.status)}`}>
                                                        {file.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-500">
                                                {file.createdAt ? timeAgo(file.createdAt) : "-"}
                                            </td>
                                            <td className="py-4 px-6 flex gap-2">
                                                {file.fileurl && (
                                                    <a
                                                        href={file.fileurl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors inline-flex"
                                                        download
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        <span>Download</span>
                                                    </a>
                                                )}
                                                <button
                                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
                                                    onClick={() => {
                                                        setSelectedFile(file);
                                                        setIsViewModalOpen(true);
                                                    }}
                                                >
                                                    <span>View Details</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredFiles.length === 0 && (
                                <div className="text-center py-12">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No requests found</p>
                                </div>
                            )}
                        </div>
                        {/* View Modal */}
                        {isViewModalOpen && selectedFile && (
                            <Modal onClose={() => setIsViewModalOpen(false)}>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-4">Request Details</h3>
                                    <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Registration Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedFile.regnumber || ""}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Names
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        selectedFile.requestedBy
                                                            ? `${selectedFile.requestedBy.firstName} ${selectedFile.requestedBy.lastName}`
                                                            : ""
                                                    }
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    School
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedFile.school?.name || ""}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Department
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedFile.department?.name || ""}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Level of Study
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedFile.levelOfStudy || ""}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Reason for Request
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedFile.reason || ""}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Additional Description
                                            </label>
                                            <textarea
                                                value={selectedFile.description || ""}
                                                readOnly
                                                rows={4}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 resize-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Status
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedFile.status || ""}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Requested
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedFile.createdAt ? timeAgo(selectedFile.createdAt) : "-"}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100"
                                                />
                                            </div>
                                            {selectedFile.fileurl && (
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        File
                                                    </label>
                                                    <a
                                                        href={selectedFile.fileurl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 underline"
                                                    >
                                                        Download
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-6 flex justify-end gap-2">
                                            <button
                                                type="button"
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                                                // onClick={handleEdit}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                                onClick={() => setIsViewModalOpen(false)}
                                                type="button"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Modal>
                        )}
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

export default RecomandationRequests;
