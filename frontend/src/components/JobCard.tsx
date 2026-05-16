import Link from 'next/link';
import type { JobRequest } from '@/types/job';
import { StatusBadge } from './StatusBadge';

export function JobCard({ job }: { job: JobRequest }) {
  return (
    <Link
      href={`/jobs/${job._id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
        <StatusBadge status={job.status} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{job.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        {job.category && (
          <span className="rounded-md bg-slate-100 px-2 py-1">{job.category}</span>
        )}
        {job.location && (
          <span className="rounded-md bg-slate-100 px-2 py-1">{job.location}</span>
        )}
        <span className="ml-auto">
          {new Date(job.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
    </Link>
  );
}
