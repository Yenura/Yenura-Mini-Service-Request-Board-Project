'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { StatusBadge } from '@/components/StatusBadge';
import { deleteJob, getJob, updateJobStatus } from '@/lib/api';
import type { JobRequest, JobStatus } from '@/types/job';

const STATUSES: JobStatus[] = ['Open', 'In Progress', 'Closed'];

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadJob = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getJob(id);
      setJob(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  async function handleStatusChange(status: JobStatus) {
    if (!job) return;
    setUpdating(true);
    try {
      const updated = await updateJobStatus(job._id, status);
      setJob(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!job || !confirm('Delete this job request permanently?')) return;
    setDeleting(true);
    try {
      await deleteJob(job._id);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
      setDeleting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Back to all requests
        </Link>

        {loading && <p className="mt-8 text-slate-500">Loading...</p>}

        {error && !job && (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {job && (
          <article className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
              <StatusBadge status={job.status} />
            </div>

            <p className="mt-4 whitespace-pre-wrap text-slate-700">{job.description}</p>

            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              {job.category && (
                <Detail label="Category" value={job.category} />
              )}
              {job.location && (
                <Detail label="Location" value={job.location} />
              )}
              {job.contactName && (
                <Detail label="Contact" value={job.contactName} />
              )}
              {job.contactEmail && (
                <Detail label="Email" value={job.contactEmail} />
              )}
              <Detail
                label="Posted"
                value={new Date(job.createdAt).toLocaleString('en-GB')}
              />
            </dl>

            {error && (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            )}

            <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-slate-700">Update status</span>
                <select
                  value={job.status}
                  disabled={updating}
                  onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete Request'}
              </button>
            </div>
          </article>
        )}
      </main>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="text-slate-900">{value}</dd>
    </div>
  );
}
