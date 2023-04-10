const secret = 'secret';

module.exports = class Auth {
    async loadSession(req, res) {
        const jwt = require("jsonwebtoken");
        try {
            const token = req.headers.authorization.split(' ')[1]

            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    console.log(err)
                    res.status(401).send({ message: 'Sua sessão é inválida ou está expirada' })
                    return
                }

                res.status(200).send({
                    token,
                    colaborador: decoded
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    async login(req, res) {
        const bcrypt = require('bcrypt')
        const jwt = require("jsonwebtoken");
        const col_colaborador = require('../modules/col_colaborador')
        try {
            const { email, senha } = req.body;
            const colaborador = await col_colaborador.findOne({
                where: {
                    col_email: email
                }
            });
            const confirmarSenha = await bcrypt.compare(senha, colaborador.col_senha)

            if (!colaborador) {
                return res.status(500).json({ message: 'Email não encontrado' })
            }
            else if (!confirmarSenha) {
                return res.status(500).json({ message: 'Senha incorreta' })
            } else {
                const token = jwt.sign(colaborador.toJSON(), secret, { expiresIn: '2h' });
                res.json({ colaborador, token });
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Error no login' })
        }
    }

}