import React from 'react';
import { Globe2, Star, GitBranch, Code } from 'lucide-react';

export default function ProfileSummary({ profile, stats, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">Loading profile…</div>
    );
  }
  if (!profile) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-400">No profile loaded yet.</div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-4">
        <img src={profile.avatar_url} alt={profile.login} className="h-16 w-16 rounded-full border border-white/10" />
        <div>
          <h3 className="text-lg font-semibold text-white">{profile.name || profile.login}</h3>
          <p className="text-sm text-slate-300 line-clamp-2">{profile.bio || 'Open-source enthusiast'}</p>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            {profile.blog && (
              <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-white">
                <Globe2 className="h-3.5 w-3.5" /> Website
              </a>
            )}
            <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-300" /> {stats.totalStars} stars</span>
            <span className="inline-flex items-center gap-1"><GitBranch className="h-3.5 w-3.5 text-cyan-300" /> {profile.public_repos} repos</span>
            {stats.topLanguage && (
              <span className="inline-flex items-center gap-1"><Code className="h-3.5 w-3.5 text-green-300" /> {stats.topLanguage}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
