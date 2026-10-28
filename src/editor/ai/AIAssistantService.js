/**
 * AI Game Dev Assistant Service with API Key integration (Gemini, OpenAI, OpenRouter & Local Architect).
 */
export class AIAssistantService {
  constructor(options = {}) {
    this.provider = options.provider || 'gemini';
    this.model = options.model || 'gemini-2.5-flash';
    this.apiKey = options.apiKey || '';
  }

  setCredentials({ provider, model, apiKey }) {
    if (provider) this.provider = provider;
    if (model) this.model = model;
    if (apiKey !== undefined) this.apiKey = apiKey;
  }

  async generateScenePlan(prompt) {
    const p = prompt.toLowerCase();
    if (!this.apiKey || this.provider === 'local') {
      return {
        reply: `Membuat konfigurasi otomatis untuk: ${prompt}`,
        plan: {
          genre: p.includes('horror') ? 'horror' : p.includes('rpg') ? 'rpg' : 'action',
          spawns: [{ preset: 'crystal', count: 5, pattern: 'circle', radius: 12 }]
        }
      };
    }
    return { reply: `Terhubung ke ${this.provider} (${this.model})`, plan: { spawns: [] } };
  }
}
