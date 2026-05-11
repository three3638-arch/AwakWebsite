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
      
      // Max Width
      content = content.replace(/\bmax-w-7xl\b/g, 'max-w-[1600px] w-full');
      content = content.replace(/\bmax-w-6xl\b/g, 'max-w-[1600px] w-full');
      content = content.replace(/\bmax-w-5xl\b/g, 'max-w-[1600px] w-full');
      content = content.replace(/\bmax-w-screen-xl\b/g, 'max-w-[1600px] w-full');
      
      // Padding
      content = content.replace(/\bpy-32\b/g, 'py-0');
      content = content.replace(/\bpy-24\b/g, 'py-0');
      content = content.replace(/\bpy-20\b/g, 'py-0');
      content = content.replace(/\bpy-16\b/g, 'py-0');
      content = content.replace(/\bpt-32\b/g, 'pt-0');
      content = content.replace(/\bpt-24\b/g, 'pt-0');
      content = content.replace(/\bpt-20\b/g, 'pt-0');
      content = content.replace(/\bpt-16\b/g, 'pt-0');
      content = content.replace(/\bpb-32\b/g, 'pb-0');
      content = content.replace(/\bpb-24\b/g, 'pb-0');
      content = content.replace(/\bpb-20\b/g, 'pb-0');
      content = content.replace(/\bpb-16\b/g, 'pb-0');
      
      // Gap
      content = content.replace(/\bgap-32\b/g, 'gap-0');
      content = content.replace(/\bgap-24\b/g, 'gap-0');
      content = content.replace(/\bgap-20\b/g, 'gap-0');
      content = content.replace(/\bgap-16\b/g, 'gap-0');
      content = content.replace(/\bgap-12\b/g, 'gap-0');
      
      // Responsive Gap overrides
      content = content.replace(/\bxl:gap-32\b/g, 'xl:gap-0');
      content = content.replace(/\bxl:gap-24\b/g, 'xl:gap-0');
      content = content.replace(/\blg:gap-24\b/g, 'lg:gap-0');
      content = content.replace(/\blg:gap-16\b/g, 'lg:gap-0');
      content = content.replace(/\blg:gap-12\b/g, 'lg:gap-0');
      content = content.replace(/\bmd:gap-16\b/g, 'md:gap-0');
      content = content.replace(/\bmd:gap-12\b/g, 'md:gap-0');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('./src/components');
processDir('./src/pages');
console.log('Global Layout applied.');
