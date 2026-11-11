export type Difficulty = "easy" | "medium" | "hard";
export type ReviewPolicy = "after_submit" | "score_only";

export interface ExamQuestion {
  id: string;
  subject: string;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
  topic: string;
}

export interface ExamSection {
  id: string;
  title: string;
  questions: ExamQuestion[];
}

export interface ExamSet {
  id: string;
  title: string;
  examType: string;
  patternNote: string;
  durationSeconds: number;
  marksPerQuestion: number;
  negativeMarks: number;
  attemptCap: number;
  reviewPolicy: ReviewPolicy;
  sections: ExamSection[];
}

/** Question shape that may be sent to the browser. Never contains the key. */
export interface PublicQuestion {
  id: string;
  subject: string;
  stem: string;
  options: string[];
  topic: string;
}

export interface PublicSection {
  id: string;
  title: string;
  questions: PublicQuestion[];
}

export class ExamSetError extends Error {
  readonly setFile: string;

  constructor(setFile: string, message: string) {
    super(`Invalid exam set "${setFile}": ${message}`);
    this.name = "ExamSetError";
    this.setFile = setFile;
  }
}

const SLUG = /^[a-z0-9][a-z0-9-]*$/;
const DIFFICULTIES: readonly string[] = ["easy", "medium", "hard"];
const REVIEW_POLICIES: readonly string[] = ["after_submit", "score_only"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, field: string, file: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ExamSetError(file, `${field} must be a non-empty string`);
  }
  return value.trim();
}

function positiveInt(value: unknown, field: string, file: string, min = 1): number {
  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value) || value < min) {
    throw new ExamSetError(file, `${field} must be an integer >= ${min}`);
  }
  return value;
}

function nonNegativeNumber(value: unknown, field: string, file: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new ExamSetError(file, `${field} must be a number >= 0`);
  }
  return value;
}

/**
 * Validates one question bank at load time. Throwing here is deliberate: a
 * malformed set must fail the build/request loudly instead of shipping a
 * broken or unscoreable paper.
 */
export function validateExamSet(input: unknown, file = "unknown"): ExamSet {
  if (!isRecord(input)) throw new ExamSetError(file, "root must be an object");

  const id = text(input.id, "id", file);
  if (!SLUG.test(id)) throw new ExamSetError(file, "id must be a lowercase slug (a-z, 0-9, hyphen)");

  const reviewPolicy = text(input.reviewPolicy, "reviewPolicy", file);
  if (!REVIEW_POLICIES.includes(reviewPolicy)) {
    throw new ExamSetError(file, `reviewPolicy must be one of ${REVIEW_POLICIES.join(", ")}`);
  }

  if (!Array.isArray(input.sections) || input.sections.length === 0) {
    throw new ExamSetError(file, "sections must be a non-empty array");
  }

  const sectionIds = new Set<string>();
  const questionIds = new Set<string>();
  const sections: ExamSection[] = [];

  for (const [sectionIndex, rawSection] of input.sections.entries()) {
    if (!isRecord(rawSection)) throw new ExamSetError(file, `sections[${sectionIndex}] must be an object`);

    const sectionId = text(rawSection.id, `sections[${sectionIndex}].id`, file);
    if (!SLUG.test(sectionId)) throw new ExamSetError(file, `section id "${sectionId}" must be a lowercase slug`);
    if (sectionIds.has(sectionId)) throw new ExamSetError(file, `duplicate section id "${sectionId}"`);
    sectionIds.add(sectionId);

    if (!Array.isArray(rawSection.questions) || rawSection.questions.length === 0) {
      throw new ExamSetError(file, `section "${sectionId}" must contain at least one question`);
    }

    const questions: ExamQuestion[] = rawSection.questions.map((rawQuestion, questionIndex) => {
      const where = `sections[${sectionIndex}].questions[${questionIndex}]`;
      if (!isRecord(rawQuestion)) throw new ExamSetError(file, `${where} must be an object`);

      const questionId = text(rawQuestion.id, `${where}.id`, file);
      if (questionIds.has(questionId)) throw new ExamSetError(file, `duplicate question id "${questionId}"`);
      questionIds.add(questionId);

      if (!Array.isArray(rawQuestion.options) || rawQuestion.options.length !== 4) {
        throw new ExamSetError(file, `${where} ("${questionId}") must have exactly 4 options`);
      }
      const options = rawQuestion.options.map((option, optionIndex) => {
        if (typeof option !== "string" || option.trim() === "") {
          throw new ExamSetError(file, `${where}.options[${optionIndex}] must be a non-empty string`);
        }
        return option.trim();
      });

      const correctIndex = rawQuestion.correctIndex;
      if (
        typeof correctIndex !== "number" ||
        !Number.isInteger(correctIndex) ||
        correctIndex < 0 ||
        correctIndex > 3
      ) {
        throw new ExamSetError(file, `${where}.correctIndex must be an integer from 0 to 3`);
      }

      const difficulty = text(rawQuestion.difficulty, `${where}.difficulty`, file);
      if (!DIFFICULTIES.includes(difficulty)) {
        throw new ExamSetError(file, `${where}.difficulty must be one of ${DIFFICULTIES.join(", ")}`);
      }

      return {
        id: questionId,
        subject: text(rawQuestion.subject, `${where}.subject`, file),
        stem: text(rawQuestion.stem, `${where}.stem`, file),
        options,
        correctIndex,
        explanation: text(rawQuestion.explanation, `${where}.explanation`, file),
        difficulty: difficulty as Difficulty,
        topic: text(rawQuestion.topic, `${where}.topic`, file),
      };
    });

    sections.push({
      id: sectionId,
      title: text(rawSection.title, `sections[${sectionIndex}].title`, file),
      questions,
    });
  }

  return {
    id,
    title: text(input.title, "title", file),
    examType: text(input.examType, "examType", file),
    patternNote: text(input.patternNote, "patternNote", file),
    durationSeconds: positiveInt(input.durationSeconds, "durationSeconds", file, 60),
    marksPerQuestion: nonNegativeNumber(input.marksPerQuestion, "marksPerQuestion", file),
    negativeMarks: nonNegativeNumber(input.negativeMarks, "negativeMarks", file),
    attemptCap: positiveInt(input.attemptCap, "attemptCap", file, 1),
    reviewPolicy: reviewPolicy as ReviewPolicy,
    sections,
  };
}

export function allQuestions(set: ExamSet): ExamQuestion[] {
  return set.sections.flatMap((section) => section.questions);
}

export function questionCount(set: ExamSet): number {
  return set.sections.reduce((total, section) => total + section.questions.length, 0);
}

export function maxMarks(set: ExamSet): number {
  return round2(questionCount(set) * set.marksPerQuestion);
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Strips answer keys, explanations and authoring-only metadata before anything reaches the browser. */
export function toPublicSections(set: ExamSet): PublicSection[] {
  return set.sections.map((section) => ({
    id: section.id,
    title: section.title,
    questions: section.questions.map((question) => ({
      id: question.id,
      subject: question.subject,
      stem: question.stem,
      options: question.options,
      topic: question.topic,
    })),
  }));
}
