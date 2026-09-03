import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Login.css";

// a single page that can switch between logging in and signing up
// this covers the "Login page or view reservations" requirement from the top header
export default function Login() {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!email.includes("@")) {
      return "Please enter a valid email address.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (mode === "signup" && username.trim().length < 2) {
      return "Please enter your name.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <h1>{mode === "login" ? "Log in" : "Sign up"}</h1>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="username">Name</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
                type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
              <button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? "Hide password" : "Show password"}
              </button>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-card__submit" disabled={submitting}>
            {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="login-card__switch">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>

        {mode === "login" && (
          <p className="login-card__hint">
            Try the sample account: john@example.com / password123
          </p>
        )}
      </div>
    </main>
  );
}
