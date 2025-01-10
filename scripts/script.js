import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Groq from 'groq-sdk';
import cors from 'cors';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://aura-matrix-8x43bujpp-hetpatel-0209s-projects.vercel.app/'
}));
app.use(express.json());

app.post('/predict', async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      throw new Error('Answers must be an array');
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
          You are personality predictor ai.\n
          Following questions are answered by user:\n
          How do you feel about trying new and unconventional activities?\n
          Answer: ${answers[0]}\n
          When you're in a group, how do you usually behave?\n
          Answer: ${answers[1]}\n
          How do you handle criticism?\n
          Answer: ${answers[2]}\n
          How do you approach planning for the future?\n
          Answer: ${answers[3]}\n
          How do you feel about helping others?\n
          Answer: ${answers[4]}\n
          How do you react when faced with a challenging problem?\n
          Answer: ${answers[5]}\n
          How do you feel about expressing your opinions in a group?\n
          Answer: ${answers[6]}\n
          How do you handle deadlines?\n
          Answer: ${answers[7]}\n
          How do you feel about people who are very different from you?\n
          Answer: ${answers[8]}\n
          How do you feel about taking risks?\n
          Answer: ${answers[9]}\n

          Based on these answers, predict the user's personality type.\n
          Format your response as: "Your personality type is: {personality_type}"\n
          `,
        },
      ],
      model: "llama3-70b-8192",
      max_tokens: 50,
      temperature: 0,
    });

    res.json({ prediction: chatCompletion.choices[0]?.message?.content || "Unable to determine personality type" });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to predict personality' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});