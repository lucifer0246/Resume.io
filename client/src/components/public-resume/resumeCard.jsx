import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

export default function PublicResumeCard({ resume }) {
  if (!resume) return null;

  const { user, resume: activeResume } = resume;

  const handleClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Cloudinary first page preview
  //   const previewImageUrl = `${activeResume.url.replace(".pdf", ".jpg")}?page=1`;

  return (
    <Card className="w-full max-w-3xl bg-white h-full shadow-none p-8 rounded-none border-none pt-4 mt-1">
      <CardContent className="flex flex-col gap-6 rounded-none mt-4">
        {/* User Info */}
        <div className="text-center text-black">
          <p>Here’s the resume of</p>
          <h2 className="text-3xl font-bold">{user.username}</h2>
          <p className="text-black/80">{user.email}</p>
        </div>

        {/* Resume File Info */}
        <div className="bg-white/10 p-4 flex flex-col gap-1 rounded-none">
          <p className="text-lg font-semibold">{activeResume.originalName}</p>
          <p className="text-sm uppercase text-black/70">
            {activeResume.format}
          </p>
        </div>

        <div className="flex flex-col gap-4 border border-black/10 p-4 rounded-none">
          {/* Banner Preview via iframe */}
          <div className="w-full h-60 overflow-hidden">
            <iframe
              src={activeResume.url} // Cloudinary PDF URL
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
            className="flex-1 bg-white text-blue-600 hover:bg-white/90 font-semibold rounded-none border border-blue-600"
            onClick={handleClick(activeResume.url)}
          >
            <a href={activeResume.url} target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4 mr-2 inline" />
              View
            </a>
          </Button>
          <Button
            asChild
            className="flex-1 bg-white text-green-600 hover:bg-white/90 font-semibold rounded-none border border-green-600"
            onClick={handleClick(activeResume.url)}
          >
            <a href={activeResume.url} download>
              <Download className="w-4 h-4 mr-2 inline" />
              Download
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
