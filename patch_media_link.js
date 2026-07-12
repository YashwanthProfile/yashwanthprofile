const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(
  /flex: 1 1 auto !important; \/\* Take up majority of the space \*\/\n\s*height: 0 !important; \/\* Allow flex to size it \*\/\n\s*display: flex !important;/g,
  'flex: none !important;\n  height: auto !important;\n  aspect-ratio: 16 / 10 !important;\n  display: block !important;'
);
fs.writeFileSync('src/index.css', css);
