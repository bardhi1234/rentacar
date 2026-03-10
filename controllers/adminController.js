const db = require("../config/db");

exports.loginAdmin = async (req, res) => {
  try {
    let { email, password } = req.body;

    // pastrim input
    email = email ? email.trim() : "";
    password = password ? password.trim() : "";

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dhe password janë të detyrueshme"
      });
    }

    const [admins] = await db.query(
      "SELECT id, email FROM admins WHERE email = ? AND password = ?",
      [email, password]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email ose password gabim"
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      admin: admins[0]
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Gabim në server"
    });
  }
};