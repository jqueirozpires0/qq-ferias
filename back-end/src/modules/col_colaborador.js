const Sequelize = require('sequelize')
const db = require('../conection/dbqq')

const col_colaborador = db.define('col_collaborator', {
    col_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    col_nome: {
        type: Sequelize.STRING(70),
        allowNull: false
    },
    col_email: {
        type: Sequelize.STRING(70),
        unique: true,
        allowNull: false
    },
    col_cpf: {
        type: Sequelize.STRING(14),
        unique: true
    },
    col_cnpj: {
        type: Sequelize.STRING(20),
        unique: true
    },
    col_contrato_tipo: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    col_matricula: {
        type: Sequelize.STRING(14),
        allowNull: false,
        unique: true
    },
    col_senha: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    col_inicio_contrato: {
        type: Sequelize.DATE,
        allowNull: false
    },
    col_isFeriasLiberada: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    col_isGestor: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    col_dias_ferias: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    col_id_gestor:{
        type:Sequelize.INTEGER,
    },
    col_isAdministrador: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
})

col_colaborador.belongsTo(col_colaborador, { constraint: true, foreignKey: 'col_id_gestor' })

//col_colaborador.sync({force: true})


module.exports = col_colaborador;