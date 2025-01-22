import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Groq from 'groq-sdk';
import { predictWithGradio } from './helpers/gradio_helper.js';
import cors from 'cors';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;


//for llm response and personality evaluation
app.use(cors({
  origin: ['https://aura-matrix.vercel.app', 'http://localhost:5500', 'http://127.0.0.1:5500']
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

app.post('/extra-info', async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { answers, personalityType } = req.body;

    if (!Array.isArray(answers) || !personalityType) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: 'Both answers array and personalityType are required'
      });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
          You are a Personality Predictor AI trained to analyze user responses and predict personality types.\n
          Your task is to create a pesonality matrix according user answers with 16 Personality System(MBTI).\n
          `,
        },
        {
          role: "user",
          content: `
          User's personality is ${personalityType}. Create personality matrix to satisfy 16 Personality System(MBTI).\n

          Matrix layout:
          | Answer | Extraversion (E)/Introversion (I) | Sensing (S)/Intuition (N) | Thinking (T)/Feeling (F) | Judging (J)/Perceiving (P) |
          |--------|-----------------------------------|---------------------------|--------------------------|----------------------------|
          | ans1   | cell1                             | cell2                     | cell3                    | cell4                      |
          | ans2   | cell5                             | cell6                     | cell7                    | cell8                      |
          | ans3   | cell9                             | cell10                    | cell11                   | cell12                     |
          | ans4   | cell13                            | cell14                    | cell15                   | cell16                     |
          | ans5   | cell17                            | cell18                    | cell19                   | cell20                     |
          | ans6   | cell21                            | cell22                    | cell23                   | cell24                     |
          | ans7   | cell25                            | cell26                    | cell27                   | cell28                     |
          | ans8   | cell29                            | cell30                    | cell31                   | cell32                     |
          | ans9   | cell33                            | cell34                    | cell35                   | cell36                     |
          | ans10  | cell37                            | cell38                    | cell39                   | cell40                     |

          Example Matrix:
          | Answer                                     | Extraversion (E)/Introversion (I) | Sensing (S)/Intuition (N) | Thinking (T)/Feeling (F) | Judging (J)/Perceiving (P) |
          |--------------------------------------------|-----------------------------------|---------------------------|--------------------------|----------------------------|
          | I like trying new things.                  | None                              | High N (Intuition)        | None                     | High P (Perceiving)        |
          | I usually lead in groups.                  | High E (Extraversion)             | None                      | None                     | None                       |
          | I take criticism well.                     | None                              | None                      | High T (Thinking)        | None                       |
          | I plan for the future.                     | None                              | None                      | None                     | High J (Judging)           |
          | I enjoy helping others.                    | None                              | None                      | High F (Feeling)         | None                       |
          | I solve problems logically.                | None                              | None                      | High T (Thinking)        | None                       |
          | I express my opinions clearly.             | High E (Extraversion)             | None                      | None                     | None                       |
          | I meet deadlines.                          | None                              | None                      | None                     | High J (Judging)           |
          | I get along with different people.         | None                              | None                      | High F (Feeling)         | None                       |
          | I take calculated risks.                   | High E (Extraversion)             | High N (Intuition)        | None                     | None                       |

          Expected output (ONLY a JSON object):
          {
            "values": {
              "cell1": ,
              "cell2": ,
              "cell3": ,
              "cell4": ,
              "cell5": ,
              "cell6": ,
              "cell7": ,
              "cell8": ,
              "cell9": ,
              "cell10": ,
              "cell11": ,
              "cell12": ,
              "cell13": ,
              "cell14": ,
              "cell15": ,
              "cell16": ,
              "cell17": ,
              "cell18": ,
              "cell19": ,
              "cell20": ,
              "cell21": ,
              "cell22": ,
              "cell23": ,
              "cell24": ,
              "cell25": ,
              "cell26": ,
              "cell27": ,
              "cell28": ,
              "cell29": ,
              "cell30": ,
              "cell31": ,
              "cell32": ,
              "cell33": ,
              "cell34": ,
              "cell35": ,
              "cell36": ,
              "cell37": ,
              "cell38": ,
              "cell39": ,
              "cell40": ,
            }
          }
          `,
        },
      ],
      model: "llama3-70b-8192",
      max_tokens: 700,
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
    res.status(500).json({ error: 'Failed to predict personality', details: error.message });
  }
});

//for sticker generation
app.post('/generate-stickers', async (req, res) => {
  const { personalityType, gender } = req.body;

  try {
    if (!personalityType) {
      return res.status(400).json({ error: 'personalityType is required' });
    }

    const roleMatch = personalityType.match(/\((.*?)\)/);
    const role = roleMatch ? roleMatch[1] : personalityType;

    const prompt = `${role} personality sticker for ${gender} with black background.`;
    
    // Console log the prompt
    console.log('Dispatching prompt to Gradio:', prompt);

    // Set up Server-Sent Events (SSE) for progress updates
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Pragma', 'no-cache');

    // Generate stickers using Gradio API with progress tracking
    await predictWithGradio(
      `${prompt}`,
      (status) => {
        res.write(`data: ${JSON.stringify(status)}\n\n`);
      }
    ).then((imageUrls) => {
      res.write(`data: ${JSON.stringify({ imageUrls })}\n\n`);
      res.end();
    }).catch((error) => {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    });
  } catch (error) {
    console.error('Error generating stickers:', error);
    res.status(500).json({ error: 'Failed to generate stickers' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

