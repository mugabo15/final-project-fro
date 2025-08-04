import { Link } from 'react-router-dom';
import Logout from '../logout';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Greetings from '../adminDas/greetings';
import Profile from '../adminDas/profile';
import GenerateTranscriptForm from './transcript';
import Modal from './model';

export default function RequstedDocs() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [requests, setRequests] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [generateModalOpen, setGenerateModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ type: '', url: '' });


    const fetchRequests = async () => {
    try {
        const token = localStorage.getItem('authToken');
        let schoolId = '';
        let departmentId = '';
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                schoolId = payload.schoolId;
                departmentId = payload.departmentId;
            } catch (e) {
                console.error('Failed to parse token:', e);
            }
        }

        const response: any = await axios.get(
            `http://localhost:7000/transcript-request/transcript?schoolId=${schoolId}&departmentId=${departmentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // ✅ Filter only requests with 'hod_approved' status
        const approvedRequests = response.data.filter((req: any) => req.status === 'PROCESSING');

        setRequests(approvedRequests);
        console.log('Filtered requests:', approvedRequests);

    } catch (error) {
        console.error('Failed to fetch transcript requests:', error);
    }
};


    useEffect(() => {
        fetchRequests();
    }, []);

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
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-blue-700">Transcript Requests</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">#</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Reg Number</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Reason</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Level</th>
                                        {/* <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th> */}
                                        {/* <th className="px-4 py-2 text-left font-semibold text-gray-700">Completion Year</th> */}
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Proof of Payment</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Passport</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {requests.map((req: any, index) => (
                                        <tr key={req.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2">{req.regnumber}</td>
                                            <td className="px-4 py-2">{req.reason}</td>
                                            <td className="px-4 py-2">{req.description}</td>
                                            <td className="px-4 py-2 capitalize">{req.levelOfStudy}</td>
                                            {/* <td className="px-4 py-2 capitalize">{req.status}</td> */}
                                            {/* <td className="px-4 py-2">{new Date(req.completionYear).toLocaleDateString()}</td> */}

                                            <td className="px-4 py-2">
                                                {req.proofofpayment ? (
                                                    <button
                                                        onClick={() => {
                                                            setModalContent({
                                                                type: req.proofofpayment.endsWith('.pdf') ? 'pdf' : 'image',
                                                                url: req.proofofpayment  // Fixed: was using req.proofOfPayment
                                                            });
                                                            setModalOpen(true);
                                                        }}
                                                        className="text-blue-600 underline"
                                                    >
                                                        View
                                                    </button>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                {req.passphoto ? (
                                                    <button
                                                        onClick={() => {
                                                            setModalContent({
                                                                type: req.passphoto.endsWith('.pdf') ? 'pdf' : 'image',
                                                                url: req.passphoto  // Fixed: was using req.passport
                                                            });
                                                            setModalOpen(true);
                                                        }}
                                                        className="text-blue-600 underline"
                                                    >
                                                        View
                                                    </button>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </td>


                                            <td className="px-4 py-2 flex space-x-2">
                                                {/* {new Date(req.createdAt).toLocaleDateString()} */}
                                                <button className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800">Changes</button>

                                                <button
                                                    onClick={() => {
                                                        localStorage.setItem('requestId', req.id);
                                                        localStorage.setItem('regnumber', req.regnumber);
                                                        localStorage.setItem('levelOfStudy', req.levelOfStudy);
                                                        setGenerateModalOpen(true);
                                                    }}
                                                    className="bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800"
                                                >
                                                    Generate
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {generateModalOpen && (
                                    <Modal onClose={() => setGenerateModalOpen(false)}>
                                     <GenerateTranscriptForm  />
                                    </Modal>
                                )}
                                {modalOpen && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full relative">
                                            <button
                                                onClick={() => setModalOpen(false)}
                                                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
                                            >
                                                ×
                                            </button>
                                            <div className="mt-4">
                                                {modalContent.type === 'pdf' ? (
                                                    <iframe
                                                        src={modalContent.url}
                                                        title="Document"
                                                        className="w-full h-[500px]"
                                                    />
                                                ) : (
                                                    <img src={modalContent.url} alt="Document" className="w-full max-h-[500px] object-contain" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
