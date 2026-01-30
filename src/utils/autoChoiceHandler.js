/**
 * Tự động wrap tất cả choice buttons với delay và notification
 * Sử dụng event delegation để tương thích với React
 */
let isInitialized = false;

export function initAutoChoiceHandler() {
    if (isInitialized) return;
    isInitialized = true;

    // Sử dụng event delegation ở document level
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.choice-btn');
        if (!button || button.classList.contains('processing')) {
            return;
        }

        const titleElement = button.querySelector('.choice-title');
        const descElement = button.querySelector('.choice-desc');
        
        if (!titleElement) return;

        const title = titleElement.textContent || '';
        const desc = descElement?.textContent || '';

        // Ngăn event bubble để delay trước khi gọi handler gốc
        e.stopImmediatePropagation();
        e.preventDefault();

        // Tạo và hiển thị notification
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

        // Sau 1 giây, ẩn notification và trigger click event gốc
        setTimeout(() => {
            notification.remove();

            // Re-enable buttons
            allButtons.forEach(btn => {
                btn.classList.remove('processing');
                btn.disabled = false;
            });

            // Trigger click event gốc trên button
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            button.dispatchEvent(clickEvent);
        }, 1000);
    }, true); // Use capture phase để intercept trước React
}
