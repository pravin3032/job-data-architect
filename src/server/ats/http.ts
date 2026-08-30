const allowedHosts = new Set(['boards-api.greenhouse.io','api.lever.co','api.ashbyhq.com']);
export async function atsFetch(url: string, init?: RequestInit) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || !allowedHosts.has(parsed.hostname)) throw new Error(`ATS host not allowed: ${parsed.hostname}`);
  const response = await fetch(parsed, { ...init, headers: { 'user-agent':'JobSearchAutomation/1.0 (+public-job-ingestion)', accept:'application/json', ...init?.headers }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${parsed.hostname} returned ${response.status}`);
  return response;
}
