import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

interface DecodedToken {
  id: number;
  exp: number;
}

const DocumentRequestForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    documentType: 'transcript',
    date: '',
    program: '',
    level: '',
    courseName: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('authToken');

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
    } catch (err) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    try {
      const userId = (jwtDecode(token) as DecodedToken).id;
      await axios.post(`http://localhost:7000/recomandation-request/${userId}`, {
        ...formData,
        date: new Date(formData.date).toISOString(),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('✅ Document request submitted successfully!');
      toast.success('Document request submitted successfully!');
      setFormData({
        documentType: 'transcript',
        date: '',
        program: '',
        level: '',
        courseName: '',
      });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setMessage(`❌ Failed to submit document request. ${error.response?.data?.message || ''}`);
      toast.error(`${error.response?.data?.message || 'Submission failed.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Document Request</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
        Document Type
        </label>
        <select
        name="documentType"
        value={formData.documentType}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg"
        required
        >
        <option value="transcript">Transcript</option>
        <option value="recommendation">Recommendation</option>
        <option value="to whom">To Whom It May Concern</option>
        <option value="certificate of attendance">Certificate of Attendance</option>
        <option value="proof of english">Proof of English</option>
        <option value="internship">Internship</option>
        <option value="degree diploma">Degree Diploma</option>
        </select>
      </div>
      {/* Two inputs side by side */}
      <div className="flex gap-4">
        <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Program
        </label>
        <input
          type="text"
          name="program"
          value={formData.program}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg"
          required
        />
        </div>
        <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Level
        </label>
        <input
          type="text"
          name="level"
          value={formData.level}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg"
          required
        />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
        Date
        </label>
        <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg"
        required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
        Course Name
        </label>
        <input
        type="text"
        name="courseName"
        value={formData.courseName}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg"
        required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium w-full"
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
      {message && (
        <div className={`p-4 rounded-lg ${
        message.includes('successfully') 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
        <p className="text-sm font-medium">{message}</p>
        </div>
      )}
      </form>
    </div>
  );
};

export default DocumentRequestForm;
