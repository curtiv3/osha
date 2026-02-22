"use client";

import "client-only";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required."),
  sites: z.array(z.object({ value: z.string().min(2, "Site name is required.") })).min(1, "At least one site is required."),
});

type OnboardingFormValues = z.infer<typeof formSchema>;

export function OnboardingForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      sites: [{ value: "" }],
    },
  });

  const fieldArray = useFieldArray({ control: form.control, name: "sites" });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: values.companyName,
        sites: values.sites.map((site) => site.value),
      }),
    });

    if (!response.ok) {
      setError("Onboarding failed. Please try again.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5">
      <label className="block text-sm text-text-secondary">
        Company name
        <input
          className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary"
          {...form.register("companyName")}
        />
      </label>

      <div className="space-y-3">
        <p className="text-sm text-text-secondary">Sites</p>
        {fieldArray.fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              className="w-full rounded-md border border-border bg-elevated px-3 py-2 text-text-primary"
              {...form.register(`sites.${index}.value`)}
              placeholder={`Site ${index + 1}`}
            />
            {fieldArray.fields.length > 1 ? (
              <Button type="button" variant="outline" onClick={() => fieldArray.remove(index)}>
                Entfernen
              </Button>
            ) : null}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => fieldArray.append({ value: "" })}>
          Site hinzufügen
        </Button>
      </div>

      {error ? <p className="text-sm text-accent-warm">{error}</p> : null}

      <Button type="submit" variant="accent" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Speichere…" : "Onboarding abschließen"}
      </Button>
    </form>
  );
}
