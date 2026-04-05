import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

export async function listEvents(_req: Request, res: Response) {
  const events = await prisma.event.findMany({ orderBy: { startTime: "asc" } });
  res.json({ events });
}

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  link: z.string().url().optional()
});

export async function createEvent(req: Request, res: Response) {
  try {
    const data = createEventSchema.parse(req.body);
    const created = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description || null,
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : null,
        location: data.location || null,
        link: data.link || null
      }
    });
    res.status(201).json(created);
  } catch (err: any) {
    if (err.name === "ZodError") return res.status(400).json({ message: "Validation failed", errors: err.errors });
    // eslint-disable-next-line no-console
    console.error("createEvent error", err);
    res.status(500).json({ message: "Failed to create event" });
  }
}
