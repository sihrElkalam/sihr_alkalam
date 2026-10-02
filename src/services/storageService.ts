import { Lesson, Exercise, ResourceItem, GradeYear } from '../types';
import { INITIAL_LESSONS, INITIAL_EXERCISES, INITIAL_RESOURCES, GRADE_YEARS } from '../data/curriculumData';

const STORAGE_KEYS = {
  LESSONS: 'sihr_al_kalam_lessons_v1',
  EXERCISES: 'sihr_al_kalam_exercises_v1',
  RESOURCES: 'sihr_al_kalam_resources_v1',
  GRADE_YEARS: 'sihr_al_kalam_grade_years_v1',
  AUTH_ROLE: 'sihr_al_kalam_auth_role_v1',
  TEACHER_CODE: 'sihr_al_kalam_teacher_code_v1',
  STUDENT_CODE: 'sihr_al_kalam_student_code_v1',
};

export const StorageService = {
  // Authentication & Access Protection
  getTeacherPasscode(): string {
    return localStorage.getItem(STORAGE_KEYS.TEACHER_CODE) || 'استاذ2026';
  },

  setTeacherPasscode(code: string): void {
    localStorage.setItem(STORAGE_KEYS.TEACHER_CODE, code);
  },

  getStudentPasscode(): string {
    return localStorage.getItem(STORAGE_KEYS.STUDENT_CODE) || 'تلميذ2026';
  },

  setStudentPasscode(code: string): void {
    localStorage.setItem(STORAGE_KEYS.STUDENT_CODE, code);
  },

  getCurrentRole(): 'teacher' | 'student' | null {
    const role = localStorage.getItem(STORAGE_KEYS.AUTH_ROLE);
    if (role === 'teacher' || role === 'student') return role;
    return null;
  },

  login(enteredCode: string): 'teacher' | 'student' | null {
    const teacherCode = this.getTeacherPasscode().trim().toLowerCase();
    const studentCode = this.getStudentPasscode().trim().toLowerCase();
    const input = enteredCode.trim().toLowerCase();

    // Universal quick codes or configured codes
    if (input === teacherCode || input === 'admin' || input === 'استاذ') {
      localStorage.setItem(STORAGE_KEYS.AUTH_ROLE, 'teacher');
      return 'teacher';
    }
    if (input === studentCode || input === 'طالب' || input === 'تلميذ') {
      localStorage.setItem(STORAGE_KEYS.AUTH_ROLE, 'student');
      return 'student';
    }
    return null;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_ROLE);
  },

  // Grades
  getGradeYears(): GradeYear[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GRADE_YEARS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading grade years from localStorage:', e);
    }
    return GRADE_YEARS;
  },

  saveGradeYear(grade: GradeYear): GradeYear[] {
    const grades = this.getGradeYears();
    const existingIndex = grades.findIndex((g) => g.id === grade.id);
    let updated: GradeYear[];
    if (existingIndex >= 0) {
      updated = [...grades];
      updated[existingIndex] = grade;
    } else {
      updated = [...grades, grade];
    }
    localStorage.setItem(STORAGE_KEYS.GRADE_YEARS, JSON.stringify(updated));
    return updated;
  },

  // Lessons
  getLessons(): Lesson[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LESSONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading lessons from localStorage:', e);
    }
    return INITIAL_LESSONS;
  },

  saveLesson(lesson: Lesson): Lesson[] {
    const lessons = this.getLessons();
    const existingIndex = lessons.findIndex((l) => l.id === lesson.id);
    let updated: Lesson[];
    if (existingIndex >= 0) {
      updated = [...lessons];
      updated[existingIndex] = lesson;
    } else {
      updated = [lesson, ...lessons];
    }
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(updated));
    return updated;
  },

  deleteLesson(id: string): Lesson[] {
    const lessons = this.getLessons();
    const updated = lessons.filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(updated));
    return updated;
  },

  // Exercises
  getExercises(): Exercise[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXERCISES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading exercises from localStorage:', e);
    }
    return INITIAL_EXERCISES;
  },

  saveExercise(exercise: Exercise): Exercise[] {
    const exercises = this.getExercises();
    const existingIndex = exercises.findIndex((e) => e.id === exercise.id);
    let updated: Exercise[];
    if (existingIndex >= 0) {
      updated = [...exercises];
      updated[existingIndex] = exercise;
    } else {
      updated = [exercise, ...exercises];
    }
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(updated));
    return updated;
  },

  // Resources
  getResources(): ResourceItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading resources from localStorage:', e);
    }
    return INITIAL_RESOURCES;
  },

  saveResource(resource: ResourceItem): ResourceItem[] {
    const resources = this.getResources();
    const existingIndex = resources.findIndex((r) => r.id === resource.id);
    let updated: ResourceItem[];
    if (existingIndex >= 0) {
      updated = [...resources];
      updated[existingIndex] = resource;
    } else {
      updated = [resource, ...resources];
    }
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(updated));
    return updated;
  },

  // Export / Backup
  exportData(): string {
    const data = {
      gradeYears: this.getGradeYears(),
      lessons: this.getLessons(),
      exercises: this.getExercises(),
      resources: this.getResources(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Import
  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.lessons) {
        localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(parsed.lessons));
      }
      if (parsed.exercises) {
        localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(parsed.exercises));
      }
      if (parsed.resources) {
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(parsed.resources));
      }
      if (parsed.gradeYears) {
        localStorage.setItem(STORAGE_KEYS.GRADE_YEARS, JSON.stringify(parsed.gradeYears));
      }
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  },

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.LESSONS);
    localStorage.removeItem(STORAGE_KEYS.EXERCISES);
    localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.GRADE_YEARS);
  },
};
