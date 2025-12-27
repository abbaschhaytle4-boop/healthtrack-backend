const express = require("express");
const db = require("../db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE Activity
router.post("/", auth, (req, res) => {
  const { type, date, duration, notes } = req.body;

  if (!type || !date || !duration) {
    return res.status(400).json({ message: "type, date, duration are required" });
  }

  const sql =
    "INSERT INTO activities (user_id, type, date, duration, notes) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [req.user.id, type, date, duration, notes || ""], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });
    return res.json({ message: "Activity added" });
  });
});

// READ Activities for logged user
router.get("/", auth, (req, res) => {
  const sql = "SELECT * FROM activities WHERE user_id = ? ORDER BY date DESC";
  db.query(sql, [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    return res.json(result);
  });
});

// UPDATE Activity
router.put("/:id", auth, (req, res) => {
  const { type, date, duration, notes } = req.body;

  if (!type || !date || !duration) {
    return res.status(400).json({ message: "type, date, duration are required" });
  }

  const sql =
    "UPDATE activities SET type=?, date=?, duration=?, notes=? WHERE id=? AND user_id=?";
  db.query(
    sql,
    [type, date, duration, notes || "", req.params.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Activity not found" });
      return res.json({ message: "Activity updated" });
    }
  );
});

// DELETE Activity
router.delete("/:id", auth, (req, res) => {
  const sql = "DELETE FROM activities WHERE id=? AND user_id=?";
  db.query(sql, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Activity not found" });
    return res.json({ message: "Activity deleted" });
  });
});

module.exports = router;
