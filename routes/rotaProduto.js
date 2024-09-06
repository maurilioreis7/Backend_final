const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

// Função para validação de valores, como validação de preço
function validaPreco(valor) {
    return !isNaN(parseFloat(valor)) && isFinite(valor);
}

// Consultar todos os produtos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error, response: null });
        }
        conn.query("SELECT * FROM `produto`", (error, resultado, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            res.status(200).send({
                mensagem: "Aqui está a lista de produtos!",
                produtos: resultado
            });
        });
    });
});

// Consultar um produto específico
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error, response: null });
        }
        conn.query("SELECT * FROM `produto` WHERE id = ?", [id], (error, resultado, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            res.status(200).send({
                mensagem: "Aqui está o produto!",
                produto: resultado
            });
        });
    });
});

// Adicionar um novo produto
router.post('/', (req, res, next) => {
    const { descricao, valor_unitario, caminho } = req.body;
    let msg = [];
    let i = 0;

    if (!descricao || descricao.length < 3) {
        msg.push({ mensagem: "Descrição deve ter pelo menos 3 caracteres!" });
        i++;
    }
    if (!validaPreco(valor_unitario)) {
        msg.push({ mensagem: "Valor unitário inválido!" });
        i++;
    }
    if (!caminho || caminho.length === 0) {
        msg.push({ mensagem: "Caminho inválido!" });
        i++;
    }

    if (i === 0) {
        mysql.getConnection((error, conn) => {
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            conn.query(
                "INSERT INTO `produto` (descricao, valor_unitario, caminho) VALUES (?, ?, ?)",
                [descricao, valor_unitario, caminho],
                (error, resultado, field) => {
                    conn.release();
                    if (error) {
                        return res.status(500).send({ error: error, response: null });
                    }
                    res.status(201).send({
                        mensagem: "Produto criado com sucesso!",
                        produtoId: resultado.insertId
                    });
                }
            );
        });
    } else {
        res.status(400).send({ mensagem: msg });
    }
});

// Atualizar um produto existente
router.patch('/', (req, res, next) => {
    const { id, descricao, valor_unitario, caminho } = req.body;
    let msg = [];
    let i = 0;

    if (!descricao || descricao.length < 3) {
        msg.push({ mensagem: "Descrição deve ter pelo menos 3 caracteres!" });
        i++;
    }
    if (!validaPreco(valor_unitario)) {
        msg.push({ mensagem: "Valor unitário inválido!" });
        i++;
    }
    if (!caminho || caminho.length === 0) {
        msg.push({ mensagem: "Caminho inválido!" });
        i++;
    }

    if (i === 0) {
        mysql.getConnection((error, conn) => {
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            conn.query(
                "UPDATE `produto` SET descricao = ?, valor_unitario = ?, caminho = ? WHERE id = ?",
                [descricao, valor_unitario, caminho, id],
                (error, resultado, field) => {
                    conn.release();
                    if (error) {
                        return res.status(500).send({ error: error, response: null });
                    }
                    res.status(200).send({
                        mensagem: "Produto atualizado com sucesso!"
                    });
                }
            );
        });
    } else {
        res.status(400).send({ mensagem: msg });
    }
});

// Deletar um produto
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error, response: null });
        }
        conn.query("DELETE FROM `produto` WHERE id = ?", [id], (error, resultado, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            res.status(200).send({
                mensagem: "Produto deletado com sucesso!"
            });
        });
    });
});

module.exports = router;
