# 🎮 Returnee Interview Game - Minigame Phỏng Vấn Xin Việc

## Tổng Quan
Minigame phỏng vấn xin việc sau khi du học về Việt Nam. Kết quả phỏng vấn quyết định xem bạn có được nhận việc không và mức lương khởi điểm.

## Vị Trí Trong Game
- **Scenario:** `study_abroad`
- **Step:** 20 (Sau khi về Việt Nam, trước khi gặp nhà tuyển dụng)
- **Trigger:** Tự động sau khi hoàn thành step 19

## Gameplay

### Cơ Chế
- **Loại:** Question & Answer với time limit
- **Số câu hỏi:** 5 câu
- **Thời gian mỗi câu:** 15 giây
- **Điểm số:** Mỗi câu trả lời có điểm khác nhau (-10 đến +20)

### Quy Tắc
1. Đọc câu hỏi của nhà tuyển dụng
2. Chọn 1 trong 4 đáp án trong 15 giây
3. Nhận feedback ngay lập tức
4. Tổng điểm quyết định kết quả phỏng vấn

## 3 Loại Phỏng Vấn (Dựa Trên Chất Lượng Du Học)

### 1. EXCELLENT - Công Ty Đa Quốc Gia 🏢
**Điều kiện:** `study_abroad_quality === 'excellent'`

**Câu hỏi tập trung vào:**
- Kinh nghiệm môi trường đa văn hóa
- Điểm mạnh so với ứng viên khác
- Mức lương mong muốn (25-30 triệu)
- Lý do về Việt Nam
- Thời gian bắt đầu làm việc

**Thresholds:**
- Excellent: ≥85 điểm → Lương 30 triệu
- Good: ≥65 điểm → Lương 25 triệu
- Average: ≥40 điểm → Lương 20 triệu
- Poor: <40 điểm → Không được nhận

---

### 2. GOOD - Công Ty Trong Nước 🏢
**Điều kiện:** `study_abroad_quality === 'good'`

**Câu hỏi tập trung vào:**
- Kinh nghiệm làm việc tại VN
- So sánh với ứng viên học trong nước
- Hiểu biết văn hóa làm việc VN
- Mức lương mong muốn (12-15 triệu)
- Sẵn sàng làm overtime

**Thresholds:**
- Excellent: ≥80 điểm → Lương 15 triệu
- Good: ≥60 điểm → Lương 12 triệu
- Average: ≥35 điểm → Lương 10 triệu (thử việc)
- Poor: <35 điểm → Không được nhận

---

### 3. AVERAGE - Công Ty Nhỏ 🏢
**Điều kiện:** `study_abroad_quality === 'average'`

**Câu hỏi tập trung vào:**
- Giải thích về trường không nổi tiếng
- Tại sao không xin công ty lớn
- Sẵn sàng làm nhiều việc
- Mức lương mong muốn (8-10 triệu)
- Có thể bắt đầu ngay không

**Thresholds:**
- Excellent: ≥75 điểm → Lương 10 triệu
- Good: ≥55 điểm → Lương 8 triệu (thử việc)
- Average: ≥30 điểm → Lương 7 triệu (thử việc)
- Poor: <30 điểm → Không được nhận

---

## Kết Quả Ảnh Hưởng

### Stats Changes
- **Excellent:** +30 economy, +25 happiness, +10 social
- **Good:** +15 economy, +15 happiness, +5 social
- **Average:** +5 economy, +5 happiness, +0 social
- **Poor:** -10 economy, -20 happiness, -10 social

### Flags
- `interview_result`: 'excellent', 'good', 'average', 'poor'
- `interview_score`: Điểm số đạt được
- `starting_salary`: Mức lương khởi điểm (0 nếu fail)
- `study_abroad_success`: true (nếu excellent)
- `study_abroad_struggle`: true (nếu average)
- `study_abroad_difficulty`: true (nếu poor)

### Cốt Truyện Tiếp Theo (Step 21-22)

#### Step 21: Phản hồi từ nhà tuyển dụng
- **Excellent:** Được khen ngợi, nhận offer ngay
- **Good:** Được nhận, lương ổn
- **Average:** Được thử việc, lương thấp
- **Poor:** Bị từ chối

#### Step 22: Suy nghĩ của nhân vật
- **Excellent:** Vui mừng nhưng nuối tiếc 4 năm xa nhà
- **Good:** Hài lòng, cảm thấy đáng
- **Average:** Thất vọng, hoài nghi quyết định
- **Poor:** Hối hận sâu sắc, cảm thấy lãng phí

---

## Ví Dụ Câu Hỏi

### Câu 1 (Excellent):
**Q:** "Anh/Chị có kinh nghiệm làm việc trong môi trường đa văn hóa không?"

**Options:**
- A. Có, tôi đã làm việc với nhiều quốc tịch khác nhau khi du học (+20) ✅
- B. Tôi chưa có kinh nghiệm làm việc nhưng đã học tập trong môi trường quốc tế (+15) 👍
- C. Tôi sẽ học hỏi nhanh thôi (+5) ⚠️
- D. Tôi nghĩ văn hóa không quan trọng lắm (-10) ❌

### Câu 2 (Good):
**Q:** "Anh/Chị hiểu về văn hóa làm việc tại Việt Nam không?"

**Options:**
- A. Tôi đang tìm hiểu và sẵn sàng thích nghi (+20) ✅
- B. Tôi là người Việt nên tôi hiểu (+10) 👍
- C. Tôi nghĩ nó giống ở nước ngoài (0) ❌
- D. Tôi sẽ áp dụng cách làm việc quốc tế (-10) ❌

### Câu 3 (Average):
**Q:** "Trường anh/chị học... chúng tôi chưa nghe nhiều. Anh/chị có thể giải thích?"

**Options:**
- A. Đó là trường tốt ở khu vực, tôi đã học được nhiều kỹ năng thực tế (+15) ✅
- B. Trường không nổi nhưng tôi học chăm chỉ (+10) ⚠️
- C. Đó là trường top ở nước ngoài! (-5) ❌
- D. Tôi không biết nữa... (0) ❌

---

## Chiến Thuật Chơi

### Tips:
1. **Đọc kỹ câu hỏi** - Hiểu nhà tuyển dụng muốn gì
2. **Tự tin nhưng khiêm tốn** - Không quá kiêu ngạo, không quá khiêm tốn
3. **Thực tế** - Đừng nói dối hoặc phóng đại
4. **Thích nghi** - Thể hiện sẵn sàng học hỏi văn hóa VN
5. **Quản lý thời gian** - 15 giây/câu, đừng để hết giờ

### Lưu Ý:
- Nếu hết giờ → Tự động chọn đáp án tệ nhất
- Feedback hiện ngay sau mỗi câu
- Không thể quay lại câu trước
- Điểm số tích lũy quyết định kết quả cuối

---

## Thông Điệp Game

1. **Kỹ năng phỏng vấn quan trọng** - Bằng cấp tốt nhưng phỏng vấn kém vẫn fail
2. **Thích nghi văn hóa** - Du học về phải biết thích nghi với VN
3. **Tự tin hợp lý** - Không quá kiêu ngạo, không quá tự ti
4. **Chuẩn bị kỹ** - Phỏng vấn cần chuẩn bị, không thể ứng biến
5. **Thực tế** - Thị trường việc làm VN khắt khe với du học sinh

---

## Technical Details

### Component: `ReturneeInterviewGame.jsx`
### CSS: `ReturneeInterviewGame.css`
### Handler: `handleReturneeInterviewComplete()`

### Props:
- `studyAbroadQuality`: 'excellent', 'good', 'average'
- `onComplete`: Callback function với result object

### Return Object:
```javascript
{
    score: number,
    result: 'excellent' | 'good' | 'average' | 'poor',
    salary: number,
    studyAbroadQuality: string,
    answers: number
}
```

---

## Kết Luận

Minigame này:
- ✅ Tạo tính tương tác cao
- ✅ Quyết định trực tiếp đến cốt truyện
- ✅ Phản ánh thực tế xin việc ở VN
- ✅ Có 3 phiên bản khác nhau tùy chất lượng du học
- ✅ Kết quả ảnh hưởng đến lương và hạnh phúc
- ✅ Thể hiện rõ trade-off của du học

Người chơi sẽ thấy rằng: **Du học thành công + Phỏng vấn tốt = Thành công rực rỡ**, nhưng **Du học kém + Phỏng vấn kém = Thất bại thảm hại**!
