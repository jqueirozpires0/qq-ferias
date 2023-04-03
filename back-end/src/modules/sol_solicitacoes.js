const Sequelize = require('sequelize')
const db = require('../conection/dbqq')
const col_colaborador = require('./col_colaborador')

const sol_solicitacoes = db.define('req_request', {
    sol_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    sol_dt_solicitacao: {
        type: Sequelize.DATE,
        allowNull: false
    },
    sol_inicio: {
        type: Sequelize.DATE,
        allowNull: false
    },
    sol_fim: {
        type: Sequelize.DATE,
        allowNull: false
    },
    sol_status: {
        type: Sequelize.ENUM("aprovado", "reprovado", "analise"),
        allowNull: false
    },
    sol_isDecimo: {
        type: Sequelize.BOOLEAN,
    }
})

sol_solicitacoes.belongsTo(col_colaborador, {
    constraint: true,
    foreignKey: 'sol_id_col'
})
col_colaborador.hasMany(sol_solicitacoes, {
    foreignKey: 'sol_id_col' 
})

// sol_solicitacoes.belongsTo(col_colaborador, {
//     constraint: true,
//     foreignKey: 'sol_id_gestor'
// })
// col_colaborador.hasMany(sol_solicitacoes, {
//     foreignKey: 'sol_id_gestor' 
// })

//sol_solicitacoes.sync({force: true})


module.exports = sol_solicitacoes;