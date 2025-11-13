import { db } from '../server.js';
import { Question, QuestionsSchema } from '../zod-types/questionModel.js';
import { AnswerSubmission } from '../zod-types/answerSubmissionModel.js';

async function ensureUserExists(username: string): Promise<number> {
  const result = await db.oneOrNone(
    'SELECT id FROM "user" WHERE username = $1',
    [username]
  );
  
  if (result) {
    return result.id;
  }
  
  const newUser = await db.one(
    'INSERT INTO "user" (username) VALUES ($1) RETURNING id',
    [username]
  );
  
  return newUser.id;
}

export async function getQuestionsForWeakestSubsection(
  licenseClass: string,
  username: string
): Promise<Question[]> {
  const userId = await ensureUserExists(username);

  const query = `
    WITH subsection_mastery AS (
      SELECT 
        s.id,
        COALESCE(SUM(uqm.mastery), 0) as total_mastery
      FROM subsection s
      JOIN license_class lc ON s.license_class_id = lc.id
      JOIN question q ON q.subsection_id = s.id
      LEFT JOIN user_question_mastery uqm ON uqm.question_id = q.id AND uqm.user_id = $1
      WHERE lc.code = $2
      GROUP BY s.id
      ORDER BY total_mastery, s.id
      LIMIT 1
    )
    SELECT q.content
    FROM question q
    JOIN subsection_mastery sm ON q.subsection_id = sm.id
    ORDER BY q.code
  `;

  const rows = await db.manyOrNone(query, [userId, licenseClass]);
  const questions = rows.map(row => row.content);
  
  return QuestionsSchema.parse(questions);
}

export async function recordAnswer(
  username: string,
  submission: AnswerSubmission
): Promise<void> {
  const userId = await ensureUserExists(username);
  const masteryDelta = submission.correct ? 1 : -1;

  const question = await db.one(
    'SELECT id FROM question WHERE code = $1',
    [submission.questionId]
  );

  await db.none(
    `INSERT INTO user_question_mastery (user_id, question_id, mastery, last_asked_time, last_asked_date)
     VALUES ($1, $2, $3, NOW(), CURRENT_DATE)
     ON CONFLICT (user_id, question_id)
     DO UPDATE SET
       mastery = user_question_mastery.mastery + $3,
       last_asked_time = NOW(),
       last_asked_date = CURRENT_DATE`,
    [userId, question.id, masteryDelta]
  );
}
