// Reuses an existing Quarry upload tree; never creates a new full-site copy.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import cp from 'node:child_process';
const base = 'D:/Projects/hidden reef header';
const repo = `${base}/releases/quarry-parity-20261001`;
const work = `${base}/work`;
const deploy = process.argv.includes('--deploy');
if (process.argv.slice(2).some(a => !['--deploy', '--check'].includes(a))) throw Error('Use --check or --deploy');
const lock = `${work}/quarry-deployment.lock`;
const fd = fs.openSync(lock, 'wx');
const run = (cmd, args) => {
  const result = cp.spawnSync(cmd, args, {cwd:repo, encoding:'utf8', maxBuffer:32*1024*1024});
  if (result.error || result.status !== 0) throw Error(result.stderr || result.error || `${cmd} failed`);
  return result.stdout;
};
const git = (...args) => run('git', args).trim();
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
try {
  fs.writeFileSync(fd, JSON.stringify({pid:process.pid, started:new Date().toISOString()}));
  const active = run('powershell', ['-NoProfile','-Command', "@(Get-CimInstance Win32_Process | Where-Object {$_.Name -eq 'node.exe' -and $_.CommandLine -match 'deploy_jez237_pages|pages deploy'}).Count"]).trim();
  if (active !== '0') throw Error('Another deployment is active');
  if (git('status','--porcelain')) throw Error('Website checkout must be clean');
  if (deploy) git('fetch','origin','main');
  const commit = git('rev-parse','HEAD');
  if (commit !== git('rev-parse','origin/main')) throw Error('Fetch and fast-forward to current main first');
  const stages = fs.readdirSync(work,{withFileTypes:true}).filter(e => e.isDirectory() && /^quarry-.*-public-/.test(e.name))
    .map(e => path.join(work,e.name)).filter(p => ['index.html','_headers','games'].every(f => fs.existsSync(path.join(p,f))) && !fs.existsSync(path.join(p,'.git')))
    .sort((a,b) => fs.statSync(b).birthtimeMs-fs.statSync(a).birthtimeMs);
  const stage=stages[0];
  if (!stage) throw Error('No existing staging folder; refusing to create a new full-site copy');
  const excluded = new Set(['.claude','.github','.wrangler','functions','scripts','stock-market-src','tmp','workers','ops']);
  const excludedFiles = new Set(['package.json','package-lock.json','pnpm-lock.yaml','yarn.lock','wrangler.toml']);
  const files = run('git',['ls-files','-z']).split('\0').filter(f => f && !excluded.has(f.split('/')[0]) && !excludedFiles.has(f) && !f.startsWith('experiments/image-gen-2-benchmark/__pycache__/'));
  const wanted=new Set(files), changed=[], stale=[];
  function scan(dir, prefix='') {
    for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
      const relative=prefix+e.name, full=path.join(dir,e.name);
      if (e.isSymbolicLink()) throw Error(`Refusing linked staging entry: ${full}`);
      if (e.isDirectory()) scan(full, relative+'/');
      else if (!wanted.has(relative)) stale.push(relative);
    }
  }
  scan(stage);
  for (const f of files) {
    const src=path.join(repo,f), dst=path.join(stage,f);
    if (!fs.lstatSync(src).isFile()) throw Error(`Non-file source: ${f}`);
    if (!fs.existsSync(dst) || fs.statSync(dst).size!==fs.statSync(src).size || hash(src)!==hash(dst)) changed.push(f);
  }
  for (const f of ['experiments/amiga-mod-player/audio/Alien_Breed_II/01_intro.mp3','experiments/amiga-mod-player/mods/4-Mat/a_city_at_night.mod','experiments/sid-player/sids/Ass_It/Fist_2.sid']) if (!wanted.has(f)) throw Error(`Missing public media: ${f}`);
  console.log(JSON.stringify({mode:deploy?'deploy':'check',stage,commit,files:files.length,changed:changed.length,stale:stale.length,newFullSiteCopies:0}));
  if (deploy) {
    for (const f of stale) fs.rmSync(path.join(stage,f));
    // The mandatory wrapper rebuilds Functions; it rejects any prior Worker.
    fs.rmSync(path.join(stage,'_worker.js'),{recursive:true,force:true});
    for (const f of changed) {
      const dst=path.join(stage,f);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(path.join(repo,f),dst);
    }
    if (git('status','--porcelain') || git('rev-parse','HEAD')!==commit) throw Error('Checkout changed while synchronizing');
    const result=cp.spawnSync(process.execPath,['scripts/deploy_jez237_pages.mjs',stage],{cwd:repo,stdio:'inherit'});
    if (result.error || result.status!==0) throw Error('Publication failed; retain the reusable stage and backup for recovery');
    process.stdout.write(run('powershell',['-NoProfile','-File',`${base}/quarry-storage-cleanup.ps1`]));
    fs.writeFileSync(`${work}/quarry-last-successful-deploy.json`,JSON.stringify({commit,stage,finished:new Date().toISOString()},null,2));
  }
} finally { fs.closeSync(fd);fs.unlinkSync(lock); }
