export type GameView = 'TITLE_MENU' | 'PLAYING' | 'SCOREBOARD' | 'QUESTION_BANK' | 'HOW_TO_PLAY' | 'GAME_OVER';

export type CoupleMatchState = 'PENDING' | 'MATCHED' | 'MISMATCHED';

export type PointWinner = 'GATO' | 'HUMANO' | 'BOTH' | 'NONE';

export interface QuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface Question {
  id: string;
  number: number;
  category: string;
  prompt: string;
  subtitle?: string;
  hasOptions: boolean;
  options: QuestionOption[];
  secretHostNote?: string;
  suggestedOptionId?: string;
}

export interface RoundRecord {
  questionId: string;
  questionNumber: number;
  questionPrompt: string;
  category: string;
  gatoAnswerText: string;
  gatoOptionId?: string;
  humanoAnswerText: string;
  humanoOptionId?: string;
  coupleMatched: boolean;
  couplePaperNote?: string;
  correctOptionId?: string;
  winner: PointWinner;
  pointsGato: number;
  pointsHumano: number;
  timestamp: string;
}
