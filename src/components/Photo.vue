<template>
  <div class="capture">
  <canvas id="photo"></canvas>
  <v-layout row class="camera-btn">
        <v-flex xs4 order-md2 order-xs1>
          <v-btn floating class="amber minor" @click.native="gotoRegisPets">
      <v-icon light>photo</v-icon>
    </v-btn>
        </v-flex>
        <v-flex xs4 order-md3 order-xs2>
          <v-btn v-if="!isCapture" floating class="deep-orange x-large" @click.native="capture">
          
      <v-icon light>camera_alt</v-icon>
    </v-btn>
    <v-btn v-else floating class="teal x-large" @click.native="confirmImage">
     <v-icon light>done</v-icon>
    </v-btn>
        </v-flex>
        <v-flex xs4 order-md1 order-xs3>
         <v-btn floating class="amber minor" @click.native="resume" :disabled="disabled_retake">
      <v-icon light>replay</v-icon>
    </v-btn>
        </v-flex>
      </v-layout>

  <v-layout  v-if="show_switch" row class="camera-switch">
        <v-flex xs4 order-md2 order-xs1>

        </v-flex>
        <v-flex xs4 order-md3 order-xs2>
          <v-btn small floating class="amber minor" @click.native="switchDevice">
          
      <v-icon light>autorenew</v-icon>
    </v-btn>
        </v-flex>
        <v-flex xs4 order-md1 order-xs3>

        </v-flex>
      </v-layout>
  </div>
  
</template>

<script>
// import ImageCapturePhoto from 'image-capture'
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
        interval:null,
        disabled_retake:true,
        isCapture:false,
        devices:[],
        currentDevice:''
      }
    },
  computed: {
    show_switch: function () {
      // `this` points to the vm instance
      
      return this.devices.length>0
    }

  },
    methods: {
      gotoRegisPets: function () {
        console.log('gotoRegisPets');  
        store.commit('setPhoto', null)    
      this.$router.push('/regispets');
    }, 
      getMedia(mediaStream){
       
        // Extract video track. 
        if(mediaStream.getVideoTracks()[1])
          this.videoDevice = mediaStream.getVideoTracks()[1];
        else this.videoDevice = mediaStream.getVideoTracks()[0];
        // console.log(mediaStream.getTracks())
        console.log('Using camera '+this.videoDevice.label);

        this.captureDevice = new ImageCapture(this.videoDevice);
        // console.log(this.captureDevice)
        if (this.captureDevice) {
            this.interval=setInterval( this.captureVideo, 80)
        }
        
      },
      capture(){
        this.isCapture=true;
        this.stopCamera();
        this.disabled_retake=false;
        // this.$router.push('/regispets');
        // console.log(url)
      },
      confirmImage(){
        
        this.stopCamera();
        let url=document.getElementById('photo').toDataURL('image/jpeg')
        store.commit('setPhoto', url)
        
        this.$router.push('/regispets');
        // console.log(url)
      },
      resume(){
        this.disabled_retake=true
        this.isCapture=false
        this.stopCamera()
        store.commit('setPhoto', null)
        navigator.mediaDevices.getUserMedia({video: true}).then(this.getMedia).catch(this.failedToGetMedia);
        
        //  if (this.videoDevice) this.videoDevice.start(); 
      },
      processPhoto(blob){
        // console.log(blob)
        this.photo.src = window.URL.createObjectURL(blob);
      },
      failedToGetMedia(msg){
          console.log(msg)
          // this.stopMedia()
      },
      processFrame(imageBitmap){
        console.log(imageBitmap.height)
         let fixHeight=360;
        document.getElementById('photo').width = imageBitmap.width;
        document.getElementById('photo').height = fixHeight;
        let margin=0;
        // console.log(((imageBitmap-fixHeight)/2))
        let ctx = document.getElementById('photo').getContext('2d')
        ctx.rect(0, 0, imageBitmap.width,fixHeight)
        ctx.clip()
        ctx.drawImage(imageBitmap, 0, -1*(imageBitmap.height-fixHeight)/2,imageBitmap.width,imageBitmap.height);
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
        store.commit('setPhoto', null)
        this.$router.push('/');
      },
      captureVideo(){
        // console.log('adfadfadfdf')
        // console.log(this.captureDevice)
      this.captureDevice.grabFrame().then(this.processFrame).catch(error => {
        console.log( 'Error while grabbing frame: '+error)
      });
      },
      getDevices(){
        navigator.mediaDevices.enumerateDevices()
        .then((alldevices)=> {
          alldevices.forEach((device)=> {
            // console.log(device)
            if(device.kind=='videoinput')this.devices.push(device.deviceId)
            // console.log('afasdfasfdadfafadfdafadf')
            // console.log(this.devices);
          });
        })
        .catch((err)=> {
          console.log(err.name + ": " + err.message);
        });
      },
      selectDevice(id){
        let constraints = {
          video: {
            optional: [{
              sourceId: id
            }]
          }
        };
        navigator.mediaDevices.getUserMedia(constraints).then(this.getMedia).catch(this.failedToGetMedia);
      },
      switchDevice(){
        console.log('switch device')
        if(this.devices.length>1){
          if(this.currentDevice==this.devices[0]){
            this.currentDevice=this.devices[1]
          }
          else {
            this.currentDevice=this.devices[0]
          }
          console.log(this.currentDevice)
          this.stopCamera()
          this.selectDevice(this.currentDevice)
        }
      }
      // captureDevice.takePhoto().then(processPhoto).catch(error => {
      //   err((new Date()).toISOString(), 'Error while taking photo:', error);
      // });
    },
    created:function(){
        this.getDevices()
        // console.log(this.devices)
        if(this.devices[1])this.currentDevice=this.devices[1]
        else this.currentDevice=this.devices[0]
        
        this.selectDevice(this.currentDevice)
        // navigator.mediaDevices.getUserMedia({video: true}).then(this.getMedia).catch(this.failedToGetMedia);
        
    },
    beforeDestroy:function(){
       if (this.interval) clearInterval(this.interval); 
       if (this.videoDevice) this.videoDevice.stop(); 
    }
  }
</script>
<style scoped>
.capture {
      min-height: calc(100vh - 56px - 56px)!important;
      margin: -10px;
    }
#photo{
 
  width: 100%;
}
.x-large{
  width: 100px;
  height: 100px;
}
.x-large .icon{
  font-size: 48px;
  height: 48px;
  width: 48px;
}
.minor{
  margin-top: 0px;
}

 #helpmepets {
 background: none !important;
 background-color: #FFE5B6 !important;
 
 }
 .camera-btn{
   margin-top: 40px;
 }

  main{
 background: #FFE5B6 url('/static/img/bg_light.png') no-repeat center center fixed !important;
 -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
 }
</style>
