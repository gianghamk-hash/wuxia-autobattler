import { MAIN_QUESTS, LEGACY_MAIN_QUESTS } from '../data/QuestsData.js';
import { STORY_REVISION } from '../data/StoryChaptersData.js';
export function expandStoryProgress(input) {
  if (input?.storyRevision === STORY_REVISION) return structuredClone(input);
  if (
    !input ||
    input.campaignVersion !== 1 ||
    input.storyRevision !== undefined ||
    !Array.isArray(input.completedQuests) ||
    new Set(input.completedQuests).size !== input.completedQuests.length
  )
    throw Error('Phiên bản hoặc tiến trình truyện không hợp lệ.');
  const known = new Set(LEGACY_MAIN_QUESTS.map((q) => q.id));
  if (
    input.completedQuests.some(
      (id) => !known.has(id) && !/^recruit_(0[1-9]|1[0-9]|20)$/.test(id)
    )
  )
    throw Error('Nhiệm vụ cũ không tồn tại.');
  let gap = false,
    count = 0;
  for (const q of LEGACY_MAIN_QUESTS) {
    if (input.completedQuests.includes(q.id)) {
      if (gap) throw Error('Bản cũ bị thiếu chương trước.');
      count++;
    } else gap = true;
  }
  const next = LEGACY_MAIN_QUESTS[count];
  if (
    input.activeQuestId !== (next?.id ?? null) ||
    input.currentAct !== (next?.act ?? 3) ||
    Boolean(input.endingId) !== input.completedQuests.includes('Q304')
  )
    throw Error('Mốc truyện cũ không khớp.');
  if (
    input.pendingEncounter?.kind === 'main' &&
    input.pendingEncounter.questId !== input.activeQuestId
  )
    throw Error('Trận cũ không khớp chương.');
  const story = structuredClone(input),
    completed = MAIN_QUESTS.filter((q) => q.chapter <= count).map((q) => q.id);
  if (input.pendingEncounter?.kind === 'main') {
    const anchor = MAIN_QUESTS.find(
      (q) => q.id === input.pendingEncounter.questId
    );
    for (const q of MAIN_QUESTS.filter(
      (q) => q.chapter === anchor.chapter && q.episode < anchor.episode
    ))
      completed.push(q.id);
  }
  story.completedQuests = [
    ...completed,
    ...input.completedQuests.filter((id) => !known.has(id))
  ];
  story.storyRevision = STORY_REVISION;
  story.importedChapters = Array.from({ length: count }, (_, i) => i + 1);
  const current = MAIN_QUESTS.find((q) => !completed.includes(q.id));
  story.activeQuestId = current?.id ?? null;
  story.currentAct = current?.act ?? 3;
  story.currentChapter = current?.chapter ?? 12;
  story.currentEpisode = current?.episode ?? 20;
  return story;
}
