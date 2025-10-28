import React, { useMemo } from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';

function formatTopLanguages(languageCounts) {
  const entries = Object.entries(languageCounts || {}).sort((a, b) => b[1] - a[1]);
  return entries.slice(0, 3).map(([lang, count]) => ({ lang, count }));
}

export default function OpenSourceInsights({ profile, repos, stats }) {
  const top3 = useMemo(() => formatTopLanguages(stats.languageCounts), [stats.languageCounts]);

  if (!profile) return null;

  const strengths = [];
  if (top3.length > 0) strengths.push(`${top3[0].lang}`);
  if (repos && repos.length > 8) strengths.push('project scale');
  if (stats.totalStars > 50) strengths.push('community reach');
  if ((profile.followers || 0) > 50) strengths.push('network influence');

  const recommendation = `You seem strongest in ${top3.map(t => t.lang).join(', ') || 'your core stack'}. Focus upcoming practice on ${top3[0]?.lang || 'your main language'}, and consider contributing to issues labeled "good first issue" to grow ${strengths.includes('community reach') ? 'your community presence' : 'steadily with impact'}.`;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h4 className="mb-3 text-sm font-semibold text-cyan-200">Open-source insights</h4>
      <div className="space-y-3 text-sm text-slate-200">
        <div className="flex items-start gap-2">
          <Lightbulb className="mt-0.5 h-4 w-4 text-yellow-300" />
          <p>
            Based on your public work, your top languages are
            {' '}<span className="font-medium text-white">{top3.map(t => t.lang).join(', ') || 'N/A'}</span>.
            You have <span className="font-medium text-white">{repos?.length || 0}</span> public repos and
            {' '}<span className="font-medium text-white">{stats.totalStars}</span> total stars across them.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <TrendingUp className="mt-0.5 h-4 w-4 text-emerald-300" />
          <p>{recommendation}</p>
        </div>
      </div>
    </div>
  );
}
