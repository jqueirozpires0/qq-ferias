<template>
  <md-card>
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="true"
    ></loading>
    <div>
      <div class="colaboradores-vazio" v-if="this.colaboradores.length <= 0">
        <h1>Ainda não possui usuários cadastrados</h1>
      </div>
      <md-table v-else v-model="paginatedUsers">
        <md-table-toolbar>
          <h1 style="margin-inline: auto">
            Lista de colaboradores<md-icon id="icon-superior"
              >assignment</md-icon
            >
          </h1>
          <md-field
            md-clearable
            class="md-toolbar-section-end"
            style="max-width: 200px"
          >
            <md-input
              placeholder="Buscar pelo nome"
              v-model="search"
              @input="searchOnTable"
              style="float: right; width: 50px"
            />
          </md-field>
        </md-table-toolbar>

        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Nome">{{ item.nome }}</md-table-cell>
          <md-table-cell md-label="Titulação">{{ item.type }}</md-table-cell>
          <md-table-cell md-label="Ações">
            <md-button
              class="md-just-icon md-info md-simple"
              @click.native="handleEdit(item)"
            >
              <md-icon style="color: #1565c0">edit</md-icon>
              <md-tooltip md-direction="bottom">Editar</md-tooltip>
            </md-button>
            <md-button
              class="md-just-icon md-danger md-simple"
              @click.native="handleDelete(item)"
            >
              <md-icon style="color: #df5951">delete </md-icon>
              <md-tooltip md-direction="bottom">Deletar</md-tooltip>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </md-card>
</template>
<style>
#icon-superior {
  color: #0f630a;
  margin-left: 1em;
  font-size: 1.5em !important;
}

.md-option {
  background-color: #0f630a !important;
  width: 30%;
}

.md-option:hover {
  background-color: #f4f75f !important;
}

.colaboradores-vazio {
  height: 200px;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
<script>
import Swal from "sweetalert2";
import Loading from "vue-loading-overlay";
import "/node_modules/vue-loading-overlay/dist/vue-loading.css";
import axios from "axios";
export default {
  components:{
    Loading
  },
  created() {
    this.getColaboradores();
  },
  data: () => ({
    search: null,
    isLoading: false,
    colaboradores: [],
    users: [
      {
        id: 1,
        name: "Shawna Dubbin",
        tipo: "Gestor",
      },
      {
        id: 2,
        name: "Odette Demageard",
        tipo: "Colaborador",
      },
      {
        id: 3,
        name: "Lonnie Izkovitz",
        tipo: "Gestor",
      },
      {
        id: 4,
        name: "Thatcher Stave",
        tipo: "Gestor",
      },
      {
        id: 5,
        name: "Clarinda Marieton",
        tipo: "Colaborador",
      },
    ],
    paginatedUsers: [],
  }),

  methods: {
    handleEdit(item) {
      Swal.fire({
        title: `Você quer editar` + `<br><br>` + `${item.name}?`,
        buttonsStyling: false,
        showCancelButton: true,
        cancelButtonText: "Não",
        cancelButtonClass: "md-button md-option",
        confirmButtonText: "Sim",
        confirmButtonClass: "md-button md-option",
      }).then((result) => {
        if (result.value) {
          this.$router.push({
            name: "Editar Colaborador",
            query: { item: item.id },
          });
        }
      });
    },
    handleDelete(item) {
      console.log(item);
      Swal.fire({
        title: "Tem certeza?",
        text: `Isso não poderá ser revertido!`,
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "Não",
        confirmButtonClass: "md-button md-option",
        cancelButtonClass: "md-button md-option",
        confirmButtonText: "Sim, deletar.",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.deleteRow(item);
        }
      });
    },
    async deleteRow(item) {
      axios
        .delete("http://localhost:3000/colaborador/" + item.id)
        .then((res) => {
          Swal.fire({
            title: "Deletado!",
            text: `Você deletou: ${item.nome}`,
            type: "success",
            confirmButtonClass: "md-button md-success btn-fill",
            buttonsStyling: false,
          });
          return res;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    searchOnTable() {
      this.paginatedUsers = searchByName(this.colaboradores, this.search);
    },
    async getColaboradores() {
      this.isLoading = true;
      axios
        .get("http://localhost:3000/colaboradores")
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            var tipo = "";
            if (res.data[i].col_isGestor == true) {
              tipo = "Gestor";
            } else if (res.data[i].col_isAdministrador == true) {
              tipo = "Administrador";
            } else {
              tipo = "Colaborador";
            }
            this.colaboradores.push({
              id: res.data[i].col_id,
              nome: res.data[i].col_nome,
              type: tipo,
            });
          }
          this.isLoading = false;
          this.paginatedUsers = this.colaboradores;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
const toLower = (text) => {
  return text.toString().toLowerCase();
};
const searchByName = (items, term) => {
  if (term) {
    return items.filter((item) => toLower(item.nome).includes(toLower(term)));
  }

  return items;
};
</script>
