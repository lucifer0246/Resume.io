import { Eye, CheckCircle, Trash2 } from "lucide-react";

export default function ResumeTiles({
  resume,
  onSetActive,
  onPreview,
  onDelete,
}) {
  if (!resume) return null;

  const fileExt = resume.originalName
    ? resume.originalName.split(".").pop().toUpperCase()
    : "N/A";

  return (
    <div
      className="rounded-lg p-4 shadow-sm border border-[var(--border)] 
                 bg-[var(--card)] text-[var(--card-foreground)] flex flex-col justify-between"
    >
      {/* Header: filename and extension */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold truncate">{resume.originalName}</h3>
        <span className="text-xs px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">
          {fileExt}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Preview button */}
        <button
          onClick={() => onPreview(resume)}
          className="flex items-center gap-1 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md px-2 py-1 text-xs hover:bg-[var(--primary)/90] transition-colors"
        >
          <Eye size={14} />
          <span>Preview</span>
        </button>

        {/* Set Active */}
        <button
          onClick={() => onSetActive(resume)}
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
            resume.isActive
              ? "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
              : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)/80]"
          }`}
        >
          <CheckCircle size={14} />
          <span>{resume.isActive ? "Active" : "Set Active"}</span>
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(resume)}
          className="flex items-center gap-1 bg-[var(--destructive)] text-[var(--card-foreground)] rounded-md px-2 py-1 text-xs hover:bg-[var(--destructive)/90] transition-colors"
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
