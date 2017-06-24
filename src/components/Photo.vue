<template>
  <div class="capture">
  <canvas id="photo"></canvas>
  <v-layout row>
        <v-flex xs4 order-md2 order-xs1>
          <v-btn floating class="amber minor">
      <v-icon light>photo</v-icon>
    </v-btn>
        </v-flex>
        <v-flex xs4 order-md3 order-xs2>
          <v-btn floating class="deep-orange x-large" @click.native="capture">
      <v-icon light>camera_alt</v-icon>
    </v-btn>
        </v-flex>
        <v-flex xs4 order-md1 order-xs3>
         <v-btn floating class="amber minor" @click.native="resume">
      <v-icon light>replay</v-icon>
    </v-btn>
        </v-flex>
      </v-layout>
  </div>
  
</template>

<script>
import imageCapture from 'image-capture'
import {store} from '@/vuex/store'
  export default {
    name: 'photo',
    store,
    data () {
      return {
        e1: 1,
        photo: document.getElementById('photo'),
        videoDevice: null,
        captureDevice: null,
        interval:null
      }
    },
    methods: {
      getMedia(mediaStream){
       
        // Extract video track. 
        this.videoDevice = mediaStream.getVideoTracks()[0];
        this.captureDevice = new ImageCapture(this.videoDevice);
        // console.log(this.captureDevice)
        if (this.captureDevice) {
            this.interval=setInterval( this.captureVideo, 80)
        }
        
      },
      capture(){
        let url=document.getElementById('photo').toDataURL('image/jpeg')
        store.commit('setPhoto', url)
        this.stopCamera();
        this.$router.push('/regispets');
        // console.log(url)
      },
      resume(){
        this.stopCamera();
        store.commit('setPhoto', url)
        navigator.mediaDevices.getUserMedia({video: true}).then(this.getMedia).catch(this.failedToGetMedia);
        //  if (this.videoDevice) this.videoDevice.start(); 
      },
      processPhoto(blob){
        console.log(blob)
        this.photo.src = window.URL.createObjectURL(blob);
      },
      failedToGetMedia(msg){
          console.log(msg)
          // this.stopMedia()
      },
      processFrame(imageBitmap){
        console.log(imageBitmap.width)
        document.getElementById('photo').width = imageBitmap.width;
        document.getElementById('photo').height = imageBitmap.height;
        // this.photo.height = imageBitmap.height;
        // console.log(imageBitmap)
        // this.photo.width = 640;
        // this.photo.height = 640;
        document.getElementById('photo').getContext('2d').drawImage(imageBitmap, 0, 0,imageBitmap.width,imageBitmap.height);
      },
      stopCamera(){
        // console.log(this.videoDevice)
        if (this.interval) clearInterval(this.interval);  // stop frame grabbing
        if (this.videoDevice) this.videoDevice.stop();  // turn off the camera
      },
      stopMedia(){
        // console.log(this.videoDevice)
        if (this.interval) clearInterval(this.interval);  // stop frame grabbing
        if (this.videoDevice) this.videoDevice.stop();  // turn off the camera
        store.commit('setPhoto', url)
        this.$router.push('/');
      },
      captureVideo(){
        // console.log('adfadfadfdf')
        // console.log(this.captureDevice)
      this.captureDevice.grabFrame().then(this.processFrame).catch(error => {
        console.log( 'Error while grabbing frame: '+error)
      });
      }
      // captureDevice.takePhoto().then(processPhoto).catch(error => {
      //   err((new Date()).toISOString(), 'Error while taking photo:', error);
      // });
    },
    created:function(){
        // let canvas = document.getElementById('canvas');
        // let this.photo = x;
        
        navigator.mediaDevices.getUserMedia({video: true}).then(this.getMedia).catch(this.failedToGetMedia);
        
        

        // function processFrame(imageBitmap) {
        // canvas.width = imageBitmap.width;
        // canvas.height = imageBitmap.height;
        // canvas.width = 640;
        // canvas.height = 640;
        // canvas.getContext('2d').drawImage(imageBitmap, 0, 0);
        // }
        // console.log('xxx')
        // console.log(this.photo)
        // console.log(document.getElementById('photo'))
        // document.getElementById('photo').addEventListener('load', ()=> {
        // // After the image loads, discard the image object to release the memory 
        //   window.URL.revokeObjectURL(this.photo.src);
        // });
    }
  }
</script>
<style >
#photo{
 
  width: 100%;
}
.x-large{
  width: 100px;
  height: 100px;
  font-size: 
}

.x-large .icon{
  font-size: 48px;
  height: 48px;
  width: 48px;
}
.minor{
  margin-top: 30px;
}

 #helpmepets {
 background: none !important;
 background-color: #FFE5B6 !important;
 
 }
</style>
