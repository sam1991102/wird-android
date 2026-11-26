// قفل TypeScript: بيفحص كود الواجهة بـ tsc (checkJs) من غير ما نحوّل الملفات، ويوقف البناء لو لقى غلطة من الأنواع اللي غالبًا بتبقى bug حقيقي:
// اسم مش معرّف، اسم مكتوب غلط، عدد معاملات غلط، مقارنة مستحيلة، إسناد لدالة، تعريف مكرر.
// أخطاء DOM العامة (زي .value على Element) مش بنوقف عليها لأنها كتير ومش أخطاء فعلية.
//   node ts-lint.mjs        ← فحص
//   node ts-lint.mjs --gen  ← تحديث types/globals.d.ts من كل window.X= في الكود
import fs from 'fs';import { execFileSync } from 'child_process';
const here=new URL('.',import.meta.url).pathname,M=JSON.parse(fs.readFileSync(here+'manifest.json','utf8'));
const files=['site/data.js','site/app.js',...M.ui.map(f=>'ui/'+f)];
if(process.argv.includes('--gen')){
 const declared=new Set(),names=new Set();
 for(const f of ['site/data.js','site/app.js'])for(const x of fs.readFileSync(here+f,'utf8').matchAll(/(?:^|[;{}\s])(?:function\s+|(?:const|let|var)\s+)([A-Za-z_$][\w$]*)/g))declared.add(x[1]);
 for(const f of files)for(const x of fs.readFileSync(here+f,'utf8').matchAll(/window\.([A-Za-z_$][\w$]*)\s*=(?!=)/g))if(!declared.has(x[1]))names.add(x[1]);
 names.add('__wirdNative');names.add('Capacitor');
 fs.writeFileSync(here+'types/globals.d.ts','/* أنواع عامة لقفل TypeScript (ts-lint.mjs). مولّد: node ts-lint.mjs --gen */\ninterface Window { [k: string]: any }\n'+[...names].sort().map(n=>'declare var '+n+': any;').join('\n')+'\n');
 console.log('globals.d.ts:',names.size);process.exit(0)}
const SERIOUS=new Set(['2304','2552','2551','2554','2555','2367','2630','2300','2451','2448','2454','2588','1005','1128']);
const tsc=process.env.TSC||'tsc';let out='';
try{execFileSync(tsc,['--allowJs','--checkJs','--noEmit','--target','es2022','--lib','es2022,dom,dom.iterable','--skipLibCheck','types/globals.d.ts',...files],{cwd:here,encoding:'utf8',stdio:['ignore','pipe','pipe']})}catch(e){out=(e.stdout||'')+(e.stderr||'');if(!out)throw e}
const errs=out.split('\n').filter(l=>{const m=l.match(/error TS(\d+)/);return m&&SERIOUS.has(m[1])});
const all=(out.match(/error TS/g)||[]).length;
if(errs.length){console.error('أخطاء TypeScript حقيقية ('+errs.length+'):\n'+errs.join('\n'));process.exit(1)}
console.log('مفيش أخطاء TypeScript حقيقية | تحذيرات DOM عامة (مش بتوقف): '+all);
