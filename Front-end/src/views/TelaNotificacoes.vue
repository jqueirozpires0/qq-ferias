<template>
  <md-card>
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="true"
    ></loading>
    <div>
      <md-table v-model="solicitacoesEquipe" id="table-solicitacoes">
        <md-table-toolbar>
          <h1 style="margin-inline: auto">Solicitações</h1>
        </md-table-toolbar>
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell style="width: 30%" md-label="Nome">{{
            item.nome
          }}</md-table-cell>
          <md-table-cell style="width: 30%" md-label="Solicitação">{{
            item.solicitacao
          }}</md-table-cell>
          <md-table-cell style="width: 30%" md-label="Ações">
            <md-button @click="aprovar(item)">
              <md-icon style="color: #2c8e2a">how_to_reg</md-icon>
              <md-tooltip md-direction="bottom">Aprovar</md-tooltip>
            </md-button>
            <md-button @click="recusar(item)">
              <md-icon style="color: #df5951">close</md-icon>
              <md-tooltip md-direction="bottom">Recusar</md-tooltip>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
      <md-table v-model="periodoAquisitivoEquipe" id="table-avisos">
        <md-table-toolbar>
          <h1 style="margin-inline: auto">Avisos</h1>
        </md-table-toolbar>
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell style="width: 50%" md-label="Nome">{{
            item.nome
          }}</md-table-cell>
          <md-table-cell style="width: 50%" md-label="Aviso">{{
            item.mensagem
          }}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </md-card>
</template>
<style>
#table-solicitacoes > .md-scrollbar {
  max-height: 400px;
}
#table-avisos > .md-scrollbar {
  max-height: 400px;
}
</style>
<script>
import Vue from "vue";
import axios from "axios";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "/node_modules/vue-loading-overlay/dist/vue-loading.css";

export default {
  components: {
    Loading,
  },
  created() {
    this.getSolicitacaoGestor();
    this.getColaboradoresSemFerias();
  },
  data: () => ({
    isLoading: false,
    paginatedUsers: [],
    solicitacoesEquipe: [],
    periodoAquisitivoEquipe: [],
  }),
  methods: {
    async getSolicitacaoGestor() {
      this.isLoading = true;
      this.solicitacoesEquipe = [];
      axios
        .get("http://localhost:3000/todas-solicitacoes-analise-gestor")
        .then((res) => {
          this.isLoading = false;
          for (var i = 0; i < res.data.length; i++) {
            this.solicitacoesEquipe.push({
              nome: res.data[i].col_collaborator.col_nome,
              solicitacao:
                "Início: " +
                moment(res.data[i].sol_inicio).format("DD/MM/YYYY") +
                " <-> Fim: " +
                moment(res.data[i].sol_fim).format("DD/MM/YYYY"),
            });
          }
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
        });
    },
    async getColaboradoresSemFerias() {
      this.isLoading = true;
      axios
        .get("http://localhost:3000/colaboradores-e-suas-ferias")
        .then((res) => {
          this.isLoading = false;
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].dias == 30)
              this.periodoAquisitivoEquipe.push({
                nome: res.data[i].nome,
                mensagem: "Colaborador prestes a acumular 2 anos sem férias",
              });
          }
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
        });
    },
    async aprovar(item) {
      this.isLoading = true;
      axios
        .put("http://localhost:3000/aprovar-ferias/" + item.id)
        .then((res) => {
          this.isLoading = false;
          Vue.toasted.success(
            "Férias Aprovadas! Uma notificação será enviada para o colaborador",
            {
              classnome: "success",
              duration: "7000",
              position: "bottom-right",
            }
          );
          this.$router.push({ name: "Perfil Gestor" });
          return res;
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
        });
    },
    async recusar(item) {
      this.isLoading = true;
      axios
        .put("http://localhost:3000/reprovar-ferias/" + item.id)
        .then((res) => {
          this.isLoading = false;
          Vue.toasted.error(
            "Férias Recusadas! Uma notificação será enviada para o colaborador",
            {
              classnome: "error",
              duration: "7000",
              position: "bottom-right",
            }
          );
          this.$router.push({ name: "Perfil Gestor" });
          return res;
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
        });
    },
  },
};
</script>
