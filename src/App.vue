<template>
  <div id="app">
   <v-app id="helpmepets">
    <v-toolbar class="transparent elevation-0"  >
    
    <v-toolbar-title class="text-center" ></v-toolbar-title>
    <v-spacer></v-spacer>
     <v-btn icon @click.native="gotoHome">
      <v-icon>home</v-icon>
    </v-btn>
    
    <template v-if="this.user">
   
    <v-btn icon @click.native="gotoAddNewPets">
      <v-icon>add_circle</v-icon>
    </v-btn>
  
    <v-btn icon @click.native="signOut">
      <v-icon>exit_to_app</v-icon>
    </v-btn>
     <v-btn icon @click.native="gotoLogin">
      <div class="profile-img"><img :src='user.photoURL' :alt="user.displayName"></img></div>
    </v-btn>
    </template>
    <template v-else>
     <v-btn icon @click.native="gotoLogin">
      <v-icon>account_circle</v-icon>
    </v-btn>
    </template>
  </v-toolbar>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
    
      <Navigation></Navigation>
  </v-app>
      
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'
import {store} from '@/vuex/store'
import {firebase} from './assets/js/FirebaseConfig'

export default {
  name: 'app',
  store,
  components: { Navigation },
  methods: {
    gotoAddNewPets: function () {
      console.log('gotoAddNewPets');
      // var router = new VueRouter() ;
      // router.go('/');
      this.$router.push('/regispets');
    },
    gotoHome: function () {
      console.log('gotoHome');
      this.$router.push('/');
    },

    gotoLogin: function () {
      console.log('gotoLogin');
      this.$router.push('/signin');
    },
    signOut() {
        firebase.auth().signOut();
        store.commit('setUser', null);
        this.$router.push('/');
      }
  },
  computed: {
      user () {
        return store.state.user
      }
    }
}
</script>

<style scoped>
.profile-img{
  display:inline;
}
.profile-img img{
 width: 36px;
 border-radius: 18px;
}
 #helpmepets {
 background: #FFE5B6 url('/static/img/bg.png') no-repeat center center fixed;
 -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
 }
 
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  /*margin-top: 40px;*/
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #4fc08d;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
.container{
  padding: 0px !important;
}
</style>
