<template>
  <div class="background-image">
    <div class="h-full">
      <h1 class="text-4xl font-bold flex items-center justify-center py-20">CAKARA</h1>
        <div class="container w-full mx-auto rounded-3xl border-4 py-4 sm:px-6 lg:px-9">
          <div class="flex mx-auto py-8 sm:px-6 lg:px-8">
          <input v-model="url" class="hover:shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 w-full px-3 rounded-xl text-black placeholder-black" type="text" placeholder="Drop your link here">
          <button type="submit" @click="convertLink" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none">Convert</button>
        </div>
        <textarea
          id="text"
          type="text" 
          v-model="textDefault"
          placeholder="Insert your text here"
          class="hover:shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10  w-full px-3 py-3 h-60 rounded-xl bg-amber-500 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 text-xl focus:outline-none text-black placeholder-black">
        </textarea>
        <div class="mt-6 flex justify-evenly">
          <select v-model="langOption" name="bhs" id="bhs" class="p-2 rounded-lg bg-gray-100 placeholder-black focus:outline-none">
            <option value="" selected>Pilih Bahasa</option> 
            <option value="EN">ENGLISH</option> 
            <option value="ID">INDONESIAN</option>
          </select>
          <button type="submit" @click="speechCreate()" class="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none"
          >Speak</button>
          <button type="submit" @click="clearText()" class="px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:outline-none"
          >Clear</button>
            <button v-if="pause" @click="pauseSpeech()" class="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none">
              Pause
            </button>
            <button v-else @click="resumeSpeech()" class="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none">
              Resume
            </button>
          <!-- <button type="submit" @click="" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none"
          >Pause</button> -->
          <button type="submit" @click="stopSpeech()" class="px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:outline-none"
          >Stop</button>
          <!-- <input 
                  type="file"
                  class="form-control"
                  id="formFile"
                  ref="doc"
                  @change="readFile()"> -->
          <input type="file" class="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
            id="formFile"
            ref="doc"
            @change="readFile()"/>
        </div>

        <!-- Translate From -->
        <h1 class="text-4xl font-bold flex items-center justify-center pt-10">Translate</h1>
        <div class="h-fit pt-5 flex space-x-4 items-center justify-start">
        <div class="container mx-auto rounded-3xl border-4 px-4 py-8 sm:px-6 lg:px-8">
        <textarea
          id="text"
          type="text"
          v-model="beforeTranslation"
          placeholder="Type your text here"
          class="hover:shadow-md bg-gray-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 w-full px-3 py-3 h-60 rounded-xl bg-fuchsia-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 text-xl focus:outline-none text-black placeholder-black"> 
          </textarea>    
        <div class="mt-6">
          <select v-model="translateFrom" name="bhs" id="bhs" class="p-2 rounded-full bg-gray-100 focus:outline-none">
            <option value="" selected>Pilih Bahasa</option>
            <option value="english">ENGLISH</option>
            <option value="indonesian">INDONESIAN</option>
          </select>
        </div>
      </div>

      <!-- Translate To -->
      <div class="container mx-auto rounded-3xl border-4 px-4 py-8 sm:px-6 lg:px-8">
        <textarea
          id="text"
          type="text"
          v-model="afterTranslation"
          placeholder="Translation"
          class="hover:shadow-md bg-gray-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 w-full px-3 py-3 h-60 rounded-xl bg-fuchsia-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 text-xl focus:outline-none text-black placeholder-black"
          disabled>  
          </textarea>   
        <div class="mt-6 flex justify-evenly">
          <select v-model="translateTo" name="bhs" id="bhs" class="p-2 rounded-lg bg-gray-100 focus:outline-none">
            <option value="" selected>Pilih Bahasa</option>
            <option value="english">ENGLISH</option>
            <option value="indonesian">INDONESIAN</option>
          </select>
          <button type="submit" @click="translateText()" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none">Translate</button>
          <button type="submit" @click="speakTranslatedText()" class="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 focus:outline-none">Speak</button>
        </div>
        </div>
      </div>
      </div>
    </div>
  </div>
  </template>

<style>
.background-image {
  background-image: url('@/assets/BackgroundWeb.png');
  background-size: cover;
  background-position: center center;
}
</style>

<script>
import axios from 'axios';
import DOMPurify from 'dompurify';
import Speech from "speak-tts";
import Swal from 'sweetalert2';
import translate from "translate";

export default {
  data() {
    return {
      url: '',
      textDefault: '',
      text: "",
      file: null,
      langOption: "",
      lang: null,
      voiceName: null,
      beforeTranslation: '',
      translateFrom: '',
      translateTo: '',
      translateToDefault: '',
      afterTranslation: '',
      afterTranslationDefault: '',
      translateVoice: '',
      pause: true,
    };
  },
  methods: {
    async convertLink() {
      try {
        const response = await axios.get(this.url);
        const sanitizedHTML = 
          DOMPurify.sanitize(response.data, 
          { ALLOWED_TAGS: []});
        this.textDefault = sanitizedHTML;
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Convert Website',
          text: 'Sorry, but this website have a CORS policy'
        })
        console.error(error);
      }
    },
    async speechCreate() {
      try {
      let speech;
      if (this.langOption == "ID") {
        speech = new Speech();
        this.lang = "id-ID";
        this.voiceName = "Google Bahasa Indonesia";
      } else if (this.langOption == "EN") {
        speech = new Speech();
        this.lang = "en-GB";
        this.voiceName = "Google UK English Female";
      } else if (this.langOption == "JV") {
        speech = new Speech();
        speech.setLanguage("jv-ID");
        this.lang = "jv-ID";
        this.voiceName = "Microsoft Siti Online (Natural) - Javanese (Indonesia)";
      } else if (this.langOption == "FR") {
        speech = new Speech();
        speech.setLanguage("fr-FR");
        this.lang = "fr-FR";
        this.voiceName = "Microsoft Eloise Online (Natural) - French (France)";
      }
      await speech.init({
        volume: 0.5,
        lang: this.lang,
        rate: 1,
        pitch: 1,
        name: this.voiceName,
        voiceURI: this.voiceName,
        splitSentences: true,
        maxLength: 500,
      });
      speech.speak({
        text: this.textDefault,
      });
    } catch(error) {
      Swal.fire({
          icon: 'error',
          title: 'Bahasa belum dipilih',
          text: 'Pilih bahasa terlebih dahulu'
        })
        console.error(error);
    }
    },
    pauseSpeech() {
      let speech = new Speech()
      speech.pause()
      this.pause = false
    },
    resumeSpeech() {
      let speech = new Speech()
      speech.resume()
      this.pause = true
    },
    stopSpeech() {
      let speech = new Speech()
      speech.cancel()
    },
    readFile() {
      this.file = this.$refs.doc.files[0];
      const reader = new FileReader();
      if (this.file.name.includes(".txt")) {
        reader.onload = (res) => {
          this.textDefault = res.target.result;
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(this.file);
      } else {
        this.textDefault = "check the console for file output";
        reader.onload = (res) => {
          console.log(res.target.result);
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(this.file);
      }
    },
    clearText() {
      this.textDefault = "";
      let speech = new Speech()
      speech.cancel()
    },
    async translateText() {
      const fromLang = this.translateFrom;
      const toLang = this.translateTo;
      // console.log(fromLang, toLang);
      let text = await translate(this.beforeTranslation, {
        from: fromLang,
        to: toLang,
      });
      // console.log(text);
      this.afterTranslation = text;
    },
    async speakTranslatedText(){
      const speech = new Speech()
      
      if (this.translateTo == "indonesian") {
        this.lang = "id-ID";
        this.voiceName =
          "Microsoft Ardi Online (Natural) - Indonesian (Indonesia) " ||
          "Google Bahasa Indonesia";
      } else if (this.translateTo == "english") {
        this.lang = "en-GB";
        this.voiceName =
          "Google UK English Female" ||
          "Microsoft Maisie Online (Natural) - English (United Kingdom)";
      } else if (this.translateTo == "javanese") {
        speech.setLanguage("jv-ID");
        this.lang = "jv-ID";
        this.voiceName =
          "Microsoft Siti Online (Natural) - Javanese (Indonesia)";
      } else if (this.translateTo == "sundanese") {
        speech.setLanguage("su-ID");
        this.lang = "su-ID";
        this.voiceName =
          "Microsoft Tuti Online (Natural) - Sundanese (Indonesia)";
      }
  
      await speech.init({
          volume: 0.5,
          lang: this.lang,
          rate: 1,
          pitch: 1,
          name: this.voiceName,
          voiceURI: this.voiceName,
          splitSentences: true,
          listeners: {
            onvoiceschanged: (voices) => {
              console.log("Event voiceschanged", voices);
            },
          },
        });
        speech.speak({
          text: this.afterTranslation,
        });
    }
  },
};
</script>
