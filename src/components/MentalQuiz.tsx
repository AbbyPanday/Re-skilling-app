import { useState } from "react";
import { 
  Sparkles, Award, ArrowRight, ArrowLeft, RefreshCw, 
  BookOpen, Star, HelpCircle, Heart, CheckCircle, ShieldAlert 
} from "lucide-react";
import { motion } from "motion/react";

interface QuizQuestion {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    description: string;
    personaWeights: { [key: string]: number };
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "When you reflect on your twenty-plus years in packaging and R&D, what tasks bring you the deepest sense of pride?",
    options: [
      {
        id: "A",
        text: "The physical craftsmanship",
        description: "Designing the physical blueprint, validating standard folding mockups, and touching packaging material samples.",
        personaWeights: { "Sustainable Packaging Innovator": 3, "Strategic R&D Consultant": 1 }
      },
      {
        id: "B",
        text: "The aesthetic artworks & vector accuracy",
        description: "Aligning branding guidelines, drawing illustrations, and achieving absolute printer compliance in layouts.",
        personaWeights: { "AI-Enhanced Art Director": 3, "Sustainable Packaging Innovator": 1 }
      },
      {
        id: "C",
        text: "Guiding the product's ultimate success",
        description: "Developing specs, optimizing production costs, and advising cross-functional teams.",
        personaWeights: { "Strategic R&D Consultant": 3, "AI-Enhanced Art Director": 1 }
      }
    ]
  },
  {
    id: 2,
    text: "What describes your biggest hurdle when you try to learn today's modern design software?",
    options: [
      {
        id: "A",
        text: "The fear of breaking things / complex clicks",
        description: "Feeling overwhelmed by the sheer number of nested buttons, panels, and digital rules.",
        personaWeights: { "Strategic R&D Consultant": 2, "AI-Enhanced Art Director": 1 }
      },
      {
        id: "B",
        text: "Slower typing speed or spoken english barrier",
        description: "Struggling to remember commands or finding the exact english words for tech configurations.",
        personaWeights: { "Sustainable Packaging Innovator": 2, "AI-Enhanced Art Director": 2 }
      },
      {
        id: "C",
        text: "Frustration that 'the old way was faster for me'",
        description: "Knowing how to solve the problem by hand but feeling forced to adopt secondary steps.",
        personaWeights: { "AI-Enhanced Art Director": 2, "Strategic R&D Consultant": 2 }
      }
    ]
  },
  {
    id: 3,
    text: "When office stress is heavy, how does it typically express itself once you arrive back home?",
    options: [
      {
        id: "A",
        text: "Silent pull-back or quiet avoidance",
        description: "I block out conversation, retreat to sit by myself, and suffer under silent worries.",
        personaWeights: { "AI-Enhanced Art Director": 2, "Sustainable Packaging Innovator": 1 }
      },
      {
        id: "B",
        text: "Irritability or letting out anger on loved ones",
        description: "The tension builds up all day, and I accidentally raise my voice or show frustration to family.",
        personaWeights: { "Sustainable Packaging Innovator": 2, "Strategic R&D Consultant": 2 }
      },
      {
        id: "C",
        text: "A feeling of deep fatigue and worthlessness",
        description: "I feel completely depleted, wondering if my twenty years of hard labor are useless now.",
        personaWeights: { "Strategic R&D Consultant": 3, "AI-Enhanced Art Director": 1 }
      }
    ]
  },
  {
    id: 4,
    text: "If you could define your 'New Self'—a refreshed, professional legacy—what feels most inspiring?",
    options: [
      {
        id: "A",
        text: "The AI-Augmented Layout Master",
        description: "Producing five times more artwork variations in half the time by dominating AI generative prompts.",
        personaWeights: { "AI-Enhanced Art Director": 4 }
      },
      {
        id: "B",
        text: "The Environment & Materials Leader",
        description: "Pioneering climate-compliant cardboard structures and leading sustainable guidelines for smart compliance.",
        personaWeights: { "Sustainable Packaging Innovator": 4 }
      },
      {
        id: "C",
        text: "The High-Value R&D Technical Advisor",
        description: "Consulting on material specifications and guiding young developers on FDA printing rules.",
        personaWeights: { "Strategic R&D Consultant": 4 }
      }
    ]
  }
];

const PERSONA_DETAILS: { [key: string]: { title: string; motto: string; description: string } } = {
  "AI-Enhanced Art Director": {
    title: "The AI-Enhanced Art Director",
    motto: "A master craftsman honors standard guidelines by driving the digital speed of tomorrow.",
    description: "You excel at visual representation and artwork management systems. Your new path lies in dominating generative illustration frameworks (Adobe Firefly, Midjourney Prompting), allowing you to convert complex conceptual specifications into visual mockups in minutes."
  },
  "Sustainable Packaging Innovator": {
    title: "The Sustainable Packaging Innovator",
    motto: "Deep material knowledge is the greatest barrier against unsustainable designs.",
    description: "You understand packaging materials, material specifications, and print production. Your path focuses on guiding material reductions, replacing toxic plastic polymers with green alternatives, and using AI parametric tools to calculate and optimize eco-footprints."
  },
  "Strategic R&D Consultant": {
    title: "The Strategic R&D Consultant",
    motto: "Twenty years of successful product launches is a library of wisdom.",
    description: "You hold the historic blueprint. Your path is to act as a senior technical advisor or consultant, bridging corporate design expectations with young engineering executors. You will use AI to draft packaging specifications documents and maintain FDA compliance standards."
  }
};

export default function MentalQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Results states
  const [assignedPersona, setAssignedPersona] = useState("");
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [dynamicRoadmap, setDynamicRoadmap] = useState<any>(null);
  const [errorText, setErrorText] = useState("");

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [QUIZ_QUESTIONS[currentStep].id]: optionId }));
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateResult = async () => {
    // 1. Calculate weighted scores
    const scores: { [key: string]: number } = {
      "AI-Enhanced Art Director": 0,
      "Sustainable Packaging Innovator": 0,
      "Strategic R&D Consultant": 0
    };

    QUIZ_QUESTIONS.forEach(q => {
      const selectedOptId = answers[q.id];
      const selectedOption = q.options.find(opt => opt.id === selectedOptId);
      if (selectedOption) {
        Object.entries(selectedOption.personaWeights).forEach(([persona, weight]) => {
          scores[persona] = (scores[persona] || 0) + weight;
        });
      }
    });

    // Determine highest scoring persona
    let highestPersona = "AI-Enhanced Art Director";
    let maxScore = -1;
    Object.entries(scores).forEach(([persona, score]) => {
      if (score > maxScore) {
        maxScore = score;
        highestPersona = persona;
      }
    });

    setAssignedPersona(highestPersona);
    setIsSubmitted(true);
    setIsLoadingRoadmap(true);
    setErrorText("");

    // 2. Fetch AI-generated roadmap from server
    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answeredQuiz: answers,
          selectedPersonaTitle: highestPersona
        })
      });

      if (!response.ok) {
        throw new Error("Failed to formulate specialized blueprint");
      }

      const data = await response.json();
      setDynamicRoadmap(data);
    } catch (err: any) {
      console.error(err);
      setErrorText("Gemini wasn't able to compile your custom roadmap. We've loaded the default coaching matrix below.");
      // Provide high-quality fallback so they are NEVER left blank
      setDynamicRoadmap({
        assignedPersona: highestPersona,
        corePhilosophy: PERSONA_DETAILS[highestPersona].motto,
        roadmapPhases: [
          {
            phaseTitle: "Phase 1: Embrace the Generative Shift",
            timeframe: "Days 1 to 15",
            focusArea: "Overcoming technical fear & learning prompt templates",
            concreteActions: [
              "Spend 15 minutes daily in the Phoenix live prompting sandbox",
              "Learn to use natural English adjectives to describe packaging layouts",
              "Practice visual descriptive prompting over traditional mechanical clicking"
            ]
          },
          {
            phaseTitle: "Phase 2: Master Workplace English & Word Finder",
            timeframe: "Days 16 to 30",
            focusArea: "Vocabulary confidence & interview speaking comfort",
            concreteActions: [
              "Speak active packaging terms inside the mock interview panel",
              "Refine fragmented thoughts into elegant team descriptions",
              "Record a 1-minute pitch and note vocabulary alternatives"
            ]
          }
        ],
        communicationBlueprint: {
          growthPlan: "Keep sentences simple, impactful, and direct. The market respects depth and wisdom over fast talking. Frame your experience as leadership.",
          dailyExercises: [
            "Use the Phoenix Word Finder tool to prepare 3 core comments before meetings.",
            "Say key material terms aloud inside the room to build physical tongue flexibility."
          ]
        },
        stressToStrengthRituals: {
          decompressRitual: "Set an 'Entry Protection Threshold' right outside work. Wash your hands and wrists in cold water. Inhale for 4s, hold for 4s, release.",
          familyProtectionRule: "Step through the house gate, hug your children/spouse silently, and state directly if you are exhausted: 'I had a grueling day, I need 10 minutes of silence to sit and decompress, then I am fully back to support you.' This preserves family love."
        }
      });
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsSubmitted(false);
    setDynamicRoadmap(null);
    setAssignedPersona("");
  };

  const activeQuestion = QUIZ_QUESTIONS[currentStep];
  const isOptionSelected = answers[activeQuestion.id] !== undefined;

  return (
    <div className="space-y-8" id="quiz-container">
      {!isSubmitted ? (
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-stone-200/85 shadow-md max-w-3xl mx-auto space-y-8" id="quiz-flow">
          {/* Header */}
          <div className="space-y-2 text-center border-b border-stone-100 pb-6 focus:outline-none">
            <span className="text-xs font-mono text-stone-500 tracking-wider uppercase">Alignment Assessment</span>
            <h2 className="font-serif text-3xl text-stone-900">Define Your New Identity</h2>
            <p className="text-stone-600 text-xs md:text-sm max-w-lg mx-auto">
              This short, empathetic quiz helps detect where your true pride lies, what tech-fears are blocking you, and which AI-era professional persona you are ready to embody.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-stone-500 font-mono">
              <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-amber-400"
                style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                layoutId="progress"
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg md:text-xl text-stone-800 leading-snug">
              {activeQuestion.text}
            </h3>

            {/* Options Layout */}
            <div className="space-y-4">
              {activeQuestion.options.map((opt) => {
                const isSelected = answers[activeQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-5 text-left rounded-2xl border transition-all flex items-start gap-4 ${
                      isSelected 
                        ? "bg-amber-50/70 border-amber-400 shadow-sm" 
                        : "bg-stone-50/50 hover:bg-stone-50 border-stone-200"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center font-mono text-xs font-bold ${
                      isSelected ? "bg-amber-400 text-stone-900" : "bg-stone-200 text-stone-600"
                    }`}>
                      {opt.id}
                    </span>
                    <div className="space-y-1">
                      <span className="font-serif font-medium text-stone-950 block text-sm">{opt.text}</span>
                      <span className="text-xs text-stone-600 block leading-normal">{opt.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-stone-100">
            <button
              id="quiz-prev-btn"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 disabled:hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl transition inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            <button
              id="quiz-next-btn"
              onClick={handleNext}
              disabled={!isOptionSelected}
              className="px-6 py-2.5 bg-stone-950 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition inline-flex items-center gap-1.5 shadow"
            >
              {currentStep === QUIZ_QUESTIONS.length - 1 ? (
                <>
                  Generate My Roadmap
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8" id="quiz-completed-results">
          {/* Rebirth Diploma layout (highly encouraging, credential-like aesthetics) */}
          <div className="max-w-3xl mx-auto bg-stone-900 border-4 border-amber-400/40 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden text-center text-stone-100" id="diploma">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-stone-700/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative space-y-6">
              <div className="w-20 h-20 bg-amber-400/10 border border-amber-400/20 rounded-full flex items-center justify-center text-amber-400 mx-auto">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <p className="text-[10px] sm:text-xs font-mono text-amber-400/80 tracking-widest uppercase font-bold">Phoenix Rebirth Alignment</p>
                <h1 className="font-serif text-3xl md:text-5xl tracking-normal text-white">Declaration of Dignity</h1>
                <p className="text-stone-400 text-xs font-sans max-w-md mx-auto pt-1 leading-normal italic">
                  Issued to you, a master of design & material specifications. Your wisdom remains fully valid.
                </p>
              </div>

              <div className="py-4 border-y border-stone-800 max-w-xl mx-auto space-y-2">
                <span className="text-xs font-mono text-stone-400 block uppercase">Assigned Path Title</span>
                <span className="font-serif text-2xl md:text-3xl text-amber-300 italic block">
                  {assignedPersona || "The AI-Enhanced Art Director"}
                </span>
                <p className="text-stone-300 text-xs max-w-md mx-auto leading-relaxed">
                  {dynamicRoadmap?.corePhilosophy || PERSONA_DETAILS[assignedPersona]?.motto || ""}
                </p>
              </div>

              <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                {PERSONA_DETAILS[assignedPersona]?.description}
              </p>

              <button
                id="btn-restart-quiz"
                onClick={handleRestart}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-[10px] font-mono tracking-wider transition uppercase"
              >
                Reset Assessment
              </button>
            </div>
          </div>

          {/* Full Custom Strategy Blueprint Grid */}
          <div className="max-w-3xl mx-auto space-y-6" id="coaching-blueprint-grid">
            {isLoadingRoadmap ? (
              <div className="bg-white border border-stone-200/80 rounded-3xl p-12 text-center space-y-4 shadow-sm">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-amber-400 rounded-full animate-spin mx-auto" />
                <p className="font-serif text-stone-700 text-sm">Gemini is sketching your blueprint phases...</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
                id="custom-roadmaps-content"
              >
                {/* 1. Phased Roadmaps */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/85 shadow-md space-y-6">
                  <div className="border-b border-stone-100 pb-3">
                    <span className="text-xs font-mono text-stone-500 tracking-wider uppercase">Implementation Program</span>
                    <h3 className="font-serif text-2xl text-stone-900 mt-1">Multi-Phase Upskilling Roadmap</h3>
                  </div>

                  <div className="space-y-6">
                    {dynamicRoadmap?.roadmapPhases?.map((phase: any, index: number) => (
                      <div key={index} className="flex gap-4 items-start pb-6 last:pb-0 border-b border-stone-100 last:border-0">
                        <div className="w-8 h-8 bg-amber-400 text-stone-900 text-xs font-bold rounded-xl flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <h4 className="font-serif text-base text-stone-950 font-semibold">{phase.phaseTitle}</h4>
                            <span className="px-2 py-0.5 bg-stone-100 font-mono text-[10px] text-stone-600 rounded">
                              {phase.timeframe}
                            </span>
                          </div>
                          <p className="text-xs text-stone-700 font-medium">Focus Area: {phase.focusArea}</p>
                          <ul className="space-y-1.5 text-xs text-stone-600">
                            {phase.concreteActions?.map((act: string, i: number) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Communication Blueprint & Family Balance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* English Communication */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-md space-y-4">
                    <div className="flex gap-2 items-center text-stone-850">
                      <BookOpen className="w-5 h-5 text-amber-500" />
                      <h4 className="font-serif text-lg font-medium">English Speaking Booster</h4>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {dynamicRoadmap?.communicationBlueprint?.growthPlan}
                    </p>
                    <div className="pt-2 border-t border-stone-100 space-y-2">
                      <span className="text-[10px] font-mono text-stone-500 uppercase font-semibold">Suggested Daily Workout:</span>
                      <ul className="space-y-1 text-[11px] text-stone-600">
                        {dynamicRoadmap?.communicationBlueprint?.dailyExercises?.map((ex: string, i: number) => (
                          <li key={i} className="flex gap-1.5 items-start">
                            <Star className="w-3 h-3 text-amber-400 shrink-0 mt-0.5 fill-amber-300" />
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Decompression advice */}
                  <div className="bg-amber-50/40 p-6 rounded-3xl border border-amber-500/10 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex gap-2 items-center text-amber-900 font-serif text-lg">
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />
                        Family Peace & Stress Protection
                      </div>
                      <p className="text-xs text-stone-850 leading-relaxed font-sans">
                        <strong className="block text-amber-900 font-serif font-semibold text-sm mb-1">Transit Ritual:</strong>
                        {dynamicRoadmap?.stressToStrengthRituals?.decompressRitual}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-500/10">
                      <p className="text-xs text-stone-700 leading-relaxed font-sans">
                        <strong className="block text-stone-900 font-serif tracking-tight font-semibold mb-1">Family Safe-Entry Protocol:</strong>
                        {dynamicRoadmap?.stressToStrengthRituals?.familyProtectionRule}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
