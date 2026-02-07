# Cải Thiện Cốt Truyện Du Học

## Tổng Quan
Đã cải thiện cốt truyện du học để phản ánh kết quả minigame PathCollectorGame, tạo ra 3 nhánh khác nhau dựa trên điểm số người chơi đạt được.

## 3 Nhánh Cốt Truyện

### 1. EXCELLENT (≥81 điểm) - Học Bổng Toàn Phần ⭐⭐⭐
**Bonus Stats:** +35 knowledge, +25 social, +20 happiness, +15 economy

**Đặc điểm:**
- Được học bổng toàn phần từ trường top thế giới
- Bố mẹ rất tự hào, không lo về tiền bạc
- Phòng KTX cao cấp, điều kiện học tập tốt
- Nhiều cơ hội thực tập và networking
- Tốt nghiệp loại xuất sắc
- Về VN được nhiều công ty săn đón
- Lương khởi điểm 30 triệu

**Kết thúc:** Thành công rực rỡ nhưng vẫn có chút nuối tiếc về 4 năm xa gia đình

---

### 2. GOOD (50-80 điểm) - Du Học Tự Túc ⭐⭐
**Bonus Stats:** +25 knowledge, +15 social, +10 happiness, +10 economy

**Đặc điểm:**
- Du học tự túc, gia đình lo lắng về tiền bạc
- Điều kiện sống bình thường
- Học tập ổn, có bạn bè quốc tế
- Tiến bộ dần dần qua các năm
- Tốt nghiệp với bằng cấp tốt
- Về VN xin việc bình thường
- Có công việc nhưng không nổi bật

**Kết thúc:** Cân bằng giữa thành công và hy sinh

---

### 3. AVERAGE (20-49 điểm) - Trường Chất Lượng Thấp ⭐
**Bonus Stats:** +15 knowledge, +10 social, +5 happiness, -5 economy

**Đặc điểm:**
- Trường không nổi tiếng, chất lượng thấp
- Mẹ lo lắng, khuyên phải cố gắng gấp đôi
- Phòng KTX cũ kỹ, điều kiện kém
- Giáo sư dạy không rõ ràng
- Phải làm thêm để có tiền sinh hoạt
- Mệt mỏi, vất vả
- Tốt nghiệp với điểm không cao
- Về VN khó xin việc, lương thấp (8 triệu thử việc)

**Kết thúc:** Hối hận về quyết định du học, cảm thấy lãng phí 4 năm

---

### 4. POOR (<20 điểm) - Visa Bị Từ Chối 💔
**Bonus Stats:** +5 knowledge, -15 happiness, -20 economy, -10 health

**Kết quả:** KHÔNG ĐI ĐƯỢC! Tự động chuyển sang nhánh Đại Học Việt Nam

---

## Chi Tiết Các Thay Đổi

### Step 1: Phản ứng gia đình
- **Excellent:** Bố vui vẻ, tự hào về học bổng
- **Average:** Mẹ lo lắng, nhắc nhở phải cố gắng
- **Good:** Mẹ dặn dò về sức khỏe

### Step 2: Tâm trạng nhân vật
- **Excellent:** Vui vẻ, tự tin
- **Average:** Lo lắng, quyết tâm chứng minh
- **Good:** Buồn, lo lắng

### Step 8: Tháng đầu tiên
- **Excellent:** Phòng cao cấp, tự tin, chỉ nhớ nhà
- **Average:** Phòng cũ kỹ, lo lắng, stress
- **Good:** Lo lắng về tiếng Anh

### Step 13: Năm 2
- **Excellent:** Tiến bộ nhanh, nhiều cơ hội thực tập
- **Average:** Vất vả, phải làm thêm, mệt mỏi
- **Good:** Tiến bộ ổn, có bạn bè

### Step 17: Tốt nghiệp
- **Excellent:** Loại xuất sắc, nhiều offer
- **Average:** Điểm thấp, khó xin việc
- **Good:** Bằng tốt, cân nhắc ở lại hay về

### Step 21: Xin việc ở VN
- **Excellent:** Được săn đón, lương 30 triệu
- **Average:** Bị xem thường, lương 8 triệu
- **Good:** Khó khăn vì thiếu kinh nghiệm VN

### Step 22: Kết thúc
- **Excellent:** Thành công nhưng nuối tiếc
- **Average:** Hối hận, cảm thấy lãng phí
- **Good:** Hoài nghi về quyết định

---

## Ảnh Hưởng Đến Gameplay

### Stats Changes
Mỗi nhánh có stats bonus khác nhau từ minigame và các event trong cốt truyện

### Flags
- `study_abroad_quality`: 'excellent', 'good', 'average', 'poor'
- `study_abroad_success`: true (nếu excellent)
- `study_abroad_struggle`: true (nếu average)
- `study_abroad_difficulty`: true/false (ảnh hưởng đến Chapter 2+)

### Choices
- `study_abroad_scholarship` (excellent)
- `study_abroad_success` (good)
- `study_abroad_struggle` (average)
- `study_abroad_failed` (poor - không đi được)

---

## Thông Điệp Game

1. **Excellent:** Thành công cần cả tài năng và may mắn, nhưng vẫn có cái giá phải trả
2. **Good:** Nỗ lực sẽ được đền đáp, dù không hoàn hảo
3. **Average:** Không phải lựa chọn nào cũng đúng, đôi khi cần biết từ bỏ
4. **Poor:** Thất bại không phải là kết thúc, còn nhiều con đường khác

---

## Kết Luận

Cốt truyện du học giờ đây có ý nghĩa hơn nhiều:
- Minigame không chỉ là trò chơi mà ảnh hưởng trực tiếp đến cốt truyện
- Người chơi thấy được hậu quả của lựa chọn và kỹ năng
- Mỗi nhánh có trải nghiệm riêng biệt
- Phản ánh thực tế: du học không phải lúc nào cũng là lựa chọn tốt nhất
