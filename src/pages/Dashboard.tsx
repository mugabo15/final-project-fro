import { useState, useEffect } from 'react';
import StudentDashboard from '../components/StudentDash';
import AdminDashboard from '../components/adminDas';
import { jwtDecode } from 'jwt-decode'; // Make sure it's installed: npm install jwt-decode
import DeanDashboard from '../components/DeanDash';
import HodDashboard from '../components/HodDash';

const Dashboard = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('No auth token found. Please login again.');
        setLoading(false);
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const role = decodedToken?.role;

        if (role) {
          setUserRole(role);
          setUserData(decodedToken);
        } else {
          setError("User role not found in token.");
        }
      } catch (decodeError) {
        console.error('Failed to decode token:', decodeError);
        setError('Invalid token. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              window.location.href = '/login';
            }}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {userRole === 'admin' && <AdminDashboard />}
      {userRole === 'student' && <StudentDashboard />}
      {userRole === 'dean' && <DeanDashboard />}
      {userRole === 'hod' && <HodDashboard />}
      {userRole === 'staff' && <HodDashboard />}
      {userRole === 'director_of_languages' && <HodDashboard />}
      {userRole === 'librarian' && <HodDashboard />}
      {userRole === 'Librarian' && <HodDashboard />}
      {userRole === 'finance' && <HodDashboard />}
      {userRole === 'registrationOfficer' && <HodDashboard />}
      {userRole === 'recoveryOfficer' && <HodDashboard />}
      {userRole === 'chancellor' && <HodDashboard />}

      {userRole && userRole !== 'admin' && userRole !== 'student' && userRole !== 'dean' && userRole !== 'staff' && userRole !== 'director_of_languages' && userRole !== 'librarian' && userRole !== 'finance' && userRole !== 'registrationOfficer' && userRole !== 'recoveryOfficer' && userRole !== 'chancellor' && (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p className="font-bold">Unknown Role</p>
            <p>Your role ({userRole}) doesn't have an associated dashboard.</p>
            <p>Please contact the administrator for assistance.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
