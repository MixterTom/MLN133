// Background Manager - Quản lý background cho từng scene

export const BACKGROUNDS = {
    // HOSPITAL ROOM (Phòng bệnh - Mới)
    HOSPITAL_ROOM: '/src/assets/background/phong-benh-sang.png',

    // MEMORY (Hồi ức - Mới)
    MEMORY: '/src/assets/background/hoi-uc.png',

    // GRADUATION (Lễ tốt nghiệp - Mới)
    GRADUATION: '/src/assets/background/le-tot-nghiep.png',

    // DINING ROOM (Phòng ăn - Mới)
    DINING_ROOM_EVENING: '/src/assets/background/phong-an-toi.png',

    // Bệnh viện
    HOSPITAL_MORNING: '/src/assets/background/bệnh-viện-sáng.png',
    HOSPITAL_AFTERNOON: '/src/assets/background/bệnh-viện-chiều.png',
    HOSPITAL_EVENING: '/src/assets/background/bệnh-viện-tối.png',

    // Phòng khách
    LIVING_ROOM_MORNING: '/src/assets/background/phòng-khách-sáng.png',
    LIVING_ROOM_AFTERNOON: '/src/assets/background/phòng-khách-chiều.png',
    LIVING_ROOM_EVENING: '/src/assets/background/phòng-khách-tối.png',

    // Phòng ngủ
    BEDROOM_MORNING: '/src/assets/background/phòng-ngủ-sáng.png',
    BEDROOM_AFTERNOON: '/src/assets/background/phòng-ngủ-chiều.png',
    BEDROOM_EVENING: '/src/assets/background/phong-ngu-toi.png',

    // Văn phòng
    OFFICE_MORNING: '/src/assets/background/văn-phòng-sáng.png',
    OFFICE_AFTERNOON: '/src/assets/background/văn-phòng-chiều.png',
    OFFICE_EVENING: '/src/assets/background/văn-phòng-tối.png',

    // Bàn học
    STUDY_MORNING: '/src/assets/background/bàn-học-sáng.png',
    STUDY_AFTERNOON: '/src/assets/background/bàn-học-chiều.png',
    STUDY_EVENING: '/src/assets/background/bàn-học-tối.png',

    // Ban công
    BALCONY_MORNING: '/src/assets/background/ban-công-sáng.png',
    BALCONY_AFTERNOON: '/src/assets/background/ban-công-chiều.png',
    // BALCONY_EVENING: '/src/assets/background/ban-công-tối.png', // File not verified in list, using existing ones

    // Cafe (Mới)
    CAFE_MORNING: '/src/assets/background/cafe-sáng.png',
    CAFE_AFTERNOON: '/src/assets/background/cafe-chiều.png',
    CAFE_EVENING: '/src/assets/background/cafe-tối.png',

    // Nhà hàng (Mới)
    RESTAURANT_MORNING: '/src/assets/background/nhà-hàng-sáng.png',
    RESTAURANT_AFTERNOON: '/src/assets/background/nhà-hàng-chiều.png',
    RESTAURANT_EVENING: '/src/assets/background/nhà-hàng-tối.png',

    // Kí túc xá (Mới)
    DORM_MORNING: '/src/assets/background/ktx_room_v2.png',
    DORM_AFTERNOON: '/src/assets/background/kí-túc-xá-chiều.png',
    DORM_EVENING: '/src/assets/background/kí-túc-xá-tối.png',

    // Phòng họp (Mới)
    MEETING_MORNING: '/src/assets/background/phòng-họp-sáng.png',
    MEETING_AFTERNOON: '/src/assets/background/phòng-họp-chiều.png',
    MEETING_EVENING: '/src/assets/background/phòng-họp-tối.png',

    // Rạp phim (Mới)
    CINEMA_MORNING: '/src/assets/background/rạp-phim-sáng.png',
    CINEMA_AFTERNOON: '/src/assets/background/raph-phim-chiều.png', // Note: typo in filename 'raph'
    CINEMA_EVENING: '/src/assets/background/rạp-phim-tối.png',

    // Đám cưới (Mới)
    WEDDING_MORNING: '/src/assets/background/đám-cưới-sáng.png',
    WEDDING_AFTERNOON: '/src/assets/background/đám-cưới-chiều.png',
    WEDDING_EVENING: '/src/assets/background/đám-cưới-tói.png', // Note: typo in filename 'tói'

    // Giấc mơ (Mới)
    DREAM: '/src/assets/background/khong-gian-huyen-ao.png', // Note: typo in filename 'huyèn'

    // Giảng đường (Mới)
    LECTURE_HALL_MORNING: '/src/assets/background/giang-duong-sang.png',

    // === STUDY ABROAD BACKGROUNDS ===
    // Sân bay
    AIRPORT: '/src/assets/background/sân-bay.png',
    // Máy bay
    AIRPLANE: '/src/assets/background/khoang-máy-bay.png',
    // Trường ĐH nước ngoài
    FOREIGN_UNIVERSITY: '/src/assets/background/trường-nước-ngoài.png',
    // KTX nước ngoài
    FOREIGN_DORM: '/src/assets/background/kí-túc-xá-nước-ngoài.png',
};

// Helper function để lấy background theo location và time
export const getBackground = (location, timeOfDay = 'morning') => {
    const key = `${location.toUpperCase()}_${timeOfDay.toUpperCase()}`;
    return BACKGROUNDS[key] || BACKGROUNDS.LIVING_ROOM_MORNING;
};

// Scene-specific backgrounds
export const SCENE_BACKGROUNDS = {
    // PROLOGUE
    'prologue_birth_rich': BACKGROUNDS.HOSPITAL_ROOM,
    'prologue_birth_normal': BACKGROUNDS.HOSPITAL_ROOM,
    'prologue_birth_poor': BACKGROUNDS.LIVING_ROOM_EVENING,
    'prologue_childhood_rich': BACKGROUNDS.LIVING_ROOM_MORNING,
    'prologue_childhood_normal': BACKGROUNDS.LIVING_ROOM_AFTERNOON,
    'prologue_childhood_poor': BACKGROUNDS.LIVING_ROOM_EVENING,

    // CHAPTER 1 (18-25 tuổi)
    'chapter1_memory': BACKGROUNDS.MEMORY, // Hồi ức
    'chapter1_night_before_grad': BACKGROUNDS.BEDROOM_EVENING, // Đêm trước tốt nghiệp
    'chapter1_wakeup': BACKGROUNDS.BEDROOM_MORNING, // Sáng hôm sau dậy
    'chapter1_graduation': BACKGROUNDS.GRADUATION, // Tốt nghiệp ở trường
    'chapter1_dinner': BACKGROUNDS.DINING_ROOM_EVENING, // Bữa tối gia đình
    'chapter1_decision_night': BACKGROUNDS.BEDROOM_EVENING, // Đêm suy nghĩ
    'chapter1_university': BACKGROUNDS.DORM_MORNING, // Đổi sang Kí túc xá/Trường học
    'chapter1_study': BACKGROUNDS.DORM_EVENING, // Đổi sang Kí túc xá evening
    'chapter1_lecture': BACKGROUNDS.LECTURE_HALL_MORNING, // Giảng đường
    'chapter1_cafe': BACKGROUNDS.CAFE_AFTERNOON, // Quán cà phê làm thêm
    'chapter1_job_search': BACKGROUNDS.CAFE_MORNING, // Tìm việc ở Cafe
    'chapter1_interview': BACKGROUNDS.MEETING_AFTERNOON, // Phỏng vấn phòng họp
    'chapter1_first_day': BACKGROUNDS.OFFICE_MORNING,
    'chapter1_dating': BACKGROUNDS.CAFE_EVENING, // Hẹn hò ở Cafe
    'chapter1_cinema': BACKGROUNDS.CINEMA_EVENING, // Xem phim hẹn hò
    'chapter1_office': BACKGROUNDS.OFFICE_MORNING, // Văn phòng làm việc

    // STUDY ABROAD PATH (cần tạo ảnh mới)
    'chapter1_airport': BACKGROUNDS.AIRPORT, // Sân bay - CẦN TẠO
    'chapter1_airplane': BACKGROUNDS.AIRPLANE, // Máy bay - CẦN TẠO
    'chapter1_foreign_university': BACKGROUNDS.FOREIGN_UNIVERSITY, // ĐH nước ngoài - CẦN TẠO
    'chapter1_foreign_dorm': BACKGROUNDS.FOREIGN_DORM, // KTX nước ngoài - CẦN TẠO

    // CHAPTER 2 (25-35 tuổi - Lập gia đình)
    'chapter2_family_pressure': BACKGROUNDS.LIVING_ROOM_EVENING,
    'chapter2_meet_candidates': BACKGROUNDS.CAFE_AFTERNOON, // Xem mắt ở Cafe
    'chapter2_dating': BACKGROUNDS.CINEMA_EVENING, // Hẹn hò rạp phim
    'chapter2_marriage_decision': BACKGROUNDS.RESTAURANT_EVENING, // Cầu hôn ở nhà hàng
    'chapter2_marriage_registration': BACKGROUNDS.WEDDING_MORNING, // Đám cưới
    'chapter2_dating_home': BACKGROUNDS.LIVING_ROOM_EVENING,
    'chapter2_balcony_talk': BACKGROUNDS.BALCONY_AFTERNOON,
    'chapter2_evening_date': BACKGROUNDS.RESTAURANT_EVENING,

    // CHAPTER 3 (35-45 tuổi - Nuôi con)
    'chapter3_child_birth': BACKGROUNDS.HOSPITAL_MORNING,
    'chapter3_hospital': BACKGROUNDS.HOSPITAL_AFTERNOON,
    'chapter3_hospital_night': BACKGROUNDS.HOSPITAL_EVENING,
    'chapter3_parents_request': BACKGROUNDS.LIVING_ROOM_EVENING,
    'chapter3_family_discussion': BACKGROUNDS.LIVING_ROOM_AFTERNOON,
    'chapter3_bedroom_talk': BACKGROUNDS.BEDROOM_EVENING,

    // CHAPTER 4 (45-55 tuổi - Trung niên)
    'chapter4_career_peak': BACKGROUNDS.MEETING_MORNING, // Họp hành nhiều
    'chapter4_work_late': BACKGROUNDS.OFFICE_EVENING,
    'chapter4_home_conflict': BACKGROUNDS.LIVING_ROOM_EVENING,
    'chapter4_child_talk': BACKGROUNDS.BEDROOM_AFTERNOON,

    // CHAPTER 5 (55-60 tuổi - Tuổi già)
    'chapter5_retirement': BACKGROUNDS.MEETING_AFTERNOON, // Tiệc chia tay ở phòng họp
    'chapter5_reflection': BACKGROUNDS.BALCONY_AFTERNOON,
    'chapter5_family_gathering': BACKGROUNDS.LIVING_ROOM_MORNING,
    'chapter5_ending': BACKGROUNDS.DREAM, // Kết thúc trong không gian huyền ảo

    // DREAM SCENES
    'dream': BACKGROUNDS.DREAM,
};

// Get background by scene key
export const getSceneBackground = (sceneKey) => {
    return SCENE_BACKGROUNDS[sceneKey] || BACKGROUNDS.LIVING_ROOM_MORNING;
};
