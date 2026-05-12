// RequireAccess.tsx
import { Navigate } from "react-router-dom";
import { useAuthSessionStore } from "@/auth/stores";

type Props = {
  children: React.ReactNode;
  requiredRole?: "ADMIN";
};

export default function RequireAccess({ children, requiredRole }: Props) {
  const hasHydrated = useAuthSessionStore((s) => s.hasHydrated);
  const session = useAuthSessionStore((s) => s.session);

  if (!hasHydrated) return null;
  if (!session) return <Navigate to="/auth/login" replace />;
  if (requiredRole && session.role !== requiredRole) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
}
