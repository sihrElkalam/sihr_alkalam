import React, { useState, useEffect } from 'react';
import { StageId, Lesson, Exercise, ResourceItem, GradeYear } from './types';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { StageView } from './components/StageView';
import { OralExpressionSection } from './components/OralExpressionSection';
import { WrittenExpressionSection } from './components/WrittenExpressionSection';
import { ExercisesSection } from './components/ExercisesSection';
import { ResourcesSection } from './components/ResourcesSection';
import { AboutSection } from './components/AboutSection';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ContentManagerModal } from './components/ContentManagerModal';
import { Footer } from './components/Footer';
import { BookOpen, Search, ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedStage, setSelectedStage] = useState<StageId>('primary');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [gradeYears, setGradeYears] = useState<GradeYear[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);

  // Active playing exercise
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  // AI Assistant modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiAction, setAiAction] = useState<
    'explain' | 'correct_text' | 'generate_ideas' | 'oral_practice' | 'create_exercise'
  >('explain');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [aiText, setAiText] = useState('');
  const [aiLevel, setAiLevel] = useState('الابتدائي');

  // Content Manager modal state
  const [isContentManagerOpen, setIsContentManagerOpen] = useState(false);

  // Load data on start
  const loadAllData = () => {
    setGradeYears(StorageService.getGradeYears());
    setLessons(StorageService.getLessons());
    setExercises(StorageService.getExercises());
    setResources(StorageService.getResources());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers for AI Assistant modal actions
  const openAiForLesson = (lessonTitle: string, stageName: string) => {
    setAiAction('explain');
    setAiPrompt(lessonTitle);
    setAiLevel(stageName);
    setIsAiModalOpen(true);
  };

  const openAiToCorrect = (text: string, topic: string) => {
    setAiAction('correct_text');
    setAiText(text);
    setAiTopic(topic);
    setIsAiModalOpen(true);
  };

  const openAiToBrainstorm = (topic: string) => {
    setAiAction('generate_ideas');
    setAiTopic(topic);
    setIsAiModalOpen(true);
  };

  const openAiWithTopic = (topic: string) => {
    setAiAction('oral_practice');
    setAiPrompt(topic);
    setIsAiModalOpen(true);
  };

  const openAiGenerator = (stageId: StageId | string, gradeId: string) => {
    setAiAction('create_exercise');
    const stageName =
      stageId === 'primary' || stageId === 'الابتدائي'
        ? 'الطور الابتدائي'
        : stageId === 'middle' || stageId === 'المتوسط'
        ? 'الطور المتوسط'
        : 'الطور الثانوي';
    setAiLevel(stageName);
    setAiPrompt(`تمرين في قواعد التعبير اللغوي لمستوى ${stageName}`);
    setIsAiModalOpen(true);
  };

  // Search Results filtering
  const searchResults = searchQuery.trim()
    ? lessons.filter(
        (l) =>
          l.title.includes(searchQuery.trim()) ||
          l.summary.includes(searchQuery.trim()) ||
          l.content.includes(searchQuery.trim()) ||
          l.rules?.some((r) => r.includes(searchQuery.trim()))
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-stone-800 font-tajawal selection:bg-rose-200 selection:text-rose-900">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedStage={selectedStage}
        setSelectedStage={(stage) => {
          setSelectedStage(stage);
          setCurrentTab('stages');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAiAssistant={() => {
          setAiAction('explain');
          setAiPrompt('');
          setIsAiModalOpen(true);
        }}
        onOpenContentManager={() => setIsContentManagerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If user is searching, show search results view */}
        {searchQuery.trim() ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
              <div>
                <h2 className="text-2xl font-black text-stone-900 font-cairo">
                  نتائج البحث عن: «{searchQuery}»
                </h2>
                <span className="text-xs text-stone-500">
                  تم العثور على {searchResults.length} درس ونتيجة
                </span>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
              >
                إلغاء البحث
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      setSelectedStage(lesson.stageId);
                      setCurrentTab('stages');
                      setSearchQuery('');
                    }}
                    className="bg-white rounded-3xl p-6 border-2 border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-lg transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {lesson.category === 'oral' ? 'تعبير شفهي' : 'تعبير كتابي'}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        {lesson.subtitle}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 font-cairo mb-2">
                      {lesson.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed mb-4">
                      {lesson.summary}
                    </p>
                    <div className="flex items-center text-xs font-bold text-rose-600">
                      <span>الانتقال إلى هذا الدرس</span>
                      <ArrowRight className="w-3.5 h-3.5 mr-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <Search className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-stone-700">لم يتم العثور على نتائج مطابقة</h4>
                <p className="text-xs text-stone-500 mt-1">جرب كلمات بحث أخرى، مثل: الحوار، النمط الحجاجي، الربط، أو علامات الترقيم.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeHero
                onSelectStage={(stage) => {
                  setSelectedStage(stage);
                  setCurrentTab('stages');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateTab={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenAiAssistant={() => {
                  setAiAction('explain');
                  setAiPrompt('');
                  setIsAiModalOpen(true);
                }}
              />
            )}

            {currentTab === 'stages' && (
              <StageView
                stageId={selectedStage}
                onSelectStage={setSelectedStage}
                gradeYears={gradeYears}
                lessons={lessons}
                exercises={exercises}
                onStartExercise={(ex) => {
                  setActiveExercise(ex);
                  setCurrentTab('exercises');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenAiForLesson={openAiForLesson}
              />
            )}

            {currentTab === 'oral' && (
              <OralExpressionSection
                onOpenAiAssistantWithTopic={openAiWithTopic}
              />
            )}

            {currentTab === 'written' && (
              <WrittenExpressionSection
                onOpenAiToCorrect={openAiToCorrect}
                onOpenAiToBrainstorm={openAiToBrainstorm}
              />
            )}

            {currentTab === 'exercises' && (
              <ExercisesSection
                exercises={exercises}
                gradeYears={gradeYears}
                selectedStage={selectedStage}
                onSelectStage={setSelectedStage}
                activeExercise={activeExercise}
                setActiveExercise={setActiveExercise}
                onOpenAiGenerator={openAiGenerator}
              />
            )}

            {currentTab === 'resources' && (
              <ResourcesSection resources={resources} />
            )}

            {currentTab === 'about' && (
              <AboutSection />
            )}
          </>
        )}
      </main>

      {/* Floating AI Helper Quick Button */}
      <button
        onClick={() => {
          setAiAction('explain');
          setAiPrompt('');
          setIsAiModalOpen(true);
        }}
        className="fixed bottom-6 left-6 z-40 p-4 rounded-full bg-linear-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white shadow-2xl hover:scale-108 transition-transform duration-300 flex items-center gap-2 group"
        title="المساعد الذكي لسحر الكلام"
      >
        <Sparkles className="w-6 h-6 animate-spin text-amber-200" style={{ animationDuration: '6s' }} />
        <span className="hidden sm:inline font-bold text-xs sm:text-sm pl-1">
          اسأل المساعد الذكي
        </span>
      </button>

      {/* Modals */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialAction={aiAction}
        initialPrompt={aiPrompt}
        initialTopic={aiTopic}
        initialText={aiText}
        initialLevel={aiLevel}
      />

      <ContentManagerModal
        isOpen={isContentManagerOpen}
        onClose={() => setIsContentManagerOpen(false)}
        gradeYears={gradeYears}
        onRefreshData={loadAllData}
      />

      {/* Footer */}
      <Footer
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectStage={(stage) => {
          setSelectedStage(stage);
          setCurrentTab('stages');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenContentManager={() => setIsContentManagerOpen(true)}
      />
    </div>
  );
}
