import { useState } from "react";
import "../css/Login.css";

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  // form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // REGISTER API CALL
  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await res.json();
    console.log("REGISTER RESPONSE:", data);
  };

  return (
    <div className="auth-container">

      {/* LEFT PANEL */}
      <div className="left-panel">
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
      <div className="right-panel">

        {/* LOGIN FORM */}
        {isLogin && (
          <div className="auth-card">
            <h2>Login</h2>

            <form>
              <div className="input-group">
                <input type="text" required />
                <label>Username</label>
              </div>

              <div className="input-group password-group">
                <input type={showPassword ? "text" : "password"} required />
                <label>Password</label>
                <ion-icon
                  class="toggle-password"
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  onClick={() => setShowPassword(!showPassword)}
                ></ion-icon>
              </div>

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
                  class="toggle-password"
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
  );
}

export default Login;