// Premium Sweet Shop Data Seeder
// Seeds the database with authentic Haldiram's-style Indian sweets

const axios = require('axios');

// CHANGE THIS TO YOUR RAILWAY URL
const API_BASE = process.env.API_URL || 'http://localhost:8080/api';

// Premium Indian sweets with correct categories and high-quality images
const premiumSweets = [
  // BARFI Category
  {
    name: "Kaju Katli",
    category: "BARFI",
    price: 650,
    quantity: 500,
    description: "Premium cashew fudge with silver leaf. Melt-in-mouth royal delicacy made with pure cashews.",
    imageUrl: "/BARFI/Kaju_Barfi.jpg"
  },
  {
    name: "Pista Barfi",
    category: "BARFI",
    price: 750,
    quantity: 350,
    description: "Rich pistachio fudge layered with real pistachio pieces. A luxurious green delight.",
    imageUrl: "/BARFI/PistaBurfi.jpg"
  },
  {
    name: "Badam Barfi",
    category: "BARFI",
    price: 700,
    quantity: 400,
    description: "Premium almond fudge made with finely ground almonds and pure ghee.",
    imageUrl: "/BARFI/Badam_Barfi.jpg"
  },
  {
    name: "Coconut Barfi",
    category: "BARFI",
    price: 450,
    quantity: 600,
    description: "Fresh coconut fudge with a hint of cardamom. Light and refreshing.",
    imageUrl: "/BARFI/Coconut_Barfi.jpg"
  },
  {
    name: "Anjeer Barfi",
    category: "BARFI",
    price: 800,
    quantity: 250,
    description: "Fig and dry fruit fudge. A healthy indulgence packed with nutrition.",
    imageUrl: "/BARFI/Anjeer_Barfi.jpg"
  },
  {
    name: "Chocolate Barfi",
    category: "BARFI",
    price: 550,
    quantity: 450,
    description: "Modern fusion of Indian barfi with rich Belgian chocolate. Best of both worlds.",
    imageUrl: "/BARFI/Chocolate_arfi.jpg"
  },
  {
    name: "Kalakand",
    category: "BARFI",
    price: 500,
    quantity: 550,
    description: "Soft milk cake with grainy texture. An authentic milk sweet delicacy from Alwar.",
    imageUrl: "/BARFI/Kalakand.jpg"
  },

  // LADOO Category
  {
    name: "Motichoor Ladoo",
    category: "LADOO",
    price: 400,
    quantity: 700,
    description: "Tiny pearl-like boondi balls held together with fragrant saffron. A wedding favorite.",
    imageUrl: "/LADOO/Motichoor_Ladoo.jpg"
  },
  {
    name: "Besan Ladoo",
    category: "LADOO",
    price: 350,
    quantity: 850,
    description: "Golden gram flour balls enriched with pure ghee, cashews, and cardamom.",
    imageUrl: "/LADOO/Besan_Ladoo.jpg"
  },
  {
    name: "Rava Ladoo",
    category: "LADOO",
    price: 300,
    quantity: 900,
    description: "Semolina balls with ghee and cardamom. Simple yet satisfying.",
    imageUrl: "/LADOO/Rava_Ladoo.jpg"
  },
  {
    name: "Dry Fruit Ladoo",
    category: "LADOO",
    price: 600,
    quantity: 380,
    description: "Power-packed balls of assorted nuts and seeds. Energy meets taste.",
    imageUrl: "/LADOO/Dry_Fruit_Ladoo.jpg"
  },
  {
    name: "Boondi Ladoo",
    category: "LADOO",
    price: 350,
    quantity: 750,
    description: "Classic festive ladoo made with tiny fried gram flour balls in sugar syrup.",
    imageUrl: "/LADOO/Boondi_Ladoo.jpg"
  },

  // HALWA Category
  {
    name: "Gajar Halwa",
    category: "HALWA",
    price: 400,
    quantity: 480,
    description: "Slow-cooked carrot pudding with milk, ghee, and dry fruits. Winter warmth in a bowl.",
    imageUrl: "/HALWA/Gajar_Halwa.jpg"
  },
  {
    name: "Moong Dal Halwa",
    category: "HALWA",
    price: 550,
    quantity: 420,
    description: "Yellow lentil halwa cooked with generous ghee and nuts. Rajasthani pride.",
    imageUrl: "/HALWA/Moong_Dal_Halwa.jpg"
  },
  {
    name: "Badam Halwa",
    category: "HALWA",
    price: 750,
    quantity: 280,
    description: "Rich almond pudding cooked in pure ghee. A royal Mughlai specialty.",
    imageUrl: "/HALWA/Badam_Halwa.jpg"
  },
  {
    name: "Suji Halwa",
    category: "HALWA",
    price: 300,
    quantity: 650,
    description: "Traditional semolina halwa with cardamom and raisins. Temple prasad favorite.",
    imageUrl: "/HALWA/Suji_Halwa.jpg"
  },

  // TRADITIONAL Category
  {
    name: "Gulab Jamun",
    category: "TRADITIONAL",
    price: 350,
    quantity: 750,
    description: "Soft milk dumplings soaked in aromatic rose-cardamom syrup. A timeless Indian classic.",
    imageUrl: "/TRADITIONAL/Gulab_Jamun.jpg"
  },
  {
    name: "Rasgulla",
    category: "TRADITIONAL",
    price: 300,
    quantity: 650,
    description: "Spongy cottage cheese balls in light sugar syrup. Bengal's gift to the world.",
    imageUrl: "/TRADITIONAL/Rasgulla.jpg"
  },
  {
    name: "Rasmalai",
    category: "TRADITIONAL",
    price: 450,
    quantity: 580,
    description: "Soft paneer discs in creamy saffron milk. Elegance on a plate.",
    imageUrl: "/TRADITIONAL/Rasmalai.jpg"
  },
  {
    name: "Jalebi",
    category: "TRADITIONAL",
    price: 250,
    quantity: 880,
    description: "Crispy coiled fritters dipped in saffron syrup. Best enjoyed warm.",
    imageUrl: "/TRADITIONAL/Jalebi.jpg"
  },
  {
    name: "Mysore Pak",
    category: "TRADITIONAL",
    price: 500,
    quantity: 450,
    description: "Rich ghee-soaked gram flour sweet from South India. Dense, crumbly perfection.",
    imageUrl: "/TRADITIONAL/Mysore_Pak.jpg"
  },
  {
    name: "Peda",
    category: "TRADITIONAL",
    price: 350,
    quantity: 780,
    description: "Soft milk sweet flavored with cardamom and saffron. Mathura's legacy.",
    imageUrl: "/TRADITIONAL/Peda.jpg"
  },
  {
    name: "Sandesh",
    category: "TRADITIONAL",
    price: 400,
    quantity: 680,
    description: "Bengali cottage cheese sweet with subtle cardamom. Light and delicate.",
    imageUrl: "/TRADITIONAL/Sandesh.jpg"
  },
  {
    name: "Kesar Pista Roll",
    category: "TRADITIONAL",
    price: 600,
    quantity: 360,
    description: "Rolled saffron sweet with pistachio filling. Visual and culinary art.",
    imageUrl: "/TRADITIONAL/Kesar_Pista_Roll.jpg"
  },
  {
    name: "Kheer",
    category: "TRADITIONAL",
    price: 200,
    quantity: 520,
    description: "Creamy rice pudding with cardamom, saffron, and dry fruits. Comfort in a bowl.",
    imageUrl: "/TRADITIONAL/Kheer.jpg"
  },

  // NAMKEEN Category
  {
    name: "Bhujia",
    category: "NAMKEEN",
    price: 180,
    quantity: 1200,
    description: "Crispy gram flour noodles with spices. The iconic Bikaner snack.",
    imageUrl: "/NAMKEEN/Bhujia.jpg"
  },
  {
    name: "Aloo Bhujia",
    category: "NAMKEEN",
    price: 200,
    quantity: 1000,
    description: "Potato-based crispy snack with authentic spices. Perfect tea-time companion.",
    imageUrl: "/NAMKEEN/Aloo_Bhujia.jpg"
  },
  {
    name: "Mixture",
    category: "NAMKEEN",
    price: 220,
    quantity: 950,
    description: "Assorted savory mix with sev, peanuts, and crispy elements.",
    imageUrl: "/NAMKEEN/Mixture.jpeg"
  },
  {
    name: "Soan Papdi",
    category: "NAMKEEN",
    price: 280,
    quantity: 850,
    description: "Crispy, flaky sweet confection that dissolves in your mouth. Perfected over generations.",
    imageUrl: "/NAMKEEN/Soan_Papdi.jpg"
  },
  {
    name: "Chikki",
    category: "NAMKEEN",
    price: 150,
    quantity: 1100,
    description: "Crunchy peanut and jaggery brittle. Natural energy bar.",
    imageUrl: "/NAMKEEN/Chikki.jpg"
  },
];

async function seedData() {
  try {
    let adminToken;
    
    // 1. Login as admin (admin must be pre-configured in database with ADMIN role)
    console.log('Logging in as admin...');
    try {
      const loginRes = await axios.post(`${API_BASE}/auth/login`, {
        email: "newadmin@sweetshop.com",
        password: "Admin@123"
      });
      adminToken = loginRes.data.accessToken;
      
      if (loginRes.data.user.role !== 'ADMIN') {
        console.error('ERROR: User is not an admin. Please update role in database.');
        process.exit(1);
      }
      console.log('Admin logged in successfully');
    } catch (err) {
      console.error('Admin login failed. Make sure admin user exists in database with ADMIN role.');
      console.error('Error:', err.response?.data?.message || err.message);
      process.exit(1);
    }

    // 2. Register customer user (will always get USER role)
    console.log('Setting up customer user...');
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        firstName: "Customer",
        lastName: "User",
        email: "customer@sweetshop.com",
        password: "Customer@123"
      });
      console.log('Customer registered successfully');
    } catch (err) {
      if (err.response?.status === 409) {
        console.log('Customer already exists');
      } else {
        throw err;
      }
    }

    // 3. Add all sweets
    console.log('\nAdding premium sweets...');
    let successCount = 0;
    for (const sweet of premiumSweets) {
      try {
        await axios.post(
          `${API_BASE}/sweets`,
          sweet,
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        console.log(`  Added: ${sweet.name}`);
        successCount++;
      } catch (err) {
        console.log(`  Failed: ${sweet.name} - ${err.response?.data?.message || err.message}`);
      }
    }

    console.log('\nDatabase seeded successfully!');
    console.log('\nSummary:');
    console.log(`  - Total Sweets Added: ${successCount}/${premiumSweets.length}`);
    console.log(`  - Admin: newadmin@sweetshop.com / Admin@123`);
    console.log(`  - Customer: customer@sweetshop.com / Customer@123`);
    
  } catch (error) {
    console.error('Error seeding data:', error.response?.data || error.message);
  }
}

seedData();
