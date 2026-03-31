import { db, categoriesTable, productsTable, reviewsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.execute(sql`TRUNCATE reviews, cart_items, orders, products, categories RESTART IDENTITY CASCADE`);

  // Seed categories
  const categories = await db.insert(categoriesTable).values([
    {
      name: "Roof Boxes",
      slug: "roof-boxes",
      description: "Aerodynamic roof boxes for extra storage on any journey",
      imageUrl: null,
      productCount: 0,
    },
    {
      name: "Lighting",
      slug: "lighting",
      description: "LED fog lamps, spotlights and auxiliary lighting",
      imageUrl: null,
      productCount: 0,
    },
    {
      name: "Wipers",
      slug: "wipers",
      description: "Premium wiper blades for clear visibility in all conditions",
      imageUrl: null,
      productCount: 0,
    },
    {
      name: "Air Fresheners",
      slug: "air-fresheners",
      description: "Keep your car smelling fresh with our premium air fresheners",
      imageUrl: null,
      productCount: 0,
    },
    {
      name: "Seat Covers",
      slug: "seat-covers",
      description: "Protect and style your car interior with quality seat covers",
      imageUrl: null,
      productCount: 0,
    },
    {
      name: "Dash Cams",
      slug: "dash-cams",
      description: "High-definition dash cameras for safety and security on the road",
      imageUrl: null,
      productCount: 0,
    },
    {
      name: "Car Care",
      slug: "car-care",
      description: "Cleaning and maintenance products to keep your car looking its best",
      imageUrl: null,
      productCount: 0,
    },
  ]).returning();

  const catMap: Record<string, number> = {};
  for (const cat of categories) {
    catMap[cat.slug] = cat.id;
  }

  // Seed products
  const products = await db.insert(productsTable).values([
    // Roof Boxes
    {
      name: "ProPack Xtreme 520L Roof Box",
      slug: "propack-xtreme-520l",
      description: "The ProPack Xtreme 520L is built for adventurers who refuse to compromise on space. With 520 liters of storage, aerodynamic dual-side opening, and a reinforced ABS shell, it locks securely and opens from both sides for maximum convenience. Fits most roof racks.",
      price: "599.99",
      compareAtPrice: "749.99",
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["roof-boxes"],
      brand: "ProPack",
      sku: "RPB-520X",
      stock: 15,
      featured: true,
      rating: "4.8",
      reviewCount: 0,
      tags: ["roof box", "storage", "adventure", "dual-side"],
    },
    {
      name: "CargoMaster 400L Slim Roof Box",
      slug: "cargomaster-400l-slim",
      description: "Low-profile 400L roof box with UV-resistant coating and quick-click mounting. Perfect for everyday family cars. Weight limit 50kg. Compatible with all major roof bar systems.",
      price: "389.99",
      compareAtPrice: null,
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["roof-boxes"],
      brand: "CargoMaster",
      sku: "CMB-400S",
      stock: 22,
      featured: false,
      rating: "4.5",
      reviewCount: 0,
      tags: ["roof box", "low-profile", "family"],
    },
    {
      name: "TrekVault 650L Expedition Box",
      slug: "trekvault-650l",
      description: "Maximum capacity 650L roof box designed for extended road trips. Reinforced dual-lock system, LED interior light, and integrated anti-theft mechanism. The choice of overlanders and road trippers worldwide.",
      price: "849.99",
      compareAtPrice: "999.99",
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["roof-boxes"],
      brand: "TrekVault",
      sku: "TVB-650E",
      stock: 8,
      featured: true,
      rating: "4.9",
      reviewCount: 0,
      tags: ["roof box", "expedition", "large capacity"],
    },
    // Lighting
    {
      name: "BrightPath H11 LED Fog Lamp Pair",
      slug: "brightpath-h11-led-fog",
      description: "Ultra-bright 8000 Lumen H11 LED fog lamps with advanced heat dissipation and IP68 waterproof rating. Plug-and-play installation — no ballast required. 6000K pure white output for maximum visibility in fog and rain.",
      price: "89.99",
      compareAtPrice: "129.99",
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["lighting"],
      brand: "BrightPath",
      sku: "BPL-H11LED",
      stock: 45,
      featured: true,
      rating: "4.7",
      reviewCount: 0,
      tags: ["fog lamp", "LED", "H11", "waterproof"],
    },
    {
      name: "NightRider Spot Beam LED Light Bar 20\"",
      slug: "nightrider-spot-beam-20",
      description: "20-inch curved LED light bar with combination spot/flood beam. 18,000 Lumen total output. Die-cast aluminum housing with polycarbonate lens. Includes wiring harness and mounting brackets.",
      price: "149.99",
      compareAtPrice: null,
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["lighting"],
      brand: "NightRider",
      sku: "NRL-20CB",
      stock: 30,
      featured: false,
      rating: "4.6",
      reviewCount: 0,
      tags: ["light bar", "LED", "off-road", "spot beam"],
    },
    {
      name: "LumiDrive H4 HID Conversion Kit",
      slug: "lumidrive-h4-hid",
      description: "Professional H4 HID conversion kit producing 3200 Lumen with 4300K warm white output. Comes with ballasts, bulbs, and all mounting hardware. Dramatically improves night visibility over stock halogen.",
      price: "119.99",
      compareAtPrice: "159.99",
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["lighting"],
      brand: "LumiDrive",
      sku: "LDH-4300K",
      stock: 18,
      featured: false,
      rating: "4.4",
      reviewCount: 0,
      tags: ["HID", "H4", "conversion", "headlight"],
    },
    // Wipers
    {
      name: "ClearVision Aerotech Beam Wiper 22\"",
      slug: "clearvision-aerotech-22",
      description: "Frameless beam wiper blade using a single pressure contact point for streak-free wiping across the full blade width. Suitable for all weather conditions including heavy snow. Fits 95% of vehicles with universal J-hook.",
      price: "29.99",
      compareAtPrice: "39.99",
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["wipers"],
      brand: "ClearVision",
      sku: "CVW-22AT",
      stock: 120,
      featured: true,
      rating: "4.8",
      reviewCount: 0,
      tags: ["wiper", "beam", "frameless", "all-weather"],
    },
    {
      name: "StormGuard Premium Wiper Set (Front Pair)",
      slug: "stormguard-premium-pair",
      description: "Pre-matched front wiper pair set for maximum compatibility. Graphite-coated natural rubber blade for longer life. Comes in 24/18 inch combination most commonly used. Includes adapters for 7 different arm types.",
      price: "44.99",
      compareAtPrice: null,
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["wipers"],
      brand: "StormGuard",
      sku: "SGW-2418P",
      stock: 80,
      featured: false,
      rating: "4.5",
      reviewCount: 0,
      tags: ["wiper", "pair", "graphite", "premium"],
    },
    // Air Fresheners
    {
      name: "AutoScent Black Ice Luxury Diffuser",
      slug: "autoscent-black-ice-diffuser",
      description: "Premium long-lasting car air diffuser with Black Ice fragrance — a masculine blend of cool citrus, eucalyptus, and sandalwood. Attaches to AC vent. Refillable design lasts up to 60 days. Includes 2 refill cartridges.",
      price: "24.99",
      compareAtPrice: "34.99",
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["air-fresheners"],
      brand: "AutoScent",
      sku: "ASF-BICE",
      stock: 200,
      featured: true,
      rating: "4.6",
      reviewCount: 0,
      tags: ["air freshener", "diffuser", "black ice", "vent clip"],
    },
    {
      name: "BambooFresh Activated Carbon Purifier",
      slug: "bamboofresh-carbon-purifier",
      description: "Natural bamboo charcoal air purifier that absorbs odors, allergens, and moisture — not just masks them. Chemical-free and fragrance-free. Lasts 2 years, then recharge in sunlight. 3-pack for full car coverage.",
      price: "19.99",
      compareAtPrice: null,
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["air-fresheners"],
      brand: "BambooFresh",
      sku: "BFC-3PK",
      stock: 300,
      featured: false,
      rating: "4.7",
      reviewCount: 0,
      tags: ["air purifier", "bamboo", "natural", "odor absorber"],
    },
    // Seat Covers
    {
      name: "LeatherPro Full Car Seat Cover Set",
      slug: "leatherpro-full-set",
      description: "Faux leather seat cover set with built-in back pocket, airbag-compatible side split, and non-slip backing. Universal fit for most sedans and SUVs. Available in Black/Beige. Includes front and rear covers.",
      price: "129.99",
      compareAtPrice: "179.99",
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["seat-covers"],
      brand: "LeatherPro",
      sku: "LPS-FULL",
      stock: 35,
      featured: true,
      rating: "4.5",
      reviewCount: 0,
      tags: ["seat cover", "faux leather", "full set", "universal"],
    },
    {
      name: "SportMesh Breathable Front Seat Covers",
      slug: "sportmesh-breathable-front",
      description: "Breathable 3D mesh fabric seat covers with lumbar support padding. Ideal for summer driving. Compatible with side airbags. Machine washable. Sold as a front pair.",
      price: "69.99",
      compareAtPrice: null,
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["seat-covers"],
      brand: "SportMesh",
      sku: "SMC-FRONT",
      stock: 55,
      featured: false,
      rating: "4.3",
      reviewCount: 0,
      tags: ["seat cover", "mesh", "breathable", "front pair"],
    },
    // Dash Cams
    {
      name: "GuardCam Pro 4K Front & Rear Dash Cam",
      slug: "guardcam-pro-4k",
      description: "Ultra-clear 4K front + 1080P rear dual camera system with Sony STARVIS sensor for exceptional night vision. 170-degree wide angle, built-in GPS, Wi-Fi app control, and 24-hour parking mode. 64GB card included.",
      price: "199.99",
      compareAtPrice: "269.99",
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["dash-cams"],
      brand: "GuardCam",
      sku: "GCM-4KPR",
      stock: 25,
      featured: true,
      rating: "4.9",
      reviewCount: 0,
      tags: ["dash cam", "4K", "dual camera", "GPS", "night vision"],
    },
    {
      name: "MiniCam HD 1080P Compact Dash Cam",
      slug: "minicam-hd-1080p",
      description: "Ultra-compact 1080P full HD dash cam with loop recording and G-sensor. Discrete design hides behind the rearview mirror. Wide 150-degree lens, WDR technology for clear day and night footage. 32GB card included.",
      price: "79.99",
      compareAtPrice: "99.99",
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["dash-cams"],
      brand: "MiniCam",
      sku: "MCM-1080C",
      stock: 40,
      featured: false,
      rating: "4.5",
      reviewCount: 0,
      tags: ["dash cam", "1080p", "compact", "loop recording"],
    },
    // Car Care
    {
      name: "DetailMaster Professional Car Wash Kit",
      slug: "detailmaster-wash-kit",
      description: "Complete 8-piece professional car washing and detailing kit. Includes pH-neutral shampoo, microfiber wash mitt, drying towel, wheel cleaner, tire dressing, glass cleaner, interior spray, and detailing brush. Everything you need for a showroom finish.",
      price: "79.99",
      compareAtPrice: "109.99",
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["car-care"],
      brand: "DetailMaster",
      sku: "DMP-KIT8",
      stock: 60,
      featured: false,
      rating: "4.7",
      reviewCount: 0,
      tags: ["car care", "wash kit", "detailing", "microfiber"],
    },
    {
      name: "CeraPro Ceramic Spray Coating 500ml",
      slug: "cerapro-ceramic-spray",
      description: "Professional-grade SiO2 ceramic spray coating that creates a hydrophobic shield lasting up to 12 months. Repels water, dirt, and UV rays. Easy spray-on wipe-off application. Works on paint, glass, and trim.",
      price: "49.99",
      compareAtPrice: "64.99",
      imageUrl: null,
      imageUrls: [],
      categoryId: catMap["car-care"],
      brand: "CeraPro",
      sku: "CPC-500ML",
      stock: 75,
      featured: false,
      rating: "4.8",
      reviewCount: 0,
      tags: ["ceramic coating", "paint protection", "hydrophobic", "UV protection"],
    },
  ]).returning();

  // Update category product counts
  for (const product of products) {
    if (product.categoryId) {
      await db.execute(sql`UPDATE categories SET product_count = product_count + 1 WHERE id = ${product.categoryId}`);
    }
  }

  // Seed reviews for a few products
  const featuredProduct = products.find(p => p.slug === "propack-xtreme-520l")!;
  const dashCam = products.find(p => p.slug === "guardcam-pro-4k")!;
  const wiper = products.find(p => p.slug === "clearvision-aerotech-22")!;

  await db.insert(reviewsTable).values([
    {
      productId: featuredProduct.id,
      reviewerName: "Marcus Chen",
      rating: 5,
      title: "Best roof box I've ever owned",
      comment: "Bought this for a ski trip and it was absolutely perfect. Easy to mount, loads of space, and completely watertight despite heavy rain on the motorway.",
    },
    {
      productId: featuredProduct.id,
      reviewerName: "Sarah Williams",
      rating: 5,
      title: "Massive space, easy to use",
      comment: "We fit all 4 suitcases for a family holiday plus sports gear. The dual-side opening is incredibly useful at the trailhead.",
    },
    {
      productId: featuredProduct.id,
      reviewerName: "Tom Buckley",
      rating: 4,
      title: "Solid build quality",
      comment: "Very impressed with the build quality. Slightly tricky to mount solo but once on, it stays solid at motorway speeds.",
    },
    {
      productId: dashCam.id,
      reviewerName: "Lisa Park",
      rating: 5,
      title: "Crystal clear footage",
      comment: "The 4K footage is stunning — can read number plates clearly even at distance. Night vision is exceptional. Worth every penny for peace of mind.",
    },
    {
      productId: dashCam.id,
      reviewerName: "Ahmed Hassan",
      rating: 5,
      title: "Game changer for safety",
      comment: "Had a minor incident and the footage saved me thousands in an insurance dispute. Camera quality is outstanding. The parking mode works perfectly.",
    },
    {
      productId: wiper.id,
      reviewerName: "Jenny Morgan",
      rating: 5,
      title: "No more streaks!",
      comment: "Finally found wipers that don't streak. Clear vision from day one even in heavy downpours. So much quieter than my old wipers too.",
    },
  ]);

  // Update review counts and ratings
  for (const product of [featuredProduct, dashCam, wiper]) {
    const productReviews = await db.execute(sql`SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ${product.id}`);
    const row = productReviews.rows[0] as { avg_rating: string; count: string };
    await db.execute(sql`UPDATE products SET rating = ${parseFloat(row.avg_rating).toFixed(2)}, review_count = ${parseInt(row.count, 10)} WHERE id = ${product.id}`);
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
