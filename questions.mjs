import express from "express";
import connectionPool from "./utils/db.mjs";
import { validCreateAndUpdateQuestion } from "./questions.validation.mjs";

const router = express.Router();

router.post("/",[validCreateAndUpdateQuestion], async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const result = await connectionPool.query(
      `INSERT INTO questions (title, description, category, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
      [title, description, category]
    );
    res.status(201).json({
      message: "Question created successfully",
      question: result.rows[0],
    });
  } catch {
    res.status(400).json({ message: "Missing or invalid request data" });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await connectionPool.query(`SELECT * FROM questions`);
    res.status(200).json({
      message: "Successfully retrieved the list of questions",
      data: result.rows,
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await connectionPool.query(
      `SELECT * FROM questions WHERE id = $1`,
      [id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({
      message: "Successfully retrieved the question",
      data: result.rows[0],
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id",[validCreateAndUpdateQuestion], async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await connectionPool.query(
      `UPDATE questions SET title = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [title, description, id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json({
      message: "Successfully updated the question",
      data: result.rows[0],
    });
  } catch {
    res.status(400).json({ message: "Missing or invalid request data" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await connectionPool.query(
      `DELETE FROM questions WHERE id = $1 RETURNING *`,
      [id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
