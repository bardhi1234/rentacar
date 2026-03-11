const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const db = require("./config/db");

const app = express();

// middleware
app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://rentacar-premium.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const carRoutes = require("./routes/carRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const contractRoutes = require("./routes/contractRoutes");

app.use("/api", carRoutes);
app.use("/api", uploadRoutes);
app.use("/api", adminRoutes);
app.use("/api", bookingRoutes);
app.use("/api", contractRoutes);

// statik për fotot
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// test route
app.get("/", (req, res) => {
  res.send("Rent A Car backend po funksionon 🚗");
});

// ==================== CARS TABLE ====================
async function createCarsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id INT AUTO_INCREMENT PRIMARY KEY,
        brand VARCHAR(100),
        model VARCHAR(100),
        full_name VARCHAR(255),
        year INT,
        transmission VARCHAR(50),
        fuel VARCHAR(50),
        seats INT,
        price_per_day DECIMAL(10,2),
        description TEXT,
        status VARCHAR(50),
        main_image VARCHAR(255)
      )
    `);

    console.log("Tabela cars u krijua ose ekziston.");
  } catch (error) {
    console.error("Gabim gjatë krijimit të tabelës cars:", error);
  }
}

// ==================== CAR GALLERY ====================
async function createCarGalleryTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS car_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id INT NOT NULL,
        image VARCHAR(255) NOT NULL
      )
    `);

    console.log("Tabela car_gallery u krijua ose ekziston.");
  } catch (error) {
    console.error("Gabim gjatë krijimit të tabelës car_gallery:", error);
  }
}

// ==================== ADMINS ====================
async function createAdminsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);

    console.log("Tabela admins u krijua ose ekziston.");

    await db.query(`
      INSERT IGNORE INTO admins (email, password)
      VALUES ('admin@rentacar.com', '123456')
    `);

    console.log("Admin default u krijua ose ekziston.");
  } catch (error) {
    console.error("Gabim gjatë krijimit të tabelës admins:", error);
  }
}

// ==================== BOOKINGS ====================
async function createBookingsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT NOT NULL,
        car_id INT NOT NULL,
        pickup_date DATE NOT NULL,
        return_date DATE NOT NULL,
        pickup_location VARCHAR(255),
        customer_name VARCHAR(255),
        customer_phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      ALTER TABLE bookings
      MODIFY id INT NOT NULL AUTO_INCREMENT,
      ADD PRIMARY KEY (id)
    `).catch(async () => {
      await db.query(`
        ALTER TABLE bookings
        MODIFY id INT NOT NULL AUTO_INCREMENT
      `);
    });

    console.log("Tabela bookings u krijua ose u përditësua.");
  } catch (error) {
    console.error("Gabim gjatë krijimit të tabelës bookings:", error);
  }
}

// ==================== CONTRACTS ====================
async function createContractsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS contracts (
        id INT NOT NULL,
        contract_number VARCHAR(100) NOT NULL,
        car_id INT NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        birth_date DATE,
        personal_number VARCHAR(100),
        address VARCHAR(255),
        phone VARCHAR(100),
        pickup_date DATE NOT NULL,
        pickup_time TIME,
        return_date DATE NOT NULL,
        return_time TIME,
        price_per_day DECIMAL(10,2) DEFAULT 0,
        total_days INT DEFAULT 1,
        total_price DECIMAL(10,2) DEFAULT 0,
        paid_amount DECIMAL(10,2) DEFAULT 0,
        remaining_amount DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      ALTER TABLE contracts
      MODIFY id INT NOT NULL AUTO_INCREMENT,
      ADD PRIMARY KEY (id)
    `).catch(async () => {
      await db.query(`
        ALTER TABLE contracts
        MODIFY id INT NOT NULL AUTO_INCREMENT
      `);
    });

    console.log("Tabela contracts u krijua ose u përditësua.");
  } catch (error) {
    console.error("Gabim gjatë krijimit të tabelës contracts:", error);
  }
}

// ==================== CONTRACT PAYMENTS ====================
async function createContractPaymentsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS contract_payments (
        id INT NOT NULL,
        contract_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(100),
        note VARCHAR(255),
        payment_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      ALTER TABLE contract_payments
      MODIFY id INT NOT NULL AUTO_INCREMENT,
      ADD PRIMARY KEY (id)
    `).catch(async () => {
      await db.query(`
        ALTER TABLE contract_payments
        MODIFY id INT NOT NULL AUTO_INCREMENT
      `);
    });

    console.log("Tabela contract_payments u krijua ose u përditësua.");
  } catch (error) {
    console.error("Gabim gjatë krijimit të tabelës contract_payments:", error);
  }
}

// ==================== SERVER START ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log("Server running on port " + PORT);

  await createCarsTable();
  await createCarGalleryTable();
  await createAdminsTable();
  await createBookingsTable();
  await createContractsTable();
  await createContractPaymentsTable();
});