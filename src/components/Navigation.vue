<template>
  <v-card height="55px">
    <v-bottom-nav absolute value="true" class="transparent">
     <!-- <v-btn flat dark class="orange--text" @click.native="gotoSearch"  :value="e1 === 1">
        <span>Search</span>
        <v-icon>search</v-icon>
      </v-btn>-->
      
      <v-btn flat dark class="orange--text" @click.native="gotoNearby" :value="e1 === 3">
        <span>Nearby</span>
        <v-icon>place</v-icon>
      </v-btn>
      <v-btn flat dark class="orange--text" @click.native="gotoFav" :value="e1 === 2">
        <span>Favorites</span>
        <v-icon>favorite</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-card>
</template>

<script>

export default {
    name: 'fav',    
    data () {
      return {
        e1: 3
      }
    },
    created: function() {
      console.log("current route: ",this.$route.name);
      let curRouteName = this.$route.name;
      if (curRouteName == "Signin") {
        //this.e1 = 1;
      } 
      else if (curRouteName == "Nearby" || curRouteName == "Search") {
        this.e1 = 3;
      }
      else if (curRouteName == "Resgister" || curRouteName == "Photo") {
        this.e1 = 3;
      }
      else if (curRouteName == "Favorite") {
        this.e1 = 2;
      }
    },
    methods : {
      gotoSearch: function () {
        console.log('gotoSearch');
        this.$router.push('/');
        this.e1 = 1;
      },

      gotoNearby: function () {
        console.log('gotoNearby');      
        this.$router.push('/');
        this.e1 = 3;
      }, 

      gotoFav: function () {
        console.log('gotoFav');      
        this.$router.push('/fav');
        this.e1 = 2;
      },   

    }
  }
</script>
