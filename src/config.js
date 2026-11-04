/**
 * Cấu hình hằng số trung tâm của game
 */
export const CONFIG = {
    GAME: {
        FPS: 60,
        MAX_DELTA_TIME: 100, // Tránh lỗi logic khi người chơi chuyển tab lâu
        VERSION: "1.0.0"
    },
    COMBAT: {
        GRID_COLS: 6, // 3 Cột phe ta, 3 cột phe địch
        GRID_ROWS: 3, // Tiền - Trung - Hậu tuyến
        BASE_ATTACK_INTERVAL: 2000, // 2 giây (Chưa tính thân pháp)
        MAX_ENERGY: 100, // Thanh nộ tối đa
        ENERGY_PER_HIT: 15, // Đánh trúng +15 Nộ
        ENERGY_ON_KILL: 25  // Kết liễu +25 Nộ
    },
    MATH: {
        BASE_CRIT_DMG: 1.5,
        ARMOR_CONSTANT: 3.5 // Hệ số chia giảm thương (càng cao thủ càng trâu)
    }
};
