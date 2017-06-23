<template>
  <h1>{{ msg }}</h1>
  
  <!--<div class="row">
    <div class="form-group row">
    <label for="avatar" class="col-xs-5 align-right col-form-label">รูปโปรไฟล์</label>
        <div class="col-xs-7">
        <img src="//placehold.it/100" class="" alt="avatar">
            <input  type="file" name="imageUrl" class="" id="imageUrl" accept="image/*" >
        </div>
    </div>
  </div>-->
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
