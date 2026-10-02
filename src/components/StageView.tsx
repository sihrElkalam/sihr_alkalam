import React, { useState } from 'react';
import { StageId, TermId, Lesson, GradeYear, Exercise } from '../types';
import { STAGES_META } from '../data/curriculumData';
import { TTSService } from '../services/ttsService';
import { ASSETS } from '../assets/images';
import {
  Mic,
  PenTool,
  BookOpen,
  Volume2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Award,
  Play,
  RotateCcw,
  HelpCircle,
  Clock,
  Sparkle,
  BookmarkCheck,
} from 'lucide-react';

interface StageViewProps {
  stageId: StageId;
  onSelectStage: (stage: StageId) => void;
  gradeYears: GradeYear[];
  lessons: Lesson[];
  exercises: Exercise[];
  onStartExercise: (exercise: Exercise) => void;
  onOpenAiForLesson: (lessonTitle: string, stageName: string) => void;
}

export const StageView: React.FC<StageViewProps> = ({
  stageId,
  onSelectStage,
  gradeYears,
  lessons,
  exercises,
  onStartExercise,
  onOpenAiForLesson,
}) => {
  const stageMeta = STAGES_META.find((s) => s.id === stageId) || STAGES_META[0];
  const stageGrades = gradeYears.filter((g) => g.stageId === stageId);

  const [selectedGradeId, setSelectedGradeId] = useState<string>(
    stageGrades[0]?.id || (stageId === 'primary' ? '1ap' : stageId === 'middle' ? '1am' : '1as')
  );
  const [selectedTerm, setSelectedTerm] = useState<TermId>('term1');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Filter lessons by grade and term
  const currentGrade = stageGrades.find((g) => g.id === selectedGradeId) || stageGrades[0];
  const filteredLessons = lessons.filter(
    (l) => l.stageId === stageId && l.gradeYearId === selectedGradeId && l.term === selectedTerm
  );

  // Filter exercises for this grade/stage
  const gradeExercises = exercises.filter(
    (e) => e.stageId === stageId && e.gradeYearId === selectedGradeId
  );

  const handleSpeakText = (text: string) => {
    if (isSpeaking) {
      TTSService.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      TTSService.speak(text, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Stage Selector Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${stageMeta.lightBg} ${stageMeta.iconColor} border ${stageMeta.borderColor}`}>
                {stageMeta.badge}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                المنهاج الجزائري الجيل الثاني
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 font-cairo">
              {stageMeta.name}
            </h1>
            <p className="text-stone-600 text-sm mt-1 max-w-xl">
              {stageMeta.description}
            </p>
          </div>

          {/* Quick Stage Switcher */}
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl self-start md:self-center">
            {STAGES_META.map((stage) => (
              <button
                key={stage.id}
                onClick={() => {
                  onSelectStage(stage.id);
                  const firstG = gradeYears.find((g) => g.stageId === stage.id);
                  if (firstG) setSelectedGradeId(firstG.id);
                  setActiveLesson(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  stageId === stage.id
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {stage.name.replace('الطور ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Grade-Year Selection Tabs */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-600">اختر السنة الدراسية:</span>
            {currentGrade && (
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                {currentGrade.description}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {stageGrades.map((grade) => {
              const isSelected = selectedGradeId === grade.id;
              return (
                <button
                  key={grade.id}
                  onClick={() => {
                    setSelectedGradeId(grade.id);
                    setActiveLesson(null);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    isSelected
                      ? `bg-linear-to-r ${stageMeta.color} text-white shadow-md scale-102`
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  <BookOpen className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-400'}`} />
                  <span>{grade.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Term 1 & Term 2 Toggle */}
        <div className="mt-6 pt-6 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedTerm('term1')}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-black text-sm transition-all ${
                selectedTerm === 'term1'
                  ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                  : 'bg-amber-50/60 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>الفصل الأول: التعبير الشفهي</span>
            </button>

            <button
              onClick={() => setSelectedTerm('term2')}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-black text-sm transition-all ${
                selectedTerm === 'term2'
                  ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-300'
                  : 'bg-rose-50/60 text-rose-900 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>الفصل الثاني: التعبير الكتابي</span>
            </button>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            عدد الدروس المتوفرة: <span className="font-bold text-stone-800">{filteredLessons.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Lessons List or Active Lesson Detail */}
      {activeLesson ? (
        /* Detailed Lesson Viewer */
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-stone-200 animate-in fade-in">
          {/* Back button & header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
            <button
              onClick={() => {
                TTSService.stop();
                setIsSpeaking(false);
                setActiveLesson(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold transition"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لقائمة دروس {currentGrade?.name}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAiForLesson(activeLesson.title, stageMeta.name)}
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>شرح الدرس بالمساعد الذكي</span>
              </button>

              {activeLesson.audioSampleText && (
                <button
                  onClick={() => handleSpeakText(activeLesson.audioSampleText || '')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isSpeaking
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isSpeaking ? 'إيقاف الصوت' : 'استمع للنموذج'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Lesson Title & Objectives */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                activeLesson.category === 'oral'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {activeLesson.category === 'oral' ? 'تعبير شفهي' : 'تعبير كتابي'}
              </span>
              <span className="text-xs text-stone-500">{activeLesson.subtitle}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-cairo mb-4 leading-tight">
              {activeLesson.title}
            </h2>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 mb-6">
              <h4 className="text-xs font-black text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                <span>أهداف التعلم في هذا الدرس:</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-stone-600">
                {activeLesson.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content & Explanation */}
          <div className="prose max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4 mb-8 whitespace-pre-line bg-amber-50/20 p-6 rounded-3xl border border-amber-100">
            {activeLesson.content}
          </div>

          {/* Key Rules / Takeaways */}
          {activeLesson.rules && activeLesson.rules.length > 0 && (
            <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200 mb-8">
              <h3 className="text-lg font-black text-emerald-950 font-cairo mb-3 flex items-center gap-2">
                <Sparkle className="w-5 h-5 text-emerald-600" />
                <span>القواعد والوصايا الذهبية لسحر الكلام:</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeLesson.rules.map((rule, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-stone-700 leading-normal font-medium">
                      {rule}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples & Models */}
          {activeLesson.examples && activeLesson.examples.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-black text-stone-900 font-cairo">
                نماذج وتطبيقات عملية:
              </h3>
              {activeLesson.examples.map((ex, idx) => (
                <div key={idx} className="bg-linear-to-r from-stone-50 to-amber-50/40 p-5 rounded-3xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-stone-900 text-sm sm:text-base">
                      {ex.title}
                    </span>
                    <button
                      onClick={() => handleSpeakText(ex.text)}
                      className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>قراءة صوتية</span>
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 text-sm sm:text-base text-stone-800 leading-relaxed font-tajawal mb-2 shadow-inner">
                    {ex.text}
                  </div>
                  {ex.analysis && (
                    <div className="text-xs text-stone-600 bg-amber-100/50 p-2.5 rounded-xl border border-amber-200/60">
                      <span className="font-bold text-amber-900">تحليل الأستاذ: </span>
                      {ex.analysis}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Vocabulary or Connectors */}
          {activeLesson.connectorsOrVocabulary && activeLesson.connectorsOrVocabulary.length > 0 && (
            <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-200 mb-8">
              <h4 className="text-sm font-black text-rose-900 mb-3 flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-rose-600" />
                <span>رصيد لغوي وأدوات ربط موظفة في هذا الدرس:</span>
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {activeLesson.connectorsOrVocabulary.map((vocab, i) => (
                  <div key={i} className="bg-white px-3 py-1.5 rounded-xl border border-rose-200 text-xs shadow-2xs">
                    <span className="font-bold text-rose-700">{vocab.term}: </span>
                    <span className="text-stone-600">{vocab.meaningOrUsage}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start Exercise for this lesson if exists */}
          <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-stone-500 font-medium">
              هل فهمت الدرس جيداً؟ اختبر معلوماتك الآن من خلال تمرين تطبيقي!
            </span>
            <div className="flex items-center gap-3">
              {gradeExercises.length > 0 ? (
                <button
                  onClick={() => onStartExercise(gradeExercises[0])}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>بدء تمرين هذا الدرس</span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenAiForLesson(activeLesson.title, stageMeta.name)}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>توليد تمرين عبر الذكاء الاصطناعي</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Lessons Grid for the selected stage and grade */
        <div>
          {filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className="bg-white rounded-3xl p-6 border-2 border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${
                        lesson.category === 'oral'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {lesson.category === 'oral' ? 'تعبير شفهي 🎙️' : 'تعبير كتابي ✍️'}
                      </span>
                      {lesson.isCustom && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                          درس مضاف جديد
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-stone-900 font-cairo mb-2 group-hover:text-rose-600 transition leading-snug">
                      {lesson.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 mb-4 leading-relaxed">
                      {lesson.summary}
                    </p>

                    <div className="space-y-1 mb-4">
                      {lesson.objectives.slice(0, 2).map((obj, i) => (
                        <div key={i} className="text-xs text-stone-500 flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-500">
                      {lesson.rules?.length || 0} قواعد تعليمية
                    </span>
                    <span className="text-rose-600 group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                      <span>عرض وتعلّم الدرس</span>
                      <span>←</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-stone-300">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-stone-700 mb-1">
                لا توجد دروس مدخلة حالياً في هذا الفصل لهذا المستوى
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-4">
                الموقع مهيأ لإضافة الدروس تدريجياً. يمكنك استخدام زر «إدارة المحتوى» لإضافة دروسك الخاصة في أي وقت.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
