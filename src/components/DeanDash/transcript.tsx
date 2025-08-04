import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import TranscriptDesign from './transcriptDesign';

interface DecodedToken {
  schoolId: string;
  departmentId: string;
  id: number;
}

const GenerateTranscriptForm: React.FC = () => {
  const navigate = useNavigate();
  const [yearOfStudyName, setYearOfStudyName] = useState(localStorage.getItem('levelOfStudy') || '');
  const [referenceNo, setReferenceNo] = useState(localStorage.getItem('regnumber') || '');
  const [transcript, setTranscript] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [schoolId, setSchoolId] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as DecodedToken;
      if (!payload.schoolId || !payload.departmentId) {
        setError('Token is missing required IDs.');
      } else {
        setSchoolId(payload.schoolId);
        setDepartmentId(payload.departmentId);
      }
    } catch (e) {
      console.error('Failed to parse token:', e);
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTranscript(null);

    if (!schoolId || !departmentId || !yearOfStudyName || !referenceNo) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        schoolId,
        departmentId,
        yearOfStudyName,
        referenceNo,
      });
      const token = localStorage.getItem('authToken');

      const response = await axios.get(
        `http://localhost:7000/transcript-request/see-transcript?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Assert the type of response.data before using it
      const data = response.data as any[];
      setTranscript(data);
      console.log('Transcript Data:', data);
      console.log('trans Id:', data[0]?.id);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate transcript.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Generate Transcript</h2>

        {error && (
          <p className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded px-3 py-2 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Year Of Study</label>
            <input
              type="text"
              value={yearOfStudyName}
              onChange={(e) => setYearOfStudyName(e.target.value)}
              placeholder="Enter yearOfStudyName"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Student Reference Number</label>
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="Enter Reference Number"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-60 w-full"
          >
            {loading ? 'Generating...' : 'Generate Transcript'}
          </button>
        </form>
      </div>
      {transcript && (
        <div className="mt-8">
          <TranscriptDesign data={transcript[0]} />

        </div>
      )}
    </>
  );
};

export default GenerateTranscriptForm;
