# 🎮 TẾ BÀO XÃ HỘI (THE SOCIAL CELL)

> "Gia đình tốt thì xã hội mới tốt" - Hồ Chí Minh

Game mô phỏng lựa chọn về xây dựng gia đình và đóng góp cho xã hội.

![Game Banner](./docs/banner.png)

## 📖 Giới thiệu

**Tế Bào Xã Hội** là game giáo dục kết hợp giữa Visual Novel và Card Management, giúp người chơi hiểu về:
- Vị trí và chức năng của gia đình trong xã hội
- Cách xây dựng "Gia đình văn hóa"
- Luật Hôn nhân và Gia đình Việt Nam
- Kỹ năng ra quyết định và quản lý cuộc sống

## ✨ Tính năng chính

### 🎯 Core Features
- ✅ **3 độ khó** phản ánh thực tế xã hội (Tiềm lực, Cân bằng, Thử thách)
- ✅ **30+ tình huống** cuộc sống với lựa chọn đa dạng
- ✅ **4 chỉ số** chính: Kinh tế, Giáo dục, Tâm sinh lý, Pháp lý
- ✅ **Hệ thống gia đình** đầy đủ (bạn đời, con cái, ông bà)
- ✅ **10+ endings** khác nhau dựa trên quyết định

### 🚀 Advanced Features (Đang phát triển)
- 🔲 Hệ thống di truyền qua nhiều thế hệ
- 🔲 Tương tác với hàng xóm
- 🔲 Visual Novel cutscenes
- 🔲 Mini-games (Match-3, Quiz, Rhythm, Puzzle)
- 🔲 Photo Album - Album ảnh gia đình
- 🔲 50+ achievements
- 🔲 Random events
- 🔲 Crisis mode

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **State Management**: React Context API
- **Styling**: CSS Modules
- **Storage**: LocalStorage
- **Animations**: CSS Animations (Framer Motion optional)

## 📦 Cài đặt

### Prerequisites
- Node.js 18+
- npm hoặc yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/te-bao-xa-hoi.git

# Di chuyển vào thư mục
cd te-bao-xa-hoi

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
```

## 🎮 Cách chơi

### 1. Chọn điểm xuất phát
Chọn 1 trong 3 gói độ khó:
- **Tiềm lực**: Gia đình giàu có ở thành phố
- **Cân bằng**: Gia đình bình thường ở thị trấn
- **Thử thách**: Gia đình nghèo ở vùng sâu vùng xa

### 2. Đặt tên và giới tính
Tạo nhân vật của bạn

### 3. Trải nghiệm cuộc đời
- Đọc tình huống
- Chọn lựa chọn phù hợp
- Xem ảnh hưởng đến 4 chỉ số
- Xây dựng gia đình hạnh phúc

### 4. Đạt kết thúc
Dựa trên quyết định của bạn, đạt 1 trong 10+ endings

## 📁 Cấu trúc dự án

```
src/
├── components/
│   ├── UI/              # UI components
│   ├── Game/            # Game components
│   ├── Screens/         # Màn hình chính
│   └── Minigames/       # Mini-games
├── contexts/            # React Context
│   └── GameContext.jsx  # Global game state
├── data/                # Game data
│   ├── scenarios.js     # Tình huống
│   ├── characters.js    # Nhân vật
│   └── endings.js       # Kết thúc
├── hooks/               # Custom hooks
├── utils/               # Utilities
├── assets/              # Assets
└── styles/              # Global styles
```

## 📚 Tài liệu

- [Đề án game hoàn chỉnh](./Du_an_game_Te_bao_xa_hoi_HOAN_CHINH.md)
- [Cốt truyện chi tiết](./Cot_truyen_game_Te_bao_xa_hoi.md)
- [Kiến trúc game](./GAME_ARCHITECTURE.md)
- [Hướng dẫn phát triển](./HUONG_DAN_PHAT_TRIEN.md)

## 🎯 Roadmap

### Phase 1: Core Gameplay ✅ (Đang làm)
- [x] Setup project
- [x] Game Context
- [x] StartScreen
- [x] DifficultySelect
- [ ] GameScreen
- [ ] Basic scenarios (10/30)

### Phase 2: Features 🔲
- [ ] CutsceneScreen
- [ ] EndingScreen
- [ ] Photo Album
- [ ] Achievements
- [ ] All scenarios (30/30)

### Phase 3: Polish 🔲
- [ ] Animations
- [ ] Audio
- [ ] Responsive design
- [ ] Bug fixes

### Phase 4: Advanced 🔲
- [ ] Mini-games
- [ ] Neighbor system
- [ ] Legacy system
- [ ] Multiplayer (optional)

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

Dự án này được phát hành dưới [MIT License](./LICENSE)

## 👥 Tác giả

- **[Tên bạn]** - *Initial work* - [GitHub](https://github.com/yourusername)

## 🙏 Cảm ơn

- Cảm ơn Hồ Chí Minh vì câu nói truyền cảm hứng
- Cảm ơn cộng đồng React
- Cảm ơn tất cả những người đóng góp

## 📞 Liên hệ

- Email: your.email@example.com
- Facebook: [Your Page](https://facebook.com/yourpage)
- Discord: [Join Server](https://discord.gg/yourserver)

---

**Made with ❤️ in Vietnam**

*"Mỗi gia đình là một tế bào. Khi tất cả các tế bào khỏe mạnh, cơ thể xã hội sẽ phát triển bền vững."*
