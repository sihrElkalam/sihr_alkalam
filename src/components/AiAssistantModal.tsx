import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Wand2,
  BookOpen,
  Mic,
  PenTool,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAction?: 'explain' | 'correct_text' | 'generate_ideas' | 'oral_practice' | 'create_exercise';
  initialPrompt?: string;
  initialTopic?: string;
  initialText?: string;
  initialLevel?: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialAction = 'explain',
  initialPrompt = '',
  initialTopic = '',
  initialText = '',
  initialLevel = 'الابتدائي',
}) => {
  const [action, setAction] = useState<
    'explain' | 'correct_text' | 'generate_ideas' | 'oral_practice' | 'create_exercise'
  >(initialAction);
  const [studentLevel, setStudentLevel] = useState<string>(initialLevel);
  const [topic, setTopic] = useState<string>(initialTopic);
  const [userText, setUserText] = useState<string>(initialText);
  const [prompt, setPrompt] = useState<string>(initialPrompt);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialAction) setAction(initialAction);
    if (initialPrompt) setPrompt(initialPrompt);
    if (initialTopic) setTopic(initialTopic);
    if (initialText) setUserText(initialText);
    if (initialLevel) setStudentLevel(initialLevel);
  }, [initialAction, initialPrompt, initialTopic, initialText, initialLevel]);

  if (!isOpen) return null;

  const handleAskAssistant = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          prompt,
          studentLevel,
          topic,
          userText,
        }),
      });
      const data = await res.json();
      if (data.response) {
        setResponse(data.response);
      } else {
        setResponse('حدث خطأ أثناء إعداد الإجابة. يرجى المحاولة مجدداً.');
      }
    } catch (e) {
      setResponse('تعذر الاتصال بالخادم. تأكد من اتصال الإنترنت ثم حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border-2 border-purple-200 animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-purple-600 to-rose-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-black text-stone-900 font-cairo">
                  المساعد الذكي لسحر الكلام
                </h3>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                  معلمك الخبير
                </span>
              </div>
              <p className="text-xs text-stone-500">
                شرح الدروس • تصحيح التعبير اللغوي • اقتراح أفكار • تدريب شفهي
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

        {/* Action Modes Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-stone-100 shrink-0 scrollbar-none">
          {[
            { id: 'explain', label: 'شرح وتبسيط درس', icon: BookOpen },
            { id: 'correct_text', label: 'تصحيح الأخطاء اللغوية', icon: PenTool },
            { id: 'generate_ideas', label: 'اقتراح أفكار لموضوع', icon: Wand2 },
            { id: 'oral_practice', label: 'تدريب على التعبير الشفهي', icon: Mic },
            { id: 'create_exercise', label: 'توليد تمرين مخصص', icon: HelpCircle },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = action === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setAction(mode.id as any);
                  setResponse(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body & Inputs */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          {/* Level Selector */}
          <div className="flex items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-xs font-bold text-stone-700">مستوى التلميذ:</span>
            <div className="flex items-center gap-1.5 text-xs">
              {['الطور الابتدائي', 'الطور المتوسط', 'الطور الثانوي'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setStudentLevel(lvl)}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    studentLevel === lvl ? 'bg-purple-600 text-white' : 'bg-white text-stone-600 border border-stone-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional inputs based on action */}
          {action === 'correct_text' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  عنوان الموضوع أو الوضعية (اختياري):
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="مثال: رحلة إلى الريف، أو حملة النظافة..."
                  className="w-full px-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  نص التلميذ المراد تصحيحه وشرح أخطائه:
                </label>
                <textarea
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  rows={5}
                  placeholder="اكتب أو الصق نص التلميذ هنا، وسيقوم المساعد بفحص الأخطاء الإملائية، النحوية، والتركيبية وتبرير سبب كل تصحيح..."
                  className="w-full p-4 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-tajawal"
                />
              </div>
            </div>
          )}

          {action === 'generate_ideas' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                عنوان الموضوع التعبيري المطلوب:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثال: أثر العلم والأخلاق في تقدم الجزائر، أو التضامن مع المحتاجين..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          )}

          {(action === 'explain' || action === 'oral_practice' || action === 'create_exercise') && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {action === 'explain' && 'ما هو الدرس أو القاعدة التي تريد شرحها؟'}
                {action === 'oral_practice' && 'ما هو الموضوع الذي تريد تدريب التلميذ على التحدث عنه؟'}
                {action === 'create_exercise' && 'حول أي موضوع أو قاعدة تريد إنشاء تمرين؟'}
              </label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  action === 'explain'
                    ? 'مثال: علامات الترقيم، أو النمط الحجاجي، أو كيف أكتب خاتمة...'
                    : action === 'oral_practice'
                    ? 'مثال: أهمية القراءة، أو حماية الغابات من الحرائق...'
                    : 'مثال: أدوات الربط، أو ترتيب أحداث قصة...'
                }
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          )}

          {/* Submit Action Button */}
          <button
            onClick={handleAskAssistant}
            disabled={loading || (action === 'correct_text' ? !userText.trim() : action === 'generate_ideas' ? !topic.trim() : !prompt.trim())}
            className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 shadow-md ${
              loading || (action === 'correct_text' ? !userText.trim() : action === 'generate_ideas' ? !topic.trim() : !prompt.trim())
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-linear-to-r from-purple-600 via-indigo-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white cursor-pointer'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>المساعد الذكي يفكر ويصوغ الإجابة التربوية...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>طلب الإجابة من المساعد الذكي</span>
              </>
            )}
          </button>

          {/* Response Output Box */}
          {response && (
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-purple-200/60">
                <span className="font-bold text-xs text-purple-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>إجابة المساعد الذكي:</span>
                </span>
                <button
                  onClick={handleCopyResponse}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white border border-purple-200 hover:bg-purple-100 rounded-lg text-xs font-semibold text-purple-800 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ الإجابة'}</span>
                </button>
              </div>

              <div className="text-xs sm:text-sm text-stone-800 leading-relaxed font-tajawal whitespace-pre-line bg-white p-4 rounded-xl border border-purple-100 shadow-inner">
                {response}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
