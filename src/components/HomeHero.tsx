import React from 'react';
import { ASSETS } from '../assets/images';
import { StageId } from '../types';
import {
  Mic,
  PenTool,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Heart,
  Lightbulb,
  GraduationCap,
  Volume2,
  Smile,
  Star,
} from 'lucide-react';

interface HomeHeroProps {
  onSelectStage: (stage: StageId) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAiAssistant: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onSelectStage,
  onNavigateTab,
  onOpenAiAssistant,
}) => {
  const arabicLetters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'];

  return (
    <div className="relative overflow-hidden bg-notebook-pattern pb-16 pt-8">
      {/* Playful Floating Arabic Letters in Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-30 sm:opacity-40">
        {arabicLetters.slice(0, 16).map((letter, index) => {
          const positions = [
            'top-8 right-6 text-rose-500 text-3xl font-extrabold',
            'top-24 right-1/4 text-amber-500 text-4xl font-black',
            'top-16 left-12 text-emerald-500 text-5xl font-cairo',
            'top-48 left-1/3 text-indigo-400 text-3xl font-bold',
            'top-72 right-12 text-purple-500 text-4xl',
            'top-96 left-8 text-rose-400 text-5xl font-black',
            'bottom-24 right-1/3 text-teal-500 text-4xl',
            'bottom-12 left-1/4 text-amber-600 text-3xl',
            'top-1/3 right-10 text-orange-400 text-4xl',
            'bottom-32 right-10 text-pink-400 text-5xl font-bold',
            'top-2/3 left-16 text-sky-400 text-4xl',
            'bottom-10 right-4 text-emerald-600 text-3xl font-extrabold',
            'top-6 left-1/2 text-rose-300 text-4xl',
            'bottom-4 left-1/2 text-indigo-500 text-4xl font-black',
            'top-80 right-1/2 text-amber-400 text-3xl',
            'bottom-48 right-16 text-teal-400 text-4xl',
          ];
          return (
            <span
              key={index}
              className={`absolute transition-transform hover:scale-125 duration-500 ${positions[index % positions.length]}`}
            >
              {letter}
            </span>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Logo & Welcoming Header */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo Card with Mascot and Calligraphy */}
          <div className="relative mb-6 group">
            <div className="absolute -inset-2 bg-linear-to-r from-rose-400 via-amber-300 to-emerald-400 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white p-3 rounded-2xl shadow-xl border-4 border-white max-w-xs sm:max-w-md overflow-hidden">
              <img
                src={ASSETS.logo}
                alt="شعار سحر الكلام - الكلمة تصنع العالم"
                className="w-full h-auto rounded-xl object-contain shadow-inner"
              />
              <div className="mt-2.5 py-1 px-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-stone-700">
                  «الكلمة تصنع العالم» • الهوية الرسمية لسحر الكلام
                </span>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Welcome Titles as requested */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs sm:text-sm font-bold mb-4 border border-rose-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>بوابة التميز في التعبير اللغوي وفق المنهاج الجزائري</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 font-cairo tracking-tight leading-tight mb-4">
            مرحبًا بكم في <span className="text-rose-600 underline decoration-amber-400 decoration-wavy decoration-2">«سحر الكلام»</span>
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-800 font-cairo mb-6">
            «هنا تتحول الكلمة إلى فكرة، والفكرة إلى إبداع»
          </p>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed mb-10">
            منصتكم التعليمية الشاملة لتعلم تقنيات التعبير الشفهي (الفصل الأول) والتعبير الكتابي (الفصل الثاني) للأطوار الابتدائي، المتوسط والثانوي، بأسلوب مبسط، ممتع وتفاعلي مع المساعد الذكي.
          </p>

          {/* Three Big Stage Buttons requested by user */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {/* Primary Button */}
            <div
              onClick={() => onSelectStage('primary')}
              className="group relative bg-linear-to-b from-amber-50 to-orange-100/70 p-6 rounded-3xl border-3 border-amber-300 hover:border-amber-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer text-right flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black bg-amber-400 text-amber-950 px-3 py-1 rounded-full shadow-xs">
                  السنة 1 إلى 5
                </span>
                <span className="text-3xl">🎒</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-amber-950 font-cairo mb-2 group-hover:text-amber-700 transition">
                  الطور الابتدائي
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 mb-4 leading-normal">
                  دروس مبسطة، رسومات كرتونية ملونة، ألعاب تعليمية، وتمارين تفاعلية تصحح فورياً.
                </p>
              </div>
              <div className="pt-3 border-t border-amber-200/80 flex items-center justify-between text-amber-900 font-bold text-sm">
                <span>تصفح دروس الابتدائي</span>
                <span className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold group-hover:translate-x-[-4px] transition-transform">
                  ←
                </span>
              </div>
            </div>

            {/* Middle School Button */}
            <div
              onClick={() => onSelectStage('middle')}
              className="group relative bg-linear-to-b from-emerald-50 to-teal-100/70 p-6 rounded-3xl border-3 border-emerald-300 hover:border-emerald-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer text-right flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black bg-emerald-500 text-white px-3 py-1 rounded-full shadow-xs">
                  السنة 1 إلى 4 (BEM)
                </span>
                <span className="text-3xl">📐</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-emerald-950 font-cairo mb-2 group-hover:text-emerald-700 transition">
                  الطور المتوسط
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 mb-4 leading-normal">
                  أنماط النصوص، تقنيات العرض والمناقشة، تدريب على الروابط والوضعيات الإدماجية لشهادة التعليم المتوسط.
                </p>
              </div>
              <div className="pt-3 border-t border-emerald-200/80 flex items-center justify-between text-emerald-900 font-bold text-sm">
                <span>تصفح دروس المتوسط</span>
                <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold group-hover:translate-x-[-4px] transition-transform">
                  ←
                </span>
              </div>
            </div>

            {/* Secondary School Button */}
            <div
              onClick={() => onSelectStage('secondary')}
              className="group relative bg-linear-to-b from-indigo-50 to-purple-100/70 p-6 rounded-3xl border-3 border-indigo-300 hover:border-indigo-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer text-right flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black bg-indigo-600 text-white px-3 py-1 rounded-full shadow-xs">
                  السنة 1 إلى 3 (BAC)
                </span>
                <span className="text-3xl">🏛️</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-indigo-950 font-cairo mb-2 group-hover:text-indigo-700 transition">
                  الطور الثانوي
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 mb-4 leading-normal">
                  فنون الخطابة والمناظرة، كتابة المقال الفكري والحجاجي المعمق، ونماذج تعبير مطابقة لشهادة البكالوريا.
                </p>
              </div>
              <div className="pt-3 border-t border-indigo-200/80 flex items-center justify-between text-indigo-950 font-bold text-sm">
                <span>تصفح دروس الثانوي</span>
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold group-hover:translate-x-[-4px] transition-transform">
                  ←
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Pillars Showcase: Oral & Written Expression */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Oral Pillar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-100 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    الفصل الأول
                  </span>
                  <h3 className="text-2xl font-black text-stone-800 font-cairo">
                    قسم التعبير الشفهي
                  </h3>
                </div>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                نعلم التلميذ الشجاعة الأدبية، وطلاقة اللسان، وترتيب الأفكار قبل التحدث، وتقنيات الحوار والوصف والسرد والمناقشة، مع تدريب صوتي حقيقي على النطق والإلقاء.
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 font-semibold mb-6">
                <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>تقنيات التحدث والإلقاء</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>آداب الحوار والمناقشة</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>الوصف والسرد الشفهي</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>التعبير على المشاهد والصور</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('oral')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2"
            >
              <span>دخول قسم التعبير الشفهي الشامل</span>
              <span>←</span>
            </button>
          </div>

          {/* Written Pillar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-rose-100 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                  <PenTool className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    الفصل الثاني
                  </span>
                  <h3 className="text-2xl font-black text-stone-800 font-cairo">
                    قسم التعبير الكتابي
                  </h3>
                </div>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                إتقان هندسة الوضعية الإدماجية: مهارات صياغة المقدمة المشوقة، والعرض المتماسك بالروابط المنطقية، والخاتمة المعبّرة مع الاستشهاد الدقيق وعلامات الترقيم.
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 font-semibold mb-6">
                <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>المقدمة، العرض، الخاتمة</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>بنك أدوات الربط اللغوي</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>علامات الترقيم الصحيحة</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>نماذج تطبيقية محلولة</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('written')}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2"
            >
              <span>دخول قسم التعبير الكتابي ونماذج النصوص</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* AI Assistant Banner */}
        <div className="bg-linear-to-r from-purple-900 via-indigo-900 to-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-purple-500/30">
          <div className="space-y-3 text-right max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ميزة حصرية لتلاميذ سحر الكلام</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-cairo">
              المساعد الذكي: أستاذك التفاعلي في أي وقت!
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              صحح تعبيرك الكتابي فورياً واكتشف أسباب الأخطاء، اطلب أفكاراً لوضعية إدماجية جديدة، تدرب على أسئلة التعبير الشفهي، أو اطلب شرح أي درس بطريقة مبسطة تناسب مستواك الدراسي.
            </p>
          </div>
          <button
            onClick={onOpenAiAssistant}
            className="w-full md:w-auto px-8 py-4 bg-linear-to-r from-amber-400 to-rose-400 hover:from-amber-500 hover:to-rose-500 text-stone-950 font-black rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center gap-3 text-base"
          >
            <Sparkles className="w-5 h-5 text-stone-900" />
            <span>جرّب المساعد الذكي الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
