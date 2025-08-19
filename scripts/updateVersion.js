import fs from 'fs';
import path from 'path';

/**
 * 一括でバージョンを更新する関数
 * @param {string} version 新しいバージョン
 */
export function updateVersion(version) {
  if (!version) {
    throw new Error('version is required');
  }

  // package.json
  const packageJsonPath = path.resolve('package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('package.json updated');

  // tauri.conf.json
  const tauriConfPath = path.resolve('src-tauri/tauri.conf.json');
  const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
  tauriConf.version = version; // トップレベルの version を直接更新
  fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));
  console.log('tauri.conf.json updated');

  // Cargo.toml
  const cargoTomlPath = path.resolve('src-tauri/Cargo.toml');
  let cargoContent = fs.readFileSync(cargoTomlPath, 'utf8');
  // [package] セクション内の version を置換
  cargoContent = cargoContent.replace(
    /(\[package\][\s\S]*?version\s*=\s*")([^"]+)(")/,
    `$1${version}$3`
  );
  fs.writeFileSync(cargoTomlPath, cargoContent);
  console.log('Cargo.toml updated');
}

// CLI対応
if (process.argv[1].endsWith('updateVersion.js')) {
  const versionArg = process.argv[2];
  if (!versionArg) {
    console.error('Usage: node updateVersion.js <version>');
    process.exit(1);
  }
  updateVersion(versionArg);
}
