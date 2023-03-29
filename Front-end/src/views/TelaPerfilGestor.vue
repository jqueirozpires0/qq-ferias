<template>
  <md-card>
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="true"
    ></loading>
    <div>
      <h1 style="padding-top: 20px; text-align: left">
        <md-icon style="padding-right: 20px" id="icon-superior"
          >dashboard</md-icon
        >Dashboard
        <md-button id="relatorio-button">Gerar Relatório</md-button>
      </h1>
      <div class="md-layout" style="margin-top: 3%">
        <div class="md-layout-item">
          <stats-card header-color="rose">
            <template slot="header">
              <div class="md-elevation-20 card-icon ferias">
                <md-icon class="icon-dash">hot_tub</md-icon>
              </div>
              <p class="category">Colaboradores Férias</p>
              <h3 class="title">{{ this.colaboradoresFerias.length }}</h3>
            </template>
          </stats-card>
        </div>
        <div class="md-layout-item">
          <stats-card>
            <template slot="header">
              <div class="md-elevation-20 card-icon trabalhando">
                <md-icon>work</md-icon>
              </div>
              <p class="category">Colaboradores Trabalhando</p>
              <h3 class="title">
                {{
                  this.colaboradores.length - this.colaboradoresFerias.length
                }}
              </h3>
            </template>
          </stats-card>
        </div>
        <div class="md-layout-item">
          <stats-card>
            <template slot="header">
              <div class="md-elevation-20 card-icon total">
                <md-icon>groups</md-icon>
              </div>
              <p class="category">Total Colaboradores</p>
              <h3 class="title">{{ this.colaboradores.length }}</h3>
            </template>
          </stats-card>
        </div>
      </div>
      <md-table v-model="paginatedUsers" class="table-gestor">
        <md-table-toolbar style="min-height: 1px">
          <h1 style="margin-inline: auto; margin-top: 1%">Equipe</h1>
        </md-table-toolbar>
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell style="width: 50%" md-label="Nome">{{
            item.nome
          }}</md-table-cell>
          <md-table-cell
            style="width: 50%"
            v-if="item.status == 'Férias'"
            md-label="Staus"
          >
            <div style="color: #df5951">Férias</div>
          </md-table-cell>
          <md-table-cell v-else md-label="Staus">
            <div style="color: #2c8e2a">Trabalhando</div>
          </md-table-cell>
        </md-table-row>
      </md-table>
      <h1 style="margin-top: 1%">Número de solicitações mensal</h1>
      <column-chart
        :colors="['#0F630A']"
        :data="[
          ['Janeiro', this.solicitacoes[0].quantidade],
          ['Fevereiro', this.solicitacoes[1].quantidade],
          ['Março', this.solicitacoes[2].quantidade],
          ['Abril', this.solicitacoes[3].quantidade],
          ['Maio', this.solicitacoes[4].quantidade],
          ['Junho', this.solicitacoes[5].quantidade],
          ['Julho', this.solicitacoes[6].quantidade],
          ['Agosto', this.solicitacoes[7].quantidade],
          ['Setembro', this.solicitacoes[8].quantidade],
          ['Outubro', this.solicitacoes[9].quantidade],
          ['Novembro', this.solicitacoes[10].quantidade],
          ['Dezembro', this.solicitacoes[11].quantidade],
        ]"
      ></column-chart>
    </div>
  </md-card>
</template>
<style>
#relatorio-button {
  float: right;
  background-color: #0f630a;
  margin-right: 30px;
  margin-top: -5px;
  color: #fff;
}
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
.icon-dash {
  font-size: 36px !important;
  line-height: 56px;
  width: 56px;
  height: 56px;
  text-align: center;
}
.trabalhando {
  background: rgb(88, 88, 88);
  background: linear-gradient(
    90deg,
    rgba(88, 88, 88, 1) 0%,
    rgba(38, 167, 42, 1) 35%,
    rgba(0, 150, 0, 1) 100%
  );
}

.ferias {
  background: rgb(92, 65, 65);
  background: linear-gradient(
    90deg,
    rgba(92, 65, 65, 1) 0%,
    rgba(255, 61, 61, 1) 35%,
    rgba(200, 0, 0, 1) 100%
  );
}

.total {
  background: rgb(92, 65, 65);
  background: linear-gradient(
    90deg,
    rgba(92, 65, 65, 1) 0%,
    rgba(255, 220, 61, 1) 35%,
    rgba(200, 144, 0, 1) 100%
  );
}

.card-icon {
  border-radius: 3px;
  padding: 15px;
  margin-top: -30px;
  margin-right: 15px;
  float: left;
}
.category {
  color: grey;
  font-size: 16px;
}
.title {
  margin-top: 0px;
}
@media (max-width: 1280px) {
  .md-layout {
    display: grid !important;
    margin-top: 5% !important;
  }
  .md-layout-item {
    width: 100%;
    margin-bottom: 2%;
    max-width: 80%;
  }
}
.table-gestor > .md-scrollbar {
  max-height: 250px;
}
</style>
<script>
import Vue from "vue";
import StatsCard from "@/components/StatsCard.vue";
import Loading from "vue-loading-overlay";
import "/node_modules/vue-loading-overlay/dist/vue-loading.css";
import axios from "axios";

export default {
  components: {
    StatsCard,
    Loading,
  },
  created() {
    this.getColaboradores();
    this.getSolicitacoesMensal();
  },
  data: () => ({
    isLoading: false,
    colaboradores: [],
    colaboradoresFerias: [],
    solicitacoes: [],
    paginatedUsers: [],
  }),
  methods: {
    async getColaboradoresFerias() {
      this.isLoading = true;
    },
    async getColaboradores() {
      this.isLoading = true;
      var nomes = [];
      axios
        .get("http://localhost:3000/todos-colaboradores-de-ferias-gestor")
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            {
              this.paginatedUsers.push({
                nome: res.data[i].col_collaborator.col_nome,
                status: "Férias",
              });
            }
            this.colaboradoresFerias.push({
              nome: res.data[i].col_collaborator.col_nome,
              status: "Férias",
            });
            nomes.push(this.colaboradoresFerias[i].nome);
          }
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
      axios
        .get("http://localhost:3000/colaboradores-de-gestor")
        .then((res) => {
          for (var index = 0; index < res.data.length; index++) {
            this.colaboradores.push({
              nome: res.data[index].col_nome,
            });
          }
          for (var i = 0; i < res.data.length; i++) {
            if (!nomes.includes(res.data[i].col_nome)) {
              this.paginatedUsers.push({
                nome: res.data[i].col_nome,
                status: "Trabalhando",
              });
            }
          }
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSolicitacoesMensal() {
      this.isLoading = true;
      axios
        .get("http://localhost:3000/todas-solicitacoes-mensal")
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            var mes = res.data[i];
            this.solicitacoes.push({
              quantidade: mes,
            });
          }
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
        });
    },
    aprovar() {
      Vue.toasted.success(
        "Férias Aprovadas! Uma notificação será enviada para o colaborador",
        {
          classnome: "success",
          duration: "7000",
          position: "bottom-right",
        }
      );
    },
    recusar() {
      Vue.toasted.error(
        "Férias Recusadas! Uma notificação será enviada para o colaborador",
        {
          classnome: "error",
          duration: "7000",
          position: "bottom-right",
        }
      );
    },
  },
};
</script>
