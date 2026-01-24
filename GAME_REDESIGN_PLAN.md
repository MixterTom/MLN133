# 🎮 KẾ HOẠCH THIẾT KẾ LẠI GAME - TẾ BÀO XÃ HỘI

**Date**: 19/01/2026  
**Version**: 2.0 - Complete Redesign  
**GitHub**: https://github.com/MixterTom/MLN133.git

---

## 🎯 MỤC TIÊU REDESIGN

### ❌ VẤN ĐỀ CŨ
1. Không có opening/intro story
2. Không có nhân vật, không có hội thoại
3. Chỉ đọc text → chọn → xem kết quả (nhàm chán)
4. Thiếu yếu tố bất ngờ, drama
5. Không có mini-games, không có thử thách
6. UI đơn điệu, thiếu tương tác

### ✅ GIẢI PHÁP MỚI
1. **Opening Cinematic** với cốt truyện hấp dẫn
2. **Dialogue System** - Nhân vật nói chuyện thật
3. **Visual Novel Style** - Character sprites, emotions
4. **Interactive Mini-games** - Match-3, Quiz, Rhythm, Puzzle
5. **Random Events** - Dice rolls, Wheel of fortune, QTE
6. **Branching Storylines** - Lựa chọn ảnh hưởng sâu sắc
7. **Rich Characters** - Nhân vật có tính cách, quan hệ

---

## 📋 DANH SÁCH CÔNG VIỆC HOÀN CHỈNH

### PHASE 1: OPENING & STORY SYSTEM (8-10 hours)

#### 1.1 IntroScreen.jsx ⏱️ 2h
```javascript
Features:
- Cinematic intro với 3 cảnh gia đình
- Typewriter effect cho narrator
- Background slideshow
- Fade transitions
- Skip button
- Background music
```

#### 1.2 PrologueScreen.jsx ⏱️ 2h
```javascript
Features:
- Gặp Bà Tiên Duyên
- Character sprite animation
- Interactive dialogue
- Character creation:
  * Nhập tên
  * Chọn giới tính
  * Chọn personality (Lạc quan/Thực tế/Bi quan)
  * Chọn dream (Giàu/Hạnh phúc/Nổi tiếng/Bình yên)
  * Chọn fear (Nghèo/Cô đơn/Thất bại/Mất người thân)
```

#### 1.3 OriginStoryScreen.jsx ⏱️ 2h
```javascript
Features:
- Thay thế DifficultySelect
- 3 gia đình với story đầy đủ:
  * Gia đình Trần (Hà Nội - Giàu)
  * Gia đình Nguyễn (Đà Nẵng - Bình thường)
  * Gia đình Lê (Cao Bằng - Nghèo)
- Mini cutscene cho mỗi gia đình
- Show bố mẹ, môi trường sống
```

#### 1.4 BirthCutscene.jsx ⏱️ 1h
```javascript
Features:
- Cutscene ngày sinh
- Animation baby
- Bố mẹ đặt tên
- Fast forward 18 năm
```

#### 1.5 ChapterIntroScreen.jsx ⏱️ 1h
```javascript
Features:
- Intro cho mỗi chapter (5 chapters)
- Chapter title animation
- Bà Tiên comment
- Transition effects
```

---

### PHASE 2: DIALOGUE SYSTEM (10-12 hours)

#### 2.1 DialogueSystem.jsx ⏱️ 3h
```javascript
Core Features:
- Dialogue flow engine
- Branch management
- State tracking
- Auto-save dialogue progress
- History/backlog

Data Structure:
{
  scene: { background, music, characters },
  dialogue: [
    { speaker, text, emotion, sprite },
    { type: 'choice', choices: [...] }
  ],
  branches: { path_a: [...], path_b: [...] }
}
```

#### 2.2 DialogueBox.jsx ⏱️ 2h
```javascript
Features:
- Typewriter effect
- Character avatar
- Name plate
- Speech bubble style
- Skip animation
- Auto-advance option
- Different styles per character
```

#### 2.3 CharacterSprite.jsx ⏱️ 2h
```javascript
Features:
- Multiple emotions (10+ per character)
- Positions (left/center/right)
- Entrance/exit animations
- Idle animations (breathing, blinking)
- Highlight when speaking
- Flip horizontal

Characters needed:
- Bà Tiên Duyên (5 emotions)
- Bố (5 emotions)
- Mẹ (5 emotions)
- Player (10 emotions)
- 5 Spouse candidates (5 emotions each)
- Con (3 emotions)
- Ông bà (3 emotions)
```

#### 2.4 ChoiceButtons.jsx ⏱️ 1h
```javascript
Features:
- Speech bubble style
- Color coding by emotion
- Timer option
- Effects preview on hover
- Animations
- Sound effects
```

#### 2.5 SceneBackground.jsx ⏱️ 2h
```javascript
Features:
- Multiple layers (parallax)
- Weather effects (rain, snow)
- Time of day (morning/afternoon/night)
- Particle effects
- Smooth transitions

Scenes needed (15):
- Living room, Bedroom, Kitchen
- School, Office, Hospital
- Park, Restaurant, Mall
- Wedding venue, Funeral
- Street, Beach, Mountain, Countryside
```

---

### PHASE 3: MINI-GAMES (12-15 hours)

#### 3.1 Match3Game.jsx ⏱️ 4h
```javascript
Features:
- 8x8 grid
- Match 3+ coins/money
- Time limit: 30s
- Score system
- Special items (bomb, x2)
- Particle effects
- Sound effects

Integration:
- Scenario: "Đầu tư chứng khoán"
- Score > 1000: +30 economy
- Score 500-1000: +15 economy
- Score < 500: -10 economy
```

#### 3.2 QuizGame.jsx ⏱️ 3h
```javascript
Features:
- 5 questions
- 10s per question
- Multiple choice (4 options)
- Topics: Văn hóa, Lịch sử, Pháp luật
- Score tracking
- Correct/Wrong feedback

Integration:
- Scenario: "Thi đại học"
- 4-5 correct: Pass (+20 education)
- 2-3 correct: Average (+10 education)
- 0-1 correct: Fail (-5 education)
```

#### 3.3 RhythmGame.jsx ⏱️ 4h
```javascript
Features:
- Music beats
- Press keys on beat (A, S, D, F)
- Perfect/Good/Miss feedback
- Combo system
- Visual feedback (notes falling)
- Score calculation

Integration:
- Scenario: "Cãi nhau với vợ/chồng"
- Perfect: +20 psychology (hòa giải)
- Good: +10 psychology
- Miss: -10 psychology (mâu thuẫn tăng)
```

#### 3.4 PuzzleGame.jsx ⏱️ 4h
```javascript
Features:
- Jigsaw puzzle hoặc logic puzzle
- Drag & drop pieces
- Time limit
- Hint system
- Difficulty levels

Integration:
- Scenario: "Ký hợp đồng"
- Complete: +20 legal (tránh lừa đảo)
- Partial: +10 legal
- Fail: -15 legal (bị lừa)
```

---

### PHASE 4: INTERACTIVE ELEMENTS (8-10 hours)

#### 4.1 DiceRoll.jsx ⏱️ 2h
```javascript
Features:
- 3D dice animation
- Roll 2 dice (2-12)
- Sound effects
- Particle effects
- Result affects outcome

Usage:
- Random events
- Luck-based scenarios
- Gambling scenarios
```

#### 4.2 WheelOfFortune.jsx ⏱️ 3h
```javascript
Features:
- Spinning wheel animation
- 8 segments (different outcomes)
- Spinning sound
- Win/Lose animations
- Confetti for big wins

Usage:
- Lottery scenarios
- Big decisions
- Random rewards
```

#### 4.3 QTE.jsx (Quick Time Events) ⏱️ 2h
```javascript
Features:
- Press key at right time
- Multiple keys sequence
- Very short time window
- Visual feedback
- Success/Fail animations

Usage:
- Tai nạn: Press SPACE to dodge
- Cứu người: Mash A rapidly
- Tranh cãi: Press correct emotion key
```

#### 4.4 TimerChoice.jsx ⏱️ 1h
```javascript
Features:
- Countdown timer (10-30s)
- Visual countdown
- Urgent sound effects
- Auto-select if timeout
- Tension music

Usage:
- Emergency scenarios
- Pressure decisions
- Crisis moments
```

---

### PHASE 5: DATA RESTRUCTURE (15-20 hours)

#### 5.1 Viết lại 30 scenarios ⏱️ 12h
```javascript
// Format mới: Dialogue-based

Mỗi scenario bao gồm:
- Scene setup (background, music, characters)
- Dialogue tree (branching conversations)
- Character interactions
- Mini-game integration (optional)
- Multiple endings per scenario
- Consequences tracking

Estimate: 20-30 minutes per scenario
Total: 10-15 hours
```

#### 5.2 Character Data ⏱️ 2h
```javascript
// characters.js - Expanded

Mỗi character:
- Name, age, background
- 5-10 sprite variations (emotions)
- Personality traits
- Voice characteristics
- Relationship values
- Story arc
```

#### 5.3 Relationship System ⏱️ 3h
```javascript
// relationships.js

Features:
- Relationship meters (0-100)
- Status levels (Stranger/Friend/Close/Love/Hate)
- Relationship affects dialogue options
- Relationship affects endings
- Visual relationship indicators
```

#### 5.4 Memory System ⏱️ 3h
```javascript
// memories.js

Features:
- Track important decisions
- Flashback system
- References in dialogue
- Affects future scenarios
- Display in ending summary
```

---

### PHASE 6: VISUAL ASSETS (10-15 hours)

#### 6.1 Character Sprites ⏱️ 6h
```
Create/Generate:
- 10 characters x 5 emotions = 50 images
- Style: Anime/Semi-realistic
- Size: 512x512px
- Format: PNG transparent

Tools:
- AI generators (Midjourney, DALL-E, Stable Diffusion)
- Or commission artist
```

#### 6.2 Scene Backgrounds ⏱️ 4h
```
Create/Generate:
- 15 scenes x 3 times = 45 images
- Style: Realistic/Painted
- Size: 1920x1080px
- Format: WebP optimized

Scenes:
Living room, Bedroom, Kitchen, School, Office,
Hospital, Park, Restaurant, Mall, Wedding,
Funeral, Street, Beach, Mountain, Countryside
```

#### 6.3 CG Images ⏱️ 3h
```
Create/Generate:
- 20 special moment images
- High quality illustrations
- Size: 1920x1080px

Moments:
First kiss, Wedding, Birth, Graduation,
Success, Failure, Reunion, Farewell, etc.
```

#### 6.4 UI Elements ⏱️ 2h
```
Create/Find:
- Icons (50+)
- Buttons (10 styles)
- Frames/Borders
- Particles
- Effects
```

---

### PHASE 7: AUDIO SYSTEM (6-8 hours)

#### 7.1 Background Music ⏱️ 3h
```
Find/Create:
- Main theme (upbeat)
- Happy theme (family)
- Sad theme (conflicts)
- Romantic theme (love)
- Tense theme (crisis)
- Peaceful theme (ending)
- Victory theme (achievements)

Total: 7 tracks, 2-3 min each
Format: MP3, 128kbps
Sources: Freesound, OpenGameArt, AI music generators
```

#### 7.2 Sound Effects ⏱️ 2h
```
Find/Create:
- Button click
- Choice select
- Page turn
- Achievement unlock
- Notification
- Success/Failure
- Dice roll
- Wheel spin
- Match-3 sounds
- Dialogue beep

Total: 20+ SFX
Format: MP3, short clips
```

#### 7.3 AudioManager.jsx ⏱️ 3h
```javascript
Features:
- Background music player
- SFX player
- Volume controls (master, music, sfx)
- Mute/Unmute
- Save preferences
- Crossfade between tracks
- Preloading
```

---

### PHASE 8: ADVANCED FEATURES (10-12 hours)

#### 8.1 Branching System ⏱️ 3h
```javascript
Features:
- Complex branching based on:
  * Previous choices
  * Stats levels
  * Relationships
  * Achievements
  * Random events
- Path tracking
- Multiple endings per scenario
```

#### 8.2 Consequence System ⏱️ 3h
```javascript
Features:
- Long-term consequences
- Butterfly effect
- Callback references
- Karma system
- Reputation tracking
```

#### 8.3 Dynamic Dialogue ⏱️ 2h
```javascript
Features:
- Dialogue changes based on:
  * Gender
  * Stats
  * Relationships
  * Previous choices
  * Personality
- Procedural dialogue generation
```

#### 8.4 Advanced Animations ⏱️ 4h
```javascript
Features:
- Particle systems
- Screen shake
- Flash effects
- Transition effects
- Character animations
- UI animations
```

---

### PHASE 9: POLISH & OPTIMIZATION (8-10 hours)

#### 9.1 Mobile Optimization ⏱️ 3h
```
- Touch controls
- Swipe gestures
- Responsive layouts
- Performance optimization
- Smaller assets
- Touch-friendly buttons
```

#### 9.2 Accessibility ⏱️ 2h
```
- Text size options
- High contrast mode
- Colorblind mode
- Keyboard navigation
- Screen reader support
- Subtitles/Captions
```

#### 9.3 Performance ⏱️ 3h
```
- Lazy loading
- Image optimization
- Code splitting
- Caching
- Preloading
- Bundle optimization
```

---

## 📊 TỔNG KẾT

### TOTAL TIME ESTIMATE: 90-110 hours

```
Phase 1: Opening & Story        8-10 hours
Phase 2: Dialogue System        10-12 hours
Phase 3: Mini-games             12-15 hours
Phase 4: Interactive Elements   8-10 hours
Phase 5: Data Restructure       15-20 hours
Phase 6: Visual Assets          10-15 hours
Phase 7: Audio System           6-8 hours
Phase 8: Advanced Features      10-12 hours
Phase 9: Polish & Optimization  8-10 hours
-------------------------------------------
TOTAL:                          90-110 hours
```

### BREAKDOWN BY PRIORITY

#### 🔴 MUST HAVE (50 hours)
1. Dialogue System (10h)
2. Character Sprites (6h)
3. Rewrite 30 scenarios (12h)
4. Opening/Prologue (6h)
5. Basic mini-games (8h)
6. Scene backgrounds (4h)
7. Audio system (4h)

#### 🟡 SHOULD HAVE (30 hours)
8. Interactive elements (8h)
9. Branching system (3h)
10. Relationship system (3h)
11. CG images (3h)
12. Advanced animations (4h)
13. Memory system (3h)
14. Dynamic dialogue (2h)
15. Mobile optimization (3h)

#### 🟢 NICE TO HAVE (30 hours)
16. Voice acting (5h)
17. Advanced mini-games (8h)
18. Multiplayer features (10h)
19. Social features (5h)
20. Accessibility (2h)

---

## 🚀 EXECUTION TIMELINE

### Week 1-2: Core Dialogue (20h)
- Dialogue system
- Character sprites (basic)
- Scene backgrounds (basic)
- Rewrite 10 scenarios

### Week 3-4: Interactive (20h)
- Mini-games (all 4)
- Interactive elements
- Rewrite 10 scenarios

### Week 5-6: Polish (20h)
- Audio system
- Advanced features
- Rewrite 10 scenarios
- Testing

### Week 7-8: Final (20h)
- Visual assets (complete)
- Optimization
- Bug fixes
- Launch prep

---

## ✅ SUCCESS CRITERIA

- [ ] Opening cinematic done
- [ ] Dialogue system working
- [ ] 30 scenarios rewritten
- [ ] All 4 mini-games working
- [ ] Character sprites created
- [ ] Backgrounds added
- [ ] Audio system working
- [ ] Branching working
- [ ] Mobile optimized
- [ ] No critical bugs
- [ ] Load time < 3s
- [ ] Fun to play!

---

**Status**: 📋 Planning Complete  
**Next**: 🚀 Start Implementation  
**Target**: 🎮 Amazing Game!

**Let's build this! 💪**
