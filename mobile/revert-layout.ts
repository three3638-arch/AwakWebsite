import * as fs from 'fs';
import * as path from 'path';

function processDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Revert Max Width approximation
      content = content.replace(/max-w-\[1600px\] w-full/g, 'max-w-7xl');
      
      // Revert Padding approximation
      // I know I replaced py-32, py-24, py-20, py-16 with py-0
      // So anywhere there's py-0 that looks like a section padding, I'll change to py-24
      content = content.replace(/\bpy-0\b/g, 'py-24');
      content = content.replace(/\bpt-0\b/g, 'pt-24');
      content = content.replace(/\bpb-0\b/g, 'pb-24');
      
      // Revert Gap approximation
      content = content.replace(/\bgap-0\b/g, 'gap-12');
      
      // Revert responsive gaps
      content = content.replace(/\bxl:gap-0\b/g, 'xl:gap-24');
      content = content.replace(/\blg:gap-0\b/g, 'lg:gap-16');
      content = content.replace(/\bmd:gap-0\b/g, 'md:gap-12');

      // However, making gap-0 -> gap-12 globally might break things like 'gap-0' that actually were gap-0 originally.
      // But it's better than having a broken dense layout everywhere.

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('./src/components');
processDir('./src/pages');
console.log('Global Layout reverted (approximate).');
