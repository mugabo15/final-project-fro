import { Link } from 'react-router-dom';
import Logout from '../logout';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Greetings from '../adminDas/greetings';
import Profile from '../adminDas/profile';
import GenerateTranscriptForm from './transcript';
import Modal from './modal';
import LetterDraftingComponent from './letter';
import { toast } from 'react-toastify';

export default function HRequstedDocs() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [requests, setRequests] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [generateModalOpen, setGenerateModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ type: '', url: '' });
    const [istranscripts, setTranscripts] = useState(true); // Assuming you might need this for future use
    const [isrecommendations, setRecommendations] = useState(false);
    const [isAttendance, setAttendance] = useState(false);
    // const [isAttendance, setAttendance] = useState(false); 
    const [isProofOfEnglish, setProofOfEnglish] = useState(false);
    const [isInternshipLetter, setInternshipLetter] = useState(false);
    const [isDegree, setDegree] = useState(false);

    const [istoWhom, setToWhom] = useState(false); // Assuming you might need this for future use
    const [recommendations, setRecommendationsData] = useState([]);
    const [generateFullLetter, setGenerateFullLetter] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchRecommendations = async () => {
        try {
            const token = localStorage.getItem('authToken');
            let assignedToId = '';

            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    assignedToId = payload.id; // adjust based on how your token stores the assignedToId
                } catch (e) {
                    console.error('Failed to parse token:', e);
                }
            }

            const response = await axios.get(
                `http://localhost:7000/recomandation-request/recomandation?assignedToId=${assignedToId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setRecommendationsData(response.data);
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
        }
    };

    const fetchTranscriptRequests = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            let schoolId = '';
            let departmentId = '';
            let role = '';
            let status = '';
            let documentType = '';

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                schoolId = payload.schoolId;
                departmentId = payload.departmentId;
                role = payload.role;
            } catch (e) {
                console.error('Failed to parse token:', e);
                return;
            }

            // Determine status based on role
            const roleStatusMap: Record<string, string> = {
                recoveryOfficer: 'pending',
                librarian: 'recoveryApproved',
                staff: 'libraryApproved',
                dean: 'staffApproved',
                registrationOfficer: 'deanApproved',
                chancellor: 'registrationApproved',
            };
            status = roleStatusMap[role] || '';

            // Determine document type
            if (istranscripts) documentType = 'transcript';
            else if (isrecommendations) documentType = 'recommendation';
            else if (istoWhom) documentType = 'to whom';
            else if (isAttendance) documentType = 'certificate of attendance';
            else if (isProofOfEnglish) documentType = 'proof of english';
            else if (isInternshipLetter) documentType = 'internship';
            else if (isDegree) documentType = 'degree diploma';
            console.log('status:', status);
            console.log('role:', role);
            console.log('documentType:', documentType);

            const { data } = await axios.get(
                `http://localhost:7000/recomandation-request?status=${status}&documentType=${documentType}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Set data only to the appropriate state variable
            if (istranscripts) setRequests(data);
            else if (isrecommendations) setRequests(data);
            else if (istoWhom) setRequests(data);
            else if (isAttendance) setRequests(data);
            else if (isProofOfEnglish) setRequests(data);
            else if (isInternshipLetter) setRequests(data);
            else if (isDegree) setRequests(data);

            console.log(data);
        } catch (error) {
            console.error('Failed to fetch transcript requests:', error);
        }
    };

    useEffect(() => {
        fetchTranscriptRequests();
    }, [isrecommendations, istranscripts, istoWhom, isAttendance, isProofOfEnglish, isInternshipLetter, isDegree]);

    const handleApproveRequest = async (requestId: string) => {
        try {
            const token = localStorage.getItem('authToken');
            let role = '';
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    role = payload.role;
                } catch (e) {
                    console.error('Failed to parse token:', e);
                }
            }
            await axios.patch(
                `http://localhost:7000/recomandation-request/${requestId}/approve?role=${role}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Updating request successfully!');
            fetchTranscriptRequests();
        } catch (error) {
            console.error('Failed to approve request:', error);
        }
    };

    const handleRejectRequest = async (requestId: string, reason: string) => {
        try {
            const token = localStorage.getItem('authToken');
            let role = '';
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    role = payload.role;
                } catch (e) {
                    console.error('Failed to parse token:', e);
                }
            }
            await axios.patch(
                `http://localhost:7000/recomandation-request/${requestId}/reject?role=${role}&reason=${encodeURIComponent(reason)}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Request rejected successfully!');
            fetchTranscriptRequests();
        } catch (error) {
            console.error('Failed to reject request:', error);
        }
    };

    const handleUploadDocument = async (id: number, fileUrl: File) => {
        try {
            const token = localStorage.getItem('authToken');
            const formData = new FormData();
            formData.append('fileUrl', fileUrl);

            await axios.patch(
                `http://localhost:7000/recomandation-request/request/staff/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toast.success('File Uploaded Successfully!');
            fetchTranscriptRequests();
        } catch (error) {
            console.error('Failed to upload document:', error);
        }
    };

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
                        <Link to="/dashboard">
                            <li className="py-2 px-6 hover:bg-blue-50 text-gray-600 flex items-center">
                                Dashboard
                            </li>
                        </Link>
                        <Link to="/requested-docs">
                            <li className="py-2 px-6 hover:bg-blue-50 text-blue-600 flex items-center">
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-600 mr-4 md:hidden"
                        >
                            ☰
                        </button>
                        <div className="text-lg font-semibold">Transcript Requests</div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Profile />
                    </div>
                </header>

                <main className="p-6 overflow-y-auto">
                    <Greetings />
                    <div className="mt-8 bg-white p-6 rounded-lg shadow">
                        <div className="flex gap-6 mb-4">
                            <div
                                onClick={() => {
                                    setTranscripts(true);
                                    setRecommendations(false);
                                    setToWhom(false);
                                    setAttendance(false);
                                    setProofOfEnglish(false);
                                    setInternshipLetter(false);
                                    setDegree(false);

                                }}
                                className={`text-sm font-bold ${istranscripts ? 'text-blue-900 underline' : 'text-blue-700'} cursor-pointer`}
                            >
                                Transcripts
                            </div>|
                            <div
                                onClick={() => {
                                    setTranscripts(false);
                                    setRecommendations(true);
                                    setToWhom(false);
                                    setAttendance(false);
                                    setProofOfEnglish(false);
                                    setInternshipLetter(false);
                                    setDegree(false);

                                }}
                                className={`text-sm font-bold ${isrecommendations ? 'text-blue-900 underline' : 'text-blue-700'} cursor-pointer`}
                            >
                                Recommendation
                            </div>|
                            <div
                                onClick={() => {
                                    setTranscripts(false);
                                    setRecommendations(false);
                                    setToWhom(true);
                                    setAttendance(false);
                                    setProofOfEnglish(false);
                                    setInternshipLetter(false);
                                    setDegree(false);

                                }}
                                className={`text-sm font-bold ${istoWhom ? 'text-blue-900 underline' : 'text-blue-700'} cursor-pointer`}
                            >
                                To Whom
                            </div>|
                            <div
                                onClick={() => {
                                    setTranscripts(false);
                                    setRecommendations(false);
                                    setToWhom(false);
                                    setAttendance(true);
                                    setProofOfEnglish(false);
                                    setInternshipLetter(false);
                                    setDegree(false);

                                }}
                                className={`text-sm font-bold ${isAttendance ? 'text-blue-900 underline' : 'text-blue-700'} cursor-pointer`}
                            >
                                Attendance Certificate
                            </div>|
                            <div
                                onClick={() => {
                                    setTranscripts(false);
                                    setRecommendations(false);
                                    setToWhom(false);
                                    setAttendance(false);
                                    setProofOfEnglish(true);
                                    setInternshipLetter(false);
                                    setDegree(false);
                                }}
                                className={`text-sm font-bold ${isProofOfEnglish ? 'text-blue-900 underline' : 'text-blue-700'} cursor-pointer`}
                            >
                                Proof of English Proficiency
                            </div>|
                            <div
                                onClick={() => {
                                    setTranscripts(false);
                                    setRecommendations(false);
                                    setToWhom(false);
                                    setAttendance(false);
                                    setProofOfEnglish(false);
                                    setInternshipLetter(true);
                                    setDegree(false);
                                }}
                                className={`text-sm font-bold ${isInternshipLetter ? 'text-blue-900 underline' : 'text-blue-700'} cursor-pointer`}
                            >
                                Internship Letter
                            </div>|
                            <div
                                onClick={() => {
                                    setTranscripts(false);
                                    setRecommendations(false);
                                    setToWhom(false);
                                    setAttendance(false);
                                    setProofOfEnglish(false);
                                    setInternshipLetter(false);
                                    setDegree(true);
                                }}
                                className={`text-sm font-bold ${isDegree ? 'text-blue-900 underline' : 'text-blue-700'} cursor-pointer`}
                            >
                                Degree(Diploma)
                            </div>

                        </div>
                        {istranscripts && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">#</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Reg Number</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Program</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Course Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Level</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Faculty</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Department</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Submitted</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {requests.map((req: any, index) => {
                                            const getTimeAgo = (dateString: string) => {
                                                if (!dateString) return 'N/A';
                                                const now = new Date();
                                                const date = new Date(dateString);
                                                const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
                                                if (diff < 60) return `${diff} sec ago`;
                                                if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
                                                if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
                                                if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
                                                if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
                                                return `${Math.floor(diff / 31536000)} yrs ago`;
                                            };

                                            return (
                                                <tr key={req.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">{index + 1}</td>
                                                    <td className="px-4 py-2">{`${req.firstName} ${req.lastName}`}</td>
                                                    <td className="px-4 py-2">{req.regNumber}</td>
                                                    <td className="px-4 py-2">{req.program}</td>
                                                    <td className="px-4 py-2">{req.courseName}</td>
                                                    <td className="px-4 py-2">{req.level}</td>
                                                    <td className="px-4 py-2">{req.facultyId?.name || 'N/A'}</td>
                                                    <td className="px-4 py-2">{req.departmentId?.name || 'N/A'}</td>
                                                    {/* <td className="px-4 py-2">{req.phoneNumber}</td> */}
                                                    <td className="px-4 py-2">{req.status}</td>
                                                    <td className="px-4 py-2">{getTimeAgo(req.createdAt)}</td>
                                                    <td className="px-4 py-2 flex gap-2">
                                                        {(() => {
                                                            // Get role from token
                                                            let role = '';
                                                            const token = localStorage.getItem('authToken');
                                                            if (token) {
                                                                try {
                                                                    const payload = JSON.parse(atob(token.split('.')[1]));
                                                                    role = payload.role;
                                                                } catch (e) {
                                                                    // Ignore
                                                                }
                                                            }

                                                            if (role === 'registrationOfficer') {
                                                                return (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setGenerateModalOpen(req.id)}
                                                                            className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                                        >
                                                                            Upload & Approve
                                                                        </button>

                                                                        {generateModalOpen === req.id && (
                                                                            <Modal onClose={() => setGenerateModalOpen(false)}>
                                                                                <div className="p-4 border rounded-lg bg-white w-[400px]">
                                                                                    <h2 className="text-lg font-bold mb-4">Upload Document</h2>

                                                                                    <input
                                                                                        type="file"
                                                                                        accept=".pdf,.jpg,.png"
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files?.[0];
                                                                                            if (file) {
                                                                                                setSelectedFile(file); // Save file for use on confirm
                                                                                            }
                                                                                        }}
                                                                                        className="border border-gray-300 p-2 w-full mb-4"
                                                                                    />

                                                                                    <div className="flex justify-end gap-2">
                                                                                        <button
                                                                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                                                            onClick={() => setGenerateModalOpen(false)}
                                                                                        >
                                                                                            Cancel
                                                                                        </button>

                                                                                        <button
                                                                                            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                                                                                            onClick={async () => {
                                                                                                if (!selectedFile) {
                                                                                                    alert('Please select a file to upload.');
                                                                                                    return;
                                                                                                }

                                                                                                try {
                                                                                                    await handleUploadDocument(req.id, selectedFile);
                                                                                                    await handleApproveRequest(req.id);
                                                                                                    setGenerateModalOpen(false);
                                                                                                } catch (err) {
                                                                                                    console.error("Upload or approval failed:", err);
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            Confirm
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </Modal>
                                                                        )}
                                                                    </>
                                                                );
                                                            }

                                                            // Default: Approve button for other roles
                                                            return (
                                                                <button
                                                                    onClick={() => handleApproveRequest(req.id)}
                                                                    className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                                >
                                                                    Approve
                                                                </button>
                                                            );
                                                        })()}

                                                        <button
                                                            onClick={() => setModalOpen(req.id)}
                                                            className="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800"
                                                        >
                                                            Reject
                                                        </button>
                                                        {modalOpen === req.id && (
                                                            <Modal onClose={() => setModalOpen(false)}>
                                                                <div className="p-4 border rounded-lg bg-white">
                                                                    <h2 className="text-lg font-bold mb-2">Reject Request</h2>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter reason for rejection"
                                                                        className="border border-gray-300 p-2 w-full mb-4"
                                                                        value={req.rejectReason || ''}
                                                                        onChange={e => {
                                                                            const updatedRequests = requests.map((r: any) =>
                                                                                r.id === req.id ? { ...r, rejectReason: e.target.value } : r
                                                                            );
                                                                            setRequests(updatedRequests);
                                                                        }}
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                                                                            onClick={() => {
                                                                                const reason = req.rejectReason || '';
                                                                                if (reason.trim()) {
                                                                                    handleRejectRequest(req.id, reason.trim());
                                                                                    setModalOpen(false);
                                                                                }
                                                                            }}
                                                                        >
                                                                            Confirm Reject
                                                                        </button>
                                                                        <button
                                                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                                            onClick={() => setModalOpen(false)}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </Modal>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {isrecommendations && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">#</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Reg Number</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Program</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Course Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Level</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Faculty</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Department</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Phone</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Submitted</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {requests.map((req: any, index) => {
                                            const getTimeAgo = (dateString: string) => {
                                                if (!dateString) return 'N/A';
                                                const now = new Date();
                                                const date = new Date(dateString);
                                                const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
                                                if (diff < 60) return `${diff} sec ago`;
                                                if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
                                                if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
                                                if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
                                                if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
                                                return `${Math.floor(diff / 31536000)} yrs ago`;
                                            };

                                            return (
                                                <tr key={req.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">{index + 1}</td>
                                                    <td className="px-4 py-2">{`${req.firstName} ${req.lastName}`}</td>
                                                    <td className="px-4 py-2">{req.regNumber}</td>
                                                    <td className="px-4 py-2">{req.program}</td>
                                                    <td className="px-4 py-2">{req.courseName}</td>
                                                    <td className="px-4 py-2">{req.level}</td>
                                                    <td className="px-4 py-2">{req.facultyId?.name || 'N/A'}</td>
                                                    <td className="px-4 py-2">{req.departmentId?.name || 'N/A'}</td>
                                                    <td className="px-4 py-2">{req.phoneNumber}</td>
                                                    <td className="px-4 py-2">{req.email}</td>
                                                    <td className="px-4 py-2">{getTimeAgo(req.createdAt)}</td>
                                                    <td className="px-4 py-2 flex gap-2">
                                                        {(() => {
                                                            // Get role from token
                                                            let role = '';
                                                            const token = localStorage.getItem('authToken');
                                                            if (token) {
                                                                try {
                                                                    const payload = JSON.parse(atob(token.split('.')[1]));
                                                                    role = payload.role;
                                                                } catch (e) {
                                                                    // Ignore
                                                                }
                                                            }

                                                            if (role === 'registrationOfficer') {
                                                                return (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setGenerateModalOpen(req.id)}
                                                                            className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                                        >
                                                                            Upload & Approve
                                                                        </button>

                                                                        {generateModalOpen === req.id && (
                                                                            <Modal onClose={() => setGenerateModalOpen(false)}>
                                                                                <div className="p-4 border rounded-lg bg-white w-[400px]">
                                                                                    <h2 className="text-lg font-bold mb-4">Upload Document</h2>

                                                                                    <input
                                                                                        type="file"
                                                                                        accept=".pdf,.jpg,.png"
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files?.[0];
                                                                                            if (file) {
                                                                                                setSelectedFile(file); // Save file for use on confirm
                                                                                            }
                                                                                        }}
                                                                                        className="border border-gray-300 p-2 w-full mb-4"
                                                                                    />

                                                                                    <div className="flex justify-end gap-2">
                                                                                        <button
                                                                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                                                            onClick={() => setGenerateModalOpen(false)}
                                                                                        >
                                                                                            Cancel
                                                                                        </button>

                                                                                        <button
                                                                                            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                                                                                            onClick={async () => {
                                                                                                if (!selectedFile) {
                                                                                                    alert('Please select a file to upload.');
                                                                                                    return;
                                                                                                }

                                                                                                try {
                                                                                                    await handleUploadDocument(req.id, selectedFile);
                                                                                                    await handleApproveRequest(req.id);
                                                                                                    setGenerateModalOpen(false);
                                                                                                } catch (err) {
                                                                                                    console.error("Upload or approval failed:", err);
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            Confirm
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </Modal>
                                                                        )}
                                                                    </>
                                                                );
                                                            }

                                                            // Default: Approve button for other roles
                                                            return (
                                                                <button
                                                                    onClick={() => handleApproveRequest(req.id)}
                                                                    className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                                >
                                                                    Approve
                                                                </button>
                                                            );
                                                        })()}

                                                        <button
                                                            onClick={() => setModalOpen(req.id)}
                                                            className="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800"
                                                        >
                                                            Reject
                                                        </button>
                                                        {modalOpen === req.id && (
                                                            <Modal onClose={() => setModalOpen(false)}>
                                                                <div className="p-4 border rounded-lg bg-white">
                                                                    <h2 className="text-lg font-bold mb-2">Reject Request</h2>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter reason for rejection"
                                                                        className="border border-gray-300 p-2 w-full mb-4"
                                                                        value={req.rejectReason || ''}
                                                                        onChange={e => {
                                                                            const updatedRequests = requests.map((r: any) =>
                                                                                r.id === req.id ? { ...r, rejectReason: e.target.value } : r
                                                                            );
                                                                            setRequests(updatedRequests);
                                                                        }}
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                                                                            onClick={() => {
                                                                                const reason = req.rejectReason || '';
                                                                                if (reason.trim()) {
                                                                                    handleRejectRequest(req.id, reason.trim());
                                                                                    setModalOpen(false);
                                                                                }
                                                                            }}
                                                                        >
                                                                            Confirm Reject
                                                                        </button>
                                                                        <button
                                                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                                            onClick={() => setModalOpen(false)}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </Modal>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {isProofOfEnglish && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">#</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Reg Number</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Program</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Course Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Level</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Faculty</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Department</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Phone</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Submitted</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {requests.map((req: any, index) => {
                                            const getTimeAgo = (dateString: string) => {
                                                if (!dateString) return 'N/A';
                                                const now = new Date();
                                                const date = new Date(dateString);
                                                const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
                                                if (diff < 60) return `${diff} sec ago`;
                                                if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
                                                if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
                                                if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
                                                if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
                                                return `${Math.floor(diff / 31536000)} yrs ago`;
                                            };

                                            return (
                                                <tr key={req.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">{index + 1}</td>
                                                    <td className="px-4 py-2">{`${req.firstName} ${req.lastName}`}</td>
                                                    <td className="px-4 py-2">{req.regNumber}</td>
                                                    <td className="px-4 py-2">{req.program}</td>
                                                    <td className="px-4 py-2">{req.courseName}</td>
                                                    <td className="px-4 py-2">{req.level}</td>
                                                    <td className="px-4 py-2">{req.facultyId?.name || 'N/A'}</td>
                                                    <td className="px-4 py-2">{req.departmentId?.name || 'N/A'}</td>
                                                    <td className="px-4 py-2">{req.phoneNumber}</td>
                                                    <td className="px-4 py-2">{req.email}</td>
                                                    <td className="px-4 py-2">{getTimeAgo(req.createdAt)}</td>
                                                    <td className="px-4 py-2 flex gap-2">
                                                        {(() => {
                                                            // Get role from token
                                                            let role = '';
                                                            const token = localStorage.getItem('authToken');
                                                            if (token) {
                                                                try {
                                                                    const payload = JSON.parse(atob(token.split('.')[1]));
                                                                    role = payload.role;
                                                                } catch (e) {
                                                                    // Ignore
                                                                }
                                                            }

                                                            if (role === 'registrationOfficer') {
                                                                return (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setGenerateModalOpen(req.id)}
                                                                            className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                                        >
                                                                            Upload & Approve
                                                                        </button>

                                                                        {generateModalOpen === req.id && (
                                                                            <Modal onClose={() => setGenerateModalOpen(false)}>
                                                                                <div className="p-4 border rounded-lg bg-white w-[400px]">
                                                                                    <h2 className="text-lg font-bold mb-4">Upload Document</h2>

                                                                                    <input
                                                                                        type="file"
                                                                                        accept=".pdf,.jpg,.png"
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files?.[0];
                                                                                            if (file) {
                                                                                                setSelectedFile(file); // Save file for use on confirm
                                                                                            }
                                                                                        }}
                                                                                        className="border border-gray-300 p-2 w-full mb-4"
                                                                                    />

                                                                                    <div className="flex justify-end gap-2">
                                                                                        <button
                                                                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                                                            onClick={() => setGenerateModalOpen(false)}
                                                                                        >
                                                                                            Cancel
                                                                                        </button>

                                                                                        <button
                                                                                            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                                                                                            onClick={async () => {
                                                                                                if (!selectedFile) {
                                                                                                    alert('Please select a file to upload.');
                                                                                                    return;
                                                                                                }

                                                                                                try {
                                                                                                    await handleUploadDocument(req.id, selectedFile);
                                                                                                    await handleApproveRequest(req.id);
                                                                                                    setGenerateModalOpen(false);
                                                                                                } catch (err) {
                                                                                                    console.error("Upload or approval failed:", err);
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            Confirm
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </Modal>
                                                                        )}
                                                                    </>
                                                                );
                                                            }

                                                            // Default: Approve button for other roles
                                                            return (
                                                                <button
                                                                    onClick={() => handleApproveRequest(req.id)}
                                                                    className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                                >
                                                                    Approve
                                                                </button>
                                                            );
                                                        })()}

                                                        <button
                                                            onClick={() => setModalOpen(req.id)}
                                                            className="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800"
                                                        >
                                                            Reject
                                                        </button>
                                                        {modalOpen === req.id && (
                                                            <Modal onClose={() => setModalOpen(false)}>
                                                                <div className="p-4 border rounded-lg bg-white">
                                                                    <h2 className="text-lg font-bold mb-2">Reject Request</h2>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter reason for rejection"
                                                                        className="border border-gray-300 p-2 w-full mb-4"
                                                                        value={req.rejectReason || ''}
                                                                        onChange={e => {
                                                                            const updatedRequests = requests.map((r: any) =>
                                                                                r.id === req.id ? { ...r, rejectReason: e.target.value } : r
                                                                            );
                                                                            setRequests(updatedRequests);
                                                                        }}
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                                                                            onClick={() => {
                                                                                const reason = req.rejectReason || '';
                                                                                if (reason.trim()) {
                                                                                    handleRejectRequest(req.id, reason.trim());
                                                                                    setModalOpen(false);
                                                                                }
                                                                            }}
                                                                        >
                                                                            Confirm Reject
                                                                        </button>
                                                                        <button
                                                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                                            onClick={() => setModalOpen(false)}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </Modal>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {isInternshipLetter && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">#</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Reg Number</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Program</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Course Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Level</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Faculty</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Department</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Phone</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Submitted</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {requests.map((req: any, index) => {
                                            const getTimeAgo = (dateString: string) => {
                                                if (!dateString) return 'N/A';
                                                const now = new Date();
                                                const date = new Date(dateString);
                                                const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
                                                if (diff < 60) return `${diff} sec ago`;
                                                if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
                                                if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
                                                if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
                                                if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
                                                return `${Math.floor(diff / 31536000)} yrs ago`;
                                            };

                                            return (
                                                <tr key={req.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">{index + 1}</td>
                                                    <td className="px-4 py-2">{`${req.firstName} ${req.lastName}`}</td>
                                                    <td className="px-4 py-2">{req.regNumber}</td>
                                                    <td className="px-4 py-2">{req.program}</td>
                                                    <td className="px-4 py-2">{req.courseName}</td>
                                                    <td className="px-4 py-2">{req.level}</td>
                                                    <td className="px-4 py-2">{req.facultyId?.name || 'N/A'}</td>
                                                    <td className="px-4 py-2">{req.departmentId?.name || 'N/A'}</td>
                                                    <td className="px-4 py-2">{req.phoneNumber}</td>
                                                    <td className="px-4 py-2">{req.email}</td>
                                                    <td className="px-4 py-2">{getTimeAgo(req.createdAt)}</td>
                                                    <td className="px-4 py-2 flex gap-2">
                                                        {(() => {
                                                            // Get role from token
                                                            let role = '';
                                                            const token = localStorage.getItem('authToken');
                                                            if (token) {
                                                                try {
                                                                    const payload = JSON.parse(atob(token.split('.')[1]));
                                                                    role = payload.role;
                                                                } catch (e) {
                                                                    // Ignore
                                                                }
                                                            }

                                                            if (role === 'registrationOfficer') {
                                                                return (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setGenerateModalOpen(req.id)}
                                                                            className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                                        >
                                                                            Upload & Approve
                                                                        </button>

                                                                        {generateModalOpen === req.id && (
                                                                            <Modal onClose={() => setGenerateModalOpen(false)}>
                                                                                <div className="p-4 border rounded-lg bg-white w-[400px]">
                                                                                    <h2 className="text-lg font-bold mb-4">Upload Document</h2>

                                                                                    <input
                                                                                        type="file"
                                                                                        accept=".pdf,.jpg,.png"
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files?.[0];
                                                                                            if (file) {
                                                                                                setSelectedFile(file); // Save file for use on confirm
                                                                                            }
                                                                                        }}
                                                                                        className="border border-gray-300 p-2 w-full mb-4"
                                                                                    />

                                                                                    <div className="flex justify-end gap-2">
                                                                                        <button
                                                                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                                                            onClick={() => setGenerateModalOpen(false)}
                                                                                        >
                                                                                            Cancel
                                                                                        </button>

                                                                                        <button
                                                                                            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                                                                                            onClick={async () => {
                                                                                                if (!selectedFile) {
                                                                                                    alert('Please select a file to upload.');
                                                                                                    return;
                                                                                                }

                                                                                                try {
                                                                                                    await handleUploadDocument(req.id, selectedFile);
                                                                                                    await handleApproveRequest(req.id);
                                                                                                    setGenerateModalOpen(false);
                                                                                                } catch (err) {
                                                                                                    console.error("Upload or approval failed:", err);
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            Confirm
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </Modal>
                                                                        )}
                                                                    </>
                                                                );
                                                            }

                                                            // Default: Approve button for other roles
                                                            return (
                                                                <button
                                                                    onClick={() => handleApproveRequest(req.id)}
                                                                    className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                                >
                                                                    Approve
                                                                </button>
                                                            );
                                                        })()}

                                                        <button
                                                            onClick={() => setModalOpen(req.id)}
                                                            className="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800"
                                                        >
                                                            Reject
                                                        </button>
                                                        {modalOpen === req.id && (
                                                            <Modal onClose={() => setModalOpen(false)}>
                                                                <div className="p-4 border rounded-lg bg-white">
                                                                    <h2 className="text-lg font-bold mb-2">Reject Request</h2>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter reason for rejection"
                                                                        className="border border-gray-300 p-2 w-full mb-4"
                                                                        value={req.rejectReason || ''}
                                                                        onChange={e => {
                                                                            const updatedRequests = requests.map((r: any) =>
                                                                                r.id === req.id ? { ...r, rejectReason: e.target.value } : r
                                                                            );
                                                                            setRequests(updatedRequests);
                                                                        }}
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                                                                            onClick={() => {
                                                                                const reason = req.rejectReason || '';
                                                                                if (reason.trim()) {
                                                                                    handleRejectRequest(req.id, reason.trim());
                                                                                    setModalOpen(false);
                                                                                }
                                                                            }}
                                                                        >
                                                                            Confirm Reject
                                                                        </button>
                                                                        <button
                                                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                                            onClick={() => setModalOpen(false)}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </Modal>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {istoWhom && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">#</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Reg Number</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Program</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Course Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Level</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Faculty</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Department</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Phone</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Submitted</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {requests.map((req: any, index) => {
                                            const getTimeAgo = (dateString: string) => {
                                                if (!dateString) return 'N/A';
                                                const now = new Date();
                                                const date = new Date(dateString);
                                                const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
                                                if (diff < 60) return `${diff} sec ago`;
                                                if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
                                                if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
                                                if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
                                                if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
                                                return `${Math.floor(diff / 31536000)} yrs ago`;
                                            };

                                            return (
                                                <tr key={req.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">{index + 1}</td>
                                                    <td className="px-4 py-2">{`${req.firstName} ${req.lastName}`}</td>
                                                    <td className="px-4 py-2">{req.regNumber}</td>
                                                    <td className="px-4 py-2">{req.program}</td>
                                                    <td className="px-4 py-2">{req.courseName}</td>
                                                    <td className="px-4 py-2">{req.level}</td>
                                                    <td className="px-4 py-2">{req.facultyId?.name || 'N/A'}</td>
                                                    <td className="px-4 py-2">{req.departmentId?.name || 'N/A'}</td>
                                                    <td className="px-4 py-2">{req.phoneNumber}</td>
                                                    <td className="px-4 py-2">{req.email}</td>
                                                    <td className="px-4 py-2">{getTimeAgo(req.createdAt)}</td>
                                                    <td className="px-4 py-2 flex gap-2">
                                                        {(() => {
                                                            // Get role from token
                                                            let role = '';
                                                            const token = localStorage.getItem('authToken');
                                                            if (token) {
                                                                try {
                                                                    const payload = JSON.parse(atob(token.split('.')[1]));
                                                                    role = payload.role;
                                                                } catch (e) {
                                                                    // Ignore
                                                                }
                                                            }

                                                            if (role === 'registrationOfficer') {
                                                                return (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setGenerateModalOpen(req.id)}
                                                                            className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                                        >
                                                                            Upload & Approve
                                                                        </button>

                                                                        {generateModalOpen === req.id && (
                                                                            <Modal onClose={() => setGenerateModalOpen(false)}>
                                                                                <div className="p-4 border rounded-lg bg-white w-[400px]">
                                                                                    <h2 className="text-lg font-bold mb-4">Upload Document</h2>

                                                                                    <input
                                                                                        type="file"
                                                                                        accept=".pdf,.jpg,.png"
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files?.[0];
                                                                                            if (file) {
                                                                                                setSelectedFile(file); // Save file for use on confirm
                                                                                            }
                                                                                        }}
                                                                                        className="border border-gray-300 p-2 w-full mb-4"
                                                                                    />

                                                                                    <div className="flex justify-end gap-2">
                                                                                        <button
                                                                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                                                            onClick={() => setGenerateModalOpen(false)}
                                                                                        >
                                                                                            Cancel
                                                                                        </button>

                                                                                        <button
                                                                                            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                                                                                            onClick={async () => {
                                                                                                if (!selectedFile) {
                                                                                                    alert('Please select a file to upload.');
                                                                                                    return;
                                                                                                }

                                                                                                try {
                                                                                                    await handleUploadDocument(req.id, selectedFile);
                                                                                                    await handleApproveRequest(req.id);
                                                                                                    setGenerateModalOpen(false);
                                                                                                } catch (err) {
                                                                                                    console.error("Upload or approval failed:", err);
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            Confirm
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </Modal>
                                                                        )}
                                                                    </>
                                                                );
                                                            }

                                                            // Default: Approve button for other roles
                                                            return (
                                                                <button
                                                                    onClick={() => handleApproveRequest(req.id)}
                                                                    className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                                >
                                                                    Approve
                                                                </button>
                                                            );
                                                        })()}

                                                        <button
                                                            onClick={() => setModalOpen(req.id)}
                                                            className="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800"
                                                        >
                                                            Reject
                                                        </button>
                                                        {modalOpen === req.id && (
                                                            <Modal onClose={() => setModalOpen(false)}>
                                                                <div className="p-4 border rounded-lg bg-white">
                                                                    <h2 className="text-lg font-bold mb-2">Reject Request</h2>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter reason for rejection"
                                                                        className="border border-gray-300 p-2 w-full mb-4"
                                                                        value={req.rejectReason || ''}
                                                                        onChange={e => {
                                                                            const updatedRequests = requests.map((r: any) =>
                                                                                r.id === req.id ? { ...r, rejectReason: e.target.value } : r
                                                                            );
                                                                            setRequests(updatedRequests);
                                                                        }}
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                                                                            onClick={() => {
                                                                                const reason = req.rejectReason || '';
                                                                                if (reason.trim()) {
                                                                                    handleRejectRequest(req.id, reason.trim());
                                                                                    setModalOpen(false);
                                                                                }
                                                                            }}
                                                                        >
                                                                            Confirm Reject
                                                                        </button>
                                                                        <button
                                                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                                            onClick={() => setModalOpen(false)}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </Modal>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {isDegree && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">#</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Reg Number</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Program</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Course Name</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Level</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Faculty</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Department</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Phone</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Submitted</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {requests.map((req: any, index) => {
                                            const getTimeAgo = (dateString: string) => {
                                                if (!dateString) return 'N/A';
                                                const now = new Date();
                                                const date = new Date(dateString);
                                                const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
                                                if (diff < 60) return `${diff} sec ago`;
                                                if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
                                                if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
                                                if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
                                                if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
                                                return `${Math.floor(diff / 31536000)} yrs ago`;
                                            };

                                            return (
                                                <tr key={req.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">{index + 1}</td>
                                                    <td className="px-4 py-2">{`${req.firstName} ${req.lastName}`}</td>
                                                    <td className="px-4 py-2">{req.regNumber}</td>
                                                    <td className="px-4 py-2">{req.program}</td>
                                                    <td className="px-4 py-2">{req.courseName}</td>
                                                    <td className="px-4 py-2">{req.level}</td>
                                                    <td className="px-4 py-2">{req.facultyId?.name || 'N/A'}</td>
                                                    <td className="px-4 py-2">{req.departmentId?.name || 'N/A'}</td>
                                                    <td className="px-4 py-2">{req.phoneNumber}</td>
                                                    <td className="px-4 py-2">{req.email}</td>
                                                    <td className="px-4 py-2">{getTimeAgo(req.createdAt)}</td>
                                                    <td className="px-4 py-2 flex gap-2">
                                                        {(() => {
                                                            // Get role from token
                                                            let role = '';
                                                            const token = localStorage.getItem('authToken');
                                                            if (token) {
                                                                try {
                                                                    const payload = JSON.parse(atob(token.split('.')[1]));
                                                                    role = payload.role;
                                                                } catch (e) {
                                                                    // Ignore
                                                                }
                                                            }

                                                            if (role === 'registrationOfficer') {
                                                                return (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setGenerateModalOpen(req.id)}
                                                                            className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                                        >
                                                                            Upload & Approve
                                                                        </button>

                                                                        {generateModalOpen === req.id && (
                                                                            <Modal onClose={() => setGenerateModalOpen(false)}>
                                                                                <div className="p-4 border rounded-lg bg-white w-[400px]">
                                                                                    <h2 className="text-lg font-bold mb-4">Upload Document</h2>

                                                                                    <input
                                                                                        type="file"
                                                                                        accept=".pdf,.jpg,.png"
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files?.[0];
                                                                                            if (file) {
                                                                                                setSelectedFile(file); // Save file for use on confirm
                                                                                            }
                                                                                        }}
                                                                                        className="border border-gray-300 p-2 w-full mb-4"
                                                                                    />

                                                                                    <div className="flex justify-end gap-2">
                                                                                        <button
                                                                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                                                            onClick={() => setGenerateModalOpen(false)}
                                                                                        >
                                                                                            Cancel
                                                                                        </button>

                                                                                        <button
                                                                                            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                                                                                            onClick={async () => {
                                                                                                if (!selectedFile) {
                                                                                                    alert('Please select a file to upload.');
                                                                                                    return;
                                                                                                }

                                                                                                try {
                                                                                                    await handleUploadDocument(req.id, selectedFile);
                                                                                                    await handleApproveRequest(req.id);
                                                                                                    setGenerateModalOpen(false);
                                                                                                } catch (err) {
                                                                                                    console.error("Upload or approval failed:", err);
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            Confirm
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </Modal>
                                                                        )}
                                                                    </>
                                                                );
                                                            }

                                                            // Default: Approve button for other roles
                                                            return (
                                                                <button
                                                                    onClick={() => handleApproveRequest(req.id)}
                                                                    className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                                >
                                                                    Approve
                                                                </button>
                                                            );
                                                        })()}

                                                        <button
                                                            onClick={() => setModalOpen(req.id)}
                                                            className="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800"
                                                        >
                                                            Reject
                                                        </button>
                                                        {modalOpen === req.id && (
                                                            <Modal onClose={() => setModalOpen(false)}>
                                                                <div className="p-4 border rounded-lg bg-white">
                                                                    <h2 className="text-lg font-bold mb-2">Reject Request</h2>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter reason for rejection"
                                                                        className="border border-gray-300 p-2 w-full mb-4"
                                                                        value={req.rejectReason || ''}
                                                                        onChange={e => {
                                                                            const updatedRequests = requests.map((r: any) =>
                                                                                r.id === req.id ? { ...r, rejectReason: e.target.value } : r
                                                                            );
                                                                            setRequests(updatedRequests);
                                                                        }}
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                                                                            onClick={() => {
                                                                                const reason = req.rejectReason || '';
                                                                                if (reason.trim()) {
                                                                                    handleRejectRequest(req.id, reason.trim());
                                                                                    setModalOpen(false);
                                                                                }
                                                                            }}
                                                                        >
                                                                            Confirm Reject
                                                                        </button>
                                                                        <button
                                                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                                                            onClick={() => setModalOpen(false)}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </Modal>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}





                        {generateFullLetter && (
                            <Modal onClose={() => setGenerateFullLetter(false)}>
                                <LetterDraftingComponent />
                            </Modal>
                        )}
                        {/* {istoWhom && (<div>To Whom It May Concern</div>)} */}
                    </div>
                </main>
            </div>
        </div>
    );
}
