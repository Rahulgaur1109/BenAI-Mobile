import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getAllInfo(_req: Request, res: Response) {
  const rows = await prisma.universityInfo.findMany({ orderBy: { key: "asc" } });
  res.json({ info: rows });
}

export async function getInfoByKey(req: Request, res: Response) {
  const key = String(req.params.key);
  const row = await prisma.universityInfo.findUnique({ where: { key } });
  if (!row) return res.status(404).json({ message: "Not found" });
  res.json(row);
}
