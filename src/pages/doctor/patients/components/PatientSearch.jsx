import { useState } from "react";
import { Search } from "lucide-react";

export function PatientSearch({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md w-full">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, ID, or phone..."
          className="w-full bg-card border border-border text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block pl-10 p-2.5 outline-none transition-all"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl text-sm transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Search
      </button>
    </form>
  );
}
