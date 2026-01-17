# TÀI LIỆU MÔ TẢ DỰ ÁN GAME: TẾ BÀO XÃ HỘI (SOCIAL CELLS)

**Ngày lập:** 16/01/2026

**Chủ đề:** Mô phỏng đời người & Cân bằng giá trị sống

**Đối tượng:** Đội ngũ phát triển dự án (Dev, Design, Content)

---

## I. TẦM NHÌN DỰ ÁN

Game "Tế bào xã hội" là một trò chơi mô phỏng lựa chọn, nơi người chơi đóng vai một cá nhân (tế bào) trong cơ thể xã hội lớn. Mục tiêu không chỉ là làm giàu, mà là giữ cho "tế bào" đó khỏe mạnh và kết nối được với các tế bào khác thông qua chỉ số Đạo đức.

---

## II. HỆ THỐNG CHỈ SỐ NHÂN VẬT (CORE STATS)

Mọi lựa chọn trong game sẽ tác động trực tiếp lên 4 chỉ số sinh tồn:

- **Tài sản ($)**: Nguồn lực tài chính để duy trì cuộc sống và xử lý biến cố.
- **Hạnh phúc (♥)**: Chỉ số tinh thần, ảnh hưởng đến khả năng mở khóa các mối quan hệ (Bạn đời).
- **Sức khỏe (✚)**: "Thanh máu" của người chơi. Chạm 0 đồng nghĩa với cái chết (Game Over).
- **Đạo đức (☯)**: Uy tín cá nhân. Quyết định cách xã hội phản ứng và các đặc quyền ẩn về sau.

---

## III. CHIẾN THUẬT KHỞI ĐẦU (STARTING PATHS)

Người chơi bắt đầu với một trong hai kịch bản để tạo tính chơi lại (Replayability):

| Chỉ số | 1. Tiềm lực (Nhà giàu) | 2. Thử thách (Vượt khó) |
|--------|------------------------|-------------------------|
| **Đặc điểm** | Tài sản lớn, nhưng tinh thần và thể chất yếu. | Nghèo khó, nhưng sức trẻ và tinh thần cao. |
| **Tài sản** | 80 | 20 |
| **Hạnh phúc** | 30 | 70 |
| **Sức khỏe** | 40 | 80 |
| **Đạo đức** | 50 (Trung bình) | 50 (Trung bình) |

---

## IV. CƠ CHẾ NHÂN VẬT PHỤ & NHÁNH RẼ NỘI DUNG

Sự hiện diện của nhân vật phụ phụ thuộc vào chỉ số của người chơi. Mỗi nhân vật có một "Nhiệm vụ rẽ nhánh" buộc người chơi phải đánh đổi.

### 1. Hàng xóm (Đạo đức > 50)

**Sự kiện:** Hàng xóm mượn một số tiền lớn để chữa bệnh.

- **Lựa chọn A (Cho mượn)**: Tài sản -20, Đạo đức +20, Hạnh phúc +10. (Kết nối sâu sắc).
- **Lựa chọn B (Từ chối)**: Tài sản giữ nguyên, Đạo đức -20, Hàng xóm biến mất khỏi game.

### 2. Bạn đời (Hạnh phúc > 50)

**Sự kiện:** Bạn đời muốn từ bỏ công việc áp lực để ở nhà chăm sóc gia đình.

- **Lựa chọn A (Đồng ý)**: Tài sản -20 (mất 1 nguồn thu), Hạnh phúc +20, Sức khỏe +10 (được chăm sóc).
- **Lựa chọn B (Phản đối)**: Tài sản +20, Hạnh phúc -20, Sức khỏe -10 (căng thẳng hôn nhân).

### 3. Con cái (Sau khi có Bạn đời)

**Sự kiện:** Con muốn đi du học năng khiếu đắt đỏ.

- **Lựa chọn A (Đầu tư)**: Tài sản -40, Đạo đức +15, Hạnh phúc +10 (tự hào).
- **Lựa chọn B (Học trong nước)**: Tài sản -10, Hạnh phúc -10.

### 4. Ông bà (Mặc định có)

- **Tác động định kỳ**: Tăng $, ♥; Giảm ✚ (Do lo âu/chăm sóc).
- **Sự kiện rẽ nhánh**: Di chúc/Thừa kế.

---

## V. CÁC CỘT MỐC CUỘC ĐỜI (MAJOR DECISIONS)

### Giai đoạn 1: Học vấn

#### Cấp 3 hay Học nghề sớm?

- **Cấp 3**: -10 Tài sản, +5 Đạo đức, mở khóa Đại học.
- **Học nghề**: +10 Tài sản (đi làm sớm), -5 Hạnh phúc (áp lực lao động sớm).

#### Đại học hay Lao động phổ thông?

- **Đại học**: -30 Tài sản, +10 Hạnh phúc (trải nghiệm sinh viên), tiềm năng tăng Tài sản mạnh về sau.
- **Lao động**: +20 Tài sản ngay lập tức, -10 Sức khỏe.

### Giai đoạn 2: Sự nghiệp

#### Đi làm thêm khi đang học?

- **Có**: +10 Tài sản, -10 Sức khỏe, -5 Đạo đức (do lơ là học tập).
- **Không**: +5 Hạnh phúc, -10 Tài sản.

#### Khởi nghiệp hay Làm thuê bền vững?

- **Khởi nghiệp**: Tài sản biến động (-50 hoặc +100), Sức khỏe giảm cực mạnh (-30).
- **Làm thuê**: Tài sản tăng đều (+10), Hạnh phúc trung bình.

---

## VI. BIẾN CỐ NGẪU NHIÊN & HỆ QUẢ ĐẠO ĐỨC

### 1. Nhóm Biến cố Hệ thống & Toàn cầu

Đây là các sự kiện lớn, tác động diện rộng hoặc do hệ thống tự động kích hoạt dựa trên ngưỡng chỉ số.

- **Lạm phát/Khủng hoảng**: Tài sản -30.
- **Dịch bệnh toàn cầu**: Sức khỏe -20, Hạnh phúc -10.
- **Thừa kế bất ngờ**: Tài sản +40.
- **Cơ chế "Nút thắt" (Tài sản >90)**: Tăng tỉ lệ gặp "Trộm cắp" hoặc "Thuế cao".
- **Cơ chế "Cứu rỗi" (Sức khỏe <20)**: Nhận sự kiện "Chăm sóc đặc biệt" giúp hồi phục chỉ số.

### 2. Nhóm Biến cố Đạo đức (Karma Events)

Các tình huống thử thách nhân cách và tích lũy điểm Karma.

#### Nhặt được ví tiền:

- **Trả lại**: Đạo đức +15, Hạnh phúc +5, Tài sản -5.
- **Giữ lấy**: Tài sản +20, Đạo đức -20.

#### Chứng kiến gian lận:

- **Tố cáo**: Đạo đức +20, Tài sản -10, Hạnh phúc -5.
- **Lờ đi**: Tài sản +10, Đạo đức -15.

#### Lời mời "Làm sạch" hồ sơ:

- **Đồng ý**: Tài sản +50, Đạo đức -40, Hạnh phúc -10.
- **Từ chối**: Đạo đức +10, Tài sản -10.

#### Bị đồng nghiệp tung Tin đồn thất thiệt:

- Đạo đức -15, Hạnh phúc -10.

### 3. Nhóm Biến cố Kinh tế & Sự nghiệp

Tập trung vào dòng tiền, rủi ro đầu tư và công việc.

#### Sốt đất ảo (Đầu tư):

- 50% cơ hội Tài sản +40 và 50% cơ hội Tài sản -40.

#### Khủng hoảng nhân sự (Cắt giảm biên chế):

- **Làm thêm giờ giữ chỗ**: Sức khỏe -20, Tài sản -5, Hạnh phúc -10.
- **Chấp nhận nghỉ việc**: Tài sản -20, Hạnh phúc +10.

#### Sáng kiến đột phá:

- Đề xuất lên sếp nhận Tài sản +20, Hạnh phúc +10, Sức khỏe -5.

### 4. Nhóm Biến cố Đời sống & Sức khỏe

Các tương tác xã hội và tình trạng thể chất của nhân vật.

#### Hàng xóm gây ồn:

- **Góp ý nhẹ nhàng**: Đạo đức +5, Hạnh phúc -5.
- **Cãi vã/Gọi cảnh sát**: Hạnh phúc -15, Đạo đức -5, Sức khỏe -5.

#### Bạn cũ vay tiền:

- **Cho mượn**: Tài sản -20, Đạo đức +10, Hạnh phúc +5.
- **Từ chối**: Hạnh phúc -10.

#### Ngày lễ gia đình (Mừng thọ):

- **Tổ chức hoành tráng**: Tài sản -30, Hạnh phúc +20, Đạo đức +10.
- **Lấy lý do bận việc**: Tài sản +5, Hạnh phúc -20, Đạo đức -10.

#### Vấn đề thể chất:

**Mất ngủ:**
- **Đi khám**: Tài sản -10, Sức khỏe +10.
- **Chịu đựng**: Sức khỏe -15, Hạnh phúc -10.

**Phong trào chạy bộ:**
- Sức khỏe +15, Hạnh phúc +10, Tài sản -5, Đạo đức +5.

**Ngộ độc thực phẩm:**
- Sức khỏe -20, Tài sản -10 (giảm trừ thiệt hại nếu có Bạn đời).

---

## VII. HỆ THỐNG KẾT THÚC (END GAME)

### Nhóm kết thúc "Tiềm lực" (Dành cho lựa chọn 1)

- **"Người kế vị cô độc"**: Tài sản > 90 nhưng Hạnh phúc < 20. Bạn có tất cả nhưng không có ai bên cạnh.
- **"Phá gia chi tử"**: Tài sản < 10. Bạn tiêu tán gia sản và kết thúc trong nghèo khó.
- **"Nhà từ thiện đại tài"**: Tài sản > 70 và Đạo đức > 80. Bạn dùng tiền của gia đình để thay đổi thế giới.

### Nhóm kết thúc "Thử thách" (Dành cho lựa chọn 2)

- **"Tỉ phú tự thân"**: Tài sản > 80. Từ hai bàn tay trắng, bạn đã xây dựng cơ đồ.
- **"Hạnh phúc giản đơn"**: Tài sản trung bình, Hạnh phúc > 80. Bạn không giàu nhưng gia đình luôn tràn ngập tiếng cười.
- **"Sự sụp đổ"**: Sức khỏe < 10. Bạn làm việc quá sức để đổi đời và ra đi khi chưa kịp hưởng thụ.

### Kết thúc đặc biệt (True Ending)

- **"Bậc thầy cân bằng"**: Tất cả chỉ số đều > 60. Bạn đã tìm thấy ý nghĩa thực sự của cuộc sống xã hội.