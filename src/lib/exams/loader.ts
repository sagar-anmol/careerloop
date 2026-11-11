import aptitude01 from "../../../content/exams/careerloop-aptitude-01.json";
import core01 from "../../../content/exams/careerloop-core-01.json";
import english01 from "../../../content/exams/careerloop-english-01.json";
import mains01 from "../../../content/exams/careerloop-mains-01.json";
import { type ExamSet, validateExamSet } from "./schema";

/**
 * Question banks are server-only. This module must never be imported from a
 * component with "use client" — doing so would inline the answer keys into the
 * browser bundle. The API routes under src/app/api/exam are the only consumers.
 */
const RAW_SETS: Array<{ file: string; data: unknown }> = [
  { file: "careerloop-mains-01.json", data: mains01 },
  { file: "careerloop-core-01.json", data: core01 },
  { file: "careerloop-aptitude-01.json", data: aptitude01 },
  { file: "careerloop-english-01.json", data: english01 },
];

const SETS: ExamSet[] = (() => {
  const validated = RAW_SETS.map(({ file, data }) => validateExamSet(data, file));
  const ids = new Set<string>();
  for (const set of validated) {
    if (ids.has(set.id)) throw new Error(`Duplicate exam set id "${set.id}"`);
    ids.add(set.id);
  }
  return validated;
})();

const BY_ID = new Map(SETS.map((set) => [set.id, set]));

export function listExamSets(): ExamSet[] {
  return SETS;
}

export function getExamSet(setId: string): ExamSet | undefined {
  return BY_ID.get(setId);
}
