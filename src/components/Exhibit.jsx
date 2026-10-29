import { useInView } from "../lib/useInView";

export default function Exhibit({ tag, title, children }) {
  const [ref, inView] = useInView();

  return (
    <div className={`exhibit reveal${inView ? " is-visible" : ""}`} ref={ref}>
      <div className="exhibit-label">
        <h3 className="exhibit-title">{title}</h3>
        <span className="exhibit-tag">Exhibit {tag}</span>
      </div>
      {children}
    </div>
  );
}
