import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ICON_NAMES} from '../src/ui/Visuals.js';
import {portraitURL} from '../src/data/ArtURLs.js';
test('rendered color icon provenance covers the registry exactly and stored hashes match the shipped files',()=>{
 const rows=JSON.parse(readFileSync(new URL('../assets/images/icons/manifest.json',import.meta.url)));assert.deepEqual(rows.map(r=>r.id),ICON_NAMES);assert.equal(new Set(rows.map(r=>r.asset)).size,40);
 for(const row of rows){assert.match(row.mode,/image_gen/);assert.ok(row.prompt.length>100);assert.equal(createHash('sha256').update(readFileSync(new URL('../'+row.asset,import.meta.url))).digest('hex'),row.sha256);}
});
test('ten replacement portraits preserve stable identities, reference provenance and the scoped cache revision',()=>{
 const rows=JSON.parse(readFileSync(new URL('../assets/images/companions/expansion-backgrounds-manifest.json',import.meta.url)));assert.equal(rows.length,10);
 for(const r of rows){assert.ok(r.originalSource&&r.reference&&r.prompt.includes('preserve'));assert.match(portraitURL(r.asset),/art=5\.1/);assert.equal(createHash('sha256').update(readFileSync(new URL('../'+r.asset,import.meta.url))).digest('hex'),r.sha256);}
 assert.doesNotMatch(portraitURL('assets/images/companions/companion_50.webp'),/art=/);assert.doesNotMatch(portraitURL('assets/images/hero/modern.webp'),/art=/);
});
