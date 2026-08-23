

/**
 * Mock authentication for the prototype.
 * Replace with Supabase Auth (`supabase.auth.signInWithPassword`) later —
 * the shape of `DemoUser` maps 1:1 to a `profiles` row. See ARCHITECTURE.md.
 */
const KEY = "eo.session.v1";

const DEMO_USER           = {
  id: "usr_demo_1",
  name: "Rudra Modi",
  email: "owner@brightleaf.in",
  company: "Brightleaf Traders Pvt Ltd",
  plan: "Growth",
};

function isBrowser() {
  return typeof window !== "undefined";
}

export const authService = {
  current()                  {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw)            ) : null;
    } catch {
      return null;
    }
  },
  async signIn(email        , password        )                    {
    await new Promise((r) => setTimeout(r, 700));
    if (!email.includes("@")) throw new Error("Please enter a valid email address.");
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");
    const user           = { ...DEMO_USER, email };
    this.persist(user);
    return user;
  },
  async signUp(input                                                                    ) {
    await new Promise((r) => setTimeout(r, 900));
    if (!input.email.includes("@")) throw new Error("Please enter a valid email address.");
    if (input.password.length < 6) throw new Error("Password must be at least 6 characters.");
    const user           = {
      id: "usr_" + Math.random().toString(36).slice(2, 8),
      name: input.name || "New User",
      email: input.email,
      company: input.company || "My Business",
      plan: "Starter",
    };
    this.persist(user);
    return user;
  },
  persist(user          ) {
    if (!isBrowser()) return;
    window.localStorage.setItem(KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("eo:auth-changed"));
  },
  signOut() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent("eo:auth-changed"));
  },
  subscribe(cb            ) {
    if (!isBrowser()) return () => {};
    window.addEventListener("eo:auth-changed", cb);
    window.addEventListener("storage", cb);
    return () => {
      window.removeEventListener("eo:auth-changed", cb);
      window.removeEventListener("storage", cb);
    };
  },
};
