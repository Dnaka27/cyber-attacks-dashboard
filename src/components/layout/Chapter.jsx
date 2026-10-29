import { useInView } from "../../lib/useInView";

export default function Chapter({ number, title, blurb, children }) {
  const [ref, inView] = useInView();

  return (
    <section className={`chapter reveal${inView ? " is-visible" : ""}`} ref={ref}>
      <header className="chapter-head">
        <span className="chapter-number num">{number}</span>
        <div>
          <h2 className="chapter-title">{title}</h2>
          {blurb && <p className="chapter-blurb">{blurb}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}
