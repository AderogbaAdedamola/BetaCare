import { Navigate } from "react-router-dom";
import { getRole, isAuthenticated } from "../../lib/api";

/**
 * Wraps a protected route element.
 * - If not authenticated at all -> send to the relevant login.
 * - If authenticated but wrong role -> send to their own dashboard instead
 *   of silently rendering (a patient JWT should never reach a doctor route).
 */
export default function AuthGuard({ role, children }) {
  const authed = isAuthenticated();
  const currentRole = getRole();

  if (!authed) {
    return <Navigate to={role === "doctor" ? "/doctor/login" : "/login"} replace />;
  }

  if (currentRole !== role) {
    return (
      <Navigate
        to={currentRole === "doctor" ? "/doctor/patients" : "/patient/dashboard"}
        replace
      />
    );
  }

  return children;
}
