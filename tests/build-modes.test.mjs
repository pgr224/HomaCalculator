import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

test('isolated private and public builds set the correct metadata and sitemap',async()=>{
 const fixture=await mkdtemp(path.join(tmpdir(),'endocalc-build-'));
 try{
  for(const dir of ['src','scripts','public'])await cp(new URL(`../${dir}`,import.meta.url),path.join(fixture,dir),{recursive:true});
  for(const [siteUrl,indexable]of [['https://homacalculator.com','false'],['https://www.homacalculator.com/','true']]){
   execFileSync(process.execPath,['scripts/build.mjs'],{cwd:fixture,env:{...process.env,SITE_URL:siteUrl,SITE_INDEXABLE:indexable},stdio:'pipe'});
   const html=await readFile(path.join(fixture,'dist/index.html'),'utf8');const origin=new URL(siteUrl).origin;
   assert.ok(html.includes(`rel="canonical" href="${origin}/"`));
   assert.ok(html.includes(`name="robots" content="${indexable==='true'?'index,follow':'noindex,follow'}"`));
   const xml=await readFile(path.join(fixture,'dist/sitemap.xml'),'utf8');for(const [,loc]of xml.matchAll(/<loc>(.*?)<\/loc>/g))assert.equal(new URL(loc).origin,origin);
  }
  assert.throws(()=>execFileSync(process.execPath,['scripts/build.mjs'],{cwd:fixture,env:{...process.env,SITE_URL:'http://homacalculator.com',SITE_INDEXABLE:'true'},stdio:'pipe'}),/Command failed/);
 }finally{await rm(fixture,{recursive:true,force:true});}
});
