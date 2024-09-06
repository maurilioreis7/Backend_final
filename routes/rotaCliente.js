const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

// Função para validação de e-mail
function validaEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Função para validação de senha
function validaSenha(senha) {
    return senha && senha.length > 0;
}

// Consultar todos os clientes
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error, response: null });
        }
        conn.query("SELECT * FROM `cliente`", (error, resultado, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            res.status(200).send({
                mensagem: "Aqui está a lista de clientes!",
                clientes: resultado
            });
        });
    });
});

// Consultar um cliente específico
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error, response: null });
        }
        conn.query("SELECT * FROM `cliente` WHERE id = ?", [id], (error, resultado, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            res.status(200).send({
                mensagem: "Aqui está o cliente!",
                cliente: resultado
            });
        });
    });
});

// Adicionar um novo cliente
router.post('/', (req, res, next) => {
    const { id_usuario, nome, email, senha } = req.body;
    let msg = [];
    let i = 0;

    if (!nome || nome.length < 3) {
        msg.push({ mensagem: "Nome deve ter pelo menos 3 caracteres!" });
        i++;
    }
    if (!validaEmail(email)) {
        msg.push({ mensagem: "E-mail inválido!" });
        i++;
    }
    if (!validaSenha(senha)) {
        msg.push({ mensagem: "Senha inválida!" });
        i++;
    }

    if (i === 0) {
        mysql.getConnection((error, conn) => {
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            conn.query(
                "INSERT INTO `cliente` (id_usuario, nome, email, senha) VALUES (?, ?, ?, ?)",
                [id_usuario, nome, email, senha],
                (error, resultado, field) => {
                    conn.release();
                    if (error) {
                        return res.status(500).send({ error: error, response: null });
                    }
                    res.status(201).send({
                        mensagem: "Cliente criado com sucesso!",
                        clienteId: resultado.insertId
                    });
                }
            );
        });
    } else {
        res.status(400).send({ mensagem: msg });
    }
});

// Atualizar um cliente existente
router.patch('/', (req, res, next) => {
    const { id, nome, email, senha } = req.body;
    let msg = [];
    let i = 0;

    if (!nome || nome.length < 3) {
        msg.push({ mensagem: "Nome deve ter pelo menos 3 caracteres!" });
        i++;
    }
    if (!validaEmail(email)) {
        msg.push({ mensagem: "E-mail inválido!" });
        i++;
    }
    if (!validaSenha(senha)) {
        msg.push({ mensagem: "Senha inválida!" });
        i++;
    }

    if (i === 0) {
        mysql.getConnection((error, conn) => {
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            conn.query(
                "UPDATE `cliente` SET nome = ?, email = ?, senha = ? WHERE id = ?",
                [nome, email, senha, id],
                (error, resultado, field) => {
                    conn.release();
                    if (error) {
                        return res.status(500).send({ error: error, response: null });
                    }
                    res.status(200).send({
                        mensagem: "Cliente atualizado com sucesso!"
                    });
                }
            );
        });
    } else {
        res.status(400).send({ mensagem: msg });
    }
});

// Deletar um cliente
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error, response: null });
        }
        conn.query("DELETE FROM `cliente` WHERE id = ?", [id], (error, resultado, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            res.status(200).send({
                mensagem: "Cliente deletado com sucesso!"
            });
        });
    });
});

module.exports = router;
