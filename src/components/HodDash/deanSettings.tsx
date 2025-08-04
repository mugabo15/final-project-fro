import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Logout from '../logout';
import Greetings from '../adminDas/greetings';
import Profile from '../adminDas/profile';
import Modal from '../StudentDash/model';
import UploadMarksForm from './uploadMarks';
import GenerateTranscriptForm from './transcript';

function formatAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;
    return 'just now';
}

export default function HodSettings() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [transcripts, setTranscripts] = useState([]);
    const [loadingTranscripts, setLoadingTranscripts] = useState(true);
    const [error, setError] = useState('');
    const [uploadedMarksSummary, setUploadedMarksSummary] = useState<any[]>([]);
    const [loadingMarksSummary, setLoadingMarksSummary] = useState(true);
    const [marksSummaryError, setMarksSummaryError] = useState('');

    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        if (token) {
            fetchTranscripts();
            fetchUploadedMarksSummary();
        }
    }, [token]);

    if (!token) {
        return null; // Or <p>Redirecting...</p> while navigation happens
    }
    const fetchTranscripts = async () => {


        try {
            const res: any = await axios.get(`http://localhost:7000/transcripts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTranscripts(res.data || []);
        } catch (err) {
            setError('Failed to load transcripts');
        } finally {
            setLoadingTranscripts(false);
        }
    };

    const fetchUploadedMarksSummary = async () => {
        setLoadingMarksSummary(true);
        setMarksSummaryError('');
        try {
            const res = await axios.get('http://localhost:7000/transcript-request/see-oploaded-marks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUploadedMarksSummary(res.data || []);
        } catch (err) {
            setMarksSummaryError('Failed to load uploaded marks summary');
        } finally {
            setLoadingMarksSummary(false);
        }
    };

    useEffect(() => {
        fetchTranscripts();
        fetchUploadedMarksSummary();
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
                            <li className="py-2 px-6 hover:bg-blue-50 text-gray-600">Dashboard</li>
                        </Link>
                        <Link to="/hod-requested-docs">
                            <li className="py-2 px-6 hover:bg-blue-50 text-gray-600 flex items-center">
                                Requested Docs
                            </li>
                        </Link>
                        <Link to="/dean-settings">
                            <li className="py-2 px-6 bg-blue-100 text-blue-700 font-bold">Settings</li>
                        </Link>
                        <li className="py-2 px-6 hover:bg-blue-50 text-gray-600 mt-4 border-t pt-4">
                            <Logout />
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 md:hidden">☰</button>
                    <div className="text-lg font-semibold">Hod Dashboard</div>
                    <Profile />
                </header>

                {/* Body */}
                <main className="p-6 overflow-y-auto">
                    <Greetings />

                    {/* Upload Marks */}
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-blue-700">Upload Marks</h3>
                            <button onClick={() => setIsUploadModalOpen(true)} className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">+ Upload</button>
                        </div>

                        {isUploadModalOpen && (
                            <Modal onClose={() => setIsUploadModalOpen(false)}>
                                <UploadMarksForm onSuccess={() => {
                                    setIsUploadModalOpen(false);
                                    fetchUploadedMarksSummary(); // Refresh summary after upload
                                }} />
                            </Modal>
                        )}

                        {/* Uploaded marks summary */}
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Summary of Uploaded Marks</h4>
                            {loadingMarksSummary ? (
                                <p>Loading summary...</p>
                            ) : marksSummaryError ? (
                                <p className="text-red-500">{marksSummaryError}</p>
                            ) : uploadedMarksSummary.length === 0 ? (
                                <p>No marks uploaded yet.</p>
                            ) : (
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border">Program</th>
                                            <th className="px-4 py-2 border">Year of Study</th>
                                            <th className="px-4 py-2 border">Academic Year</th>
                                            <th className="px-4 py-2 border">Created</th>

                                            <th className="px-4 py-2 border">No of Students</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uploadedMarksSummary.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2 border">{item.program}</td>
                                                <td className="px-4 py-2 border">{item.yearOfStudyName}</td>
                                                <td className="px-4 py-2 border">{item.yearOfStudyYear}</td>
                                                <td className="px-4 py-2 border">
                                                    {item.uploadedDate
                                                        ? `${formatAgo(item.uploadedDate)}`
                                                        : 'N/A'}
                                                </td>

                                                <td className="px-4 py-2 border">{item.numberOfRecords}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Transcript Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold text-blue-700 mb-4">Transcripts</h3>
                        <GenerateTranscriptForm />
                    </div>
                </main>
            </div>
        </div>
    );
}
