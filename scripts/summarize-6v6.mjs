import { readFileSync, writeFileSync } from 'node:fs';
import { seededRandom } from '../src/combat/CombatMath.js';
const input = process.argv[2] ?? 'reports/balance-6v6.json';
const output = process.argv[3] ?? 'reports/BALANCE_6V6.md';
const report = JSON.parse(readFileSync(input, 'utf8'));
const pct = n => `${(n * 100).toFixed(1)}%`;
const rows = [], extremes = [];
for (const [index, s] of report.scenarios.entries()) {
  const scores = s.records.map(r => r.games.reduce((n, g) => n + (g.winner === 'home' ? 1 : !g.winner ? .5 : 0), 0) / 2);
  const random = seededRandom(report.seed + index + 809), bootstrap = [];
  for (let i = 0; i < 2000; i++) {
    let sum = 0;
    for (let j = 0; j < scores.length; j++) sum += scores[Math.floor(random() * scores.length)];
    bootstrap.push(sum / scores.length);
  }
  bootstrap.sort((a, b) => a - b);
  const sideScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  rows.push(`| ${s.id} | ${s.matches} | ${pct(s.draws / s.matches)} | ${s.meanDuration} | ${s.p50.toFixed(1)} / ${s.p90.toFixed(1)} | ${pct(sideScore)} [${pct(bootstrap[50])}, ${pct(bootstrap[1950])}] |`);
  const list = Object.entries(s.units).filter(([, u]) => u.appearances >= 10).sort((a, b) => a[1].score - b[1].score);
  const label = ([, u]) => `${u.name}: ${pct(u.score)} (${u.appearances} lần có mặt)`;
  extremes.push(`- **${s.id}:** thấp ${list.slice(0, 2).map(label).join('; ')}. Cao ${list.slice(-2).reverse().map(label).join('; ')}.`);
}
const totalDraws = report.scenarios.reduce((n, s) => n + s.draws, 0);
writeFileSync(output, `# Đo 6v6 — bản đo đầu tiên\n\nSeed **${report.seed}**, **${report.matches} trận**; mỗi nhóm ${report.scenarios[0].pairs} cặp đối thủ, mỗi cặp đánh hai lượt đổi bên với cùng seed. Tổng **${totalDraws} trận hòa (${pct(totalDraws / report.matches)})**. Không thay chỉ số combat trong đợt này.\n\n## Phương pháp\n\nMỗi bên đúng một main và năm đồng hành khác nhau trong 50 người. Lấy mẫu môn phái và ba build attack/defense/mixed; phân bổ điểm thuộc tính hợp lệ, học cây kỹ năng theo giới hạn điểm và cấp. Đội hình sáu ô có hoán vị ngẫu nhiên, giữ cách xếp của mỗi đội khi đổi bên. Tuyệt kỹ tự động và mục tiêu gần nhất.\n\n- level1/8/20: không trang bị, không tu luyện/rèn/món ăn; khí công Điều tức.\n- level8-equipped: main mang ba món cùng bộ môn phái, đồng hành không có trang bị riêng.\n- level20-prepared: như trên, thêm tu luyện/rèn bậc 10, đan và Long mạch cho cả hai đội; dùng chính hàm chuẩn bị trận của Campaign.\n- level20-sect2/4/6: cùng mức chuẩn bị; main cùng chính xác 1/3/5 đồng hành đồng phái. Các phái khác trong đội vẫn có thể có cộng hưởng riêng. **Hai bên cùng mức mốc phái**; không phải thử nghiệm lợi ích nhân quả 6 phái so với 4 phái.\n\n## Kết quả\n\n| Nhóm | Trận | Hòa | Trung bình (giây) | P50 / P90 (giây) | Điểm phe nhà [CI 95% theo cặp] |\n| --- | ---: | ---: | ---: | ---: | --- |\n${rows.join('\n')}\n\nĐiểm = thắng 1, hòa 0,5, thua 0. Khoảng tin cậy điểm phe nhà dùng bootstrap 2.000 lần trên **cả cặp đổi bên**, không coi hai lượt trong cặp là độc lập. Seed bootstrap cố định. Đây là khoảng ước lượng theo bộ lấy mẫu này, không chứng minh không có thiên lệch ở mọi đội hình.\n\n## Các tín hiệu cần theo dõi\n\nNhóm sáu người cùng phái hòa ${pct(report.scenarios.find(s => s.id === 'level20-sect6').draws / report.scenarios.find(s => s.id === 'level20-sect6').matches)}; cần xem lại các seed hết 120 giây để phân biệt thiếu sát thương, chống chịu/hồi phục, kẹt đường và matchup. Không tự giảm sức mạnh tướng chỉ từ bảng này.\n\nCác điểm có mặt cao/thấp sau đây chỉ dùng chọn matchup để đo tiếp, **không phải tier list**; đồng đội, đối thủ và lượt đổi bên có tương quan, cỡ mẫu mỗi tướng còn nhỏ:\n\n${extremes.join('\n')}\n\n## Tái lập và giới hạn\n\nChạy \`npm run balance:6v6 -- 150 reports/balance-6v6.json\`, rồi \`node scripts/summarize-6v6.mjs\`. Chạy nhanh bằng số cặp nhỏ hơn; số trận = số cặp × 2 × 8. Bốn worker chỉ chia việc tính, kết quả không phụ thuộc thứ tự worker hoàn tất. JSON giữ seed, hai đội, vị trí, build, kết quả từng lượt và thống kê tổng hợp.\n\nChưa bao phủ mọi khí công, mục tiêu ưu tiên, điều khiển tuyệt kỹ thủ công, món ăn, cách phân điểm hoặc đội tối ưu. Không kiểm tra tốc độ cày bạc, chi phí nâng cấp hay khả năng qua chiến dịch bằng mọi phái. Mức điểm có mặt không tách được sức mạnh riêng khỏi đồng đội; chưa dùng nó để chỉnh cân bằng.\n`);
console.log(output);
