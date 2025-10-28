import React, { useCallback, useMemo, useState } from 'react';
import ProfileForm from './ProfileForm';
import ProfileSummary from './ProfileSummary';
import OpenSourceInsights from './OpenSourceInsights';

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function aggregateStats(repos) {
  const languageCounts = {};
  let totalStars = 0;
  for (const r of repos || []) {
    totalStars += r.stargazers_count || 0;
    const lang = r.language;
    if (lang) languageCounts[lang] = (languageCounts[lang] || 0) + 1;
  }
  const topLanguage = Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  return { languageCounts, totalStars, topLanguage };
}

export default function ProfileSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);

  const stats = useMemo(() => aggregateStats(repos), [repos]);

  const handleSearch = useCallback(async (username) => {
    try {
      setError('');
      setLoading(true);
      setProfile(null);
      setRepos([]);
      const [p, r] = await Promise.all([
        fetchJSON(`https://api.github.com/users/${encodeURIComponent(username)}`),
        fetchJSON(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`),
      ]);
      setProfile(p);
      setRepos(r);
    } catch (e) {
      setError('Could not load data. Please check the username or try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">Your Profile (from open sources)</h2>
        <p className="text-sm text-slate-300">Connect your public footprint to personalize guidance. We use public APIs like GitHub to summarize your strengths.</p>
      </div>

      <ProfileForm onSearch={handleSearch} />

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <ProfileSummary profile={profile} stats={stats} loading={loading} />
        </div>
        <div className="md:col-span-2">
          <OpenSourceInsights profile={profile} repos={repos} stats={stats} />
        </div>
      </div>
    </section>
  );
}
