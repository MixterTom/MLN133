# KIẾN TRÚC GAME "TẾ BÀO XÃ HỘI" - REACT VERSION

## 📁 CẤU TRÚC THỨ MỤC

```
src/
├── components/           # React components
│   ├── UI/              # UI components tái sử dụng
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── ProgressBar.jsx
│   │   └── StatDisplay.jsx
│   ├── Game/            # Game-specific components
│   │   ├── CharacterCard.jsx
│   │   ├── ChoicePanel.jsx
│   │   ├── StatsPanel.jsx
│   │   ├── Timeline.jsx
│   │   ├── FamilyTree.jsx
│   │   └── PhotoAlbum.jsx
│   ├── Screens/         # Màn hình chính
│   │   ├── StartScreen.jsx
│   │   ├── DifficultySelect.jsx
│   │   ├── GameScreen.jsx
│   │   ├── CutsceneScreen.jsx
│   │   ├── EndingScreen.jsx
│   │   └── NeighborScreen.jsx
│   └── Minigames/       # Mini-games
│       ├── MarketMatch3.jsx
│       ├── EducationQuiz.jsx
│       ├── ConversationRhythm.jsx
│       └── LegalPuzzle.jsx
├── data/                # Game data (JSON)
│   ├── scenarios.js     # Tất cả tình huống
│   ├── characters.js    # Dữ liệu nhân vật
│   ├── endings.js       # Các kết thúc
│   ├── achievements.js  # Thành tựu
│   └── dialogues.js     # Hội thoại
├── hooks/               # Custom React hooks
│   ├── useGameState.js  # Quản lý state game
│   ├── useStats.js      # Quản lý stats
│   ├── useSaveLoad.js   # Save/Load game
│   └── useAudio.js      # Âm thanh
├── utils/               # Utility functions
│   ├── gameEngine.js    # Core game logic
│   ├── calculator.js    # Tính toán stats
│   ├── randomEvents.js  # Random events
│   └── storage.js       # LocalStorage helper
├── contexts/            # React Context
│   └── GameContext.jsx  # Global game state
├── assets/              # Assets
│   ├── images/          # Hình ảnh
│   ├── audio/           # Âm thanh
│   └── fonts/           # Font chữ
├── styles/              # CSS/SCSS
│   ├── global.css
│   ├── game.css
│   └── animations.css
├── App.jsx              # Main app
└── main.jsx             # Entry point
```

## 🎯 TECH STACK

### Core
- **React 19** - UI framework
- **Vite** - Build tool
- **Context API** - State management (hoặc Zustand nếu cần)

### Styling
- **CSS Modules** hoặc **Styled Components**
- **Framer Motion** - Animations (optional)

### Storage
- **LocalStorage** - Save game
- **IndexedDB** - Lưu ảnh, data lớn (optional)

### Audio
- **Howler.js** - Audio management (optional)

## 🔧 CORE GAME ENGINE

### GameState Structure
```javascript
{
  // Thông tin cơ bản
  gameId: "uuid",
  version: "1.0",
  createdAt: timestamp,
  
  // Thông tin người chơi
  player: {
    name: "Tên người chơi",
    age: 18,
    gender: "male/female",
    difficulty: "easy/normal/hard"
  },
  
  // Stats chính (0-100)
  stats: {
    economy: 50,      // Kinh tế
    education: 50,    // Giáo dục
    psychology: 50,   // Tâm sinh lý
    legal: 50         // Pháp lý
  },
  
  // Gia đình
  family: {
    spouse: null,     // Bạn đời
    children: [],     // Con cái
    grandparents: []  // Ông bà
  },
  
  // Tiến trình
  progress: {
    year: 1,          // Năm hiện tại
    chapter: 1,       // Chương
    scenarioIndex: 0, // Tình huống hiện tại
    completedScenarios: []
  },
  
  // Hàng xóm
  neighbors: [],
  
  // Thành tựu
  achievements: [],
  
  // Album ảnh
  photos: [],
  
  // Lịch sử quyết định
  decisions: []
}
```

## 🎮 GAME FLOW

### 1. Start Screen
- Logo game
- Menu: New Game, Continue, Settings, Credits

### 2. Difficulty Select
- Chọn gói: Tiềm lực / Cân bằng / Thử thách
- Hiển thị stats ban đầu
- Nhập tên, chọn giới tính

### 3. Game Loop
```
while (game.running) {
  1. Hiển thị tình huống
  2. Người chơi chọn
  3. Tính toán kết quả
  4. Cập nhật stats
  5. Check random event (20%)
  6. Check crisis mode
  7. Lưu ảnh vào album
  8. Tăng thời gian
  9. Check ending condition
}
```

### 4. Ending
- Tính toán rank
- Hiển thị cutscene
- Xem lại album
- Lựa chọn: Chơi lại / Chơi thế hệ 2

## 📊 COMPONENT HIERARCHY

```
App
├── GameProvider (Context)
│   ├── StartScreen
│   ├── DifficultySelect
│   ├── GameScreen
│   │   ├── StatsPanel
│   │   ├── CharacterCard (x nhiều)
│   │   ├── ScenarioDisplay
│   │   ├── ChoicePanel
│   │   └── Timeline
│   ├── CutsceneScreen
│   ├── NeighborScreen
│   └── EndingScreen
│       ├── RankDisplay
│       ├── PhotoAlbum
│       └── AchievementList
```

## 🎨 UI/UX DESIGN PRINCIPLES

### Color Palette
- **Primary**: #FF6B6B (Đỏ ấm - Tình yêu gia đình)
- **Secondary**: #4ECDC4 (Xanh ngọc - Hòa bình)
- **Accent**: #FFE66D (Vàng - Hạnh phúc)
- **Dark**: #2C3E50
- **Light**: #ECF0F1

### Typography
- **Heading**: "Quicksand" hoặc "Nunito" (friendly, warm)
- **Body**: "Inter" hoặc "Open Sans" (readable)
- **Vietnamese**: Hỗ trợ tiếng Việt tốt

### Animations
- Smooth transitions (300ms)
- Card flip khi chọn
- Stats bar animate khi thay đổi
- Fade in/out cho cutscenes

## 💾 SAVE/LOAD SYSTEM

### Auto-save
- Sau mỗi quyết định
- Lưu vào LocalStorage
- Key: `socialcell_save_${gameId}`

### Manual save
- Người chơi có thể save nhiều slot
- Export/Import save file (JSON)

### Cloud save (Future)
- Đồng bộ qua Firebase/Supabase

## 🔊 AUDIO SYSTEM

### Music
- Background music theo mood
- Fade in/out khi chuyển scene

### Sound Effects
- Click button
- Stats change
- Achievement unlock
- Cutscene sounds

## 📱 RESPONSIVE DESIGN

### Desktop (1920x1080)
- Layout 2 cột: Stats bên trái, Game bên phải

### Tablet (768x1024)
- Layout 1 cột, stats ở trên

### Mobile (375x667)
- Simplified UI
- Touch-friendly buttons
- Swipe gestures

## 🚀 PERFORMANCE OPTIMIZATION

### Code Splitting
- Lazy load screens
- Lazy load mini-games

### Image Optimization
- WebP format
- Lazy loading images
- Sprite sheets cho characters

### State Management
- Memoization với useMemo, useCallback
- Avoid unnecessary re-renders

## 🧪 TESTING STRATEGY

### Unit Tests
- Game logic functions
- Stats calculator
- Random event generator

### Integration Tests
- Game flow
- Save/Load
- State management

### Manual Testing
- Playthrough tất cả endings
- Test trên nhiều devices

## 📈 ANALYTICS (Optional)

### Track
- Completion rate
- Popular choices
- Average playtime
- Endings achieved

### Tools
- Google Analytics
- Mixpanel
- Custom analytics

## 🔐 SECURITY

### LocalStorage
- Encrypt save data (optional)
- Validate data khi load

### Cheat Prevention
- Obfuscate code
- Server-side validation (nếu có multiplayer)

---

**Next Steps**: Implement prototype với StartScreen + DifficultySelect + First Scenario
