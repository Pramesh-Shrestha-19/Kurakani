import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    console.log("REGISTER RESPONSE:", data);

    if (res.status === 201) {
      navigate("/");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      console.log("LOGIN STATUS:", res.status);
      console.log("LOGIN RESPONSE:", data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/chat");
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
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                  <label>E-mail</label>
                </div>

                <div className="input-group password-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
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