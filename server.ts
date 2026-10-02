import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Route for the Arabic Educational AI Assistant «المساعد الذكي»
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { action, prompt, studentLevel, topic, userText } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response if API key is not yet configured
      return res.json({
        success: true,
        response: generateFallbackResponse(action, prompt, studentLevel, topic, userText),
      });
    }

    let systemInstruction = `أنت «المساعد الذكي لسحر الكلام»، معلم لغة عربية خبير وودود ومتخصص في المنهاج الجزائري لتدريس تقنيات التعبير الشفهي والتعبير الكتابي لجميع الأطوار: الابتدائي (1 ابتدائي إلى 5 ابتدائي)، المتوسط (1 متوسط إلى 4 متوسط)، والثانوي (1 ثانوي إلى 3 ثانوي).
قواعد مهمة جداً:
1. الإجابة باللغة العربية الفصحى السليمة فقط والواضحة والمشكولة عند الحاجة.
2. استخدام أسلوب تربوي مشجع ومحبب يناسب مستوى التلميذ المحدد: (${studentLevel || 'عام'}).
   - للأطفال في الابتدائي: أسلوب مبسط جداً، تشجيعي، استخدام كلمات لطيفة وأمثلة ملموسة من حياتهم اليومية.
   - لتلاميذ المتوسط: أسلوب منظم، تدريب على منهجية الفقرة (المقدمة، العرض، الخاتمة) والروابط وعلامات الترقيم.
   - لتلاميذ الثانوي: أسلوب رصين، تدريب على الحجاج، الإقناع، التحليل، وفنون البلاغة وفق متطلبات البكالوريا والمنهاج الجزائري.
3. ممنوع استخدام أي لغة أو حروف أجنبية؛ كل الإرشادات والأمثلة باللغة العربية.`;

    let userPrompt = '';

    if (action === 'correct_text') {
      userPrompt = `قم بتصحيح النص التعبيري التالي لتلميذ في طور (${studentLevel || 'الابتدائي'}):
الموضوع أو العنوان: ${topic || 'غير محدد'}
نص التلميذ:
"${userText || prompt}"

المطلوب:
1. تشجيع التلميذ والإشادة بمحاولته بنقاط قوة واضحة.
2. جدول أو قائمة بالأخطاء المكتشفة (إملائية، نحوية، علامات ترقيم، أو ركاكة في الصياغة) مع ذكر السبب وقاعدتها بأسلوب مبسط.
3. النسخة المصححة والمحسنة من النص مع الحفاظ على أفكار التلميذ.
4. نصيحة ذهبية واحدة لتطوير تعبيره القادم.`;
    } else if (action === 'generate_ideas') {
      userPrompt = `ساعد تلميذًا في طور (${studentLevel || 'المتوسط'}) في بناء أفكار لموضوع تعبير بعنوان: "${topic || prompt}".
المطلوب:
1. مقدمة مقترحة أو فكرة افتتاحية تجذب القارئ.
2. عناصر العرض (3 إلى 4 أفكار رئيسية مع شواهد أو أدوات ربط مقترحة).
3. خاتمة معبرة وموجزة.
4. رصيد لغوي وكلمات عربية جميلة تناسب الموضوع.`;
    } else if (action === 'oral_practice') {
      userPrompt = `اقترح نشاط تدريب على التعبير الشفهي لتلميذ في طور (${studentLevel || 'الابتدائي'}) حول موضوع: "${topic || prompt}".
المطلوب:
1. مشهد أو وضعية انطلاق تثير الحماس.
2. 3 أسئلة متدرجة تساعد التلميذ على التحدث وإبداء رأيه بثقة.
3. عبارات ومفاتيح قول يمكن للتلميذ الاستعانة بها (مثل: أرى أن، في رأيي، من خلال ملاحظتي...).
4. نصيحة عملية للتنفس والتحكم في الصوت ولغة الجسد.`;
    } else if (action === 'create_exercise') {
      userPrompt = `أنشئ تمرينًا تفاعليًا في التعبير (شفهي أو كتابي) مناسبًا لمستوى (${studentLevel || 'الابتدائي'}) حول: "${topic || prompt}".
يحتوي على:
- نص قصير أو وضعية إدماجية
- سؤال ترتيب جمل، أو اختيار من متعدد، أو إكمال فراغات بروابط لغوية
- الحل النموذجي مع التعليل التربوي.`;
    } else {
      // General question or lesson explanation
      userPrompt = `اشرح بأسلوب تعليمي مشوق ومبسط لتلميذ في طور (${studentLevel || 'الابتدائي'}):
السؤال / الموضوع: "${prompt}".
قدم أمثلة عربية واضحة من واقع التلميذ المدرسي.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'عذرًا، لم أتمكن من صياغة الإجابة حاليًا. حاول مجددًا!';

    res.json({
      success: true,
      response: reply,
    });
  } catch (error: any) {
    console.error('Error in /api/ai-assistant:', error);
    // Return friendly educational message
    res.json({
      success: true,
      response: 'مرحبًا بك يا بطل! حاليًا أقوم بتجهيز أفكار جديدة لك. إليك نصيحة ذهبية: كل موضوع تعبير ناجح يبدأ بمقدمة مشوقة، ثم عرض غني بالربط، وخاتمة تترك أثرًا جميلًا!',
    });
  }
});

// Helper for offline / fallback responses
function generateFallbackResponse(
  action: string,
  prompt: string,
  level: string,
  topic: string,
  userText: string
): string {
  if (action === 'correct_text') {
    return `🌟 أحسنت يا بطل على هذه المحاولة الرائعة! التعبير هو مرآة أفكارك الجميلة.

📝 ملاحظات وتصويبات مفيدة:
1. **الربط بين الجمل**: احرص على استخدام حروف العطف (الواو، الفاء، ثمّ) بدلاً من تكرار الجمل القصيرة المنفصلة.
2. **علامات الترقيم**: ضع الفاصلة (،) بين الجمل المترابطة، والنقطة (.) عند نهاية كل فكرة، وعلامة الاستفهام (؟) بعد السؤال.
3. **الهمزات**: فرّق بين همزة الوصل (اكتب، انطلق) وهمزة القطع (أحمد، أكل، إكرام).

✨ نصيحة سحر الكلام:
اقرأ ما كتبت بصوت هادئ، فما تراه أذنك نشازًا هو ما يحتاج إلى صقل في قلمك!`;
  } else if (action === 'generate_ideas') {
    return `💡 مخطط أفكار مقترح لموضوع: "${topic || prompt || 'التعبير المميز'}"

🔹 **1. المقدمة (المدخل):**
ابدأ بتعريف لطيف أو بيت شعر أو تساؤل يثير انتباه القارئ حول أهمية الموضوع.

🔹 **2. العرض (صلب الموضوع):**
- العنصر الأول: بيان الأهمية والفوائد في حياتنا اليومية.
- العنصر الثاني: دور الفرد والمجتمع في العناية بهذا الأمر.
- العنصر الثالث: أمثلة واقعية وقيم نبيلة تدعم الفكرة.

🔹 **3. الخاتمة:**
خلاصة موجزة تنتهي بدعوة أو عبرة مستفادة: "وفي الختام، تبقى الكلمة الطيبة كالشجرة الطيبة أصلها ثابت وفرعها في السماء".

📚 رصيد لغوي مقترح:
(علاوة على ذلك، ومما لا شك فيه، ويجدر بالذكر، فضلًا عن، وفي نهاية المطاف).`;
  } else {
    return `✨ مرحبًا بك في سحر الكلام!
نصيحتنا التعليمية لك اليوم:
«لكي تكون متحدثًا بارعًا، استمع باهتمام، ورتّب أفكارك قبل أن تنطق، وتحدث بصوت واضح مع ابتسامة واثقة.»`;
  }
}

// Development with Vite vs Production
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
