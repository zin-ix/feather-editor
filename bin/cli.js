#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const command = args[0] || 'add';

const cwd = process.cwd();
const templateDir = resolve(__dirname, '../template');

function getComponentDest() {
  if (existsSync(join(cwd, 'src/components'))) return join(cwd, 'src/components');
  if (existsSync(join(cwd, 'components'))) return join(cwd, 'components');
  if (existsSync(join(cwd, 'src'))) return join(cwd, 'src/components');
  return join(cwd, 'components');
}

if (command === 'app' || command === 'template' || command === 'init-app') {
  const targetDir = resolve(cwd, args[1] || 'feather-editor-app');
  console.log(`\nCreating Feather Editor template project in ${targetDir}...\n`);

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  cpSync(templateDir, targetDir, { recursive: true });

  console.log(`Template created successfully.`);
  console.log(`\nNext steps:`);
  console.log(`  cd ${args[1] || 'feather-editor-app'}`);
  console.log(`  npx serve .\n`);
} else {
  // Default: Component installer for Vue
  const compDir = getComponentDest();
  const featherCompDir = join(compDir, 'feather-editor');

  console.log(`\nInstalling Feather Editor Vue component into ${featherCompDir}...\n`);

  if (!existsSync(featherCompDir)) {
    mkdirSync(featherCompDir, { recursive: true });
  }

  const srcComponents = join(templateDir, 'components/vue');
  cpSync(srcComponents, featherCompDir, { recursive: true });

  console.log(`Vue component installed to ${featherCompDir}:`);
  console.log(`  - FeatherEditor.vue (Vue 3 / Nuxt 3)`);
  console.log(`\nUsage in Vue / Nuxt:`);
  console.log(`  <script setup>`);
  console.log(`  import FeatherEditor from '@/components/feather-editor/FeatherEditor.vue';`);
  console.log(`  </script>`);
  console.log(`  <template>`);
  console.log(`    <FeatherEditor content="<p>Hello Vue!</p>" />`);
  console.log(`  </template>\n`);
}
