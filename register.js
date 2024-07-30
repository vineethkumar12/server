const bcrypt = require("bcryptjs");

const handleregister = async (req, res, db) => {
  try {
    const { email, password, name } = req.body;

    // Validate input data
    if (!email || !password || !name) {
      return res.status(400).json("Missing email, password, or name.");
    }

    // Hash the plain password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start a transaction
    await db.transaction(async (trx) => {
      try {
        // Insert into 'login' table
        const [loginEmail] = await trx("login")
          .insert({
            email,
            password: hashedPassword,
          })
          .returning("email");

        // Insert into 'users' table
        const [user] = await trx("users")
          .insert({
            name,
            email: loginEmail.email,
            joined: new Date(),
            // Initialize entries with 0 or any other default value
          })
          .returning("*");

        // Respond with the newly registered user
        res.json(user);

        // Commit the transaction
        await trx.commit();
      } catch (err) {
        console.error("Transaction error:", err);
        // Roll back the transaction if an error occurs
        await trx.rollback();
        throw err;
      }
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json("Internal server error.");
  }
};

module.exports = {
  handleregister,
};
