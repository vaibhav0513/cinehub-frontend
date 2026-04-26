import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  Movies: ["/movies", "/events", "/plays", "/sports"],
  Help: ["/faq", "/support", "/terms", "/privacy"],
  Company: ["/about", "/careers", "/press", "/contact"],
};

const SOCIAL = [
  { icon: "𝕏", href: "#", label: "Twitter" },
  { icon: "in", href: "#", label: "LinkedIn" },
  { icon: "f", href: "#", label: "Facebook" },
];

export function Footer() {
  return (
    <footer
      className="mt-20 border-t"
      style={{
        background: "linear-gradient(180deg, #080810 0%, #050508 100%)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
                style={{ background: "#E8172B" }}
              >
                C
              </div>
              <span className="font-bold text-white">CineHub</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              India's largest entertainment ticketing platform.
            </p>
            <div className="flex gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold
      text-gray-400 hover:text-white transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((href) => (
                  <li key={href}>
                    <Link
                      to={href}
                      className="text-sm text-gray-500 hover:text-gray-200 transition-colors capitalize"
                    >
                      {href.replace("/", "").replace("-", " ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-14 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} CineHub. Built with React + Vite
            + Prisma.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-600">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
