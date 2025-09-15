//eslint-disable-next-line
import { motion } from "framer-motion";
import { Users, FileText, Globe } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <FileText size={28} />,
      title: "Upload & Manage",
      desc: "Easily upload your resumes, set one as active, and keep your files organized.",
    },
    {
      icon: <Globe size={28} />,
      title: "Public Resume Links",
      desc: "Generate custom URLs for your resumes and share them with employers instantly.",
    },
    {
      icon: <Users size={28} />,
      title: "Dashboard Overview",
      desc: "Track your uploaded resumes, downloads, and active status in one place.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--dashboard-bg)] flex flex-col items-center justify-center p-6 space-y-12">
      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="bg-[var(--card-bg)] p-4 md:p-6 rounded-2xl shadow-lg flex flex-col items-center text-center space-y-2 md:space-y-4 transition-colors"
          >
            <div className="text-[var(--primary)]">{feature.icon}</div>
            <h3 className="text-lg md:text-xl font-semibold text-[var(--foreground)]">
              {feature.title}
            </h3>
            <p className="text-[var(--muted-foreground)] text-xs md:text-sm">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Mission / Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl text-center space-y-4 md:space-y-6"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)]">
          Our Mission
        </h2>
        <p className="text-[var(--muted-foreground)] text-sm md:text-lg">
          We aim to simplify how professionals share and manage their resumes.
          Our platform ensures privacy, easy access, and smooth experience for
          both job seekers and employers.
        </p>

        <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mt-4 md:mt-8">
          The Team
        </h2>
        <p className="text-[var(--muted-foreground)] text-sm md:text-lg">
          Built by a passionate team of developers who love clean, intuitive,
          and functional design. Tools that actually help people succeed.
        </p>
      </motion.div>
    </div>
  );
}
