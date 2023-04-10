<template>
  <form autocomplete="off" @submit.prevent="update()" method="put">
    <md-card>
      <loading
        :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="true"
      ></loading>
      <md-card-header class="md-card-header-text md-card-header-green">
        <div>
          <img class="logo-image" src="../assets/quero.png" />
        </div>
        <h2 class="title">Editar colaborador</h2>
      </md-card-header>
      <md-card-content>
        <div class="md-layout">
          <div class="div-colaborador">
            <md-field>
              <md-input
                required
                type="text"
                class="form-control"
                id="nome"
                v-model="colaborador.col_nome"
                name="nome"
                placeholder="Nome colaborador"
              ></md-input>
            </md-field>
          </div>
          <div class="div-colaborador">
            <md-field>
              <md-input
                required
                type="email"
                class="form-control"
                id="email"
                v-model="colaborador.col_email"
                name="email"
                placeholder="Email do colaborador"
              ></md-input>
            </md-field>
          </div>
          <div class="div-colaborador">
            <md-field>
              <md-input
                required
                type="text"
                class="form-control"
                id="matricula"
                v-model="colaborador.col_matricula"
                name="matricula"
                placeholder="Matricula do colaborador"
              ></md-input>
            </md-field>
          </div>
          <div class="div-colaborador">
            <md-field>
              <label class="tempo-data">Início contrato</label>
              <md-input
                required
                type="date"
                class="form-control"
                id="data-contrato"
                max="2023-12-31"
                v-model="colaborador.col_inicio_contrato"
                name="contrato"
              ></md-input>
            </md-field>
          </div>
          <div class="div-colaborador">
            <md-field>
              <md-select
                required
                v-model="colaborador.col_contrato_tipo"
                name="contrato"
                id="contrato"
                placeholder="Tipo de contrato"
              >
                <md-option value="CLT">CLT</md-option>
                <md-option value="PJ">Pessoa Jurídica</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="div-colaborador" v-if="tipoContratoPJ">
            <md-field>
              <md-input
                type="text"
                v-mask="'##.###.###/####-##'"
                oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\.?)\../g, '$1');"
                class="form-control"
                md-counter="false"
                id="cnpj"
                v-model="colaborador.col_cnpj"
                name="cnpj"
                placeholder="CNPJ do colaborador"
              ></md-input>
            </md-field>
          </div>
          <div class="div-colaborador" v-if="tipoContratoCLT">
            <md-field>
              <md-input
                type="text"
                v-mask="'###.###.###-##'"
                class="form-control"
                id="cpf"
                v-model="colaborador.col_cpf"
                name="cpf"
                placeholder="CPF do colaborador"
              ></md-input>
            </md-field>
          </div>
          <div class="div-colaborador">
            <md-field>
              <md-input
                required
                type="password"
                class="form-control"
                maxlength="18"
                md-counter="false"
                id="senha"
                v-model="senha"
                name="senha"
                placeholder="Senha da colaborador"
              ></md-input>
            </md-field>
          </div>
          <div class="div-colaborador" v-if="cargoColaborador">
            <md-field>
              <label>Gestores</label>
              <md-select
                v-model="colaborador.col_id_gestor"
                id="gestor"
                placeholder="Gestor responsável"
              >
                <md-option
                  v-for="(item, index) in gestores"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.text }}
                </md-option>
              </md-select>
            </md-field>
          </div>
          <div class="div-radio">
            <md-radio v-model="cargo" value="Gestor">Gestor</md-radio>
            <md-radio v-model="cargo" value="Colaborador">Colaborador</md-radio>
            <md-radio v-model="cargo" value="Administrador"
              >Administrador</md-radio
            >
          </div>
        </div>
        <md-button class="md-raised" type="submit">Editar</md-button>
      </md-card-content>
    </md-card>
  </form>
</template>
<style>
.div-colaborador {
  padding: 1%;
  width: 33%;
}
.div-radio {
  margin-top: 20px;
  margin-left: 20px;
}
.logo-image {
  width: 400px !important;
  max-height: 300px;
  width: auto;
  height: auto;
}
@media screen and (max-width: 870px) {
  .div-colaborador {
    width: 50%;
  }
}
@media screen and (max-width: 550px) {
  .div-colaborador {
    width: 100%;
  }
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
</style>

<script>
import Vue from "vue";
import api from "@/modules/services/api";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "/node_modules/vue-loading-overlay/dist/vue-loading.css";
export default {
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
      gestores: [],
      radio: false,
      tipoContratoCLT: false,
      tipoContratoPJ: false,
      cargoColaborador: false,
      cargo: "",
      senha: "qq@2023",
      colaborador: {},
      submitted: false,
    };
  },
  methods: {
    update: async function () {
      try {
        let colaborador = {
          col_nome: this.colaborador.col_nome,
          col_email: this.colaborador.col_email,
          col_contrato_tipo: this.colaborador.col_contrato_tipo,
          col_matricula: this.colaborador.col_matricula,
          col_senha: this.senha,
          col_inicio_contrato: this.colaborador.col_inicio_contrato,
        };
        var diff = moment().diff(moment(this.colaborador.inicio_contrato));
        var emDias = moment.duration(diff).asDays();

        if (emDias >= 365) {
          colaborador.col_isFeriasLiberada = true;
          colaborador.col_dias_ferias = 30;
        } else {
          colaborador.col_isFeriasLiberada = false;
          colaborador.col_dias_ferias = 0;
        }
        if (this.colaborador.col_id_gestor == "") {
          colaborador.col_id_gestor = null;
        } else {
          colaborador.col_id_gestor = this.colaborador.col_id_gestor;
        }
        if (this.colaborador.col_cpf == "") {
          colaborador.col_cpf = null;
        } else {
          colaborador.col_cpf = this.colaborador.col_cpf;
        }
        if (this.colaborador.col_cnpj == "") {
          colaborador.col_cnpj = null;
        } else {
          colaborador.col_cnpj = this.colaborador.col_cnpj;
        }
        if (this.cargo == "Gestor") {
          colaborador.col_isGestor = true;
        } else {
          colaborador.col_isGestor = false;
        }
        if (this.cargo == "Administrador") {
          colaborador.col_isAdministrador = true;
        } else {
          colaborador.col_isAdministrador = false;
        }
        this.isLoading = true;
        api
          .put("colaborador/" + this.$route.query.item, colaborador)
          .then((res) => {
            Vue.toasted.success("Colaborador editado!", {
              className: "success",
              duration: "7000",
              position: "bottom-right",
            });
            this.$router.push("/administrador");
            return res;
          })
          .catch((error) => {
            this.isLoading = false;
            Vue.toasted.error("Não foi possível editar o colaborador!", {
              className: "error",
              duration: "7000",
              position: "bottom-right",
            });
            console.log(error);
          });
      } catch (error) {
        this.isLoading = false;
        console.log(error);
      }
    },
    async getGestores() {
      api
        .get("gestores")
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            this.gestores.push({
              text: res.data[i].col_nome,
              value: res.data[i].col_id,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getColaborador() {
      api
        .get("colaboradorById/" + this.$route.query.item)
        .then((res) => {
          console.log(res.data);
          this.colaborador = res.data;
          this.colaborador.col_inicio_contrato = moment(
            this.colaborador.col_inicio_contrato
          ).format("YYYY-MM-DD");
          if (this.colaborador.col_isGestor == true) {
            this.cargo = "Gestor";
          } else if (this.colaborador.col_isAdministrador == true) {
            this.cargo = "Administrador";
          } else {
            this.cargo = "Colaborador";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    if (this.$route.query.item) {
      this.id = this.$route.query.item;
    }
    this.getGestores();
    this.getColaborador();
  },
  watch: {
    "colaborador.col_contrato_tipo": function () {
      if (this.colaborador.col_contrato_tipo == "PJ") {
        this.tipoContratoPJ = true;
        this.tipoContratoCLT = false;
      } else {
        this.tipoContratoCLT = true;
        this.tipoContratoPJ = false;
      }
    },
    cargo: function () {
      if (this.cargo == "Colaborador") {
        this.cargoColaborador = true;
      } else {
        this.cargoColaborador = false;
      }
    },
  },
};
</script>
