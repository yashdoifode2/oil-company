"use client";

import { useState } from "react";
import { submitQuote, type QuotePayload } from "@/lib/quote";
import { Button } from "@/components/ui/Button";

type Props = {
  initialProduct?: string;
  initialIndustry?: string;
  initialMessage?: string;
};

export function QuoteForm({ initialProduct = "", initialIndustry = "", initialMessage = "" }: Props) {
  const [form, setForm] = useState<QuotePayload>({
    name: "",
    email: "",
    phone: "",
    company: "",
    product_of_interest: initialProduct || initialIndustry,
    quantity: "",
    message: initialMessage,
  });
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({
    type: "idle",
  });

  const update = (key: keyof QuotePayload, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((fe) => {
        const next = { ...fe };
        delete next[key];
        return next;
      });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle" });
    setFieldErrors({});

    const result = await submitQuote(form);
    if (result.ok) {
      setStatus({ type: "success", message: "Thanks! We've received your request and will respond within one business day." });
      setForm({ name: "", email: "", phone: "", company: "", product_of_interest: "", quantity: "", message: "" });
    } else {
      setStatus({ type: "error", message: result.error });
      if (result.fields) setFieldErrors(result.fields);
    }
    setSubmitting(false);
  };

  const Field = ({
    label,
    name,
    type = "text",
    required = false,
    placeholder,
    as = "input",
  }: {
    label: string;
    name: keyof QuotePayload;
    type?: string;
    required?: boolean;
    placeholder?: string;
    as?: "input" | "textarea";
  }) => {
    const commonProps = {
      id: name,
      name,
      required,
      placeholder,
      value: (form[name] ?? "") as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        update(name, e.target.value),
      className:
        "w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
      style: fieldErrors[name as string] ? { borderColor: "#dc2626" } : undefined,
    };
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium mb-1.5">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        {as === "textarea" ? (
          <textarea rows={5} {...commonProps} />
        ) : (
          <input type={type} {...commonProps} />
        )}
        {fieldErrors[name as string] && (
          <p className="text-xs text-red-600 mt-1">{fieldErrors[name as string].join(" ")}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-5" noValidate>
      <Field label="Full name" name="name" required placeholder="Your name" />
      <Field label="Email" name="email" type="email" required placeholder="you@company.com" />
      <Field label="Phone" name="phone" type="tel" placeholder="Optional" />
      <Field label="Company" name="company" placeholder="Optional" />
      <div className="md:col-span-2">
        <Field label="Product of interest" name="product_of_interest" placeholder="e.g. Hydraulic Oil HV-46" />
      </div>
      <div className="md:col-span-2">
        <Field label="Quantity / requirement" name="quantity" placeholder="e.g. 20 × 200L drums per month" />
      </div>
      <div className="md:col-span-2">
        <Field
          label="Message"
          name="message"
          required
          as="textarea"
          placeholder="Tell us what you need — product, quantity, delivery location, timeline."
        />
      </div>

      <div className="md:col-span-2">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Sending…" : "Request a Quote"}
        </Button>
      </div>

      {status.type === "success" && (
        <div className="md:col-span-2 p-4 bg-green-50 border border-green-200 text-green-800 rounded">
          {status.message}
        </div>
      )}
      {status.type === "error" && (
        <div className="md:col-span-2 p-4 bg-red-50 border border-red-200 text-red-800 rounded">
          {status.message}
        </div>
      )}
    </form>
  );
}