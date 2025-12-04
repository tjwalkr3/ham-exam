import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const mockDb = vi.hoisted(() => ({
  oneOrNone: vi.fn(),
  one: vi.fn(),
  none: vi.fn(),
}));

vi.mock('../db.js', () => ({
  db: mockDb,
}));

type DatabaseServiceModule = typeof import('./databaseService.js');
let recordAnswer: DatabaseServiceModule['recordAnswer'];
let clampMasteryExpression: DatabaseServiceModule['clampMasteryExpression'];

beforeAll(async () => {
  const module = await import('./databaseService.js');
  recordAnswer = module.recordAnswer;
  clampMasteryExpression = module.clampMasteryExpression;
});

beforeEach(() => {
  mockDb.oneOrNone.mockReset();
  mockDb.one.mockReset();
  mockDb.none.mockReset();
  mockDb.oneOrNone.mockResolvedValue({ id: 1 });
  mockDb.one.mockResolvedValue({ id: 2 });
  mockDb.none.mockResolvedValue(undefined);
});

describe('clampMasteryExpression', () => {
  it('wraps any expression with the mastery bounds', () => {
    expect(clampMasteryExpression('$3')).toBe('LEAST(5, GREATEST(0, $3))');
    expect(clampMasteryExpression('user_question_mastery.mastery + $3'))
      .toBe('LEAST(5, GREATEST(0, user_question_mastery.mastery + $3))');
  });
});

describe('recordAnswer', () => {
  it('applies clamping inside the upsert query for mastery changes', async () => {
    await recordAnswer('user@example.com', { questionId: 'Q1', correct: false });

    expect(mockDb.none).toHaveBeenCalledTimes(1);
    const [query, params] = mockDb.none.mock.calls[0];
    expect(query).toContain('LEAST(5, GREATEST(0, $3))');
    expect(query).toContain('LEAST(5, GREATEST(0, user_question_mastery.mastery + $3))');
    expect(params[2]).toBe(-1);
  });
});
