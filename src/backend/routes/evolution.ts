import express from "express";
import db from "../db";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate, (req: any, res) => {
    const { id: userId, type, perfil } = req.user;
    const { cliente_id } = req.query;

    const isStaff = type === 'admin' || perfil === 'consultor';
    let targetClientId = userId;
    if (isStaff && cliente_id) {
        targetClientId = cliente_id;
    }

    let query = "SELECT * FROM cliente_evolucao WHERE cliente_id = ?";
    let params = [targetClientId];

    if (!isStaff) {
        query += " AND visivel_cliente = 1";
    }

    query += " ORDER BY data_criacao DESC";

    const evolution = db.prepare(query).all(...params);
    res.json(evolution);
});

router.post("/", authenticate, (req: any, res) => {
    const { id: userId, type, perfil } = req.user;
    if (type !== 'admin' && perfil !== 'consultor') {
        return res.status(403).json({ error: "Apenas administradores ou consultores podem registrar evolução." });
    }

    const { cliente_id, titulo, descricao, visivel_cliente } = req.body;

    const result = db.prepare(`
        INSERT INTO cliente_evolucao (cliente_id, consultor_id, titulo, descricao, visivel_cliente)
        VALUES (?, ?, ?, ?, ?)
    `).run(cliente_id, userId, titulo, descricao, visivel_cliente !== undefined ? (visivel_cliente ? 1 : 0) : 1);

    res.status(201).json({ id: result.lastInsertRowid });
});

export default router;
