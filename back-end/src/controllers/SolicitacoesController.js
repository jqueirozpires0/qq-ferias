module.exports = class Solicitacoes {

    async cadastroSolicitacoes(req, res) {
        const moment = require('moment');
        const sol_solicitacoes = require('../modules/sol_solicitacoes')
        const col_colaborador = require('../modules/col_colaborador')
        try {
            const id = req.decoded.col_id
            const diasDisponiveis = req.decoded.col_dias_ferias
            if (diasDisponiveis == 0) {
                throw new Error("Colaborador sem dias disponiveis");
            } else {
                sol_solicitacoes.findAll({
                    include: [
                        {
                            model: col_colaborador,
                            require: false
                        }
                    ]
                    ,
                    where: { '$col_collaborator.col_id$': id }
                }).then(async (solicitacoes) => {
                    var tempoFerias = 0;
                    var quantidadeFerias = 0;
                    for (var index = 0; index < solicitacoes.length; index++) {
                        if (solicitacoes[index].sol_status == 'aprovado' && moment(solicitacoes[index].sol_inicio).format('YYYY') == moment().format('YYYY')) {
                            quantidadeFerias++
                            tempoFerias += moment(solicitacoes[index].sol_fim).diff(moment(solicitacoes[index].sol_inicio), 'days')
                        }
                    }
                    const { sol_inicio, sol_fim, sol_isDecimo } = req.body;
                    if ((quantidadeFerias > 3 && tempoFerias > 15)) {
                        throw new Error("Tempo de férias não respeita as regras do sistema 1");
                    }
                    else if (tempoFerias == 15 && quantidadeFerias == 3 && moment(req.body.sol_fim).diff(moment(req.body.sol_inicio), 'days') != 15) {
                        throw new Error("Tempo de férias não respeita as regras do sistema 2");
                    }
                    else if (moment(req.body.sol_fim).diff(moment(req.body.sol_inicio), 'days') > diasDisponiveis) {
                        throw new Error("Férias maiores que o permitido");
                    }
                    else if (moment(req.body.sol_fim).diff(moment(req.body.sol_inicio), 'days') % 5 != 0) {
                        throw new Error("Férias não então com 5, 10, 15, 20 ou 30 dias");
                    }
                    else {
                        await sol_solicitacoes.create({
                            sol_dt_solicitacao: moment().add(1, 'hours'),
                            sol_fim,
                            sol_inicio,
                            sol_isDecimo,
                            sol_status: 'analise',
                            sol_id_col: id                  /// id do colaborador logado
                        }).then((solicitacao) => {
                            return res.json({
                                solicitacao
                            })
                        }).catch((error) => {
                            return error
                        })
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    async solicitacoesAnaliseEquipe(req, res) {
        const col_colaborador = require('../modules/col_colaborador')
        const sol_solicitacoes = require('../modules/sol_solicitacoes')
        try {
            const id = req.decoded.col_id_gestor
            sol_solicitacoes.findAll({
                include: [
                    {
                        model: col_colaborador,
                        require: false
                    }
                ]
                ,
                where: { '$col_collaborator.col_id_gestor$': id, sol_status: 'analise' }
            }).then((solicitacoes) => {
                res.json(solicitacoes);
            }).catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async solicitacoesColaborador(req, res) {
        const col_colaborador = require('../modules/col_colaborador')
        const sol_solicitacoes = require('../modules/sol_solicitacoes')
        try {
            const id = req.decoded.col_id
            sol_solicitacoes.findAll({
                include: [
                    {
                        model: col_colaborador,
                        require: false
                    }
                ]
                ,
                where: { '$col_collaborator.col_id$': id }
            }).then((solicitacoes) => {
                res.json(solicitacoes);
            }).catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async solicitacoesAnaliseGestor(req, res) {
        const col_colaborador = require('../modules/col_colaborador')
        const sol_solicitacoes = require('../modules/sol_solicitacoes')
        try {
            const id = req.decoded.col_id
            sol_solicitacoes.findAll({
                include: [
                    {
                        model: col_colaborador,
                        require: false
                    }
                ]
                ,
                where: { '$col_collaborator.col_id_gestor$': id, sol_status: 'analise' }
            }).then((solicitacoes) => {
                res.json(solicitacoes);
            }).catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async solicitacoesMensais(req, res) {
        const moment = require('moment');
        const col_colaborador = require('../modules/col_colaborador')
        const sol_solicitacoes = require('../modules/sol_solicitacoes')
        const id = req.decoded.col_id
        try {
            sol_solicitacoes.findAll({
                include: [
                    {
                        model: col_colaborador,
                        require: false
                    }
                ]
                ,
                where: { '$col_collaborator.col_id_gestor$': id, sol_status: 'analise' }
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
                    if (mes == 1) {
                        janeiro++;
                    }
                    if (mes == 2) {
                        fevereiro++;
                    }
                    if (mes == 3) {
                        marco++;
                    }
                    if (mes == 4) {
                        abril++;
                    }
                    if (mes == 5) {
                        maio++;
                    }
                    if (mes == 6) {
                        junho++;
                    }
                    if (mes == 7) {
                        julho++;
                    }
                    if (mes == 8) {
                        agosto++;
                    }
                    if (mes == 9) {
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
            console.log(error)
        }
    }

    async equipeFerias(req, res) {
        const moment = require('moment');
        const col_colaborador = require('../modules/col_colaborador')
        const sol_solicitacoes = require('../modules/sol_solicitacoes')
        const id = req.decoded.col_id
        try {
            sol_solicitacoes.findAll({
                include: [
                    {
                        model: col_colaborador,
                        require: false
                    }
                ]
                ,
                where: { '$col_collaborator.col_id_gestor$': id }
            }).then((solicitacoes) => {
                let element = [];
                for (var i = 0; i < solicitacoes.length; i++) {
                    if (solicitacoes[i].sol_status === 'aprovado' && moment().isAfter(moment(solicitacoes[i].sol_inicio)) && moment().isBefore(moment(solicitacoes[i].sol_fim))) {
                        element.push(solicitacoes[i])

                    }
                }
                res.json(element)
            }).catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
    }

    async aprovarFerias(req, res) {
        const moment = require('moment');
        const col_colaborador = require('../modules/col_colaborador')
        const sol_solicitacoes = require('../modules/sol_solicitacoes')
        try {
            const idSolicitacao = req.params.id;
            const solicitacao = await sol_solicitacoes.findOne({
                where: {
                    sol_id: idSolicitacao
                }
            });

            var idColaborador = solicitacao.sol_id_col

            const colaborador = await col_colaborador.findOne({
                where: {
                    col_id: idColaborador
                }
            })
            colaborador.col_dias_ferias = (colaborador.col_dias_ferias - moment(solicitacao.sol_fim).diff(moment(solicitacao.sol_inicio), 'days'));
            await colaborador.save()

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
    }

    async reprovarFerias(req, res) {
        const sol_solicitacoes = require('../modules/sol_solicitacoes')
        try {
            const idSolicitacao = req.params.id
            const solicitacao = await sol_solicitacoes.findOne({
                where: {
                    sol_id: idSolicitacao
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
    }

}