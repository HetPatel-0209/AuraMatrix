import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
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
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      throw new Error('Answers must be an array');
    }

    // Simple prompt format
    const prompt = `Analyze these answers for a personality test:
    1. ${answers[0]}
    2. ${answers[1]}
    3. ${answers[2]}
    4. ${answers[3]}
    5. ${answers[4]}
    6. ${answers[5]}
    7. ${answers[6]}
    8. ${answers[7]}
    9. ${answers[8]}
    10. ${answers[9]}

    Based on these answers, provide:
    1. MBTI type (format: XXXX)
    2. Extraversion score (0-100)
    3. Intuition score (0-100)
    4. Thinking score (0-100)
    5. Judging score (0-100)

    Format your response exactly like this example:
    ENFJ
    Extraversion: 75
    Intuition: 60
    Thinking: 45
    Judging: 80`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
      max_tokens: 200
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Parse the simple format response
    const lines = response.split('\n');
    const type = lines[0]?.trim() || 'XXXX';
    
    const traits = {
      extraversion: parseInt(lines[1]?.match(/\d+/) || '0'),
      intuition: parseInt(lines[2]?.match(/\d+/) || '0'),
      thinking: parseInt(lines[3]?.match(/\d+/) || '0'),
      judging: parseInt(lines[4]?.match(/\d+/) || '0')
    };

    res.json({
      prediction: `Your personality type is: ${type}`,
      traits
    });

  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Failed to predict personality',
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});