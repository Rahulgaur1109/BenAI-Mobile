import { Request, Response } from "express";
import { z } from "zod";
import { generateAnswer } from "../services/gemini";

const chatSchema = z.object({
  message: z.string().min(1),
  userId: z.string().optional(),
  role: z.string().optional()
});

export async function chat(req: Request, res: Response) {
  try {
    const { message, userId, role } = chatSchema.parse(req.body);
    const answer = await generateAnswer({ message, userId, role });
    return res.json({ reply: answer });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: "Validation failed", errors: err.errors });
    }
    // eslint-disable-next-line no-console
    console.error("AI chat error:", err);
    console.error("Error stack:", err.stack);
    return res.status(500).json({ message: "Failed to generate response", error: err.message });
  }
}
