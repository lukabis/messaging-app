import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import ChatRound from '../components/chat-round/chat-round';
import GoogleSignInButton from '../components/google-sign-in-button/google-sign-in-button';
import { useAuth0 } from "@auth0/auth0-react";

function LoginView() {
  const { loginWithRedirect, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    const callProtected = async () => {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.onboarded) navigate("/home");
      else navigate("/onboarding");
    };

    callProtected();
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <img src={logo} alt="Logo" className='mx-auto mt-8' />
      <ChatRound />

      <GoogleSignInButton onClick={() => loginWithRedirect({ authorizationParams: { connection: "google-oauth2" } })} />
    </div>
  );
}

export default LoginView;