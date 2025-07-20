import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generates a quiz using the Gemini AI model.
 * @param {string} topic - The topic of the quiz.
 * @param {number} numQuestions - The number of questions for the quiz.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of question objects.
 */
const generateQuiz = async (topic, numQuestions) => {
  
  if (!process.env.GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not defined. Please ensure it is set in your .env file in the /server directory.");
    throw new Error('GEMINI_API_KEY is not defined.');
  }

  try {
   
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const prompt = `
      Generate a multiple-choice quiz on the topic: "${topic}".
      Create exactly ${numQuestions} questions.
      Each question must have exactly 4 options, with one correct answer.
      Your response MUST be in valid JSON format. Do not include any text, explanation, or markdown formatting before or after the JSON object.
      The JSON object should be an array of questions.
      Each question object in the array must have the following structure:
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct option text"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
  
    const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');

    const quizData = JSON.parse(cleanedText);

    if (!Array.isArray(quizData) || quizData.length === 0) {
        throw new Error('AI failed to generate quiz data in the expected format.');
    }

    return quizData;

  } catch (error) {
    console.error('Error generating quiz with AI:', error);
    throw new Error('Failed to generate quiz. Please try again.');
  }
};

export { generateQuiz };