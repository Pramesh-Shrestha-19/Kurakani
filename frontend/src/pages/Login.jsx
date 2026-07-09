import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();
  const API = import.meta.env.VITE_API_URL;
  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    console.log("REGISTER RESPONSE:", data);

    if (res.status === 201) {
      setRegisterSuccess("Registered successfully! Please login.");
      setRegisterError("");
      setTimeout(() => setIsLogin(true), 1500);
    } else {
      setRegisterError(data.message || "Registration failed");
      setRegisterSuccess("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      console.log("LOGIN STATUS:", res.status);
      console.log("LOGIN RESPONSE:", data);
      if (data.token) {
        login(data.user, data.token);
        navigate("/chat");
      } else {
        setLoginError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-container">

        {/* LEFT PANEL */}
        <div className="auth-left-panel">
          <img
            src="src/Images/KuraKani logo.png"
            className="logo"
            alt="Kurakani Logo"
          />
          <h1>Kurakani</h1>
          <p>
            Guff garna ready?<br />
            Suru garum na ta
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right-panel">

          {/* LOGIN FORM */}
          {isLogin && (
            <div className="auth-card">
              <h2>Login</h2>
              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); setLoginError(""); }}
                  />
                  <label>E-mail</label>
                </div>

                <div className="input-group password-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setLoginError(""); }}
                  />
                  <label>Password</label>
                  <ion-icon
                    className="toggle-password"
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    onClick={() => setShowPassword(!showPassword)}
                  ></ion-icon>
                </div>

                <p
                  className="forgot-password"
                  onClick={() => {
                    console.log("Forgot Password clicked");
                  }}
                >
                  Forgot Password?
                </p>

                {loginError && (
                  <p style={{ color: "#e53935", fontSize: "13px", marginBottom: "8px", textAlign: "center" }}>
                    {loginError}
                  </p>
                )}
                <button type="submit">Login</button>

                <p className="switch-text">
                  Don't have an account?{" "}
                  <span onClick={() => setIsLogin(false)}>Register</span>
                </p>
              </form>
            </div>
          )}

          {/* REGISTER FORM */}
          {!isLogin && (
            <div className="auth-card">
              <h2>Sign Up</h2>
              <form onSubmit={handleRegister}>
                <div className="input-group">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label>Name</label>
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label>Email</label>
                </div>

                <div className="input-group password-group">
                  <input
                    type={showRegPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label>Password</label>
                  <ion-icon
                    className="toggle-password"
                    name={showRegPassword ? "eye-off-outline" : "eye-outline"}
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  ></ion-icon>
                </div>

                {registerSuccess && (
                  <p style={{ color: "#00a884", fontSize: "13px", marginBottom: "8px", textAlign: "center" }}>
                    {registerSuccess}
                  </p>
                )}
                {registerError && (
                  <p style={{ color: "#e53935", fontSize: "13px", marginBottom: "8px", textAlign: "center" }}>
                    {registerError}
                  </p>
                )}
                <button type="submit">Register</button>

                <p className="switch-text">
                  Already have an account?{" "}
                  <span onClick={() => setIsLogin(true)}>Login</span>
                </p>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;