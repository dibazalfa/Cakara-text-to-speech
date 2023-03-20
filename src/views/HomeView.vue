<template>
  <div id="app">
  <h1>Text to Speech Reader</h1>
  <form>
    <table class="calc">
      <tbody>
        <tr>
          <td><label for="text">Enter text here:</label></td>
        </tr> 
        <tr>
          <td><textarea id="area" ref="area" :style="{fontSize: `${fontsize}px`}" rows="10" v-model="area" class="form-control" autofocus>
        
          </textarea></td>
        </tr>
        <tr>
          <td>
            <input type="file" ref="doc" @change="readFile()" class="btn btn-default" ><i class="glyphicon glyphicon-play"></i>

            <button type="button" @click="SpeechForm.playbtn()" class="btn btn-default" ><i class="glyphicon glyphicon-play"></i> Play</button>
            <button type="button" @click="SpeechForm.stopbtn()" class="btn btn-default"><i class="glyphicon glyphicon-stop"></i> Stop</button>
            <button type="button" @click="SpeechForm.resetform()" class="btn btn-default"><i class="glyphicon glyphicon-remove"></i> Clear</button>
            <button type="button" @click="SpeechForm.copy()" class="btn btn-default"><i class="glyphicon glyphicon-duplicate"></i> Copy</button>
            <button type="button" @click="SpeechForm.downloadSound()" class="btn btn-default"><i class="glyphicon glyphicon-download"></i> Download</button>
            <select v-model="voiceindex">
              <option v-for="voice in voiceselect" v-bind:key="voice" :value="voice.value">{{voice.text}}</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
</div>
</template>

<script>
export default {
  name: "App",
  data(){
    var vm = this
    var s = { INIT:1, PLAY:2, PAUSED:3, END:4 }
    return{
      file: null,
      area: null,
      txt:'',
      fontsize:18,
      iplay: null, 
      previplay: null, 
      playstate:s.INIT,
      start: null,
      end: null,
      msg:null,
      imsg: null,
      voices:[],
      voiceindex:0,
      volume:null,
      back: false,
      play: false,
      
      forw: false,
      area: '',
      voiceselect: [],
      SpeechForm:{
        init(){
          vm.playstate = s.INIT;
          vm.back = false;
          vm.play = false;
          vm.forw = false;
          var area = vm.area
          vm.txt= area.replace(/\t/g,"");
          this.populateVoiceList();
        },
        populateVoiceList() {
          var voices = vm.SpeechSynth.getvoices();
          if( voices==null ) return;
          if( voices.length>21 ) voices.length=21;
          for(var i=0; i<voices.length; i++) {
            var textContent = voices[i].name + ' (' + voices[i].lang + ')';
            if( textContent.substring(0,6)=="Google" )
              textContent = textContent.substring(7,textContent.length);
            if( textContent.substring(0,9)=="Microsoft" )
              textContent = textContent.substring(10,textContent.length);
            vm.voiceselect.push({value: i, text: textContent});
          }
          i=1;
          if( voices.length>=4 ) i=4;
          //vm.SpeechSynth.setvoice(i-1);
        },
        copy()
        {
          vm.$refs.area.select();
          document.execCommand('copy');
        },
        // downloadSound() {
        //   var blob = new Blob([vm.area], {type: "sound/mp3"});
        //   var url = URL.createObjectURL(blob);
        //   var a = document.createElement('a');
        // },
        resetform() {
          vm.SpeechSynth.stop();
          vm.area = ''
          vm.$refs.area.focus();
        },
        stopbtn() { 
        vm.SpeechSynth.stop();
        if( vm.playstate==s.INIT ) {
          vm.playstate=s.END;
          vm.SpeechForm.playmng();
        }
          else
            vm.playstate=s.END;
        },
        setselect() {
          if(vm.$refs.area){
            vm.$refs.area.selectionStart = vm.start;
            vm.$refs.area.selectionEnd = vm.end;
            vm.$refs.area.focus();
          }
        },
        playbtn() {
          if( vm.playstate==s.END ) vm.playstate = s.INIT;
          
          if( vm.playstate==s.INIT ) {
            vm.play = false
            vm.SpeechForm.playmng();
          }
          else if( vm.playstate==s.PLAY ) {
            vm.play = true
            vm.playstate=s.PAUSED;
            //SpeechSynth.pause();
            vm.SpeechSynth.stop();
            vm.SpeechForm.setselect();
          }
          else if( vm.playstate==s.PAUSED ) {
            vm.playstate = s.PLAY;
            vm.iplay--;
            vm.SpeechForm.playmng();
            vm.SpeechForm.setselect();
          }
        },
        playmng() {
          switch( vm.playstate ) {
            case s.INIT:
              vm.SpeechSynth.stop();
              if( vm.area=="" ) {
                vm.play = true
                return;
              }
              vm.txt=vm.area.replace(/([.?!:,\r\n])\s*/g, "$1|").split("|");
              if( vm.txt==null || vm.txt.length==0 ) {
                vm.play = true
                return;
              }
              vm.iplay = vm.start = vm.end = 0;
              vm.previplay = -1;
              vm.playstate = s.PLAY;
            case s.PLAY:
              var t=vm.txt[vm.iplay].replace(/[\"\'\’\‘]/gi, "");
              vm.SpeechSynth.play(t);
              if( vm.previplay != vm.iplay ) {
                vm.previplay = vm.iplay;
                vm.start = vm.area.indexOf(vm.txt[vm.iplay],vm.end);
                vm.end = vm.start+vm.txt[vm.iplay].length;
              }
              vm.SpeechForm.setselect();
              if( ++vm.iplay==vm.txt.length )
                vm.playstate = s.END;
              break;
            case s.PAUSED:
              break;
            case s.END:
              vm.play = false
              vm.$refs.area.blur();
              vm.playstate = s.INIT;
              break;
            default:
              console.log("Bad playstate!!!");
              
          }
        }
        
      },
      SpeechSynth:{
        init() {
          if( !('speechSynthesis' in window) ) {
            alert("Speech synthesis is not supported in this browser!\nPlease use Chrome browser.");
            return;
          }
          vm.SpeechSynth.stop();
          vm.voices = window.speechSynthesis.getVoices();
          vm.volume=1.0;
          if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = function() {
              console.log("onvoiceschanged()");
              if( vm.voices.length>0 ) return;
              vm.voices = window.speechSynthesis.getVoices()
              vm.SpeechForm.populateVoiceList();
            };
          }
        },
        getvoices() {
          return vm.voices;
        },
        setvolume(v) {
          vm.volume = v;
        },
        ispending() {
          return window.speechSynthesis.pending;
        },
        stop() {
          window.speechSynthesis.cancel();
        },
        pause() {
          //if( window.speechSynthesis.speaking )
          window.speechSynthesis.pause();
        },
        resume() {
          window.speechSynthesis.resume();
        },
        play(s) {
          if( vm.voices.length==0 ) alert("No voices detected. Please restart the browser and try again.");
          vm.msg = new SpeechSynthesisUtterance();
          vm.msg.onend = function(e) {
            console.log('Finished in ' + e.elapsedTime + ' seconds.');
            vm.SpeechForm.playmng();
          };
          vm.msg.onerror = function(e) {
            console.log('Error in ' + e.elapsedTime + ' seconds.');
            vm.SpeechForm.playmng();
          };
          vm.msg.voice = vm.voices[vm.voiceindex];
          //msg.voiceURI = 'native';
          vm.msg.volume = vm.volume; // 0 to 1
          vm.msg.rate = 0.8; // 0.1 to 10
          vm.msg.pitch = 0; //0 to 2
          vm.msg.text = s;
          vm.msg.lang = vm.voices[vm.voiceindex].lang; //!!!
          //console.log(msg);
          window.speechSynthesis.speak(vm.msg);
          //setTimeout(function() { window.speechSynthesis.speak(msg); }, 0);
          if( ++vm.imsg==2 ) vm.imsg=0;
        }
        
      }
      
    }
  },
  methods: {
    readFile() {
        this.file = this.$refs.doc.files[0];
        const reader = new FileReader();
        if (this.file.name.includes(".txt")) {
          reader.onload = (res) => {
            this.area = res.target.result;
          };
          reader.onerror = (err) => console.log(err);
          reader.readAsText(this.file);
        } else {
          this.area = "check the console for file output";
          reader.onload = (res) => {
            console.log(res.target.result);
          };
          reader.onerror = (err) => console.log(err);
          reader.readAsText(this.file);
        }
      }
  },
  mounted(){
    var vm = this
    vm.SpeechSynth.init();
    vm.SpeechForm.init();   
  }
}
</script>