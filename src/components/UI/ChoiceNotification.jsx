import './ChoiceNotification.css';

/**
 * Component hiển thị thông báo khi người chơi chọn một lựa chọn
 */
export default function ChoiceNotification({ title, desc, show }) {
    if (!show) return null;

    return (
        <div className="choice-notification">
            <div className="choice-notification-title">✓ {title}</div>
            {desc && <div className="choice-notification-desc">{desc}</div>}
        </div>
    );
}
