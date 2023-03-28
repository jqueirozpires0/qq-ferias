<template>
  <md-card class="card-login">
    <div class="md-layout text-center">
      <div class="md-layout-item">
        <div>
          <img class="logo-image" src="../assets/quero.png" />
        </div>
        <md-field class="md-form-group" slot="inputs">
          <md-icon>face</md-icon>
          <label>Email</label>
          <md-input required v-model="form.email"></md-input>
        </md-field>

        <md-field class="md-form-group" slot="inputs">
          <md-icon>lock_outline</md-icon>
          <label>Senha</label>
          <md-input required v-model="form.senha" type="password"></md-input>
        </md-field>
        <md-button
          slot="footer"
          type="submit"
          @click="submit"
          class="md-raised"
        >
          Entrar
          <md-icon style="color: #fff">login</md-icon>
        </md-button>
      </div>
    </div>
  </md-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    form: {
      email: "",
      senha: "",
    },
  }),

  created() {},

  methods: {
    ...mapActions("auth", ["ActionLogin"]),
    ...mapActions("auth", ["ActionLoadSession"]),
    async submit() {
      try {
        await this.ActionLogin(this.form);
        this.$router.push({name: 'administrador'})
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>



<style>
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

.md-layout-item {
  max-width: 400px;
  margin-inline: auto;
}

.card-login {
  max-width: 600px;
  height: 350px;
  margin-inline: auto;
  margin-top: 10%;
}

.entrar {
  color: black;
}
.md-field .md-input-action {
  background-color: #eeeeee !important;
}
</style>
