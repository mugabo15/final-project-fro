import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DepartmentForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    facultyId: '',
    name: '',
    dean: '',
  });

  const [schools, setSchools] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchSchools = async () => {
    try {
      const res: any = await axios.get('http://localhost:7000/settings/all/faculties', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSchools(res.data || []);
    } catch (err) {
      console.error('Failed to fetch schools:', err);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const payload = {
        ...formData,
        facultyId: parseInt(formData.facultyId, 10),
      };

      await axios.post(`http://localhost:7000/settings/department`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('✅ Department added successfully!');
      setFormData({
        facultyId: '',
        name: '',
        dean: '',
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        setMessage('⚠️ Session expired. Please log in again.');
        navigate('/login');
      } else {
        setMessage('❌ Failed to add department.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-semibold text-gray-800">Add New Department</h2>

      <select
        name="facultyId"
        value={formData.facultyId}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      >
        <option value="">-- Select faculty --</option>
        {schools.map((school) => (
          <option key={school.id} value={school.id}>
            {school.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Department Name"
        className="w-full border rounded p-2"
        required
      />

      <input
        type="text"
        name="dean"
        value={formData.dean}
        onChange={handleChange}
        placeholder="Head of Department"
        className="w-full border rounded p-2"
        required
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

export default DepartmentForm;
