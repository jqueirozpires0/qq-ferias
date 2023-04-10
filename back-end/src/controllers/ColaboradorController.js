const secret = 'secret';

module.exports = class Colaborador {

    async getColaboradorById(req, res){
        const col_colaborador = require('../modules/col_colaborador')
        const idUser = req.params.id
        col_colaborador.findOne({
            where: {
                col_id: idUser
            }
        }).then((colaboradores) => {
            res.send(colaboradores)
        })
    }

    async infoColaborador(req, res) {
        const col_colaborador = require('../modules/col_colaborador')
        const idUser = req.decoded.col_id
        col_colaborador.findOne({
            where: {
                col_id: idUser
            }
        }).then((colaboradores) => {
            res.send(colaboradores)
        })
    }

    async infoGestor(req, res) {
        const col_colaborador = require('../modules/col_colaborador')
        const idUser = req.decoded.col_id_gestor
        col_colaborador.findOne({
            where: {
                col_id: idUser
            }
        }).then((gestor) => {
            res.send(gestor)
        });
    }

    async colaboradores(req, res) {
        const col_colaborador = require('../modules/col_colaborador')
        col_colaborador.findAll().then((colaboradores) => {
            res.json(colaboradores);
        })
    }

    async gestores(req, res) {
        const col_colaborador = require('../modules/col_colaborador')
        col_colaborador.findAll({
            where: {
                col_isGestor: true
            }
        }).then((gestores) => {
            res.json(gestores);
        });
    }

    async periodoAquisitivo(req, res) {
        const moment = require('moment');
        const col_colaborador = require('../modules/col_colaborador')
        const id = req.decoded.col_id
        col_colaborador.findAll({
            where: {
                col_id: id
            }
        }).then((colaboradores) => {
            var element = [];
            for (var i = 0; i < colaboradores.length; i++) {
                const contrato = moment(colaboradores[i].col_inicio_contrato).format('DD/MM');
                const diaAtual = moment().format('DD/MM')
                const inicioPeriodo = moment(colaboradores[i].col_inicio_contrato).subtract(1, 'months').format('DD/MM')

                if (moment(diaAtual, 'DD/MM').isAfter(moment(inicioPeriodo, 'DD/MM')) && moment(diaAtual, 'DD/MM').isBefore(moment(contrato, 'DD/MM')) && colaboradores[i].col_dias_ferias > 0) {
                    element = colaboradores
                }
            }
            res.send(element)
        })

    }

    async feriasColaboradores(req, res) {
        const col_colaborador = require('../modules/col_colaborador')
        const sol_solicitacoes = require('../modules/sol_solicitacoes')
        const moment = require('moment');
        const id = req.decoded.col_id
        try {
            col_colaborador.findAll({
                include: [
                    {
                        model: sol_solicitacoes,
                        require: false
                    }
                ]
                ,
                where: { '$col_collaborator.col_id_gestor$': id }
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
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async colaboradoresDeUmGestor(req, res) {
        const col_colaborador = require('../modules/col_colaborador')
        const id = req.decoded.col_id
        col_colaborador.findAll({
            where: {
                col_id_gestor: id
            }
        }).then((colaboradores) => {
            res.json(colaboradores);
        })
    }

    async deleteColaborador(req, res) {
        const col_colaborador = require('../modules/col_colaborador')
        try {
            let { id } = req.params;
            col_colaborador.destroy({
                where: {
                    col_id: id
                }
            }).then((colaboradores) => {
                res.status(200).send('Colaborador excluído com sucesso.');
            }).catch((error) => {
                res.status(500).send('Erro ao processar a requisição.');
            })
        } catch (error) {
            console.log(error)
        }
    }

    async editColaborador(req, res) {
        const bcrypt = require('bcrypt');
        const col_colaborador = require('../modules/col_colaborador')
        let { id } = req.params;
        const colaborador = col_colaborador.findOne({
            where: {
                col_id: id
            }
        }).then(async (colaborador) => {
            if (colaborador) {
                const encryptedPassword = await bcrypt.hash(req.body.col_senha, 10);

                colaborador.col_nome = req.body.col_nome,
                    colaborador.col_email = req.body.col_email,
                    colaborador.col_cpf = req.body.col_cpf,
                    colaborador.col_cnpj = req.body.col_cnpj,
                    colaborador.col_contrato_tipo = req.body.col_contrato_tipo,
                    colaborador.col_matricula = req.body.col_matricula,
                    colaborador.col_senha = encryptedPassword,
                    colaborador.col_inicio_contrato = req.body.col_inicio_contrato,
                    colaborador.col_isFeriasLiberada = req.body.col_isFeriasLiberada,
                    colaborador.col_isGestor = req.body.col_isGestor,
                    colaborador.col_isAdministrador = req.body.col_isAdministrador,
                    colaborador.col_id_gestor = req.body.col_id_gestor,
                    colaborador.col_dias_ferias = req.body.col_dias_ferias
                await colaborador.save();

                res.json(colaborador);
            } else
                res.status(404).send();
        })
    }

    async cadastroColaborador(req, res) {
        const jwt = require("jsonwebtoken");
        const bcrypt = require('bcrypt');
        const col_colaborador = require('../modules/col_colaborador')
        try {
            const { col_nome, col_email, col_cpf, col_cnpj, col_contrato_tipo, col_matricula, col_senha, col_inicio_contrato, col_isFeriasLiberada, col_isGestor, col_isAdministrador, col_id_gestor, col_dias_ferias } = req.body;
            
            const encryptedPassword = await bcrypt.hash(col_senha, 10);

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
    }

}