import { useState } from "react";
import { Compass, BookOpen, User, FlameKindling, ShieldCheck, Languages } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Dashboard from "./components/Dashboard";
import ResumeReSkilling from "./components/ResumeReSkilling";
import MentalQuiz from "./components/MentalQuiz";
import SpeakerGym from "./components/SpeakerGym";
import { useUserContext } from "./lib/UserContext";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const { languageLevel, setLanguageLevel } = useUserContext();

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case "reskilling":
        return <ResumeReSkilling />;
      case "quiz":
        return <MentalQuiz />;
      case "gym":
        return <SpeakerGym />;
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  const tabsConfig = [
    { id: "dashboard", label: "The Harbor", subtitle: "Wellness & Safety", icon: FlameKindling },
    { id: "reskilling", label: "The Forge", subtitle: "Resume Analysis & AI", icon: User },
    { id: "quiz", label: "The Compass", subtitle: "Mental Quiz & Pathway", icon: Compass },
    { id: "gym", label: "Speaker's Gym", subtitle: "English Confidence", icon: BookOpen },
  ];

  return (
      <div className="min-h-screen flex flex-col font-sans" id="phoenix-app-root">
      {/* Dynamic Header / Navigation */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-30 shadow-xs" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            
            {/* Logo and Core Identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-900 rounded-2xl flex items-center justify-center text-amber-400 font-bold text-xl shadow">
                Φ
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-stone-900 block leading-tight">
                  Phoenix Coach
                </span>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-600 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-green-600 inline" />
                  REBUILD YOURSELF
                </span>
              </div>
            </div>

            {/* Desktop Navigation Link Tabs */}
            <nav className="hidden md:flex gap-1 bg-stone-50/70 p-1.5 rounded-2xl border border-stone-200/50" id="desktop-nav">
              {tabsConfig.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-nav-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4.5 py-2.5 rounded-xl text-left transition duration-150 inline-flex items-center gap-2 ${
                      isActive 
                        ? "bg-white text-stone-950 font-semibold shadow-xs border border-stone-200/40" 
                        : "text-stone-605 font-medium hover:text-stone-900 hover:bg-stone-100/50"
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? "text-amber-500" : "text-stone-400"}`} />
                    <div className="text-xs">
                      <span className="block font-sans">{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Active Subtitle indicators / Small Help */}
            <div className="flex items-center gap-3" id="meta-indicators">
              <button
                onClick={() => setLanguageLevel(languageLevel === 'simple' ? 'standard' : 'simple')}
                className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200"
                title={`Toggle Language Complexity: (Current: ${languageLevel})`}
              >
                <Languages className="w-4 h-4 text-stone-600" />
              </button>
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-[10px] font-mono text-stone-405 font-normal tracking-wide">ASSESSMENT STATUS:</span>
                <span className="text-[11px] font-mono font-semibold text-stone-700">PRIVATE & SECURE</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" title="System running live" />
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Sticky Tab bar */}
      <div className="md:hidden bg-white border-t border-stone-100 fixed bottom-0 left-0 right-0 z-40 px-3 py-2 shadow-lg" id="mobile-nav">
        <div className="grid grid-cols-4 gap-1">
          {tabsConfig.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 text-center rounded-xl flex flex-col items-center justify-center gap-1 transition ${
                  isActive ? "bg-amber-100/40 text-stone-950" : "text-stone-500"
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? "text-amber-600" : "text-stone-400"}`} />
                <span className="text-[9px] font-medium leading-none block">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Structural Layout Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mb-16 md:mb-0" id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {renderActiveComponent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Disclaimer */}
      <footer className="bg-stone-50 border-t border-stone-200/50 py-6" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-450 text-center font-mono font-medium">
          <p>
            Phoenix © 2026. Made with profound respect for veterans. "Not finished yet."
          </p>
          <div className="flex gap-4">
            <span>Powered by Gemini 3.5 Flash</span>
            <span className="text-stone-300">|</span>
            <span>No telemetry tracked</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
