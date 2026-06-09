import logo from '../assets/logo.png';
import ChatRound from '../components/chat-round/chat-round';
import GoogleSignInButton from '../components/google-sign-in-button/google-sign-in-button';
import { useAuth0 } from "@auth0/auth0-react";

function LoginView() {
  const { loginWithRedirect } = useAuth0();

  {/*   
    Controls which identity provider to use. Set VITE_AUTH0_CONNECTION to "google-oauth2" to skip
    the Auth0 login page and go straight to Google. Leave unset to show the
    Auth0 Universal Login page (useful for test users in dev).
  */}
  const connection = import.meta.env.VITE_AUTH0_CONNECTION;

  return (
    <div className="flex flex-col items-center min-h-screen">
      <img src={logo} alt="Logo" className='mx-auto mt-8' />
      <ChatRound />

      <GoogleSignInButton onClick={() => {
        loginWithRedirect(connection ? { authorizationParams: { connection } } : {});
      }} />
    </div>
  );
}

export default LoginView;