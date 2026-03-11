import logo from '../assets/logo.png';
import ChatRound from '../components/chat-round/chat-round';
import GoogleSignInButton from '../components/google-sign-in-button/google-sign-in-button';
import { useAuth0 } from "@auth0/auth0-react";

function LoginView() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div className="flex flex-col items-center min-h-screen">
      <img src={logo} alt="Logo" className='mx-auto mt-8' />
      <ChatRound />

      {!isAuthenticated ? (
        <GoogleSignInButton onClick={() => loginWithRedirect()} />
      ) : (
        <>
            <p>Logged in as: {user?.email}</p>
            <button
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
                className="mt-4 px-4 py-2 rounded bg-gray-700 text-white"
            >
                Logout
            </button>
          </>
      )}
    </div>
  );
}

export default LoginView;