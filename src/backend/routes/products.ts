import express from "express";
import db from "../db";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// List all products
router.get("/", authenticateToken, (req, res) => {
  try {
    const products = db.prepare("SELECT * FROM produtos ORDER BY nome ASC").all();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// Get product by ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const product = db.prepare("SELECT * FROM produtos WHERE id = ?").get(req.params.id);
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

// Create product
router.post("/", authenticateToken, (req, res) => {
  const { nome, descricao, preco_base, sku } = req.body;
  try {
    const result = db.prepare(
      "INSERT INTO produtos (nome, descricao, preco_base, sku) VALUES (?, ?, ?, ?)"
    ).run(nome, descricao, preco_base, sku);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

export default router;
