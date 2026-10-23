import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
// A shared content version keeps module entry points and their static imports in sync.
export function versionModules(root) {
 const names=fs.readdirSync(root).filter(n=>n.endsWith('.js')).sort();
 const originals=new Map(names.map(n=>[n,fs.readFileSync(path.join(root,n),'utf8')]));
 const version=createHash('sha256').update([...originals].map(([n,s])=>n+'\0'+s).join('\0')).digest('hex').slice(0,12);
 for(const [name,source] of originals){
  const result=source.replace(/(\bfrom\s*|\bimport\s*)(["'])(\.\/[^"'?]+\.js)\2/g,(m,p,q,file)=>originals.has(file.slice(2))?`${p}${q}${file}?v=${version}${q}`:m);
  fs.writeFileSync(path.join(root,name),result);
 }
 const visit=dir=>{
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
   const file=path.join(dir,entry.name);
   if(entry.isDirectory())visit(file);
   else if(entry.name.endsWith('.html')){
    const html=fs.readFileSync(file,'utf8').replace(/src="\/([^"/?]+\.js)"/g,(m,name)=>originals.has(name)?`src="/${name}?v=${version}"`:m);
    fs.writeFileSync(file,html);
   }
  }
 };
 visit(root);
 return version;
}
