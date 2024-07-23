import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AiOutlineSmile } from "react-icons/ai";
import { TiLocationArrowOutline } from "react-icons/ti";
import "../styles/VerifyEmail.css";

export default function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] = useState({
    message: "",
    error: "",
  });
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`http://localhost:8000/auth/verify/${token}`);
        const data = await res.json();
        if (data.errors) {
          const errorMessage = Object.values(data.errors)[0];
          setVerificationStatus({ error: errorMessage });
        } else {
          setVerificationStatus({ message: data.message });
        }
      } catch (err) {
        setVerificationStatus({ error: err.message });
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <div className="verifyEmail-container">
      {verificationStatus.error ? (
        <p className="verifyEmail-error-message">{verificationStatus.error}</p>
      ) : (
        <div className="verifyEmail-success">
          <h2 className="verifyEmail-title">
            <AiOutlineSmile className="verifyEmail-icon" />
            {verificationStatus.message}
          </h2>
          <Link to="/login" className="verifyEmail-link">
            <TiLocationArrowOutline className="verifyEmail-icon" /> Go to login
          </Link>
        </div>
      )}
    </div>
  );
}
