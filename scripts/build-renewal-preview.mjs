import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const component = await readFile(path.join(root, 'src/components/RenewalTracker.astro'), 'utf8');
const markup = component.replace(/^---[\s\S]*?---\s*/, '').replace(/<script>[\s\S]*?<\/script>\s*$/, '');
const css = await readFile(path.join(root,'src/styles/renewal-tracker.css'),'utf8');
const logic = (await readFile(path.join(root,'src/lib/renewal-tracker.js'),'utf8')).replace(/^export /gm,'');
const ui = (await readFile(path.join(root,'src/lib/renewal-tracker-ui.js'),'utf8')).replace(/^import .*?;\s*/,'').replace(/^export /gm,'');
const script = `${logic}\n${ui}\nstartTracker(document.getElementById('renewal-tracker'));`;
const fonts = [
  ['Cormorant Garamond','@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2','normal',400],
  ['Cormorant Garamond','@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2','italic',400],
  ['Jost','@fontsource/jost/files/jost-latin-400-normal.woff2','normal',400],
  ['Jost','@fontsource/jost/files/jost-latin-700-normal.woff2','normal',700],
];
let fontCSS = '';
for(const [family,relative,style,weight] of fonts) fontCSS += `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};src:url(data:font/woff2;base64,${(await readFile(path.join(root,'node_modules',relative))).toString('base64')}) format('woff2');font-display:swap;}\n`;
const standalone = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Software Renewal Tracker · Cloud & Capital</title><style>${fontCSS}\nbody{margin:0} ${css}\n.renewal-tracker{padding-top:3rem}</style></head><body>${markup}<script>${script}</script></body></html>\n`;
await mkdir(path.join(root,'prototype'),{recursive:true});
await writeFile(path.join(root,'prototype/software-renewal-tracker.html'),standalone);
// The inline review is generated from the same markup, rules and interactions.
// Browser storage/downloads depend on host permissions; failures are shown in UI.
const fragment = `<style>@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Jost:wght@400;500&display=swap');\n${css}\n#renewal-tracker{padding-top:2rem}</style>\n${markup}<script>${script}</script>\n`;
if(process.argv[2]) await writeFile(process.argv[2],fragment);
console.log('Standalone prototype generated from the website component.');
