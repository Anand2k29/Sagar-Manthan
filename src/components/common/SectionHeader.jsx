import './SectionHeader.css';

export default function SectionHeader({ title, subtitle, badge, children }) {
  return (
    <div className="section-hdr">
      <div className="section-hdr__left">
        <h2 className="section-hdr__title">{title}</h2>
        {subtitle && <p className="section-hdr__sub">{subtitle}</p>}
      </div>
      <div className="section-hdr__right">
        {badge && <span className="section-hdr__badge">{badge}</span>}
        {children}
      </div>
    </div>
  );
}
