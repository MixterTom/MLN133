# 🎨 HƯỚNG DẪN TÍCH HỢP BACKGROUND

## ✅ Đã hoàn thành

### 1. Background Manager (`src/utils/backgroundManager.js`)
- ✅ Tạo constants cho tất cả background assets
- ✅ Helper functions: `getBackground()`, `getSceneBackground()`
- ✅ Mapping scenes với backgrounds tương ứng

### 2. SceneBackground Component (`src/components/Common/SceneBackground.jsx`)
- ✅ Wrapper component để apply background động
- ✅ Sử dụng CSS variables để inject background image

### 3. CSS Updates (`src/components/Screens/PrologueScreen.css`)
- ✅ Thêm transition cho background
- ✅ Support dynamic background với `data-background` attribute

### 4. PrologueScreen
- ✅ Import SceneBackground component
- ✅ Update step 3 (Birth scenes) với background phù hợp
- ✅ Update step 3.2 (Childhood scenes) với background phù hợp

---

## 🔄 CẦN LÀM TIẾP

### Chapter 1 - Cần update các scenes sau:
```jsx
// Thay vì:
<div className="prologue-screen">

// Dùng:
<SceneBackground sceneKey="chapter1_graduation">
```

**Mapping scenes:**
- `graduation` → `chapter1_graduation` (bàn-học-sáng)
- `university` → `chapter1_university` (bàn-học-chiều)
- `study` → `chapter1_study` (bàn-học-tối)
- `job_search` → `chapter1_job_search` (văn-phòng-sáng)
- `interview` → `chapter1_interview` (văn-phòng-chiều)
- `first_day` → `chapter1_first_day` (văn-phòng-sáng)

### Chapter 2 - Mapping scenes:
- `family_pressure` → `chapter2_family_pressure` (phòng-khách-chiều)
- `marriage_registration` → `chapter2_marriage_registration` (văn-phòng-sáng)
- `dating_home` → `chapter2_dating_home` (phòng-khách-tối)
- `balcony_talk` → `chapter2_balcony_talk` (ban-công-chiều)

### Chapter 3 - Mapping scenes:
- `child_birth` → `chapter3_child_birth` (bệnh-viện-sáng)
- `hospital` → `chapter3_hospital` (bệnh-viện-chiều)
- `hospital_night` → `chapter3_hospital_night` (bệnh-viện-tối)
- `parents_request` → `chapter3_parents_request` (phòng-khách-tối)
- `family_discussion` → `chapter3_family_discussion` (phòng-khách-chiều)
- `bedroom_talk` → `chapter3_bedroom_talk` (phòng-ngủ-chiều)

### Chapter 4 - Mapping scenes:
- `career_peak` → `chapter4_career_peak` (văn-phòng-sáng)
- `work_late` → `chapter4_work_late` (văn-phòng-tối)
- `home_conflict` → `chapter4_home_conflict` (phòng-khách-tối)
- `child_talk` → `chapter4_child_talk` (phòng-ngủ-chiều)

### Chapter 5 - Mapping scenes:
- `retirement` → `chapter5_retirement` (văn-phòng-chiều)
- `reflection` → `chapter5_reflection` (ban-công-chiều)
- `family_gathering` → `chapter5_family_gathering` (phòng-khách-sáng)
- `ending` → `chapter5_ending` (ban-công-chiều)

---

## 📝 PATTERN ĐỂ UPDATE

### Bước 1: Thêm import
```jsx
import SceneBackground from '../Common/SceneBackground';
```

### Bước 2: Replace div wrapper
```jsx
// TRƯỚC:
if (scenario === 'graduation') {
    return (
        <div className="prologue-screen">
            <StatsPanel />
            {/* content */}
        </div>
    );
}

// SAU:
if (scenario === 'graduation') {
    return (
        <SceneBackground sceneKey="chapter1_graduation">
            <StatsPanel />
            {/* content */}
        </SceneBackground>
    );
}
```

---

## 🎯 LƯU Ý

1. **Không thay đổi logic**: Chỉ wrap với `<SceneBackground>`
2. **sceneKey phải match**: Đối chiếu với `SCENE_BACKGROUNDS` trong `backgroundManager.js`
3. **Giữ nguyên children**: `<StatsPanel />`, `<StatChangeNotification />`, etc.
4. **CSS vẫn work**: Component vẫn có `className="prologue-screen"`

---

## ✨ KẾT QUẢ

Sau khi hoàn thành:
- ✅ Tất cả scenes có background phù hợp
- ✅ Background transition mượt mà
- ✅ Hỗ trợ thêm background mới dễ dàng
- ✅ Code clean và maintainable
