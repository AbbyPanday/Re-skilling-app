import { useState } from "react";
import { 
  Sparkles, Star, Mic, Play, RefreshCw, Send, CheckCircle2, 
  Lightbulb, ArrowRight, HelpCircle, BookOpen, MessageSquare 
} from "lucide-react";
import { motion } from "motion/react";
import { Message } from "../types";
import { useUserContext } from "../lib/UserContext";

interface VocabCard {
  term: string;
  pronunciation: string;
  definition: string;
  exampleSentence: string;
}

const PACKAGING_VOCAB_CARDS: VocabCard[] = [
  {
    term: "Parametric Design CAD",
    pronunciation: "pa-ra-ME-trik deh-ZINE cad",
    definition: "Using mathematical equations and flexible variables to design 3D packaging outlines automatically resizing based on bottle height/width.",
    exampleSentence: "We utilized parametric design CAD to automatically scale our clinical syrup boxes across multiple volumes."
  },
  {
    term: "Regulatory Printing Compliance",
    pronunciation: "reh-gyoo-la-tor-ee PRIN-ting kum-PLY-ence",
    definition: "Ensuring all legal requirements (like FDA warnings, legible ingredients font sizes, and barcode placements) are 100% accurate before bulk manufacturing.",
    exampleSentence: "I supervised regulatory printing compliance to align our artworks with global pharmaceutical guidelines."
  },
  {
    term: "Artwork Assets Management (AAM)",
    pronunciation: "ART-work ass-ets MAN-aj-ment",
    definition: "A secure digital system to organize, track, and approve graphic layout revisions, preventing old packaging versions from entering the factory line.",
    exampleSentence: "Our team modernized the studio workflow by integrating automated artwork assets management channels."
  },
  {
    term: "Material Specifications Checklist",
    pronunciation: "muh-TEER-ee-ul spe-si-fi-KAY-shunz check-list",
    definition: "A technical list of physical factors (thickness, moisture barrier, environmental footprint, tensile threshold) before matching a bottle with bulk cartons.",
    exampleSentence: "I drafted a detailed material specifications checklist to choose eco-friendly cardboard cap liners for our liquid division."
  }
];

export default function SpeakerGym() {
  const { languageLevel } = useUserContext();
  // Word Finder state
  const [roughIdea, setRoughIdea] = useState("we make boxes for syrup and medicine, very fast, no mistake, check by rules");
  const [isRefining, setIsRefining] = useState(false);
  const [refinedOutput, setRefinedOutput] = useState<any>(null);

  // Vocab State
  const [activeVocabIdx, setActiveVocabIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Interview state
  const [interviewMessages, setInterviewMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "assistant",
      text: "Hello! I am Aditi, your friendly practice evaluator. We are looking for an experienced packaging leader who understands traditional layouts but wants to lead digital artwork automation teams. Could you tell me about your experience managing artwork files?",
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleRefineEnglish = async () => {
    if (!roughIdea.trim()) return;
    setIsRefining(true);
    setRefinedOutput(null);

    try {
      const response = await fetch("/api/word-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roughIdea })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setRefinedOutput(data);
    } catch {
      setRefinedOutput({
        originalIdea: roughIdea,
        assertiveLeader: "We specialized in delivering zero-defect pharmaceutical packaging artworks, aligning strictly with international printing standards.",
        safeEmail: "I am writing to confirm that our artwork management pipeline ensures 100% compliance with regulatory print guidelines, maintaining zero production errors.",
        simpleImpactful: "We designed medical boxes quickly, ensuring zero printing errors.",
        keyVocabulary: [
          { term: "Zero-defect", meaning: "Absolutely perfect without any mistakes." },
          { term: "Regulatory print guidelines", meaning: "Legal printing rules setup by authorities." }
        ],
        coachesNote: "Do not worry about long speeches! Focus on active nouns. You did incredible—practice saying 'Zero-defect' out loud."
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleSendInterviewMessage = async () => {
    if (!userInput.trim() || isSending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    setInterviewMessages(prev => [...prev, userMsg]);
    const originalInput = userInput;
    setUserInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...interviewMessages, userMsg],
          contextType: "interview"
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      setInterviewMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      }]);
    } catch {
      setInterviewMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "That sounds like a very practical approach! Let me ask you this next: How do you handle stressful deadlines in packaging production lines when artwork changes at the last minute?",
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8" id="speakergym-container">
      {/* Intro section */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/85 shadow-sm space-y-2">
        <h2 className="font-serif text-2xl text-stone-900">English Confidence Gym</h2>
        <p className="text-stone-600 text-sm leading-relaxed">
          Weak spoken English or a lock of words in tight meetings can lead to severe career blockage. Speak with confidence here. This gym helps you build oral speech agility, find your terms instantly, and practice interview questions without any worry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Word Finder & Vocab Flashcards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Word Finder Tool */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/85 shadow-md space-y-4" id="word-finder">
            <div>
              <span className="text-[10px] font-mono text-amber-600 tracking-wider font-semibold uppercase">The Word Finder</span>
              <h3 className="font-serif text-lg text-stone-900 leading-tight">Refine Your Rough Ideas</h3>
              <p className="text-stone-500 text-xs mt-1 leading-normal">
                Struggling to find the words? Type what you mean in broken English, fragmented terms, or raw notes. The AI will design polished elite alternatives.
              </p>
            </div>

            <textarea
              id="rough-expression-textbox"
              className="w-full h-24 p-3.5 bg-stone-50/75 border border-stone-200 rounded-2xl text-xs font-sans focus:outline-none focus:border-stone-400 focus:bg-white text-stone-800 leading-normal"
              value={roughIdea}
              onChange={(e) => setRoughIdea(e.target.value)}
              placeholder="e.g. I do art designs in illustrator, print guidelines check is very tedious work..."
            />

            <button
              id="btn-refine"
              onClick={handleRefineEnglish}
              disabled={isRefining || !roughIdea.trim()}
              className="w-full py-3 bg-stone-950 hover:bg-stone-805 disabled:opacity-50 text-white rounded-xl text-xs font-semibold hover:border-stone-400 transition inline-flex items-center justify-center gap-1.5 shadow"
            >
              {isRefining ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-stone-300 border-t-white rounded-full animate-spin" />
                  Grooming polished options...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-305" />
                  Elevate My Phrasing
                </>
              )}
            </button>

            {/* Word Finder Refinery Output */}
            {refinedOutput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 border border-amber-100 bg-amber-50/20 rounded-2xl space-y-4 text-xs font-sans"
                id="word-refinery-result"
              >
                <div className="space-y-1.5">
                  <span className="font-mono text-[9px] text-stone-400 uppercase tracking-widest block font-bold">1. Meeting Speaking ("The Assertive Leader"):</span>
                  <p className="font-serif text-stone-900 italic font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-stone-100">
                    "{refinedOutput.assertiveLeader}"
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-mono text-[9px] text-stone-400 uppercase tracking-widest block font-bold">2. Standard Email ("The Safe Corporate"):</span>
                  <p className="text-stone-700 leading-normal bg-white p-2.5 rounded-lg border border-stone-100">
                    "{refinedOutput.safeEmail}"
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-mono text-[9px] text-stone-400 uppercase tracking-widest block font-bold">3. Easy Speaking ("Simple but Impactful"):</span>
                  <p className="font-mono text-stone-800 leading-relaxed bg-white p-2.5 rounded-lg border border-stone-100">
                    "{refinedOutput.simpleImpactful}"
                  </p>
                </div>

                <div className="p-3 bg-stone-950 text-stone-200 rounded-xl space-y-1">
                  <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider block">Coach's Practical Tip:</span>
                  <p className="text-[11px] text-stone-300 leading-relaxed italic">"{refinedOutput.coachesNote}"</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Expert Packaging Vocab Flashcard */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/85 shadow-md space-y-4" id="vocab-gym">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-stone-400 tracking-wider uppercase">Vocabulary Gym</span>
                <h3 className="font-serif text-sm font-semibold">Packaging Pronunciation Workout</h3>
              </div>
              <button 
                onClick={() => {
                  setActiveVocabIdx(prev => (prev + 1) % PACKAGING_VOCAB_CARDS.length);
                  setIsFlipped(false);
                }}
                className="p-1.5 hover:bg-stone-50 rounded-lg text-stone-500 transition"
                title="Next term"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Flashcard Area */}
            <div 
              onClick={() => setIsFlipped(p => !p)}
              className={`p-6 rounded-2xl border cursor-pointer min-h-48 flex flex-col justify-between transition-all duration-300 ${
                isFlipped 
                  ? "bg-stone-900 border-stone-805 text-white" 
                  : "bg-stone-50/50 hover:bg-stone-55 border-stone-200 text-stone-900"
              }`}
              id="vocab-flashcard"
            >
              {!isFlipped ? (
                <div className="space-y-3 flex-grow flex flex-col justify-center text-center">
                  <span className="text-xl font-serif font-bold text-stone-950 tracking-tight block">
                    {PACKAGING_VOCAB_CARDS[activeVocabIdx].term}
                  </span>
                  <span className="text-xs font-mono text-amber-600 block bg-amber-50 rounded px-2.5 py-1 max-w-fit mx-auto border border-amber-100">
                    🗣️ {PACKAGING_VOCAB_CARDS[activeVocabIdx].pronunciation}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono pt-3 block">(Click anywhere to reveal definition)</span>
                </div>
              ) : (
                <div className="space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">Technical Meaning:</span>
                    <p className="text-xs text-stone-200 leading-normal font-medium">{PACKAGING_VOCAB_CARDS[activeVocabIdx].definition}</p>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-stone-800">
                    <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Oral Practice Drill:</span>
                    <p className="text-xs text-stone-100 italic font-serif leading-snug">"{PACKAGING_VOCAB_CARDS[activeVocabIdx].exampleSentence}"</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center text-[10px] text-stone-500 font-mono">
              <span>Card {activeVocabIdx + 1} of {PACKAGING_VOCAB_CARDS.length}</span>
              <span>Say the example sentence physically 3 times out loud.</span>
            </div>
          </div>
        </div>

        {/* Right column: HR Interview Practice Platform (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200/85 shadow-md flex flex-col justify-between min-h-[620px]" id="live-interview">
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between border-b pb-4 border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-amber-100 text-amber-850 rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
                  👩🏽‍💻
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-stone-900 leading-tight">Coach Aditi</h4>
                  <span className="text-[10px] text-green-500 font-mono font-bold uppercase flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block" />
                    Interactive Simulator Mode
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-stone-500">Practice speaking answers here</span>
            </div>

            {/* Guidelines box */}
            <div className="p-3 bg-amber-50 text-[11px] text-stone-700 rounded-xl leading-relaxed font-sans border-l-3 border-amber-400">
              💡 <strong>How to practice:</strong> Answer Aditi's question below. Don't worry about spelling. She will extract your core points, highlight your values, and write out a beautiful alternative corporate phrasing you can copy.
            </div>

            {/* Chat message array */}
            <div className="border border-stone-100 bg-stone-50/50 rounded-2xl p-5 h-[340px] overflow-y-auto space-y-4 flex flex-col" id="interview-scroller">
              {interviewMessages.map((m) => {
                const isUser = m.sender === "user";
                return (
                  <div
                    key={m.id}
                    className={`max-w-[90%] flex flex-col space-y-1 ${isUser ? "self-end items-end" : "self-start items-start"}`}
                  >
                    <div
                      className={`px-4.5 py-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
                        isUser
                          ? "bg-stone-900 text-stone-100 rounded-tr-none"
                          : "bg-white text-stone-800 border border-stone-205 shadow-sm rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-line font-sans">{m.text}</p>
                    </div>
                    <span className="text-[9px] font-mono text-stone-400 px-1">{m.timestamp}</span>
                  </div>
                );
              })}
              {isSending && (
                <div className="self-start max-w-[90%] flex items-center gap-2 px-4 py-3 bg-white text-stone-550 border border-stone-200/50 rounded-2xl shadow-sm text-xs font-medium">
                  <span className="animate-pulse">Aditi is molding supportive feedback...</span>
                </div>
              )}
            </div>
          </div>

          {/* User Input & Send Row */}
          <div className="space-y-2" id="interview-control">
            <div className="flex gap-3">
              <input
                id="interview-input-field"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendInterviewMessage()}
                placeholder="Type your interview answer (e.g., 'I run Sun Pharma artwork designs using Illustator, we check for mistakes before making capSpec')..."
                className="flex-grow px-4.5 py-3.5 bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white rounded-2xl text-xs font-sans text-stone-800 transition"
              />
              <button
                id="btn-interview-send"
                onClick={handleSendInterviewMessage}
                disabled={!userInput.trim() || isSending}
                className="px-5 py-3 bg-stone-950 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold transition inline-flex items-center gap-1.5 shadow"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono px-1">
              <span>Try speaking simple broken phrases first—Aditi handles it beautifully.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
