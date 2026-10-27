// Generates public/favicon.ico (32x32 PNG-in-ICO) matching favicon.svg:
// rounded teal square (#005a71) with a white ECG pulse line.
// No dependencies — rasterizes at 4x then downsamples, writes PNG via zlib.
import {writeFile} from 'node:fs/promises';
import {deflateSync} from 'node:zlib';

const S=128, OUT=32, SCALE=S/OUT;
const BG=[0x00,0x5a,0x71], FG=[0xff,0xff,0xff];
const R=9/40*S; // corner radius
const HALF_W=2.5/40*S/2; // half stroke width

// Pulse path from favicon.svg: M5 20h8l3-10 7 20 3-10h9 (scaled to S)
const k=S/40, pts=[[5,20],[13,20],[16,10],[23,30],[26,20],[35,20]].map(([x,y])=>[x*k,y*k]);

function insideRoundedRect(x,y){
  const cx=Math.min(Math.max(x,R),S-R), cy=Math.min(Math.max(y,R),S-R);
  return (x-cx)**2+(y-cy)**2<=R*R || (x>=R&&x<S-R&&y>=0&&y<S) || (y>=R&&y<S-R&&x>=0&&x<S);
}
function distToSeg(px,py,[ax,ay],[bx,by]){
  const dx=bx-ax, dy=by-ay, t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)));
  return Math.hypot(px-(ax+t*dx), py-(ay+t*dy));
}
function onStroke(x,y){
  for(let i=0;i<pts.length-1;i++) if(distToSeg(x,y,pts[i],pts[i+1])<=HALF_W) return true;
  return pts.some(([px,py])=>Math.hypot(x-px,y-py)<=HALF_W);
}

// Render at S×S with coverage, downsample to OUT×OUT RGBA
const img=Buffer.alloc(OUT*OUT*4);
for(let oy=0;oy<OUT;oy++)for(let ox=0;ox<OUT;ox++){
  let bg=0,fg=0,n=SCALE*SCALE;
  for(let sy=0;sy<SCALE;sy++)for(let sx=0;sx<SCALE;sx++){
    const x=ox*SCALE+sx+.5, y=oy*SCALE+sy+.5;
    if(onStroke(x,y)) fg++; else if(insideRoundedRect(x,y)) bg++;
  }
  const o=(oy*OUT+ox)*4;
  for(let c=0;c<3;c++) img[o+c]=Math.round((FG[c]*fg+BG[c]*bg)/n);
  img[o+3]=Math.round(255*(fg+bg)/n);
}

// ---- minimal PNG encoder ----
const crcTable=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
const crc32=buf=>~buf.reduce((c,b)=>(c>>>8)^crcTable[(c^b)&255],-1)>>>0;
function chunk(type,data){
  const len=Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td=Buffer.concat([Buffer.from(type),data]);
  const crc=Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len,td,crc]);
}
const ihdr=Buffer.alloc(13);
ihdr.writeUInt32BE(OUT,0); ihdr.writeUInt32BE(OUT,4);
ihdr[8]=8; ihdr[9]=6; // 8-bit RGBA
const raw=Buffer.alloc(OUT*(OUT*4+1));
for(let y=0;y<OUT;y++){ raw[y*(OUT*4+1)]=0; img.copy(raw,y*(OUT*4+1)+1,y*OUT*4,(y+1)*OUT*4); }
const png=Buffer.concat([
  Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]),
  chunk('IHDR',ihdr), chunk('IDAT',deflateSync(raw)), chunk('IEND',Buffer.alloc(0)),
]);

// ---- ICO container with single PNG entry ----
const header=Buffer.alloc(6); header.writeUInt16LE(1,2); header.writeUInt16LE(1,4);
const entry=Buffer.alloc(16);
entry[0]=OUT; entry[1]=OUT; entry[3]=0; entry.writeUInt16LE(1,4); entry.writeUInt16LE(32,6);
entry.writeUInt32LE(png.length,8); entry.writeUInt32LE(22,12);
await writeFile('public/favicon.ico',Buffer.concat([header,entry,png]));
console.log('Wrote public/favicon.ico (%d bytes)',22+png.length);
