import {formationRole,ROLE_TAGS} from '../data/RoleTags.js';
export function roleTag(unit) {
  const tag=document.createElement('span'),role=formationRole(unit);
  tag.className='unit-role-tag';
  if(!role){tag.hidden=true;return tag;}
  tag.dataset.role=role;tag.textContent=ROLE_TAGS[role].label;
  tag.title=ROLE_TAGS[role].hint;
  tag.setAttribute('aria-label','Vai trò: '+ROLE_TAGS[role].label);
  return tag;
}
