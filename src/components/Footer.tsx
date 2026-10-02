import React from 'react';
import { ASSETS } from '../assets/images';
import { Heart, Sparkles, BookOpen, GraduationCap, Mic, PenTool } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onSelectStage: (stage: 'primary' | 'middle' | 'secondary') => void;
  onOpenContentManager: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTab,
  onSelectStage,
  onOpenContentManager,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-rose-400 shrink-0">
                <img src={ASSETS.logo} alt="سحر الكلام" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-cairo">سحر الكلام</h3>
                <span className="text-xs text-amber-400 font-bold">الكلمة تصنع العالم ♡</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              منصة تعليمية عربية متكاملة لتعليم فنون وتقنيات التعبير الشفهي والكتابي وفق المنهاج الجزائري الجيل الثاني.
            </p>
          </div>

          {/* Col 2: Educational Stages */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 font-cairo">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>الأطوار التعليمية</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onSelectStage('primary');
                    onNavigateTab('stages');
                  }}
                  className="hover:text-amber-400 transition"
                >
                  الطور الابتدائي (1 إلى 5 ابتدائي)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectStage('middle');
                    onNavigateTab('stages');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  الطور المتوسط (1 إلى 4 متوسط - BEM)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectStage('secondary');
                    onNavigateTab('stages');
                  }}
                  className="hover:text-indigo-400 transition"
                >
                  الطور الثانوي (1 إلى 3 ثانوي - BAC)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sections */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 font-cairo">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>أقسام المنصة</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateTab('oral')} className="hover:text-amber-400 transition">
                  الفصل الأول: التعبير الشفهي
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('written')} className="hover:text-rose-400 transition">
                  الفصل الثاني: التعبير الكتابي
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('exercises')} className="hover:text-emerald-400 transition">
                  بنك التمارين والاختبارات الفورية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('resources')} className="hover:text-amber-400 transition">
                  الموارد والوثائق المطبوعة (PDF)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Teacher & Evolution */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 font-cairo">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>تطوير المحتوى</span>
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              يمكن للأستاذ إضافة الدروس، التمارين، أوراق العمل وسنوات دراسية جديدة في أي وقت.
            </p>
            <button
              onClick={onOpenContentManager}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              <span>لوحة إضافة الدروس والمحتوى</span>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة «سحر الكلام» • وفق منهاج وزارة التربية الوطنية الجزائرية.
          </p>
          <div className="flex items-center gap-1">
            <span>صُنع بحب</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>لخدمة تلاميذ وأساتذة لغة الضاد بالجزائر</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
