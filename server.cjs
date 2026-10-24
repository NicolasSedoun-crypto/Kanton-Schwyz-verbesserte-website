// Full local preview: run the built Worker and expose it on the familiar port.
// This loopback-only proxy supplies a local preview identity; it is never deployed.
const http=require('node:http');
const path=require('node:path');
const fs=require('node:fs');
const {spawn}=require('node:child_process');

const root=__dirname;
const publicPort=4184;
const workerPort=4185;
const localOrigins=new Set([`http://127.0.0.1:${publicPort}`,`http://localhost:${publicPort}`]);
const config=path.join(root,'dist','server','wrangler.json');
if(!fs.existsSync(config)){
 console.error('Build fehlt. Zuerst npm run build ausführen.');
 process.exit(1);
}

const worker=spawn(process.execPath,[
 '--import','./scripts/sites-env.mjs',
 './node_modules/wrangler/bin/wrangler.js','dev',
 '--config','dist/server/wrangler.json','--local',
 '--persist-to','.wrangler/state','--ip','127.0.0.1',
 '--port',String(workerPort),'--inspector-port','0'
],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});

let server,ready=false,logTail='';
function onOutput(chunk){
 logTail=(logTail+chunk.toString()).slice(-8000);
 if(!ready&&logTail.includes(`Ready on http://127.0.0.1:${workerPort}`)){
  ready=true;
  server=http.createServer((req,res)=>{
   const host=req.headers.host;
   if(host!==`127.0.0.1:${publicPort}`&&host!==`localhost:${publicPort}`){res.writeHead(403);return res.end('Nur lokale Vorschau.');}
   if(req.headers.origin&&!localOrigins.has(req.headers.origin)){res.writeHead(403);return res.end('Ungültiger Ursprung.');}
   const headers={...req.headers,host:`127.0.0.1:${workerPort}`,
    'oai-authenticated-user-id':'local-preview-user',
    'oai-authenticated-user-email':'preview@localhost.invalid'};
   if(req.headers.origin)headers.origin=`http://127.0.0.1:${workerPort}`;
   const upstream=http.request({hostname:'127.0.0.1',port:workerPort,path:req.url,method:req.method,headers},response=>{
    res.writeHead(response.statusCode||502,response.headers);response.pipe(res);
   });
   upstream.on('error',()=>{if(!res.headersSent)res.writeHead(502);res.end('Lokaler Entwicklungsserver nicht erreichbar.');});
   req.pipe(upstream);
  }).listen(publicPort,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${publicPort} (mit Anmeldung und Entwürfen)`));
 }
}
worker.stdout.on('data',onOutput);
worker.stderr.on('data',onOutput);
worker.on('exit',code=>{if(!ready)console.error(`Worker konnte nicht starten (${code}). ${logTail.slice(-1200)}`);server?.close();process.exit(code||1)});
const startup=setTimeout(()=>{if(!ready){console.error(`Worker-Start dauerte zu lange. ${logTail.slice(-1200)}`);worker.kill();process.exit(1)}},45000);
worker.on('exit',()=>clearTimeout(startup));
process.on('SIGINT',()=>{server?.close();worker.kill();process.exit(0)});
process.on('SIGTERM',()=>{server?.close();worker.kill();process.exit(0)});
