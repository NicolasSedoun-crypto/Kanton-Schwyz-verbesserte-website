import fs from 'node:fs/promises';
const html=await fs.readFile('public/index.html','utf8');
await fs.writeFile('app/portal-html.ts','// Generated from public/index.html by scripts/prepare-portal.mjs\nexport const pageHtml='+JSON.stringify(html)+';\n');
