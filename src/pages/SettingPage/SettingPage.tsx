import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function SettingPage() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      localStorage.setItem("token", result.user.accessToken);
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="setting">
      <div className="setting__container">
        <h2 className="setting__title">Setting</h2>
        <button onClick={handleGoogleSignIn}>Google Sign In</button>
      </div>
    </div>
  );
}
