# Chapter 2 - Kế Hoạch Triển Khai

## ✅ ĐÃ HOÀN THÀNH

### 1. Thiết kế Flow mới
- File: `CHAPTER2_NEW_FLOW.md`
- Flow: Tốt nghiệp → Chọn nơi làm → Đi làm → Gặp người yêu → Cưới

### 2. Minigame: Job Interview
- File: `src/components/MiniGames/JobInterviewGame.jsx`
- File: `src/components/MiniGames/JobInterviewGame.css`
- Tính năng: 5 câu hỏi phỏng vấn, 20s/câu, kết quả → vị trí + lương

## 🔄 ĐANG LÀM

### 3. Cập nhật Chapter2Screen.jsx
Cần thay đổi flow hiện tại:

**Flow CŨ:**
```
Transition (7 năm sau) → Dating → Marriage → Buy House → Chapter End
```

**Flow MỚI:**
```
Graduation (22 tuổi) 
→ Parents Call (chọn nơi làm)
→ City Job / Hometown Job / Startup (22-25 tuổi)
→ Dating (25 tuổi)
→ Marriage Decision (27 tuổi)
→ Wedding / Reject Marriage
→ Chapter End
```

## 📋 CẦN LÀM TIẾP

### 4. Tạo các Minigame còn lại

#### A. Work Pressure Game
**File**: `src/components/MiniGames/WorkPressureGame.jsx`

**Mô tả**: Quản lý công việc, deadline, stress
- 5 tasks với deadline khác nhau
- Mỗi ngày chọn: Làm việc / Nghỉ ngơi / Giao lưu
- Stress bar, Health bar, Progress bar
- Kết quả: Thăng chức / Giữ nguyên / Sa thải

**Cơ chế**:
```javascript
const TASKS = [
    { name: 'Báo cáo tháng', deadline: 5, workload: 3 },
    { name: 'Dự án A', deadline: 10, workload: 5 },
    { name: 'Meeting khách hàng', deadline: 3, workload: 2 },
    { name: 'Training nhân viên mới', deadline: 7, workload: 3 },
    { name: 'Đánh giá hiệu suất', deadline: 12, workload: 4 }
];

// Mỗi ngày (12 ngày total):
- Chọn action: Work (stress +20, progress +1), Rest (stress -30), Socialize (stress -10, social +1)
- Deadline giảm mỗi ngày
- Nếu deadline = 0 mà task chưa xong → Mất điểm
```

#### B. Community Service Game
**File**: `src/components/MiniGames/CommunityServiceGame.jsx`

**Mô tả**: Giúp đỡ cộng đồng địa phương
- 5 tình huống cần giúp đỡ
- Chọn cách giúp phù hợp với ngân sách/thời gian
- Kết quả: Uy tín trong làng

**Tình huống**:
1. Ông già bị ốm cần đưa đi bệnh viện
2. Trẻ em nghèo cần sách vở
3. Đường làng hư cần sửa
4. Tổ chức lễ hội làng
5. Giúp nông dân bán nông sản

#### C. Business Plan Game
**File**: `src/components/MiniGames/BusinessPlanGame.jsx`

**Mô tả**: Quản lý startup
- 3 vòng (6 tháng/vòng)
- Mỗi vòng phân bổ ngân sách: Marketing, Product, HR
- Random events mỗi vòng
- Doanh thu phải > Chi phí

**Cơ chế**:
```javascript
const INITIAL_BUDGET = 200; // triệu
const EVENTS = [
    { type: 'customer', desc: 'Khách hàng lớn quan tâm', effect: { revenue: +50 } },
    { type: 'competitor', desc: 'Đối thủ giảm giá', effect: { revenue: -30 } },
    { type: 'crisis', desc: 'Nhân viên nghỉ việc', effect: { cost: +20 } }
];

// Mỗi vòng:
- Phân bổ: Marketing (30-50%), Product (20-40%), HR (20-30%)
- Random 1 event
- Tính revenue = Marketing * 2 + Product * 1.5
- Tính cost = HR * 3 + Product * 2
- Profit = Revenue - Cost
```

### 5. Viết Scenarios mới trong Chapter2Screen.jsx

#### Scenario: GRADUATION
```javascript
if (scenario === 'graduation') {
    if (step === 0) {
        // Lễ tốt nghiệp
        // Bố mẹ chúc mừng
        // Nhận bằng
    }
    if (step === 1) {
        // Bà Tiên xuất hiện
        // Nói về giai đoạn mới
        → setScenario('parents_call')
    }
}
```

#### Scenario: PARENTS_CALL
```javascript
if (scenario === 'parents_call') {
    // Bố mẹ hỏi về quê hay ở lại
    // Bà Tiên xuất hiện
    // CHOICE: City / Hometown / Startup
}
```

#### Scenario: CITY_JOB
```javascript
if (scenario === 'city_job') {
    if (step === 0) {
        // Phỏng vấn → JobInterviewGame
    }
    if (step === 1) {
        // Kết quả phỏng vấn
        // Ngày đầu đi làm
    }
    if (step === 2) {
        // 6 tháng sau → WorkPressureGame
    }
    if (step === 3) {
        // Kết quả công việc
        // CHOICE: Làm thêm giờ / Cân bằng / Chuyển công ty
    }
    if (step === 4) {
        // 3 năm sau → Gặp người yêu
        → setScenario('dating')
    }
}
```

#### Scenario: HOMETOWN_JOB
```javascript
if (scenario === 'hometown_job') {
    if (step === 0) {
        // Xin việc qua quen biết
        // Được nhận dễ dàng
    }
    if (step === 1) {
        // Ngày đầu đi làm
        // Môi trường thân thiện
    }
    if (step === 2) {
        // 1 năm sau → CommunityServiceGame
    }
    if (step === 3) {
        // Kết quả
        // Áp lực kết hôn từ hàng xóm
    }
    if (step === 4) {
        // 3 năm sau → Gặp người yêu
        → setScenario('dating')
    }
}
```

#### Scenario: STARTUP
```javascript
if (scenario === 'startup') {
    if (step === 0) {
        // Quyết định khởi nghiệp
        // Vay tiền
    }
    if (step === 1) {
        // BusinessPlanGame
    }
    if (step === 2) {
        // Kết quả: Thành công / Thất bại / Tạm ổn
        // Nếu thất bại → Quay lại City/Hometown Job
        // Nếu thành công → Dating
    }
}
```

### 6. Cập nhật Dating Scenario
- Giữ nguyên logic cũ
- Thêm context dựa trên job_type (city/hometown/startup)
- Ví dụ: Nếu city → Gặp đồng nghiệp, Nếu hometown → Gặp người trong làng

### 7. Cập nhật Marriage Decision
- Đã sửa: 2 lựa chọn rõ ràng (Cưới / Từ chối)
- Nếu từ chối → parents_pressure (đã có)
- Nếu cưới → wedding_planning → marriage_registration → buy_house

## 📊 THỐNG KÊ CÔNG VIỆC

### Minigames
- ✅ JobInterviewGame (Đã xong)
- ⏳ WorkPressureGame (Cần làm)
- ⏳ CommunityServiceGame (Cần làm)
- ⏳ BusinessPlanGame (Cần làm)

### Scenarios
- ⏳ graduation (Cần viết)
- ⏳ parents_call (Cần viết)
- ⏳ city_job (Cần viết)
- ⏳ hometown_job (Cần viết)
- ⏳ startup (Cần viết)
- ✅ dating (Đã có, cần update nhẹ)
- ✅ marriage_decision (Đã sửa)
- ✅ parents_pressure (Đã có)
- ✅ wedding_planning (Đã có)
- ✅ marriage_registration (Đã có)
- ✅ buy_house (Đã có)

### Tổng công việc
- Đã xong: 20%
- Còn lại: 80%
- Ước tính thời gian: 3-4 giờ làm việc

## 🎯 ƯU TIÊN

1. **Cao**: Viết scenarios graduation, parents_call, city_job
2. **Trung bình**: Tạo WorkPressureGame
3. **Thấp**: Tạo CommunityServiceGame, BusinessPlanGame (có thể làm sau)

## 💡 GỢI Ý

- Có thể bỏ qua Startup path trong version đầu (quá phức tạp)
- Tập trung vào City Job và Hometown Job trước
- Minigame có thể đơn giản hóa nếu cần
