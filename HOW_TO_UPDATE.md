# How to Update Content (Dynamic Zero-Build Workflow)

Welcome to your dynamic academic portfolio! The architecture of this website has been fully refactored into a **No-Build ESM Architecture** (using Preact + HTM + Tailwind CDN). 

This means there are **no Node.js compilation steps**, **no `npm run build` requirements**, and **no custom bundler configurations**. You can make changes locally, preview them instantly in any browser (such as with **VS Code Live Server**), and simply `git push` to GitHub. Your website on GitHub Pages will update instantly!

---

## Folder Organization

All content—including metadata, markdown articles, images, videos, and iPad PDF notes—resides directly in the **root** directory of your repository. This makes organization extremely clean and intuitive:

```
/
├── index.html                  # The website entry point (served by GitHub Pages)
├── index.css                   # Your custom stylesheet (theme colors & layouts)
├── app.js                      # The interactive web application logic
├── data.json                   # The single source of truth for all text & metadata
├── yash_avatar.jpg             # Your profile picture
│
├── content/                    # Unified content repository
│   ├── projects/               # Research Project Folders
│   │   ├── flapping-wing-mav/
│   │   │   ├── content.md      # The long-form project markdown text
│   │   │   └── mav_flight.mp4  # Local video or images for the project
│   │   └── ...
│   │
│   └── blogs/                  # Blog / Note Folders
│       ├── koopman-theory-control/
│       │   └── content.md      # The blog post markdown text
│       └── ...
```

---

## 1. How to Edit Existing Content

To edit text, updates, publications, or layout details:
1. Open `/data.json` in VS Code (at the root of your project).
2. Edit the fields inside the JSON structure:
   - **Profile & Social Links**: Modify `siteData.profile`.
   - **CV/Experience, Education, Timeline**: Modify `cvData`.
   - **Projects Tiles & Metadata**: Modify `researchData.projects`.
   - **Publications List**: Modify `researchData.publications`.
   - **Blog Tiles & Metadata**: Modify `blogData.notes`.
3. To update long-form details, open the corresponding `content.md` file inside `/content/projects/<slug>/content.md` or `/content/blogs/<slug>/content.md` and edit the markdown.

---

## 2. How to Add a New Project or Blog Post

### Step A: Create the Folder and Markdown File
1. Under `/content/projects/` (for projects) or `/content/blogs/` (for blogs), create a new folder named after your post's slug (e.g. `nonlinear-observers`).
2. Inside that folder, create a file named exactly `content.md`.
3. Write your long-form article using standard Markdown and LaTeX (equations wrapped in `$` or `$$`).

### Step B: Declare the New Post in `data.json`
Open `/data.json` and append your new item to the end of the corresponding list:

#### For a Project:
Under `researchData.projects`:
```json
{
  "slug": "nonlinear-observers",
  "title": "Data-Driven Nonlinear Observer Design",
  "status": "Ongoing",
  "meta": "IIT-Hyderabad • 2026",
  "description": "Short card preview text shown on the home page.",
  "year": "2026",
  "tileMedia": "content/projects/nonlinear-observers/preview.jpg",
  "tags": ["Nonlinear Dynamics", "Data-driven Learning"]
}
```

#### For a Blog Post (Standard Markdown):
Under `blogData.notes`:
```json
{
  "slug": "nonlinear-observers",
  "title": "A Primer on Nonlinear Observers",
  "meta": "May 2026 • 8 min read",
  "description": "Short preview text of the blog article.",
  "tileMedia": "content/blogs/nonlinear-observers/thumbnail.jpg"
}
```

#### For a Blog Post (Direct iPad/Handwritten PDF):
Under `blogData.notes`, set `isPdf: true` and specify the `pdfUrl`:
```json
{
  "slug": "observer-pdf-notes",
  "title": "Mathematical Analysis of Observers",
  "meta": "May 2026 • Handwritten Notes",
  "description": "High-fidelity handwritten iPad exports analyzing observer convergence.",
  "isPdf": true,
  "pdfUrl": "https://yourusername.github.io/blog-data/observers.pdf",
  "tileMedia": "content/blogs/nonlinear-observers/thumbnail.jpg"
}
```

---

## 3. Local Development & Previewing Live

You can test and preview your changes live on your computer in two ways:

### Option A: VS Code Live Server (Fastest & Simplest)
Because our website is dynamic and compiles directly in the browser, you can open your repository root with **VS Code Live Server**:
1. Open the repository root directory in VS Code.
2. Click **Go Live** in the bottom status bar (or right-click `index.html` at the root and select **Open with Live Server**).
3. The website will render instantly.
4. Any changes you make to `data.json` or `content.md` files will be visible **immediately** when you refresh the browser!

### Option B: Vite Dev Server (Optional)
If you prefer running Vite:
1. Run `npm install` (once).
2. Run `npm run dev` to start Vite. It will serve your root files instantly.
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
GitHub Pages will serve your updated root folder instantly!
