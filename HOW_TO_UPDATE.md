# How to Update Content

Welcome to your personal portfolio and blog! The content of this website is organized to make it easy for you to update, append, or change data.

## Directory Structure

Your text content (markdown) is in `src/content/`, and your assets (images, PDFs) are in `public/`.
We have structured it so that each project and blog has its own folder.

```
src/
├── content/
│   ├── projects/
│   │   ├── flapping-wing-mav/
│   │   │   └── content.md      # The long-form markdown article
│   │   └── ...
│   └── blogs/
│       ├── koopman-theory-control/
│       │   └── content.md      # Markdown content
│       └── ...
└── data.ts                     # Global site metadata, tiles, and links

public/
├── projects/
│   ├── flapping-wing-mav/
│   │   └── my-image.jpg        # Place your images/videos for this project here
│   └── ...
├── blogs/
│   ├── koopman-theory-control/
│   │   └── note.pdf            # Place your PDFs/images for this blog here
│   └── ...
└── yash_avatar.jpg             # Global profile picture
```

## How to edit existing Projects & Blogs

1. **Text**: Open `src/content/projects/<project-slug>/content.md` or `src/content/blogs/<blog-slug>/content.md` and edit the markdown.
2. **Assets**: Drop your images or PDFs into the corresponding folder in `public/projects/<project-slug>/` or `public/blogs/<blog-slug>/`.
3. **Data**: Open `src/data.ts` to update the metadata (title, dates, links).

## How to add a new Project or Blog Post

1. **Create Text Folder**: Create a new folder in `src/content/projects/` or `src/content/blogs/` (e.g., `my-new-post`).
2. **Write Content**: Inside that folder, create `content.md` and write your article.
3. **Create Assets Folder**: Create a corresponding folder in `public/projects/my-new-post/` (or `public/blogs/my-new-post/`) and drop your media and PDFs there.
4. **Link Content**: Open `src/data.ts`.
5. Add an import statement at the top of the file:
   ```ts
   import myNewPostContent from './content/blogs/my-new-post/content.md?raw';
   ```
6. Add the metadata to `researchData.projects` (for projects) or `blogData.notes` (for blogs), and set `markdownContent: myNewPostContent`.
7. Link your images and PDFs using paths like `/blogs/my-new-post/image.jpg` or `/projects/my-new-post/video.mp4`. Example:
   ```ts
   tileMedia: "/blogs/my-new-post/image.jpg",
   pdfUrl: "/blogs/my-new-post/document.pdf",
   ```

## Updating your Bio, Experience, and Publications

Open `src/data.ts`. This file contains:
- `siteData`: Your profile, tagline, avatar path, and social links.
- `cvData`: Your education, experience, timeline updates, and CV download link.
- `researchData.publications`: Your list of publications.

## Updating Colors and Fonts

Open `src/index.css`.
- Scroll to the `:root` section at the very top.
- You can change the CSS variables for colors (e.g., `--bg`, `--accent-strong`, `--ink`).
- To change the font, update the `--font-sans` and `--font-mono` variables in the `@theme` block.
