import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {actionKey} from '../src/ui/ActionIcons.js';
import {ICON_NAMES} from '../src/ui/Visuals.js';
import {FIGHTERS,fighterKey,expressionFor} from '../src/data/PresentationData.js';
test('functional icon categories cover controls, Unicode labels and dynamic action names without confusing đóng with đồng',()=>{
 const examples=[
  [{id:'btn-save'},'saves'],[{id:'btn-pause',text:'Tạm dừng'},'pause'],[{id:'btn-pause',text:'Tiếp tục'},'play'],
  [{text:'Đóng hồ sơ'},'close'],[{text:'Đồng hành'},'roster'],[{text:'Tặng trà · 1 trà'},'gift'],
  [{close:'menu-sheet',text:'×'},'close'],[{focus:'enemy_1'},'focus'],[{skill:'VoDang_1'},'sword'],
  [{attribute:'canCot'},'plus'],[{scale:'3'},'speed'],[{view:'saves'},'saves'],
  [{text:'Mời 10 lượt · 100 bạc'},'star'],[{text:'Lên đầu'},'up']
 ];
 for(const [input,expected] of examples){assert.equal(actionKey(input),expected);assert.ok(ICON_NAMES.includes(expected));}
});
test('new art stays inside the repo, has recorded prompts and hashes, and preserves separate originals',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../assets/images/ui-polish-manifest.json',import.meta.url)));
 assert.equal(manifest.length,21);assert.equal(manifest.filter(r=>r.kind==='sprite').length,9);assert.equal(manifest.filter(r=>r.kind==='expression').length,12);
 const seen=new Set();for(const r of manifest){
  assert.ok(!seen.has(r.file));seen.add(r.file);assert.ok(/^assets\/images\/(fighters|expressions)\/[\w-]+\.webp$/.test(r.file));
  const file=new URL('../'+r.file,import.meta.url);assert.ok(existsSync(file));assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),r.sha256);
  assert.ok(existsSync(new URL('../'+r.reference,import.meta.url)));assert.equal(r.generator,'built-in image_gen');assert.ok(r.prompt.length>100);
  if(r.kind==='sprite'){assert.equal(r.width,1536);assert.equal(r.height,1024);assert.ok(FIGHTERS.includes(r.id));}
 }
});
test('twenty-seven motion identities include ten protagonist phases and the original seventeen fighters',()=>{
 assert.equal(FIGHTERS.length,39);assert.equal(new Set(FIGHTERS).size,39);
 assert.equal(fighterKey({characterId:'mission_captive'}),'nguoi_phu');
 for(const id of ['tay_sai','quan_chu','kha_van','do_mau','doc_le'])assert.equal(fighterKey({characterId:id}),id);
 for(const id of ['companion_02','companion_04','companion_08'])assert.equal(fighterKey({templateId:id}),id);
 assert.equal(fighterKey({templateId:'companion_49'}),null);
});
test('new expressions use authored story timing, including calm post-conflict ending faces',()=>{
 assert.match(expressionFor('vu_binh',{chapter:3,episode:3}),/worried/);
 assert.match(expressionFor('vu_binh',{chapter:11,episode:5}),/resolved/);
 assert.match(expressionFor('tho_bay',{chapter:7,episode:7}),/ashamed/);
 assert.match(expressionFor('tho_bay',{chapter:11,episode:8}),/resolved/);
 assert.match(expressionFor('quan_chu',{chapter:12,episode:20}),/relieved/);
 assert.match(expressionFor('doc_le',{chapter:4,episode:20}),/angry/);
 assert.match(expressionFor('doc_le',{chapter:11,episode:4}),/defeated/);
});
