import { useState, useRef, ChangeEvent } from "react";
import { 
  FileText, Sparkles, AlertCircle, Play, CheckCircle2, 
  HelpCircle, Lightbulb, ClipboardCopy, Wand2, Terminal, Upload
} from "lucide-react";
import { motion } from "motion/react";
import { ResumeAnalysisResult } from "../types";

const GENERIC_RESUME_TEMPLATE = `[PASTE YOUR RESUME HERE]
Full Name
Location | Phone | Email | LinkedIn

PROFESSIONAL SUMMARY
• Proactive industry expert with 15+ years of experience in product design and development.
• Specialized in concept design and process improvement.
• Skilled in production cost analysis and efficiency.
• Proficient in standard design tools and software.

SKILLS
Design & Software:
• Adobe Creative Suite
• Industry-standard design software (e.g., CAD, specialized tools)

Management:
• Production Management
• Project Coordination
• Process Optimization

WORK HISTORY
JOB TITLE | [DATE] to Present
[Company Name], [Location]
• Designed and developed solutions that align with brand identity and marketing needs.
• Delivered high-quality designs tailored to product requirements.
• Maintained precision and attention to detail in all deliverables.
• Ensured compliance with international standards and regulations.

EDUCATION
• [University Name], [Location]: [Degree Name]
• [Other Credentials]`;

export default function ResumeReSkilling() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      setErrorMessage("Please upload a PDF or text file.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage("");
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred while calling the analysis server.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  const [userPrompt, setUserPrompt] = useState("We need a medicine box packaging artwork design for cardiac syrup. It must be child-resistant, eco-friendly cardboard, medical colors. Generate detailed layout and print specification instructions.");
  const [isGeneratingPromptResult, setIsGeneratingPromptResult] = useState(false);
  const [promptResult, setPromptResult] = useState("");
  const [selectedPromptTip, setSelectedPromptTip] = useState("");

  const handleAnalyzeResume = async () => {
  };

  const handlePromptSandbox = async () => {
    if (!userPrompt.trim()) return;
    setIsGeneratingPromptResult(true);
    setPromptResult("");

    try {
      const response = await fetch("/api/chat-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              sender: "user",
              text: `Act as a senior Generative AI Packaging designer. Please respond to this prompting challenge by generating a structured, professional, and practical packaging layout requirement spec. Use clear formatting, simple bullet points, and explain how the designer can use this instructions directly in Adobe Illustrator or Autodesk Artios CAD. \nChallenge: ${userPrompt}`
            }
          ],
          contextType: "interview" // Get descriptive feedback
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setPromptResult(data.text);
    } catch {
      setPromptResult("Failed to simulate AI output. Please check your Gemini API key configuration.");
    } finally {
      setIsGeneratingPromptResult(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Pratical exercise details copied to clipboard!");
  };

  const promptTemplates = [
    {
      title: "Material Specifications",
      prompt: "Generate a comparison matrix of 3 eco-friendly materials that can replace standard PVC blister films in pharmaceutical liquid bottle caps. Include barrier properties, temperature threshold, and approximate production costs."
    },
    {
      title: "Generative Artwork Mock-ups",
      prompt: "You are designing packaging artwork for a premium infant food brand in Adobe Illustrator. Write a detailed, descriptive text prompt (Midjourney/Firefly style) to generate a minimalistic line-art illustration of playful clouds, soft pastel colors, and friendly forest birds."
    },
    {
      title: "Artwork Management Efficiency",
      prompt: "Draft an automated checklist script rules for checking FDA printing regulations on pharmaceutical cartoon labels. List what regulatory items must be checked on artwork automatically (e.g. font size, QR code active, inactive ingredients placement)."
    }
  ];

  return (
    <div className="space-y-8" id="reskilling-container">
      {/* Introduction Card */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/85 shadow-sm space-y-2">
        <h2 className="font-serif text-2xl text-stone-900">Career Re-Skilling Forge</h2>
        <p className="text-stone-600 text-sm leading-relaxed">
          Veterans in physical industries like packaging design, printing specifications, and production hold years of real-world knowledge that younger managers lack. This workspace teaches you how to map your deep experience to AI workflows, ensuring you aren't replacement targets, but AI-enhanced leaders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Resume uploader/input (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-stone-300 shadow-md space-y-6 flex flex-col items-center justify-center min-h-[400px] text-center" id="upload-box">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
               <Upload className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg text-stone-800">Upload Your Resume</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                PDF or text files accepted. Our AI Coach will analyze your professional experience and craft a personalized re-skilling roadmap immediately.
              </p>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".txt,.md,.pdf"
              onChange={handleFileUpload}
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-stone-900 hover:bg-stone-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition"
            >
              {isAnalyzing ? "Analyzing..." : "Select Resume File"}
            </button>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex gap-1.5 items-center text-xs text-red-700 text-left w-full">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Results (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Display welcome/instruction if no analysis results loaded yet */}
          {!analysisResult ? (
            <div className="bg-stone-50/60 border-2 border-dashed border-stone-200 rounded-3xl p-12 text-center space-y-4" id="placeholder-box">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-serif text-lg text-stone-800">Start Your Professional Analysis</h3>
                <p className="text-xs text-stone-550 leading-relaxed">
                  Click the <strong>Analyze Skills</strong> button on your resume to trigger an empathetic decomposition of your competencies into AI-powered career growth roadmaps.
                </p>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              id="analysis-results"
            >
              {/* Profile Overview */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200/85 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-stone-400 tracking-wider uppercase">Rebirth Profile</span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] rounded font-bold font-mono uppercase">Analyzed</span>
                </div>
                
                <h3 className="font-serif text-2xl text-stone-900 border-b border-stone-100 pb-2">
                  {analysisResult.candidateName}
                </h3>
                
                <p className="text-stone-700 text-sm leading-relaxed italic border-l-2 border-amber-300 pl-4 py-1">
                  "{analysisResult.parsedSummary}"
                </p>
              </div>

              {/* Strengths and Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
                  <h4 className="text-xs font-mono font-bold text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Premium Core Assets
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-700 font-sans font-medium">
                    {analysisResult.identifiedStrengths.map((str, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-stone-400 font-mono mt-0.5">{idx + 1}.</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
                  <h4 className="text-xs font-mono font-bold text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Market Workflows Gaps
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-700 font-sans font-medium">
                    {analysisResult.gapsToIndustryTrends.map((gap, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-amber-500 font-mono mt-0.5">•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Re-skilling Tabulation */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200/85 shadow-md space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-serif text-lg text-stone-850">Your Modern Skill Mapping</h4>
                  <span className="text-[10px] font-mono text-stone-400">4 Core Transformations</span>
                </div>

                <motion.div 
                  className="space-y-4"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {analysisResult.skillsBreakdown.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0 },
                      }}
                      className="p-5 bg-stone-50/60 rounded-2xl border border-stone-200/70 space-y-3 hover:border-amber-200 transition"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/40 pb-2">
                        <span className="text-xs font-mono font-extrabold text-stone-700">
                          {idx + 1}. {item.traditionalSkill}
                        </span>
                        <span className="px-2 py-0.5 bg-amber-400/10 text-amber-800 border border-amber-300/30 text-[10px] font-mono rounded font-medium">
                          {item.timeframe} Mastery
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="font-semibold text-[10px] text-stone-550 uppercase tracking-wider block">AI Workflow Equivalent:</span>
                          <span className="text-stone-850 font-medium">{item.aiEraEquivalent}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold text-[10px] text-stone-550 uppercase tracking-wider block font-mono">Conceptual Gap to Bridge:</span>
                          <span className="text-stone-600 leading-normal">{item.conceptualGap}</span>
                        </div>
                      </div>

                      {/* 30-min exercise */}
                      <div className="mt-2 p-3 bg-white border border-stone-250/50 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono font-bold text-amber-700 uppercase flex items-center gap-1">
                          <Play className="w-2.5 h-2.5 fill-amber-700" />
                          Practical Exercise (35 minutes):
                        </span>
                        <p className="text-xs text-stone-650 leading-relaxed italic">{item.handsOnExercise}</p>
                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 font-mono">
                          <span>Start here: <strong className="text-stone-700 font-medium">{item.learningResource}</strong></span>
                          <button
                            onClick={() => copyToClipboard(`${item.handsOnExercise}\nReference: ${item.learningResource}`)}
                            className="text-stone-500 hover:text-stone-800 flex items-center gap-1 transition"
                            title="Copy exercise details to clipboard"
                          >
                            <ClipboardCopy className="w-3.5 h-3.5" />
                            Copy
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Interactive AI Play Sandbox */}
          <div className="bg-stone-900 text-stone-100 rounded-3xl shadow-xl p-8 space-y-6" id="playground">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/15 border border-amber-500/25 rounded font-mono text-[10px] text-amber-400 uppercase tracking-wider">
                <Terminal className="w-3 h-3" />
                Live Prompting Sandbox
              </div>
              <h3 className="font-serif text-2xl text-white">Interact with Modern AI</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Modern designers use AI by writing "Prompts"—clear instructions that direct models. Paste one of our templates below, modify it, and run it to see how the model outputs fully detailed layout blueprints instantly.
              </p>
            </div>

            {/* Template Buttons */}
            <div className="flex flex-wrap gap-2.5">
              {promptTemplates.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setUserPrompt(tpl.prompt);
                    setSelectedPromptTip(tpl.title);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                    selectedPromptTip === tpl.title
                      ? "bg-amber-400 text-stone-900 border-amber-400"
                      : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750"
                  }`}
                >
                  Template: {tpl.title}
                </button>
              ))}
            </div>

            {/* Prompt Textbox */}
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  id="sandbox-prompt-textbox"
                  className="w-full h-28 p-4 bg-stone-950 text-stone-200 border border-stone-800 rounded-2xl text-xs focus:outline-none focus:border-stone-700 leading-normal"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-stone-500">Writing in standard english/technical scope.</span>
                <button
                  id="btn-sandbox-submit"
                  onClick={handlePromptSandbox}
                  disabled={isGeneratingPromptResult || !userPrompt.trim()}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-950 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition"
                >
                  {isGeneratingPromptResult ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      Generating Spec...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      Execute Custom Prompt
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sandbox Prompt Result Display */}
            {promptResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-5 bg-stone-950 border border-stone-800 rounded-2xl space-y-3"
                id="sandbox-output"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 border-b border-stone-800 pb-2">
                  <span>AI SPECIFICATION SCHEMA OUTPUT</span>
                  <span>SUCCESSFUL RESPONSE</span>
                </div>
                <div className="text-xs text-stone-300 leading-relaxed font-sans whitespace-pre-wrap max-h-72 overflow-y-auto pr-1">
                  {promptResult}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
