import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    logout();
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <header className="app-header">
      <div className="app-header__left">
        <Link to="/" className="brand">
          AI Support
        </Link>
      </div>
      <div className="app-header__right">
        {user ? (
          <>
            <span className="user-chip">Hi, {user.name || user.email}</span>
            <Link to="/admin/faqs" className="secondary">
              Admin
            </Link>
            <button className="secondary" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="secondary">
              Login
            </Link>
            <Link to="/signup" className="primary">
              Sign up
            </Link>
            <Link to="/admin/faqs" className="secondary">
              Admin
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
