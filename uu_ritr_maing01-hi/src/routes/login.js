import { useEffect, useState } from "react";
import { useRoute, useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import DarkVeil from "../bricks/DarkVeil.js";
import Calls from "../calls.js";
import "../styles/routes/login.css";
import useUser from "../hooks/useUser.js";

const LoginLogo = () => (
  <div>
    <img src="../assets/MatchUPlogo.png" alt="MatchUP Logo" className="login-logo" />
    <div className="login-title">MatchUP</div>
  </div>
);

const LoginInput = ({ type = "text", placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="login-input"
  />
);

const LoginButton = ({ text, onClick, loading, loadingText }) => {
  return (
    <button
      onClick={onClick}
      className="login-button"
      disabled={loading}
    >
      {loading ? loadingText : text}
    </button>
  );
};

const LoginError = ({ message }) => (message ? <div className="login-error">{message}</div> : null);

const LoginForm = ({ onSubmit, username, setUsername, password, setPassword, error, loading, lsi }) => (
  <form onSubmit={onSubmit}>
    <LoginInput placeholder={lsi.username} value={username} onChange={setUsername} />
    <LoginInput type="password" placeholder={lsi.password} value={password} onChange={setPassword} />
    <LoginError message={error} />

    <LoginButton text={lsi.login} loading={loading} loadingText={lsi.loading} />
  </form>
);


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useRoute();
  const lsi = useLsi(importLsi, ["Login"]);
  const [user, setUser] = useUser();

  useEffect(() => {
    if (user) {
      setRoute("home");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await Calls.PlayerCreate({ name: username, password: password });
      setUser(res);
      localStorage.setItem("player", JSON.stringify(res));
      setRoute("home");
    } catch (e) {
      console.error(e);
      setError(e.message);
    }

    setLoading(false);
  }

  return (
    <div className="login-container">
      {/* Background */}
      <div className="login-background">
        <DarkVeil
          speed={1.5}
          hueShift={213}
          noiseIntensity={0}
          scanlineFrequency={0.5}
          scanlineIntensity={0}
          warpAmount={0}
        />
      </div>

      {/* Foreground */}
      <div className="login-page">
        <div className="login-card">
          <LoginLogo />
          <LoginForm
            onSubmit={handleSubmit}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            error={error}
            loading={loading}
            lsi={lsi}
          />
        </div>
      </div>
    </div>
  );

}

