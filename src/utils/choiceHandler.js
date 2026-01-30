/**
 * Utility function để tạo choice handler với delay và notification
 * Sử dụng khi không muốn dùng hook (ví dụ trong component không phải React)
 * 
 * @param {string} title - Tiêu đề của lựa chọn
 * @param {string} desc - Mô tả của lựa chọn
 * @param {Function} originalHandler - Handler gốc cần gọi sau delay
 * @returns {Function} Handler mới với delay và notification
 */
export function createChoiceHandlerWithNotification(title, desc, originalHandler) {
    return (e) => {
        // Ngăn default behavior
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Tạo và hiển thị notification element
        const notification = document.createElement('div');
        notification.className = 'choice-notification';
        notification.innerHTML = `
            <div class="choice-notification-title">✓ ${title}</div>
            ${desc ? `<div class="choice-notification-desc">${desc}</div>` : ''}
        `;
        document.body.appendChild(notification);

        // Disable tất cả choice buttons
        const allButtons = document.querySelectorAll('.choice-btn');
        allButtons.forEach(btn => {
            btn.classList.add('processing');
            btn.disabled = true;
        });

        // Sau 1 giây, ẩn notification và gọi handler gốc
        setTimeout(() => {
            notification.remove();

            // Re-enable buttons
            allButtons.forEach(btn => {
                btn.classList.remove('processing');
                btn.disabled = false;
            });

            // Gọi handler gốc
            if (originalHandler) {
                originalHandler(e);
            }
        }, 1000);
    };
}
