"use client";

import { useState, useTransition } from "react";

import { FooterDecorSvg } from "@/features/footer/components/footer-decor-svg";
import { subscribeNewsletterAction } from "@/features/admin/actions/content.actions";
import type { SiteFooterContent } from "@/types/footer";

interface FooterNewsletterFormProps {
  placeholder: string;
  buttonText: string;
}

export function FooterNewsletterForm({
  placeholder,
  buttonText,
}: FooterNewsletterFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await subscribeNewsletterAction(formData);
      if (result.success) {
        setMessage("Thanks for subscribing. We'll be in touch soon.");
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="site-footer__newsletter-form-wrap">
      <form action={handleSubmit} className="site-footer__newsletter-form">
        <label htmlFor="footer-newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          className="site-footer__newsletter-input"
          disabled={isPending}
        />
        <button
          type="submit"
          className="site-footer__newsletter-button"
          disabled={isPending}
        >
          {isPending ? "Sending…" : buttonText}
        </button>
      </form>
      {message ? (
        <p className="site-footer__newsletter-feedback site-footer__newsletter-feedback--success">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="site-footer__newsletter-feedback site-footer__newsletter-feedback--error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface FooterNewsletterProps {
  newsletter: SiteFooterContent["newsletter"];
}

export function FooterNewsletter({ newsletter }: FooterNewsletterProps) {
  if (!newsletter.enabled) {
    return null;
  }

  return (
    <section className="site-footer__newsletter" aria-labelledby="footer-newsletter-title">
      <FooterDecorSvg className="site-footer__newsletter-decor" />
      <div className="site-footer__newsletter-inner">
        <p className="site-footer__section-label">{newsletter.label}</p>
        <h2 id="footer-newsletter-title" className="site-footer__newsletter-title">
          {newsletter.title}
        </h2>
        {newsletter.description ? (
          <p className="site-footer__newsletter-description">{newsletter.description}</p>
        ) : null}
        <FooterNewsletterForm
          placeholder={newsletter.placeholder}
          buttonText={newsletter.buttonText}
        />
      </div>
    </section>
  );
}
