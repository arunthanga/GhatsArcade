"use client";

import { useEffect, useRef } from "react";

// Lightweight in-app rich-text editor for admin-authored project/event descriptions.
// It emits HTML via onChange; that HTML is sanitised server-side with sanitize-html
// (src/lib/sanitize.ts) on write, so the stored/rendered markup has no XSS surface. The
// toolbar only produces tags inside the sanitiser's allow-list.

type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

const TOOLBAR: { command: string; label: string; title: string }[] = [
  { command: "bold", label: "B", title: "Bold" },
  { command: "italic", label: "I", title: "Italic" },
  { command: "formatBlock:h2", label: "H2", title: "Heading" },
  { command: "insertUnorderedList", label: "• List", title: "Bulleted list" },
  { command: "createLink", label: "Link", title: "Insert link" },
];

export function RichTextEditor({ label, value, onChange, required }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Seed the editable region once on mount. Afterwards the DOM is the source of truth, so we
  // never rewrite innerHTML on re-render (that would reset the caret on every keystroke).
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-time seed
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value ?? "";
    }
  }, []);

  function emit() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  function run(command: string) {
    if (command.startsWith("formatBlock:")) {
      document.execCommand("formatBlock", false, command.split(":")[1]);
    } else if (command === "createLink") {
      const url = window.prompt("Link URL (https://…)");
      if (url) {
        document.execCommand("createLink", false, url);
      }
    } else {
      document.execCommand(command, false);
    }
    editorRef.current?.focus();
    emit();
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-300">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="overflow-hidden rounded-lg border border-slate-600 bg-white">
        <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-100 p-1.5">
          {TOOLBAR.map((item) => (
            <button
              key={item.command}
              type="button"
              title={item.title}
              onClick={() => run(item.command)}
              className="rounded px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* biome-ignore lint/a11y/useSemanticElements: a rich-text region needs contentEditable, which <textarea> can't provide */}
        <div
          ref={editorRef}
          role="textbox"
          aria-label={label}
          aria-multiline="true"
          tabIndex={0}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          className="min-h-[10rem] px-3 py-2 text-sm leading-relaxed text-slate-900 focus:outline-none"
        />
      </div>
    </div>
  );
}
