import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site.config";
import { socialLinks } from "@/config/social-links.config";
import { absoluteUrl } from "@/lib/url";
import type { ResumeContent } from "@/types/resume";

function getSocialHref(platform: "linkedin" | "github" | "email"): string {
  const link = socialLinks.find((item) => item.platform === platform);
  return link?.href ?? "";
}

export const resumeContent = {
  id: "seed-resume",
  section: {
    title: "Resume Center",
    description:
      "ATS-friendly digital resume hub with career summary, experience snapshot, and direct access to my CV and professional profiles.",
  },
  profile: {
    fullName: siteConfig.author.name,
    title: siteConfig.author.jobTitle,
    location: "Istanbul, Turkey · Open to Remote",
    email: siteConfig.author.email,
    website: absoluteUrl(),
    linkedin: getSocialHref("linkedin"),
    github: getSocialHref("github"),
    summary:
      "Full Stack Developer with 5+ years of experience building scalable web applications. Specialized in React, Next.js, and TypeScript with a track record of delivering performant interfaces, reliable APIs, and AI-powered solutions.",
    yearsOfExperience: 5,
  },
  updatedAt: "2026-06-01",
  professionalSummary: {
    title: "Professional Summary",
    paragraphs: [
      "I build production-ready web applications across frontend and backend layers, with strong expertise in React, Next.js, TypeScript, and Node.js.",
      "My work focuses on measurable outcomes: performance optimization, accessible UI engineering, SEO-driven development, and AI feature integration that supports real business workflows.",
      "I collaborate closely with product, design, and engineering teams to deliver maintainable solutions from architecture through deployment.",
    ],
  },
  quickFacts: {
    title: "Quick Facts",
    items: [
      {
        id: "fact-experience",
        label: "Years of Experience",
        value: "5+ years",
      },
      {
        id: "fact-position",
        label: "Current Position",
        value: "Frontend & Full Stack Developer",
      },
      {
        id: "fact-technologies",
        label: "Primary Technologies",
        value: "React, Next.js, TypeScript",
      },
      {
        id: "fact-location",
        label: "Location",
        value: "Istanbul, Turkey",
      },
      {
        id: "fact-availability",
        label: "Availability",
        value: "Open to new opportunities",
      },
    ],
  },
  experienceSnapshot: {
    title: "Experience Snapshot",
    viewAllLabel: "View full experience",
    viewAllHref: ROUTES.experience,
    entryIds: ["exp-001", "exp-002", "exp-003"],
  },
  skillsSnapshot: {
    title: "Skills Snapshot",
    viewAllLabel: "View full skills",
    viewAllHref: ROUTES.skills,
    itemIds: [
      "expertise-frontend",
      "expertise-fullstack",
      "expertise-ai",
      "expertise-performance",
    ],
  },
  education: {
    title: "Education",
    items: [
      {
        id: "edu-001",
        institution: "Istanbul University",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Engineering",
        startDate: { month: 9, year: 2015 },
        endDate: { month: 6, year: 2019 },
        description:
          "Focused on software engineering, algorithms, and web technologies.",
      },
    ],
  },
  certifications: {
    title: "Certifications",
    items: [],
  },
  languages: {
    title: "Languages",
    items: [
      {
        id: "lang-tr",
        name: "Turkish",
        proficiency: "Native",
      },
      {
        id: "lang-en",
        name: "English",
        proficiency: "Professional",
      },
    ],
  },
  files: [
    {
      id: "resume-en",
      locale: "en",
      label: "English CV",
      filePath: "/resume/seval-senturk-resume-en.pdf",
      fileName: "Seval-Senturk-Resume-EN.pdf",
      mimeType: "application/pdf",
      isDefault: true,
    },
  ],
  actions: {
    downloadLabel: "Download Resume",
    viewLabel: "View Resume",
    contactLabel: "Contact Me",
    contactHref: ROUTES.contact,
  },
} as const satisfies ResumeContent;
