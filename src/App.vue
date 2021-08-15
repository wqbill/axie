<template>
  <v-app>
    <v-navigation-drawer app>
      <router-link to="/">home</router-link>
      <br>
      <router-link to="/axie">axie</router-link>
    </v-navigation-drawer>

    <!--<v-app-bar app></v-app-bar>-->

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
