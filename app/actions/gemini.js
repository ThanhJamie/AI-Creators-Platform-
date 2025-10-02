"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generation
export async function generateBlogContent(title, category = "", tags = []) {
  try {
    if (!title || title.trim().length === 0) {
      throw new Error("Title is required to generate content");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Write a comprehensive blog post with the title: "${title}"

${category ? `Category: ${category}` : ""}
${tags.length > 0 ? `Tags: ${tags.join(", ")}` : ""}

Instructions:
- Length: 800–1200 words
- Tone: conversational yet professional
- Structure: 
  * <h2> for 3–5 main sections
  * <h3> for subsections
  * <p> for paragraphs
  * <ul><li> for lists
  * <strong>, <em> for emphasis
- Content:
  * Start with an engaging introduction (do not repeat the title)
  * Provide practical insights, examples, or actionable advice
  * Ensure originality and value for readers
  * Format properly with HTML

Output only the blog post content (without repeating the title).
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    // Basic validation
    if (!content || content.trim().length < 100) {
      throw new Error("Generated content is too short or empty");
    }

    return {
      success: true,
      content: content.trim(),
    };
  } catch (error) {
    if (error.message.includes("API key")) {
      return {
        success: false,
        error:
          "Invalid or missing Gemini API key. Please check your configuration.",
      };
    }
    if (error.message.includes("quota") || error.message.includes("limit")) {
      return {
        success: false,
        error:
          "AI service quota exceeded. Please try again later or check your usage limits.",
      };
    }
    return {
      success: false,
      error:
        error.message ||
        "An error occurred while generating content. Please try again.",
    };
  }
}

// Improving content

export async function improveContent(
  currentContent,
  improvementType = "enhance"
) {
  try {
    if (!currentContent || currentContent.trim().length === 0) {
      throw new Error("Content is required for improvement");
    }

    const model = GenerativeModel.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    let prompt = "";

    switch (improvementType) {
      case "expand":
        prompt = `
Expand the following blog content by adding more details, examples, and insights:

${currentContent}

Requirements:
- Preserve the existing structure and main points
- Add depth and clarity to each section
- Include practical, real-world examples
- Maintain the same tone and style
- Return ONLY the improved content in the same HTML format
`;
        break;

      case "simplify":
        prompt = `
Simplify the following blog content to make it more concise and reader-friendly:

${currentContent}

Requirements:
- Keep all main points intact but clearer
- Remove redundancy or unnecessary complexity
- Use simpler, more direct language
- Maintain the HTML formatting
- Return ONLY the improved content
`;
        break;

      default: // enhance
        prompt = `
Enhance the following blog content to improve engagement and structure:

${currentContent}

Requirements:
- Improve flow and readability
- Add smooth transitions between sections
- Strengthen with better examples or explanations
- Keep approximately the same length
- Preserve the HTML structure
- Return ONLY the improved content
`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improvedContent = response.text();

    return {
      success: true,
      content: improvedContent.trim(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to improve content. Please try again.",
    };
  }
}
