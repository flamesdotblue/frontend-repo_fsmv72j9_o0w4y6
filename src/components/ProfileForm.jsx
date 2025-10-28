import React, { useState } from 'react';
import { User, Search } from 'lucide-react';

export default function ProfileForm({ onSearch }) {
  const [username, setUsername] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const u = username.trim();
    if (u) onSearch(u);
  };

  return (
    <form onSubmit={submit} className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2 text-slate-300">
        <User className="h-5 w-5 text-cyan-300" />
      </div>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username (e.g., torvalds)"
        className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
        aria-label="GitHub username"
      />
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-500 focus:outline-none"
      >
        <Search className="h-4 w-4" />
        Fetch
      </button>
    </form>
  );
}
