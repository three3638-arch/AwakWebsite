import fs from 'fs';

let content = fs.readFileSync('src/pages/StorePage.tsx', 'utf-8');

// Helper to replace precisely
function replaceSection(startStr, endStr, replacement) {
    const startObj = content.indexOf(startStr);
    const endObj = content.indexOf(endStr, startObj);
    if (startObj !== -1 && endObj !== -1) {
        content = content.substring(0, startObj) + replacement + content.substring(endObj + endStr.length);
    }
}

// 1. Delete [设计哲学：消失在指尖，存在于数据] 整个模块 (SECTION 2: PRODUCT STORY)
const section2Start = content.indexOf('{/* SECTION 2: PRODUCT STORY (REWRITTEN) */}');
const section4Start = content.indexOf('{/* SECTION 4: IN THE BOX (REWRITTEN) */}');
if (section2Start > -1 && section4Start > -1) {
    content = content.substring(0, section2Start) + content.substring(section4Start);
}

// 2. Delete [完整你的生态 COMPLETE YOUR ECOSYSTEM] (SECTION 8: ACCESSORIES)
const section8Start = content.indexOf('{/* SECTION 8: ACCESSORIES */}');
const section9Start = content.indexOf('{/* SECTION 9: FAQ */}'); // Search specifically
if (section8Start > -1 && section9Start > -1) {
    content = content.substring(0, section8Start) + content.substring(section9Start);
}

// 3. Remove Title Strings ONLY
content = content.replace(/<span className="[^"]*">健康能力 HEALTH METRICS<\/span>/g, '');
content = content.replace(/<span className="[^"]*">传感器矩阵 SENSOR MATRIX<\/span>/g, '');
content = content.replace(/<span className="[^"]*">完整规格 FULL SPECIFICATIONS<\/span>/g, '');
content = content.replace(/<span className="[^"]*">真实改变 REAL CHANGE<\/span>/g, '');
content = content.replace(/<span className="[^"]*">同系列产品 COMPLETE THE COLLECTION<\/span>/g, '');
content = content.replace(/<span className="[^"]*">完整你的生态 COMPLETE YOUR ECOSYSTEM<\/span>/g, ''); // in case it is still there

// 4. Move "与 AWAK Ring 完美搭配" (SECTION 12) below "90天后" (SECTION 7 Data Comparison)
const sec12Start = content.indexOf('{/* SECTION 12: YOU MAY ALSO LIKE */}');
const cartOverlayStart = content.indexOf('{/* MODULE 01: 核心价值 */}'); 
if (sec12Start > -1 && cartOverlayStart > -1) {
    let sec12Content = content.substring(sec12Start, cartOverlayStart);
    content = content.substring(0, sec12Start) + content.substring(cartOverlayStart);

    // Change styles of sec12Content (white bg, black text)
    sec12Content = sec12Content
        .replace(/bg-\[#080808\]/g, 'bg-white')
        .replace(/text-white/g, 'text-black')
        .replace(/border-white\/5/g, 'border-black/5')
        .replace(/bg-\[#111\]/g, 'bg-[#F9F9F9]')
        .replace(/text-\[#C8FF00\]/g, 'text-[#000000] font-bold') // user wants clean look, changed green texts to bold black if possible
        .replace(/bg-\[#1A1A1A\]/g, 'bg-[#EAEAEA]');
        
    // Specifically make buttons have routing placeholders
    sec12Content = sec12Content.replace(/<button([^>]*)>查看详情<\/button>/g, '<button onClick={() => navigate("#")} $1>查看详情</button>');
    sec12Content = sec12Content.replace(/<button([^>]*)>立即升级<\/button>/g, '<button onClick={() => navigate("#")} $1>立即升级</button>');

    const placeBefore = content.indexOf('{/* SECTION 9: FAQ */}');
    if (placeBefore > -1) {
        content = content.substring(0, placeBefore) + sec12Content + content.substring(placeBefore);
    }
}

// 5. Change Product Hero (bg to white, text to black)
const heroStartIdx = content.indexOf('{/* Configurator Section - PRODUCT HERO REWRITTEN */}');
const newSec4Start = content.indexOf('{/* SECTION 4: IN THE BOX (REWRITTEN) */}');
if (heroStartIdx > -1 && newSec4Start > -1) {
    let heroChunk = content.substring(heroStartIdx, newSec4Start);
    heroChunk = heroChunk
        .replace(/bg-\[#080808\]/g, 'bg-[#FFFFFF]')
        .replace(/text-white/g, 'text-[#000000]')
        .replace(/border-\[rgba\(255,255,255,0.06\)\]/g, 'border-[rgba(0,0,0,0.08)]')
        .replace(/text-white\/80/g, 'text-black/80')
        .replace(/text-white\/50/g, 'text-black/50')
        .replace(/text-white\/60/g, 'text-black/60')
        .replace(/text-white\/25/g, 'text-black/25')
        .replace(/text-white\/70/g, 'text-black/70')
        .replace(/border-white\/10/g, 'border-black/10')
        .replace(/border-white\/15/g, 'border-black/15')
        .replace(/border-white\/30/g, 'border-black/30')
        .replace(/border-white\/20/g, 'border-black/20')
        .replace(/bg-white\/5/g, 'bg-black/5')
        .replace(/bg-white\/20/g, 'bg-black/20')
        .replace(/text-\[rgba\(255,255,255,0.5\)\]/g, 'text-[rgba(0,0,0,0.5)]')
        .replace(/text-\[rgba\(255,255,255,0.75\)\]/g, 'text-[rgba(0,0,0,0.75)]')
        .replace(/border-white/g, 'border-black')
        .replace(/border-\[#080808\]/g, 'border-[#FFFFFF]') // fake gap
        .replace(/bg-black\/50/g, 'bg-white/90 text-black shadow-sm');
        
    content = content.substring(0, heroStartIdx) + heroChunk + content.substring(newSec4Start);
}

// 6. Change "IN THE BOX" Theme (bg white, text black)
const boxStart = content.indexOf('{/* SECTION 4: IN THE BOX (REWRITTEN) */}');
const metricsStart = content.indexOf('{/* SECTION 3: HEALTH METRICS (REWRITTEN) */}');
if (boxStart > -1 && metricsStart > -1) {
    let boxChunk = content.substring(boxStart, metricsStart);
    boxChunk = boxChunk
        .replace(/bg-\[#080808\]/g, 'bg-[#FFFFFF]')
        .replace(/text-white/g, 'text-[#000000]')
        .replace(/border-white\/5/g, 'border-black/5')
        .replace(/text-white\/30/g, 'text-black/40');
    content = content.substring(0, boxStart) + boxChunk + content.substring(metricsStart);
}

// 7. Change "Reviews" Theme (bg white, text black)
const reviewsStart = content.indexOf('{/* SECTION 11: REVIEWS */}');
const youMayLikeStart = content.indexOf('{/* MODULE 01: 核心价值 */}'); // SECTION 12 was moved out, so this follows
if (reviewsStart > -1 && youMayLikeStart > -1) {
    let reviewsChunk = content.substring(reviewsStart, youMayLikeStart);
    reviewsChunk = reviewsChunk
        .replace(/bg-\[#080808\]/g, 'bg-[#FFFFFF]')
        .replace(/text-white/g, 'text-[#000000]')
        .replace(/border-white\/5/g, 'border-black/5')
        .replace(/bg-\[#1A1A1A\]/g, 'bg-[#F9F9F9]')
        .replace(/text-white\/50/g, 'text-black/50')
        .replace(/text-white\/70/g, 'text-black/70')
        .replace(/text-white\/40/g, 'text-black/40')
        .replace(/text-white\/\[0\.35\]/g, 'text-black/40')
        .replace(/border-\[rgba\(255,255,255,0.06\)\]/g, 'border-[rgba(0,0,0,0.08)]')
        .replace(/bg-white\/5/g, 'bg-black/5') // filter buttons
        .replace(/hover:bg-white\/10/g, 'hover:bg-black/10');
    content = content.substring(0, reviewsStart) + reviewsChunk + content.substring(youMayLikeStart);
}

// 8. Make sure HeroAccordion is correctly themed in definition at top
content = content.replace(/const HeroAccordion[^]*?export default function StorePage/m, (match) => {
    return match
      .replace(/border-\[rgba\(255,255,255,0.06\)\]/g, 'border-[rgba(0,0,0,0.08)]')
      .replace(/text-white hover:text-\[#C8FF00\]/g, 'text-[#000000] hover:text-[#C8FF00]')
      .replace(/opacity-50/g, 'opacity-50 text-black'); // chevron down
});

// Write it back
fs.writeFileSync('src/pages/StorePage.tsx', content, 'utf-8');
console.log('Restructure completely done.');
