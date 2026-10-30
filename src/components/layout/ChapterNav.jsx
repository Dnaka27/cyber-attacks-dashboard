import { useEffect, useState } from "react";

/** Fixed progress rail on wide screens; highlights the chapter closest to the viewport middle. */
export default function ChapterNav({ chapters }) {
  const [active, setActive] = useState(chapters[0]?.id);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  return (
    <nav className="chapter-nav" aria-label="Sections">
      {chapters.map((c) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          className={c.id === active ? "is-active" : ""}
          aria-current={c.id === active ? "true" : undefined}
        >
          <span className="chapter-nav-label">{c.label}</span>
          <span className="chapter-nav-dot" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
