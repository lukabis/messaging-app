import logo from '../assets/logo.png';
import ChatRound from '../components/chat-round/chat-round';
import GoogleSignInButton from '../components/google-sign-in-button/google-sign-in-button';

function LoginView() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <img src={logo} alt="Logo" className='mx-auto mt-8' />
      <ChatRound />
      <GoogleSignInButton />
    </div>
  );
}

export default LoginView;