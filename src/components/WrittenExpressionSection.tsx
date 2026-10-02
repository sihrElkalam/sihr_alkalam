import React, { useState } from 'react';
import { INITIAL_ESSAY_MODELS } from '../data/curriculumData';
import { EssayModel } from '../types';
import {
  PenTool,
  BookOpen,
  Sparkles,
  CheckCircle2,
  BookmarkCheck,
  HelpCircle,
  Award,
  Layers,
  FileText,
  Copy,
  Check,
  Send,
  Wand2,
} from 'lucide-react';

interface WrittenExpressionSectionProps {
  onOpenAiToCorrect: (text: string, topic: string) => void;
  onOpenAiToBrainstorm: (topic: string) => void;
}

export const WrittenExpressionSection: React.FC<WrittenExpressionSectionProps> = ({
  onOpenAiToCorrect,
  onOpenAiToBrainstorm,
}) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'connectors' | 'punctuation' | 'models' | 'writing_lab'>('structure');
  const [selectedModel, setSelectedModel] = useState<EssayModel>(INITIAL_ESSAY_MODELS[0]);
  const [copied, setCopied] = useState(false);

  // Writing Lab State
  const [labTopic, setLabTopic] = useState('');
  const [labText, setLabText] = useState('');
  const [labStage, setLabStage] = useState('ابتدائي');

  const wordCount = labText.trim() ? labText.trim().split(/\s+/).length : 0;
  const sentenceCount = labText.trim() ? (labText.match(/[.!?،؛]/g) || []).length : 0;

  const handleCopyModel = () => {
    const full = `${selectedModel.title}\n\nالمقدمة:\n${selectedModel.introduction}\n\nالعرض:\n${selectedModel.body}\n\nالخاتمة:\n${selectedModel.conclusion}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-rose-500 via-pink-600 to-amber-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3 border border-white/30">
            <PenTool className="w-3.5 h-3.5 text-amber-200" />
            <span>الفصل الدراسي الثاني • هندسة النص والإبداع الكتابي</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-cairo mb-4 leading-tight">
            قسم التعبير الكتابي (سحر القلم)
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6">
            تعلم كيف تبني موضوعك التعبيري من المقدمة المشوقة إلى العرض المتماسك والخاتمة المؤثرة، مع بنك الروابط اللغوية، وقواعد علامات الترقيم، ومختبر الكتابة والتصحيح الآلي.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('writing_lab')}
              className="px-5 py-2.5 bg-white text-stone-900 hover:bg-amber-50 rounded-xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4 text-rose-600" />
              <span>دخول مختبر الكتابة والتصحيح الفوري</span>
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className="px-5 py-2.5 bg-stone-900/40 hover:bg-stone-900/60 text-white rounded-xl text-xs sm:text-sm font-bold border border-white/30 transition"
            >
              نماذج تعبير جاهزة ومحلولة
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {[
          { id: 'structure', label: 'كيفية بناء الموضوع', icon: Layers },
          { id: 'connectors', label: 'بنك أدوات الربط', icon: BookmarkCheck },
          { id: 'punctuation', label: 'استعمال علامات الترقيم', icon: HelpCircle },
          { id: 'models', label: 'نماذج تطبيقية محلولة', icon: FileText },
          { id: 'writing_lab', label: 'مختبر الكتابة والتصحيح', icon: Wand2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-rose-50 border border-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Structure */}
      {activeTab === 'structure' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <span className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl">
              📐
            </span>
            <div>
              <h2 className="text-2xl font-black text-stone-900 font-cairo">
                هندسة الموضوع التعبيري (التصميم الثلاثي)
              </h2>
              <p className="text-xs text-stone-500">
                القاعدة الذهبية التي يعتمدها مصححو اللغة العربية في الجزائر
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Introduction */}
            <div className="bg-amber-50/70 p-6 rounded-3xl border-2 border-amber-200 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-black text-sm flex items-center justify-center mb-3">
                  ١
                </span>
                <h3 className="text-xl font-black text-amber-950 font-cairo mb-2">
                  المقدمة (المدخل والتشويق)
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                  تمهيد قصير وموجز (سطران إلى ثلاثة). تبدأ بترك بياض في أول السطر. تعرّف بالموضوع بوجه عام، وتختم بسؤال إشكالي يشوّق القارئ لقراءة العرض.
                </p>
                <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-stone-600">
                  <strong>نصيحة:</strong> لا تدخل في التفاصيل داخل المقدمة، بل افتح الشهية فقط!
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="bg-rose-50/70 p-6 rounded-3xl border-2 border-rose-200 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-rose-500 text-white font-black text-sm flex items-center justify-center mb-3">
                  ٢
                </span>
                <h3 className="text-xl font-black text-rose-950 font-cairo mb-2">
                  العرض (صلب الموضوع والأفكار)
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                  هو الجزء الأكبر والأهم في التعبير (من 5 إلى 8 أسطر). تجيب فيه عن كل عناصر التعليمة. تقسمه إلى فقرات صغيرة تبدأ كل منها ببياض، وتربط بينها بأدوات الربط.
                </p>
                <div className="bg-white p-3 rounded-xl border border-rose-200 text-xs text-stone-600">
                  <strong>نصيحة:</strong> ادعم أفكارك بأمثلة واقعية وبراهين مقنعة.
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-emerald-50/70 p-6 rounded-3xl border-2 border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center mb-3">
                  ٣
                </span>
                <h3 className="text-xl font-black text-emerald-950 font-cairo mb-2">
                  الخاتمة (الخلاصة والمسك)
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                  مسك الختام (سطران أو ثلاثة). تلخص فيها النتيجة، أو تقدم نصيحة ودعوة للعمل، وتتوجها بشاهد رائع (آية، حديث نبوي، أو بيت شعر جزائري).
                </p>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs text-stone-600">
                  <strong>نصيحة:</strong> الشاهد هو التاج الذي يرفع علامتك إلى أقصى حد!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Connectors */}
      {activeTab === 'connectors' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              🔗
            </span>
            <div>
              <h2 className="text-2xl font-black text-stone-900 font-cairo">
                بنك أدوات الربط اللغوي (صانعات الانسجام)
              </h2>
              <p className="text-xs text-stone-500">
                استعن بهذه الأدوات لجعل تعبيرك يتدفق كنهر عذب دون ركاكة أو انقطاع
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-900 mb-2 text-sm sm:text-base flex items-center gap-2">
                <span className="text-amber-500 font-black">✦</span>
                <span>أدوات البدء والاستهلال:</span>
              </h4>
              <p className="text-xs text-stone-500 mb-3">تستخدم في مطلع الموضوع أو الفقرة الأولى.</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['بادئ ذي بدء', 'في بادئ الأمر', 'مما لا ريب فيه', 'استهلالاً للحديث', 'من المعلوم أن'].map((w, i) => (
                  <span key={i} className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 font-bold text-amber-800">
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-900 mb-2 text-sm sm:text-base flex items-center gap-2">
                <span className="text-emerald-500 font-black">✦</span>
                <span>أدوات الإضافة والتوسيع:</span>
              </h4>
              <p className="text-xs text-stone-500 mb-3">تستخدم لإضافة فكرة ثانية تدعم الفكرة السابقة.</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['علاوة على ذلك', 'فضلاً عن ذلك', 'كما يجدر التنويه بأن', 'أضف إلى هذا', 'بالإضافة إلى'].map((w, i) => (
                  <span key={i} className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 font-bold text-emerald-800">
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-900 mb-2 text-sm sm:text-base flex items-center gap-2">
                <span className="text-rose-500 font-black">✦</span>
                <span>أدوات التعليل والسببية:</span>
              </h4>
              <p className="text-xs text-stone-500 mb-3">تستخدم لبيان السبب والحجة والبرهان.</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['نظراً لكونه...', 'بما أنّ...', 'ذلك أنّ...', 'بحكم أنّ...', 'إذ إنّ...', 'لعلة مفادها'].map((w, i) => (
                  <span key={i} className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 font-bold text-rose-800">
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-900 mb-2 text-sm sm:text-base flex items-center gap-2">
                <span className="text-indigo-500 font-black">✦</span>
                <span>أدوات الاستدراك والمعارضة:</span>
              </h4>
              <p className="text-xs text-stone-500 mb-3">تستخدم لعرض الرأي المخالف أو التراجع بحكمة.</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['غير أنّ...', 'بيد أنّ...', 'على النقيض من ذلك', 'مع ذلك فإنّ', 'لكنْ'].map((w, i) => (
                  <span key={i} className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 font-bold text-indigo-800">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Punctuation */}
      {activeTab === 'punctuation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <span className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl">
              ✍️
            </span>
            <div>
              <h2 className="text-2xl font-black text-stone-900 font-cairo">
                علامات الترقيم واستعمالاتها الصحيحة
              </h2>
              <p className="text-xs text-stone-500">
                إشارات المرور التي تنظم سير القراءة وتمنح النص تنغيمه المطلوب
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                mark: 'الفاصلة (،)',
                usage: 'تفصل بين الجمل القصيرة المتعاطفة، وبعد المنادى (يا بني، استمع لمعلمك).',
                example: 'العلم نافع، والجهل ضار.',
              },
              {
                mark: 'النقطة (.)',
                usage: 'توضع في نهاية كل جملة تامة المعنى وعند ختام كل فقرة تماماً.',
                example: 'انتصر الحق وزهق الباطل.',
              },
              {
                mark: 'النقطتان الرأسيتان (:)',
                usage: 'توضعان بعد أفعال القول، وقبل الشرح والتقسيم والتفصيل.',
                example: 'قال المعلم: العلم نور.',
              },
              {
                mark: 'علامة الاستفهام (؟)',
                usage: 'توضع عند نهاية كل جملة استفهامية تبدأ بأداة سؤال.',
                example: 'كيف تصنع من الفكرة إبداعاً؟',
              },
              {
                mark: 'علامة التعجب (!)',
                usage: 'توضع عند نهاية جمل الدهشة، الإعجاب، التعجب، والحزن أو الفرح الشديد.',
                example: 'ما أروع ريف الجزائر في الربيع!',
              },
              {
                mark: 'المزدوجتان (« »)',
                usage: 'توضعان لحصر الكلام المنقول بحرفه (الآيات القرآنية والأحاديث الشريفة).',
                example: 'قال النبي ﷺ: «إنما الأعمال بالنيات».',
              },
            ].map((punc, idx) => (
              <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="inline-block px-3 py-1 bg-white rounded-lg border border-stone-200 font-black text-rose-600 text-sm mb-2">
                  {punc.mark}
                </span>
                <p className="text-xs text-stone-700 leading-relaxed mb-2">
                  {punc.usage}
                </p>
                <div className="bg-amber-50/70 p-2 rounded-lg text-xs text-amber-900 font-medium">
                  <strong>مثال: </strong>{punc.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Models */}
      {activeTab === 'models' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-2xl font-black text-stone-900 font-cairo">
                نماذج وضعيات إدماجية محلولة وفق المنهاج
              </h2>
              <p className="text-xs text-stone-500">
                نصوص نموذجية معللة ومحللة لجميع أنماط النصوص المقررة
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {INITIAL_ESSAY_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedModel.id === m.id
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  نمط {m.patternType} ({m.stageId === 'primary' ? 'ابتدائي' : m.stageId === 'middle' ? 'متوسط' : 'ثانوي'})
                </button>
              ))}
            </div>
          </div>

          <div className="bg-linear-to-b from-stone-50 to-amber-50/20 p-6 rounded-3xl border border-stone-200 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  نمط النص: {selectedModel.patternType}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-cairo mt-1">
                  {selectedModel.title}
                </h3>
              </div>
              <button
                onClick={handleCopyModel}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ الموضوع'}</span>
              </button>
            </div>

            {/* Situation */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700">
              <span className="font-bold text-rose-700">الوضعية الإدماجية والتعليمة: </span>
              {selectedModel.situation}
            </div>

            {/* Model text with distinct paragraphs */}
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200 font-tajawal text-sm sm:text-base leading-relaxed text-stone-900">
              <div className="pb-3 border-b border-stone-100">
                <span className="text-xs font-black text-amber-700 block mb-1">المقدمة:</span>
                <p className="whitespace-pre-line">{selectedModel.introduction}</p>
              </div>

              <div className="pb-3 border-b border-stone-100">
                <span className="text-xs font-black text-rose-700 block mb-1">العرض:</span>
                <p className="whitespace-pre-line">{selectedModel.body}</p>
              </div>

              <div>
                <span className="text-xs font-black text-emerald-700 block mb-1">الخاتمة:</span>
                <p className="whitespace-pre-line">{selectedModel.conclusion}</p>
              </div>
            </div>

            {/* Analysis Points */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
              <h4 className="font-bold text-emerald-950 text-xs mb-2">
                لماذا يستحق هذا الموضوع العلامة الكاملة؟ (شبكة التقييم):
              </h4>
              <ul className="space-y-1 text-xs text-stone-700">
                {selectedModel.analysisPoints.map((pt, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Writing Lab */}
      {activeTab === 'writing_lab' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>ميزة الذكاء الاصطناعي لسحر الكلام</span>
              </div>
              <h2 className="text-2xl font-black text-stone-900 font-cairo">
                مختبر الكتابة والتصحيح الفوري
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">اختر طورك:</span>
              {['ابتدائي', 'متوسط', 'ثانوي'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLabStage(lvl)}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    labStage === lvl ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                عنوان الموضوع أو الوضعية التعبيرية:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={labTopic}
                  onChange={(e) => setLabTopic(e.target.value)}
                  placeholder="مثال: رحلة إلى شاطئ جيجل، أو أهمية التعاون المدرسي، أو واجبنا نحو الوطن..."
                  className="flex-1 px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
                />
                <button
                  onClick={() => onOpenAiToBrainstorm(labTopic || 'موضوع تعبير جديد')}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
                  title="اطلب من الذكاء الاصطناعي اقتراح أفكار ورصيد لغوي لهذا العنوان"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>اقتراح أفكار</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">
                  اكتب فقرتك أو موضوعك هنا:
                </label>
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span>الكلمات: <strong className="text-stone-800">{wordCount}</strong></span>
                  <span>الجمل وعلامات الوقف: <strong className="text-stone-800">{sentenceCount}</strong></span>
                </div>
              </div>
              <textarea
                value={labText}
                onChange={(e) => setLabText(e.target.value)}
                rows={8}
                placeholder="اترك بياضاً في البداية، وابدأ بمقدمة لطيفة، ثم العرض والخاتمة... اضغط بعد الانتهاء على زر التصحيح الفوري ليقوم المساعد الذكي بفحص نصوصك وإعطائك نصائح محددة!"
                className="w-full p-4 text-sm sm:text-base leading-relaxed bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white font-tajawal"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="text-xs text-stone-500">
                ✨ سيقوم المساعد الذكي بتصحيح الأخطاء النحوية والإملائية وتزويدك بنسخة محسنة مع الشرح.
              </span>
              <button
                onClick={() => onOpenAiToCorrect(labText, labTopic)}
                disabled={!labText.trim()}
                className={`px-8 py-3.5 rounded-2xl text-sm font-black transition flex items-center gap-2 shadow-md ${
                  labText.trim()
                    ? 'bg-linear-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white cursor-pointer transform hover:scale-102'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>تصحيح موضوعي بالمساعد الذكي الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
