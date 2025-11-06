import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Inquiry } from "../types";

// Initialize GoogleGenAI with a named apiKey parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    potential_score: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
    suggested_status: { type: Type.STRING, enum: ['in_progress', 'done'] },
    suggested_category: { type: Type.STRING },
    auto_reply: { type: Type.STRING },
    human_required: { type: Type.BOOLEAN },
    google_action: {
      type: Type.OBJECT,
      properties: {
        calendar_event: { type: Type.STRING, enum: ['yes', 'no'] },
        sheet_log: { type: Type.STRING, enum: ['yes', 'no'] },
        create_doc_summary: { type: Type.STRING, enum: ['yes', 'no'] },
        share_drive_folder: { type: Type.STRING, enum: ['yes', 'no'] },
        notes: { type: Type.STRING },
      },
      required: ['calendar_event', 'sheet_log', 'create_doc_summary', 'share_drive_folder', 'notes'],
    },
  },
  required: ['name', 'potential_score', 'suggested_status', 'suggested_category', 'auto_reply', 'human_required', 'google_action'],
};

export const analyzeInquiry = async (inquiry: Inquiry): Promise<AnalysisResult> => {
  // Use the recommended 'gemini-2.5-flash' model for basic text tasks.
  const model = "gemini-2.5-flash";

  const prompt = `
    Analyze the following customer inquiry and provide a structured analysis in JSON format.

    Inquiry Details:
    - Name: ${inquiry.name}
    - Email: ${inquiry.email}
    - Phone: ${inquiry.phone || 'N/A'}
    - Subject: ${inquiry.subject}
    - Message: ${inquiry.message}
    - Service Interest: ${inquiry.service_interest}
    - Language: ${inquiry.language}

    Based on the inquiry, provide the following analysis:
    1.  **name**: The name of the person.
    2.  **potential_score**: Assess the sales potential. Values: 'high', 'medium', 'low'. High potential are new business inquiries for core services. Medium are collaborations or less defined inquiries. Low are support requests or spam.
    3.  **suggested_status**: Suggest a new status. Values: 'in_progress' for leads, 'done' for support/spam.
    4.  **suggested_category**: A short category for the inquiry (e.g., "New Lead - Web Dev", "Support Request", "Collaboration").
    5.  **auto_reply**: Write a brief, polite, and professional auto-reply message in the same language as the inquiry (${inquiry.language}). If it's a new lead, suggest scheduling a call. If it's a support request, assure them someone will look into it.
    6.  **human_required**: true if a human needs to follow up (e.g., new leads), false otherwise (e.g., simple questions already answered).
    7.  **google_action**: Suggest follow-up actions in Google Workspace.
        - **calendar_event**: 'yes' if a meeting should be scheduled, 'no' otherwise.
        - **sheet_log**: 'yes' if this lead should be logged in a Google Sheet, 'no' otherwise.
        - **create_doc_summary**: 'yes' if a summary document should be created, 'no' otherwise.
        - **share_drive_folder**: 'yes' if a Google Drive folder should be created and shared, 'no' otherwise.
        - **notes**: Brief notes for the team.

    Return ONLY the JSON object, with no extra text or markdown.
    `;

  try {
    // Use the correct 'generateContent' method with 'responseMimeType' and 'responseSchema' to ensure a JSON response.
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });
    
    // Correctly access the 'text' property and parse it as JSON.
    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Received empty response from API");
    }
    const result = JSON.parse(jsonText);
    return result as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing inquiry with Gemini API:", error);
    if (error instanceof SyntaxError) {
        console.error("Failed to parse JSON response from Gemini.");
    }
    throw new Error("Failed to analyze inquiry. Please check the console for more details.");
  }
};
