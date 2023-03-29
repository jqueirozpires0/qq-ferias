const express = require('express')
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const sequelize = require('./conection/dbqq')
const col_colaborador = require('./modules/col_colaborador')
const sol_solicitacoes = require('./modules/sol_solicitacoes')
const secret = 'secret';
cors = require('cors');
const porta = 3000
const blacklist = []
const moment = require('moment');

app.listen(porta, () => {
    console.log(`execução na porta => ${porta}...`)
})
app.use(express.json())

//---------------------------------------------------CORS--------------------------------------------//
app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') //aceita todos
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        )
        return res.status(200).send({})
    }
    next()
})

app.options('*', cors())

//------------------------------------------------------------------------------------------------//


//Verificação de token valido
function verificarJWT(req, res, next) {
    const token = req.headers.authorization || req.body.token || req.query.token;
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
}

//Load-Session
app.get('/load-session', (req, res) => {
    try {
        const token = req.headers
        console.log(req.headers)

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
})

//Login
app.post('/login', async function (req, res) {
    try {
        console.log(req)
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
})

//---------------------------------------Buscar todos colaboradores----------------------------------------//
app.get('/colaboradores', function (req, res) {
    console.log(req)
    col_colaborador.findAll().then((colaboradores) => {
        res.json(colaboradores);
    })
})
//------------------------------------------------------------------------------------------------------//

//-------------------------------Buscar todos os colaboradores vinculados ao gestor---------------------------//
app.get('/colaboradores-de-gestor', function (req, res) {
    // fetch('/load-session')
    //     .then((response) => response.json())
    //     .then((data) => {
    //         const userId = data.userId;
    //         // Use o ID do usuário para fazer outras solicitações
    //     });
    col_colaborador.findAll({
        where: {
            col_id_gestor: 5
        }
    }).then((colaboradores) => {
        res.json(colaboradores);
    })
})
//------------------------------------------------------------------------------------------------------//

//Deletar um colaborador específico (falta)
app.delete('/colaborador/:id', function (req, res) {
    try {
        if (!req.params.id) {
            res.status(400);
            res.send({ message: 'Informe o ID do produto!' });
            return;
        }

        let { id } = req.params;
        col_colaborador.get('/colaborador/:id').then((colaboradores) => {
            if (colaboradores) {
                colaboradores.isDeleted = true;
            } else
                res.status(404).send();
        })
    } catch (error) {

    }
})

//-----------------------------------Retornar um colaborador específico (falta)----------------------------------------//
app.get('/colaborador/:id', function (req, res) {
    let { id } = req.params;
    col_colaborador.findByPk(id).then((colaboradores) => {
        if (colaboradores) {
            res.json(colaboradores);
        } else
            res.status(404).send();
    })
})
//------------------------------------------------------------------------------------------------------//

//------------------------------------- Cadastro de um User (Colaborador)----------------------------------//
app.post('/cadastro', async (req, res) => {
    try {
        console.log(req.headers.authorization)
        const { col_nome, col_email, col_cpf, col_cnpj, col_contrato_tipo, col_matricula, col_senha, col_inicio_contrato, col_isFeriasLiberada, col_isGestor, col_isAdministrador, col_id_gestor, col_dias_ferias } = req.body;

        encryptedPassword = await bcrypt.hash(col_senha, 10);

        const colaborador = await col_colaborador.create({
            col_nome,
            col_email,
            col_cpf,
            col_cnpj,
            col_contrato_tipo,
            col_matricula,
            col_senha: encryptedPassword,
            col_inicio_contrato,
            col_isFeriasLiberada,
            col_isGestor,
            col_isAdministrador,
            col_id_gestor,
            col_dias_ferias
        });

        const token = jwt.sign(
            { userId: colaborador.col_id, col_email },
            secret,
            {
                expiresIn: "2h",
            }
        );

        colaborador.token = token;

        res.status(201).json(colaborador);
    } catch (err) {
        console.log(err);
    }
})
//------------------------------------------------------------------------------------------------------//
app.put('/colaboradores/:id', async (req, res) => {
    try {
        const { col_nome, col_email, col_cpf, col_cnpj, col_contrato_tipo, col_matricula, col_senha, col_inicio_contrato, col_isFeriasLiberada, col_isGestor, col_isAdministrador, col_id_gestor, col_dias_ferias } = req.body;

        // hash a senha novamente se a senha for alterada
        let encryptedPassword = null;
        if (col_senha) {
            encryptedPassword = await bcrypt.hash(col_senha, 10);
        }

        const colaborador = await col_colaborador.update({
            col_nome,
            col_email,
            col_cpf,
            col_cnpj,
            col_contrato_tipo,
            col_matricula,
            col_senha: encryptedPassword,
            col_inicio_contrato,
            col_isFeriasLiberada,
            col_isGestor,
            col_isAdministrador,
            col_id_gestor,
            col_dias_ferias
        }, {
            where: {
                col_id: req.params.id
            }
        });

        res.status(200).json(colaborador);
    } catch (err) {
        console.log(err);
    }
});
//-----------------------------------------Get em todos gestores----------------------------//
app.get('/gestores', function (req, res) {
    col_colaborador.findAll({
        where: {
            col_isGestor: true
        }
    }).then((gestores) => {
        res.json(gestores);
    });
})
//------------------------------------------------------------------------------------------------------//

//--------------------------------------Cadastro de solicitações-------------------------------------//
app.post('/cadastroSolicitacao', async (req, res) => {
    try {
        const { sol_dt_solicitacao , sol_inicio, sol_fim, sol_status, sol_isDecimo , sol_id_col} = req.body;
        const solicitacao = await sol_solicitacoes.create({
            sol_dt_solicitacao: moment(),
            sol_fim,
            sol_inicio,
            sol_isDecimo,
            sol_status: 'analise',
            sol_id_col                  /// id do colaborador logado
        }).then(() => {
            return res.json({
                mensagem: "Férias cadastrada",
            });

        }).catch((error) => {
            console.log(error)
            return res.status(400).json({
                mensagem: "Férias não foi cadastrada com sucesso!"
            });
        });

        return solicitacao
    } catch (error) {
        console.log(error)
    }
})

//------------------------------------------------------------------------------------------------------//

//----------------------------------------------Solicitações--------------------------------------------//
app.get('/solicitacoes', verificarJWT, function (req, res) {
    sol_solicitacoes.findAll({
        where: {
            sol_id_col: 4
        }
    }).then((solicitacoes) => {
        res.json(solicitacoes);
    }).catch((error) => {
        console.log(error, "Aqui")
    })
})

app.get('/solicitacoesTeste', function (req, res) {
    sol_solicitacoes.findAll({
        where: {
            sol_id_col: 4
        }
    }).then((solicitacoes) => {
        res.json(solicitacoes);
    })
})

//-------------------------------------------------------------------------------------------------------//
//------------------------------Todas solicitações da equipe de um gestor-----------------------------//
app.get('/todas-solicitacoes-analise-gestor', function (req, res) {
    try {
        sol_solicitacoes.findAll({
            include: [
                {
                    model: col_colaborador,
                    require: false
                }
            ]
            ,
            where: { '$col_collaborator.col_id_gestor$': '5', sol_status: 'analise' }
        }).then((solicitacoes) => {
            res.json(solicitacoes);
        }).catch((error) => {
            console.log("erro aqui", error)
        })
    } catch (error) {
        console.log("erro aqui", error)
    }
})

//------------------------------------------------------------------------------------------------------//

//------------------------------------------Solicitações do colaborador----------------------------------//
app.get('/todas-solicitacoes-colaborador', function (req, res) {
    try {
        sol_solicitacoes.findAll({
            include: [
                {
                    model: col_colaborador,
                    require: false
                }
            ]
            ,
            where: { '$col_collaborator.col_id$': '10' }
        }).then((solicitacoes) => {
            res.json(solicitacoes);
        }).catch((error) => {
            console.log("erro aqui", error)
        })
    } catch (error) {
        console.log("erro aqui", error)
    }
})
//------------------------------------------------------------------------------------------------------//

//------------------------------ Pegar périodo aquisitivo ----------------------------------//
app.get('/periodo-aquisitivo', function (req, res) {
    col_colaborador.findAll({
        where: {
            col_id: 17
        }
    }).then((colaboradores) => {
        var element = [];
        for (var i = 0; i < colaboradores.length; i++) {
            const contrato = moment(colaboradores[i].col_inicio_contrato).format('DD/MM');
            const diaAtual = moment().format('DD/MM')
            const inicioPeriodo = moment().subtract(1, 'months').format('DD/MM')

            if (moment(diaAtual, 'DD/MM').isAfter(moment(inicioPeriodo, 'DD/MM')) && moment(diaAtual, 'DD/MM').isBefore(moment(contrato, 'DD/MM')) && colaboradores[i].col_dias_ferias > 0) {
                element = colaboradores
            }
        }
        res.send(element)
    })
})
//------------------------------------------------------------------------------------------------------//

//--------------------------------Pegar quantidade de solicitações no mes---------------------------------//
app.get('/todas-solicitacoes-mensal', function (req, res) {
    try {
        sol_solicitacoes.findAll({
            include: [
                {
                    model: col_colaborador,
                    require: false
                }
            ]
            ,
            where: { '$col_collaborator.col_id_gestor$': '5', sol_status: 'analise' }
        }).then((solicitacoes) => {
            var janeiro = 0;
            var fevereiro = 0;
            var marco = 0;
            var abril = 0;
            var maio = 0;
            var junho = 0;
            var julho = 0;
            var agosto = 0;
            var outubro = 0;
            var setembro = 0;
            var novembro = 0;
            var dezembro = 0;
            for (let index = 0; index < solicitacoes.length; index++) {
                const element = solicitacoes[index];
                var mes = moment(element.sol_inicio).format("MM");
                if (mes == 01) {
                    janeiro++;
                }
                if (mes == 02) {
                    fevereiro++;
                }
                if (mes == 03) {
                    marco++;
                }
                if (mes == 04) {
                    abril++;
                }
                if (mes == 05) {
                    maio++;
                }
                if (mes == 06) {
                    junho++;
                }
                if (mes == 07) {
                    julho++;
                }
                if (mes == 08) {
                    agosto++;
                }
                if (mes == 09) {
                    setembro++;
                }
                if (mes == 10) {
                    outubro++;
                }
                if (mes == 11) {
                    novembro++;
                }
                if (mes == 12) {
                    dezembro++;
                }
            }

            res.json([janeiro, fevereiro, marco, abril, maio, junho, julho, agosto, setembro, outubro, novembro, dezembro])

        }).catch((error) => {
            console.log(error)
        })
    } catch (error) {
        console.log("erro aqui", error)
    }
})
//------------------------------------------------------------------------------------------------------//

//--------------------------------------Pegar colaboradores de férias-------------------------------------//
app.get('/todos-colaboradores-de-ferias-gestor', function (req, res) {
    try {
        sol_solicitacoes.findAll({
            include: [
                {
                    model: col_colaborador,
                    require: false
                }
            ]
            ,
            where: { '$col_collaborator.col_id_gestor$': '5' }
        }).then((solicitacoes) => {
            let element = [];
            for (var i = 0; i < solicitacoes.length; i++) {
                if (solicitacoes[i].sol_status === 'aprovado' && moment().isAfter(moment(solicitacoes[i].sol_inicio)) && moment().isBefore(moment(solicitacoes[i].sol_fim))) {
                    element.push(solicitacoes[i])

                }
            }
            res.json(element)
        }).catch((error) => {
            console.log("erro aqui", error)
        })
    } catch (error) {
        console.log("erro aqui", error)
    }
})
//------------------------------------------------------------------------------------------------------//

//--------------------------------------Férias do colaborador---------------------------------------------//
app.get('/colaboradores-e-suas-ferias', function (req, res) {
    try {
        col_colaborador.findAll({
            include: [
                {
                    model: sol_solicitacoes,
                    require: false
                }
            ]
            ,
            where: { '$col_collaborator.col_id_gestor$': '5' }
        }).then((solicitacoes) => {
            function compare(a, b) {
                return b.data - a.data;
            }
            let element = [];
            for (var index = 0; index < solicitacoes.length; index++) {
                for (var i = 0; i < solicitacoes[index].req_requests.length; i++) {
                    const diaAtual = moment();
                    const inicioPeriodo = moment(solicitacoes[index].req_requests[i].sol_fim).add(2, 'years');
                    if (solicitacoes[index].req_requests[i].sol_status == 'aprovado' && inicioPeriodo.diff(diaAtual, 'days') < 60) {
                        element.push({ nome: solicitacoes[index].col_nome, data: moment(solicitacoes[index].req_requests[i].sol_fim), dias: solicitacoes[index].col_dias_ferias })
                    }
                }
            }
            element = element.sort(compare);
            const objetosUnicos = Object.values(element.reduce((acc, objeto) => {
                if (!acc[objeto.nome]) {
                    acc[objeto.nome] = objeto;
                }
                return acc;
            }, {}));
            res.send(objetosUnicos)

        }).catch((error) => {
            console.log("erro aqui", error)
        })
    } catch (error) {
        console.log("erro aqui", error)
    }
})
//------------------------------------------------------------------------------------------------------//

//---------------------------------------Aprovar férias--------------------------------------------------//
app.put('/aprovar-ferias/:id', async function (req, res) {
    try {
        const id = req.params.id;
        const solicitacao = await sol_solicitacoes.findOne({
            where: {
                sol_id: 35
            }
        });

        if (solicitacao && solicitacao.sol_status === 'analise') {
            solicitacao.sol_status = 'aprovado';
            await solicitacao.save();
            res.status(200).send("Solicitação aprovada");
        } else {
            res.status(404).send("Solicitação não encontrada ou já aprovada");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Erro interno do servidor");
    }
})
//------------------------------------------------------------------------------------------------------//

//----------------------------------------Reprovar férias--------------------------------------------------//
app.put('/reprovar-ferias/:id', async function (req, res) {
    try {
        const id = req.params.id;
        const solicitacao = await sol_solicitacoes.findOne({
            where: {
                sol_id: 53
            }
        });

        if (solicitacao && solicitacao.sol_status === 'analise') {
            solicitacao.sol_status = 'reprovado';
            await solicitacao.save();
            res.status(200).send("Solicitação reprovada");
        } else {
            res.status(404).send("Solicitação não encontrada ou já reprovada");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Erro interno do servidor");
    }
})
//------------------------------------------------------------------------------------------------------//