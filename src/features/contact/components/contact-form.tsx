"use client";

import { type FormEvent, useState } from "react";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

import { CONTACT_API_ROUTE, CONTACT_FIELD_LIMITS } from "@/lib/contact/constants";
import {
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
import { Card } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";

type FormStatus = "idle" | "loading" | "success" | "error";

interface ContactFormProps {
  config: ContactFormConfig;
  messages: ContactFormMessages;
}

const INITIAL_FORM: ContactFormInput = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
  projectType: "",
  website: "",
};

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

    const validation = validateContactForm(form);

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
        body: JSON.stringify(form),
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
      <Card>
        <Card.Content className="space-y-3" role="status" aria-live="polite">
          <Heading as="h3" variant="h4">
            {messages.successTitle}
          </Heading>
          <Text tone="muted">{messages.successMessage}</Text>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setStatus("idle")}
          >
            Send another message
          </Button>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Content>
        <Heading as="h3" variant="h4">
          {config.title}
        </Heading>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="absolute -left-[9999px]" aria-hidden>
            <Label htmlFor="contact-website">Website</Label>
            <Input
              id="contact-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact-name" required>
                {config.nameLabel}
              </Label>
              <Input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                maxLength={CONTACT_FIELD_LIMITS.name.max}
                hasError={Boolean(getFieldErrorMessage(errors, "name"))}
                aria-invalid={
                  getFieldErrorMessage(errors, "name") ? true : undefined
                }
                aria-describedby={
                  getFieldErrorMessage(errors, "name")
                    ? "contact-name-error"
                    : undefined
                }
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="mt-2"
              />
              <FieldError
                id="contact-name-error"
                message={getFieldErrorMessage(errors, "name")}
              />
            </div>

            <div>
              <Label htmlFor="contact-email" required>
                {config.emailLabel}
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                maxLength={CONTACT_FIELD_LIMITS.email.max}
                hasError={Boolean(getFieldErrorMessage(errors, "email"))}
                aria-invalid={
                  getFieldErrorMessage(errors, "email") ? true : undefined
                }
                aria-describedby={
                  getFieldErrorMessage(errors, "email")
                    ? "contact-email-error"
                    : undefined
                }
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="mt-2"
              />
              <FieldError
                id="contact-email-error"
                message={getFieldErrorMessage(errors, "email")}
              />
            </div>
          </div>

          {config.showCompanyField && (
            <div>
              <Label htmlFor="contact-company">{config.companyLabel}</Label>
              <Input
                id="contact-company"
                name="company"
                autoComplete="organization"
                maxLength={CONTACT_FIELD_LIMITS.company.max}
                hasError={Boolean(getFieldErrorMessage(errors, "company"))}
                aria-invalid={
                  getFieldErrorMessage(errors, "company") ? true : undefined
                }
                aria-describedby={
                  getFieldErrorMessage(errors, "company")
                    ? "contact-company-error"
                    : undefined
                }
                value={form.company}
                onChange={(event) => updateField("company", event.target.value)}
                className="mt-2"
              />
              <FieldError
                id="contact-company-error"
                message={getFieldErrorMessage(errors, "company")}
              />
            </div>
          )}

          {config.showProjectTypeField && (
            <div>
              <Label htmlFor="contact-project-type">
                {config.projectTypeLabel}
              </Label>
              <select
                id="contact-project-type"
                name="projectType"
                value={form.projectType}
                onChange={(event) =>
                  updateField("projectType", event.target.value)
                }
                className={cn(
                  "mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-body text-foreground",
                  FOCUS_RING_CLASS,
                )}
              >
                <option value="">Select a project type</option>
                {config.projectTypeOptions.map((option) => (
                  <option key={option.id} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <Label htmlFor="contact-subject" required>
              {config.subjectLabel}
            </Label>
            <Input
              id="contact-subject"
              name="subject"
              required
              maxLength={CONTACT_FIELD_LIMITS.subject.max}
              hasError={Boolean(getFieldErrorMessage(errors, "subject"))}
              aria-invalid={
                getFieldErrorMessage(errors, "subject") ? true : undefined
              }
              aria-describedby={
                getFieldErrorMessage(errors, "subject")
                  ? "contact-subject-error"
                  : undefined
              }
              value={form.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              className="mt-2"
            />
            <FieldError
              id="contact-subject-error"
              message={getFieldErrorMessage(errors, "subject")}
            />
          </div>

          <div>
            <Label htmlFor="contact-message" required>
              {config.messageLabel}
            </Label>
            <Textarea
              id="contact-message"
              name="message"
              required
              maxLength={CONTACT_FIELD_LIMITS.message.max}
              hasError={Boolean(getFieldErrorMessage(errors, "message"))}
              aria-invalid={
                getFieldErrorMessage(errors, "message") ? true : undefined
              }
              aria-describedby={
                getFieldErrorMessage(errors, "message")
                  ? "contact-message-error"
                  : undefined
              }
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              className="mt-2"
            />
            <FieldError
              id="contact-message-error"
              message={getFieldErrorMessage(errors, "message")}
            />
          </div>

          {status === "error" && serverError && (
            <Text
              as="p"
              variant="small"
              className="text-error"
              role="alert"
              aria-live="assertive"
            >
              {serverError}
            </Text>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={status === "loading"}
          >
            {status === "loading" ? messages.loadingLabel : config.submitLabel}
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
}
