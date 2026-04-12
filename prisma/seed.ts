import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database…");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: "Rudraksha" },      update: {}, create: { name: "Rudraksha" } }),
    prisma.category.upsert({ where: { name: "Sound Therapy" },  update: {}, create: { name: "Sound Therapy" } }),
    prisma.category.upsert({ where: { name: "Incense" },        update: {}, create: { name: "Incense" } }),
    prisma.category.upsert({ where: { name: "Crystals" },       update: {}, create: { name: "Crystals" } }),
    prisma.category.upsert({ where: { name: "Meditation" },     update: {}, create: { name: "Meditation" } }),
    prisma.category.upsert({ where: { name: "Puja" },           update: {}, create: { name: "Puja" } }),
  ]);
  const [rudraksha, soundTherapy, incense, crystals, meditation, puja] = categories;
  console.log("✅ Categories seeded");

  // Products
  const productData = [
    {
      name: "Panchmukhi Rudraksha Mala",
      description: "108-bead mala hand-strung on red thread. Authentic 5-faced seeds from Nepal. Believed to bring inner peace and mental clarity. Energised via Prana Pratishtha before dispatch.",
      price: 2499,
      stock: 84,
      categoryId: rudraksha.id,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfdsGV6aNSxqvazDqkT7tcstkj-L8oBUe0ArkfkL_J5tK7luTCM_4wySIyuD9UHwMC-s0nSNtfVbkjLMGeJh6orSysXUnN2IupfunTPLUsRWpn_oUQ-XiMJf0vlu1kUeJWz8zam4yxxQeRmen33focXfDToKydsGGagolfpwG23ZawDPMFO_fja2VkIzAfVDlq9ZAE0641Ymy3cSzBwbI6R-FbGRunWxNcH6Gz2qtWECZcSBDN5nZj2d55dksrBVFO3-B05fvwoV4",
      spiritualEssence: "Associated with Lord Shiva in his Kalagni Rudra form. Balances the Pancha Pranas.",
      specifications: "108 beads, 6-7mm diameter, red cotton thread, Nepal origin",
      isActive: true,
    },
    {
      name: "Hand-Hammered Singing Bowl",
      description: "7-metal alloy bowl hand-hammered in Nepal. Each strike produces healing harmonics for chakra balancing and deep meditation. Comes with wooden striker and cushion.",
      price: 12800,
      stock: 12,
      categoryId: soundTherapy.id,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-EO4Bl8-VPNtoSdjC_mUfndEQgxVPf2oq8QtLTebotTCvfdOjsM3YHCXbbqcIoWEroBmawaapLe-_GuTSUJSIUSZ0l2qBx9aZK6xGEb_XH3kYM7V8wegK-QWAnhn_io7RdvAX7mHavg4UA5jQR7ZqPpqXIq3gyRJKfSPN2pg8b-wtao7rKSU0lve08g8cKRvRjEEEvhCej4tMIsNlvn_vyL81d1ZK7JjIpfMMf00kuJ44MaI7iYWnLAUMinrm45msXVO9TEm0fZY",
      spiritualEssence: "Resonates with all 7 chakras. The 7 metals correspond to the 7 celestial bodies.",
      specifications: "12cm diameter, 450g, includes striker and cushion, Nepal origin",
      isActive: true,
    },
    {
      name: "Premium Mysore Sandalwood Incense",
      description: "Aged Mysore sandalwood, hand-rolled. Pure, rich fragrance with no synthetic fillers. Pack of 20 sticks. Approximately 45 minutes burn time per stick.",
      price: 850,
      stock: 210,
      categoryId: incense.id,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-6snKdcS4FnyHg2X9g22lTNAZI_FbV4_M0lX8PLyrJtu6DLKY6GCnzcUZBw-O3KT9ttOFi-i8gxpbA482Y-c0-rbtaIDWh9L9LD3GfuxXZGCXXAjMLHu8G_GIypUTB8_LB8X-Z8iXC_bAMnWp4s1lKwZbg0cnd_mzr86b25clg0LrZcr_jcKuByBvf-yLRyQqdi79f-8t2UBWT7lzTuv_HI_KpyE-po_lJXwZmwbebQ-X4WM-huqW7xeSHHxNW3gGmM-9Czcsi54",
      spiritualEssence: "Used in Vedic rituals for centuries. Purifies the environment and calms the mind.",
      specifications: "Pack of 20, 25cm length, ~45 min burn time, no synthetic fillers",
      isActive: true,
    },
    {
      name: "Black Tourmaline Pendant",
      description: "Raw cut protection stone set in oxidised silver. Himalayan origin. Believed to create a protective shield against negative energies.",
      price: 3200,
      stock: 5,
      categoryId: crystals.id,
      imageUrl: null,
      spiritualEssence: "Grounding stone that transmutes negative energy into positive vibrations.",
      specifications: "Raw cut, oxidised 925 silver setting, 3-4cm stone, Himalayan origin",
      isActive: true,
    },
    {
      name: "Tibetan Prayer Wheel",
      description: "Hand-engraved copper prayer wheel with Om Mani Padme Hum mantra. Spinning the wheel is said to have the same effect as reciting the mantra.",
      price: 4500,
      stock: 0,
      categoryId: meditation.id,
      imageUrl: null,
      spiritualEssence: "Each rotation equals 108 recitations of the mantra. Accumulates merit and purifies karma.",
      specifications: "Pure copper, hand-engraved, 15cm handle, 6cm wheel diameter",
      isActive: true,
    },
    {
      name: "Pure Ghee Diya Set (12)",
      description: "Traditional clay diyas, set of 12. Handcrafted for daily puja, festivals, and meditation rituals. Each diya measures 3 inches diameter.",
      price: 480,
      stock: 120,
      categoryId: puja.id,
      imageUrl: null,
      spiritualEssence: "The flame symbolises the light of knowledge dispelling darkness of ignorance.",
      specifications: "Set of 12, natural clay, 3\" diameter, suitable for ghee or oil",
      isActive: true,
    },
  ];

  for (const p of productData) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: p,
      create: p,
    });
  }
  console.log("✅ Products seeded");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@akaal.com" },
    update: {},
    create: { name: "Admin", email: "admin@akaal.com", password: adminPassword, role: "ADMIN" },
  });

  // Demo customer
  const customerPassword = await bcrypt.hash("demo123", 10);
  await prisma.user.upsert({
    where: { email: "demo@akaal.com" },
    update: {},
    create: { name: "Demo User", email: "demo@akaal.com", password: customerPassword, role: "USER" },
  });

  console.log("✅ Users seeded");
  console.log("   admin@akaal.com / admin123");
  console.log("   demo@akaal.com  / demo123");
  console.log("🎉 Seed complete!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
