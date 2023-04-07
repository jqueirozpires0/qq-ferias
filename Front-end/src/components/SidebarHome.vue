<template>
  <div class="sidebar" :class="isOpened ? 'open' : ''" :style="cssVars">
    <div class="logo-details" style="margin: 6px 14px 0 14px">
      <img
        v-if="menuLogo"
        :src="menuLogo"
        alt="menu-logo"
        class="menu-logo icon"
      />
      <i v-else class="bx icon" :class="menuIcon" />
      <div class="logo_name">
        {{ menuTitle }}
      </div>
      <i
        class="bx"
        :class="isOpened ? 'bx-menu-alt-right' : 'bx-menu'"
        id="btn"
        @click="isOpened = !isOpened"
      />
    </div>

    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
        max-height: calc(100% - 60px);
      "
    >
      <div
        v-if="this.tipoColaborador === 'Gestor'"
        id="my-scroll"
        style="margin: 6px 14px 0 14px"
      >
        <ul class="nav-list" style="overflow: visible">
          <span v-for="(menuItem, index) in menuItemsGestor" :key="index">
            <li>
              <a :href="menuItem.link">
                <i class="bx" :class="menuItem.icon || 'bx-square-rounded'" />
                <span class="links_name">{{ menuItem.name }}</span>
                <md-badge
                  :md-content="totalAvisos.length + totalSolicitacoes.length"
                  v-if="menuItem.name == 'Notificações'"
                >
                  <md-button class="md-icon-button bx-sun">
                    <i class="bx icon bx-bell"></i>
                  </md-button>
                </md-badge>
              </a>
            </li>
          </span>
        </ul>
      </div>
      <div
        v-if="this.tipoColaborador === 'Administrador'"
        id="my-scroll"
        style="margin: 6px 14px 0 14px"
      >
        <ul class="nav-list" style="overflow: visible">
          <span
            v-for="(menuItem, index) in menuItemsAdministrador"
            :key="index"
          >
            <li>
              <a :href="menuItem.link">
                <i class="bx" :class="menuItem.icon || 'bx-square-rounded'" />
                <span class="links_name">{{ menuItem.name }}</span>
              </a>
            </li>
          </span>
        </ul>
      </div>
      <div
        v-if="this.tipoColaborador === 'Colaborador'"
        id="my-scroll"
        style="margin: 6px 14px 0 14px"
      >
        <ul class="nav-list" style="overflow: visible">
          <span v-for="(menuItem, index) in menuItemsColaborador" :key="index">
            <li>
              <a :href="menuItem.link">
                <i class="bx" :class="menuItem.icon || 'bx-square-rounded'" />
                <span class="links_name">{{ menuItem.name }}</span>
              </a>
            </li>
          </span>
        </ul>
      </div>
      <a>
        <i @click="logout()" class="bx bx-log-out" id="log_out" />
      </a>
    </div>
  </div>
</template>

<script>
import api from "@/modules/services/api";
import { mapActions } from "vuex";
export default {
  name: "Sidebar-home",
  data() {
    return {
      telaLogin: false,
      isOpened: false,
      totalSolicitacoes: [],
      totalAvisos: [],
      tipoColaborador: "",
    };
  },
  props: {
    //! Menu settings
    isMenuOpen: {
      type: Boolean,
      default: true,
    },
    menuTitle: {
      type: String,
      default: "QQFÉRIAS",
    },
    menuLogo: {
      type: String,
      default: "",
    },
    menuIcon: {
      type: String,
      default: "bx-sun",
    },
    isPaddingLeft: {
      type: Boolean,
      default: true,
    },
    menuOpenedPaddingLeftBody: {
      type: String,
      default: "250px",
    },
    menuClosedPaddingLeftBody: {
      type: String,
      default: "78px",
    },
    //! Menu items
    menuItemsGestor: {
      type: Array,
      default: () => [
        {
          link: "/gestor",
          name: "Perfil Gestor",
          tooltip: "Perfil",
          icon: "bx-user",
        },
        {
          link: "/notificacoes",
          name: "Notificações",
          tooltip: "Messages",
          icon: "bx-chat",
        },
      ],
    },

    menuItemsAdministrador: {
      type: Array,
      default: () => [
        {
          link: "/administrador",
          name: "Perfil Administrador",
          tooltip: "Perfil",
          icon: "bx-user",
        },
        {
          link: "/cadastro",
          name: "Cadastro",
          tooltip: "Messages",
          icon: "bx-code-block",
        },
      ],
    },

    menuItemsColaborador: {
      type: Array,
      default: () => [
        {
          link: "/colaborador",
          name: "Perfil Colaborador",
          tooltip: "Perfil",
          icon: "bx-user",
        },
        {
          link: "/solicitacao",
          name: "Solicitar Férias",
          tooltip: "Solicitação",
          icon: "bx-chat",
        },
      ],
    },

    //! Styles
    bgColor: {
      type: String,
      default: "#0F630A",
    },
    logoTitleColor: {
      type: String,
      default: "#fff",
    },
    iconsColor: {
      type: String,
      default: "#fff",
    },
    menuItemsHoverColor: {
      type: String,
      default: "#F4F75F",
    },
    menuItemsTextColor: {
      type: String,
      default: "#fff",
    },
    menuFooterTextColor: {
      type: String,
      default: "#fff",
    },
  },
  methods: {
    ...mapActions("auth", ["ActionLogout"]),
    async logout() {
      this.$store.commit("ActionLogout");
      window.localStorage.removeItem("vuex");
      window.localStorage.removeItem("token");
      window.location.reload(true);
    },
    async getSolicitacoes() {
      api
        .get("todas-solicitacoes-analise-gestor")
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].sol_status == "analise") {
              this.totalSolicitacoes.push(res.data[i]);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAvisos() {
      this.isLoading = true;
      api
        .get("colaboradores-e-suas-ferias")
        .then((res) => {
          this.isLoading = false;
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].dias == 30) this.totalAvisos.push(res.data[i]);
          }
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
        });
    },
    async getInfoColaborador() {
      api
        .get("info-colaborador")
        .then((res) => {
          if (res.data.col_isGestor == true) {
            this.tipoColaborador = "Gestor";
          } else if (res.data.col_isAdministrador == true) {
            this.tipoColaborador = "Administrador";
          } else {
            this.tipoColaborador = "Colaborador";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  mounted() {
    this.getInfoColaborador();
    this.getSolicitacoes();
    this.getAvisos();
    this.isOpened = this.isMenuOpen;
  },
  computed: {
    cssVars() {
      return {
        "--bg-color": this.bgColor,
        "--home-section-color": this.homeSectionColor,
        "--logo-title-color": this.logoTitleColor,
        "--icons-color": this.iconsColor,
        "--items-tooltip-color": this.itemsTooltipColor,
        "--menu-items-hover-color": this.menuItemsHoverColor,
        "--menu-items-text-color": this.menuItemsTextColor,
        "--menu-footer-text-color": this.menuFooterTextColor,
      };
    },
  },
  watch: {
    isOpened() {
      window.document.body.style.paddingLeft =
        this.isOpened && this.isPaddingLeft
          ? this.menuOpenedPaddingLeftBody
          : this.menuClosedPaddingLeftBody;
    },
  },
};
</script>

<style>
/* Google Font Link */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");
@import url("https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
body {
  transition: all 0.5s ease;
}

#log_out {
  background-color: #0f630a;
  border: none;
  color: white;
  cursor: pointer;
}

.menu-logo {
  width: 30px;
  margin: 0 10px 0 10px;
}
.sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  min-height: min-content;
  width: 78px;
  background: var(--bg-color);
  z-index: 99;
  transition: all 0.5s ease;
}
.sidebar.open {
  width: 250px;
}
.sidebar .logo-details {
  height: 60px;
  display: flex;
  align-items: center;
  position: relative;
}
.sidebar .logo-details .icon {
  opacity: 0;
  transition: all 0.5s ease;
}
.sidebar .logo-details .logo_name {
  color: var(--logo-title-color);
  font-size: 20px;
  font-weight: 600;
  opacity: 0;
  transition: all 0.5s ease;
}
.sidebar.open .logo-details .icon,
.sidebar.open .logo-details .logo_name {
  opacity: 1;
}
.sidebar .logo-details #btn {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  font-size: 22px;
  transition: all 0.4s ease;
  font-size: 23px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s ease;
}
.sidebar.open .logo-details #btn {
  text-align: right;
}
.sidebar i {
  color: var(--icons-color);
  height: 60px;
  min-width: 50px;
  font-size: 28px;
  text-align: center;
  line-height: 60px;
}
.sidebar .nav-list {
  margin-top: 20px;
}
.sidebar li {
  position: relative;
  margin: 8px 0;
  list-style: none;
}
.sidebar li .tooltip {
  position: absolute;
  top: -20px;
  left: calc(100% + 15px);
  z-index: 3;
  background: var(--items-tooltip-color);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 400;
  opacity: 0;
  white-space: nowrap;
  pointer-events: none;
  transition: 0s;
}
.sidebar li:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
  transition: all 0.4s ease;
  top: 50%;
  transform: translateY(-50%);
}
.sidebar.open li .tooltip {
  display: none;
}
.sidebar input {
  font-size: 15px;
  color: var(--serach-input-text-color);
  font-weight: 400;
  outline: none;
  height: 50px;
  width: 100%;
  width: 50px;
  border: none;
  border-radius: 12px;
  transition: all 0.5s ease;
  background: var(--secondary-color);
}
.sidebar.open input {
  padding: 0 20px 0 50px;
  width: 100%;
}
.sidebar li a {
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  align-items: center;
  text-decoration: none;
  transition: all 0.4s ease;
  background: var(--bg-color);
}
.sidebar li a:hover {
  background: var(--menu-items-hover-color);
}
.sidebar li a .links_name {
  color: var(--menu-items-text-color);
  font-size: 15px;
  font-weight: 400;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: 0.4s;
}
.sidebar.open li a .links_name {
  opacity: 1;
  pointer-events: auto;
}
.sidebar li a:hover .links_name,
.sidebar li a:hover i {
  transition: all 0.5s ease;
  color: var(--bg-color);
}
.sidebar li i {
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  border-radius: 12px;
}
.home-section {
  position: relative;
  background: var(--home-section-color);
  min-height: 100vh;
  top: 0;
  left: 78px;
  width: calc(100% - 78px);
  transition: all 0.5s ease;
  z-index: 2;
}
.sidebar.open ~ .home-section {
  left: 250px;
  width: calc(100% - 250px);
}
.home-section .text {
  display: inline-block;
  color: var(--bg-color);
  font-size: 25px;
  font-weight: 500;
  margin: 18px;
}
.my-scroll-active {
  overflow-y: auto;
}
#my-scroll {
  overflow-y: auto;
  height: calc(100% - 60px);
}
#my-scroll::-webkit-scrollbar {
  display: none;
}
@media (max-width: 420px) {
  .sidebar li .tooltip {
    display: none;
  }
}
</style>
