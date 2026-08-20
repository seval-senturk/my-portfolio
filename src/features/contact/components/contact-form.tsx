"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  UserRound,
} from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";

import { CardHoverOrbitals } from "@/components/shared/card-hover-orbitals";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import { CONTACT_API_ROUTE, CONTACT_FIELD_LIMITS } from "@/lib/contact/constants";
import {
  buildContactSubject,
  getFieldErrorMessage,
  validateContactForm,
} from "@/lib/contact/validation";
import type {
  ContactFormConfig,
  ContactFormInput,
  ContactFormMessages,
  ContactFormValidationError,
} from "@/types/contact";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

type FormStatus = "idle" | "loading" | "success" | "error";

interface ContactFormProps {
  config: ContactFormConfig;
  messages: ContactFormMessages;
}

const INITIAL_FORM: ContactFormInput = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  projectType: "",
  website: "",
};

interface ContactFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  icon: ReactNode;
  className?: string;
  children: ReactNode;
}

function ContactField({
  id,
  label,
  required,
  error,
  icon,
  className,
  children,
}: ContactFieldProps) {
  return (
    <div className={cn("contact-form__field", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
        {required ? " (required)" : ""}
      </label>
      <div
        className={cn(
          "contact-form__control",
          error && "contact-form__control--error",
        )}
      >
        <span className="contact-form__control-icon" aria-hidden>
          {icon}
        </span>
        {children}
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function ContactForm({ config, messages }: ContactFormProps) {
  const [form, setForm] = useState<ContactFormInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactFormValidationError[]>([]);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState<string | undefined>();

  function updateField<K extends keyof ContactFormInput>(
    field: K,
    value: ContactFormInput[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => current.filter((error) => error.field !== field));
    setServerError(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(undefined);

    const payload: ContactFormInput = {
      ...form,
      subject: buildContactSubject(form.projectType ?? ""),
    };

    const validation = validateContactForm(payload, config);

    if (!validation.success) {
      setErrors(validation.errors);
      setStatus("idle");
      return;
    }

    setErrors([]);
    setStatus("loading");

    try {
      const response = await fetch(CONTACT_API_ROUTE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        setStatus("error");
        setServerError(result.error ?? messages.errorMessage);
        return;
      }

      setStatus("success");
      setForm(INITIAL_FORM);
    } catch {
      setStatus("error");
      setServerError(messages.errorMessage);
    }
  }

  if (status === "success") {
    return (
      <article className={cn("contact-form-panel", "interactive-card")}>
        <CardHoverOrbitals />
        <div className="contact-form-panel__inner" role="status" aria-live="polite">
          <Heading as="h3" variant="h4">
            {messages.successTitle}
          </Heading>
          <Text tone="muted" className="contact-form-panel__success-copy">
            {messages.successMessage}
          </Text>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setStatus("idle")}
          >
            Send another message
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("contact-form-panel", "interactive-card")}>
      <CardHoverOrbitals />
      <div className="contact-form-panel__inner">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="absolute -left-[9999px]" aria-hidden>
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
            />
          </div>

          <div className="contact-form__grid">
            {config.name.enabled ? (
              <ContactField
                id="contact-name"
                label={config.name.label}
                required={config.name.required}
                error={getFieldErrorMessage(errors, "name")}
                icon={<UserRound size={18} strokeWidth={1.75} />}
              >
                <input
                  id="contact-name"
                  name="name"
                  required={config.name.required}
                  autoComplete="name"
                  placeholder={config.name.placeholder}
                  maxLength={CONTACT_FIELD_LIMITS.name.max}
                  aria-invalid={getFieldErrorMessage(errors, "name") ? true : undefined}
                  aria-describedby={
                    getFieldErrorMessage(errors, "name") ? "contact-name-error" : undefined
                  }
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="contact-form__input"
                />
              </ContactField>
            ) : null}

            {config.email.enabled ? (
              <ContactField
                id="contact-email"
                label={config.email.label}
                required={config.email.required}
                error={getFieldErrorMessage(errors, "email")}
                icon={<Mail size={18} strokeWidth={1.75} />}
              >
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required={config.email.required}
                  autoComplete="email"
                  placeholder={config.email.placeholder}
                  maxLength={CONTACT_FIELD_LIMITS.email.max}
                  aria-invalid={getFieldErrorMessage(errors, "email") ? true : undefined}
                  aria-describedby={
                    getFieldErrorMessage(errors, "email") ? "contact-email-error" : undefined
                  }
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="contact-form__input"
                />
              </ContactField>
            ) : null}

            {config.phone.enabled ? (
              <ContactField
                id="contact-phone"
                label={config.phone.label}
                required={config.phone.required}
                error={getFieldErrorMessage(errors, "phone")}
                icon={<Phone size={18} strokeWidth={1.75} />}
              >
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  required={config.phone.required}
                  autoComplete="tel"
                  placeholder={config.phone.placeholder}
                  maxLength={CONTACT_FIELD_LIMITS.phone.max}
                  aria-invalid={getFieldErrorMessage(errors, "phone") ? true : undefined}
                  aria-describedby={
                    getFieldErrorMessage(errors, "phone") ? "contact-phone-error" : undefined
                  }
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="contact-form__input"
                />
              </ContactField>
            ) : null}

            {config.projectType.enabled ? (
              <ContactField
                id="contact-project-type"
                label={config.projectType.label}
                required={config.projectType.required}
                icon={<BriefcaseBusiness size={18} strokeWidth={1.75} />}
              >
                <select
                  id="contact-project-type"
                  name="projectType"
                  value={form.projectType}
                  onChange={(event) => updateField("projectType", event.target.value)}
                  className={cn("contact-form__input contact-form__select", FOCUS_RING_CLASS)}
                >
                  <option value="">{config.projectType.placeholder}</option>
                  {config.projectTypeOptions.map((option) => (
                    <option key={option.id} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="contact-form__select-chevron"
                  aria-hidden
                />
              </ContactField>
            ) : null}

            {config.message.enabled ? (
              <ContactField
                id="contact-message"
                label={config.message.label}
                required={config.message.required}
                error={getFieldErrorMessage(errors, "message")}
                icon={<MessageSquare size={18} strokeWidth={1.75} />}
                className="contact-form__field--full"
              >
                <textarea
                  id="contact-message"
                  name="message"
                  required={config.message.required}
                  placeholder={config.message.placeholder}
                  maxLength={CONTACT_FIELD_LIMITS.message.max}
                  aria-invalid={getFieldErrorMessage(errors, "message") ? true : undefined}
                  aria-describedby={
                    getFieldErrorMessage(errors, "message") ? "contact-message-error" : undefined
                  }
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  className="contact-form__textarea"
                  rows={5}
                />
              </ContactField>
            ) : null}
          </div>

          {status === "error" && serverError ? (
            <Text
              as="p"
              variant="small"
              className="text-error"
              role="alert"
              aria-live="assertive"
            >
              {serverError}
            </Text>
          ) : null}

          <div className="contact-form__actions">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={status === "loading"}
              className="contact-form__submit shadow-[0_12px_32px_rgba(124,131,255,0.28)]"
            >
              {status === "loading" ? messages.loadingLabel : config.submitLabel}
              <ArrowUpRight size={18} aria-hidden />
            </Button>

            {config.securityNote.visible ? (
              <p className="contact-form__security">
                <Lock size={14} aria-hidden />
                <span>{config.securityNote.text}</span>
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </article>
  );
}
