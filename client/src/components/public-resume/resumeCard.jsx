import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

export default function PublicResumeCard({ resume }) {
  if (!resume) return null;

  const { user, resume: activeResume } = resume;

  const handleClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="w-full max-w-3xl bg-white/5 text-[var(--card-foreground)] h-full shadow-md p-6 rounded-2xl border-none">
      <CardContent className="flex flex-col gap-6">
        {/* User Info */}
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Here’s the resume of</p>
          <h2 className="text-3xl font-bold">{user.username}</h2>
          <p className="text-[var(--muted-foreground)]">{user.email}</p>
        </div>

        {/* Resume File Info */}
        <div className="bg-white/5 p-4 flex flex-col gap-1 rounded-lg">
          <p className="text-lg font-semibold">{activeResume.originalName}</p>
          <p className="text-sm uppercase text-[var(--muted-foreground)]">
            {activeResume.format || "PDF"}
          </p>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-4 border border-[var(--border)] p-4 rounded-lg">
          <div className="w-full h-60 overflow-hidden">
            <iframe
              src={activeResume.url}
              title="Resume Preview"
              className="w-full h-full"
              style={{ border: "none" }}
            ></iframe>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            className="flex-1 bg-white text-blue-600 hover:bg-[var(--card-foreground)/90] font-semibold rounded-lg border border-blue-600"
            onClick={() => handleClick(activeResume.url)}
          >
            <a target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4 mr-2 inline" />
              View
            </a>
          </Button>

          <Button
            asChild
            className="flex-1 bg-white text-green-600 hover:bg-[var(--card-foreground)/90] font-semibold rounded-lg border border-green-600"
            onClick={() => handleClick(activeResume.url)}
          >
            <a download>
              <Download className="w-4 h-4 mr-2 inline" />
              Download
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
