import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CampusForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    address: ['', '', ''], // Street, City, Country
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login'); // or show a modal prompting login
    }
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;

    if (name === 'address' && index !== undefined) {
      const updatedAddress = [...formData.address];
      updatedAddress[index] = value;
      setFormData({ ...formData, address: updatedAddress });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage('You must be logged in to submit this form.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await axios.post(
        `http://localhost:7000/settings/campus`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('✅ Campus added successfully!');
      setFormData({
        name: '',
        email: '',
        website: '',
        address: ['', '', ''],
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        setMessage('⚠️ Session expired. Please log in again.');
        navigate('/login');
      } else {
        setMessage('❌ Failed to add campus.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-semibold text-gray-800">Add New Campus</h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Campus Name"
        className="w-full border rounded p-2"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Campus Email"
        className="w-full border rounded p-2"
        required
      />

      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleChange}
        placeholder="Website URL"
        className="w-full border rounded p-2"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {['Street', 'City', 'Country'].map((label, index) => (
          <input
            key={label}
            type="text"
            name="address"
            value={formData.address[index]}
            onChange={(e) => handleChange(e, index)}
            placeholder={label}
            className="border rounded p-2"
            required
          />
        ))}
      </div>

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

export default CampusForm;
