/**
 * config.js — Hằng số cân bằng & cấu hình toàn cục.
 * Mọi con số chỉnh cân bằng nằm ở đây (xem Playtesting Checklist, Sprint 10).
 */
const deepFreeze = (o) => {
  Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(o);
};

export const CONFIG = deepFreeze({
  VERSION: '0.1.0',
  DEBUG: true,

  /** Vòng lặp game */
  TIME: {
    FIXED_STEP: 1 / 30,          // Bước mô phỏng cố định (giây) -> combat xác định, không phụ thuộc FPS
    MAX_FRAME_DELTA: 0.1,        // Chặn dt khi tab bị treo/lag (giây)
    MAX_STEPS_PER_FRAME: 12,     // Chống "xoắn ốc chết" khi máy yếu + x3
    SCALES: [0, 1, 2, 3],        // 0 = Pause
    DEFAULT_SCALE: 1,
    TICK_LOG_INTERVAL: 1,        // Log console mỗi N giây mô phỏng (chỉ khi DEBUG)
  },

  /** Lưới chiến thuật: bàn 6x3 (mỗi phe 3x3). Cột 0 = hậu tuyến nhà ... Cột 5 = hậu tuyến địch */
  GRID: {
    COLS: 6,
    ROWS: 3,
    HOME_COLS: [0, 1, 2],        // 0 hậu, 1 trung, 2 tiền
    ENEMY_COLS: [3, 4, 5],       // 3 tiền, 4 trung, 5 hậu
    DISTANCE_METRIC: 'chebyshev' // Quy ước: cận chiến range 1 gồm cả ô chéo
  },

  /** Công thức chiến đấu (GDD mục 3.2) */
  COMBAT: {
    DEF_CONSTANT: 3.5,           // DamageTaken = Raw * 1000 / (1000 + Def * 3.5)
    DEF_BASE: 1000,
    CRIT_CAP: 0.75,
    CRIT_DMG_BASE: 1.5,
    CRIT_PER_NGO_TINH: 0.005,
    CRIT_DMG_PER_KINH_LUC: 0.004,
    SPEED_PER_THAN_PHAP: 0.015,  // Interval = Base / (1 + ThanPhap * 0.015)
    ENERGY_MAX: 100,
    ENERGY_ON_HIT: 15,
    ENERGY_ON_KILL: 25,
    ENERGY_ON_DAMAGED_FACTOR: 40, // + (DamageTaken / MaxHP) * 40
    POISON_MAX_STACKS: 5,
    TARGET_BATTLE_SECONDS: [20, 45], // Nhịp độ lý tưởng của một trận
  },

  PARTY: { MAX_COMPANIONS_IN_BATTLE: 2, MAX_COMPANIONS_TOTAL: 20 },

  SAVE: { DB_NAME: 'WuxiaChroniclesDB', STORE: 'save_slots', AUTO_SLOT: 0, MANUAL_SLOTS: 5 },

  /** Bảng màu giao diện (đồng bộ với style.css) */
  COLORS: {
    ink: '#12171b', mist: '#1d252b', slate: '#2c373f', jade: '#6fb59b',
    paper: '#e7e3d6', seal: '#c2412f', gold: '#e0b84e',
    dmgPhysical: '#e0553f', dmgMagical: '#a77be0', dmgCrit: '#f2cd4f',
  },
});
