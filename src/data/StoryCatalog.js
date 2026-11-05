import {MAIN_QUESTS,MAIN_BY_ID,ENDINGS} from './QuestsData.js';
import {CHAPTERS} from './StoryChaptersData.js';
import {DAI_VIET_QUESTS,DAI_VIET_BY_ID,DAI_VIET_CHAPTERS,DAI_VIET_ENDINGS} from './DaiVietStoryData.js';
const legacy={id:'legacy',revision:3,title:'Truyện quán Rồng Lửa',quests:MAIN_QUESTS,byId:MAIN_BY_ID,chapters:CHAPTERS,endings:ENDINGS,finalId:'Q304',finalAct:3};
const current={id:'dai-viet',revision:4,title:'Đại Việt Kỳ Hiệp Truyện',quests:DAI_VIET_QUESTS,byId:DAI_VIET_BY_ID,chapters:DAI_VIET_CHAPTERS,endings:DAI_VIET_ENDINGS,finalId:'D20H20',finalAct:5};
export function storyCatalog(sessionOrId){return sessionOrId==='dai-viet'||sessionOrId?.storyProgress?.storyRevision===4?current:legacy;}
