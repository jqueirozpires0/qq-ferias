<template>
  <form autocomplete="off" @submit.prevent="cadastrar()" method="post">
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
        <h2 class="title">Cadastro de colaborador</h2>
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
                v-model="colaborador.nome"
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
                v-model="colaborador.email"
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
                v-model="colaborador.matricula"
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
                v-model="colaborador.inicio_contrato"
                name="contrato"
              ></md-input>
            </md-field>
          </div>
          <div class="div-colaborador">
            <md-field>
              <md-select
                required
                v-model="colaborador.tipo_contratual"
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
                v-model="colaborador.cnpj"
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
                v-model="colaborador.cpf"
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
                v-model="colaborador.senha"
                name="senha"
                placeholder="Senha da colaborador"
              ></md-input>
            </md-field>
          </div>
          <div class="div-colaborador" v-if="cargoColaborador">
            <md-field>
              <label>Gestores</label>
              <md-select
                v-model="colaborador.id_gestor"
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
            <md-radio v-model="colaborador.cargo" value="Gestor"
              >Gestor</md-radio
            >
            <md-radio v-model="colaborador.cargo" value="Colaborador"
              >Colaborador</md-radio
            >
            <md-radio v-model="colaborador.cargo" value="Administrador"
              >Administrador</md-radio
            >
          </div>
        </div>
        <md-button class="md-raised" type="submit">Cadastrar</md-button>
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
import axios from "axios";
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
      colaborador: {},
      submitted: false,
    };
  },
  methods: {
    update: async function () {
      try {
        let colaborador = {
          col_nome: this.colaborador.nome,
          col_email: this.colaborador.email,
          col_contrato_tipo: this.colaborador.tipo_contratual,
          col_matricula: this.colaborador.matricula,
          col_senha: this.colaborador.senha,
          col_inicio_contrato: this.colaborador.inicio_contrato,
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
        if (this.colaborador.id_gestor == "") {
          colaborador.col_id_gestor = null;
        } else {
          colaborador.col_id_gestor = this.colaborador.id_gestor;
        }
        if (this.colaborador.cpf == "") {
          colaborador.col_cpf = null;
        } else {
          colaborador.col_cpf = this.colaborador.cpf;
        }
        if (this.colaborador.cnpj == "") {
          colaborador.col_cnpj = null;
        } else {
          colaborador.col_cnpj = this.colaborador.cnpj;
        }
        if (this.colaborador.cargo == "Gestor") {
          colaborador.col_isGestor = true;
        } else {
          colaborador.col_isGestor = false;
        }
        if (this.colaborador.cargo == "Administrador") {
          colaborador.col_isAdministrador = true;
        } else {
          colaborador.col_isAdministrador = false;
        }
        this.isLoading = true;
        axios
          .put("http://localhost:3000/edit/" + colaborador.col_id, colaborador)
          .then((res) => {
            this.$router.push("/administrador");
            Vue.toasted.success("Colaborador editado!", {
              className: "success",
              duration: "7000",
              position: "bottom-right",
            });
            console.log(res);
          })
          .catch((error) => {
            this.isLoading = false;
            console.log(this.colaborador.id_gestor);
            Vue.toasted.error("Não foi possível editar o colaborador!", {
              className: "error",
              duration: "7000",
              position: "bottom-right",
            });
            console.log(error);
          });
      } catch (error) {
        this.isLoading = false;
        console.log(this.colaborador.id_gestor);
        console.log(error);
      }
    },
    async getGestores() {
      axios
        .get("http://localhost:3000/gestores")
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
  },
  mounted() {
    if (this.$route.query.item) {
      this.id = this.$route.query.item;
    }
    this.getGestores();
  },
  watch: {
    "colaborador.tipo_contratual": function () {
      if (this.colaborador.tipo_contratual == "PJ") {
        this.tipoContratoPJ = true;
        this.tipoContratoCLT = false;
      } else {
        this.tipoContratoCLT = true;
        this.tipoContratoPJ = false;
      }
    },
    "colaborador.cargo": function () {
      if (this.colaborador.cargo == "Colaborador") {
        this.cargoColaborador = true;
      } else {
        this.cargoColaborador = false;
      }
    },
  },
};
</script>
