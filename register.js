const handleregister = (req, res, db) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json("unable to get registers");
  }

  // Store hash in your password DB.

  db.transaction((trx) => {
    trx
      .insert({
        password: password,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0].email,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json(err));
};

module.exports = {
  handleregister: handleregister,
};
