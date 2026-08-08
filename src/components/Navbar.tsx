import { Link, useLocation } from "wouter";
import { Show, useUser, useClerk } from "@clerk/react";
import Icon from "./Icon";

const NAV_LINKS = new Array();

function AuthedActions() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [, setLocation] = useLocation();

  const handleSignOut = () => {
    signOut(() => setLocation("/"));
  };

  return (
    <>
      <Link href="/history" className="btn-ghost">
        History
      </Link>
      <Link
        href="/account"
        className="btn-ghost"
        style={{ color: "var(--foreground)" }}
      >
        {user?.firstName || "Account"}
      </Link>
      <Link href="/start" className="btn-primary">
        Take Quiz
      </Link>
      <button type="button" className="btn-ghost" onClick={handleSignOut}>
        Sign out
      </button>
    </>
  );
}

export default function Navbar() {
  const [location] = useLocation();
  const isQuizFlow =
    location.startsWith("/start") ||
    location.startsWith("/quiz") ||
    location.startsWith("/results");

  return (
    <nav className="pf-navbar">
      <Link href="/" className="logo">
        <div className="logo-icon">
          <Icon icon="lucide:zap" size={16} color="#fff" />
        </div>
        CareerForge
      </Link>

      {!isQuizFlow && (
        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      )}

      <div className="nav-actions">
        <Show when="signed-in">
          <AuthedActions />
        </Show>
        <Show when="signed-out">
          <Link href="/sign-in" className="btn-ghost">
            Sign in
          </Link>
          <Link href="/sign-up" className="btn-primary">
            Get started free
          </Link>
        </Show>
      </div>
    </nav>
  );
}
