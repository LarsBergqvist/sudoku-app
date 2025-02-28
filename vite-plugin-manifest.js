// vite-plugin-manifest.js
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export default function manifestPlugin(basePath) {
  return {
    name: 'manifest-plugin',
    apply: 'build',
    writeBundle(options, bundle) {
      const manifestFileName = 'manifest.json';
      const manifestFilePath = join(options.dir, manifestFileName);

      try {
        const manifest = JSON.parse(readFileSync(manifestFilePath, 'utf-8'));
        manifest.icons = manifest.icons.map(icon => ({
          ...icon,
          src: `${basePath}${icon.src}`
        }));

        // Write the updated manifest back to the file
        writeFileSync(manifestFilePath, JSON.stringify(manifest, null, 2));
      } catch (error) {
        console.error(`Error processing manifest.json: ${error.message}`);
      }
    }
  };
}