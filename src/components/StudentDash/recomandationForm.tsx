import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

interface DecodedToken {
    schoolId: number;
    campusId: number;
    departmentId: number;
    id: number;
    exp: number;
}

interface Staff {
    id: number;
    firstName: string;
    lastName: string;
    staffPosition: string;
}

const RecommandationRequestForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        regnumber: '',
        reason: '',
        description: '',
        levelOfStudy: '',
        assignedToId: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('authToken');

    const [userIds, setUserIds] = useState({
        requestedbyId: 0,
        campusId: 0,
        schoolId: 0,
        departmentId: 0,
    });

    const [staffList, setStaffList] = useState<Staff[]>([]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded: DecodedToken = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                navigate('/login');
                return;
            }

            setUserIds({
                requestedbyId: decoded.id,
                campusId: decoded.campusId,
                schoolId: decoded.schoolId,
                departmentId: decoded.departmentId,
            });
        } catch (err) {
            console.error('Token decoding failed', err);
            navigate('/login');
        }
    }, [token, navigate]);

    // Fetch staff list
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await axios.get('http://localhost:7000/users/staff', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStaffList(res.data);
            } catch (err) {
                setStaffList([]);
            }
        };
        if (token) fetchStaff();
    }, [token]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setMessage('⚠️ You must be logged in to submit this form.');
            return;
        }

        setLoading(true);
        setMessage('');

        const payload = {
            regnumber: formData.regnumber,
            requestedbyId: userIds.requestedbyId,
            schoolId: userIds.schoolId,
            departmentId: userIds.departmentId,
            assignedToId: Number(formData.assignedToId),
            reason: formData.reason,
            description: formData.description,
            levelOfStudy: formData.levelOfStudy,
            status: 'PENDING'
        };

        try {
            await axios.post('http://localhost:7000/recomandation-request/recomandation', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage('✅ Recommendation request submitted successfully!');
            toast.success('Recommendation request submitted successfully!');
            setFormData({
                regnumber: '',
                reason: '',
                description: '',
                levelOfStudy: '',
                assignedToId: '',
            });

            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 401) {
                setMessage('⚠️ Session expired. Please log in again.');
                navigate('/login');
            } else {
                setMessage(`❌ Failed to submit recommendation request. ${error.response?.data?.message || ''}`);
                toast.error(`${error.response?.data?.message || 'Failed to submit recommendation request.'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-2xl mx-auto space-y-4 p-6 rounded shadow"
        >
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
            Request Flow
            </h2>

          
            <div className="mt-8 p-4 bg-gray-50 rounded text-gray-700 text-sm">
            <ol className="list-decimal ml-5 space-y-1">
                <li>
                <span className="font-medium">Form Submission:</span> User fills in the request form with required details (document type, reason, etc.) and submits it.
                </li>
                <li>
                <span className="font-medium">Approval Workflow:</span> Level 1 Approver reviews the request. If approved, it moves to Level 2. Each level can approve or reject with comments.
                </li>
                <li>
                <span className="font-medium">Document Preparation:</span> Once fully approved, the document is generated or uploaded.
                </li>
                <li>
                <span className="font-medium">Download:</span> The requester is notified and allowed to download the document.
                </li>
            </ol>
            </div>
        </form>
    );
};

export default RecommandationRequestForm;
