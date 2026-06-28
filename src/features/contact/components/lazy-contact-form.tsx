import dynamic from "next/dynamic";

import { ContactFormSkeleton } from "@/features/contact/components/contact-form-skeleton";
import type { ContactFormConfig, ContactFormMessages } from "@/types/contact";

const ContactForm = dynamic(
  () =>
    import("@/features/contact/components/contact-form").then((module) => ({
      default: module.ContactForm,
    })),
  {
    loading: () => <ContactFormSkeleton />,
  },
);

interface LazyContactFormProps {
  config: ContactFormConfig;
  messages: ContactFormMessages;
}

export function LazyContactForm({ config, messages }: LazyContactFormProps) {
  return <ContactForm config={config} messages={messages} />;
}
