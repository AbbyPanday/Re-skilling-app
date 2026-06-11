import { useState } from "react";
import { MessageSquare, Sparkles, Smile, ArrowRight, Heart, Shield, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { Message } from "../types";

const HEALING_AFFIRMATIONS = [
  "Twenty-plus years of active contribution in R&D and design is not legacy—it is the premium foundation for your rebirth.",
  "Your mastery of materials, standards, and production holds wisdom that no AI can mimic; you are merely upgrading your tools.",
  "You are allowed to feel tired. You are allowed to take off the armor of always being perfect. You are still fully capable of starting fresh.",
  "Tension at home is a signal to decompress, not a reflection of your worth. You are a loved father and husband first, and a worker second."
];

export default function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [decompressionAdvice, setDecompressionAdvice] = useState<string>("");

  // Counselor Chat State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "assistant",
      text: "Namaste. I am Sanjeev, your quiet mental space. If today was grueling, if you couldn't find the terms in the meeting, or if you feel the heavy weight of being 'too old' for the market, let's unpack it together. You don't have to sound perfect here.",
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
    );
  };

  const handleCheckIn = () => {
    if (moodRating === null) return;
    setHasCheckedIn(true);

    // Provide warm, instant therapeutic decompression based on answers
    let advice = "";
    if (moodRating <= 4) {
      advice = "Your cup is entirely drained. The frustration you are carrying is physical. Before you enter your house today or sit with family, wash your face, breathe deeply in the bathroom or step outside for 5 minutes, and say out loud: 'I leave the warehouse and corporate weight behind. My family loves me, not my output.'";
    } else if (moodRating <= 7) {
      advice = "You are holding up, but carrying quiet exhaustion. Give yourself permission to say 'I need 15 minutes of quiet zone' when you get home, rather than forcing yourself to immediately match everyone's energy. It protects both you and them.";
    } else {
      advice = "There is clear light in your spirit today. Channel this energy to learn one new word or prompt. You are making silent progress.";
    }
    setDecompressionAdvice(advice);
  };

  const handleSendChat = async () => {
    if (!userInput.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    const originalInput = userInput;
    setUserInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
          contextType: "wellness"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from counselor");
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      }]);
    } catch (error: any) {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "I am having trouble connecting with my inner thoughts right now, but please know that you are heard. Deep breath. Your value is untouched by server issues.",
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8" id="dashboard-container">
      {/* Empathetic Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 to-stone-950 p-8 md:p-12 rounded-3xl text-stone-100 shadow-xl border border-stone-800" id="hero-banner">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-80 h-80 bg-stone-700/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-mono tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Designed for the Experienced & Unfinished
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-white leading-tight">
            Left behind by the market? <br />
            <span className="text-amber-300 italic">Not finished yet.</span>
          </h1>
          
          <p className="text-stone-400 text-sm md:text-base leading-relaxed max-w-2xl">
            With 20+ years of hand-built production and specification expertise, you are not outdated—you are merely ready for an upgrade. Phoenix helps veterans convert their foundational knowledge into state-of-the-art AI design practices, master spoken English, and manage retirement/career stress.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              id="btn-nav-re-skilling"
              onClick={() => onNavigate("reskilling")}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-900 font-medium rounded-full inline-flex items-center gap-2 transition duration-200"
            >
              Analyze Resume & Learn AI
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              id="btn-nav-quiz"
              onClick={() => onNavigate("quiz")}
              className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium rounded-full inline-flex items-center gap-2 transition duration-200 border border-stone-700"
            >
              Take the Mental Quiz
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid: Mindset Affirmation & Wellness Check-in */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Life Coach & Affirmations (5 Cols) */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
          {/* Affirmation Card */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-md relative group flex-1 flex flex-col justify-between space-y-6" id="affirmation-card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-500 tracking-wider uppercase">Dignity Reflection</span>
                <button 
                  onClick={() => setAffirmationIdx((prev) => (prev + 1) % HEALING_AFFIRMATIONS.length)}
                  className="p-1 hover:bg-stone-100 rounded-full transition text-stone-500"
                  title="Next reflection"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              
              <blockquote className="font-serif text-lg md:text-xl text-stone-800 leading-relaxed italic">
                "{HEALING_AFFIRMATIONS[affirmationIdx]}"
              </blockquote>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-stone-100 text-xs text-stone-500">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
              <span>Take a deep breath. Read this slowly. You hold unparalleled value.</span>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/10 flex gap-4 items-start" id="info-box">
            <div className="p-3 bg-amber-500/10 text-amber-700 rounded-2xl shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-stone-800">100% Secure & Judgement-Free</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Your resume, quiz answers, and spoken English attempts are completely private. Practice as many times as you need to find your word-flow.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Personal Stress Thermometer & Check-in (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-stone-200/80 shadow-md space-y-6" id="checkin-panel">
          <div>
            <span className="text-xs font-mono text-stone-500 tracking-wider uppercase">Supportive Interception</span>
            <h2 className="font-serif text-2xl text-stone-900 mt-1">Decompress Before Going Home</h2>
            <p className="text-stone-600 text-sm mt-1 leading-relaxed">
              Don't let office resentment hurt the people you work hard for. Check in your stress level right now.
            </p>
          </div>

          {!hasCheckedIn ? (
            <div className="space-y-6">
              {/* Slider/Mood Scale */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-medium text-stone-700">How heavy does your head/chest feel right now? (1 = Low Stress, 10 = High Pressure)</label>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setMoodRating(num)}
                      className={`w-full py-3.5 text-center text-sm font-semibold rounded-2xl border transition-all ${
                        moodRating === num 
                          ? "bg-stone-900 text-white border-stone-900 scale-105 shadow-md" 
                          : "bg-stone-50/50 hover:bg-stone-100 text-stone-700 border-stone-200/60"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 px-1 font-mono">
                  <span>Peaceful / Light</span>
                  <span>Extremely Stressed / Burning Out</span>
                </div>
              </div>

              {/* Emotion selectors */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-medium text-stone-700">Identify your underlying feelings (Choose any):</label>
                <div className="flex flex-wrap gap-2">
                  {["Anxious about speech", "Underappreciated", "Frustrated with tasks", "Worried for future", "Speech hesitation", "Tired of office politics", "Guilty toward family", "Fear of tech"].map((emotion) => {
                    const isSelected = selectedEmotions.includes(emotion);
                    return (
                      <button
                        key={emotion}
                        onClick={() => toggleEmotion(emotion)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                          isSelected 
                            ? "bg-amber-100 text-amber-800 border-amber-300 shadow-sm" 
                            : "bg-white hover:bg-stone-50 text-stone-600 border-stone-200"
                        }`}
                      >
                        {emotion}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                id="btn-checkin-submit"
                onClick={handleCheckIn}
                disabled={moodRating === null}
                className="w-full py-3.5 bg-stone-950 hover:bg-stone-800 disabled:opacity-50 disabled:hover:bg-stone-950 text-white text-sm font-medium rounded-2xl transition duration-150 inline-flex items-center justify-center gap-2 shadow"
              >
                Assemble My Decompression Guide
                <Smile className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-2"
              id="decompression-result"
            >
              <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100/80 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 text-sm font-bold">
                    🛡️
                  </div>
                  <h4 className="font-serif text-lg text-amber-900">Your Transit Protection Ritual</h4>
                </div>
                <div className="text-sm text-stone-800 leading-relaxed font-sans font-medium whitespace-pre-line">
                  {decompressionAdvice}
                </div>
                <div className="p-4 bg-white/70 border border-amber-200/50 rounded-xl text-xs text-stone-600 space-y-1.5">
                  <span className="font-semibold block text-stone-800">Let Out Exercise:</span>
                  <p>Inhale deeply for 4 seconds, hold for 4 seconds, exhale entirely for 6 seconds. When you breathe out, drop your shoulders. Let the office arguments blow away.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  id="btn-checkin-reset"
                  onClick={() => {
                    setHasCheckedIn(false);
                    setMoodRating(null);
                    setSelectedEmotions([]);
                  }}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition"
                >
                  Change mood stats
                </button>
                <button
                  id="btn-speak-coach"
                  onClick={() => onNavigate("gym")}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-semibold rounded-xl transition inline-flex items-center gap-1.5"
                >
                  Step into English Confidence Gym
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Counseling Messenger "Sanjeev" */}
      <section className="bg-white rounded-3xl border border-stone-200/80 shadow-md p-8 space-y-6" id="sanjeev-messenger">
        <div>
          <span className="text-xs font-mono text-stone-500 tracking-wider uppercase">Safe Sanctuary</span>
          <h2 className="font-serif text-2xl text-stone-900 mt-1 inline-flex items-center gap-2">
            Talk to Sanjeev
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            An empathetic coach who understands workplace plateaus, fear of aging, and feelings of displacement. Talk to him in English, simple fragments, or broken ideas.
          </p>
        </div>

        {/* Chat History */}
        <div className="border border-stone-100 rounded-2xl bg-stone-50/50 p-6 h-80 overflow-y-auto space-y-4 flex flex-col" id="chat-scroller">
          {chatMessages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div 
                key={m.id} 
                className={`max-w-[85%] flex flex-col space-y-1 ${isUser ? "self-end items-end" : "self-start items-start"}`}
              >
                <div 
                  className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                    isUser 
                      ? "bg-stone-900 text-white rounded-tr-none" 
                      : "bg-white text-stone-800 border border-stone-200 shadow-sm rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className="text-[10px] font-mono text-stone-400 px-1">{m.timestamp}</span>
              </div>
            );
          })}
          {isSending && (
            <div className="self-start max-w-[85%] flex items-center gap-2 px-4 py-3 bg-white text-stone-500 border border-stone-200/50 rounded-2xl shadow-sm text-xs font-medium">
              <span className="animate-pulse">Sanjeev is reading and feeling your message...</span>
            </div>
          )}
        </div>

        {/* Chat input form */}
        <div className="flex gap-3" id="chat-input-row">
          <input
            id="chat-input-field"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
            placeholder="Type your concern (e.g. 'I feel completely stuck at my current company', 'I am afraid I can never learn AI')..."
            className="flex-grow px-5 py-3.5 bg-stone-50/50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-stone-400 focus:bg-white text-stone-800 transition"
          />
          <button
            id="btn-chat-send"
            onClick={handleSendChat}
            disabled={!userInput.trim() || isSending}
            className="px-6 py-3.5 bg-stone-950 hover:bg-stone-800 text-white rounded-2xl text-sm font-semibold transition inline-flex items-center gap-2 shadow"
          >
            <span>Send Message</span>
            <MessageSquare className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </section>
    </div>
  );
}
