import {
  CASE_ENTRIES,
  CASE_QUESTIONS,
  CASE_RELATIONS
} from '../data/CasebookData.js';
import { MAIN_QUESTS } from '../data/QuestsData.js';
import { NPCS_BY_ID } from '../data/NPCData.js';
import { COMPANIONS_BY_ID } from '../data/CompanionsData.js';
import {isDaiViet} from '../data/DaiVietCast.js';
import {daiVietCasebook} from './DaiVietCasebook.js';
export function casebook(session) {
  if(isDaiViet(session))return daiVietCasebook(session);
  const done = new Set(session.storyProgress.completedQuests),
    current = MAIN_QUESTS.find(
      (q) => q.id === session.storyProgress.activeQuestId
    );
  const entries = CASE_ENTRIES.filter((e) => done.has(e.source)).map((e) => ({
    ...e,
    quest: MAIN_QUESTS.find((q) => q.id === e.source)
  }));
  const peopleIds = new Set(entries.flatMap((e) => e.people));
  const people = [...peopleIds].map((id) => {
    const person = NPCS_BY_ID[id] ?? COMPANIONS_BY_ID[id];
    // Use unlocked evidence, not the NPC codex biography which can contain future facts.
    return {
      id,
      name: person.name,
      portrait: person.portrait,
      sect: person.sect,
      facts: entries
        .filter((e) => e.people.includes(id))
        .map((e) => ({ title: e.title, text: e.text, source: e.source }))
    };
  });
  return {
    entries,
    people,
    relations: CASE_RELATIONS.filter(
      (e) => done.has(e.source) && peopleIds.has(e.from) && peopleIds.has(e.to)
    ),
    questions: CASE_QUESTIONS.filter((q) => done.has(q.from)).map((q) => ({
      id: q.id,
      question: q.question,
      answered: done.has(q.answered),
      answer: done.has(q.answered) ? q.answer : null,
      source: done.has(q.answered) ? q.answered : q.from
    })),
    next: current
      ? {
          id: current.id,
          title: current.title,
          location: current.location,
          objective: current.objectiveText
        }
      : null
  };
}
