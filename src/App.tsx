import React, { useEffect, useState, useRef } from "react";
import { Project, Note } from "./data";
import { MapPin, Building, Link2, ExternalLink, Mail, Github, Linkedin, GraduationCap, FileText } from "lucide-react";

// Type definitions for window object CDNs
declare global {
  interface Window {
    marked?: {
      parse: (markdown: string) => string;
      setOptions: (options: { gfm: boolean; breaks: boolean }) => void;
    };
    hljs?: {
      highlightElement: (element: Element) => void;
    };
    renderMathInElement?: (
      element: HTMLElement,
      options: {
        delimiters: { left: string; right: string; display: boolean }[];
        throwOnError: boolean;
      }
    ) => void;
  }
}

// Utility to resolve asset paths correctly between Dev (Vite) and Prod (Static server / GitHub Pages)
const getAssetUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.replace(/^\//, "");
  const isDev = (import.meta as any).env?.DEV;
  return isDev ? `/${cleanPath}` : `./public/${cleanPath}`;
};

// Reusable custom avatar component with styled fallback
function ProfileAvatar({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className="avatar-image flex items-center justify-center font-serif text-6xl font-bold select-none"
        style={{
          background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 100%)",
          color: "var(--bg)",
          width: "100%",
          height: "100%",
        }}
      >
        Y
      </div>
    );
  }

  return (
    <img
      className="avatar-image"
      src={getAssetUrl(src)}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}

// Component to render and highlight academic authors
function HighlightedAuthors({
  authors,
  highlightName,
}: {
  authors: string;
  highlightName: string;
}) {
  if (!authors || !highlightName || !authors.includes(highlightName)) {
    return <span className="item-authors">{authors}</span>;
  }

  const parts = authors.split(highlightName);
  return (
    <p className="item-authors">
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && <strong>{highlightName}</strong>}
        </span>
      ))}
    </p>
  );
}

const handleSectionJump = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
  e.preventDefault();
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

function Sidebar({ profile }: { profile: any }) {
  if (!profile) return null;
  return (
    <aside className="sidebar sidebar-home-box">
      <div className="identity-block">
        <div className="w-full flex justify-center">
          <div className="avatar-wrap">
            <ProfileAvatar
              src={profile.photo}
              alt={`${profile.name}'s Profile Photo`}
            />
          </div>
        </div>
        <p className="eyebrow" id="profile-role">
          {profile.role}
        </p>
        <h1 id="profile-name" className="text-xl font-sans font-bold tracking-tight text-[var(--ink)] mt-1">
          {profile.name}
        </h1>
        <p className="text-xs leading-relaxed text-[var(--muted)] mt-2" id="profile-tagline">
          {profile.tagline}
        </p>
      </div>

      <div className="sidebar-details flex flex-col gap-3 mt-4 pt-4 border-t border-[color-mix(in_srgb,var(--line)_50%,transparent)]">
        <div className="flex items-start gap-2.5 text-xs text-[var(--muted)]" id="profile-affiliation-box">
          <Building className="w-3.5 h-3.5 text-[var(--subtitle)] mt-0.5 flex-shrink-0" />
          <span id="profile-affiliation" className="leading-normal">{profile.affiliation}</span>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-[var(--muted)]" id="profile-location-box">
          <MapPin className="w-3.5 h-3.5 text-[var(--subtitle)] mt-0.5 flex-shrink-0" />
          <span id="profile-location" className="leading-normal">{profile.location}</span>
        </div>
      </div>

      <div className="sidebar-links flex flex-col gap-2 mt-3 pt-3 border-t border-[color-mix(in_srgb,var(--line)_50%,transparent)]" id="profile-links">
        {profile.links?.map((link: any) => {
          const lowercaseLabel = link.label.toLowerCase();
          let IconComponent = Link2;
          if (lowercaseLabel.includes("email") || lowercaseLabel.includes("mail")) IconComponent = Mail;
          else if (lowercaseLabel.includes("github")) IconComponent = Github;
          else if (lowercaseLabel.includes("linkedin")) IconComponent = Linkedin;
          else if (lowercaseLabel.includes("scholar")) IconComponent = GraduationCap;
          else if (lowercaseLabel.includes("cv")) IconComponent = FileText;

          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 text-xs text-[var(--muted)] hover:text-[var(--accent-strong)] transition-colors duration-150 py-0.5"
            >
              <IconComponent className="w-3.5 h-3.5 text-[var(--subtitle)] flex-shrink-0" />
              <span className="font-medium">{link.label}</span>
            </a>
          );
        })}
      </div>
    </aside>
  );
}

// Dynamic Markdown, LaTeX, and Code syntax renderer
function AcademicArticleRenderer({
  markdown,
  onHeadingsExtracted,
}: {
  markdown: string;
  onHeadingsExtracted?: (headings: { id: string; title: string; level: number }[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderedHtml = "";
    try {
      if (window.marked) {
        if (typeof window.marked.parse === "function") {
          try {
            window.marked.setOptions({ gfm: true, breaks: false });
          } catch (e) {}
          renderedHtml = window.marked.parse(markdown);
        } else if (typeof window.marked === "function") {
          renderedHtml = (window.marked as any)(markdown);
        }
      }
    } catch (err) {
      console.error("Error parsing markdown with marked library:", err);
    }

    if (!renderedHtml) {
      // Fallback simple line conversion if CDN isn't fully ready
      renderedHtml = markdown
        .split("\n\n")
        .map((p) => {
          const trimmed = p.trim();
          if (trimmed.startsWith("###")) {
            return `<h3 class="text-lg font-bold mt-4">${trimmed.replace("###", "").trim()}</h3>`;
          }
          if (trimmed.startsWith("##")) {
            return `<h2 class="text-xl font-bold mt-6 border-b pb-1">${trimmed.replace("##", "").trim()}</h2>`;
          }
          if (trimmed.startsWith("#")) {
            return `<h1 class="text-2xl font-bold mt-8">${trimmed.replace("#", "").trim()}</h1>`;
          }
          return `<p>${trimmed}</p>`;
        })
        .join("");
    }

    containerRef.current.innerHTML = renderedHtml;

    // Dynamically assign IDs to headings so that sidebar jumps work correctly
    const headings = containerRef.current.querySelectorAll("h1, h2");
    const headingList: { id: string; title: string; level: number }[] = [];
    const idCounts = new Map<string, number>();

    headings.forEach((heading) => {
      try {
        const title = heading.textContent || "";
        const baseId = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");

        let finalId = baseId || "section";
        const count = idCounts.get(finalId) || 0;
        if (count > 0) {
          finalId = `${finalId}-${count}`;
        }
        idCounts.set(baseId || "section", count + 1);

        heading.id = finalId;

        const level = heading.tagName.toLowerCase() === "h1" ? 1 : 2; // Treat h1 as level 1, h2 as level 2
        headingList.push({ id: finalId, title, level });
      } catch (err) {
        console.error("Error setting heading ID:", err);
      }
    });

    if (onHeadingsExtracted) {
      onHeadingsExtracted(headingList);
    }

    // Trigger Code highlighting using highlight.js
    const hljsGlobal = window.hljs as any;
    if (hljsGlobal) {
      containerRef.current.querySelectorAll("pre code").forEach((block) => {
        try {
          if (typeof hljsGlobal.highlightElement === "function") {
            hljsGlobal.highlightElement(block);
          } else if (typeof hljsGlobal.highlightBlock === "function") {
            hljsGlobal.highlightBlock(block);
          }
        } catch (err) {
          console.error("Error highlighting block:", err);
        }
      });
    }

    // Trigger KaTeX math equation rendering
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(containerRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
          throwOnError: false,
        });
      } catch (err) {
        console.error("Error rendering math in element:", err);
      }
    }
  }, [markdown, onHeadingsExtracted]);

  return <div ref={containerRef} className="note-article-body" />;
}

export default function App() {
  // Global Data States loaded from data.json at runtime
  const [siteData, setSiteData] = useState<any>(null);
  const [cvData, setCvData] = useState<any>(null);
  const [researchData, setResearchData] = useState<any>(null);
  const [blogData, setBlogData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Markdown States
  const [activeMarkdownContent, setActiveMarkdownContent] = useState<string>("");
  const [loadingMarkdown, setLoadingMarkdown] = useState<boolean>(false);

  // Parsing hash-based routing
  const [hash, setHash] = useState(window.location.hash || "#home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme-preference") || "dark";
  });
  const [colorCombo, setColorCombo] = useState(() => {
    return localStorage.getItem("color-combo-preference") || "crimson";
  });
  const [activeProjectTag, setActiveProjectTag] = useState<string | null>(null);
  const [blogSearchQuery, setBlogSearchQuery] = useState("");

  // Track dynamic headings outline for project and note detail views
  const [detailOutline, setDetailOutline] = useState<{ id: string; title: string; level: number }[]>([]);

  // 1. Fetch data.json once on mount
  useEffect(() => {
    const dataUrl = getAssetUrl("data.json");
    fetch(dataUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch site config/data");
        return res.json();
      })
      .then((data) => {
        setSiteData(data.siteData);
        setCvData(data.cvData);
        setResearchData(data.researchData);
        setBlogData(data.blogData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading portfolio database (data.json)", err);
        setError(err.message || "Failed to load database.json");
        setLoading(false);
      });
  }, []);

  // Synchronize state with address hashchanges
  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || "#home");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMobileMenuOpen(false);
      setDetailOutline([]);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Sync theme choices to document attributes
  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme-preference", theme);
  }, [theme]);

  // Sync color combo choices to document attributes
  useEffect(() => {
    document.body.dataset.colorCombo = colorCombo;
    localStorage.setItem("color-combo-preference", colorCombo);
  }, [colorCombo]);

  // Route extraction
  const isHome = hash === "#home" || hash === "" || hash === "#";
  const isBio = hash === "#bio";
  const isBlog = hash === "#blog";
  const isProjectDetail = hash.startsWith("#project/");
  const isNoteDetail = hash.startsWith("#note/");

  // Resolve active tab highlighting
  let activeTab = "home";
  if (isBio) activeTab = "bio";
  if (isBlog || isNoteDetail) activeTab = "blog";
  if (isProjectDetail) activeTab = "home";

  // Resolve slug for detail views
  const projectSlug = isProjectDetail ? hash.replace("#project/", "") : "";
  const noteSlug = isNoteDetail ? hash.replace("#note/", "") : "";

  // Find respective objects from the dynamically loaded state
  const currentProject = (researchData && projectSlug)
    ? researchData.projects?.find((p: any) => p.slug === projectSlug)
    : null;
  const currentNote = (blogData && noteSlug)
    ? blogData.notes?.find((n: any) => n.slug === noteSlug)
    : null;

  // 2. Fetch markdown content on hash route change
  useEffect(() => {
    if (isProjectDetail && projectSlug) {
      setActiveMarkdownContent("");
      setLoadingMarkdown(true);
      const mdUrl = getAssetUrl(`content/projects/${projectSlug}/content.md`);
      fetch(mdUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Could not find project markdown file");
          return res.text();
        })
        .then((text) => {
          setActiveMarkdownContent(text);
          setLoadingMarkdown(false);
        })
        .catch((err) => {
          console.warn(err);
          // Fallback to sections if markdown not available
          setActiveMarkdownContent("");
          setLoadingMarkdown(false);
        });
    } else if (isNoteDetail && noteSlug) {
      setActiveMarkdownContent("");
      if (currentNote && currentNote.isPdf) {
        setLoadingMarkdown(false);
        return;
      }
      setLoadingMarkdown(true);
      const mdUrl = getAssetUrl(`content/blogs/${noteSlug}/content.md`);
      fetch(mdUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Could not find blog markdown file");
          return res.text();
        })
        .then((text) => {
          setActiveMarkdownContent(text);
          setLoadingMarkdown(false);
        })
        .catch((err) => {
          console.error(err);
          setActiveMarkdownContent("### Error\nFailed to load article markdown file at `public/content/blogs/" + noteSlug + "/content.md`.");
          setLoadingMarkdown(false);
        });
    } else {
      setActiveMarkdownContent("");
      setLoadingMarkdown(false);
    }
  }, [hash, projectSlug, noteSlug, blogData, currentNote]);

  // Loading Screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121214] text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[var(--accent-strong)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono tracking-wider text-neutral-400 uppercase">Loading Yashwanth's Portfolio...</p>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error || !siteData || !cvData || !researchData || !blogData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121214] text-white font-sans p-6">
        <div className="max-w-md p-6 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl text-center">
          <h2 className="text-lg font-bold text-red-500 mb-2">Failed to Load Content</h2>
          <p className="text-xs font-mono text-neutral-400 mb-4">{error || "Missing portfolio configuration files."}</p>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Please verify that <code className="bg-neutral-800 px-1 py-0.5 rounded text-red-400">public/data.json</code> exists and contains valid JSON schema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="site-frame" id="main-frame">
      {/* Top Header Navbar */}
      <header className={`topbar ${mobileMenuOpen ? "menu-open" : ""}`} id="header-topbar">
        <a
          className="brandmark"
          id="brand-link"
          href="#home"
          onClick={() => {
            window.location.hash = "#home";
          }}
        >
          {siteData.profile.name}
        </a>

        {/* Mobile Hamburger Menu button */}
        <button
          className="menu-toggle"
          id="menu-toggle"
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="top-nav"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation panel */}
        <nav className="topnav" id="top-nav">
          {siteData.navigation?.map((item: any) => (
            <a
              key={item.page}
              href={item.href}
              className={activeTab === item.page ? "is-active" : ""}
            >
              {item.label}
            </a>
          ))}

          {/* Theme Color Combination Dropdown */}
          <div className="relative inline-flex items-center mx-1">
            <select
              value={colorCombo}
              onChange={(e) => setColorCombo(e.target.value)}
              className="color-combo-select font-mono text-[10px] bg-transparent text-[var(--ink)] border border-[var(--line)] rounded px-1.5 py-0.5 outline-none cursor-pointer hover:border-[var(--accent-strong)] transition-colors focus:border-[var(--accent-strong)]"
              title="Select theme accent color combination"
              aria-label="Select theme accent color combination"
            >
              <option value="crimson">★ Crimson/Slate (Default)</option>
              <option value="indigo">★ Indigo/Navy</option>
              <option value="amber">★ Amber/Charcoal</option>
              <option value="teal">★ Teal/Emerald</option>
              <option value="violet">★ Violet/Lavender</option>
              <option value="rose">★ Rosewood/Blush</option>
              <option value="emerald">★ Emerald/Forest</option>
              <option value="mono">★ Minimal/Ink</option>
            </select>
          </div>

          {/* Theme switcher toggle button */}
          <button
            className={`theme-toggle ${theme === "dark" ? "is-active" : ""}`}
            id="theme-toggle"
            type="button"
            title="Toggle theme"
            aria-label="Toggle color theme"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "dark" ? "☼" : "◑"}
          </button>
        </nav>
      </header>

      {/* RENDER PAGES BASED ON STATE ROUTE */}

      {/* 1. HOME TAB */}
      {isHome && (
        <div className="page-shell animate-fade-in" id="home-view">
          <Sidebar profile={siteData.profile} />

          {/* Home Content Section containing Projects & Publications */}
          <main className="content flex flex-col gap-12">
            {/* Focus Areas section */}
            <section className="blog-tile-section pb-2" id="home-focus-section">
              <div className="section-heading mb-4 flex items-center justify-between">
                <h2 className="section-kicker">Research Focus</h2>
                {activeProjectTag && (
                  <button
                    onClick={() => setActiveProjectTag(null)}
                    className="text-[10px] uppercase tracking-wider text-[var(--accent-strong)] hover:underline font-semibold cursor-pointer"
                  >
                    Clear Filter ✕
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Optimal Control",
                  "Nonlinear Dynamics",
                  "Data-driven Learning",
                  "Robotics",
                  "Koopman Operator Theory",
                  "Flight Dynamics"
                ].map((tag) => {
                  const isSelected = activeProjectTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setActiveProjectTag(isSelected ? null : tag)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-2 border ${
                        isSelected
                          ? "bg-[var(--accent-strong)] text-white border-[var(--accent-strong)] shadow-sm font-semibold"
                          : "bg-[var(--sidebar-box-bg)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--accent-strong)]"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white animate-pulse" : "bg-[var(--accent)]"}`} />
                      {tag}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Projects list */}
            <section className="blog-tile-section" id="research-projects-section">
              <div className="section-heading mb-6">
                <h2 className="section-kicker">Research Projects</h2>
              </div>

              <div id="project-grid">
                <div className="project-grid">
                  {researchData.projects
                    ?.filter((project: any) => !activeProjectTag || project.tags?.includes(activeProjectTag))
                    .sort((a: any, b: any) => {
                      const yearA = parseInt(a.year || "2023");
                      const yearB = parseInt(b.year || "2023");
                      return yearB - yearA;
                    })
                    .map((project: any) => (
                    <article className="project-tile flex flex-col relative" key={project.slug}>
                      {project.year && (
                        <div className="absolute top-3 right-3 bg-neutral-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-10 uppercase">
                          {project.year}
                        </div>
                      )}
                      {project.tileMedia && (
                        <a
                          href={`#project/${project.slug}`}
                          className="project-tile-media-link"
                        >
                          {project.tileIsVideo || project.tileMedia.endsWith(".mp4") || project.tileMedia.endsWith(".webm") || project.tileVideo ? (
                            <video
                              className="project-tile-media"
                              src={getAssetUrl(project.tileVideo || project.tileMedia)}
                              muted
                              loop
                              playsInline
                              autoPlay
                              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <img
                              loading="lazy"
                              className="project-tile-media"
                              src={getAssetUrl(project.tileMedia)}
                              alt={`${project.title} preview`}
                            />
                          )}
                        </a>
                      )}
                      <div className="project-tile-head flex flex-col flex-1 mt-2">
                        <div>
                          <a
                            href={`#project/${project.slug}`}
                            className="project-title-link"
                          >
                            <h3 className="line-clamp-2 text-sm">{project.title}</h3>
                          </a>
                          <p className="tile-meta mt-1 line-clamp-2">{project.meta}</p>
                        </div>
                        <div className="mt-auto pt-3">
                          <a
                            className="action-link inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-strong)]"
                            href={`#project/${project.slug}`}
                          >
                            View Details →
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Academic Publications */}
            <section
              className="blog-tile-section mt-4"
              id="research-publications-tile-section"
            >
              <div className="section-heading mb-6">
                <h2 className="section-kicker">Publications</h2>
              </div>

              <div id="research-publications-tile">
                <div className="project-groups">
                  {(["Journal", "Conference", "Patent"] as const).map((cat) => {
                    const groupItems = researchData.publications?.filter(
                      (pub: any) => pub.category === cat
                    );
                    if (!groupItems || groupItems.length === 0) return null;

                    return (
                      <div className="project-group" key={cat}>
                        <div className="project-group-heading">
                          <p>{cat}s</p>
                          <div className="project-group-divider" />
                        </div>

                        <div className="publication-list">
                          {groupItems.map((pub: any, idx: number) => (
                            <article className="publication-item" key={pub.id}>
                              <span className="publication-index">{idx + 1}.</span>
                              <div className="publication-content">
                                <h3>{pub.title}</h3>
                                <HighlightedAuthors
                                  authors={pub.authors}
                                  highlightName={siteData.profile.highlightAuthorName}
                                />
                                <p className="item-meta">{pub.meta}</p>
                                {pub.actions && pub.actions.length > 0 && (
                                  <div className="action-group mt-1">
                                    {pub.actions.map((act: any) => (
                                      <a
                                        key={act.title}
                                        className="action-link"
                                        href={act.href}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {act.title}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>
        </div>
      )}

      {/* 2. BIO TAB */}
      {isBio && (
        <div className="page-shell animate-fade-in" id="bio-view">
          <aside className="section-jump-card sticky top-24 self-start">
            <p className="section-label">Jump To</p>
            <nav className="section-jump-nav" aria-label="Bio sections">
              <a href="#bio-experience-section" onClick={(e) => handleSectionJump(e, "bio-experience-section")}>Experience</a>
              <a href="#bio-education-section" onClick={(e) => handleSectionJump(e, "bio-education-section")}>Education</a>
              <a href="#bio-updates-section" onClick={(e) => handleSectionJump(e, "bio-updates-section")}>Updates</a>
            </nav>
          </aside>

          {/* Bio Content Section */}
          <main className="content">
            {/* Experience Section */}
            <section className="section" id="bio-experience-section">
              <div className="section-heading">
                <h2 className="section-kicker">Experience</h2>
              </div>
              <div className="relative border-l border-[var(--line)] ml-2 pl-6 space-y-8 py-2">
                {cvData.experience?.map((exp: any, idx: number) => (
                  <article className="relative" key={idx}>
                    {/* Timeline dot */}
                    <span className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-strong)]"></span>
                    </span>

                    <span className="font-mono text-xs text-[var(--subtitle)] uppercase tracking-wider block mb-1">
                      {exp.duration}
                    </span>
                    <h3 className="text-sm font-semibold text-[var(--ink)] m-0">
                      {exp.role}
                    </h3>
                    <p className="font-mono text-xs text-[var(--muted)] m-0 mt-0.5 font-semibold">
                      {exp.organization}
                    </p>
                    <p className="text-sm text-[var(--muted)] m-0 mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Education Section */}
            <section className="section" id="bio-education-section">
              <div className="section-heading">
                <h2 className="section-kicker">Education</h2>
              </div>
              <div className="relative border-l border-[var(--line)] ml-2 pl-6 space-y-8 py-2">
                {cvData.education?.map((edu: any, idx: number) => (
                  <article className="relative" key={idx}>
                    {/* Timeline dot */}
                    <span className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-strong)]"></span>
                    </span>

                    <span className="font-mono text-xs text-[var(--subtitle)] uppercase tracking-wider block mb-1">
                      {edu.duration}
                    </span>
                    <h3 className="text-sm font-semibold text-[var(--ink)] m-0">
                      {edu.degree}
                    </h3>
                    <p className="font-mono text-xs text-[var(--muted)] m-0 mt-0.5 font-semibold">
                      {edu.institution}
                    </p>
                    {edu.advisor && (
                      <p className="text-xs text-[var(--ink)] font-semibold m-0 mt-1.5">
                        Advisor: <span className="text-[var(--muted)] font-normal">{edu.advisor}</span>
                      </p>
                    )}
                    <p className="text-sm text-[var(--muted)] m-0 mt-2 leading-relaxed">
                      {edu.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Timeline Updates */}
            <section className="section home-updates-section" id="bio-updates-section">
              <div className="section-heading">
                <h2 className="section-kicker">Updates</h2>
              </div>
              <div className="relative border-l border-[var(--line)] ml-2 pl-6 space-y-8 py-2" id="home-updates">
                {[...cvData.updates]
                  ?.filter((u: any) => u.showOnHome)
                  .sort((a: any, b: any) => {
                    const parseDateStr = (dStr: string) => {
                      const [month, year] = dStr.split(" ");
                      const months = [
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                      ];
                      const mIdx = months.indexOf(month);
                      return new Date(parseInt(year), mIdx >= 0 ? mIdx : 0).getTime();
                    };
                    return parseDateStr(b.date) - parseDateStr(a.date);
                  })
                  .map((item: any, idx: number) => (
                    <article className="relative" key={idx}>
                      {/* Timeline dot */}
                      <span className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-strong)]"></span>
                      </span>

                      <span className="font-mono text-xs text-[var(--subtitle)] uppercase tracking-wider block mb-1">
                        {item.date}
                      </span>
                      <h3 className="text-sm font-semibold text-[var(--ink)] m-0">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--muted)] m-0 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                      {item.actions && item.actions.length > 0 && (
                        <div className="action-group mt-2">
                          {item.actions.map((act: any) => (
                            <a
                              key={act.title}
                              className="action-link text-xs"
                              href={act.href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {act.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
              </div>
            </section>
          </main>
        </div>
      )}

      {/* 3. BLOG TAB */}
      {isBlog && (
        <div className="blog-stream-layout animate-fade-in" id="blog-view">
          <main className="max-w-7xl mx-auto w-full px-4 sm:px-6">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search blogs..."
                value={blogSearchQuery}
                onChange={(e) => setBlogSearchQuery(e.target.value)}
                className="w-full sm:max-w-md px-4 py-2 text-sm border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] placeholder-[var(--muted)] rounded-none shadow-sm focus:outline-none focus:border-[var(--accent-strong)]"
              />
            </div>
            <section className="blog-tile-section">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" id="blog-notes-list">
                {blogData.notes
                  ?.filter((note: any) => note.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) || note.description.toLowerCase().includes(blogSearchQuery.toLowerCase()))
                  .sort((a: any, b: any) => {
                    const parseDateStr = (note: any) => {
                      if (note.year) {
                         return parseInt(note.year);
                      }
                      const datePart = note.meta.split(" • ")[0]; // e.g. "May 2025"
                      const parts = datePart.split(" ");
                      if (parts.length === 2) {
                        return parseInt(parts[1]);
                      }
                      return 2024;
                    };
                    return parseDateStr(b) - parseDateStr(a);
                  })
                  .map((note: any) => (
                    <article className="project-tile flex flex-col relative" key={note.slug}>
                      {note.year && (
                        <div className="absolute top-3 right-3 bg-neutral-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-10 uppercase">
                          {note.year}
                        </div>
                      )}
                      {note.tileMedia && (
                        <a
                          href={note.isPdf ? getAssetUrl(note.pdfUrl) : `#note/${note.slug}`}
                          target={note.isPdf ? "_blank" : undefined}
                          rel={note.isPdf ? "noopener noreferrer" : undefined}
                          className="project-tile-media-link"
                        >
                          <img
                            loading="lazy"
                            className="project-tile-media"
                            src={getAssetUrl(note.tileMedia)}
                            alt={`${note.title} preview`}
                          />
                        </a>
                      )}
                      <div className="project-tile-head flex flex-col flex-1 mt-2">
                        <div>
                          <a
                            href={note.isPdf ? getAssetUrl(note.pdfUrl) : `#note/${note.slug}`}
                            target={note.isPdf ? "_blank" : undefined}
                            rel={note.isPdf ? "noopener noreferrer" : undefined}
                            className="project-title-link"
                          >
                            <h3 className="line-clamp-3 text-sm">
                              {note.title}
                              {note.isPdf && (
                                <span className="inline-block ml-1 font-mono text-[9px] uppercase tracking-wider bg-[var(--accent-soft)] text-[var(--accent-strong)] px-1 py-0.5 rounded border border-[var(--line)]">
                                  PDF
                                </span>
                              )}
                            </h3>
                          </a>
                        </div>
                        <div className="mt-auto pt-3">
                          <a
                            className="action-link inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-strong)]"
                            href={note.isPdf ? getAssetUrl(note.pdfUrl) : `#note/${note.slug}`}
                            target={note.isPdf ? "_blank" : undefined}
                            rel={note.isPdf ? "noopener noreferrer" : undefined}
                          >
                            {note.isPdf ? "Open PDF →" : "Read Article →"}
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          </main>
        </div>
      )}

      {/* 4. PROJECT DETAIL VIEW */}
      {isProjectDetail && currentProject && (
        <div className="note-layout animate-fade-in" id="project-detail-view">
          {/* Jump Section / Outline Sidebar */}
          <aside className="section-jump-card note-jump-card">
            <p className="section-label">Contents</p>
            <nav className="section-jump-nav note-jump-nav" aria-label="Project details outline">
              {detailOutline.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={item.level === 2 ? "is-h2" : ""}
                  onClick={(e) => handleSectionJump(e, item.id)}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Primary Detail Page Shell */}
          <main className="page-panel page-panel-wide note-detail-panel">
            <button
              className="back-link"
              onClick={() => {
                window.location.hash = "#home";
              }}
              aria-label="Back to Home"
              title="Back to Home"
            >
              ←
            </button>

            <article className="note-article">
              <header className="note-article-header">
                <p className="section-kicker">{currentProject.meta || currentProject.status}</p>
                <h1>{currentProject.title}</h1>
                <p className="page-intro">{currentProject.detail?.summary || currentProject.description}</p>
              </header>

              {currentProject.detail?.mediaSrc && (
                <div className="media-frame has-media animate-fade-in" id="project-detail-media">
                  {currentProject.detail.mediaIsVideo || currentProject.detail.mediaSrc.endsWith(".mp4") || currentProject.detail.mediaSrc.endsWith(".webm") ? (
                    <video
                      className="detail-media-image"
                      src={getAssetUrl(currentProject.detail.mediaSrc)}
                      muted
                      loop
                      playsInline
                      autoPlay
                      controls
                      style={{ display: "block", width: "100%", maxHeight: "550px", objectFit: "cover", borderRadius: "12px" }}
                    />
                  ) : (
                    <img
                      loading="lazy"
                      className="detail-media-image"
                      src={getAssetUrl(currentProject.detail.mediaSrc)}
                      alt={currentProject.detail.mediaAlt || currentProject.title}
                    />
                  )}
                  {currentProject.detail.mediaLabel && (
                    <p className="media-placeholder mt-2 text-xs italic text-[var(--muted)]">
                      {currentProject.detail.mediaLabel}
                    </p>
                  )}
                </div>
              )}

              {/* Render Structured Sections or dynamic markdown if provided */}
              <div className="note-article-body" id="project-detail-body">
                {loadingMarkdown ? (
                  <div className="flex items-center gap-2 py-8 text-neutral-400 font-mono text-xs justify-center bg-[var(--sidebar-box-bg)] border border-[var(--line)] rounded-lg">
                    <div className="w-4 h-4 border-2 border-[var(--accent-strong)] border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading project details...</span>
                  </div>
                ) : activeMarkdownContent ? (
                  <AcademicArticleRenderer
                    markdown={activeMarkdownContent}
                    onHeadingsExtracted={setDetailOutline}
                  />
                ) : currentProject.detail?.sections ? (
                  currentProject.detail.sections.map((sec: any, idx: number) => (
                    <section className="detail-section" key={idx} id={sec.heading.toLowerCase().replace(/\s+/g, "-")}>
                      <h2 id={sec.heading.toLowerCase().replace(/\s+/g, "-")}>{sec.heading}</h2>
                      <p>{sec.text}</p>
                    </section>
                  ))
                ) : (
                  <p className="text-sm text-[var(--muted)]">No additional details are available for this project.</p>
                )}
              </div>

              {/* Related links and Publications at the bottom of the article */}
              {(currentProject.detail?.links || currentProject.detail?.relatedPublications) && (
                <div className="mt-8 pt-8 border-t border-[var(--line)] flex flex-col gap-6" id="project-related-meta">
                  {currentProject.detail?.links && currentProject.detail.links.length > 0 && (
                    <div id="project-related-links">
                      <p className="section-label mb-3">Related links</p>
                      <div className="action-group">
                        {currentProject.detail.links.map((link: any) => (
                          <a
                            key={link.title}
                            className="action-link"
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentProject.detail?.relatedPublications && currentProject.detail.relatedPublications.length > 0 && (
                    <div id="project-related-pubs">
                      <p className="section-label mb-3">Related publications</p>
                      <div className="publication-list">
                        {currentProject.detail.relatedPublications.map((pubId: string, index: number) => {
                          const pubObj = researchData.publications?.find((p: any) => p.id === pubId);
                          if (!pubObj) return null;

                          return (
                            <div className="publication-item" key={pubId}>
                              <span className="publication-index">[{index + 1}]</span>
                              <div className="publication-content">
                                <h3>{pubObj.title}</h3>
                                <HighlightedAuthors
                                  authors={pubObj.authors}
                                  highlightName={siteData.profile.highlightAuthorName}
                                />
                                <p className="item-meta text-xs text-[var(--muted)]">{pubObj.meta}</p>
                                {pubObj.actions && pubObj.actions.length > 0 && (
                                  <div className="action-group">
                                    {pubObj.actions.map((act: any) => (
                                      <a
                                        key={act.title}
                                        className="action-link"
                                        href={act.href}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {act.title}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          </main>
        </div>
      )}

      {/* 5. NOTE DETAIL VIEW */}
      {isNoteDetail && currentNote && (
        <div className="note-layout animate-fade-in" id="note-detail-view">
          {/* Interactive Outline sidebar */}
          <aside className="section-jump-card note-jump-card">
            <p className="section-label">Contents</p>
            <nav className="section-jump-nav note-jump-nav" aria-label="Article outline">
              {currentNote.isPdf ? (
                <>
                  <a href="#pdf-overview" className="is-h2 font-semibold">Document Overview</a>
                  <a href="#pdf-embedded" className="is-h2 font-semibold">Embedded PDF Viewer</a>
                  {currentNote.actions?.map((act: any) => (
                    <a key={act.title} href={act.href} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                      ↗ {act.title}
                    </a>
                  ))}
                </>
              ) : (
                detailOutline.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={item.level === 2 ? "is-h2" : ""}
                    onClick={(e) => handleSectionJump(e, item.id)}
                  >
                    {item.title}
                  </a>
                ))
              )}
            </nav>
          </aside>

          {/* Primary Note detail */}
          <main className="page-panel page-panel-wide note-detail-panel">
            <button
              className="back-link"
              onClick={() => {
                window.location.hash = "#blog";
              }}
              aria-label="Back to Notes"
              title="Back to Notes"
            >
              ←
            </button>

            <article className="note-article">
              <header className="note-article-header">
                <p className="section-kicker">{currentNote.meta}</p>
                <h1>{currentNote.title}</h1>
                <p className="page-intro">{currentNote.article?.summary || currentNote.description}</p>
              </header>

              {currentNote.tileMedia && (
                <div className="media-frame has-media animate-fade-in mb-8" id="note-detail-media">
                  {currentNote.tileMedia.endsWith(".mp4") || currentNote.tileMedia.endsWith(".webm") ? (
                    <video
                      className="detail-media-image"
                      src={getAssetUrl(currentNote.tileMedia)}
                      muted
                      loop
                      playsInline
                      autoPlay
                      controls
                      style={{ display: "block", width: "100%", maxHeight: "550px", objectFit: "cover", borderRadius: "12px" }}
                    />
                  ) : (
                    <img
                      loading="lazy"
                      className="detail-media-image"
                      src={getAssetUrl(currentNote.tileMedia)}
                      alt={currentNote.title}
                    />
                  )}
                </div>
              )}

              {/* Dynamic Markdown renderer wrapper for markdown articles */}
              {!currentNote.isPdf && (
                loadingMarkdown ? (
                  <div className="flex items-center gap-2 py-8 text-neutral-400 font-mono text-xs justify-center bg-[var(--sidebar-box-bg)] border border-[var(--line)] rounded-lg">
                    <div className="w-4 h-4 border-2 border-[var(--accent-strong)] border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading article content...</span>
                  </div>
                ) : (
                  <AcademicArticleRenderer
                    markdown={activeMarkdownContent || ""}
                    onHeadingsExtracted={setDetailOutline}
                  />
                )
              )}

              {/* If PDF, show beautiful PDF reader section */}
              {currentNote.isPdf && currentNote.pdfUrl && (
                <div className="pdf-viewer-section mt-6 flex flex-col gap-6">
                  <div id="pdf-overview" className="bg-[var(--sidebar-box-bg)] border border-[var(--line)] rounded-lg p-6 shadow-sm">
                    <p className="text-sm text-[var(--ink)] leading-relaxed mb-4">
                      This note is compiled as a PDF document, representing high-fidelity handwritten exports directly from an iPad. You can read, print, or download the original file using the viewer or links below.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={getAssetUrl(currentNote.pdfUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white rounded-md transition-colors"
                      >
                        Open PDF in New Tab ↗
                      </a>
                    </div>
                  </div>

                  <div id="pdf-embedded" className="w-full h-[650px] border border-[var(--line)] rounded-lg overflow-hidden bg-neutral-900 shadow-inner">
                    <iframe
                      loading="lazy"
                      src={`${getAssetUrl(currentNote.pdfUrl)}#toolbar=1`}
                      className="w-full h-full border-none"
                      title={currentNote.title}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

              {/* Action items grouped */}
              {currentNote.actions && currentNote.actions.length > 0 && (
                <div className="action-group mt-6">
                  {currentNote.actions.map((act: any) => (
                    <a
                      key={act.title}
                      className="action-link animate-fade-in"
                      href={act.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {act.title}
                    </a>
                  ))}
                </div>
              )}
            </article>
          </main>
        </div>
      )}
    </div>
  );
}
