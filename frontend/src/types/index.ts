export type UserRole = "student" | "faculty" | "parent" | "guest";

export type AuthUser = {
  name: string;
  email: string;
  role: UserRole;
};

export type Teacher = {
  id: number | string;
  user?: { name?: string; email?: string };
  name?: string;
  designation?: string;
  department?: string;
  specialization?: string;
  cabin?: string;
  phone?: string;
  officeHours?: string;
  classSchedule?: string;
};

export type CampusEvent = {
  id: number | string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  location?: string;
  link?: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export type UniversityInfoRow = {
  id: number;
  key: string;
  value: any;
};
