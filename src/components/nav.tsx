import Link from "next/link";
import { Code2 } from "lucide-react";
import { GITHUB_REPO_URL } from "@/lib/links";

export function Nav() {
  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <Link href="/" className="brand-link">
        <span className="brand-mark" aria-hidden="true" />
        Lineage
      </Link>
      <div className="nav-links">
        <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="nav-cta">
          <Code2 aria-hidden="true" size={16} />
          GitHub
        </a>
      </div>
    </nav>
  );
}
