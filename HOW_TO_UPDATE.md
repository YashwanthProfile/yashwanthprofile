# How to Update Content (Dynamic Zero-Build Workflow)

Welcome to your dynamic academic portfolio! The architecture of this website has been fully refactored into a **No-Build ESM Architecture** (using Preact + HTM + Tailwind CDN) with **Modular Split JavaScript Configuration Files**.

This means there are **no Node.js compilation steps**, **no `npm run build` requirements**, and **no custom bundler configurations** required to update your page. You can make changes locally, preview them instantly in any browser (such as with **VS Code Live Server**), and simply `git push` to GitHub. Your website on GitHub Pages will update instantly!

Furthermore, because our configuration files are **standard JavaScript modules (`.js`) instead of rigid JSON (`.json`)**:
- 📝 **You can write comments** (using `//` or `/* */`) right inside your configuration files to document ideas or keep notes.
- 🔧 **Trailing commas are 100% supported!** You will never crash your website just because of a stray comma.
- 🚀 **Zero loading latency** - the app boots instantly because the data is loaded statically at startup!

---

## Folder Organization

All content—including metadata files, markdown articles, images, and iPad PDF notes—resides directly in your repository. The monolithic `data.json` file has been split into five separate, beautifully commented configuration files located in `/config/`:

```
/
├── index.html                    # The website entry point (served by GitHub Pages)
├── index.css                     # Your custom stylesheet (theme colors & layouts)
├── app.js                        # The interactive web application logic (fully commented)
├── yash_avatar.jpg               # Your profile picture
│
├── config/                       # ─── MODULAR CONFIGURATION FILES ───
│   ├── profile.js                # Navigation, Name, Title, Social links, Bio
│   ├── cv.js                     # Timeline Updates, Education history, Experience
│   ├── projects.js               # Research Project cards, videos, tags, details
│   ├── publications.js           # Conference papers, Journals, Patents list
│   └── blogs.js                  # Blog/Note listings, PDFs, dates, descriptions
│
├── content/                      # Unified content repository for long-form text
│   ├── projects/                 # Research Project Markdown Folders
│   │   ├── flapping-wing-mav/
│   │   │   └── content.md        # Long-form markdown content (LaTeX equations + text)
│   │   └── ...
│   │
│   └── blogs/                    # Blog / Note Markdown Folders
│       ├── koopman-theory-control/
│       │   └── content.md        # Blog post markdown text (LaTeX equations + text)
│       └── ...
```

---

## 1. How to Edit Existing Content

Instead of scrolling through one massive file, you can edit the exact file corresponding to the section you want to modify:

| Section to Edit | Config File to Open | Key Fields Inside |
| :--- | :--- | :--- |
| **Profile, Bio, Header Links** | `config/profile.js` | `profileData.profile` fields (name, role, bio, links) |
| **Education, Experience, Updates** | `config/cv.js` | `cvDataStatic` fields (education list, experience, timeline updates) |
| **Project Cards / High-Level Details** | `config/projects.js` | `projectsData` (slug, title, year, tags, details, media) |
| **Publications (Journals, Conferences, Patents)** | `config/publications.js` | `publicationsData` list of conference papers, journals, patents |
| **Blog Cards / Note Previews** | `config/blogs.js` | `blogsData` list (slug, title, description, isPdf, pdfUrl) |

To update long-form details, open the corresponding `content.md` file inside `/content/projects/<slug>/content.md` or `/content/blogs/<slug>/content.md` and edit the markdown.

---

## 2. How to Add a New Project or Blog Post

### Step A: Create the Folder and Markdown File
1. Under `/content/projects/` (for projects) or `/content/blogs/` (for blogs), create a new folder named after your post's slug (e.g. `nonlinear-observers`).
2. Inside that folder, create a file named exactly `content.md`.
3. Write your long-form article using standard Markdown and LaTeX (equations wrapped in `$` or `$$`).

### Step B: Declare the New Post in the corresponding Split JavaScript File

#### For a Project:
Open `/config/projects.js` and append your new project object to the `projectsData` list:
```javascript
  {
    slug: "nonlinear-observers",
    title: "Data-Driven Nonlinear Observer Design",
    status: "Ongoing",
    year: "2026",
    meta: "IIT-Hyderabad • 2026",
    description: "Short card preview text shown on the home page.",
    tileMedia: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
    tags: ["Nonlinear Dynamics", "Data-driven Learning"],
  },
```

#### For a Blog Post (Standard Markdown):
Open `/config/blogs.js` and append your new blog object to the `blogsData` list:
```javascript
  {
    slug: "nonlinear-observers",
    title: "A Primer on Nonlinear Observers",
    meta: "May 2026 • 8 min read",
    year: "2026",
    description: "Short preview text of the blog article.",
    tileMedia: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
```

#### For a Blog Post (Direct iPad/Handwritten PDF):
Open `/config/blogs.js`, set `"isPdf": true`, and specify the `"pdfUrl"` pointing to your hosted PDF:
```javascript
  {
    slug: "observer-pdf-notes",
    title: "Mathematical Analysis of Observers",
    meta: "May 2026 • Handwritten Notes",
    year: "2026",
    description: "High-fidelity handwritten iPad exports analyzing observer convergence.",
    isPdf: true,
    pdfUrl: "https://yashwanthprofile.github.io/blog-data/observers.pdf",
    tileMedia: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80",
  },
```

---

## 3. Local Development & Previewing Live

You can test and preview your changes live on your computer in two ways:

### Option A: VS Code Live Server (Fastest & Simplest)
Our website works natively in any standard static file server without any build tools!
1. Open the repository root directory in VS Code.
2. Click **Go Live** in the bottom status bar (or right-click `index.html` at the root and select **Open with Live Server**).
3. The website will render instantly.
4. Any changes you make to any file under `/config/` or `/content/` will be visible **immediately** when you refresh the browser!

### Option B: Vite Dev Server (Optional)
If you prefer running Vite:
1. Run `npm install` (once).
2. Run `npm run dev` to start Vite. It will serve your root files instantly on port 3000.
3. Access the site at `http://localhost:3000`.

---

## 4. Deploying to GitHub Pages

Once you are happy with your changes:
1. Stage your edited files:
   ```bash
   git add .
   ```
2. Commit your changes:
   ```bash
   git commit -m "update: add a new research project"
   ```
3. Push to GitHub:
   ```bash
   git push
   ```
GitHub Pages will serve your updated repository folder instantly!
