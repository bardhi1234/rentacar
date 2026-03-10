const db = require("../config/db");

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [admins] = await db.query(
      "SELECT * FROM admins WHERE email = ? AND password = ?",
      [email, password]
    );

    if (admins.length > 0) {
      return res.json({
        success: true,
        message: "Login successful",
        admin: {
          id: admins[0].id,
          email: admins[0].email
        }
      });
    }

    res.status(401).json({
      success: false,
      message: "Email ose password gabim"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};