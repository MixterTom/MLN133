import { useState, useCallback } from 'react';

/**
 * Hook để xử lý choice selection với delay và notification
 * @returns {Object} { showNotification, selectedChoice, createChoiceHandler }
 */
export function useChoiceSelection() {
    const [showNotification, setShowNotification] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState(null);

    const createChoiceHandler = useCallback((title, desc, originalHandler) => {
        return (e) => {
            // Ngăn default behavior
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            // Hiển thị notification
            setSelectedChoice({ title, desc });
            setShowNotification(true);

            // Disable tất cả choice buttons
            const allButtons = document.querySelectorAll('.choice-btn');
            allButtons.forEach(btn => {
                btn.classList.add('processing');
                btn.disabled = true;
            });

            // Sau 1 giây, ẩn notification và gọi handler gốc
            setTimeout(() => {
                setShowNotification(false);
                setSelectedChoice(null);

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
    }, []);

    return {
        showNotification,
        selectedChoice,
        createChoiceHandler
    };
}
