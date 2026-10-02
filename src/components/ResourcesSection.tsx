import React, { useState } from 'react';
import { ResourceItem, StageId } from '../types';
import {
  FolderDown,
  Printer,
  Download,
  FileText,
  Video,
  ExternalLink,
  BookOpen,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';

interface ResourcesSectionProps {
  resources: ResourceItem[];
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ resources }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPrintResource, setSelectedPrintResource] = useState<ResourceItem | null>(null);

  const filtered = resources.filter((r) => {
    if (activeCategory === 'all') return true;
    return r.category === activeCategory;
  });

  const handlePrint = (res: ResourceItem) => {
    setSelectedPrintResource(res);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-2">
              <FolderDown className="w-3.5 h-3.5" />
              <span>حقيبة الأستاذ والتلميذ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-cairo">
              الموارد والوثائق التعليمية القابلة للتحميل والطباعة
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              أوراق عمل، بطاقات وقواعد، خرائط ذهنية، ونماذج وضعيات إدماجية جاهزة للطباعة
            </p>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-stone-100">
          {[
            { id: 'all', label: 'جميع الموارد' },
            { id: 'worksheet', label: 'أوراق عمل وتمارين' },
            { id: 'mindmap', label: 'بطاقات وخرائط ذهنية' },
            { id: 'model', label: 'نماذج وضعيات إدماجية' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border-2 border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {item.category === 'worksheet' && 'ورقة عمل 📄'}
                  {item.category === 'mindmap' && 'بطاقة ملونة 🎨'}
                  {item.category === 'model' && 'نموذج إدماجي 🏛️'}
                  {item.category === 'video' && 'فيديو تعليمي 🎥'}
                </span>
                <span className="text-[11px] text-stone-500 font-semibold">
                  {item.stageId === 'primary' ? 'طور ابتدائي' : item.stageId === 'middle' ? 'طور متوسط' : 'طور ثانوي'}
                </span>
              </div>

              <h3 className="text-lg font-black text-stone-900 font-cairo mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 mb-4 leading-relaxed">
                {item.description}
              </p>

              {item.contentSnippet && (
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70 text-xs text-stone-700 mb-4 line-clamp-3">
                  {item.contentSnippet}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
              {item.pdfPrintData ? (
                <button
                  onClick={() => handlePrint(item)}
                  className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>معاينة وطباعة الوثيقة (PDF)</span>
                </button>
              ) : (
                <button
                  onClick={() => handlePrint(item)}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>معاينة المحتوى الكامل</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Printable Sheet Modal */}
      {selectedPrintResource && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <span className="font-bold text-stone-700 text-sm">
                معاينة الوثيقة المدرسية للطباعة
              </span>
              <button
                onClick={() => setSelectedPrintResource(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Printed Paper */}
            <div className="p-8 my-6 bg-white border-2 border-stone-300 rounded-2xl shadow-inner font-tajawal text-stone-900 print:border-none print:shadow-none">
              {/* Paper Header */}
              <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3 mb-4 text-xs font-bold">
                <div>
                  <p>الجمهورية الجزائرية الديمقراطية الشعبية</p>
                  <p>وزارة التربية الوطنية • منصة سحر الكلام</p>
                </div>
                <div className="text-left">
                  <p>المادة: اللغة العربية (تعبير كتابي/شفهي)</p>
                  <p>التاريخ: ........................</p>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-black font-cairo text-rose-700 underline decoration-2">
                  {selectedPrintResource.pdfPrintData?.header || selectedPrintResource.title}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  الاسم واللقب: ............................................ القسم: ....................
                </p>
              </div>

              {selectedPrintResource.pdfPrintData ? (
                <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 font-semibold">
                    💡 <strong>التعليمة والتوجيه: </strong>
                    {selectedPrintResource.pdfPrintData.instructions}
                  </div>

                  <div className="whitespace-pre-line text-stone-800 py-2">
                    {selectedPrintResource.pdfPrintData.body}
                  </div>

                  {selectedPrintResource.pdfPrintData.exerciseBox && (
                    <div className="border-2 border-dashed border-stone-400 p-4 rounded-xl mt-4 whitespace-pre-line bg-stone-50/50">
                      <strong>نشاط تطبيقي: </strong>
                      <br />
                      {selectedPrintResource.pdfPrintData.exerciseBox}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm leading-relaxed whitespace-pre-line text-stone-800">
                  {selectedPrintResource.contentSnippet || selectedPrintResource.description}
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-stone-300 flex items-center justify-between text-[11px] text-stone-500">
                <span>«الكلمة تصنع العالم» • سحر الكلام</span>
                <span>علامة الأستاذ(ة): ...... / 10</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedPrintResource(null)}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الوثيقة الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
