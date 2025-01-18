import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Groq from 'groq-sdk';
import cors from 'cors';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://aura-matrix.vercel.app', 'http://localhost:5500', 'http://127.0.0.1:5500']
}));
app.use(express.json());

app.post('/predict', async (req, res) => {
  try {
    const groq = new Groq({ apiKey:process.env.GROQ_API_KEY });
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      throw new Error('Answers must be an array');
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
          You are a Personality Predictor AI trained to analyze user responses and predict personality types.\n
          Your task is to analyze the user's answers to a series of questions and generate their personality type in the specified format.\n
          `,
        },
        {
          role: "user",
          content: `
          The user has provided the following responses to personality-related questions:\n
          
          1. **How do you feel about trying new and unconventional activities?**\n
             Answer: ${answers[0]}\n
          2. **When you're in a group, how do you usually behave?**\n
             Answer: ${answers[1]}\n
          3. **How do you handle criticism?**\n
             Answer: ${answers[2]}\n
          4. **How do you approach planning for the future?**\n
             Answer: ${answers[3]}\n
          5. **How do you feel about helping others?**\n
             Answer: ${answers[4]}\n
          6. **How do you react when faced with a challenging problem?**\n
             Answer: ${answers[5]}\n
          7. **How do you feel about expressing your opinions in a group?**\n
             Answer: ${answers[6]}\n
          8. **How do you handle deadlines?**\n
             Answer: ${answers[7]}\n
          9. **How do you feel about people who are very different from you?**\n
             Answer: ${answers[8]}\n
          10. **How do you feel about taking risks?**\n
              Answer: ${answers[9]}\n
      
          Task: Predict the personality type and assign percentages to the traits:
          - Extraversion/Introversion
          - Intuition/Sensing
          - Thinking/Feeling
          - Judging/Perceiving
      
          Expected output (ONLY a JSON object):
          {
            "personalityType": "INTJ (Architect)",
            "traits": {
              "Extraversion": 75,
              "Intuition": 85,
              "Thinking": 65,
              "Judging": 70
            }
          }

          If the user's input consists of random gibberish, nonsensical characters, or unintelligible responses that cannot be interpreted or mapped to a valid personality type, return the following JSON structure:
          {
            "personalityType": "Unknown",
            "traits": {
              "Unclear Trait 1": 0,
              "Unclear Trait 2": 0,
              "Unclear Trait 3": 0,
              "Unclear Trait 4": 0
            }
          }
          `,
        },
      ],
      model: "llama3-70b-8192",
      max_tokens: 100,
      temperature: 0,
    });
    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No prediction received from AI');
    }
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid prediction format');
    }
    const prediction = JSON.parse(jsonMatch[0]);
    res.json({ prediction });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to predict personality' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});