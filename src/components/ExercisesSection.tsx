import React, { useState } from 'react';
import { Exercise, ExerciseQuestion, StageId, GradeYear } from '../types';
import { TTSService } from '../services/ttsService';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Filter,
  Check,
  Star,
  Printer,
  ChevronRight,
  Smile,
  Trophy,
} from 'lucide-react';

interface ExercisesSectionProps {
  exercises: Exercise[];
  gradeYears: GradeYear[];
  selectedStage: StageId;
  onSelectStage: (stage: StageId) => void;
  activeExercise: Exercise | null;
  setActiveExercise: (exercise: Exercise | null) => void;
  onOpenAiGenerator: (stageName: string, gradeName: string) => void;
}

export const ExercisesSection: React.FC<ExercisesSectionProps> = ({
  exercises,
  gradeYears,
  selectedStage,
  onSelectStage,
  activeExercise,
  setActiveExercise,
  onOpenAiGenerator,
}) => {
  const [filterStage, setFilterStage] = useState<StageId>(selectedStage);
  const [filterGradeId, setFilterGradeId] = useState<string>('all');

  // Exercise Playing State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<Record<string, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [studentName, setStudentName] = useState('التلميذ المبدع');
  const [showCertificate, setShowCertificate] = useState(false);

  // Drag/click reorder state for 'reorder' question
  const [currentReorder, setCurrentReorder] = useState<string[]>([]);

  const filteredGrades = gradeYears.filter((g) => g.stageId === filterStage);
  const filteredExercises = exercises.filter((ex) => {
    if (ex.stageId !== filterStage) return false;
    if (filterGradeId !== 'all' && ex.gradeYearId !== filterGradeId) return false;
    return true;
  });

  const handleStartExercise = (ex: Exercise) => {
    setActiveExercise(ex);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setIsAnswerSubmitted({});
    setIsFinished(false);
    setShowCertificate(false);

    // Initialize reorder if first question is reorder
    if (ex.questions[0]?.type === 'reorder' && ex.questions[0].options) {
      setCurrentReorder([...ex.questions[0].options].sort(() => Math.random() - 0.5));
    }
  };

  const handleSelectOption = (questionId: string, answer: any) => {
    if (isAnswerSubmitted[questionId]) return;
    setUserAnswers({ ...userAnswers, [questionId]: answer });
  };

  const handleSubmitAnswer = (question: ExerciseQuestion) => {
    let answer = userAnswers[question.id];
    if (question.type === 'reorder') {
      answer = currentReorder;
      setUserAnswers({ ...userAnswers, [question.id]: currentReorder });
    }

    if (answer === undefined) return;

    setIsAnswerSubmitted({ ...isAnswerSubmitted, [question.id]: true });

    // Sound effect
    const isCorrect = checkIsCorrect(question, answer);
    if (isCorrect) {
      TTSService.playSuccessSound();
    } else {
      TTSService.playErrorSound();
    }
  };

  const checkIsCorrect = (question: ExerciseQuestion, answer: any): boolean => {
    if (question.type === 'reorder') {
      const correct = question.correctAnswer as string[];
      if (!answer || answer.length !== correct.length) return false;
      return answer.every((val: string, i: number) => val === correct[i]);
    }
    return String(answer).trim() === String(question.correctAnswer).trim();
  };

  const handleNextQuestion = () => {
    if (!activeExercise) return;
    if (currentQuestionIdx < activeExercise.questions.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      const nextQ = activeExercise.questions[nextIdx];
      if (nextQ.type === 'reorder' && nextQ.options && !userAnswers[nextQ.id]) {
        setCurrentReorder([...nextQ.options].sort(() => Math.random() - 0.5));
      }
    } else {
      setIsFinished(true);
    }
  };

  // Calculate score
  const totalQuestions = activeExercise?.questions.length || 0;
  const correctCount = activeExercise
    ? activeExercise.questions.filter((q) => checkIsCorrect(q, userAnswers[q.id])).length
    : 0;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Exercise Active Playing View */}
      {activeExercise ? (
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setActiveExercise(null)}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-bold shadow-xs transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة التمارين والاختبارات</span>
          </button>

          {!isFinished ? (
            /* Question Box */
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border-2 border-amber-200 animate-in fade-in">
              {/* Exercise Title and Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-bold">
                  <span>{activeExercise.title}</span>
                  <span>السؤال {currentQuestionIdx + 1} من {totalQuestions}</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-amber-400 to-rose-500 transition-all duration-300 rounded-full"
                    style={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Question */}
              {activeExercise.questions[currentQuestionIdx] && (() => {
                const q = activeExercise.questions[currentQuestionIdx];
                const submitted = isAnswerSubmitted[q.id];
                const currentAnswer = userAnswers[q.id];
                const isCorrect = submitted && checkIsCorrect(q, q.type === 'reorder' ? currentReorder : currentAnswer);

                return (
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center shrink-0">
                        {currentQuestionIdx + 1}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-cairo leading-snug">
                        {q.prompt}
                      </h3>
                    </div>

                    {/* Question Types: MCQ */}
                    {q.type === 'mcq' && q.options && (
                      <div className="grid grid-cols-1 gap-3 pt-2">
                        {q.options.map((opt, i) => {
                          const isSelected = currentAnswer === opt;
                          let btnClass = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';

                          if (submitted) {
                            if (opt === q.correctAnswer) {
                              btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-300';
                            } else if (isSelected && opt !== q.correctAnswer) {
                              btnClass = 'bg-rose-100 border-rose-400 text-rose-900 line-through';
                            }
                          } else if (isSelected) {
                            btnClass = 'bg-rose-500 text-white font-bold border-rose-600 shadow-md';
                          }

                          return (
                            <button
                              key={i}
                              disabled={submitted}
                              onClick={() => handleSelectOption(q.id, opt)}
                              className={`p-4 rounded-2xl border-2 text-right text-sm sm:text-base transition-all duration-200 flex items-center justify-between ${btnClass}`}
                            >
                              <span>{opt}</span>
                              {submitted && opt === q.correctAnswer && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                              )}
                              {submitted && isSelected && opt !== q.correctAnswer && (
                                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Question Types: True / False */}
                    {q.type === 'true_false' && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {['صح', 'خطأ'].map((opt) => {
                          const isSelected = currentAnswer === opt;
                          let btnClass = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';

                          if (submitted) {
                            if (opt === q.correctAnswer) {
                              btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                            } else if (isSelected && opt !== q.correctAnswer) {
                              btnClass = 'bg-rose-100 border-rose-400 text-rose-900';
                            }
                          } else if (isSelected) {
                            btnClass = 'bg-amber-500 text-white font-bold border-amber-600 shadow-md';
                          }

                          return (
                            <button
                              key={opt}
                              disabled={submitted}
                              onClick={() => handleSelectOption(q.id, opt)}
                              className={`p-5 rounded-2xl border-2 text-center text-lg font-black transition-all ${btnClass}`}
                            >
                              {opt === 'صح' ? '✅ صح' : '❌ خطأ'}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Question Types: Reorder */}
                    {q.type === 'reorder' && (
                      <div className="space-y-4 pt-2">
                        <p className="text-xs text-stone-500">
                          اضغط على الكلمات بالترتيب الصحيح، أو أعد ضبطها:
                        </p>
                        <div className="flex flex-wrap gap-2.5 min-h-16 p-4 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-300 items-center">
                          {currentReorder.map((word, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-white text-stone-800 font-bold rounded-xl border border-amber-300 shadow-xs text-sm sm:text-base flex items-center gap-1.5 animate-in zoom-in-90"
                            >
                              <span className="text-xs text-amber-600 font-bold">#{idx + 1}</span>
                              <span>{word}</span>
                            </span>
                          ))}
                        </div>

                        {!submitted && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (q.options) {
                                  setCurrentReorder([...q.options].sort(() => Math.random() - 0.5));
                                }
                              }}
                              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>إعادة خلط الكلمات</span>
                            </button>
                            {/* Allow swap forward/back */}
                            <span className="text-xs text-stone-400">
                              (يمكنك النقر لتحريك أي كلمة)
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Explanation Box shown after submission */}
                    {submitted && (
                      <div className={`p-5 rounded-2xl border animate-in fade-in space-y-2 ${
                        isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                      }`}>
                        <div className="flex items-center gap-2 font-bold text-sm">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              <span className="text-emerald-900">إجابة ممتازة وصحيحة! بارك الله فيك.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-rose-600" />
                              <span className="text-rose-900">إجابة غير دقيقة! تعلم من التفسير التالي:</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                          <strong>التفسير التربوي: </strong>{q.explanation}
                        </p>
                      </div>
                    )}

                    {/* Actions: Submit or Next */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                      {!submitted ? (
                        <button
                          onClick={() => handleSubmitAnswer(q)}
                          disabled={q.type !== 'reorder' && currentAnswer === undefined}
                          className="px-8 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-stone-200 text-white font-bold text-sm rounded-xl transition shadow-md"
                        >
                          تأكيد الإجابة
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center gap-2 ml-auto"
                        >
                          <span>{currentQuestionIdx < totalQuestions - 1 ? 'السؤال التالي' : 'عرض النتيجة النهائية'}</span>
                          <span>←</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Results & Celebration Card */
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-3 border-amber-300 text-center animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-linear-to-tr from-amber-400 to-rose-400 text-white mx-auto flex items-center justify-center shadow-lg mb-4">
                <Trophy className="w-10 h-10 animate-bounce" />
              </div>

              <h2 className="text-3xl font-black text-stone-900 font-cairo mb-2">
                تهانينا يا بطل سحر الكلام! 🎉
              </h2>
              <p className="text-stone-600 text-sm mb-6">
                لقد أنهيت تمرين «{activeExercise.title}» بنجاح!
              </p>

              {/* Score Display */}
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 max-w-sm mx-auto mb-6">
                <div className="text-4xl sm:text-5xl font-black text-rose-600 font-cairo mb-1">
                  {correctCount} / {totalQuestions}
                </div>
                <span className="text-xs font-bold text-stone-600">
                  النسبة المئوية: {scorePercentage}%
                </span>
                <p className="text-xs font-semibold text-emerald-800 mt-2">
                  {scorePercentage >= 80 ? '🌟 أداء ممتاز ومبهر!' : scorePercentage >= 50 ? '👏 جيد جداً، واصل التألق!' : '💪 لا بأس، أعد المحاولة وستتفوق!'}
                </p>
              </div>

              {/* Certificate Input */}
              {!showCertificate ? (
                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      اكتب اسمك لاستخراج شهادة التفوق الخاصة بك:
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="اسم التلميذ(ة)..."
                      className="w-full px-4 py-2.5 text-center text-sm font-bold bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setShowCertificate(true)}
                      className="px-6 py-2.5 bg-linear-to-r from-amber-500 to-rose-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md hover:scale-105 transition"
                    >
                      📜 عرض شهادة التفوق
                    </button>
                    <button
                      onClick={() => handleStartExercise(activeExercise)}
                      className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm rounded-xl transition"
                    >
                      إعادة التمرين
                    </button>
                  </div>
                </div>
              ) : (
                /* The Certificate Template */
                <div className="p-8 bg-linear-to-b from-amber-50/80 to-white rounded-3xl border-4 border-amber-300 shadow-2xl relative overflow-hidden text-center max-w-xl mx-auto my-6 print:border-none">
                  <div className="border-2 border-dashed border-amber-400 p-6 rounded-2xl">
                    <div className="text-2xl font-black text-rose-600 font-cairo mb-1">
                      سحر الكلام
                    </div>
                    <div className="text-xs text-stone-500 font-bold mb-4">
                      شهادة تميز وتفوق في التعبير اللغوي
                    </div>

                    <p className="text-xs text-stone-600 mb-2">يشهد فريق منصة سحر الكلام بأن التلميذ(ة) المتميز(ة):</p>
                    <div className="text-2xl font-black text-stone-900 font-cairo underline decoration-amber-400 decoration-wavy my-2">
                      {studentName || 'التلميذ المبدع'}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      قد اجتاز بنجاح واقتدار تمرين «{activeExercise.title}» بنتيجة مشرفة قدرها: <strong className="text-rose-600">{scorePercentage}%</strong>، ونتمنى له مزيداً من الفصاحة والتميز.
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-amber-200 text-[11px] text-stone-500 font-bold">
                      <span>الجمهورية الجزائرية الديمقراطية الشعبية</span>
                      <span>ختم منصة سحر الكلام ✍️</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>طباعة الشهادة</span>
                    </button>
                    <button
                      onClick={() => setShowCertificate(false)}
                      className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold transition"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Exercises List with Filters */
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-cairo">
                  بنك التمارين والاختبارات التفاعلية
                </h1>
                <p className="text-stone-600 text-xs sm:text-sm mt-1">
                  اختر الطور والسنة واختبر قدراتك مع التصحيح الفوري وشرح كل سؤال
                </p>
              </div>

              {/* Stage Filter */}
              <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl self-start">
                {[
                  { id: 'primary' as const, name: 'الابتدائي' },
                  { id: 'middle' as const, name: 'المتوسط' },
                  { id: 'secondary' as const, name: 'الثانوي' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setFilterStage(s.id);
                      setFilterGradeId('all');
                      onSelectStage(s.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      filterStage === s.id
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade Year Filter */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-500">تصفية حسب السنة:</span>
              <button
                onClick={() => setFilterGradeId('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterGradeId === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                جميع السنوات
              </button>
              {filteredGrades.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setFilterGradeId(g.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    filterGradeId === g.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {g.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Exercises Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((ex) => {
              const grade = gradeYears.find((g) => g.id === ex.gradeYearId);
              return (
                <div
                  key={ex.id}
                  onClick={() => handleStartExercise(ex)}
                  className="bg-white rounded-3xl p-6 border-2 border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {grade?.shortName || 'مستوى تعليمي'}
                      </span>
                      <span className="text-xs text-stone-500 font-semibold">
                        {ex.questions.length} أسئلة
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-stone-900 font-cairo mb-2 group-hover:text-rose-600 transition">
                      {ex.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                      {ex.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-rose-600">
                    <span>بدء الاختبار الفوري</span>
                    <span className="group-hover:translate-x-[-4px] transition-transform">←</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Generator Box */}
          <div className="bg-linear-to-r from-purple-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-purple-500/30">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>توليد تمارين لا نهائية</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-cairo">
                تريد تمارين إضافية مخصصة لدرس معين؟
              </h3>
              <p className="text-xs sm:text-sm text-purple-200 mt-1">
                اطلب من المساعد الذكي إنشاء تمرين تفاعلي بالخيارات المتعددة أو ترتيب الجمل وفق مستواك الدراسي!
              </p>
            </div>
            <button
              onClick={() => onOpenAiGenerator(filterStage, filterGradeId)}
              className="px-6 py-3 bg-linear-to-r from-amber-400 to-rose-400 text-stone-950 font-black rounded-xl text-xs sm:text-sm hover:scale-105 transition shrink-0"
            >
              توليد تمرين بالذكاء الاصطناعي
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
