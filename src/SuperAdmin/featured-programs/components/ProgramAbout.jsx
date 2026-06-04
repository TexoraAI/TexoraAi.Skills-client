import { useRef, useState } from "react";

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({});

  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
    });
  };

  const handleInput = () => {
    onChange && onChange(editorRef.current?.innerHTML || "");
    updateActiveFormats();
  };

  const btnCls = (format) =>
    `px-2 py-1 rounded text-xs font-medium transition-colors ${activeFormats[format] ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <button type="button" onClick={() => execCmd("bold")} className={btnCls("bold")}><b>B</b></button>
        <button type="button" onClick={() => execCmd("italic")} className={btnCls("italic")}><i>I</i></button>
        <button type="button" onClick={() => execCmd("underline")} className={btnCls("underline")}><u>U</u></button>
        <div className="w-px h-4 bg-gray-300 mx-0.5" />
        <button type="button" onClick={() => execCmd("insertUnorderedList")} className={btnCls("insertUnorderedList")}>• List</button>
        <button type="button" onClick={() => execCmd("insertOrderedList")} className={btnCls("insertOrderedList")}>1. List</button>
        <div className="w-px h-4 bg-gray-300 mx-0.5" />
        <select onChange={(e) => execCmd("formatBlock", e.target.value)} className="text-xs px-1.5 py-0.5 border border-gray-200 rounded bg-white outline-none" defaultValue="">
          <option value="" disabled>Heading</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="p">Para</option>
        </select>
        <div className="w-px h-4 bg-gray-300 mx-0.5" />
        <button type="button" onClick={() => execCmd("removeFormat")} className="px-2 py-1 rounded text-xs text-gray-500 hover:bg-gray-100">Clear</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        dangerouslySetInnerHTML={{ __html: value || "" }}
        className="min-h-[160px] p-3 text-sm text-gray-800 outline-none"
        style={{ lineHeight: "1.7" }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default function ProgramAbout({ data, onChange }) {
  const set = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">About Program</h3>
        <p className="text-xs text-gray-500">Short description and full program details</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          Short Description <span className="text-gray-400 font-normal normal-case">(shown in cards)</span>
        </label>
        <textarea
          value={data.shortDescription || ""}
          onChange={(e) => set("shortDescription", e.target.value)}
          placeholder="A compelling 1-2 sentence summary of the program..."
          rows={3}
          maxLength={300}
          className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none hover:border-gray-300 transition-all"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{(data.shortDescription || "").length}/300</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          Full Description <span className="text-gray-400 font-normal normal-case">(landing page)</span>
        </label>
        <RichTextEditor
          value={data.aboutContent || ""}
          onChange={(val) => set("aboutContent", val)}
          placeholder="Write a detailed description of your program..."
        />
        <div className="mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 font-medium">💡 Tips: Explain who it's for, what makes it unique, and real-world outcomes.</p>
        </div>
      </div>
    </div>
  );
}