import type { EducationHomeContent } from "@/types/education-home";

export const educationHomeContent: EducationHomeContent = {
  section: {
    label: "MY BACKGROUND",
    title: "Education",
    description:
      "Academic foundation in computer science and software engineering, with focus on algorithms, systems, and modern web technologies.",
    visible: true,
  },
  entries: [
    {
      id: "edu-home-001",
      institution: "Istanbul University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Engineering",
      levelBadge: "B.S. DEGREE",
      startDate: { month: 9, year: 2015 },
      endDate: { month: 6, year: 2019 },
      description:
        "Focused on software engineering, algorithms, data structures, and web technologies. Completed capstone project on scalable web application architecture.",
      technologies: [
        "Computer Science",
        "Algorithms",
        "Data Structures",
        "Software Engineering",
      ],
      visible: true,
    },
  ],
};
