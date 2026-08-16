export default function Exhibit({ tag, title, children }) {
  return (
    <div className="exhibit">
      <div className="exhibit-label">
        <h3 className="exhibit-title">{title}</h3>
        <span className="exhibit-tag">Exhibit {tag}</span>
      </div>
      {children}
    </div>
  );
}
