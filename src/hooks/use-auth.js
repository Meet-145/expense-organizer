import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authService } from "@/services/auth";

export function useAuth() {
  const [user, setUser] = useState                 (null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setUser(authService.current());
    sync();
    setReady(true);
    return authService.subscribe(sync);
  }, []);

  const signOut = useCallback(() => authService.signOut(), []);

  return { user, ready, signOut };
}

/** Client-side guard for demo-protected pages. */
export function useRequireAuth() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);

  return { user, ready };
}
