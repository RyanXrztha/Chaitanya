import { ANY_THERAPIST_ID, TIME_SLOTS, type Therapist } from "@/domain";
import { therapistPhoto } from "./images";

// From Booking.dc.html (THERAPISTS / NO_PREF).

const therapist = (t: Omit<Therapist, "photo">): Therapist => ({ ...t, photo: therapistPhoto(t.id, t.name) });

export const THERAPISTS: Therapist[] = [
  therapist({
    id: "as",
    name: "Dr. Anjali Sharma",
    role: "Senior Ayurvedic Physician",
    initials: "AS",
    workingDays: [1, 2, 3, 4, 5],
    timeSlots: ["09:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
  }),
  therapist({
    id: "sg",
    name: "Sunita Gurung",
    role: "Massage Therapist",
    initials: "SG",
    workingDays: [0, 2, 4, 6],
    timeSlots: ["12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"],
  }),
  therapist({
    id: "rt",
    name: "Ramesh Tiwari",
    role: "Naturopathy Specialist",
    initials: "RT",
    workingDays: [1, 3, 5, 6],
    timeSlots: ["09:00 AM", "12:00 PM", "06:00 PM", "08:00 PM"],
  }),
  therapist({
    id: "pk",
    name: "Priya Karki",
    role: "Facial & Beauty Therapist",
    initials: "PK",
    workingDays: [0, 1, 2, 3, 4],
    timeSlots: ["09:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"],
  }),
];

export const ANY_THERAPIST: Therapist = {
  id: ANY_THERAPIST_ID,
  name: "No preference",
  role: "We will assign for you",
  initials: "?",
  workingDays: [0, 1, 2, 3, 4, 5, 6],
  timeSlots: [...TIME_SLOTS],
  photo: null,
};
