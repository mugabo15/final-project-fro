// DeanSettings.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Logout from '../logout';
import Greetings from '../adminDas/greetings';
import Profile from '../adminDas/profile';
import Modal from '../StudentDash/model';
import UploadMarksForm from './uploadMarks';
import GenerateTranscriptForm from './transcript';
// import UploadMarksForm from './UploadMarksForm'; // <-- You will need to create this
// import TranscriptList from './TranscriptList';   // <-- Optional: List or action to generate/download transcripts

export default function DeanSettings() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [transcripts, setTranscripts] = useState([]);
    const [loadingTranscripts, setLoadingTranscripts] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const fetchTranscripts = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return navigate('/login');

        try {
            const res:any = await axios.get(`http://localhost:7000/transcripts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTranscripts(res.data || []);
        } catch (err) {
            setError('Failed to load transcripts');
        } finally {
            setLoadingTranscripts(false);
        }
    };

    useEffect(() => {
        fetchTranscripts();
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
                <div className="p-6 text-xl font-bold text-blue-600 text-center">Dean Panel</div>
                <nav className="mt-10">
                    <ul>
                        <Link to="/dashboard">
                            <li className="py-2 px-6 hover:bg-blue-50 text-gray-600">Dashboard</li>
                        </Link>
                        <Link to="/dean-settings">
                            <li className="py-2 px-6 bg-blue-100 text-blue-700 font-bold">Dean Settings</li>
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
                    <div className="text-lg font-semibold">Dean Dashboard</div>
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
                                    //fetchTranscripts(); // Refresh if needed
                                }} />
                            </Modal>
                        )}
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
