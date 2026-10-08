// Generated from design_handoff_chaitanya_website/services-data.js
// Real service names & prices from chaitanyahealth.com (Sep 2026). Edit the data here, not the handoff.

export interface RawCategory {
  key: string;
  label: string;
  blurb: string;
  subs?: { key: string; label: string }[];
  tabs?: { key: string; label: string }[];
}

export interface RawService {
  id: number;
  name: string;
  price: number;
  cat: string;
  sub: string | null;
  group?: string;
  pkgTab?: string;
  cats: string[];
  mins: number;
  duration: string;
}

export const RAW_CATEGORIES: RawCategory[] = [
  { key: "featured", label: "Featured", blurb: "Signature experiences our guests return for, season after season." },
  { key: "package", label: "Lifestyle Wellness Package", blurb: "Curated multi-therapy packages for a complete reset.", tabs: [{ key: "beauty", label: "Beauty & Salon" }, { key: "relax", label: "Relax & Revitalize" }, { key: "wellness", label: "Wellness Therapies" }] },
  { key: "relax", label: "Relax & Revitalize", blurb: "Relaxation therapies and body retreats to release tension and renew skin.", subs: [{ key: "relaxation", label: "Relaxation Therapy" }, { key: "retreat", label: "Body Retreat" }] },
  { key: "wellness", label: "Wellness Therapies", blurb: "Traditional and modern therapeutic systems, delivered by trained therapists.", subs: [{ key: "ayurvedic", label: "Ayurvedic Therapy (Indian)" }, { key: "oriental", label: "Oriental & Alternative Therapy (East Asia)" }, { key: "western", label: "West & Modern Therapy" }, { key: "specialist", label: "Specialist Therapy" }] },
  { key: "beauty", label: "Beauty & Salon", blurb: "Facial care, hair care, nail care and hair removal." },
  { key: "treatment", label: "Treatment", blurb: "Targeted Ayurvedic treatment therapies for neck, spine, knees and back." },
  { key: "hydro", label: "Hydrotherapy", blurb: "Steam, sauna and herbal water therapies." },
];

export const RAW_SERVICES: RawService[] = [
  { id: 2480, name: "Chaitanya Ayurvedic Signature Relaxation Therapy", price: 4000, cat: "relax", sub: "relaxation", cats: ["relax","featured"], mins: 60, duration: "60 mins" },
  { id: 2528, name: "Chaitanya Deep Tissue Relaxation Therapy", price: 4500, cat: "relax", sub: "relaxation", cats: ["relax","featured"], mins: 60, duration: "60 mins" },
  { id: 2587, name: "Chaitanya Feet and Palm Reflexology Relaxation Therapy", price: 1500, cat: "relax", sub: "relaxation", cats: ["relax","featured"], mins: 30, duration: "30 mins" },
  { id: 2588, name: "Chaitanya Feet Reflexology Relaxation Therapy", price: 1500, cat: "relax", sub: "relaxation", cats: ["relax"], mins: 30, duration: "30 mins" },
  { id: 2671, name: "Chaitanya Head & Shoulder Relaxation Therapy", price: 1500, cat: "relax", sub: "relaxation", cats: ["relax"], mins: 30, duration: "30 mins" },
  { id: 2727, name: "Chaitanya Kid's Relaxation Therapy", price: 3000, cat: "relax", sub: "relaxation", cats: ["relax"], mins: 45, duration: "45 mins" },
  { id: 2838, name: "Chaitanya Post-Pregnancy/Sutkeri/Post-Natal Relaxation Therapy", price: 3000, cat: "relax", sub: "relaxation", cats: ["relax"], mins: 60, duration: "60 mins" },
  { id: 2843, name: "Chaitanya Pregnancy / Prenatal Relaxation Therapy", price: 3000, cat: "relax", sub: "relaxation", cats: ["relax"], mins: 60, duration: "60 mins" },
  { id: 2934, name: "Chaitanya Swedish Relaxation Therapy", price: 3000, cat: "relax", sub: "relaxation", cats: ["relax"], mins: 60, duration: "60 mins" },
  { id: 2969, name: "Chaitanya Trekkers/Travelers Relaxation Therapy", price: 3000, cat: "relax", sub: "relaxation", cats: ["relax"], mins: 60, duration: "60 mins" },
  { id: 2434, name: "Body Polish/Scrub with Rose Gel and Walnut Scrub - Full Body", price: 4500, cat: "relax", sub: "retreat", cats: ["relax","featured"], mins: 60, duration: "60 mins" },
  { id: 2433, name: "Body Polish/Scrub with Lime Gel and Walnut Scrub - Full Body", price: 4500, cat: "relax", sub: "retreat", cats: ["relax"], mins: 60, duration: "60 mins" },
  { id: 2793, name: "Normal Body Scrub - Back Only", price: 2500, cat: "relax", sub: "retreat", cats: ["relax"], mins: 30, duration: "30 mins" },
  { id: 2794, name: "Normal Body Scrub - Full Body", price: 4500, cat: "relax", sub: "retreat", cats: ["relax"], mins: 60, duration: "60 mins" },
  { id: 2681, name: "Herbal Body Scrub - Back Only", price: 2500, cat: "relax", sub: "retreat", cats: ["relax"], mins: 30, duration: "30 mins" },
  { id: 2682, name: "Herbal Body Scrub - Full Body", price: 4500, cat: "relax", sub: "retreat", cats: ["relax"], mins: 60, duration: "60 mins" },
  { id: 3939, name: "Salt Oil Glow Body Scrub Lavender - Full Body", price: 4500, cat: "relax", sub: "retreat", cats: ["relax"], mins: 60, duration: "60 mins" },
  { id: 4315, name: "Coffee & Mint Body Scrub - Full Body", price: 2250, cat: "relax", sub: "retreat", cats: ["relax"], mins: 45, duration: "45 mins" },
  { id: 4532, name: "Healing Package", price: 19000, cat: "relax", sub: "retreat", cats: ["relax"], mins: 180, duration: "3 hrs" },
  { id: 2401, name: "Ayurvedic Abhyanga Treatment Therapy", price: 4500, cat: "wellness", sub: "ayurvedic", cats: ["wellness","featured"], mins: 90, duration: "90 mins" },
  { id: 2839, name: "Ayurvedic Potli Treatment Therapy", price: 4500, cat: "wellness", sub: "ayurvedic", cats: ["wellness","treatment"], mins: 60, duration: "60 mins" },
  { id: 2907, name: "Ayurvedic Shirodhara with Feet Reflexology", price: 4500, cat: "wellness", sub: "ayurvedic", cats: ["wellness","featured"], mins: 30, duration: "30 mins" },
  { id: 2723, name: "Ayurvedic Kati Basti Treatment (Tail Bone Treatment Therapy) with Back Treatment", price: 5000, cat: "wellness", sub: "ayurvedic", cats: ["wellness","treatment"], mins: 60, duration: "60 mins" },
  { id: 2647, name: "Ayurvedic Greeva Basti (Neck Treatment Therapy) with Head and Shoulder Treatment", price: 5000, cat: "wellness", sub: "ayurvedic", cats: ["wellness","treatment"], mins: 60, duration: "60 mins" },
  { id: 2717, name: "Ayurvedic Janu Basti (Knee Treatment Therapy)", price: 5000, cat: "wellness", sub: "ayurvedic", cats: ["wellness","treatment"], mins: 60, duration: "60 mins" },
  { id: 2984, name: "Urovasti (Upper Chest with Inner Shoulder and Arm) Treatment Therapy", price: 5000, cat: "wellness", sub: "ayurvedic", cats: ["wellness","treatment"], mins: 60, duration: "60 mins" },
  { id: 2381, name: "Acupressure", price: 1000, cat: "wellness", sub: "oriental", cats: ["wellness"], mins: 30, duration: "30 mins" },
  { id: 2948, name: "Ayurvedic Thai Treatment Therapy", price: 4500, cat: "wellness", sub: "oriental", cats: ["wellness"], mins: 60, duration: "60 mins" },
  { id: 4538, name: "Ayurvedic Shiatsu / Anma Treatment Therapy", price: 4500, cat: "wellness", sub: "oriental", cats: ["wellness"], mins: 60, duration: "60 mins" },
  { id: 2697, name: "Ayurvedic Hot Stone Treatment Therapy with Oil preference", price: 5000, cat: "wellness", sub: "western", cats: ["wellness","featured"], mins: 90, duration: "90 mins" },
  { id: 4582, name: "Ayurvedic Hot Stone Treatment Therapy with Oil preference - Back Body only", price: 5000, cat: "wellness", sub: "western", cats: ["wellness"], mins: 90, duration: "90 mins" },
  { id: 4536, name: "Chaitanya Signature Massage Therapy (60 mins) + Steam", price: 5800, cat: "wellness", sub: "western", cats: ["wellness","hydro","featured"], mins: 75, duration: "60 mins + steam" },
  { id: 4535, name: "Chaitanya Vertebral Treatment Therapy (Spine Treatment) - Oil", price: 3000, cat: "wellness", sub: "specialist", cats: ["wellness","treatment"], mins: 30, duration: "30 mins" },
  { id: 2792, name: "Hair Wash with Normal Blow Dry", price: 2000, cat: "beauty", sub: null, group: "Hair Care", cats: ["beauty"], mins: 30, duration: "30 mins" },
  { id: 2895, name: "Hair Treatment with Cream", price: 2500, cat: "beauty", sub: null, group: "Hair Care", cats: ["beauty"], mins: 45, duration: "45 mins" },
  { id: 2979, name: "Wax - Underarm (Ladies & Gents)", price: 1000, cat: "beauty", sub: null, group: "Hair Removal", cats: ["beauty"], mins: 15, duration: "15 mins" },
  { id: 2623, name: "Wax - Full Leg (Ladies & Gents)", price: 2500, cat: "beauty", sub: null, group: "Hair Removal", cats: ["beauty"], mins: 30, duration: "30 mins" },
  { id: 2423, name: "Wax - Bikini (Lining Wax) - Ladies Only", price: 2000, cat: "beauty", sub: null, group: "Hair Removal", cats: ["beauty"], mins: 30, duration: "30 mins" },
  { id: 2444, name: "Brazilian Waxing For Ladies", price: 3000, cat: "beauty", sub: null, group: "Hair Removal", cats: ["beauty"], mins: 30, duration: "30 mins" },
  { id: 2620, name: "Wax - Full Arm (Ladies & Gents)", price: 2000, cat: "beauty", sub: null, group: "Hair Removal", cats: ["beauty"], mins: 30, duration: "30 mins" },
  { id: 2661, name: "Wax - Half Arms (Ladies & Gents)", price: 1000, cat: "beauty", sub: null, group: "Hair Removal", cats: ["beauty"], mins: 15, duration: "15 mins" },
  { id: 2663, name: "Wax - Half Leg (Ladies & Gents)", price: 1500, cat: "beauty", sub: null, group: "Hair Removal", cats: ["beauty"], mins: 15, duration: "15 mins" },
  { id: 2377, name: "Wax - Abdomen (Ladies & Gents)", price: 1500, cat: "beauty", sub: null, group: "Hair Removal", cats: ["beauty"], mins: 15, duration: "15 mins" },
  { id: 2950, name: "Beauty-Threading - Upper Lips", price: 250, cat: "beauty", sub: null, group: "Hair Removal", cats: ["beauty"], mins: 15, duration: "15 mins" },
  { id: 2822, name: "Pearl-Facial Treatment for Glowing Skin", price: 4000, cat: "beauty", sub: null, group: "Facial Care", cats: ["beauty","featured"], mins: 60, duration: "60 mins" },
  { id: 2684, name: "Herbal Facial Treatment", price: 3000, cat: "beauty", sub: null, group: "Facial Care", cats: ["beauty"], mins: 60, duration: "60 mins" },
  { id: 2428, name: "Facial-Face Cleansing (Blackhead Removal)", price: 2500, cat: "beauty", sub: null, group: "Facial Care", cats: ["beauty"], mins: 60, duration: "60 mins" },
  { id: 2394, name: "Anti-Acne Facial Treatment", price: 3500, cat: "beauty", sub: null, group: "Facial Care", cats: ["beauty"], mins: 60, duration: "60 mins" },
  { id: 2395, name: "Anti-Aging Facial Treatment - Rose & Wine", price: 4000, cat: "beauty", sub: null, group: "Facial Care", cats: ["beauty","featured"], mins: 60, duration: "60 mins" },
  { id: 2396, name: "Anti-Melasma Facial Treatment", price: 4000, cat: "beauty", sub: null, group: "Facial Care", cats: ["beauty"], mins: 60, duration: "60 mins" },
  { id: 2641, name: "Gold Facial Treatment", price: 4000, cat: "beauty", sub: null, group: "Facial Care", cats: ["beauty"], mins: 60, duration: "60 mins" },
  { id: 2747, name: "Beauty Manicure", price: 2000, cat: "beauty", sub: null, group: "Nail Care", cats: ["beauty"], mins: 45, duration: "45 mins" },
  { id: 2823, name: "Beauty Pedicure", price: 2000, cat: "beauty", sub: null, group: "Nail Care", cats: ["beauty"], mins: 45, duration: "45 mins" },
  { id: 4518, name: "Chaitanya Beauty Care", price: 4000, cat: "package", sub: null, pkgTab: "beauty", cats: ["package"], mins: 120, duration: "2 hrs" },
  { id: 4517, name: "Chaitanya Glow and Grow Body Pamper Package", price: 12350, cat: "package", sub: null, pkgTab: "beauty", cats: ["package","featured"], mins: 180, duration: "3 hrs" },
  { id: 4313, name: "Self Care Package", price: 5700, cat: "package", sub: null, pkgTab: "relax", cats: ["package","featured"], mins: 120, duration: "2 hrs" },
  { id: 4508, name: "Ultimate Party Package", price: 20615, cat: "package", sub: null, pkgTab: "relax", cats: ["package"], mins: 180, duration: "3 hrs" },
  { id: 4514, name: "Ladies Delight Package (Normal)", price: 5700, cat: "package", sub: null, pkgTab: "wellness", cats: ["package"], mins: 120, duration: "2 hrs" },
  { id: 4513, name: "Ladies Delight Package (Standard)", price: 21850, cat: "package", sub: null, pkgTab: "wellness", cats: ["package"], mins: 180, duration: "3 hrs" },
  { id: 2923, name: "Steam Bath - Hydrotherapy", price: 2000, cat: "hydro", sub: null, cats: ["hydro"], mins: 30, duration: "30 mins" },
  { id: 2886, name: "Sauna Bath - Hydrotherapy", price: 2000, cat: "hydro", sub: null, cats: ["hydro"], mins: 30, duration: "30 mins" },
  { id: 2685, name: "Herbal Foot Bath", price: 1000, cat: "hydro", sub: null, cats: ["hydro"], mins: 15, duration: "15 mins" },
];

/** Display order of the "Featured" category (and the default sort). */
export const FEATURED_ORDER: number[] = [2480,2528,2401,2907,2822,2434,4536,4517,2697,2395,2587,4313];
