import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import toast from "react-hot-toast";

const useGoogleLogin = () => {
  const { signInWithGoogle, setLoading } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { user } = await signInWithGoogle();
    if (user.accessToken) {
      navigate("/");
      toast.success("Sign Up Successfull");
    }
  };

  return handleGoogleLogin;
};

export default useGoogleLogin;
