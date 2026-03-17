import fs from "fs";
import path from "path";
import fetch from "node-fetch";

/* ---------------- CONFIG ---------------- */

const SITE_URL = "https://ifleon.com";

/* 👉 CHANGE THIS TO YOUR WORDPRESS DOMAIN */
const WP_API_BASE = "https://ifleon.com/wp-json/wp/v2/posts";

/* ---------------- Helper ---------------- */

const publicDir = path.resolve("./public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

/* ---------------- Fetch ALL WP Posts ---------------- */

async function fetchAllPosts() {
  let page = 1;
  let allPosts = [];
  let hasMore = true;

  while (hasMore) {
    console.log(`Fetching WP posts page ${page}`);

    const res = await fetch(`${WP_API_BASE}?per_page=100&page=${page}`);

    if (!res.ok) {
      hasMore = false;
      break;
    }

    const posts = await res.json();

    if (posts.length === 0) {
      hasMore = false;
    } else {
      allPosts = [...allPosts, ...posts];
      page++;
    }
  }

  return allPosts;
}

/* ---------------- Generate Blog Sitemap ---------------- */

function generateBlogSitemap(posts) {
  const urls = posts
    .map(
      (post) => `
  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <priority>0.7</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/* ---------------- Generate Pages Sitemap ---------------- */

function generatePagesSitemap() {
  const pages = [
    "",
    "/blog",
    "/pricing",
    "/case-studies",
    "/faq",
    "/tech-stack",
  ];

  const urls = pages
    .map(
      (page) => `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <priority>0.9</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/* ---------------- Generate Master Sitemap ---------------- */

function generateMasterSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>${SITE_URL}/sitemap-pages.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${SITE_URL}/sitemap-blog.xml</loc>
  </sitemap>

</sitemapindex>`;
}

/* ---------------- Main ---------------- */

async function generateSitemap() {
  try {
    const posts = await fetchAllPosts();

    console.log(`Total posts found: ${posts.length}`);

    const blogSitemap = generateBlogSitemap(posts);
    const pagesSitemap = generatePagesSitemap();
    const masterSitemap = generateMasterSitemap();

    fs.writeFileSync(path.join(publicDir, "sitemap-blog.xml"), blogSitemap);
    fs.writeFileSync(path.join(publicDir, "sitemap-pages.xml"), pagesSitemap);
    fs.writeFileSync(path.join(publicDir, "sitemap.xml"), masterSitemap);

    console.log("✅ Sitemap files generated successfully!");
  } catch (err) {
    console.error("❌ Sitemap generation failed:", err);
  }
}

generateSitemap();
