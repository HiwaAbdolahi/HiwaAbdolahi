import fs from 'node:fs';

// Deterministic graphics: pinned repository trees, no external image service.
const data = JSON.parse(fs.readFileSync('data/profile-code-snapshot.json', 'utf8'));
const palette = {'C#':'#a6e7cd',Razor:'#d7c298',JavaScript:'#9cb9ec',CSS:'#b7a5dd',HTML:'#d89785'};
const categories = Object.keys(palette);
const counts = Object.fromEntries(categories.map(k => [k, data.files.filter(f => f.category === k).length]));
const total = data.files.length;
const text = (x,y,value,size=16,color='#a4b7b4',extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${value}</text>`;
const start = (w,h,title) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${title}</title><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#091b21"/><stop offset="1" stop-color="#112f34"/></linearGradient><radialGradient id="halo"><stop stop-color="#96f2cd" stop-opacity=".1"/><stop offset="1" stop-color="#96f2cd" stop-opacity="0"/></radialGradient></defs><style>text{font-family:Arial,Helvetica,sans-serif}.mono{font-family:monospace;letter-spacing:1.5px}.packet{stroke-dasharray:12 388;animation:packet 9s linear infinite}.pulse{animation:pulse 6s ease-in-out infinite}@keyframes packet{to{stroke-dashoffset:-800}}@keyframes pulse{0%,100%{opacity:.45}50%{opacity:1}}@media(prefers-reduced-motion:reduce){.packet,.pulse{animation:none}}</style><rect width="${w}" height="${h}" rx="24" fill="url(#bg)"/><rect x="1" y="1" width="${w-2}" height="${h-2}" rx="23" fill="none" stroke="#35504f"/>`;
const rule = (x,y,w) => `<path d="M${x} ${y}h${w}" stroke="#34504e"/>`;
function ring(cx,cy,r){
  const circum = Math.PI*2*r;
  let offset=0, svg=`<circle cx="${cx}" cy="${cy}" r="${r+32}" fill="url(#halo)"/><circle cx="${cx}" cy="${cy}" r="${r+32}" fill="none" stroke="#34504e" stroke-dasharray="1 9"/>`;
  for(const k of categories){
    const length = counts[k]/total*circum;
    svg+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${palette[k]}" stroke-width="21" stroke-dasharray="${length} ${circum-length}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset+=length;
  }
  return svg+text(cx,cy+6,total,69,'#f3efdf','text-anchor="middle" font-weight="700"')+text(cx,cy+37,'SOURCE FILES',11,'#a4b7b4','text-anchor="middle" class="mono"');
}
function legend(x,y){
  return categories.map((k,i)=>`<rect x="${x}" y="${y+i*38-13}" width="9" height="9" rx="2" fill="${palette[k]}"/>`+text(x+24,y+i*38,k,19,'#f3efdf')+text(x+280,y+i*38,String(counts[k]),19,'#f3efdf','text-anchor="end"')+text(x+350,y+i*38,(counts[k]/total*100).toFixed(1)+'%',15,'#a4b7b4','text-anchor="end"')).join('');
}
const short = ['SmartEnergy','Portfolio','HouseRental','AI Check-In'];
function repoCard(i,x,y,w=263){
  const row=data.rows[i];let pos=x+18;
  let s=`<rect x="${x}" y="${y}" width="${w}" height="112" rx="12" fill="#0a2026" stroke="#304b4b"/>`;
  s+=text(x+18,y+30,short[i],16,'#f3efdf','font-weight="700"');
  s+=text(x+18,y+61,`${row.total} source files`,15);
  for(const k of categories){const part=(row.counts[k]||0)/row.total*(w-36);if(part){s+=`<rect x="${pos}" y="${y+79}" width="${part}" height="7" fill="${palette[k]}"/>`;pos+=part;}}
  return s;
}
let s=start(1200,672,'Code anatomy — dated source-file inventory of four featured repositories');
s+=text(40,44,'CODE ANATOMY / SELECTED REPOSITORIES',12,'#96f2cd','class="mono"')+text(1160,44,data.date,12,'#a4b7b4','text-anchor="end" class="mono"');
s+=text(38,98,'A closer look at the code.',43,'#f3efdf','font-weight="700" letter-spacing="-1.5"');
s+=text(40,134,'A measured view of the source behind four featured projects.',19);
s+=ring(249,321,111)+text(490,199,'LANGUAGE / TEMPLATE',11,'#a4b7b4','class="mono"')+text(770,199,'FILES',11,'#a4b7b4','text-anchor="end" class="mono"')+text(840,199,'SHARE',11,'#a4b7b4','text-anchor="end" class="mono"')+legend(490,239);
s+=text(919,248,'4',62,'#f3efdf','font-weight="700"')+text(919,278,'REPOSITORIES',11,'#96f2cd','class="mono"')+text(919,322,'Pinned source trees.',15)+text(919,345,'Inspectable data.',15)+text(919,368,'No skill scores.',15);
s+=rule(40,462,1120);
for(let i=0;i<4;i++)s+=repoCard(i,40+i*286,482);
s+=text(40,629,'File counts, not lines of code or proficiency. See methodology for scope and exclusions.',14)+text(40,651,'Snapshot includes shared team-project code. Refresh from pinned repository trees; this is not live activity.',12);
s+='</svg>';fs.writeFileSync('assets/code-anatomy.svg',s);
s=start(640,1100,'Code anatomy — mobile source-file inventory');
s+=text(32,44,'CODE ANATOMY',12,'#96f2cd','class="mono"')+text(608,44,data.date,12,'#a4b7b4','text-anchor="end"');
s+=text(30,97,'A closer look at the code.',35,'#f3efdf','font-weight="700"');
s+=text(32,133,'Four featured repositories. A dated source snapshot.',17)+ring(320,300,111)+legend(141,487);
for(let i=0;i<4;i++)s+=repoCard(i,32+(i%2)*294,704+Math.floor(i/2)*132,282);
s+=text(32,1003,'File counts, not proficiency. Includes team-project code.',16)+text(32,1033,'Scope and exclusions are documented below the graphic.',16)+text(32,1063,'Snapshot, not live GitHub activity.',16);
s+='</svg>';fs.writeFileSync('assets/code-anatomy-mobile.svg',s);

// A documented interaction model, not measured production telemetry.
function node(x,y,w,title,subtitle,index){return `<rect x="${x}" y="${y}" width="${w}" height="115" rx="14" fill="#0b232a" stroke="#5a8c7b"/><circle cx="${x+26}" cy="${y+26}" r="4" fill="#96f2cd"/>`+text(x+42,y+31,index,11,'#96f2cd','class="mono"')+text(x+22,y+66,title,23,'#f3efdf','font-weight="700"')+text(x+22,y+94,subtitle,15);}
s=start(1200,490,'SmartEnergy message loop — dashboard, MQTT broker and .NET worker');
s+=text(40,42,'INSIDE SMARTENERGY / DOCUMENTED MESSAGE FLOW',12,'#96f2cd','class="mono"')+text(38,95,'One reading. A complete round trip.',38,'#f3efdf','font-weight="700"');
s+=text(40,134,'Example: 20.5°C → the worker publishes a heater ON command.',18);
s+=node(40,207,286,'Dashboard','HTML / JavaScript / Chart.js','01 / INTERFACE')+node(457,207,286,'MQTT broker','Eclipse Mosquitto','02 / MESSAGING')+node(874,207,286,'.NET worker','BackgroundService / MQTTnet','03 / LOGIC');
s+='<path d="M326 240H457M743 240H874" stroke="#96f2cd" fill="none"/><path d="M326 240H457M743 240H874" class="packet" stroke="#f0d6ab" stroke-width="3" fill="none"/><path d="M449 236L457 240 449 244M866 236L874 240 866 244" fill="none" stroke="#96f2cd"/>';
s+=text(391,215,'temperature',12,'#a4b7b4','text-anchor="middle"')+text(808,215,'deliver reading',12,'#a4b7b4','text-anchor="middle"');
s+='<path d="M874 294H743M457 294H326" stroke="#d7c298" fill="none"/><path d="M874 294H743M457 294H326" class="packet" stroke="#f3efdf" stroke-width="3" fill="none"/><path d="M751 290L743 294 751 298M334 290L326 294 334 298" fill="none" stroke="#d7c298"/>';
s+=text(391,347,'update interface',12,'#d7c298','text-anchor="middle"')+text(808,347,'heater command',12,'#d7c298','text-anchor="middle"');
s+=rule(40,382,1120)+text(40,418,'RUN LOCALLY',11,'#96f2cd','class="mono"')+text(40,450,'Docker Compose · three containers',17)+text(635,418,'DEPLOY TO AZURE',11,'#96f2cd','class="mono"')+text(635,450,'GitHub Actions → ACR → Container Apps',17);
s+='</svg>';fs.writeFileSync('assets/smartenergy-loop.svg',s);
console.log(JSON.stringify({total,counts,files:['code-anatomy.svg','code-anatomy-mobile.svg','smartenergy-loop.svg']}));
