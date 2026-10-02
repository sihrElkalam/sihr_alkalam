import React, { useState } from 'react';
import { StageId, TermId, Lesson, Exercise, ResourceItem, GradeYear } from '../types';
import { StorageService } from '../services/storageService';
import {
  PlusCircle,
  X,
  BookOpen,
  Award,
  FolderDown,
  Layers,
  Save,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface ContentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeYears: GradeYear[];
  onRefreshData: () => void;
}

export const ContentManagerModal: React.FC<ContentManagerModalProps> = ({
  isOpen,
  onClose,
  gradeYears,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'add_lesson' | 'add_exercise' | 'add_resource' | 'add_grade' | 'backup'>('add_lesson');
  const [successMsg, setSuccessMsg] = useState('');

  // Lesson Form State
  const [lessonStage, setLessonStage] = useState<StageId>('primary');
  const [lessonGrade, setLessonGrade] = useState<string>('1ap');
  const [lessonTerm, setLessonTerm] = useState<TermId>('term1');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSubtitle, setLessonSubtitle] = useState('');
  const [lessonObjectives, setLessonObjectives] = useState('');
  const [lessonSummary, setLessonSummary] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonRules, setLessonRules] = useState('');
  const [lessonAudioText, setLessonAudioText] = useState('');

  // Exercise Form State
  const [exStage, setExStage] = useState<StageId>('primary');
  const [exGrade, setExGrade] = useState<string>('1ap');
  const [exTitle, setExTitle] = useState('');
  const [exDesc, setExDesc] = useState('');
  const [exQuestionPrompt, setExQuestionPrompt] = useState('');
  const [exQuestionType, setExQuestionType] = useState<'mcq' | 'true_false'>('mcq');
  const [exOptions, setExOptions] = useState('');
  const [exCorrectAnswer, setExCorrectAnswer] = useState('');
  const [exExplanation, setExExplanation] = useState('');

  // Resource Form State
  const [resStage, setResStage] = useState<StageId>('primary');
  const [resTitle, setResTitle] = useState('');
  const [resCategory, setResCategory] = useState<'worksheet' | 'mindmap' | 'video' | 'model'>('worksheet');
  const [resDescription, setResDescription] = useState('');
  const [resContent, setResContent] = useState('');

  // Grade Form State
  const [newGradeStage, setNewGradeStage] = useState<StageId>('primary');
  const [newGradeName, setNewGradeName] = useState('');
  const [newGradeShort, setNewGradeShort] = useState('');
  const [newGradeDesc, setNewGradeDesc] = useState('');

  // Backup State
  const [importJsonText, setImportJsonText] = useState('');

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    const newLesson: Lesson = {
      id: `custom-les-${Date.now()}`,
      stageId: lessonStage,
      gradeYearId: lessonGrade,
      term: lessonTerm,
      category: lessonTerm === 'term1' ? 'oral' : 'written',
      title: lessonTitle.trim(),
      subtitle: lessonSubtitle.trim() || `${lessonTerm === 'term1' ? 'الفصل الأول: تعبير شفهي' : 'الفصل الثاني: تعبير كتابي'}`,
      objectives: lessonObjectives.split('\n').filter((o) => o.trim()),
      summary: lessonSummary.trim(),
      content: lessonContent.trim(),
      rules: lessonRules.split('\n').filter((r) => r.trim()),
      examples: [],
      audioSampleText: lessonAudioText.trim() || undefined,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    StorageService.saveLesson(newLesson);
    onRefreshData();
    showNotification('✅ تم حفظ الدرس الجديد وإضافته إلى المنصة بنجاح!');

    // Reset form
    setLessonTitle('');
    setLessonSubtitle('');
    setLessonObjectives('');
    setLessonSummary('');
    setLessonContent('');
    setLessonRules('');
    setLessonAudioText('');
  };

  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exTitle.trim() || !exQuestionPrompt.trim()) return;

    const question = {
      id: `q-${Date.now()}`,
      type: exQuestionType,
      prompt: exQuestionPrompt.trim(),
      options: exQuestionType === 'mcq' ? exOptions.split(',').map((o) => o.trim()) : undefined,
      correctAnswer: exCorrectAnswer.trim(),
      explanation: exExplanation.trim() || 'إجابة صحيحة وفق قواعد الدرس.',
    };

    const newExercise: Exercise = {
      id: `custom-ex-${Date.now()}`,
      stageId: exStage,
      gradeYearId: exGrade,
      title: exTitle.trim(),
      description: exDesc.trim(),
      category: 'written',
      questions: [question],
      isCustom: true,
    };

    StorageService.saveExercise(newExercise);
    onRefreshData();
    showNotification('✅ تم حفظ التمرين الجديد بنجاح!');

    setExTitle('');
    setExDesc('');
    setExQuestionPrompt('');
    setExOptions('');
    setExCorrectAnswer('');
    setExExplanation('');
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    const newRes: ResourceItem = {
      id: `custom-res-${Date.now()}`,
      stageId: resStage,
      title: resTitle.trim(),
      category: resCategory,
      description: resDescription.trim(),
      downloadable: true,
      contentSnippet: resContent.trim(),
      pdfPrintData: {
        header: resTitle.trim(),
        instructions: resDescription.trim(),
        body: resContent.trim(),
        exerciseBox: 'تطبيق التلميذ: أنجز المطلوب بخط واضح وجميل.',
      },
      isCustom: true,
    };

    StorageService.saveResource(newRes);
    onRefreshData();
    showNotification('✅ تم حفظ المورد التعليمي الجديد!');

    setResTitle('');
    setResDescription('');
    setResContent('');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGradeName.trim()) return;

    const newGrade: GradeYear = {
      id: `grade-${Date.now()}`,
      stageId: newGradeStage,
      name: newGradeName.trim(),
      shortName: newGradeShort.trim() || newGradeName.trim(),
      order: 99,
      description: newGradeDesc.trim(),
    };

    StorageService.saveGradeYear(newGrade);
    onRefreshData();
    showNotification('✅ تمت إضافة السنة الدراسية الجديدة!');

    setNewGradeName('');
    setNewGradeShort('');
    setNewGradeDesc('');
  };

  const handleExport = () => {
    const data = StorageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sihr-al-kalam-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showNotification('📥 تم تنزيل نسخة احتياطية من جميع دروسك وتمارينك!');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = StorageService.importData(importJsonText);
    if (ok) {
      onRefreshData();
      showNotification('✅ تم استيراد البيانات وتحديث المنصة بنجاح!');
      setImportJsonText('');
    } else {
      alert('خطأ في صيغة ملف JSON. تأكد من صحة البيانات.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border-2 border-emerald-300 animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-stone-900 font-cairo">
                إدارة المحتوى وتطوير المنصة (لوحة الأستاذ)
              </h3>
              <p className="text-xs text-stone-500">
                أضف دروسك الخاصة، تمارينك، أوراق عمل، أو سنوات دراسية جديدة تدريجياً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="my-2 p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-stone-100 shrink-0 scrollbar-none">
          {[
            { id: 'add_lesson', label: 'إضافة درس جديد', icon: BookOpen },
            { id: 'add_exercise', label: 'إضافة تمرين أو اختبار', icon: Award },
            { id: 'add_resource', label: 'إضافة ورقة عمل / PDF', icon: FolderDown },
            { id: 'add_grade', label: 'إضافة سنة دراسية', icon: Layers },
            { id: 'backup', label: 'النسخ الاحتياطي والاستيراد', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          {/* Add Lesson Form */}
          {activeTab === 'add_lesson' && (
            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الطور التعليمي:</label>
                  <select
                    value={lessonStage}
                    onChange={(e) => {
                      const st = e.target.value as StageId;
                      setLessonStage(st);
                      const f = gradeYears.find((g) => g.stageId === st);
                      if (f) setLessonGrade(f.id);
                    }}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="primary">الطور الابتدائي</option>
                    <option value="middle">الطور المتوسط</option>
                    <option value="secondary">الطور الثانوي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">السنة الدراسية:</label>
                  <select
                    value={lessonGrade}
                    onChange={(e) => setLessonGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    {gradeYears.filter((g) => g.stageId === lessonStage).map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الفصل الدراسي:</label>
                  <select
                    value={lessonTerm}
                    onChange={(e) => setLessonTerm(e.target.value as TermId)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="term1">الفصل الأول (تعبير شفهي)</option>
                    <option value="term2">الفصل الثاني (تعبير كتابي)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">عنوان الدرس الجديد *:</label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="مثال: كيفية صياغة جملة افتتاحية جذابة..."
                  className="w-full px-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">ملخص الدرس التمهيدي:</label>
                <input
                  type="text"
                  value={lessonSummary}
                  onChange={(e) => setLessonSummary(e.target.value)}
                  placeholder="فكرة عامة عن أهمية هذا الدرس للتلميذ..."
                  className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">أهداف التعلم (سطر لكل هدف):</label>
                <textarea
                  value={lessonObjectives}
                  onChange={(e) => setLessonObjectives(e.target.value)}
                  rows={2}
                  placeholder="الهدف الأول...&#10;الهدف الثاني..."
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">محتوى وشرح الدرس بالتفصيل *:</label>
                <textarea
                  required
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  rows={6}
                  placeholder="اكتب شرح الدرس باللغة العربية الواضحة بأسلوب تربوي ممتع..."
                  className="w-full p-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl font-tajawal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">قواعد ووصايا ذهبية (سطر لكل قاعدة):</label>
                <textarea
                  value={lessonRules}
                  onChange={(e) => setLessonRules(e.target.value)}
                  rows={2}
                  placeholder="القاعدة الأولى...&#10;القاعدة الثانية..."
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">نص تدريبي للقراءة الصوتية التفاعلية:</label>
                <input
                  type="text"
                  value={lessonAudioText}
                  onChange={(e) => setLessonAudioText(e.target.value)}
                  placeholder="جملة أو فقرة نموذجية ليقرأها النظام صوتياً للتلميذ..."
                  className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ ونشر الدرس الجديد في المنصة</span>
              </button>
            </form>
          )}

          {/* Add Exercise Form */}
          {activeTab === 'add_exercise' && (
            <form onSubmit={handleSaveExercise} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الطور التعليمي:</label>
                  <select
                    value={exStage}
                    onChange={(e) => {
                      const st = e.target.value as StageId;
                      setExStage(st);
                      const f = gradeYears.find((g) => g.stageId === st);
                      if (f) setExGrade(f.id);
                    }}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="primary">الطور الابتدائي</option>
                    <option value="middle">الطور المتوسط</option>
                    <option value="secondary">الطور الثانوي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">السنة الدراسية:</label>
                  <select
                    value={exGrade}
                    onChange={(e) => setExGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    {gradeYears.filter((g) => g.stageId === exStage).map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">عنوان التمرين *:</label>
                <input
                  type="text"
                  required
                  value={exTitle}
                  onChange={(e) => setExTitle(e.target.value)}
                  placeholder="مثال: تدريب على اختيار علامات الترقيم..."
                  className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">نوع السؤال:</label>
                <select
                  value={exQuestionType}
                  onChange={(e) => setExQuestionType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="mcq">اختيار من متعدد (MCQ)</option>
                  <option value="true_false">صح أو خطأ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">نص السؤال *:</label>
                <input
                  type="text"
                  required
                  value={exQuestionPrompt}
                  onChange={(e) => setExQuestionPrompt(e.target.value)}
                  placeholder="مثال: أين نضع الفاصلة المنقوطة؟"
                  className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              {exQuestionType === 'mcq' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    الخيارات (مفصولة بفاصلة):
                  </label>
                  <input
                    type="text"
                    value={exOptions}
                    onChange={(e) => setExOptions(e.target.value)}
                    placeholder="بين جملتين إحداهما سبب للأخرى, في نهاية الكلام, بعد المنادى"
                    className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الإجابة الصحيحة بالضبط * (بالنسبة لصح أو خطأ اكتب: صح أو خطأ):
                </label>
                <input
                  type="text"
                  required
                  value={exCorrectAnswer}
                  onChange={(e) => setExCorrectAnswer(e.target.value)}
                  placeholder="الإجابة الصحيحة المطابقة تماماً..."
                  className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">التفسير والتعليل التربوي:</label>
                <input
                  type="text"
                  value={exExplanation}
                  onChange={(e) => setExExplanation(e.target.value)}
                  placeholder="شرح يظهر للتلميذ ليعرف سبب صحة الإجابة..."
                  className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التمرين الجديد</span>
              </button>
            </form>
          )}

          {/* Add Resource */}
          {activeTab === 'add_resource' && (
            <form onSubmit={handleSaveResource} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">الطور التعليمي:</label>
                  <select
                    value={resStage}
                    onChange={(e) => setResStage(e.target.value as StageId)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="primary">الطور الابتدائي</option>
                    <option value="middle">الطور المتوسط</option>
                    <option value="secondary">الطور الثانوي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">نوع المورد:</label>
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="worksheet">ورقة عمل قابلة للطباعة (Worksheet)</option>
                    <option value="mindmap">بطاقة أو خريطة ذهنية</option>
                    <option value="model">نموذج وضعية إدماجية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">عنوان المورد أو الوثيقة *:</label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="مثال: ورقة تدريب على النمط السردي..."
                  className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">وصف موجز:</label>
                <input
                  type="text"
                  value={resDescription}
                  onChange={(e) => setResDescription(e.target.value)}
                  placeholder="تعليمات التلميذ أو المعلم..."
                  className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">محتوى الوثيقة للطباعة *:</label>
                <textarea
                  required
                  value={resContent}
                  onChange={(e) => setResContent(e.target.value)}
                  rows={5}
                  placeholder="اكتب نص ورقة العمل أو البطاقة التي ستظهر في نموذج الطباعة والمعاينة..."
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl font-tajawal"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ المورد في حقيبة الوثائق</span>
              </button>
            </form>
          )}

          {/* Add Grade */}
          {activeTab === 'add_grade' && (
            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الطور التعليمي التابع له:</label>
                <select
                  value={newGradeStage}
                  onChange={(e) => setNewGradeStage(e.target.value as StageId)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="primary">الطور الابتدائي</option>
                  <option value="middle">الطور المتوسط</option>
                  <option value="secondary">الطور الثانوي</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">اسم السنة الدراسية *:</label>
                <input
                  type="text"
                  required
                  value={newGradeName}
                  onChange={(e) => setNewGradeName(e.target.value)}
                  placeholder="مثال: قسم التحضيري، أو 1 ثانوي علمي، أو 2 ثانوي لغات..."
                  className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الاسم المختصر:</label>
                <input
                  type="text"
                  value={newGradeShort}
                  onChange={(e) => setNewGradeShort(e.target.value)}
                  placeholder="مثال: تحضيري أو 1ثا ع"
                  className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">وصف السنة وأهدافها:</label>
                <input
                  type="text"
                  value={newGradeDesc}
                  onChange={(e) => setNewGradeDesc(e.target.value)}
                  placeholder="وصف مختصر لمقرر هذه السنة..."
                  className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ وإضافة السنة الدراسية</span>
              </button>
            </form>
          )}

          {/* Backup & Import */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">تنزيل نسخة احتياطية من الدروس (Export):</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  احفظ جميع ما أضفته من دروس وتمارين وموارد في ملف JSON آمن يمكنك نقله لأي جهاز أو استعادته في أي وقت.
                </p>
                <button
                  onClick={handleExport}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير ملف النسخة الاحتياطية (JSON)</span>
                </button>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">استيراد بيانات أو استعادة نسخة احتياطية (Import):</h4>
                <p className="text-xs text-stone-600">
                  الصق كود JSON الخاص بالدروس والتمارين ثم اضغط على زر الاستيراد:
                </p>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  rows={4}
                  placeholder='{"gradeYears": [...], "lessons": [...]}'
                  className="w-full p-3 text-xs bg-white border border-stone-200 rounded-xl font-mono"
                />
                <button
                  onClick={handleImport}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>استيراد وتحديث المنصة</span>
                </button>
              </div>

              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
                <h4 className="font-bold text-rose-900 text-xs mb-1">إعادة الضبط للمقرر الأساسي:</h4>
                <p className="text-xs text-stone-600 mb-3">
                  إذا أردت مسح التعديلات والعودة للبيانات الأصلية للموقع:
                </p>
                <button
                  onClick={() => {
                    if (confirm('هل أنت متأكد من العودة للمقرر الافتراضي ومسح التعديلات المحلية؟')) {
                      StorageService.resetToDefault();
                      onRefreshData();
                      showNotification('تمت استعادة البيانات الافتراضية.');
                    }
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة المحتوى الافتراضي</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
