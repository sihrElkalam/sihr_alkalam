export type StageId = 'primary' | 'middle' | 'secondary';

export type TermId = 'term1' | 'term2'; // term1 = التعبير الشفهي, term2 = التعبير الكتابي

export interface GradeYear {
  id: string; // e.g. '1ap', '2ap', ... '1am', ... '1as'
  stageId: StageId;
  name: string; // e.g. "السنة الأولى ابتدائي"
  shortName: string; // e.g. "1 ابتدائي"
  order: number;
  description: string;
}

export type LessonCategory = 'oral' | 'written';

export interface Lesson {
  id: string;
  stageId: StageId;
  gradeYearId: string;
  term: TermId;
  category: LessonCategory;
  title: string;
  subtitle: string;
  objectives: string[];
  summary: string;
  content: string; // Rich Arabic markdown or structured paragraphs
  rules: string[]; // Pedagogical rules or key takeaways
  examples: {
    title: string;
    text: string;
    analysis?: string;
  }[];
  connectorsOrVocabulary?: {
    term: string;
    meaningOrUsage: string;
  }[];
  picturePromptUrl?: string; // Optional image for oral discussion or writing prompt
  audioSampleText?: string; // Text to be read aloud via speech synthesis
  isCustom?: boolean; // Added by the teacher
  createdAt?: string;
}

export type QuestionType = 'mcq' | 'true_false' | 'reorder' | 'open_text';

export interface ExerciseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[]; // for mcq
  correctAnswer: string | number | string[]; // string/index for mcq, boolean/string for true_false, ordered array for reorder
  explanation: string; // Pedagogical explanation in Arabic
  hint?: string;
}

export interface Exercise {
  id: string;
  lessonId?: string;
  stageId: StageId;
  gradeYearId: string;
  title: string;
  description: string;
  category: LessonCategory;
  questions: ExerciseQuestion[];
  isCustom?: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  stageId: StageId;
  gradeYearId?: string;
  category: 'worksheet' | 'mindmap' | 'video' | 'summary' | 'model';
  description: string;
  downloadable?: boolean;
  contentSnippet?: string;
  pdfPrintData?: {
    header: string;
    instructions: string;
    body: string;
    exerciseBox: string;
  };
  videoUrl?: string;
  isCustom?: boolean;
}

export interface EssayModel {
  id: string;
  stageId: StageId;
  gradeYearId: string;
  patternType: 'سردي' | 'وصفي' | 'حجاجي' | 'تفسيري' | 'توجيهي / إيعازي';
  title: string;
  situation: string; // الوضعية الإدماجية
  introduction: string; // المقدمة
  body: string; // العرض
  conclusion: string; // الخاتمة
  analysisPoints: string[];
  keywords: string[];
}
