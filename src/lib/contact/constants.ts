export const CONTACT_FIELD_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 150 },
  message: { min: 10, max: 2000 },
  company: { max: 100 },
} as const;

export const CONTACT_API_ROUTE = "/api/contact" as const;
