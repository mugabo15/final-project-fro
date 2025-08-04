import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacultyForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    campusId: '', // keep as string for select input
    name: '',
    departments: '', // keep as string for input
    dean: '',
  });
  const [stamp, setStamp] = useState<File | null>(null);

  const [campuses, setCampuses] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchCampuses = async () => {
    try {
      const res: any = await axios.get(`http://localhost:7000/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCampuses(res.data || []);
    } catch (err) {
      console.error('Failed to fetch campuses:', err);
    }
  };

  useEffect(() => {
    fetchCampuses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStamp(e.target.files[0]);
    }
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
      const payload = new FormData();
      // Convert campusId and departments to integer before appending
      payload.append('campusId', String(Number(formData.campusId)));
      payload.append('name', formData.name);
      payload.append('departments', String(Number(formData.departments)));
      payload.append('dean', formData.dean);
      if (stamp) {
        payload.append('stamp', stamp);
      }

      await axios.post(
        `http://localhost:7000/settings/Faculty`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('✅ Faculty added successfully!');
      setFormData({
        campusId: '',
        name: '',
        departments: '',
        dean: '',
      });
      setStamp(null);

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        setMessage('⚠️ Session expired. Please log in again.');
        navigate('/login');
      } else {
        setMessage('❌ Failed to add Faculty.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-semibold text-gray-800">Add New Faculty</h2>

      <select
        name="campusId"
        value={formData.campusId}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      >
        <option value="">-- Select Campus --</option>
        {campuses.map((campus) => (
          <option key={campus.id} value={campus.id}>
            {campus.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Faculty Name"
        className="w-full border rounded p-2"
        required
      />

      <input
        type="number"
        name="departments"
        value={formData.departments}
        onChange={handleChange}
        placeholder="Number of Departments"
        className="w-full border rounded p-2"
        min="1"
        required
      />

      <input
        type="text"
        name="dean"
        value={formData.dean}
        onChange={handleChange}
        placeholder="Dean of Faculty"
        className="w-full border rounded p-2"
        required
      />

      <input
        type="file"
        name="stamp"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border rounded p-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {message && (
        <p className={`text-sm text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default FacultyForm;
