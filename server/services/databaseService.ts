import { db } from '../server.js';
import { Question, QuestionsSchema } from '../zod-types/questionModel.js';

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
