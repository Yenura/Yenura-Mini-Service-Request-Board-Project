'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { createJob } from '@/lib/api';

const CATEGORIES = ['Plumbing', 'Electrical', 'Painting', 'Joinery'];

export default function NewJobPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  function validate(form: FormData) {
    const next: Record<string, string> = {};
    const title = (form.get('title') as string)?.trim();
    const description = (form.get('description') as string)?.trim();
    const email = (form.get('contactEmail') as string)?.trim();

    if (!title) next.title = 'Title is required';
    if (!description) next.description = 'Description is required';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.contactEmail = 'Enter a valid email address';
    }
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setApiError('');

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const job = await createJob({
        title: (form.get('title') as string).trim(),
        description: (form.get('description') as string).trim(),
        category: (form.get('category') as string) || undefined,
        location: (form.get('location') as string)?.trim() || undefined,
        contactName: (form.get('contactName') as string)?.trim() || undefined,
        contactEmail: (form.get('contactEmail') as string)?.trim() || undefined,
      });
      router.push(`/jobs/${job._id}`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Post a Service Request</h1>
        <p className="mt-1 text-slate-600">
          Describe what you need and tradespeople can pick it up.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Field label="Title *" error={errors.title}>
            <input name="title" className={inputClass} placeholder="e.g. Leaking kitchen tap" />
          </Field>

          <Field label="Description *" error={errors.description}>
            <textarea
              name="description"
              rows={4}
              className={inputClass}
              placeholder="Describe the issue in detail..."
            />
          </Field>

          <Field label="Category">
            <select name="category" className={inputClass} defaultValue="">
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Location">
            <input name="location" className={inputClass} placeholder="e.g. Glasgow" />
          </Field>

          <Field label="Contact name">
            <input name="contactName" className={inputClass} placeholder="Your name" />
          </Field>

          <Field label="Contact email" error={errors.contactEmail}>
            <input
              name="contactEmail"
              type="email"
              className={inputClass}
              placeholder="you@example.com"
            />
          </Field>

          {apiError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {apiError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Post Request'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </label>
  );
}
