const fs = require('fs');
const path = require('path');

const standaloneDir = path.join(__dirname, '..', '.next', 'standalone');
const rootPublic = path.join(__dirname, '..', 'public');
const rootNextStatic = path.join(__dirname, '..', '.next', 'static');

const standalonePublic = path.join(standaloneDir, 'public');
const standaloneNextStatic = path.join(standaloneDir, '.next', 'static');

function linkOrCopy(src, dest) {
  if (!fs.existsSync(src)) return;

  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }

  try {
    fs.symlinkSync(src, dest, 'junction');
    console.log(`[post-build] Linked ${src} -> ${dest}`);
  } catch (error) {
    console.log(`[post-build] Symlink failed for ${dest}, falling back to copy.`);
    fs.cpSync(src, dest, { recursive: true });
    console.log(`[post-build] Copied ${src} -> ${dest}`);
  }
}

const standaloneNextDir = path.join(standaloneDir, '.next');
if (!fs.existsSync(standaloneNextDir)) {
  fs.mkdirSync(standaloneNextDir, { recursive: true });
}

const rootUploads = path.join(rootPublic, 'uploads');
if (!fs.existsSync(rootUploads)) {
  fs.mkdirSync(rootUploads, { recursive: true });
}

linkOrCopy(rootPublic, standalonePublic);
linkOrCopy(rootNextStatic, standaloneNextStatic);

console.log('[post-build] Standalone public and static setup complete.');
