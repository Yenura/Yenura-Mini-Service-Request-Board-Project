import type { CreateJobPayload, JobRequest, JobStatus } from '@/types/job';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Request failed');
  }

  return data as T;
}

export async function getJobs(category?: string): Promise<JobRequest[]> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  const query = params.toString();
  return request<JobRequest[]>(`/api/jobs${query ? `?${query}` : ''}`);
}

export async function getJob(id: string): Promise<JobRequest> {
  return request<JobRequest>(`/api/jobs/${id}`);
}

export async function createJob(payload: CreateJobPayload): Promise<JobRequest> {
  return request<JobRequest>('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateJobStatus(id: string, status: JobStatus): Promise<JobRequest> {
  return request<JobRequest>(`/api/jobs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteJob(id: string): Promise<void> {
  await request(`/api/jobs/${id}`, { method: 'DELETE' });
}
