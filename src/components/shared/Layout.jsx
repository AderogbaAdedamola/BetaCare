import { Link, useNavigate } from "react-router-dom";
import { clearSession, getRole, isAuthenticated } from "../../lib/api";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const role = getRole();

  function handleLogout() {
    clearSession();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-line bg-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-teal-900 text-lg tracking-tight">
            BetaCare
          </Link>
          {authed && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-ink/50 capitalize">{role} portal</span>
              <button
                onClick={handleLogout}
                className="text-teal-900 hover:text-clay transition-colors font-medium"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
