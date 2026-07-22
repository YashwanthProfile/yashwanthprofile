/**
 * =================================================================================
 * ACADEMIC PORTFOLIO ENGINE - ARCHITECTURE, SPEED OPTIMIZATIONS & MAINTENANCE GUIDE
 * =================================================================================
 * 
 * 1. HIGH-SPEED ARCHITECTURE & CORE WEB VITALS OPTIMIZATIONS:
 *    - No-Build Import Pipeline: Built on Preact and HTM via unbundled ESM imports.
 *      Eliminates compile overhead and lets modifications render instantly on save.
 *    - zero Cumulative Layout Shift (CLS): Configuration files (under /config) are
 *      imported statically. This guarantees that all page elements paint instantly
 *      without layout jumping or flashing, unlike traditional async REST API fetches.
 *    - Image Performance: All media assets use browser-native `loading="lazy"` tags 
 *      which saves bandwidth and increases First Contentful Paint (FCP) speed.
 *    - Zero-Weight Iconography: Heavy external icon libraries (FontAwesome/Lucide)
 *      are bypassed. Inline, low-footprint SVG elements are used to guarantee 
 *      sub-millisecond load times.
 * 
 * 2. STRUCTURE & COMPONENT DIRECTORY FOR MAINTENANCE:
 *    - /config/profile.js: Scholar details, affiliation, and profile links.
 *    - /config/cv.js: Curriculum Vitae timeline, experience, education, and updates.
 *    - /config/projects.js: Project collections, meta details, videos, and labels.
 *    - /config/publications.js: Divided lists for Journals, Conferences, and Patents.
 *    - /config/blogs.js: Full posts, external links, and handwriting handwritten PDF notes.
 * 
 * 3. HOW TO UPLOAD & UPDATE CONTENT:
 *    - Static Files (PDFs/Images): Place inside `/assets` directory.
 *    - Link Assets: Reference them in configuration files using relative paths like
 *      `"assets/my_note.pdf"` or `"assets/image.png"`. The `getAssetUrl()` helper will
 *      correctly prepend current pathing for absolute relative compatibility.
 *    - New Blog Articles:
 *      a) Standard Markdown: Add a folder `/content/blogs/<slug>/content.md` containing
 *         your article text. Then list the slug in `/config/blogs.js` (isPdf: false).
 *      b) Handwritten iPad PDF: Drop the PDF in `/assets/` and point `pdfUrl` to it (isPdf: true).
 *      c) External Link (e.g. Medium): Set `isExternal: true` and point `url` to it.
 * =================================================================================
 */

import { h, render } from "https://esm.sh/preact@10.19.2";
import { useState, useEffect, useRef } from "https://esm.sh/preact@10.19.2/hooks";
import htm from "https://esm.sh/htm@3.1.1";

// Static imports of the modular portfolio configuration JS files
import { profileData } from "./config/profile.js";
import { cvDataStatic } from "./config/cv.js";
import { projectsData } from "./config/projects.js";
import { publicationsData } from "./config/publications.js";
import { blogsData } from "./config/blogs.js";

const html = htm.bind(h);

// Prepend ./ to ensure browser-relative paths match your project structure
const getAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.replace(/^\//, "");
  return `./${cleanPath}`;
};

// Reusable SVG Icon Components to avoid heavy npm dependencies and load latency
const MapPin = () => html`
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin flex-shrink-0 mt-0.5">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
`;

const Building = () => html`
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building flex-shrink-0 mt-0.5">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/>
    <path d="M16 6h.01"/>
    <path d="M12 6h.01"/>
    <path d="M12 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M16 10h.01"/>
    <path d="M16 14h.01"/>
    <path d="M8 10h.01"/>
    <path d="M8 14h.01"/>
  </svg>
`;

const Link2 = () => html`
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link-2 flex-shrink-0">
    <path d="M9 17H7A5 5 0 0 1 7 7h2"/>
    <path d="M15 7h2a5 5 0 0 1 0 10h-2"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
`;

const ExternalLink = () => html`
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link flex-shrink-0">
    <path d="M15 3h6v6"/>
    <path d="M10 14 21 3"/>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
  </svg>
`;

const Mail = () => html`
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail flex-shrink-0">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
`;

const Github = () => html`
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github flex-shrink-0">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
`;

const Linkedin = () => html`
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin flex-shrink-0">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
`;

const GraduationCap = () => html`
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap flex-shrink-0">
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
  </svg>
`;

const FileText = () => html`
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text flex-shrink-0">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    <path d="M10 9H8"/>
    <path d="M16 13H8"/>
    <path d="M16 17H8"/>
  </svg>
`;

// Reusable profile avatar component with elegant initial-based fallback
function ProfileAvatar({ src, alt }) {
  const [error, setError] = useState(false);

  if (error) {
    return html`
      <div
        class="avatar-image flex items-center justify-center font-serif text-6xl font-bold select-none"
        style=${{
          background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 100%)",
          color: "var(--bg)",
          width: "100%",
          height: "100%",
        }}
      >
        Y
      </div>
    `;
  }

  return html`
    <img
      class="avatar-image"
      src=${getAssetUrl(src)}
      alt=${alt}
      onError=${() => setError(true)}
    />
  `;
}

// Highlights the scholar's name in standard lists of authors
function HighlightedAuthors({ authors, highlightName }) {
  if (!authors || !highlightName || !authors.includes(highlightName)) {
    return html`<span class="item-authors">${authors}</span>`;
  }

  const parts = authors.split(highlightName);
  return html`
    <p class="item-authors">
      ${parts.map((part, index) => html`
        <span key=${index}>
          ${part}
          ${index < parts.length - 1 && html`<strong>${highlightName}</strong>`}
        </span>
      `)}
    </p>
  `;
}

// Scroll to sections smoothly
const handleSectionJump = (e, targetId) => {
  e.preventDefault();
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

function Sidebar({ profile }) {
  if (!profile) return null;
  return html`
    <aside class="sidebar sidebar-home-box">
      <div class="identity-block">
        <div class="w-full flex justify-center">
          <div class="avatar-wrap">
            <${ProfileAvatar}
              src=${profile.photo}
              alt=${`${profile.name}'s Profile Photo`}
            />
          </div>
        </div>
        <p class="eyebrow" id="profile-role">
          ${profile.role}
        </p>
        <h1 id="profile-name" class="text-xl font-sans font-bold tracking-tight text-[var(--ink)] mt-1">
          ${profile.name}
        </h1>
        <p class="text-xs leading-relaxed text-[var(--muted)] mt-2" id="profile-tagline">
          ${profile.tagline}
        </p>
      </div>

      <div class="sidebar-details flex flex-col gap-3 mt-4 pt-4 border-t border-[color-mix(in_srgb,var(--line)_50%,transparent)]">
        <div class="flex items-start gap-2.5 text-xs text-[var(--muted)]" id="profile-affiliation-box">
          <${Building} />
          <span id="profile-affiliation" class="leading-normal">${profile.affiliation}</span>
        </div>

        <div class="flex items-start gap-2.5 text-xs text-[var(--muted)]" id="profile-location-box">
          <${MapPin} />
          <span id="profile-location" class="leading-normal">${profile.location}</span>
        </div>
      </div>

      <div class="sidebar-links flex flex-col gap-2 mt-3 pt-3 border-t border-[color-mix(in_srgb,var(--line)_50%,transparent)]" id="profile-links">
        ${profile.links?.map((link) => {
          const lowercaseLabel = link.label.toLowerCase();
          let IconComponent = Link2;
          if (lowercaseLabel.includes("email") || lowercaseLabel.includes("mail")) IconComponent = Mail;
          else if (lowercaseLabel.includes("github")) IconComponent = Github;
          else if (lowercaseLabel.includes("linkedin")) IconComponent = Linkedin;
          else if (lowercaseLabel.includes("scholar")) IconComponent = GraduationCap;
          else if (lowercaseLabel.includes("cv")) IconComponent = FileText;

          return html`
            <a
              key=${link.label}
              href=${link.href}
              target="_blank"
              rel="noreferrer"
              class="flex items-center gap-2.5 text-xs text-[var(--muted)] hover:text-[var(--accent-strong)] transition-colors duration-150 py-0.5"
            >
              <${IconComponent} />
              <span class="font-medium">${link.label}</span>
            </a>
          `;
        })}
      </div>
    </aside>
  `;
}

// Renders markdown with math equations, code blocks, and outline generators
function AcademicArticleRenderer({ markdown, onHeadingsExtracted }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderedHtml = "";
    try {
      if (window.marked) {
        if (typeof window.marked.parse === "function") {
          window.marked.setOptions({ gfm: true, breaks: false });
          renderedHtml = window.marked.parse(markdown);
        } else if (typeof window.marked === "function") {
          renderedHtml = window.marked(markdown);
        }
      }
    } catch (err) {
      console.error("Error parsing markdown with marked library:", err);
    }

    if (!renderedHtml) {
      // Robust custom markdown fallback in case of delayed library loading
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

    // Build the outline structure by querying tags
    const headings = containerRef.current.querySelectorAll("h1, h2");
    const headingList = [];
    const idCounts = new Map();

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

        const level = heading.tagName.toLowerCase() === "h1" ? 1 : 2;
        headingList.push({ id: finalId, title, level });
      } catch (err) {
        console.error("Error setting heading ID:", err);
      }
    });

    if (onHeadingsExtracted) {
      onHeadingsExtracted(headingList);
    }

    // Apply HighlightJS syntax styling
    const hljsGlobal = window.hljs;
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

    // Render mathematical expressions inside markdown
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
  }, [markdown]);

  return html`<div ref=${containerRef} class="note-article-body" />`;
}

export default function App() {
  // Statically imported configuration values (loaded instantly on boot)
  const [siteData, setSiteData] = useState(profileData);
  const [cvData, setCvData] = useState(cvDataStatic);
  const [researchData, setResearchData] = useState({
    projects: projectsData,
    publications: publicationsData,
  });
  const [blogData, setBlogData] = useState({
    notes: blogsData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeMarkdownContent, setActiveMarkdownContent] = useState("");
  const [loadingMarkdown, setLoadingMarkdown] = useState(false);

  const [hash, setHash] = useState(window.location.hash || "#home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme-preference") || "dark";
  });
  const [colorCombo, setColorCombo] = useState(() => {
    return localStorage.getItem("color-combo-preference") || "crimson";
  });
  const [activeProjectTag, setActiveProjectTag] = useState(null);
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [detailOutline, setDetailOutline] = useState([]);

  // Sync state transitions on hash routes changes
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

  // Sync preference attributes to document body
  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme-preference", theme);
  }, [theme]);

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

  let activeTab = "home";
  if (isBio) activeTab = "bio";
  if (isBlog || isNoteDetail) activeTab = "blog";
  if (isProjectDetail) activeTab = "home";

  const projectSlug = isProjectDetail ? hash.replace("#project/", "") : "";
  const noteSlug = isNoteDetail ? hash.replace("#note/", "") : "";

  const currentProject = (researchData && projectSlug)
    ? researchData.projects?.find((p) => p.slug === projectSlug)
    : null;
  const currentNote = (blogData && noteSlug)
    ? blogData.notes?.find((n) => n.slug === noteSlug)
    : null;

  // Retrieve project or note detailed markdown files dynamically
  useEffect(() => {
    if (isProjectDetail && projectSlug) {
      setActiveMarkdownContent("");
      setLoadingMarkdown(true);
      fetch(`./content/projects/${projectSlug}/content.md`)
        .then((res) => {
          if (!res.ok) throw new Error("Could not find project details markdown file");
          return res.text();
        })
        .then((text) => {
          setActiveMarkdownContent(text);
          setLoadingMarkdown(false);
        })
        .catch((err) => {
          console.warn(err);
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
      fetch(`./content/blogs/${noteSlug}/content.md`)
        .then((res) => {
          if (!res.ok) throw new Error("Could not find note article markdown file");
          return res.text();
        })
        .then((text) => {
          setActiveMarkdownContent(text);
          setLoadingMarkdown(false);
        })
        .catch((err) => {
          console.error(err);
          setActiveMarkdownContent(`### Error\nFailed to load article markdown file at \`content/blogs/${noteSlug}/content.md\`.`);
          setLoadingMarkdown(false);
        });
    } else {
      setActiveMarkdownContent("");
      setLoadingMarkdown(false);
    }
  }, [hash, projectSlug, noteSlug, blogData, currentNote]);

  if (loading) {
    return html`
      <div class="flex items-center justify-center min-h-screen bg-[#121214] text-white font-sans">
        <div class="flex flex-col items-center gap-4">
          <div class="w-8 h-8 border-4 border-[var(--accent-strong)] border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs font-mono tracking-wider text-neutral-400 uppercase">Loading Yashwanth's Portfolio...</p>
        </div>
      </div>
    `;
  }

  if (error || !siteData || !cvData || !researchData || !blogData) {
    return html`
      <div class="flex items-center justify-center min-h-screen bg-[#121214] text-white font-sans p-6">
        <div class="max-w-md p-6 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl text-center">
          <h2 class="text-lg font-bold text-red-500 mb-2">Failed to Load Content</h2>
          <p class="text-xs font-mono text-neutral-400 mb-4">${error || "Missing portfolio configuration files."}</p>
          <p class="text-xs text-neutral-500 leading-relaxed">
            Please verify that <code class="bg-neutral-800 px-1 py-0.5 rounded text-red-400">data.json</code> exists and contains valid JSON.
          </p>
        </div>
      </div>
    `;
  }

  return html`
    <div class="site-frame" id="main-frame">
      <header class="topbar ${mobileMenuOpen ? "menu-open" : ""}" id="header-topbar">
        <a
          class="brandmark"
          id="brand-link"
          href="#home"
          onClick=${() => { window.location.hash = "#home"; }}
        >
          ${siteData.profile.name}
        </a>

        <button
          class="menu-toggle"
          id="menu-toggle"
          type="button"
          aria-expanded=${mobileMenuOpen}
          aria-controls="top-nav"
          aria-label=${mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick=${() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav class="topnav" id="top-nav">
          ${siteData.navigation?.map((item) => html`
            <a
              key=${item.page}
              href=${item.href}
              class=${activeTab === item.page ? "is-active" : ""}
            >
              ${item.label}
            </a>
          `)}

          <div class="relative inline-flex items-center mx-1">
            <select
              value=${colorCombo}
              onChange=${(e) => setColorCombo(e.target.value)}
              class="color-combo-select font-mono text-[10px] bg-transparent text-[var(--ink)] border border-[var(--line)] rounded px-1.5 py-0.5 outline-none cursor-pointer hover:border-[var(--accent-strong)] transition-colors focus:border-[var(--accent-strong)]"
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

          <button
            class="theme-toggle ${theme === "dark" ? "is-active" : ""}"
            id="theme-toggle"
            type="button"
            title="Toggle theme"
            aria-label="Toggle color theme"
            onClick=${() => setTheme(theme === "light" ? "dark" : "light")}
          >
            ${theme === "dark" ? "☼" : "◑"}
          </button>
        </nav>
      </header>

      <!-- 1. HOME TAB -->
      ${isHome && html`
        <div class="page-shell animate-fade-in" id="home-view">
          <${Sidebar} profile=${siteData.profile} />

          <main class="content flex flex-col gap-12">
            <section class="blog-tile-section pb-2" id="home-focus-section">
              <div class="section-heading mb-4 flex items-center justify-between">
                <h2 class="section-kicker">Research Focus</h2>
                ${activeProjectTag && html`
                  <button
                    onClick=${() => setActiveProjectTag(null)}
                    class="text-[10px] uppercase tracking-wider text-[var(--accent-strong)] hover:underline font-semibold cursor-pointer"
                  >
                    Clear Filter ✕
                  </button>
                `}
              </div>
              <div class="flex flex-wrap gap-2.5">
                ${[
                  "Optimal Control",
                  "Nonlinear Dynamics",
                  "Data-driven Learning",
                  "Robotics",
                  "Koopman Operator Theory",
                  "Flight Dynamics"
                ].map((tag) => {
                  const isSelected = activeProjectTag === tag;
                  return html`
                    <button
                      key=${tag}
                      onClick=${() => setActiveProjectTag(isSelected ? null : tag)}
                      class="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-2 border ${
                        isSelected
                          ? "bg-[var(--accent-strong)] text-white border-[var(--accent-strong)] shadow-sm font-semibold"
                          : "bg-[var(--sidebar-box-bg)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--accent-strong)]"
                      }"
                    >
                      <span class="w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white animate-pulse" : "bg-[var(--accent)]"}" />
                      ${tag}
                    </button>
                  `;
                })}
              </div>
            </section>

            <section class="blog-tile-section" id="research-projects-section">
              <div class="section-heading mb-6">
                <h2 class="section-kicker">Research Projects</h2>
              </div>

              <div id="project-grid">
                <div class="project-grid">
                  ${researchData.projects
                    ?.filter((project) => !activeProjectTag || project.tags?.includes(activeProjectTag))
                    .sort((a, b) => {
                      const yearA = parseInt(a.year || "2023");
                      const yearB = parseInt(b.year || "2023");
                      return yearB - yearA;
                    })
                    .map((project) => html`
                    <article class="project-tile flex flex-col relative" key=${project.slug}>
                      ${project.year && html`
                        <div class="absolute top-3 right-3 bg-neutral-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-10 uppercase">
                          ${project.year}
                        </div>
                      `}
                      ${project.tileMedia && html`
                        <a
                          href="#project/${project.slug}"
                          class="project-tile-media-link"
                        >
                          ${project.tileIsVideo || project.tileMedia.endsWith(".mp4") || project.tileMedia.endsWith(".webm") || project.tileVideo ? html`
                            <video
                              class="project-tile-media"
                              src=${getAssetUrl(project.tileVideo || project.tileMedia)}
                              muted
                              loop
                              playsInline
                              autoPlay
                              style=${{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ` : html`
                            <img
                              loading="lazy"
                              class="project-tile-media"
                              src=${getAssetUrl(project.tileMedia)}
                              alt="${project.title} preview"
                            />
                          `}
                        </a>
                      `}
                      <!-- PROJECT INFO BLOCK (Tighter margins to save vertical height) -->
                      <div class="project-tile-head flex flex-col flex-1 mt-1.5">
                        <div>
                          <a
                            href="#project/${project.slug}"
                            class="project-title-link"
                          >
                            <h3 class="line-clamp-2 text-sm">${project.title}</h3>
                          </a>
                          <p class="tile-meta mt-1 line-clamp-2">${project.meta}</p>
                        </div>
                        <div class="mt-auto pt-1">
                          <a
                            class="action-link inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-strong)]"
                            href="#project/${project.slug}"
                          >
                            View Details →
                          </a>
                        </div>
                      </div>
                    </article>
                  `)}
                </div>
              </div>
            </section>

            <section class="blog-tile-section mt-4" id="research-publications-tile-section">
              <div class="section-heading mb-6">
                <h2 class="section-kicker">Publications</h2>
              </div>

              <div id="research-publications-tile">
                <div class="project-groups">
                  ${["Journal", "Conference", "Patent"].map((cat) => {
                    const groupItems = researchData.publications?.filter((pub) => pub.category === cat);
                    if (!groupItems || groupItems.length === 0) return null;

                    return html`
                      <div class="project-group" key=${cat}>
                        <div class="project-group-heading">
                          <p>${cat}s</p>
                          <div class="project-group-divider" />
                        </div>

                        <div class="publication-list">
                          ${groupItems.map((pub, idx) => html`
                            <article class="publication-item" key=${pub.id}>
                              <span class="publication-index">${idx + 1}.</span>
                              <div class="publication-content">
                                <h3>${pub.title}</h3>
                                <${HighlightedAuthors}
                                  authors=${pub.authors}
                                  highlightName=${siteData.profile.highlightAuthorName}
                                />
                                <p class="item-meta">${pub.meta}</p>
                                ${pub.actions && pub.actions.length > 0 && html`
                                  <div class="action-group mt-1">
                                    ${pub.actions.map((act) => html`
                                      <a
                                        key=${act.title}
                                        class="action-link"
                                        href=${act.href}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        ${act.title}
                                      </a>
                                    `)}
                                  </div>
                                `}
                              </div>
                            </article>
                          `)}
                        </div>
                      </div>
                    `;
                  })}
                </div>
              </div>
            </section>
          </main>
        </div>
      `}

      <!-- 2. BIO TAB -->
      ${isBio && html`
        <div class="page-shell animate-fade-in" id="bio-view">
          <aside class="section-jump-card sticky top-24 self-start">
            <p class="section-label">Jump To</p>
            <nav class="section-jump-nav" aria-label="Bio sections">
              <a href="#bio-experience-section" onClick=${(e) => handleSectionJump(e, "bio-experience-section")}>Experience</a>
              <a href="#bio-education-section" onClick=${(e) => handleSectionJump(e, "bio-education-section")}>Education</a>
              <a href="#bio-updates-section" onClick=${(e) => handleSectionJump(e, "bio-updates-section")}>Updates</a>
            </nav>
          </aside>

          <main class="content">
            <section class="section" id="bio-experience-section">
              <div class="section-heading">
                <h2 class="section-kicker">Experience</h2>
              </div>
              <div class="relative border-l border-[var(--line)] ml-2 pl-6 space-y-8 py-2">
                ${cvData.experience?.map((exp, idx) => html`
                  <article class="relative" key=${idx}>
                    <span class="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center">
                      <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent-strong)]"></span>
                    </span>

                    <span class="font-mono text-xs text-[var(--subtitle)] uppercase tracking-wider block mb-1">
                      ${exp.duration}
                    </span>
                    <h3 class="text-sm font-semibold text-[var(--ink)] m-0">
                      ${exp.role}
                    </h3>
                    <p class="font-mono text-xs text-[var(--muted)] m-0 mt-0.5 font-semibold">
                      ${exp.organization}
                    </p>
                    <p class="text-sm text-[var(--muted)] m-0 mt-2 leading-relaxed">
                      ${exp.description}
                    </p>
                  </article>
                `)}
              </div>
            </section>

            <section class="section" id="bio-education-section">
              <div class="section-heading">
                <h2 class="section-kicker">Education</h2>
              </div>
              <div class="relative border-l border-[var(--line)] ml-2 pl-6 space-y-8 py-2">
                ${cvData.education?.map((edu, idx) => html`
                  <article class="relative" key=${idx}>
                    <span class="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center">
                      <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent-strong)]"></span>
                    </span>

                    <span class="font-mono text-xs text-[var(--subtitle)] uppercase tracking-wider block mb-1">
                      ${edu.duration}
                    </span>
                    <h3 class="text-sm font-semibold text-[var(--ink)] m-0">
                      ${edu.degree}
                    </h3>
                    <p class="font-mono text-xs text-[var(--muted)] m-0 mt-0.5 font-semibold">
                      ${edu.institution}
                    </p>
                    ${edu.advisor && html`
                      <p class="text-xs text-[var(--ink)] font-semibold m-0 mt-1.5">
                        Advisor: <span class="text-[var(--muted)] font-normal">${edu.advisor}</span>
                      </p>
                    `}
                    <p class="text-sm text-[var(--muted)] m-0 mt-2 leading-relaxed">
                      ${edu.description}
                    </p>
                  </article>
                `)}
              </div>
            </section>

            <section class="section home-updates-section" id="bio-updates-section">
              <div class="section-heading">
                <h2 class="section-kicker">Updates</h2>
              </div>
              <div class="relative border-l border-[var(--line)] ml-2 pl-6 space-y-8 py-2" id="home-updates">
                ${[...cvData.updates]
                  ?.filter((u) => u.showOnHome)
                  .sort((a, b) => {
                    const parseDateStr = (dStr) => {
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
                  .map((item, idx) => html`
                    <article class="relative" key=${idx}>
                      <span class="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full border border-[var(--line)] bg-[var(--bg)] flex items-center justify-center">
                        <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent-strong)]"></span>
                      </span>

                      <span class="font-mono text-xs text-[var(--subtitle)] uppercase tracking-wider block mb-1">
                        ${item.date}
                      </span>
                      <h3 class="text-sm font-semibold text-[var(--ink)] m-0">
                        ${item.title}
                      </h3>
                      <p class="text-sm text-[var(--muted)] m-0 mt-1 leading-relaxed">
                        ${item.description}
                      </p>
                      ${item.actions && item.actions.length > 0 && html`
                        <div class="action-group mt-2">
                          ${item.actions.map((act) => html`
                            <a
                              key=${act.title}
                              class="action-link text-xs"
                              href=${act.href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              ${act.title}
                            </a>
                          `)}
                        </div>
                      `}
                    </article>
                  `)}
              </div>
            </section>
          </main>
        </div>
      `}

      <!-- 3. BLOG TAB -->
      ${isBlog && html`
        <div class="blog-stream-layout animate-fade-in" id="blog-view">
          <main class="max-w-7xl mx-auto w-full px-4 sm:px-6">
            <div class="mb-6">
              <input
                type="text"
                placeholder="Search blogs..."
                value=${blogSearchQuery}
                onInput=${(e) => setBlogSearchQuery(e.target.value)}
                class="w-full sm:max-w-md px-4 py-2 text-sm border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] placeholder-[var(--muted)] rounded-none shadow-sm focus:outline-none focus:border-[var(--accent-strong)]"
              />
            </div>
            <section class="blog-tile-section">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" id="blog-notes-list">
                ${blogData.notes
                  ?.filter((note) => note.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) || note.description.toLowerCase().includes(blogSearchQuery.toLowerCase()))
                  .sort((a, b) => {
                    const parseDateStr = (note) => {
                      if (note.year) {
                         return parseInt(note.year);
                      }
                      const datePart = note.meta.split(" • ")[0];
                      const parts = datePart.split(" ");
                      if (parts.length === 2) {
                        return parseInt(parts[1]);
                      }
                      return 2024;
                    };
                    return parseDateStr(b) - parseDateStr(a);
                  })
                  .map((note) => {
                    const blogUrl = note.isPdf ? getAssetUrl(note.pdfUrl) : (note.isExternal ? note.url : `#note/${note.slug}`);
                    const isNewTab = note.isPdf || note.isExternal;
                    const linkLabel = note.isPdf ? "Open PDF →" : (note.isExternal ? "Read External ↗" : "Read Article →");

                    return html`
                    <article class="project-tile flex flex-col relative" key=${note.slug}>
                      ${note.year && html`
                        <div class="absolute top-3 right-3 bg-neutral-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-10 uppercase">
                          ${note.year}
                        </div>
                      `}
                      ${note.tileMedia && html`
                        <a
                          href=${blogUrl}
                          target=${isNewTab ? "_blank" : undefined}
                          rel=${isNewTab ? "noopener noreferrer" : undefined}
                          class="project-tile-media-link"
                        >
                          <img
                            loading="lazy"
                            class="project-tile-media"
                            src=${getAssetUrl(note.tileMedia)}
                            alt="${note.title} preview"
                          />
                        </a>
                      `}
                      <!-- BLOG INFO BLOCK (Compact spacing, redundant type badges removed) -->
                      <div class="project-tile-head flex flex-col flex-1 mt-1.5">
                        <div>
                          <a
                            href=${blogUrl}
                            target=${isNewTab ? "_blank" : undefined}
                            rel=${isNewTab ? "noopener noreferrer" : undefined}
                            class="project-title-link"
                          >
                            <h3 class="line-clamp-3 text-sm">
                              ${note.title}
                            </h3>
                          </a>
                        </div>
                        <div class="mt-auto pt-1">
                          <a
                            class="action-link inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-strong)]"
                            href=${blogUrl}
                            target=${isNewTab ? "_blank" : undefined}
                            rel=${isNewTab ? "noopener noreferrer" : undefined}
                          >
                            ${linkLabel}
                          </a>
                        </div>
                      </div>
                    </article>
                  `;
                  })}
              </div>
            </section>
          </main>
        </div>
      `}

      <!-- 4. PROJECT DETAIL VIEW -->
      ${isProjectDetail && currentProject && html`
        <div class="note-layout animate-fade-in" id="project-detail-view">
          <aside class="section-jump-card note-jump-card">
            <p class="section-label">Contents</p>
            <nav class="section-jump-nav note-jump-nav" aria-label="Project details outline">
              ${detailOutline.map((item) => html`
                <a
                  key=${item.id}
                  href="#${item.id}"
                  class=${item.level === 2 ? "is-h2" : ""}
                  onClick=${(e) => handleSectionJump(e, item.id)}
                >
                  ${item.title}
                </a>
              `)}
            </nav>
          </aside>

          <main class="page-panel page-panel-wide note-detail-panel">
            <button
              class="back-link"
              onClick=${() => { window.location.hash = "#home"; }}
              aria-label="Back to Home"
              title="Back to Home"
            >
              ←
            </button>

            <article class="note-article">
              <header class="note-article-header">
                <p class="section-kicker">${currentProject.meta || currentProject.status}</p>
                <h1>${currentProject.title}</h1>
                <p class="page-intro">${currentProject.detail?.summary || currentProject.description}</p>
              </header>

              ${currentProject.detail?.mediaSrc && html`
                <div class="media-frame has-media animate-fade-in" id="project-detail-media">
                  ${currentProject.detail.mediaIsVideo || currentProject.detail.mediaSrc.endsWith(".mp4") || currentProject.detail.mediaSrc.endsWith(".webm") ? html`
                    <video
                      class="detail-media-image"
                      src=${getAssetUrl(currentProject.detail.mediaSrc)}
                      muted
                      loop
                      playsInline
                      autoPlay
                      controls
                      style=${{ display: "block", width: "100%", maxHeight: "550px", objectFit: "cover", borderRadius: "12px" }}
                    />
                  ` : html`
                    <img
                      loading="lazy"
                      class="detail-media-image"
                      src=${getAssetUrl(currentProject.detail.mediaSrc)}
                      alt=${currentProject.detail.mediaAlt || currentProject.title}
                    />
                  `}
                  ${currentProject.detail.mediaLabel && html`
                    <p class="media-placeholder mt-2 text-xs italic text-[var(--muted)]">
                      ${currentProject.detail.mediaLabel}
                    </p>
                  `}
                </div>
              `}

              <div class="note-article-body" id="project-detail-body">
                ${loadingMarkdown ? html`
                  <div class="flex items-center gap-2 py-8 text-neutral-400 font-mono text-xs justify-center bg-[var(--sidebar-box-bg)] border border-[var(--line)] rounded-lg">
                    <div class="w-4 h-4 border-2 border-[var(--accent-strong)] border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading project details...</span>
                  </div>
                ` : activeMarkdownContent ? html`
                  <${AcademicArticleRenderer}
                    markdown=${activeMarkdownContent}
                    onHeadingsExtracted=${setDetailOutline}
                  />
                ` : currentProject.detail?.sections ? html`
                  ${currentProject.detail.sections.map((sec, idx) => html`
                    <section class="detail-section" key=${idx} id=${sec.heading.toLowerCase().replace(/\s+/g, "-")}>
                      <h2 id=${sec.heading.toLowerCase().replace(/\s+/g, "-")}>${sec.heading}</h2>
                      <p>${sec.text}</p>
                    </section>
                  `)}
                ` : html`
                  <p class="text-sm text-[var(--muted)]">No additional details are available for this project.</p>
                `}
              </div>

              ${(currentProject.detail?.links || currentProject.detail?.relatedPublications) && html`
                <div class="mt-8 pt-8 border-t border-[var(--line)] flex flex-col gap-6" id="project-related-meta">
                  ${currentProject.detail?.links && currentProject.detail.links.length > 0 && html`
                    <div id="project-related-links">
                      <p class="section-label mb-3">Related links</p>
                      <div class="action-group">
                        ${currentProject.detail.links.map((link) => html`
                          <a
                            key=${link.title}
                            class="action-link"
                            href=${link.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            ${link.title}
                          </a>
                        `)}
                      </div>
                    </div>
                  `}

                  ${currentProject.detail?.relatedPublications && currentProject.detail.relatedPublications.length > 0 && html`
                    <div id="project-related-pubs">
                      <p class="section-label mb-3">Related publications</p>
                      <div class="publication-list">
                        ${currentProject.detail.relatedPublications.map((pubId, index) => {
                          const pubObj = researchData.publications?.find((p) => p.id === pubId);
                          if (!pubObj) return null;

                          return html`
                            <div class="publication-item" key=${pubId}>
                              <span class="publication-index">[${index + 1}]</span>
                              <div class="publication-content">
                                <h3>${pubObj.title}</h3>
                                <${HighlightedAuthors}
                                  authors=${pubObj.authors}
                                  highlightName=${siteData.profile.highlightAuthorName}
                                />
                                <p class="item-meta text-xs text-[var(--muted)]">${pubObj.meta}</p>
                                ${pubObj.actions && pubObj.actions.length > 0 && html`
                                  <div class="action-group">
                                    ${pubObj.actions.map((act) => html`
                                      <a
                                        key=${act.title}
                                        class="action-link"
                                        href=${act.href}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        ${act.title}
                                      </a>
                                    `)}
                                  </div>
                                `}
                              </div>
                            </div>
                          `;
                        })}
                      </div>
                    </div>
                  `}
                </div>
              `}
            </article>
          </main>
        </div>
      `}

      <!-- 5. NOTE DETAIL VIEW -->
      ${isNoteDetail && currentNote && html`
        <div class="note-layout animate-fade-in" id="note-detail-view">
          <aside class="section-jump-card note-jump-card">
            <p class="section-label">Contents</p>
            <nav class="section-jump-nav note-jump-nav" aria-label="Article outline">
              ${currentNote.isPdf ? html`
                <>
                  <a href="#pdf-overview" class="is-h2 font-semibold">Document Overview</a>
                  <a href="#pdf-embedded" class="is-h2 font-semibold">Embedded PDF Viewer</a>
                  ${currentNote.actions?.map((act) => html`
                    <a key=${act.title} href=${act.href} target="_blank" rel="noreferrer" class="flex items-center gap-1">
                      ↗ ${act.title}
                    </a>
                  `)}
                </>
              ` : html`
                ${detailOutline.map((item) => html`
                  <a
                    key=${item.id}
                    href="#${item.id}"
                    class=${item.level === 2 ? "is-h2" : ""}
                    onClick=${(e) => handleSectionJump(e, item.id)}
                  >
                    ${item.title}
                  </a>
                `)}
              `}
            </nav>
          </aside>

          <main class="page-panel page-panel-wide note-detail-panel">
            <button
              class="back-link"
              onClick=${() => { window.location.hash = "#blog"; }}
              aria-label="Back to Notes"
              title="Back to Notes"
            >
              ←
            </button>

            <article class="note-article">
              <header class="note-article-header">
                <p class="section-kicker">${currentNote.meta}</p>
                <h1>${currentNote.title}</h1>
                <p class="page-intro">${currentNote.article?.summary || currentNote.description}</p>
              </header>

              ${currentNote.tileMedia && html`
                <div class="media-frame has-media animate-fade-in mb-8" id="note-detail-media">
                  ${currentNote.tileMedia.endsWith(".mp4") || currentNote.tileMedia.endsWith(".webm") ? html`
                    <video
                      class="detail-media-image"
                      src=${getAssetUrl(currentNote.tileMedia)}
                      muted
                      loop
                      playsInline
                      autoPlay
                      controls
                      style=${{ display: "block", width: "100%", maxHeight: "550px", objectFit: "cover", borderRadius: "12px" }}
                    />
                  ` : html`
                    <img
                      loading="lazy"
                      class="detail-media-image"
                      src=${getAssetUrl(currentNote.tileMedia)}
                      alt=${currentNote.title}
                    />
                  `}
                </div>
              `}

              ${!currentNote.isPdf && html`
                ${loadingMarkdown ? html`
                  <div class="flex items-center gap-2 py-8 text-neutral-400 font-mono text-xs justify-center bg-[var(--sidebar-box-bg)] border border-[var(--line)] rounded-lg">
                    <div class="w-4 h-4 border-2 border-[var(--accent-strong)] border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading article content...</span>
                  </div>
                ` : html`
                  <${AcademicArticleRenderer}
                    markdown=${activeMarkdownContent || ""}
                    onHeadingsExtracted=${setDetailOutline}
                  />
                `}
              `}

              ${currentNote.isPdf && currentNote.pdfUrl && html`
                <div class="pdf-viewer-section mt-6 flex flex-col gap-6">
                  <div id="pdf-overview" class="bg-[var(--sidebar-box-bg)] border border-[var(--line)] rounded-lg p-6 shadow-sm">
                    <p class="text-sm text-[var(--ink)] leading-relaxed mb-4">
                      This note is compiled as a PDF document, representing high-fidelity handwritten exports directly from an iPad. You can read, print, or download the original file using the viewer or links below.
                    </p>
                    <div class="flex flex-wrap gap-3">
                      <a
                        href=${getAssetUrl(currentNote.pdfUrl)}
                        target="_blank"
                        rel="noreferrer"
                        class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white rounded-md transition-colors"
                      >
                        Open PDF in New Tab ↗
                      </a>
                    </div>
                  </div>

                  <div id="pdf-embedded" class="w-full h-[650px] border border-[var(--line)] rounded-lg overflow-hidden bg-neutral-900 shadow-inner">
                    <iframe
                      loading="lazy"
                      src="${getAssetUrl(currentNote.pdfUrl)}#toolbar=1"
                      class="w-full h-full border-none"
                      title=${currentNote.title}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              `}

              ${currentNote.actions && currentNote.actions.length > 0 && html`
                <div class="action-group mt-6">
                  ${currentNote.actions.map((act) => html`
                    <a
                      key=${act.title}
                      class="action-link animate-fade-in"
                      href=${act.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ${act.title}
                    </a>
                  `)}
                </div>
              `}
            </article>
          </main>
        </div>
      `}
    </div>
  `;
}

render(html`<${App} />`, document.getElementById("root"));
