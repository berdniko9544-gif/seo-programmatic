// ============================================================
// DEEPSEEK API CLIENT
// ============================================================

const https = require('https');

class DeepSeekClient {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.DEEPSEEK_API_KEY;
    this.baseUrl = 'api.deepseek.com';
  }

  async generateContent(prompt, options = {}) {
    const {
      maxTokens = 2000,
      temperature = 0.7,
      model = 'deepseek-chat'
    } = options;

    const data = JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature,
      stream: false
    });

    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.baseUrl,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Length': data.length
        }
      };

      const req = https.request(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (res.statusCode === 200) {
              resolve(response.choices[0].message.content);
            } else {
              reject(new Error(`DeepSeek API error: ${res.statusCode} ${body}`));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  async generateArticle(topic, niche, keywords = []) {
    const prompt = `Write a unique, SEO-optimized article about "${topic}" in the ${niche} niche.

Requirements:
- Length: 800-1200 words
- Include keywords: ${keywords.join(', ')}
- Use H2 and H3 headings
- Write in Russian language
- Make it informative and engaging
- Include practical tips
- Add a conclusion

Format as markdown.`;

    return await this.generateContent(prompt, { maxTokens: 3000 });
  }

  async generatePageContent(direction, city, niche) {
    const prompt = `Create unique content for a page about "${direction}" in ${city} for ${niche} niche.

Requirements:
- Length: 600-800 words
- Write in Russian
- Include local context for ${city}
- Make it practical and useful
- Include 3-5 key points
- Add FAQ section (3 questions)

Format as JSON with fields: title, h1, description, content, faq`;

    const response = await this.generateContent(prompt, { maxTokens: 2500 });

    try {
      return JSON.parse(response);
    } catch {
      // If not valid JSON, return structured format
      return {
        title: `${direction} в ${city}`,
        h1: `${direction} в ${city} — ${niche}`,
        description: response.substring(0, 160),
        content: response,
        faq: []
      };
    }
  }

  async generateUniqueDirection(baseDirection, variant) {
    const prompt = `Create a unique variation of "${baseDirection}" direction.

Variant number: ${variant}

Requirements:
- Create a unique name (different from original)
- Write unique description (200-300 words)
- Suggest 5 unique keywords
- Create 3 FAQ questions with answers
- Write in Russian

Format as JSON with fields: id, name, description, keywords, faq`;

    const response = await this.generateContent(prompt, { maxTokens: 2000 });

    try {
      return JSON.parse(response);
    } catch {
      return null;
    }
  }
}

module.exports = { DeepSeekClient };
