import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface RegisterStaffModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface Campus {
  id: number;
  name: string;
}

interface Faculty {
  id: number;
  name: string;
  campusId: number;
}

interface Department {
  id: number;
  name: string;
  facultyId: number;
}

const RegisterStaffModal: React.FC<RegisterStaffModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    staffPosition: '',
    roles: '',
    campusId: '',
    facultyId: '',
    departmentId: '',
    phoneNumber: '',
  });

  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [Facultys, setFacultys] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Fetch campuses on mount
    axios.get<Campus[]>('http://localhost:7000/settings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setCampuses(res.data))
      .catch((err) => console.error('Failed to fetch campuses:', err));
  }, []);

  useEffect(() => {
    // Fetch Facultys when campusId changes
    if (formData.campusId) {
      axios.get<Faculty[]>(
        `http://localhost:7000/settings/all/faculties?campusId=${formData.campusId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(res => setFacultys(res.data))
        .catch(err => console.error('Failed to fetch Faculties:', err));
    } else {
      setFacultys([]);
      setDepartments([]);
    }
  }, [formData.campusId]);

  useEffect(() => {
    // Fetch departments when facultyId changes
    if (formData.facultyId) {
      axios.get<Department[]>(
        `http://localhost:7000/settings/Departments/all?facultyId=${formData.facultyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(res => setDepartments(res.data))
        .catch(err => console.error('Failed to fetch departments:', err));
    } else {
      setDepartments([]);
    }
  }, [formData.facultyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        ...formData,
        campusId: parseInt(formData.campusId),
        facultyId: parseInt(formData.facultyId),
        departmentId: parseInt(formData.departmentId),
      };

      await axios.post(`http://localhost:7000/users/register-staff`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('✅ Staff registered successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        staffPosition: '',
        roles: '',
        campusId: '',
        facultyId: '',
        departmentId: '',
        phoneNumber: '',
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      setMessage('❌ Failed to register staff. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-h-[90vh] overflow-y-auto p-6 rounded shadow-lg w-[90%] md:w-[70%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Register New Staff</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-lg">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="border p-2 rounded" required />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="border p-2 rounded" required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 rounded" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border p-2 rounded" required />
          <input type="text" name="staffPosition" placeholder="Staff Position" value={formData.staffPosition} onChange={handleChange} className="border p-2 rounded" required />

          <select name="roles" value={formData.roles} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">-- Select Role --</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="dean">Dean</option>
            <option value="hod">Head of Department</option>
            <option value="director_of_languages">Director of Languages</option>
            <option value="librarian">Librarian</option>
            <option value="finance">Finance</option>
            <option value="registrationOfficer">Registration Officer</option>
            <option value="recoveryOfficer">Recovery Officer</option>
            <option value="admin">Admin</option>
            <option value="chancellor">Chancellor</option>
          </select>

          <select name="campusId" value={formData.campusId} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">-- Select Campus --</option>
            {campuses.map(campus => (
              <option key={campus.id} value={campus.id}>{campus.name}</option>
            ))}
          </select>

          <select name="facultyId" value={formData.facultyId} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">-- Select Faculty --</option>
            {Facultys.map(Faculty => (
              <option key={Faculty.id} value={Faculty.id}>{Faculty.name}</option>
            ))}
          </select>

          <select name="departmentId" value={formData.departmentId} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">-- Select Department --</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="border p-2 rounded" required />

          <button type="submit" disabled={loading} className="md:col-span-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
            {loading ? 'Submitting...' : 'Register Staff'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterStaffModal;
