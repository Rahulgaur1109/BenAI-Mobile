import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const UNIVERSITY_NAME = process.env.UNIVERSITY_NAME || "Bennett University";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

// Load static knowledge
function readJSON(file: string) {
  const p = path.join(__dirname, "..", "..", "knowledge", file);
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

const university = (() => {
  try { return readJSON("university.json"); } catch { return {}; }
})();
const events = (() => {
  try { return readJSON("events.json"); } catch { return { upcoming: [], ongoing: [], past: [] }; }
})();
const teacherFallback = (() => {
  try { return readJSON("teachers.sample.json"); } catch { return { teachers: [] }; }
})();

async function loadTeachers(): Promise<any[]> {
  if (!USER_SERVICE_URL) {
    console.log("USER_SERVICE_URL not set, using fallback");
    return teacherFallback.teachers || [];
  }
  try {
    const url = `${USER_SERVICE_URL.replace(/\/$/, "")}/api/teachers`;
    console.log("Fetching teachers from:", url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Teachers fetch failed: ${res.status}`);
    const data = await res.json();
    const mapped = (data?.teachers || data || []).map((t: any) => ({
      name: t.user?.name || t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim(),
      email: t.user?.email || t.email,
      department: t.department,
      designation: t.designation,
      employeeId: t.employeeId,
      specialization: t.specialization,
      cabin: t.cabin,
      phone: t.phone,
      officeHours: t.officeHours,
      classSchedule: t.classSchedule
    }));
    console.log(`Loaded ${mapped.length} teachers, first:`, mapped[0]);
    return mapped;
  } catch (err) {
    console.error("Error loading teachers:", err);
    return teacherFallback.teachers || [];
  }
}

async function loadCampusMap(): Promise<any> {
  if (!USER_SERVICE_URL) return {};
  try {
    const url = `${USER_SERVICE_URL.replace(/\/$/, "")}/api/university/campusMap`;
    const res = await fetch(url);
    if (!res.ok) return {};
    const data = await res.json();
    return data?.value || data || {};
  } catch (_err) {
    return {};
  }
}

async function loadAcademicCalendar(): Promise<any> {
  if (!USER_SERVICE_URL) return {};
  try {
    const url = `${USER_SERVICE_URL.replace(/\/$/, "")}/api/university/academicCalendar`;
    const res = await fetch(url);
    if (!res.ok) return {};
    const data = await res.json();
    return data?.value || data || {};
  } catch (_err) {
    return {};
  }
}

export async function generateAnswer({ message, userId, role }: { message: string; userId?: string; role?: string; }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "AI is not configured. Please set GEMINI_API_KEY on the server.";
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  // Load all context data
  const teachers = await loadTeachers();
  const campusMap = await loadCampusMap();
  const academicCalendar = await loadAcademicCalendar();

  const context = [
    `You are BenAI's helpful assistant for ${UNIVERSITY_NAME}.`,
    "Answer concisely and accurately. If unsure, say you don't know.",
    "You have comprehensive information about:",
    "- 100+ faculty members with their cabin locations, phone numbers, office hours, and class schedules",
    "- Complete campus map including all blocks, hostels, food spots, sports facilities, and services",
    "- Academic calendar with exam dates, holidays, and important deadlines",
    "",
    "When asked about locations, provide specific details:",
    "- Faculty cabins are in M Block (e.g., M Block 101), N1 Block (e.g., N1-205), or N2 Block (e.g., N2-112)",
    "- Boys hostels: C1-C12 (Warden offices at C1 for C1-C5, C8 for C6-C12)",
    "- Girls hostels: D1-D6",
    "- Admin blocks: A Block, B Block",
    "- Sports: K Block (gym, swimming pool, sports facilities)",
    "- Food: Gobble Mess (2 floors), Tuck Shop (C7), Maggie Hotspot (near C1), Southern Hotspot (near D1), Dominos/Subway (N Block), Infinity Cafe (between N blocks)",
    "- Gates: Gate 1 (main entry/exit), Gate 2 (food delivery), Gate 3 (package delivery)",
    "",
    "When asked about professors or faculty:",
    "- Provide their cabin location, phone number, office hours, and class schedule if available",
    "- Mention their department, designation, and specialization",
    "",
    "When asked about campus facilities:",
    "- Provide exact locations (block numbers, floor if applicable)",
    "- Include timings and contact information when available",
    "",
    "For academic queries:",
    "- Refer to the academic calendar for exam dates, holidays, and deadlines",
    "- Provide registration dates, withdrawal deadlines, and semester schedules",
    "",
    "Always cite from the provided context. Do not fabricate information."
  ].join("\n");

  const knowledge = JSON.stringify({
    university,
    teachers,
    campusMap,
    academicCalendar,
    events
  }, null, 2);

  const prompt = [
    context,
    "--- CONTEXT JSON ---",
    knowledge,
    "--- END CONTEXT ---",
    userId ? `UserId: ${userId}` : "",
    role ? `Role: ${role}` : "",
    "User message:",
    message
  ].filter(Boolean).join("\n\n");

  const resp = await model.generateContent(prompt);
  const text = resp.response.text();
  return text.trim();
}
