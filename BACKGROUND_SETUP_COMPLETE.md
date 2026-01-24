# ✅ BACKGROUND SYSTEM SETUP - HOÀN THÀNH

## 🎉 Đã hoàn thành

### 1. **Background Manager System**
📁 `src/utils/backgroundManager.js`
- ✅ Đã tạo constants cho 17 background images
- ✅ Helper functions để get background theo location và time
- ✅ Scene mapping cho tất cả chapters

### 2. **SceneBackground Component**
📁 `src/components/Common/SceneBackground.jsx`
- ✅ Reusable wrapper component
- ✅ Tự động apply background theo sceneKey
- ✅ Hỗ trợ CSS transition

### 3. **CSS Enhancements**
📁 `src/components/Screens/PrologueScreen.css`
- ✅ Thêm transition cho background (0.5s ease-in-out)
- ✅ Support dynamic background với CSS variables
- ✅ Data attribute `data-background="true"`

### 4. **Components Updated**
✅ **PrologueScreen.jsx**
  - Import SceneBackground
  - Updated birth scenes (rich/normal/poor)
  - Updated childhood scenes (3 origins)

✅ **Chapter1Screen.jsx**
  - Import SceneBackground added
  - Ready để apply cho: graduation, university, study, job_search, interview

✅ **Chapter2Screen.jsx**
  - Import SceneBackground added
  - Sample implementation cho family_pressure
  - Ready cho: dating_home, marriage_registration, balcony_talk

✅ **Chapter3Screen.jsx**
  - Import SceneBackground added
  - Ready cho: child_birth, hospital scenes, parents_request, bedroom_talk

✅ **Chapter4Screen.jsx**
  - Import SceneBackground added
  - Ready cho: career_peak, work_late, home_conflict, child_talk

✅ **Chapter5Screen.jsx**
  - Import SceneBackground added
  - Ready cho: retirement, reflection, family_gathering, ending

---

## 📋 CẦN LÀM TIẾP (Apply Pattern)

Tất cả các chapter đã có import, chỉ cần **replace wrapper** cho từng scene:

### Pattern đơn giản:

```jsx
// TRƯỚC:
<div className="prologue-screen">
    <StatsPanel />
    {/* content */}
</div>

// SAU:
<SceneBackground sceneKey="chapter_X_scenario_name">
    <StatsPanel />
    {/* content */}
</SceneBackground>
```

### Quick Reference - Scene Keys:

#### Chapter 1
- `chapter1_graduation` - Bàn học sáng
- `chapter1_university` - Bàn học chiều
- `chapter1_study` - Bàn học tối
- `chapter1_job_search` - Văn phòng sáng
- `chapter1_interview` - Văn phòng chiều
- `chapter1_first_day` - Văn phòng sáng

#### Chapter 2
- `chapter2_family_pressure` - Phòng khách chiều ✅ (DONE)
- `chapter2_marriage_registration` - Văn phòng sáng
- `chapter2_dating_home` - Phòng khách tối
- `chapter2_balcony_talk` - Ban công chiều

#### Chapter 3
- `chapter3_child_birth` - Bệnh viện sáng
- `chapter3_hospital` - Bệnh viện chiều
- `chapter3_hospital_night` - Bệnh viện tối
- `chapter3_parents_request` - Phòng khách tối
- `chapter3_family_discussion` - Phòng khách chiều
- `chapter3_bedroom_talk` - Phòng ngủ chiều

#### Chapter 4
- `chapter4_career_peak` - Văn phòng sáng
- `chapter4_work_late` - Văn phòng tối
- `chapter4_home_conflict` - Phòng khách tối
- `chapter4_child_talk` - Phòng ngủ chiều

#### Chapter 5
- `chapter5_retirement` - Văn phòng chiều
- `chapter5_reflection` - Ban công chiều
- `chapter5_family_gathering` - Phòng khách sáng
- `chapter5_ending` - Ban công chiều

---

## 🔍 Cách tìm và thay thế nhanh

### Option 1: Manual (Recommended cho understanding)
1. Mở file Chapter_X_Screen.jsx
2. Tìm `scenario === 'scenario_name'`
3. Tìm `<div className="prologue-screen">` trong block đó
4. Replace với `<SceneBackground sceneKey="chapter_X_scenario_name">`
5. Đóng tag: `</SceneBackground>`

### Option 2: Find & Replace trong VSCode
1. Ctrl+H (Find & Replace)
2. Enable regex mode (Alt+R)
3. Find: `<div className="prologue-screen">`
4. Replace manually với appropriate sceneKey

---

## 🎨 Background Assets Mapping

### Có sẵn (17 files):
✅ Bệnh viện (3): sáng, chiều, tối
✅ Phòng khách (3): sáng, chiều, tối
✅ Phòng ngủ (3): sáng, chiều, tối
✅ Văn phòng (3): sáng, chiều, tối
✅ Bàn học (3): sáng, chiều, tối
✅ Ban công (2): sáng, chiều

### Thiếu (nên thêm sau):
❌ Ban công - tối
❌ Quán cà phê (cho dating scenes)
❌ Nhà hàng (cho dinner scenes)
❌ Nhà tranh/quê nghèo (cho poor origin)
❌ Trường học/Đại học

---

## ✨ Lợi ích đã đạt được

1. **Centralized Management**: Tất cả backgrounds ở một nơi
2. **Easy to Update**: Chỉ cần sửa `backgroundManager.js`
3. **Type Safety**: Scene keys rõ ràng, dễ debug
4. **Smooth Transitions**: CSS transitions tự động
5. **Scalable**: Thêm background mới rất dễ
6. **Clean Code**: Component pattern rõ ràng

---

## 🚀 Next Steps

### Priority 1: Apply Pattern (1-2 hours)
Áp dụng `<SceneBackground>` cho tất cả scenes trong 5 chapters

### Priority 2: Testing
- Chạy game qua tất cả paths
- Check background transitions
- Verify đúng background cho đúng scene

### Priority 3: Missing Assets
- Tạo/tìm background cho ban-công-tối
- Thêm cafe, restaurant backgrounds cho dating scenes

---

## 📝 Notes

- **Không cần sửa logic**: Chỉ wrap UI với SceneBackground
- **CSS vẫn hoạt động**: Component vẫn apply `.prologue-screen` class
- **Performance**: No performance impact, chỉ là wrapper
- **Backward compatible**: Có thể revert dễ dàng nếu cần

---

**Status**: ✅ **CORE SYSTEM COMPLETED**
**Progress**: 🔧 **READY FOR PATTERN APPLICATION**
**Next**: 👉 **Apply `<SceneBackground>` to all scenes**
