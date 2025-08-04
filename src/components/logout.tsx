
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken');

    // Redirect to login or home page
    navigate('/');
  };

  return (
    <div className="p-2">
      <a
        href="#logout"
        onClick={(e) => {
          e.preventDefault();
          handleLogout();
        }}
        className="text-red-600 hover:underline"
      >
        Logout
      </a>
    </div>
  );
};

export default Logout;
