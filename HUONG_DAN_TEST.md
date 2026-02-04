# 🎮 HƯỚNG DẪN TEST GAME

## 📋 Bước 1: Khởi động game

```bash
# Mở terminal/PowerShell trong thư mục dự án
cd "C:\Users\ADMIN\Desktop\New folder\MLN133"

# Cài đặt dependencies (nếu chưa cài)
npm install

# Chạy development server
npm run dev
```

Sau đó mở trình duyệt tại địa chỉ hiển thị (thường là `http://localhost:5173`)

---

## 🎯 Bước 2: Điều hướng đến Chapter 1

### Cách nhanh nhất:
1. **Màn hình Start** → Click **"BẮT ĐẦU"** hoặc **"GAME MỚI"**
2. **Prologue Screen** → Chọn xuất thân (Tiềm lực/Cân bằng/Thử thách)
3. **Dice of Destiny** → Gieo xúc xắc (có thể xác nhận sớm sau khi khóa)
4. Chọn giới tính → Nhập tên
5. **Tự động chuyển sang Chapter 1**

---

## 🎲 Bước 3: Test các Mini-Game trong Chapter 1

### Mini-Game 1: PathCollectorGame (Chọn con đường)
**Vị trí:** Ngay đầu Chapter 1, sau khi Bà Tiên xuất hiện
- **Cách test:** 
  - Đọc dialogue → Chọn 1 trong 3 con đường (Đại học/Đi làm/Du học)
  - Mini-game sẽ tự động hiện ra
  - Thu thập các item phù hợp với con đường đã chọn

### Mini-Game 2: SocialNetworkGame (Xây dựng mối quan hệ) 👥
**Vị trí:** Step 3.5 - Tuần đầu tiên ở đại học
- **Cách test:**
  - Sau khi vào giảng đường lần đầu
  - Click "Xây dựng mối quan hệ 👥"
  - Tương tác với 5 loại người (bạn cùng lớp, thầy cô, anh chị khóa trên, CLB, bạn cùng phòng)
  - Chọn hành động phù hợp cho mỗi người

### Mini-Game 3: StudyGroupGame (Học nhóm) 📚
**Vị trí:** Step 5 - Sau khi Hùng rủ học nhóm
- **Cách test:**
  - Click "Bắt đầu học nhóm! 📚"
  - Ghép các cặp thẻ giống nhau (Memory Match)
  - Hoàn thành trong 45 giây

### Mini-Game 4: PresentationGame (Thuyết trình nhóm) 🎤 ⭐ MỚI
**Vị trí:** Step 6.5 - Sau khi học nhóm xong
- **Cách test:**
  - Sau khi học nhóm, Hùng sẽ nói về bài thuyết trình
  - Click "Bắt đầu thuyết trình! 🎤"
  - Trình bày 5 slides (Giới thiệu → Vấn đề → Giải pháp → Kết quả → Kết luận)
  - Trả lời câu hỏi từ giảng viên khi xuất hiện
  - Giữ độ tự tin cao để có điểm bonus!

### Mini-Game 5: BudgetGame (Quản lý ngân sách) 💰
**Vị trí:** Step 7 - 3 tháng sau, vấn đề tiền bạc
- **Cách test:**
  - Click "Học quản lý ngân sách 💰"
  - Phân bổ 1000k/tháng cho 4 hạng mục (ăn uống, học tập, giải trí, tiết kiệm)
  - Hoàn thành 3 tháng với phân bổ hợp lý

### Mini-Game 6: TimeManagementGame (Quản lý thời gian) ⏰
**Vị trí:** Trong phần "Cân bằng học và làm" (balance_choice)
- **Cách test:**
  - Sau khi làm thêm ở quán cà phê
  - Bà Tiên xuất hiện → Chọn "⏰ Học quản lý thời gian"
  - Sắp xếp hoạt động vào 24 giờ trong 3 ngày
  - Cân bằng: Học, Làm, Nghỉ, Giao lưu, Tập thể dục

### Mini-Game 7: CafeQTE (Làm thêm quán cà phê) ☕
**Vị trí:** Step 7 trong scenario 'part_time'
- **Cách test:**
  - Sau khi xin việc thành công ở quán cà phê
  - Giờ cao điểm → Mini-game tự động hiện
  - Nhấn phím Q/W/E/R để phục vụ đúng loại đồ uống

---

## 🗺️ Sơ đồ điều hướng nhanh

```
Start Screen
    ↓
Prologue (Chọn xuất thân, giới tính, tên)
    ↓
Chapter 1 - Graduation
    ↓
[MINI-GAME 1] PathCollectorGame - Chọn con đường
    ↓
Chapter 1 - University (nếu chọn đại học)
    ↓
Step 3.5 → [MINI-GAME 2] SocialNetworkGame - Xây dựng mối quan hệ
    ↓
Step 5 → [MINI-GAME 3] StudyGroupGame - Học nhóm
    ↓
Step 6.5 → [MINI-GAME 4] PresentationGame - Thuyết trình ⭐ MỚI
    ↓
Step 7 → [MINI-GAME 5] BudgetGame - Quản lý ngân sách
    ↓
Part-time scenario → [MINI-GAME 7] CafeQTE - Làm thêm
    ↓
Balance choice → [MINI-GAME 6] TimeManagementGame - Quản lý thời gian
```

---

## ⚡ Tips để test nhanh

### 1. Bỏ qua Prologue nhanh:
- Chọn xuất thân bất kỳ
- Gieo xúc xắc → Khóa 1-2 xúc xắc → Click "Xác nhận" ngay (không cần roll hết 5 lần)
- Chọn giới tính → Nhập tên ngắn → Enter

### 2. Test từng mini-game riêng:
- Mỗi mini-game có thể test độc lập
- Sau khi hoàn thành, stats sẽ được cập nhật
- Click tiếp tục để xem kết quả

### 3. Kiểm tra UI/UX:
- ✅ Stats panel không bị che
- ✅ Mini-game hiển thị đầy đủ
- ✅ Buttons hoạt động mượt
- ✅ Text dễ đọc
- ✅ Responsive trên màn hình nhỏ

---

## 🐛 Nếu gặp lỗi

1. **Game không chạy:**
   ```bash
   npm install
   npm run dev
   ```

2. **Mini-game không hiện:**
   - Kiểm tra console (F12) xem có lỗi không
   - Đảm bảo đã đi đúng flow đến vị trí mini-game

3. **Stats không cập nhật:**
   - Hoàn thành mini-game đầy đủ
   - Click "Tiếp tục" sau khi thấy thông báo thay đổi stats

---

## 📝 Checklist test

- [ ] PathCollectorGame - Chọn con đường
- [ ] SocialNetworkGame - Xây dựng mối quan hệ
- [ ] StudyGroupGame - Học nhóm
- [ ] **PresentationGame - Thuyết trình** ⭐ MỚI
- [ ] BudgetGame - Quản lý ngân sách
- [ ] TimeManagementGame - Quản lý thời gian
- [ ] CafeQTE - Làm thêm quán cà phê
- [ ] DiceOfDestiny - Xác nhận sớm sau khi khóa
- [ ] Stats panel không bị che
- [ ] Tất cả buttons hoạt động

---

**Chúc bạn test vui vẻ! 🎮✨**
