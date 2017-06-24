<template>

    <div id="app">
        <v-app id="helpmepets">
            <v-toolbar class="transparent elevation-0">
                <v-toolbar-title class="text-center">
                </v-toolbar-title>
                <v-spacer>
                </v-spacer>
                <v-btn @click.native="gotoHome" icon="">
                    <v-icon>
                        home
                    </v-icon>
                </v-btn>
                <template v-if="this.user">
                    <v-btn @click.native="gotoRegisPets" icon="">
                        <v-icon>
                            add_circle
                        </v-icon>
                    </v-btn>
                    <v-btn @click.native="signOut" icon="">
                        <v-icon>
                            exit_to_app
                        </v-icon>
                    </v-btn>
                    <v-btn @click.native="gotoLogin" icon="">
                        <div class="profile-img">
                            <img :alt="user.displayName" :src="user.photoURL"></img>
                        </div>
                    </v-btn>
                </template>
                <template v-else>
                    <v-btn @click.native="gotoLogin" icon="">
                        <v-icon>
                            account_circle
                        </v-icon>
                    </v-btn>
                </template>
            </v-toolbar>
            <main>
                <v-container fluid="">
                    <router-view>
                    </router-view>
                </v-container>
            </main>
            <navigation>
            </navigation>
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
    gotoRegisPets: function () {
      console.log('gotoRegisPets');      
      this.$router.push('/capture');
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
  },
 created: function(){
  console.log ('created App.vue ');
  
 },
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
 background: #FFE5B6 url('/static/img/bg_light.png') no-repeat center center fixed;
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
  margin-top: 20px;
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
.application--toolbar>main>.container {
    min-height: calc(100vh - 56px - 55px) !important;
}

 
</style>
