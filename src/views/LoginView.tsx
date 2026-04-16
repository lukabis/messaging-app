import logo from '../assets/logo.png';
import ChatRound from '../components/chat-round/chat-round';
import GoogleSignInButton from '../components/google-sign-in-button/google-sign-in-button';
import { useAuth0 } from "@auth0/auth0-react";

function LoginView() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex flex-col items-center min-h-screen">
      <img src={logo} alt="Logo" className='mx-auto mt-8' />
      <ChatRound />

      <GoogleSignInButton onClick={() => loginWithRedirect({ authorizationParams: { connection: "google-oauth2" } })} />
    </div>
  );
}

export default LoginView;