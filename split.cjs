const fs = require('fs');

let data = fs.readFileSync('src/data.ts', 'utf8');

function extractMarkdown(slug, isBlog = false) {
    const slugRegex = new RegExp(`slug:\\s*["']${slug}["'][\\s\\S]*?markdownContent:\\s*\`([\\s\\S]*?)\`,`);
    const match = data.match(slugRegex);
    if (match) {
        const mdContent = match[1].trim();
        const dir = isBlog ? `src/content/blogs/${slug}` : `src/content/projects/${slug}`;
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/content.md`, mdContent);
        
        // Replace in data.ts
        const replacement = `markdownContent: ${slug.replace(/-/g, '_')}Content,`;
        data = data.replace(match[0], match[0].replace(match[1], '').replace('``', '').replace(/markdownContent:\s*,/, replacement));
        
        // Add import at top
        const importStatement = `import ${slug.replace(/-/g, '_')}Content from './content/${isBlog ? 'blogs' : 'projects'}/${slug}/content.md?raw';\n`;
        data = importStatement + data;
    }
}

['flapping-wing-mav', 'koopman-control', 'complex-aero-stability'].forEach(s => extractMarkdown(s, false));
['koopman-theory-control', 'unsteady-aero-flapping', 'sindy-system-identification'].forEach(s => extractMarkdown(s, true));

fs.writeFileSync('src/data.ts', data);
console.log("Extraction complete.");
