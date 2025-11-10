import { db } from '../server.js';
import { Question, QuestionsSchema } from '../zod-types/questionModel.js';

async function ensureUserExists(username: string): Promise<number> {
  const result = await db.oneOrNone(
    'SELECT id FROM users WHERE username = $1',
    [username]
  );
  
  if (result) {
    return result.id;
  }
  
  const newUser = await db.one(
    'INSERT INTO users (username) VALUES ($1) RETURNING id',
    [username]
  );
  
  return newUser.id;
}

export async function getQuestionsForWeakestSubsection(
  licenseClass: string,
  username: string
): Promise<Question[]> {
  await ensureUserExists(username);

  const query = `
    WITH user_lookup AS (
      SELECT id FROM users WHERE username = $2
    ),
    subsection_mastery AS (
      SELECT 
        s.id as subsection_id,
        COALESCE(SUM(uqm.mastery), 0) as total_mastery,
        COUNT(uqm.mastery) as mastery_count
      FROM subsections s
      CROSS JOIN user_lookup u
      JOIN questions q ON q.subsection_id = s.id
      LEFT JOIN user_question_mastery uqm ON uqm.question_id = q.id AND uqm.user_id = u.id
      WHERE s.license_class = $1
      GROUP BY s.id
      ORDER BY 
        CASE WHEN COUNT(uqm.mastery) = 0 THEN 0 ELSE 1 END,
        total_mastery,
        s.id
      LIMIT 1
    )
    SELECT 
      q.id,
      q.question_text as question,
      q.fcc_refs as refs,
      a.answer_order as answer_index,
      a.answer_text,
      a.is_correct
    FROM questions q
    JOIN subsection_mastery sm ON q.subsection_id = sm.subsection_id
    JOIN answers a ON a.question_id = q.id
    ORDER BY q.id, a.answer_order
  `;

  const rows = await db.manyOrNone(query, [licenseClass, username]);

  const questionsMap = new Map<string, Question>();
  
  for (const row of rows) {
    if (!questionsMap.has(row.id)) {
      questionsMap.set(row.id, {
        id: row.id,
        question: row.question,
        refs: row.refs,
        correct: -1,
        answers: []
      });
    }
    
    const question = questionsMap.get(row.id)!;
    question.answers.push(row.answer_text);
    if (row.is_correct) {
      question.correct = row.answer_index;
    }
  }

  const questions = Array.from(questionsMap.values());
  return QuestionsSchema.parse(questions);
}
