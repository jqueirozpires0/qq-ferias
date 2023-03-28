<template>
  <md-card>
    <div>
      <h1 style="padding-top: 20px; text-align: left">
        <md-icon style="padding-right: 20px" id="icon-superior"
          >account_box</md-icon
        >Pefil Colaborador
      </h1>
      <md-content class="info-perfil">
        <h2>Nome</h2>
        <h3>Marcelo Calado</h3>
        <h2>Gestor responsável</h2>
        <h3>Allan Tubarão</h3>
        <h2>Dias disponíveis para férias</h2>
        <h3>{{ diasDisponiveis }} Dias</h3>
      </md-content>
      <md-table v-model="solicitacoes">
        <md-table-toolbar>
          <h2 style="margin-inline: auto; padding-top: 50px">
            Histórico solicitações
          </h2>
        </md-table-toolbar>
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell style="width: 30%" md-label="Data da solicitação">{{
            item.data
          }}</md-table-cell>
          <md-table-cell style="width: 30%" md-label="Solicitação">{{
            item.solicitacao
          }}</md-table-cell>
          <md-table-cell
            style="width: 30%"
            v-if="item.status == 'aprovada'"
            md-label="Staus"
          >
            <md-icon style="color: #2c8e2a">done</md-icon>
            <md-tooltip md-direction="bottom"
              >Aprovada</md-tooltip
            ></md-table-cell
          >
          <md-table-cell
            style="width: 30%"
            v-if="item.status == 'analise'"
            md-label="Staus"
          >
            <md-icon style="color: #f4f75f">psychology_alt</md-icon>
            <md-tooltip md-direction="bottom"
              >Em análise</md-tooltip
            ></md-table-cell
          >
          <md-table-cell v-else md-label="Staus">
            <md-icon style="color: #df5951">close</md-icon>
            <md-tooltip md-direction="bottom"
              >Reprovada</md-tooltip
            ></md-table-cell
          >
        </md-table-row>
      </md-table>
      <md-table
        v-model="periodoAquisitivo"
      >
        <md-table-toolbar>
          <h2 style="margin-inline: auto; padding-top: 50px">Avisos</h2>
        </md-table-toolbar>
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell style="width: 50%" md-label="Informação">{{
            item.mensagem
          }}</md-table-cell>
          <md-table-cell style="width: 50%" md-label="Data">{{
            item.data
          }}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </md-card>
</template>
<style>
.info-perfil {
  width: 50%;
  height: 200px;
  margin-top: 20px;
  border: none;
  display: grid;
  border-radius: 50px;
  background-color: rgb(247, 247, 247) !important;
  margin-inline: auto;
  padding-top: 5px;
}

.solicitacoes-vazia {
  height: 200px;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
<script>
import Vue from "vue";
import axios from "axios";
import moment from "moment";
export default {
  created() {
    this.getSolicitacoes();
    this.getPeriodoAquisitivo();
  },
  data: () => ({
    diasDisponiveis: 30,
    solicitacoes: [],
    periodoAquisitivo: [],
  }),
  methods: {
    async getPeriodoAquisitivo() {
      axios
        .get("http://localhost:3000/periodo-aquisitivo")
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            console.log(res)
            this.periodoAquisitivo.push({
              mensagem: "Você está prestes a renovar seu período aquisitivo ",
              data: moment(res.data[i].col_inicio_contrato).format("DD/MM"),
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSolicitacoes() {
      axios
        .get("http://localhost:3000/todas-solicitacoes-colaborador")
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            this.solicitacoes.push({
              data: moment(res.data[i].sol_dt_solicitacao).format("DD/MM/YYYY"),
              solicitacao:
                "Início: " +
                moment(res.data[i].sol_inicio).format("DD/MM/YYYY") +
                " <-> Fim: " +
                moment(res.data[i].sol_fim).format("DD/MM/YYYY"),
              status: res.data[i].sol_status,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    aprovar() {
      Vue.toasted.success(
        "Férias Aprovadas! Uma notificação será enviada para o colaborador",
        {
          className: "success",
          duration: "7000",
          position: "bottom-right",
        }
      );
    },
    recusar() {
      Vue.toasted.error(
        "Férias Recusadas! Uma notificação será enviada para o colaborador",
        {
          className: "error",
          duration: "7000",
          position: "bottom-right",
        }
      );
    },
  },
};
</script>
