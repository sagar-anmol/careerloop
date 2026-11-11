import { maxMarks as computeMaxMarks, questionCount, round2, type ExamSet } from "./schema";

export type AnswerMap = Map<string, number | null>;

export interface QuestionOutcome {
  questionId: string;
  sectionId: string;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
}

export interface SectionBreakdown {
  id: string;
  title: string;
  questionCount: number;
  correct: number;
  wrong: number;
  unattempted: number;
  score: number;
  maxMarks: number;
}

export interface ScoreResult {
  score: number;
  maxMarks: number;
  percentage: number;
  correct: number;
  wrong: number;
  unattempted: number;
  sections: SectionBreakdown[];
  outcomes: QuestionOutcome[];
}

/**
 * Pure, deterministic scoring. `answers` maps question id to the selected
 * option index, or null when the candidate visited but did not answer.
 * Unattempted and marked-but-unanswered questions score zero.
 */
export function scoreExamSet(set: ExamSet, answers: AnswerMap): ScoreResult {
  const sections: SectionBreakdown[] = set.sections.map((section) => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    for (const question of section.questions) {
      const selected = answers.get(question.id) ?? null;
      if (selected === null || selected === undefined) unattempted += 1;
      else if (selected === question.correctIndex) correct += 1;
      else wrong += 1;
    }

    return {
      id: section.id,
      title: section.title,
      questionCount: section.questions.length,
      correct,
      wrong,
      unattempted,
      score: round2(correct * set.marksPerQuestion - wrong * set.negativeMarks),
      maxMarks: round2(section.questions.length * set.marksPerQuestion),
    };
  });

  const outcomes: QuestionOutcome[] = set.sections.flatMap((section) =>
    section.questions.map((question) => {
      const selected = answers.get(question.id) ?? null;
      return {
        questionId: question.id,
        sectionId: section.id,
        selectedIndex: selected,
        correctIndex: question.correctIndex,
        isCorrect: selected !== null && selected === question.correctIndex,
      };
    })
  );

  const correct = sections.reduce((total, section) => total + section.correct, 0);
  const wrong = sections.reduce((total, section) => total + section.wrong, 0);
  const unattempted = sections.reduce((total, section) => total + section.unattempted, 0);
  const total = computeMaxMarks(set);
  const raw = round2(correct * set.marksPerQuestion - wrong * set.negativeMarks);

  return {
    score: raw,
    maxMarks: total,
    percentage: total > 0 ? Math.max(0, Math.min(100, round2((raw / total) * 100))) : 0,
    correct,
    wrong,
    unattempted,
    sections,
    outcomes,
  };
}

export function summariseSet(set: ExamSet) {
  return {
    questionCount: questionCount(set),
    maxMarks: computeMaxMarks(set),
    sectionCount: set.sections.length,
  };
}
