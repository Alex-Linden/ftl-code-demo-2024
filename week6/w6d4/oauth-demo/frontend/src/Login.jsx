import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css'

function Login() {

  const navigateTo = useNavigate();

  const login = async () => {
    try {
      // Make a request to backend to get the OAuth authorization URL
      const response = await axios.get('http://localhost:3000/auth/github');
      const authUrl = response.data.redirectUrl;

      // Open a popup window with the OAuth authorization URL
      const popup = window.open(authUrl, '_blank', `width=600,height=600`);

      const pollSession = setInterval(async () => {
        try {

            // Send cookie (credentials)
            const sessionCheck = await axios.get(
                'http://localhost:3000/auth/session',
                { withCredentials: true }
            );

            if (sessionCheck.data.authenticated) {
                clearInterval(pollSession);
                localStorage.setItem('accessToken', sessionCheck.data.accessToken);
                navigateTo('/dashboard');
                popup.close();
            }

        } catch (error) {
            console.error('Error checking session:', error);

        }
      }, 1000);

    } catch (error) {
      console.error('Error signing in:', error);

    }
  }

  return (
    <div>
      <h1>OAuth Demo</h1>
      <img src="/github-login.png" onClick={(e) => login()}></img>
    </div>
  )
}

export default Login;