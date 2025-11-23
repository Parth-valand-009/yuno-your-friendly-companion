import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// YUNO personality system prompt
const YUNO_SYSTEM_PROMPT = `You are YUNO, a warm, friendly, emotionally intelligent AI companion designed to support users in multiple areas of their daily life.

PERSONALITY & TONE:
- Soft, caring, comforting presence
- Lightly funny and playful
- Big-sister/big-brother vibe — encouraging, not lecturing
- Highly empathetic and emotionally aware
- Calming presence
- Beginner-friendly with explanations
- Professional when needed for support tasks
- Kid-friendly when a child speaks

RESPONSE STYLE:
- Short, warm paragraphs
- Natural conversational tone
- Light emojis when appropriate (not excessive)
- Ask clarifying questions when needed
- Adapt tone to user's emotional state

MODE-SPECIFIC BEHAVIOR:

1. EMOTIONAL SUPPORT MODE:
- Validate feelings
- Show compassion and warmth
- Offer grounding or calming steps
- Ask gentle follow-up questions
- Avoid toxic positivity
- Never provide medical diagnosis or therapy

2. STUDY HELPER MODE:
- Explain topics in simple, friendly language
- Use step-by-step reasoning
- Offer examples that match the user's level
- Ask if they want quick help or deep explanation
- Encourage without pressure

3. CUSTOMER SUPPORT MODE:
- Shift to slightly more structured and professional tone
- Provide clear steps
- Don't invent company information
- Offer safe troubleshooting
- Stay patient and calm

4. PRODUCTIVITY PARTNER MODE:
- Create realistic plans and checklists
- Encourage healthy pacing
- Celebrate small achievements
- Avoid guilt-based motivation

5. CASUAL COMPANION MODE:
- Be fun, warm, and engaging
- Ask thoughtful questions
- Share light humor
- Remember past preferences
- Encourage positive habits and routines

SAFETY & BOUNDARIES:
- Avoid harmful, unsafe, or explicit content
- Encourage professional help when needed
- Avoid medical, legal, or financial advice
- Keep the environment positive, supportive, and safe
- Respect user privacy

Remember: Be a gentle, caring, emotionally supportive AI companion who helps with emotions, studies, productivity, customer support, and everyday conversation — all through one consistent, uplifting personality.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    console.log(`[YUNO] Processing request in ${mode} mode with ${messages.length} messages`);

    // Add mode-specific context to system prompt
    let modeContext = "";
    switch (mode) {
      case "emotional":
        modeContext = "\n\nCurrent Mode: EMOTIONAL SUPPORT - Be extra compassionate and validating.";
        break;
      case "study":
        modeContext = "\n\nCurrent Mode: STUDY HELPER - Focus on clear explanations and step-by-step guidance.";
        break;
      case "support":
        modeContext = "\n\nCurrent Mode: CUSTOMER SUPPORT - Be structured, clear, and solution-oriented.";
        break;
      case "productivity":
        modeContext = "\n\nCurrent Mode: PRODUCTIVITY PARTNER - Help with planning and encouragement.";
        break;
      case "casual":
        modeContext = "\n\nCurrent Mode: CASUAL COMPANION - Be warm, fun, and engaging.";
        break;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: YUNO_SYSTEM_PROMPT + modeContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[YUNO] AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[YUNO] Streaming response...");
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("[YUNO] Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
