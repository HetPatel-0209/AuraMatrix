import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Groq from 'groq-sdk';
import cors from 'cors';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://aura-matrix.vercel.app'
}));
app.use(express.json());

app.post('/predict', async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      throw new Error('Answers must be an array');
    }

    const formattedAnswers = answers.map((answer, index) => {
      const questions = [
        "How do you feel about trying new and unconventional activities?",
        "When you're in a group, how do you usually behave?",
        "How do you handle criticism?",
        "How do you approach planning for the future?",
        "How do you feel about helping others?",
        "How do you react when faced with a challenging problem?",
        "How do you feel about expressing your opinions in a group?",
        "How do you handle deadlines?",
        "How do you feel about people who are very different from you?",
        "How do you feel about taking risks?"
      ];
      return `Question ${index + 1}: ${questions[index]}\nAnswer: ${answer}`;
    }).join('\n\n');

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
          You are a Personality Predictor AI trained to analyze user responses and predict personality types.\n
          Your task is to analyze the user's answers to a series of questions and generate their personality type in the specified format.\n
          1. Their MBTI personality type
          2. Percentage scores for four key traits:
             - Extraversion (E) vs Introversion (I)
             - Sensing (S) vs Intuition (N)
             - Thinking (T) vs Feeling (F)
             - Judging (J) vs Perceiving (P)
          
          Provide the results in the following JSON format:
          {
            "type": "XXXX (Type Name)",
            "traits": {
              "extraversion": XX,
              "intuition": XX,
              "thinking": XX,
              "judging": XX
            }
          }
          Where XX is a percentage between 0-100.
          `,
        },
        {
          role: "user",
          content: `
          The user has provided the following responses to personality-related questions:\n
          ${formattedAnswers}
          **Task:** Based on these answers, predict the user's personality type.\n

          **Guidelines for Personality Prediction:**\n  
          - Analyze patterns or themes across the answers.\n
          - Use concise terms to represent personality traits (e.g., "Adventurous Thinker," "Empathetic Leader").\n
          - Avoid ambiguity and only include the core personality role.\n
      
          `,
        },
      ],
      model: "llama3-70b-8192",
      max_tokens: 800,
      temperature: 0
    });
    const response = chatCompletion.choices[0]?.message?.content;
    
    const typeMatch = response.match(/personality type is: ([A-Z]{4})/);
    const extraversionMatch = response.match(/Extraversion[:\s]+(\d+)%/);
    const intuitionMatch = response.match(/Intuition[:\s]+(\d+)%/);
    const thinkingMatch = response.match(/Thinking[:\s]+(\d+)%/);
    const judgingMatch = response.match(/Judging[:\s]+(\d+)%/);

    const result = {
      prediction: typeMatch ? typeMatch[1] : "Unable to determine type",
      traits: {
        extraversion: parseInt(extraversionMatch?.[1] || "0"),
        intuition: parseInt(intuitionMatch?.[1] || "0"),
        thinking: parseInt(thinkingMatch?.[1] || "0"),
        judging: parseInt(judgingMatch?.[1] || "0")
      }
    };
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to predict personality' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});