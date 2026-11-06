/**
 * Cấu hình hằng số trung tâm của game
 */
export const CONFIG = {
    VERSION: '4.1.0',
    DEBUG: false,
    // All engine times are seconds. Legacy GAME/COMBAT values below use milliseconds.
    TIME: {
        DEFAULT_SCALE: 1,
        SCALES: [0, 1, 2, 3],
        FIXED_STEP: 1 / 60,
        MAX_FRAME_DELTA: 0.1,
        MAX_STEPS_PER_FRAME: 24,
        TICK_LOG_INTERVAL: 1
    },
    GRID: { COLS: 6, ROWS: 3, HOME_COLS: [0, 1, 2] },
    VIEW: { WIDTH: 960, HEIGHT: 540 },
    COLORS: {
        mist: '#0f172a', jade: '#6fb59b', seal: '#e17a69',
        gold: '#d4af37', slate: '#475569', paper: '#e2e8f0'
    },
    GAME: {
        FPS: 60,
        MAX_DELTA_TIME: 100, // Tránh lỗi logic khi người chơi chuyển tab lâu
        VERSION: "4.1.0"
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
