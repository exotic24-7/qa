// write_base64.js
// Usage: node write_base64.js output.png < base64.txt
// Reads base64 data from stdin and writes the decoded bytes to the specified file.

const fs = require('fs');
const path = require('path');

if(process.argv.length < 3){
  console.error('Usage: node write_base64.js output.png < base64.txt');
  process.exit(2);
}

const out = process.argv[2];
let buf = Buffer.alloc(0);
process.stdin.on('data', c => { buf = Buffer.concat([buf, Buffer.from(c)]); });
process.stdin.on('end', ()=>{
  let s = buf.toString('utf8').trim();
  // strip data URL prefix if present
  s = s.replace(/^data:\w+\/[\w+\-\.]+;base64,/, '');
  try{
    const bytes = Buffer.from(s, 'base64');
    const dir = path.dirname(out);
    try{ fs.mkdirSync(dir, { recursive: true }); }catch(e){}
    fs.writeFileSync(out, bytes);
    console.log('Wrote', out, '(', bytes.length, 'bytes )');
  }catch(e){ console.error('Failed to decode/write base64:', e.message); process.exit(1); }
});
process.stdin.resume();
