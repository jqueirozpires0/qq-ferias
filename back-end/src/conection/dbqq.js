const Sequelize = require('sequelize')
const sequelize = new Sequelize('980174', '980174', '980174', {
    host: 'qqtech4.crqc50gxdjpu.sa-east-1.rds.amazonaws.com',
    dialect: 'postgresql',
    schema: 'public',
    define: {
        createdAt: false, //nao buscar esse campo
        updatedAt: false, //nao buscar esse campo tb
    }
})

sequelize.authenticate().then(function () { console.log('conexão ok!') }).catch(function () { console.log('Deu ruim!!') })

module.exports = sequelize;