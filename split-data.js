const fs = require('fs');

let data = fs.readFileSync('src/data.ts', 'utf8');

// The best way without breaking the app is to instruct the user that the folders have been created and the structure is ready for future posts, OR we can just write the content to these folders right now.
