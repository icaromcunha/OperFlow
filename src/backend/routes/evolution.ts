import express from "express";
import db from "../db";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate, (req: any, res) => {
    const { id: userId, type, perfil } = req.user;
    const { cliente_id } = req.query;

    let targetClientId = userId;
    if ((type === 'admin' || perfil === 'consultor' || req.user.type === 'admin') && cliente_id) {
        targetClientId = cliente_id;
    }

    const evolution = db.prepare(`
        SELECT * FROM cliente_evolucao 
        WHERE cliente_id = ?
        ORDER BY data_criacao DESC
    `).all(targetClientId);
    res.json(evolution);
});

router.post("/", authenticate, (req: any, res) => {
    const { id: userId, type, perfil } = req.user;
    if (type !== 'admin' && perfil !== 'consultor') {
        return res.status(403).json({ error: "Apenas administradores ou consultores podem registrar evolução." });
    }

    const { cliente_id, titulo, descricao } = req.body;

    const result = db.prepare(`
        INSERT INTO cliente_evolucao (cliente_id, consultor_id, titulo, descricao)
        VALUES (?, ?, ?, ?)
    `).run(cliente_id, userId, titulo, descricao);

    res.status(201).json({ id: result.lastInsertRowid });
});

export default router;
