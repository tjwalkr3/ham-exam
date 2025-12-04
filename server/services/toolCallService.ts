import { db } from '../db.js';
import { ensureUserExists } from './databaseService.js';
import { ToolCall } from '../zod-types/toolCallModel.js';
import { ToolCallLog, ToolCallLogArraySchema } from '../zod-types/toolCallLogModel.js';

export async function logToolCall(username: string, toolCall: ToolCall): Promise<void> {
  const userId = await ensureUserExists(username);
  const functionName = toolCall.function.name;
  const args = toolCall.function.arguments;
  const description = `Called function ${functionName} with arguments: ${args}`;

  await db.none(
    'INSERT INTO tool_calls (user_id, toolcall_description) VALUES ($1, $2)',
    [userId, description]
  );
}

export async function getToolCalls(username: string): Promise<ToolCallLog[]> {
  const userId = await ensureUserExists(username);
  
  const rows = await db.manyOrNone(
    'SELECT id, user_id, timestamp, toolcall_description FROM tool_calls WHERE user_id = $1 ORDER BY timestamp DESC',
    [userId]
  );

  return ToolCallLogArraySchema.parse(rows);
}
