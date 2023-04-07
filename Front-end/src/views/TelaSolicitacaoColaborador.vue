<template>
  <md-card>
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="true"
    ></loading>
    <h1 style="padding-top: 20px">Agendamento de férias</h1>
    <form autocomplete="off" @submit.prevent="solicitar()" method="post">
      <div class="md-layout" id="agendamento-layout" style="padding-top: 20px">
        <div class="div-solicitacoes">
          <md-field>
            <label class="tempo-data">Início:</label>
            <md-input
              required
              type="date"
              class="form-control"
              max="2023-12-31"
              id="nome"
              v-model="solicitacoes.inicio"
              name="nome"
            ></md-input>
          </md-field>
        </div>
        <div class="div-solicitacoes">
          <md-field>
            <label class="tempo-data">Fim:</label>
            <md-input
              required
              type="date"
              class="form-control"
              max="2023-12-31"
              id="fim"
              v-model="solicitacoes.fim"
              name="fim"
            ></md-input>
          </md-field>
        </div>
        <md-button
          @click="handleSolicitacao()"
          style="margin-top: 20px"
          class="md-raised"
          >Solicitar</md-button
        >
      </div>
    </form>
    <div>
      <md-table v-model="paginatedUsers">
        <md-table-toolbar>
          <h1 style="margin-inline: auto">
            Período de solicitações da sua equipe
          </h1>
        </md-table-toolbar>
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell style="width: 30%" md-label="Nome">{{
            item.nome
          }}</md-table-cell>
          <md-table-cell
            style="color: #2c8e2a; width: 30%"
            md-label="Solicitações"
            >{{ item.solicitacao }}</md-table-cell
          >
          <md-table-cell md-label="Status">
            <md-icon style="color: #f4f75f; width: 30%">psychology_alt</md-icon>
            <md-tooltip md-direction="bottom">Em análise</md-tooltip>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </md-card>
</template>

<script>
import Vue from "vue";
import api from "@/modules/services/api";
import Swal from "sweetalert2";
import Loading from "vue-loading-overlay";
import "/node_modules/vue-loading-overlay/dist/vue-loading.css";
import moment from "moment";
import axios from "axios";
export default {
  created() {
    this.getSolicitacaoGestor();
    this.getInfoColaborador();
    this.getInfoGestor();
    this.paginatedUsers = this.solicitacoesEquipe;
  },
  components: {
    Loading,
  },
  data: () => ({
    isLoading: false,
    solicitacoesEquipe: [],
    paginatedUsers: [],
    tipoContrato: "",
    emailParaEnviar: "",
    solicitacoes: {
      inicio: "",
      dias: "",
      fim: "",
      isDecimo: "",
    },
  }),
  methods: {
    async getInfoGestor() {
      api
        .get("info-gestor")
        .then((res) => {
          this.emailParaEnviar = res.data.col_email;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getInfoColaborador() {
      api
        .get("info-colaborador")
        .then((res) => {
          this.tipoContrato = res.data.col_contrato_tipo;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSolicitacaoGestor() {
      api
        .get("todas-solicitacoes-analise-equipe")
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].sol_status == "analise") {
              this.solicitacoesEquipe.push({
                nome: res.data[i].col_collaborator.col_nome,
                solicitacao:
                  "Início: " +
                  moment(res.data[i].sol_inicio).format("DD/MM/YYYY") +
                  " <-> Fim: " +
                  moment(res.data[i].sol_fim).format("DD/MM/YYYY"),
                status: "Em Análise",
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async emailGestor() {
      try {
        var colaborador = JSON.parse(localStorage.getItem("colaborador"));
        const email = {
          assunto: "Solicitação de férias",
          mensagem:
            "Colaborador " +
            colaborador.col_nome +
            " realizou uma solicitação de férias, uma notificação foi gerada no QQ-Férias para sua análise",
          to_email: "jqueirozpires@gmail.com",
        };
        await axios.post("http://127.0.0.1:8000/email", email);
      } catch (error) {
        console.log(error);
      }
    },
    async workChat() {
      try {
        var colaborador = JSON.parse(localStorage.getItem("colaborador"));
        const workchat = {
          nome: colaborador.col_nome,
        };
        await axios.post("http://127.0.0.1:8000/workchat", workchat);
      } catch (error) {
        console.log(error);
      }
    },
    solicitar: function () {
      try {
        let solicitacao = {
          sol_inicio: moment(this.solicitacoes.inicio).add(1, "hours"),
          sol_fim: moment(this.solicitacoes.fim).add(1, "hours"),
        };

        if (this.solicitacoes.isDecimo == true) {
          solicitacao.sol_isDecimo = true;
        } else {
          solicitacao.sol_isDecimo = false;
        }

        if (this.solicitacoes.fim < this.solicitacoes.inicio) {
          Vue.toasted.error("Data inicio maior que data final", {
            className: "error",
            duration: "7000",
            position: "bottom-right",
          });
        } else {
          this.isLoading = true;
          api
            .post("cadastroSolicitacao", solicitacao)
            .then(async (res) => {
              this.$router.push("/colaborador");
              this.isLoading = false;
              Vue.toasted.success("Solicitação enviado!", {
                className: "success",
                duration: "7000",
                position: "bottom-right",
              });
              this.workChat();
              this.emailGestor();
              return res
            })
            .catch((error) => {
              this.isLoading = false;
              Vue.toasted.error("Não foi possível enviar sua solicitação!", {
                className: "error",
                duration: "7000",
                position: "bottom-right",
              });
              console.log(error);
            });
          this.isLoading = false;
        }
      } catch (error) {
        Vue.toasted.error("Não foi possível enviar sua solicitação!", {
          className: "error",
          duration: "7000",
          position: "bottom-right",
        });
        this.isLoading = false;
        console.log(error);
      }
      // Se não estiver disponivel (Toasted)
    },
    handleSolicitacao() {
      Swal.fire({
        text: `Você deseja confirmar sua solicitação?`,
        showCancelButton: true,
        cancelButtonText: "Não",
        confirmButtonClass: "md-button md-option",
        cancelButtonClass: "md-button md-option",
        confirmButtonText: "Sim",
        buttonsStyling: false,
      }).then((res) => {
        if (res.value && this.tipoContrato != "CLT") {
          this.handleDecimo();
        } else {
          this.solicitar();
        }
      });
    },
    handleDecimo() {
      Swal.fire({
        text: `Você deseja antecipar seu décimo terceiro?`,
        showCancelButton: true,
        cancelButtonText: "Não",
        confirmButtonClass: "md-button md-option",
        cancelButtonClass: "md-button md-option",
        confirmButtonText: "Sim",
        buttonsStyling: false,
      }).then((res) => {
        if (res.value) {
          this.solicitacoes.isDecimo = true;
          this.solicitar();
        } else {
          this.solicitacoes.isDecimo = false;
          this.solicitar();
        }
      });
    },
  },
};
</script>


<style>
.col-solicitacao {
  border-bottom: solid 1px #d3d3d3;
  border-top: solid 1px #d3d3d3;
}
.tempo-data {
  margin-top: -25px;
}
.md-raised {
  background-color: #0f630a !important;
  height: 50px;
  width: 100px;
  color: #fff !important;
}
.md-raised:hover {
  background-color: #f4f75f !important;
  color: #000 !important;
}
.div-solicitacoes {
  padding-top: 1%;
  padding-inline: 5%;
  width: 40%;
}
#agendamento-layout {
  justify-content: space-around !important;
}
th > div {
  text-align: center;
}
h1,
h2 {
  color: #0f630a;
}
</style>