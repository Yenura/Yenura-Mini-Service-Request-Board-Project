import type { JobStatus } from '@/types/job';

const styles: Record<JobStatus, string> = {
  Open: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'In Progress': 'bg-amber-100 text-amber-800 border-amber-200',
  Closed: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
