<template>
  <div id="resgister">
    <v-layout row>
        <v-flex xs6 order-xs1>
          Pic.
          
        </v-flex>
        <v-flex xs6 order-xs2>
          <input type="file" accept="image/*" capture="camera" id="imageUrl"  />
            <img id="frame"><br/>
        </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs6 order-xs1>
          Detail 
          
        </v-flex>
        <v-flex xs6 order-xs2>
          <v-text-field
              name="input-7-1"
              multi-line
              v-model="detail"
              id="detail"
            ></v-text-field>
        </v-flex>


      </v-layout>
    <v-layout row>
      <v-flex xs6 order-xs1>
          Type 
        </v-flex>
        <v-flex xs6 order-xs2>
          <v-select
              v-bind:items="items"
              v-model="selectType"
              class="input-group--focused"
              dark
              item-value="text"
            ></v-select>
        </v-flex>


      </v-layout>

      <v-layout row>
        <v-flex xs6 order-xs1></v-flex>
        <v-flex xs6 order-xs2>
          <v-btn primary light @click.native="submitform">Send</v-btn>
          <v-btn dark default>Cannel</v-btn>
        </v-flex>
      </v-layout>
  </div>
  
  
</template>

<script>
export default {
  name: 'Resgister',
  data () {
    return {
      msg: 'Resgister page'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
