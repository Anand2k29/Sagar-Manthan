import './StatusDot.css';

export default function StatusDot({ color = 'cyan', pulse = false, size = 8 }) {
  return (
    <span
      className={`status-dot status-dot--${color} ${pulse ? 'status-dot--pulse' : ''}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
