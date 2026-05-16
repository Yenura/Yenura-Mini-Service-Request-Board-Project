'use client';

import { useCallback, useEffect, useState } from 'react';
import { JobCard } from '@/components/JobCard';
import { Header } from '@/components/Header';
import { getJobs } from '@/lib/api';
import type { JobRequest } from '@/types/job';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery'];

export default function HomePage() {
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getJobs(category === 'All' ? undefined : category);
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Open Service Requests</h1>
            <p className="mt-1 text-slate-600">
              Browse homeowner requests and update their status.
            </p>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">Filter by category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading && (
          <p className="text-center text-slate-500 py-12">Loading requests...</p>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
            <p className="mt-1 text-sm">Make sure the backend API is running on port 5000.</p>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-center text-slate-500 py-12">
            No job requests found.{' '}
            <a href="/jobs/new" className="text-blue-600 hover:underline">
              Post the first one
            </a>
            .
          </p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
