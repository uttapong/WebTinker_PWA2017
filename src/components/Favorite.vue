<template>
    <div id="signin">
        <div class="text-xs-center">
            <h2>
                Favorite List
            </h2>
        </div>        
    </div>
</template>
<script>
    import {firebase} from '@/assets/js/FirebaseConfig'

export default {
  name: 'signin',
  data () {
    return {
    }
  },
  created: function(){
  },

  methods: {
       
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="">
    h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  /* Always set the map height explicitly to define the size of the div
     * element that contains the map. */
    #map {
      height: 700px;
      width: 100%;
    }
    /* Optional: Makes the sample page fill the window. */
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
    }
</style>