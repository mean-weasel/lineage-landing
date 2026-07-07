import {
  GITHUB_ORG_URL,
  GITHUB_PROFILE_URL,
  GITHUB_REPO_URL,
  GITHUB_WEB_REPO_URL,
} from "@/lib/links";

const links = [
  { label: "App repo", href: GITHUB_REPO_URL },
  { label: "Landing repo", href: GITHUB_WEB_REPO_URL },
  { label: "mean-weasel", href: GITHUB_ORG_URL },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        Built by{" "}
        <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer">
          neonwatty
        </a>{" "}
        and mean-weasel.
      </p>
      <div className="footer-links">
        {links.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
