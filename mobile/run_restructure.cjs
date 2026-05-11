const fs = require('fs');

let content = fs.readFileSync('src/pages/StorePage.tsx', 'utf-8');

const reviewsStart = content.indexOf('{/* SECTION 11: REVIEWS (REWRITTEN) */}');
const cartStart = content.indexOf('{/* MODULE 01: 核心价值 */}');

if (reviewsStart > -1 && cartStart > -1 && cartStart > reviewsStart) {
    let reviewsChunk = content.substring(reviewsStart, cartStart);
    reviewsChunk = reviewsChunk
        .replace(/bg-\[#080808\]/g, 'bg-[#FFFFFF]')
        .replace(/text-white/g, 'text-[#000000]')
        .replace(/border-white\/5/g, 'border-black/5')
        .replace(/bg-\[#1A1A1A\]/g, 'bg-[#F5F5F3]')
        .replace(/text-white\/50/g, 'text-black/50')
        .replace(/text-white\/70/g, 'text-black/70')
        .replace(/text-white\/40/g, 'text-black/40')
        .replace(/text-white\/\[0\.35\]/g, 'text-black/40')
        .replace(/border-\[rgba\(255,255,255,0.06\)\]/g, 'border-[rgba(0,0,0,0.08)]')
        .replace(/bg-white\/5/g, 'bg-black/5') // filter buttons
        .replace(/hover:bg-white\/10/g, 'hover:bg-black/10');
    content = content.substring(0, reviewsStart) + reviewsChunk + content.substring(cartStart);
}

fs.writeFileSync('src/pages/StorePage.tsx', content, 'utf-8');
console.log('Reviews theme updated');
