import { useState } from 'react';
import axios from 'axios';
// import logo from './../assets/logo.png';

export default function Login() {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000',
    withCredentials: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
        rememberMe
      });

      const data: any = response.data;

      if (data.access_token) {
        localStorage.setItem('authToken', data.access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      }

      window.location.href = '/dashboard';

    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to login. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row ">

      {/* Right Panel - Login Form */}
      <div className="w-full  p-8 md:p-12 flex text-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold ">Sign In</h2>
            <p className="text-gray-100">Sign in to access your account and manage your documents</p>
          </div>

          {error && (
            <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-100 mb-1">
                Email or Phone
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or phone number"
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-100 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-100">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* <div className="mt-6 text-center text-sm text-gray-100">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}



// import { useState } from 'react';
// import axios from 'axios';

// export default function Login() {
//   const [username, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const api = axios.create({
//     baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000',
//     withCredentials: true,
//   });

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await api.post('/auth/login', {
//         username,
//         password,
//         rememberMe
//       });

//       const data: any = response.data;

//       if (data.access_token) {
//         localStorage.setItem('authToken', data.access_token);
//         api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
//       }

//       window.location.href = '/dashboard';
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || err.message || 'Failed to login. Please try again.';
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-blue-700">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-blue-600 rounded-lg p-10 w-full max-w-sm text-white space-y-6"
//       >
//         {/* Icon */}
//         <div className="flex justify-center mb-4">
//           <svg className="w-14 h-14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
//             <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13a1 1 0 001-1v-1M7 13l1.5-6m2 0h6m-3 0v-3m0 3l-2-2m2 2l2-2" />
//           </svg>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="text-sm bg-red-100 text-red-700 p-2 rounded">
//             {error}
//           </div>
//         )}

//         {/* Username */}
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="USERNAME"
//           className="w-full px-4 py-2 text-sm text-white bg-blue-500 border border-white rounded-md placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
//           required
//         />

//         {/* Password */}
//         <div className="relative">
//           <input
//             type={showPassword ? 'text' : 'password'}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="PASSWORD"
//             className="w-full px-4 py-2 text-sm text-white bg-blue-500 border border-white rounded-md placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-sm"
//             aria-label={showPassword ? 'Hide password' : 'Show password'}
//           >
//             {showPassword ? '👁️' : '🔒'}
//           </button>
//         </div>

//         {/* Login Button */}
//         <button
//           type="submit"
//           className="w-full py-2 text-sm font-semibold bg-white text-blue-600 rounded hover:bg-gray-100 transition disabled:opacity-50"
//           disabled={isLoading}
//         >
//           {isLoading ? 'Logging in...' : 'LOGIN'}
//         </button>

//         {/* Forgot Password */}
//         <div className="text-center">
//           <a href="#" className="text-sm underline hover:text-white">
//             Forgot password?
//           </a>
//         </div>
//       </form>
//     </div>
//   );
// }
