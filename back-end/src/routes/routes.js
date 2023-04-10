const express = require('express')
const app = express();
const jwt = require("jsonwebtoken");
const secret = 'secret';
const Colaborador = require("../controllers/ColaboradorController")
const colaborador = new Colaborador();
const Auth = require("../controllers/AuthController")
const auth = new Auth();
const Solicitacao = require("../controllers/SolicitacoesController")
const solicitacao = new Solicitacao()

function verificarJWT(req, res, next) {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    } else {
        throw new Error("Token invalido");
    }
}


//Colaborador
app.get('/colaboradorById/:id', colaborador.getColaboradorById)
app.get('/info-colaborador',verificarJWT, colaborador.infoColaborador)
app.get('/info-gestor',verificarJWT, colaborador.infoGestor)
app.get('/colaboradores',verificarJWT, colaborador.colaboradores)
app.get('/gestores',verificarJWT, colaborador.gestores)
app.get('/periodo-aquisitivo',verificarJWT, colaborador.periodoAquisitivo)
app.get('/colaboradores-e-suas-ferias',verificarJWT, colaborador.feriasColaboradores)
app.get('/colaboradores-de-gestor',verificarJWT, colaborador.colaboradoresDeUmGestor)
app.delete('/colaborador/:id',verificarJWT, colaborador.deleteColaborador)
app.put('/colaborador/:id',verificarJWT, colaborador.editColaborador)
app.post('/cadastro',verificarJWT, colaborador.cadastroColaborador)

//Auth
app.get('/load-session', auth.loadSession)
app.post('/login', auth.login)

//Solicitações
app.post('/cadastroSolicitacao',verificarJWT, solicitacao.cadastroSolicitacoes)
app.get('/todas-solicitacoes-analise-equipe',verificarJWT, solicitacao.solicitacoesAnaliseEquipe)
app.get('/todas-solicitacoes-colaborador',verificarJWT, solicitacao.solicitacoesColaborador)
app.get('/todas-solicitacoes-analise-gestor',verificarJWT, solicitacao.solicitacoesAnaliseGestor)
app.get('/todas-solicitacoes-mensal',verificarJWT, solicitacao.solicitacoesMensais)
app.get('/todos-colaboradores-de-ferias-gestor',verificarJWT, solicitacao.equipeFerias)
app.put('/aprovar-ferias/:id',verificarJWT, solicitacao.aprovarFerias)
app.put('/reprovar-ferias/:id',verificarJWT, solicitacao.reprovarFerias)

module.exports = app;