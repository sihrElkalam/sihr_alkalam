import React, { useState } from 'react';
import { ASSETS } from '../assets/images';
import { StageId } from '../types';
import {
  BookOpen,
  Mic,
  PenTool,
  Award,
  Sparkles,
  FolderDown,
  Info,
  Menu,
  X,
  Search,
  PlusCircle,
  GraduationCap,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedStage: StageId;
  setSelectedStage: (stage: StageId) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAiAssistant: () => void;
  onOpenContentManager: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedStage,
  setSelectedStage,
  searchQuery,
  setSearchQuery,
  onOpenAiAssistant,
  onOpenContentManager,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'الرئيسية', icon: BookOpen },
    { id: 'stages', label: 'الأطوار التعليمية', icon: GraduationCap },
    { id: 'oral', label: 'التعبير الشفهي', icon: Mic },
    { id: 'written', label: 'التعبير الكتابي', icon: PenTool },
    { id: 'exercises', label: 'التمارين والاختبارات', icon: Award },
    { id: 'resources', label: 'الموارد التعليمية', icon: FolderDown },
    { id: 'about', label: 'حول الموقع', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      {/* Top Banner Ribbon */}
      <div className="bg-linear-to-r from-amber-500 via-rose-500 to-emerald-500 py-1 px-4 text-center text-xs font-medium text-white tracking-wide flex items-center justify-between">
        <span className="hidden sm:inline">🇩🇿 وفق المنهاج الدراسي لوزارة التربية الوطنية الجزائرية</span>
        <span className="mx-auto sm:mx-0 font-bold">«الكلمة تصنع العالم، والفكرة تصنع الإبداع»</span>
        <button
          onClick={onOpenContentManager}
          className="hidden md:flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full text-xs transition"
          title="لوحة الأستاذ لإضافة وتعديل الدروس والتمارين"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>إضافة درس أو تمرين</span>
        </button>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md border-2 border-rose-300 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <img
                src={ASSETS.logo}
                alt="شعار سحر الكلام"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-cairo tracking-tight">
                  سحر الكلام
                </span>
                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  منصة تعبير
                </span>
              </div>
              <span className="text-xs sm:text-sm text-stone-600 font-medium">
                فنون التعبير الشفهي والكتابي • المنهاج الجزائري
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن درس، وضعية، أو قاعدة..."
                className="w-full pl-4 pr-10 py-2 text-sm bg-amber-50/60 border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* AI Assistant Button & Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 animate-spin text-amber-200" style={{ animationDuration: '4s' }} />
              <span>المساعد الذكي</span>
              <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full">AI</span>
            </button>

            <button
              onClick={onOpenContentManager}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-emerald-400 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition"
              title="إضافة وتطوير الدروس والتمارين"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>إدارة المحتوى</span>
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAiAssistant}
              className="p-2 rounded-full bg-rose-500 text-white shadow-xs"
              title="المساعد الذكي"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full text-stone-600 hover:bg-stone-100"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input bar */}
        {searchOpen && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن درس، وضعية، أو قاعدة..."
                className="w-full pl-4 pr-10 py-2.5 text-sm bg-stone-100 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400"
                autoFocus
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 py-2 border-t border-amber-100 text-sm font-semibold">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-stone-700 hover:text-rose-600 hover:bg-rose-50/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Quick Stage Shortcuts */}
          <div className="mr-auto flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg text-xs">
            <span className="text-stone-500 px-1 font-normal">الطور:</span>
            <button
              onClick={() => {
                setSelectedStage('primary');
                setCurrentTab('stages');
              }}
              className={`px-2 py-0.5 rounded font-bold transition ${
                selectedStage === 'primary' && currentTab === 'stages'
                  ? 'bg-amber-500 text-white'
                  : 'hover:bg-amber-100 text-stone-700'
              }`}
            >
              الابتدائي
            </button>
            <button
              onClick={() => {
                setSelectedStage('middle');
                setCurrentTab('stages');
              }}
              className={`px-2 py-0.5 rounded font-bold transition ${
                selectedStage === 'middle' && currentTab === 'stages'
                  ? 'bg-emerald-600 text-white'
                  : 'hover:bg-emerald-100 text-stone-700'
              }`}
            >
              المتوسط
            </button>
            <button
              onClick={() => {
                setSelectedStage('secondary');
                setCurrentTab('stages');
              }}
              className={`px-2 py-0.5 rounded font-bold transition ${
                selectedStage === 'secondary' && currentTab === 'stages'
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-indigo-100 text-stone-700'
              }`}
            >
              الثانوي
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top">
          <div className="grid grid-cols-3 gap-2 mb-4 p-2 bg-stone-50 rounded-xl">
            <button
              onClick={() => {
                setSelectedStage('primary');
                setCurrentTab('stages');
                setMobileMenuOpen(false);
              }}
              className={`py-2 text-xs font-bold rounded-lg text-center ${
                selectedStage === 'primary' ? 'bg-amber-500 text-white' : 'bg-white text-stone-700'
              }`}
            >
              الطور الابتدائي
            </button>
            <button
              onClick={() => {
                setSelectedStage('middle');
                setCurrentTab('stages');
                setMobileMenuOpen(false);
              }}
              className={`py-2 text-xs font-bold rounded-lg text-center ${
                selectedStage === 'middle' ? 'bg-emerald-600 text-white' : 'bg-white text-stone-700'
              }`}
            >
              الطور المتوسط
            </button>
            <button
              onClick={() => {
                setSelectedStage('secondary');
                setCurrentTab('stages');
                setMobileMenuOpen(false);
              }}
              className={`py-2 text-xs font-bold rounded-lg text-center ${
                selectedStage === 'secondary' ? 'bg-indigo-600 text-white' : 'bg-white text-stone-700'
              }`}
            >
              الطور الثانوي
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-rose-500 text-white'
                      : 'text-stone-700 hover:bg-rose-50 hover:text-rose-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => {
                onOpenContentManager();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition mt-2 border border-emerald-300"
            >
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <span>إدارة المحتوى وإضافة درس / تمرين</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
