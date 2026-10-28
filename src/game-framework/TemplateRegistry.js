import { ActionTemplate } from '../gameplay-modules/action/ActionTemplate.js';
import { HorrorTemplate } from '../gameplay-modules/horror/HorrorTemplate.js';
import { FarmingTemplate } from '../gameplay-modules/farming/FarmingTemplate.js';
import { PuzzleTemplate } from '../gameplay-modules/puzzle/PuzzleTemplate.js';
import { RacingTemplate } from '../gameplay-modules/racing/RacingTemplate.js';
import { RPGTemplate } from '../gameplay-modules/rpg/RPGTemplate.js';
import { FPSTemplate } from '../gameplay-modules/fps/FPSTemplate.js';

/**
 * Central registry for all 7 built-in genre templates.
 */
export class TemplateRegistry {
  constructor() {
    this.templates = new Map();
    [
      new ActionTemplate(),
      new HorrorTemplate(),
      new FarmingTemplate(),
      new PuzzleTemplate(),
      new RacingTemplate(),
      new RPGTemplate(),
      new FPSTemplate()
    ].forEach((tpl) => this.register(tpl));
  }

  register(template) {
    this.templates.set(template.name, template);
  }

  get(name) {
    return this.templates.get(name) || null;
  }

  list() {
    return Array.from(this.templates.values()).map((t) => ({
      name: t.name,
      title: t.title,
      description: t.description
    }));
  }
}
