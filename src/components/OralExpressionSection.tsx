import React, { useState, useRef, useEffect } from 'react';
import { ASSETS } from '../assets/images';
import { TTSService } from '../services/ttsService';
import {
  Mic,
  Volume2,
  Play,
  Square,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  MessageCircle,
  Eye,
  Smile,
  Flame,
  Lightbulb,
  Radio,
  BookOpen,
} from 'lucide-react';

interface OralExpressionSectionProps {
  onOpenAiAssistantWithTopic: (topic: string) => void;
}

export const OralExpressionSection: React.FC<OralExpressionSectionProps> = ({
  onOpenAiAssistantWithTopic,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<
    'definition' | 'techniques' | 'dialogue' | 'description' | 'narration' | 'debate' | 'picture_prompts' | 'recorder'
  >('definition');

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Audio Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Picture Prompts for Oral Practice
  const picturePrompts = [
    {
      id: 1,
      title: 'مشهد: ساحة المدرسة ولقاء الأصدقاء',
      level: 'الطور الابتدائي',
      imageUrl: ASSETS.primaryArt,
      guidingQuestions: [
        'ماذا ترى في الصورة؟ صف المكان بدقة.',
        'ما هي المشاعر التي تظهر على وجوه الأطفال والحيوانات اللطيفة؟',
        'لو كنت معهم في الساحة، ما هي اللعبة أو الكلمات التي ستبدأ بها؟',
      ],
      sampleSpeech: 'أرى في هذه الصورة ساحة مدرستنا الجميلة، حيث يلتقي التلاميذ والأصدقاء بابتسامة مشرقة. الكتب والأقلام تتناغم مع الحروف العربية أ، ب، ت، مما يدل على بهجة العلم وروح الصداقة التي تجمعنا كل صباح.',
    },
    {
      id: 2,
      title: 'مشهد: التحدث بطلاقة وشجاعة أدبية أمام القسم',
      level: 'الطور المتوسط',
      imageUrl: ASSETS.oralArt,
      guidingQuestions: [
        'صف لغة الجسد للمتحدث في الصورة (اليدين، العينين، الابتسامة).',
        'كيف تستعد قبل أن تقف أمام زملائك لإلقاء عرضك المدرسي؟',
        'ما هي العبارة الافتتاحية التي تجذب انتباه الحاضرين فوراً؟',
      ],
      sampleSpeech: 'المتحدث في الصورة يقف بكل ثقة واعتزاز، يشير بيده برفق لتوضيح فكرته، وتبدو على وجهه علامات الهدوء والتفاؤل. إنه مثال للتلميذ الجزائري الذي يتقن فن الخطابة والتعبير عن الرأي دون تردد أو خوف.',
    },
    {
      id: 3,
      title: 'مشهد: كتابة الأفكار وتحويلها إلى سحر كلام',
      level: 'الطور الثانوي',
      imageUrl: ASSETS.writtenArt,
      guidingQuestions: [
        'كيف ترتبط الأفكار التي في عقولنا بالكلمات التي ننطق بها؟',
        'لماذا يعتبر الاستماع الجيد نصف البلاغة في المناظرة والحوار؟',
      ],
      sampleSpeech: 'إن تحويل الأفكار إلى كلام بليغ يشبه سحر الكلمات؛ فالقلم المنير والمطالعة الواسعة يغذيان العقل بالحصيلة اللغوية الرصينة، مما يجعل التلميذ قادراً على صياغة الحجج والبراهين للدفاع عن قضاياه بأرقى مستويات الفصاحة.',
    },
  ];

  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const currentPrompt = picturePrompts[activePromptIndex];

  // Start recording voice practice
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('يرجى السماح بالوصول إلى الميكروفون لبدء تسجيل صوتك وتدريب نفسك على الإلقاء.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      TTSService.stop();
    };
  }, []);

  const handleSpeak = (text: string) => {
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
      {/* Hero Header */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3 border border-white/30">
            <Radio className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            <span>الفصل الدراسي الأول • أساس الفصاحة والشجاعة الأدبية</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-cairo mb-4 leading-tight">
            قسم التعبير الشفهي (سحر المنطوق)
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6">
            تعلم كيف ترتّب أفكارك قبل أن تنطق، وتتحدث بطلاقة ووضوح وثقة أمام زملائك وأساتذتك، مستعيناً بتقنيات الإلقاء، ولغة الجسد، والتمارين الصوتية التفاعلية.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedSubTab('picture_prompts')}
              className="px-5 py-2.5 bg-white text-stone-900 hover:bg-amber-50 rounded-xl text-xs sm:text-sm font-black shadow-md transition"
            >
              🖼️ «صف المشهد» (تعبير على الصور)
            </button>
            <button
              onClick={() => setSelectedSubTab('recorder')}
              className="px-5 py-2.5 bg-stone-900/40 hover:bg-stone-900/60 text-white rounded-xl text-xs sm:text-sm font-bold border border-white/30 transition flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-amber-300" />
              <span>مختبر التسجيل الصوتي الذاتي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {[
          { id: 'definition', label: 'مفهوم التعبير الشفهي', icon: BookOpen },
          { id: 'techniques', label: 'تقنيات التحدث والإلقاء', icon: Flame },
          { id: 'dialogue', label: 'آداب الحوار والمناقشة', icon: MessageCircle },
          { id: 'description', label: 'الوصف الشفهي', icon: Eye },
          { id: 'narration', label: 'السرد الشفهي', icon: Sparkles },
          { id: 'debate', label: 'إبداء الرأي والمناظرة', icon: Lightbulb },
          { id: 'picture_prompts', label: 'تعبير على المشاهد والصور', icon: Smile },
          { id: 'recorder', label: 'مختبر التسجيل والتقييم', icon: Mic },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab Contents */}
      {selectedSubTab === 'definition' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              💡
            </span>
            <div>
              <h2 className="text-2xl font-black text-stone-900 font-cairo">
                ما هو التعبير الشفهي؟
              </h2>
              <p className="text-xs text-stone-500">
                الركيزة الأولى للتواصل البشري وبناء الشخصية الواثقة
              </p>
            </div>
          </div>

          <div className="prose max-w-none text-stone-700 text-sm sm:text-base leading-relaxed space-y-4">
            <p>
              <strong>التعبير الشفهي</strong> هو قدرة التلميذ على نقل ما في عقله وقلبه من أفكار، ومعلومات، ومشاعر إلى الآخرين بواسطة <strong>الكلام المنطوق</strong> بلغة عربية فصيحة، واضحة، ومفهومة.
            </p>
            <p>
              في المنهاج الجزائري، لا يُقصد بالتعبير الشفهي مجرد الثرثرة أو ترديد ما هو محفوظ، بل هو عملية ذهنية متكاملة تتضمن:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1">١. التفكير والترتيب</h4>
                <p className="text-xs text-stone-600">تنظيم الفكرة في الذهن قبل أن ينطق بها اللسان لتخرج مترابطة.</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
                <h4 className="font-bold text-rose-900 mb-1">٢. النطق والبيان</h4>
                <p className="text-xs text-stone-600">إخراج الحروف من مخارجها الصحيحة وضبط نبرة الصوت وسرعة الكلام.</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-1">٣. التأثير والتفاعل</h4>
                <p className="text-xs text-stone-600">استخدام النظرات ولغة الجسد المناسبة لجذب السامعين وإقناعهم.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-semibold">
              «تكلّم حتى أراك» - الحكمة المشهورة لسقراط
            </span>
            <button
              onClick={() => onOpenAiAssistantWithTopic('كيف أتغلب على الخجل أثناء التعبير الشفهي أمام القسم؟')}
              className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>اسأل المساعد الذكي عن علاج الخجل</span>
            </button>
          </div>
        </div>
      )}

      {selectedSubTab === 'techniques' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xl">
              🎯
            </span>
            <div>
              <h2 className="text-2xl font-black text-stone-900 font-cairo">
                تقنيات التحدث والإلقاء أمام الجمهور
              </h2>
              <p className="text-xs text-stone-500">
                كيف تصبح متحدثاً لبقاً وخطيباً مفوهاً؟
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-900 flex items-center gap-2 mb-2">
                <Volume2 className="w-5 h-5 text-amber-600" />
                <span>١. تلوين الصوت والنبرة (Intonation)</span>
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                لا تجعل كلامك على وتيرة واحدة مملة كصوت المحرك! ارفع صوتك قليلاً عند التأكيد، واخفضه عند سرد الأسرار، وعبّر بنبرتك عن الدهشة، الحزن، أو الفرح.
              </p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-900 flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-emerald-600" />
                <span>٢. الاتصال البصري (Eye Contact)</span>
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                وزع نظراتك بين كل زملائك وأستاذك. لا تنظر إلى السقف أو الأرض أو النافذة؛ فالنظر إلى عيون المستمعين يبث فيهم الثقة ويجبرهم على متابعتك.
              </p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-900 flex items-center gap-2 mb-2">
                <Smile className="w-5 h-5 text-rose-600" />
                <span>٣. لغة الجسد والابتسامة</span>
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                قف بثبات، واجعل يديك حرتين لتشير بهما برفق، ولا تضع يدك في جيبك. الابتسامة اللطيفة في البداية تزيل التوتر وتفتح قلوب الجميع لكلامك.
              </p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-900 flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-indigo-600" />
                <span>٤. وقفة الصمت السحرية (The Pause)</span>
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                قبل أن تقول نقطة هامة جداً، توقف لثانيتين واصمت. هذا الصمت القصير يثير انتباه الجميع ويجعل آذانهم تترقب ما ستقوله بعده!
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedSubTab === 'dialogue' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              🤝
            </span>
            <div>
              <h2 className="text-2xl font-black text-stone-900 font-cairo">
                آداب الحوار والمناقشة البناءة
              </h2>
              <p className="text-xs text-stone-500">
                كيف تحاور أصدقاءك برقي واحترام؟
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
            <p>
              الحوار هو الجسر الذهبي الذي يربط بين القلوب والعقول. في المدرسة والحياة، المتحدث البارع هو قبل كل شيء <strong>مستمع ممتاز</strong>!
            </p>

            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-3">
              <h4 className="font-bold text-emerald-950">قواعد الحوار المدرسي الناجح:</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>حسن الإنصات:</strong> لا تقاطع زميلك أثناء حديثه حتى ينتهي تماماً من فكرته.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>الرد بالعبارات المهذبة:</strong> مثل: «أتفهم وجهة نظرك، ولكن أرى أن...»، «أوافقك في نقطة كذا، وأضيف عليها...».</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>مقارعة الفكرة بالفكرة:</strong> نناقش الأفكار بالحجج والبراهين، ولا نهاجم الأشخاص أبداً.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {selectedSubTab === 'picture_prompts' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {currentPrompt.level}
                </span>
                <span className="text-xs text-stone-500 font-medium">نشاط تطبيقي تفاعلي</span>
              </div>
              <h2 className="text-2xl font-black text-stone-900 font-cairo">
                {currentPrompt.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {picturePrompts.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePromptIndex(idx);
                    TTSService.stop();
                    setIsSpeaking(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activePromptIndex === idx
                      ? 'bg-amber-500 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  مشهد {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Image Prompt Display */}
            <div className="lg:col-span-5 space-y-3">
              <div className="rounded-2xl overflow-hidden border-4 border-amber-200 shadow-md bg-stone-50 aspect-4/3 relative">
                <img
                  src={currentPrompt.imageUrl}
                  alt={currentPrompt.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-xs text-stone-500 font-bold">
                تأمل تفاصيل الصورة جيداً قبل الإجابة عن الأسئلة!
              </p>
            </div>

            {/* Questions & Oral Guidance */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200">
                <h4 className="font-bold text-amber-950 text-sm mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  <span>أسئلة موجهة تساعدك على التعبير الشفهي:</span>
                </h4>
                <div className="space-y-2.5">
                  {currentPrompt.guidingQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-stone-800 bg-white p-3 rounded-xl border border-amber-100">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Speech Model with TTS */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-900 text-xs sm:text-sm">
                    نموذج التعبير الشفهي المقترح من الأستاذ:
                  </span>
                  <button
                    onClick={() => handleSpeak(currentPrompt.sampleSpeech)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'إيقاف الصوت' : 'استمع للنموذج'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-tajawal bg-white p-3.5 rounded-xl border border-stone-200 shadow-inner">
                  «{currentPrompt.sampleSpeech}»
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedSubTab('recorder')}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Mic className="w-4 h-4" />
                  <span>سجل صوتك وأنت تعبر عن هذا المشهد!</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSubTab === 'recorder' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <span className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl">
              🎙️
            </span>
            <div>
              <h2 className="text-2xl font-black text-stone-900 font-cairo">
                مختبر التسجيل الصوتي الذاتي
              </h2>
              <p className="text-xs text-stone-500">
                سجل صوتك واستمع إليه لتكتشف مخارج حروفك وسرعة كلامك وتطور أداءك
              </p>
            </div>
          </div>

          <div className="max-w-xl mx-auto text-center space-y-6 py-6">
            {/* Visual Recorder Circle */}
            <div className="relative inline-flex items-center justify-center">
              {isRecording && (
                <div className="absolute w-36 h-36 rounded-full bg-rose-400 animate-ping opacity-30"></div>
              )}
              <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all ${
                isRecording ? 'bg-rose-600 text-white shadow-2xl' : 'bg-stone-100 text-stone-700 border-2 border-stone-300'
              }`}>
                <Mic className={`w-10 h-10 ${isRecording ? 'animate-bounce' : ''}`} />
                <span className="text-xs font-bold mt-1">
                  {isRecording ? `${recordingSeconds} ثانية` : 'جاهز للتسجيل'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center gap-2 text-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>ابدأ تسجيل صوتك الآن</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-black rounded-2xl shadow-lg transition flex items-center gap-2 text-sm"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>إيقاف وإنهاء التسجيل</span>
                </button>
              )}
            </div>

            {recordedAudioUrl && (
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>رائع! تم تسجيل صوتك بنجاح. استمع إلى أدائك:</span>
                </div>
                <audio controls src={recordedAudioUrl} className="w-full" />
                <div className="text-xs text-stone-600 space-y-1">
                  <p>🔹 هل تحدثت بسرعة زائدة أم بهدوء واتزان؟</p>
                  <p>🔹 هل كانت مخارج الحروف واضحة؟ هل استخدمت وقفات صمت واثقة؟</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other tabs fallback to general helpful content */}
      {(selectedSubTab === 'description' || selectedSubTab === 'narration' || selectedSubTab === 'debate') && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-stone-900 font-cairo">
            {selectedSubTab === 'description' && 'تقنيات الوصف الشفهي الدقيق'}
            {selectedSubTab === 'narration' && 'تقنيات السرد الشفهي المشوق'}
            {selectedSubTab === 'debate' && 'مهارات إبداء الرأي والدفاع عن الحجة'}
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            {selectedSubTab === 'description' && 'الوصف الشفهي يعتمد على نقل أدق تفاصيل المشهد أو الشخصية بالاستعانة بالحواس الخمس، وتوظيف الألوان والصفات والأحجام دون تكرار.'}
            {selectedSubTab === 'narration' && 'السرد الشفهي يحتاج إلى تسلسل زمني محكم: وضعية انطلاق هادئة، ثم عنصر مفاجأة وتحول، ثم أحداث متصاعدة، وأخيراً حل وعبرة أخلاقية.'}
            {selectedSubTab === 'debate' && 'إبداء الرأي يتطلب الشجاعة والأدب؛ قل رأيك بوضوح، وعززه بحجة منطقية أو واقعية، واستمع للرأي الآخر دون غضب.'}
          </p>
        </div>
      )}
    </div>
  );
};
