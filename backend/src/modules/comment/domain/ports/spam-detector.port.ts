export interface SpamCheckResult {
  allowed: boolean;
  waitTime?: number; // seconds remaining until user can comment again
}

export interface ISpamDetector {
  checkRateLimit(userId: string): Promise<SpamCheckResult>;
  checkDuplicate(userId: string, content: string): Promise<boolean>;
}

export const SPAM_DETECTOR = Symbol('SPAM_DETECTOR');
