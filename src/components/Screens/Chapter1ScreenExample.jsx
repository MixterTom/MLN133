import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import DialogueScreen from '../Common/DialogueScreen';

/**
 * Example of using DialogueScreen component
 * This is a cleaner way to build chapters
 */
export default function Chapter1ScreenExample() {
    const { state } = useGame();
    const [scene, setScene] = useState(0);

    // Scene 0: Sinh nhật 18 tuổi
    if (scene === 0) {
        return (
            <DialogueScreen
                background="bandoi"
                character="/assets/characters/bạn_thân_vui_vẻ.png"
                speaker="Bạn thân"
                dialogue={`Chào ${state.player.name}! Chúc mừng sinh nhật 18 tuổi!\n\nCuộc đời mới bắt đầu đây! Bạn có kế hoạch gì cho tương lai không?`}
                choices={[
                    {
                        title: '📚 Đi học đại học',
                        desc: 'Theo đuổi tri thức, mở rộng cơ hội',
                        stats: { knowledge: 20, economy: -10, happiness: 10 }
                    },
                    {
                        title: '💼 Đi làm ngay',
                        desc: 'Kiếm tiền sớm, tích lũy kinh nghiệm',
                        stats: { economy: 15, knowledge: -5, social: 10 }
                    },
                    {
                        title: '✈️ Du học',
                        desc: 'Trải nghiệm thế giới, học hỏi văn hóa mới',
                        stats: { knowledge: 25, economy: -20, social: 15, happiness: 15 }
                    }
                ]}
                onChoiceMade={(choice, index) => {
                    console.log('Player chose:', choice.title);
                    setScene(1);
                }}
            />
        );
    }

    // Scene 1: Sau khi chọn
    if (scene === 1) {
        return (
            <DialogueScreen
                background="bandoi"
                character="/assets/characters/bạn_thân_thích_thú.png"
                speaker="Bạn thân"
                dialogue={`Tuyệt vời! Quyết định của bạn sẽ định hình tương lai đấy!\n\nChúc bạn may mắn trên con đường mình đã chọn!`}
                continueButton={
                    <button className="continue-btn" onClick={() => setScene(0)}>
                        Tiếp tục →
                    </button>
                }
            />
        );
    }
}
