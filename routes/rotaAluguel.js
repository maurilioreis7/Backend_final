const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;

// Função para validação de valores numéricos
function validaNumero(valor) {
    return !isNaN(parseFloat(valor)) && isFinite(valor);
}

// Consultar todos os aluguéis
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error, response: null });
        }
        conn.query("SELECT * FROM `aluguel`", (error, resultado, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            res.status(200).send({
                mensagem: "Aqui está a lista de aluguéis!",
                aluguéis: resultado
            });
        });
    });
});

// Consultar um aluguel específico
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error, response: null });
        }
        conn.query("SELECT * FROM `aluguel` WHERE id = ?", [id], (error, resultado, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            res.status(200).send({
                mensagem: "Aqui está o aluguel!",
                aluguel: resultado
            });
        });
    });
});

// Adicionar um novo aluguel
router.post('/', (req, res, next) => {
    const {
        id_usuario, id_cliente, id_produto, quantidade, valor_unitario,
        total_dias, total_a_pagar, dias_atraso, valor_dias_atrasado, total_pago, data
    } = req.body;
    let msg = [];
    let i = 0;

    if (!validaNumero(quantidade)) {
        msg.push({ mensagem: "Quantidade inválida!" });
        i++;
    }
    if (!validaNumero(valor_unitario)) {
        msg.push({ mensagem: "Valor unitário inválido!" });
        i++;
    }
    if (!validaNumero(total_dias)) {
        msg.push({ mensagem: "Total de dias inválido!" });
        i++;
    }
    if (!validaNumero(total_a_pagar)) {
        msg.push({ mensagem: "Total a pagar inválido!" });
        i++;
    }
    if (!validaNumero(dias_atraso)) {
        msg.push({ mensagem: "Dias de atraso inválidos!" });
        i++;
    }
    if (!validaNumero(valor_dias_atrasado)) {
        msg.push({ mensagem: "Valor dos dias atrasados inválido!" });
        i++;
    }
    if (!validaNumero(total_pago)) {
        msg.push({ mensagem: "Total pago inválido!" });
        i++;
    }
    if (!data || isNaN(new Date(data).getTime())) {
        msg.push({ mensagem: "Data inválida!" });
        i++;
    }

    if (i === 0) {
        mysql.getConnection((error, conn) => {
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            conn.query(
                "INSERT INTO `aluguel` (id_usuario, id_cliente, id_produto, quantidade, valor_unitario, total_dias, total_a_pagar, dias_atraso, valor_dias_atrasado, total_pago, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [id_usuario, id_cliente, id_produto, quantidade, valor_unitario, total_dias, total_a_pagar, dias_atraso, valor_dias_atrasado, total_pago, data],
                (error, resultado, field) => {
                    conn.release();
                    if (error) {
                        return res.status(500).send({ error: error, response: null });
                    }
                    res.status(201).send({
                        mensagem: "Aluguel criado com sucesso!",
                        aluguelId: resultado.insertId
                    });
                }
            );
        });
    } else {
        res.status(400).send({ mensagem: msg });
    }
});

// Atualizar um aluguel existente
router.patch('/', (req, res, next) => {
    const {
        id, id_usuario, id_cliente, id_produto, quantidade, valor_unitario,
        total_dias, total_a_pagar, dias_atraso, valor_dias_atrasado, total_pago, data
    } = req.body;
    let msg = [];
    let i = 0;

    if (!validaNumero(quantidade)) {
        msg.push({ mensagem: "Quantidade inválida!" });
        i++;
    }
    if (!validaNumero(valor_unitario)) {
        msg.push({ mensagem: "Valor unitário inválido!" });
        i++;
    }
    if (!validaNumero(total_dias)) {
        msg.push({ mensagem: "Total de dias inválido!" });
        i++;
    }
    if (!validaNumero(total_a_pagar)) {
        msg.push({ mensagem: "Total a pagar inválido!" });
        i++;
    }
    if (!validaNumero(dias_atraso)) {
        msg.push({ mensagem: "Dias de atraso inválidos!" });
        i++;
    }
    if (!validaNumero(valor_dias_atrasado)) {
        msg.push({ mensagem: "Valor dos dias atrasados inválido!" });
        i++;
    }
    if (!validaNumero(total_pago)) {
        msg.push({ mensagem: "Total pago inválido!" });
        i++;
    }
    if (!data || isNaN(new Date(data).getTime())) {
        msg.push({ mensagem: "Data inválida!" });
        i++;
    }

    if (i === 0) {
        mysql.getConnection((error, conn) => {
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            conn.query(
                "UPDATE `aluguel` SET id_usuario = ?, id_cliente = ?, id_produto = ?, quantidade = ?, valor_unitario = ?, total_dias = ?, total_a_pagar = ?, dias_atraso = ?, valor_dias_atrasado = ?, total_pago = ?, data = ? WHERE id = ?",
                [id_usuario, id_cliente, id_produto, quantidade, valor_unitario, total_dias, total_a_pagar, dias_atraso, valor_dias_atrasado, total_pago, data, id],
                (error, resultado, field) => {
                    conn.release();
                    if (error) {
                        return res.status(500).send({ error: error, response: null });
                    }
                    res.status(200).send({
                        mensagem: "Aluguel atualizado com sucesso!"
                    });
                }
            );
        });
    } else {
        res.status(400).send({ mensagem: msg });
    }
});

// Deletar um aluguel
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error, response: null });
        }
        conn.query("DELETE FROM `aluguel` WHERE id = ?", [id], (error, resultado, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error, response: null });
            }
            res.status(200).send({
                mensagem: "Aluguel deletado com sucesso!"
            });
        });
    });
});

module.exports = router;
