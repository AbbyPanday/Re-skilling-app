import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
const pdf = require('pdf-parse');

dotenv.config();

const app = express();
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const PORT = 3000;

// Lazy initialization of Gemini client to prevent crash if key is missing or incomplete
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
      throw new Error("GEMINI_API_KEY is missing or configured as a placeholder. Please configure your API key in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Analyze Resume Endpoint
app.post("/api/analyze-resume", upload.single("resume"), async (req, res: any) => {
  try {
    let resumeText = "";
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdf(req.file.buffer);
        resumeText = data.text;
      } else if (req.file.mimetype === 'text/plain') {
        resumeText = req.file.buffer.toString();
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }
    } else {
      resumeText = req.body.resumeText;
    }
    
    if (!resumeText) {
      return res.status(400).json({ error: "Resume text or file is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a world-class empathetic career transition coach and senior industrial talent supervisor. Your specialty is helping veteran professionals (20+ years of experience) who are feeling stuck, outdated, or left behind by the current job market and AI revolution.
Your task is to analyze the user's resume, validate their rich foundational skills, and outline a realistic, high-confidence, non-intimidating practical path to integrate current industry trends and custom Modern AI-augmented workflows.
Focus specifically on packaging, artwork design, pharma specifications, production, and print management if their resume relates to it (like the pre-populated case of Jagdish Chandra Panda, but adapt to other resumes).
We will bridge traditional drafting and design software (Adobe Illustator, InDesign, CAD, artiosCAD) to modern generative design tools, automated packaging specifications pipelines, and visual mock-up automation.
In addition, suggest concrete ways they can frame their 20+ years of experiences as a primary asset (Strategic R&D Leader, Automation Artwork Supervisor) rather than a barrier.
Output the result strictly matching the requested JSON structure. Keep descriptions encouraging, supportive, and extremely practical. Avoid complex academic jargon.`;

    const prompt = `Here is the candidate's resume content:\n\n${resumeText}\n\nPlease analyze this resume and map their current accomplishments to practical AI skills, conceptual gaps, concrete exercises they can do in 30 minutes, and modern careers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["candidateName", "parsedSummary", "identifiedStrengths", "gapsToIndustryTrends", "suggestedAIPersonas", "skillsBreakdown"],
          properties: {
            candidateName: {
              type: Type.STRING,
              description: "Full name of the candidate detected from the resume"
            },
            parsedSummary: {
              type: Type.STRING,
              description: "An encouraging, highly empathetic summary showcasing how their structural skills are invaluable in the modern market"
            },
            identifiedStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Top 3 or 4 traditional core architectural/leadership strengths from their historical work"
            },
            gapsToIndustryTrends: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key workflow evolutions they must bridge (e.g. generative mockup modeling, parametric AI CAD, workflow speed requirements)"
            },
            suggestedAIPersonas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Modern professional personas they fit, like: 'AI-Augmented Packaging Lead', 'Sustainable Artwork Director', 'Strategic Manufacturing Advisor'"
            },
            skillsBreakdown: {
              type: Type.ARRAY,
              description: "Breakdown mapping traditional tools to their AI-enhanced workflows",
              items: {
                type: Type.OBJECT,
                required: ["traditionalSkill", "aiEraEquivalent", "conceptualGap", "handsOnExercise", "learningResource", "timeframe"],
                properties: {
                  traditionalSkill: { type: Type.STRING, description: "E.g., Adobe Illustrator artwork design" },
                  aiEraEquivalent: { type: Type.STRING, description: "E.g., Vector Generative AI (Firefly, Midjourney Prompting) & automated mockup generators" },
                  conceptualGap: { type: Type.STRING, description: "Understanding descriptive prompts instead of click-and-drag manual modifications" },
                  handsOnExercise: { type: Type.STRING, description: "A highly practical 30-minute practice step they can do today" },
                  learningResource: { type: Type.STRING, description: "Where to start learning or standard workflows" },
                  timeframe: { type: Type.STRING, description: "Time to get comfortable (e.g., '3 days', '1 week')" }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    res.json(JSON.parse(resultText || "{}"));
  } catch (error: any) {
    console.error("Error in /api/analyze-resume:", error);
    res.status(500).json({ error: error.message || "Failed to analyze resume" });
  }
});

// 2. Generate Career Persona Roadmap from Mental Quiz
app.post("/api/generate-roadmap", async (req, res: any) => {
  try {
    const { answeredQuiz, selectedPersonaTitle } = req.body;
    if (!selectedPersonaTitle) {
      return res.status(400).json({ error: "Selected persona title is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a supportive life coach, mental wellness advisor, and professional career architect.
Your mission is to craft a customized 'Phoenix Rebirth Roadmap' for a veteran professional transitioning into: ${selectedPersonaTitle}.
Recognize that their challenges are division-level or stress-level plateaus: feeling left behind, experiencing self-doubt, lacking English confidence, and letting out workplace frustration onto family members because of exhaustion.
Create a supportive, highly constructive, phased game plan. This blueprint must cover:
1. Technical Modernization (learning 1-2 AI tools)
2. English/Communication Confidence booster
3. Emotional Balance & Family peace (specifically how to decompress before stepping home so they don't let current office frustration out on children or partners)
4. Confidence building rituals.`;

    const prompt = `The user answered a mental alignment quiz and was assigned the career persona: "${selectedPersonaTitle}".
User raw answers context: ${JSON.stringify(answeredQuiz || {})}.
Please create a comprehensive rebirth blueprint in JSON format matching the schema requested below. Make sure it sounds deeply empathetic and supportive. Let them feel that they are NOT finished yet—their journey is just getting started properly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["assignedPersona", "corePhilosophy", "roadmapPhases", "communicationBlueprint", "stressToStrengthRituals"],
          properties: {
            assignedPersona: { type: Type.STRING },
            corePhilosophy: { type: Type.STRING, description: "A heartwarming, poetic core motto for this career chapter (e.g. 'A master craftsman honors the past by leading the future')" },
            roadmapPhases: {
              type: Type.ARRAY,
              description: "A 3-phase journey representing steps to emerge again",
              items: {
                type: Type.OBJECT,
                required: ["phaseTitle", "timeframe", "focusArea", "concreteActions"],
                properties: {
                  phaseTitle: { type: Type.STRING, description: "E.g., Phase 1: Mindset Reset & Micro-Skillups" },
                  timeframe: { type: Type.STRING, description: "E.g., Days 1 to 15" },
                  focusArea: { type: Type.STRING, description: "Clear focus, e.g., Embracing generative templates for artworks" },
                  concreteActions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 distinct action bullet points"
                  }
                }
              }
            },
            communicationBlueprint: {
              type: Type.OBJECT,
              required: ["growthPlan", "dailyExercises"],
              properties: {
                growthPlan: { type: Type.STRING, description: "Practical advise for weak spoken English speakers: how to write summaries, use AI to prepare key points, and keep phrases simple and concise" },
                dailyExercises: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "2 simple speaking micro-exercises (e.g., recording 1-minute audio recaps of work results)"
                }
              }
            },
            stressToStrengthRituals: {
              type: Type.OBJECT,
              required: ["decompressRitual", "familyProtectionRule"],
              properties: {
                decompressRitual: { type: Type.STRING, description: "A powerful, simple physical decompression exercise to do for 5-10 minutes transition right after leaving the office (e.g. deep diaphragmatic breathing technique on the bus, washing face before exiting work, listening to a peaceful song) to shed office distress" },
                familyProtectionRule: { type: Type.STRING, description: "A practical advice on how to communicate stress to family: e.g., 'Entering with silent time' protocol where candidate says 'I had an exhausting day, I need 10 minutes to sit silently and transition, then I am fully here for you all.' This saves them from letting anger slide onto loved ones." }
              }
            }
          }
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in /api/generate-roadmap:", error);
    res.status(500).json({ error: error.message || "Failed to generate roadmap" });
  }
});

// 3. Word Finder & Corporate English Refiner
app.post("/api/word-finder", async (req, res: any) => {
  try {
    const { roughIdea } = req.body;
    if (!roughIdea) {
      return res.status(400).json({ error: "Rough drafting expression is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a patient, encouraging language mentor who helps senior professionals express their high-level expertise in elegant, natural, confident English.
The user is a very knowledgeable veteran who. due to low english practice, struggles to speak fluently or find the right phrases under pressure, resulting in heavy frustration.
Your job is to translate their broken, simple, or fragmented ideas into three beautiful professional registers:
1. "The Assertive Leader" (confident, active speaking for meetings or interviews)
2. "The Safe & Professional Email" (written corporate communication)
3. "The Simple but Impactful" (minimal words, high impact—extremely helpful when finding specific words feels too heavy/difficult).
Provide constructive guidance explaining WHY the phrases work, along with key vocabulary terms.`;

    const prompt = `Translate and expand this rough, fragmented idea into professional English expressions: "${roughIdea}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["originalIdea", "assertiveLeader", "safeEmail", "simpleImpactful", "keyVocabulary", "coachesNote"],
          properties: {
            originalIdea: { type: Type.STRING },
            assertiveLeader: { type: Type.STRING, description: "Assertive, confident spoken phrase for a meeting" },
            safeEmail: { type: Type.STRING, description: "Impeccably polished email body sentence" },
            simpleImpactful: { type: Type.STRING, description: "A very brief, powerful, and easy-to-remember spoken sentence" },
            keyVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["term", "meaning"],
                properties: {
                  term: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                }
              }
            },
            coachesNote: { type: Type.STRING, description: "A brief, gentle coaching tip explaining the main structure and telling them they did great." }
          }
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in /api/word-finder:", error);
    res.status(500).json({ error: error.message || "Failed to refine English phrase" });
  }
});

// 4. Empathy Coach & Mock Interview Chat Endpoint
app.post("/api/chat-coach", async (req, res: any) => {
  try {
    const { messages, contextType } = req.body; // contextType: 'wellness' | 'interview'
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const ai = getGeminiClient();

    const formattedHistory = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    // The user's active prompt
    const activeMessage = formattedHistory[formattedHistory.length - 1]?.parts[0]?.text || "Hello";
    
    // Remove last message from history pass to instantiate chat correctly
    const historyWithoutLast = formattedHistory.slice(0, -1);

    let systemInstruction = "";

    if (contextType === "wellness") {
      systemInstruction = `You are "Sanjeev", a wise, deeply compassionate career alignment therapist and wellness counselor.
Your specific client is an aging veteran professional in R&D packaging or production who feels trapped, highly stressed, suffers under silent pressure, can stay extremely frustrated, and feels their identity has deteriorated to just a job they hate. They often take this frustration out at home, which fills them with guilt and sorrow.
Your tone is soothing, warm, slow-paced, and profoundly human (non-robotic, simple words).
Listen actively to their emotional struggles. Provide deep validation: tell them they have carried a heavy load for decades, that they deserve compassion, and that family friction happens when we carry unexpressed corporate abuse.
Teach them micro-habits like diaphragmatic breathing, setting a transition zone, and learning to separate identity from a salary.
Ensure your replies are comforting but brief (less than 150 words). Encourage them to express themselves even in simple English or Hindi if they wish, validating their meaning perfectly over their spelling or grammar. Keep it friendly!`;
    } else {
      systemInstruction = `You are "Aditi", a friendly, supportive mock HR interviewer and technical product evaluator.
The user is a senior candidate with 23 years of traditional packaging, artwork design, and specification expertise, currently preparing for leadership/managerial roles that utilize AI-optimized modern packaging systems.
Your goal is to conduct a gentle, realistic job interview. Ask one professional question at a time.
Provide supportive feedback. In every response, before asking the next question:
1. Praise what was great about their answer
2. Give a brief 'Polished Sentence' suggestion: dynamic vocabulary they could swap in to sound highly expert.
Keep questions related to managing designs, pharmaceutical standards, artwork workflows, upskilling, and handling modern timelines. Be incredibly positive and boost their professional self-esteem. Keep replies brief.`;
    }

    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      history: historyWithoutLast,
      config: {
        systemInstruction,
      }
    });

    const response = await chatInstance.sendMessage({ message: activeMessage });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/chat-coach:", error);
    res.status(500).json({ error: error.message || "Failed to process chat response" });
  }
});

// Setup Vite & Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (Express & Vite)`);
  });
}

startServer();
