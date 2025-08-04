import React, { useState } from 'react';
import axios from 'axios';

interface UploadMarksFormProps {
  onSuccess: () => void;
}

export default function UploadMarksForm({ onSuccess }: UploadMarksFormProps) {
// Extract schoolId, departmentId, and program from authToken if available
const token = localStorage.getItem('authToken');
let initialForm = {
    schoolId: '',
    departmentId: '',
    program: '',
    referenceNo: '',
    yearOfStudyName: '',
    yearOfStudyYear: '',
    refNo: '',
    sex: '',
    marks: '',
    status: 'draft',
};

if (token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        initialForm.schoolId = payload.schoolId || '';
        initialForm.departmentId = payload.departmentId || '';
        initialForm.program = payload.program || '';
    } catch (e) {
        // Invalid token, ignore
    }
}

const [form, setForm] = useState(initialForm);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('authToken');

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== '') formData.append(key, value);
      });

      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/transcript-request/marksheet`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Upload Success:', response.data);
      onSuccess(); // Close modal or trigger refresh
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-lg font-semibold text-gray-700">Upload Marksheet</h2>

      <input name="program" type="text" placeholder="Program" value={form.program} onChange={handleChange} required className="w-full p-2 border rounded" />
      {/* <input name="referenceNo" type="text" placeholder="Reference No (optional)" value={form.referenceNo} onChange={handleChange} className="w-full p-2 border rounded" /> */}
      {/* <input name="yearOfStudyName" type="text" placeholder="Year of Study Name" value={form.yearOfStudyName} onChange={handleChange} required className="w-full p-2 border rounded" /> */}
      <select
        name="yearOfStudyName"
        value={form.yearOfStudyName}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="" disabled>Select year of study</option>
        <option value="YEAR ONE">Year One</option>
        <option value="YEAR TWO">Year Two</option>
        <option value="YEAR THREE">Year Three</option>
        <option value="YEAR FOUR">Year  Four</option>
      </select>
      <input name="yearOfStudyYear" type="text" placeholder="Year of Study ie: 2021-2022" value={form.yearOfStudyYear} onChange={handleChange} required className="w-full p-2 border rounded" />
     

      <input type="file" name="file" onChange={handleFileChange} className="w-full p-2 border rounded" />

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" disabled={loading} className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
        {loading ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
}
