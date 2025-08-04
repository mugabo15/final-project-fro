
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './redux/store.ts'
import { ToastContainer } from 'react-toastify'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ToastContainer />

    <GoogleOAuthProvider clientId={import.meta.env.VITE_clientId}>
      <App />
    </GoogleOAuthProvider>
  </Provider>,
)
