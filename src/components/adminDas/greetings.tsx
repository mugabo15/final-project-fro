
const Greetings = () => {
  const token = localStorage.getItem('authToken');
  let name = 'Unknown';

  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const decoded = JSON.parse(atob(base64Url));
      name = decoded.name || name;
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }
  const getGreeting = () => {
    const hour = new Date().getHours();
    

    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">
        {getGreeting()} {name}, Welcome back!
      </h2>
    </div>
  );
};

export default Greetings;
