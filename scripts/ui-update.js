const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../src/app/(public)/page.tsx');
const footerPath = path.join(__dirname, '../src/components/layout/footer.tsx');

let pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Unified Container
pageContent = pageContent.replace(/container mx-auto px-4 md:px-6/g, 'max-w-[1400px] w-full mx-auto px-[clamp(20px,4vw,48px)]');

// 2. Increase Padding
pageContent = pageContent.replace(/className="w-full py-24/g, 'className="w-full py-32');
pageContent = pageContent.replace(/className="w-full py-32/g, 'className="w-full py-40');
// Revert hero section padding which got messed up by the global replace above
pageContent = pageContent.replace(/w-full py-40 md:py-32 lg:py-40/g, 'w-full py-32 md:py-40 lg:py-48');

// 3. FAQ Section Spacing
pageContent = pageContent.replace(/className="max-w-3xl mx-auto space-y-4"/g, 'className="max-w-3xl mx-auto space-y-6"');

// 4. Background pattern
const oldBg = "PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGh0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwVjIweiIgZmlsbD0iIzU1NTVGRiIgZmlsbC1vcGFjaXR5PSIwLjAyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=";
const oldBg2 = "PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwVjIweiIgZmlsbD0iIzU1NTVGRiIgZmlsbC1vcGFjaXR5PSIwLjAyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=";
const newBg = "PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgzMnYzMkgwem0zMiAzMmgzMnYzMkgzMnoiIGZpbGw9IiMwMEFBQUEiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjxwYXRoIGQ9Ik0wIDMySDMyVjY0SDB6bTMyLTMySDY0VjMySDMyWiIgZmlsbD0iIzU1NTVGRiIgZmlsbC1vcGFjaXR5PSIwLjAyIi8+PC9zdmc+";
pageContent = pageContent.replace(oldBg, newBg).replace(oldBg2, newBg);

// 5. Card standardized height
pageContent = pageContent.replace(/bg-card\/80 backdrop-blur border \$\{step\.border\} rounded-2xl p-6 relative z-10 text-center transition-all duration-300 hover:shadow-2xl \$\{step\.glow\}/g, 'h-full flex flex-col bg-card/80 backdrop-blur border ${step.border} rounded-2xl p-8 relative z-10 text-center transition-all duration-300 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-2xl ${step.glow}');
pageContent = pageContent.replace(/bg-card border border-border\/50 rounded-xl p-6 text-center hover:bg-foreground\/5 transition-colors/g, 'h-full flex flex-col bg-card border border-border/50 rounded-xl p-8 text-center hover:bg-foreground/5 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]');

// 6. Hero enhancements
// Ensure the content is centered and nicely spaced
pageContent = pageContent.replace(/grid grid-cols-1 lg:grid-cols-2 gap-12 items-center/g, 'grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center');

fs.writeFileSync(pagePath, pageContent);

let footerContent = fs.readFileSync(footerPath, 'utf8');
footerContent = footerContent.replace(/container mx-auto px-4 md:px-6/g, 'max-w-[1400px] w-full mx-auto px-[clamp(20px,4vw,48px)]');
footerContent = footerContent.replace(/grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12/g, 'grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-16');
fs.writeFileSync(footerPath, footerContent);

console.log("Updated files");
