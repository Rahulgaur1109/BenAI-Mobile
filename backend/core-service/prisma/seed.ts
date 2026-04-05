import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function readJSON(file: string) {
  const p = path.join(process.cwd(), "prisma", "seed-data", file);
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

async function seedUniversity() {
  const uni = readJSON("university.json");
  const campusMap = readJSON("campusMap.json");
  const calendar = readJSON("academicCalendar.json");
  
  const entries: Array<{ key: string; value: any }> = [
    { key: "university", value: uni },
    { key: "campusMap", value: campusMap },
    { key: "academicCalendar", value: calendar }
  ];

  for (const e of entries) {
    await prisma.universityInfo.upsert({
      where: { key: e.key },
      create: { key: e.key, value: e.value },
      update: { value: e.value }
    });
  }
  console.log("✓ University info, campus map, and academic calendar seeded");
}

async function seedProfessors() {
  const profData = readJSON("professors.json");
  const teachersData = readJSON("teachers.sample.json");
  
  const professors: Array<any> = profData.professors || [];
  const teachers: Array<any> = teachersData.teachers || [];
  
  const combined = [...professors, ...teachers];
  console.log(`Seeding ${combined.length} faculty members...`);
  let count = 0;
  
  for (const prof of combined) {
    const fullName = prof.name || (prof.firstName ? `${prof.firstName} ${prof.lastName || ""}`.trim() : "Unknown");
    const user = await prisma.user.upsert({
      where: { email: prof.email },
      create: {
        name: fullName,
        email: prof.email,
        role: "faculty"
      },
      update: { name: fullName }
    });
    
    // Extract office details from nested object if it exists
    const cabin = prof.cabin || (prof.office ? `${prof.office.building} ${prof.office.area}-${prof.office.room}` : null);
    
    await prisma.teacher.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        department: prof.department,
        designation: prof.designation,
        employeeId: prof.employeeId,
        specialization: prof.specialization,
        cabin: cabin,
        phone: prof.phone,
        officeHours: prof.officeHours,
        classSchedule: prof.classSchedule
      },
      update: {
        department: prof.department,
        designation: prof.designation,
        employeeId: prof.employeeId,
        specialization: prof.specialization,
        cabin: cabin,
        phone: prof.phone,
        officeHours: prof.officeHours,
        classSchedule: prof.classSchedule
      }
    });
    count++;
    if (count % 20 === 0) {
      console.log(`  Seeded ${count}/${combined.length} faculty members...`);
    }
  }
  console.log(`✓ All ${count} faculty members seeded`);
}

async function seedAcademicEvents() {
  const data = readJSON("academicCalendar.json");
  const baseEvents: Array<any> = data.events || [];
  const calendarEntries: Array<any> = data.academicCalendar2025_26?.entries || [];

  const parseDate = (dateStr: string) => {
    const firstPart = String(dateStr).split(" to ")[0];
    const parts = firstPart.split("-");
    if (parts.length === 3 && parts[2].length === 4) {
      const [dd, mm, yyyy] = parts;
      return new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
    }
    return new Date(firstPart);
  };

  const combined = [
    ...baseEvents.map((e: any) => ({
      title: e.event || e.title || e.type,
      description: `${e.type || e.event || ""} - ${e.day || ""}`.trim(),
      startTime: parseDate(e.date),
      location: "Bennett University"
    })),
    ...calendarEntries.map((e: any) => ({
      title: e.type,
      description: `${e.day || ""} • ${e.date}`.trim(),
      startTime: parseDate(e.date),
      location: "Bennett University"
    }))
  ];
  
  console.log(`Seeding ${combined.length} academic calendar events...`);
  
  for (const e of combined) {
    const startTime = new Date(e.startTime);
    await prisma.event.upsert({
      where: { title_startTime: { title: e.title, startTime } },
      create: {
        title: e.title,
        description: e.description,
        startTime,
        location: e.location
      },
      update: {
        description: e.description,
        location: e.location
      }
    });
  }
  console.log(`✓ ${combined.length} academic calendar events seeded`);
}

async function seedCampusEvents() {
  const data = readJSON("events.json");
  const all = [
    ...(data.upcoming || []).map((e: any) => ({ ...e, startTime: new Date(e.date), location: e.venue })),
    ...(data.ongoing || []).map((e: any) => ({ ...e, startTime: new Date(e.date), location: e.venue })),
    ...(data.past || []).map((e: any) => ({ ...e, startTime: new Date(e.date), location: e.venue }))
  ];
  
  console.log(`Seeding ${all.length} campus events...`);
  
  for (const e of all) {
    await prisma.event.upsert({
      where: { title_startTime: { title: e.title, startTime: new Date(e.startTime) } },
      create: {
        title: e.title,
        description: e.description,
        startTime: new Date(e.startTime),
        location: e.location
      },
      update: {
        description: e.description,
        location: e.location
      }
    });
  }
  console.log(`✓ ${all.length} campus events seeded`);
}

async function main() {
  console.log("Starting database seed...\n");
  await seedUniversity();
  await seedProfessors();
  await seedAcademicEvents();
  await seedCampusEvents();
  console.log("\n✓ All seed completed successfully!");
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
