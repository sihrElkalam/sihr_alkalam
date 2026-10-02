import React from 'react';
import { ASSETS } from '../assets/images';
import {
  Heart,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  GraduationCap,
  Users,
  Compass,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in space-y-10">
      {/* Brand Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-amber-200 shadow-md text-center">
        <div className="w-32 h-32 sm:w-44 sm:h-44 mx-auto mb-6 rounded-3xl overflow-hidden shadow-xl border-4 border-rose-300">
          <img
            src={ASSETS.logo}
            alt="شعار سحر الكلام"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>منصة تعليمية جزائرية متكاملة</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 font-cairo mb-3">
          عن منصة «سحر الكلام»
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-emerald-800 font-cairo mb-4">
          «هنا تتحول الكلمة إلى فكرة، والفكرة إلى إبداع»
        </p>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          انطلقت منصة «سحر الكلام» برؤية تربوية طموحة لتمكين أبنائنا وبناتنا في المدارس الجزائرية من امتلاك ناصية الفصاحة والبيان، وتجاوز حاجز الخجل في التعبير الشفهي، والركاكة في التعبير الكتابي.
        </p>
      </div>

      {/* Core Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200 text-right">
          <span className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
            🎯
          </span>
          <h3 className="text-lg font-black text-amber-950 font-cairo mb-2">
            رسالتنا وأهدافنا
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            تعليم التلميذ الجزائري تقنيات التعبير بطريقة ممتعة، تفاعلية وعملية تجمع بين الأصالة والتقنيات الذكية المعاصرة.
          </p>
        </div>

        <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200 text-right">
          <span className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
            🇩🇿
          </span>
          <h3 className="text-lg font-black text-emerald-950 font-cairo mb-2">
            المنهاج الجزائري
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            محتوى مصمم بعناية وفق المقاربة بالكفاءات ومنهاج الجيل الثاني لوزارة التربية الوطنية لجميع الأطوار: الابتدائي، المتوسط، والثانوي.
          </p>
        </div>

        <div className="bg-rose-50/70 p-6 rounded-3xl border border-rose-200 text-right">
          <span className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
            ❤️
          </span>
          <h3 className="text-lg font-black text-rose-950 font-cairo mb-2">
            الكلمة تصنع العالم
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            نؤمن بأن الكلمة الطيبة والفكرة البناءة هما حجر الأساس لبناء جيل جزائري قارئ، فصيح، ومبدع يخدم وطنه وأمته.
          </p>
        </div>
      </div>

      {/* Pedagogical Design Pillars */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-xl font-black text-stone-900 font-cairo">
          تنظيم المحتوى في «سحر الكلام»:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-amber-700 text-sm mb-1">الفصل الأول: التعبير الشفهي</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              تقنيات التحدث، حسن الاستماع، لغة الجسد، الوصف الشفهي، الرواية والسرد، المناقشة وإبداء الرأي، والتدريب الصوتي على المشاهد.
            </p>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-rose-700 text-sm mb-1">الفصل الثاني: التعبير الكتابي</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              هندسة الوضعية الإدماجية (المقدمة، العرض، الخاتمة)، بنك أدوات الربط، علامات الترقيم، أنماط النصوص، والتصحيح الآلي مع المساعد الذكي.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
