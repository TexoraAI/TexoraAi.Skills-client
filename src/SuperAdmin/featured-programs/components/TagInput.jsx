import { useState } from "react";
import { X } from "lucide-react";

/**
 * Shared dynamic add/remove chip list.
 * value: string[]  onChange: (string[]) => void
 */
export default function TagInput({ value = [], onChange, placeholder, suggestions = [], colorClass = "bg-indigo-50 text-indigo-700 border-indigo-200" }) {
  const [text, setText] = useState("");

  const addTag = (raw) => {
    const t = raw.trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
    setText("");
  };

  const removeTag = (t) => onChange(value.filter((v) => v !== t));

  const remainingSuggestions = suggestions.filter((s) => !value.includes(s));

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(text);
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-2.5 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-300 bg-white transition-all"
        />
        <button
          type="button"
          onClick={() => addTag(text)}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((t) => (
            <span key={t} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
              {t}
              <button type="button" onClick={() => removeTag(t)} className="hover:opacity-60">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      {remainingSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {remainingSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="px-2 py-0.5 bg-white border border-gray-200 text-gray-500 rounded-full text-xs font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
