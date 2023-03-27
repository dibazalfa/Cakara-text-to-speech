<template>
  <div class="background-image">
    <div class="h-full">
      <h1 class="text-4xl font-bold flex items-center justify-center py-20">
        CAKARA
      </h1>
      <div
        class="container w-full mx-auto rounded-3xl border-4 py-4 sm:px-6 lg:px-9"
      >
        <div class="flex mx-auto py-8 sm:px-6 lg:px-8">
          <input
            v-model="url"
            class="hover:shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 w-full px-3 rounded-xl text-black placeholder-black"
            type="text"
            placeholder="Drop your link here"
          />
          <button
            type="submit"
            @click="convertLink"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none"
          >
            Convert
          </button>
        </div>
        <textarea
          id="text"
          type="text"
          v-model="textDefault"
          placeholder="Insert your text here"
          class="hover:shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 w-full px-3 py-3 h-60 rounded-xl bg-amber-500 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 text-xl focus:outline-none text-black placeholder-black"
        >
        </textarea>
        <div class="mt-6 flex justify-evenly">
          <select v-model="selectedLanguage" id="voice-select">
                <option
                  v-for="(voice, index) in voices"
                  :key="index"
                  :value="voice.lang"
                  :data-name="voice.name"
                  v-bind:value="voice.value"
                >
                  {{ voice.name }} ({{ voice.lang }})
                </option>
              </select>

          <button
            type="submit"
            @click="speechCreate()"
            class="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none"
          >
            Speak
          </button>
          <button
            type="submit"
            @click="clearText()"
            class="px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:outline-none"
          >
            Clear
          </button>
          <button
            v-if="pause"
            @click="pauseSpeech()"
            class="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none"
          >
            Pause
          </button>
          <button
            v-else
            @click="resumeSpeech()"
            class="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none"
          >
            Resume
          </button>
          <!-- <button type="submit" @click="" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none"
          >Pause</button> -->
          <button
            type="submit"
            @click="stopSpeech()"
            class="px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:outline-none"
          >
            Stop
          </button>
          <!-- <input 
                  type="file"
                  class="form-control"
                  id="formFile"
                  ref="doc"
                  @change="readFile()"> -->
          <input
            type="file"
            class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            id="formFile"
            ref="doc"
            @change="readFile()"
          />
        </div>

        <!-- Translate From -->
        <h1 class="text-4xl font-bold flex items-center justify-center pt-10">
          Translate
        </h1>
        <div class="h-fit pt-5 flex space-x-4 items-center justify-start">
          <div
            class="container mx-auto rounded-3xl border-4 px-4 py-8 sm:px-6 lg:px-8"
          >
            <textarea
              id="text"
              type="text"
              v-model="beforeTranslation"
              placeholder="Type your text here"
              class="hover:shadow-md bg-gray-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 w-full px-3 py-3 h-60 rounded-xl bg-fuchsia-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 text-xl focus:outline-none text-black placeholder-black"
            >
            </textarea>
            <div class="mt-6">
              <select
                v-model="translateFrom"
                name="bhs"
                id="bhs"
                class="p-2 rounded-full bg-gray-100 focus:outline-none"
              >
                <option value="" selected>Pilih Bahasa</option>
                <option value="english">ENGLISH</option>
                <option value="indonesian">INDONESIAN</option>
              </select>
            </div>
          </div>

          <!-- Translate To -->
          <div
            class="container mx-auto rounded-3xl border-4 px-4 py-8 sm:px-6 lg:px-8"
          >
            <textarea
              id="text"
              type="text"
              v-model="afterTranslation"
              placeholder="Translation"
              class="hover:shadow-md bg-gray-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 w-full px-3 py-3 h-60 rounded-xl bg-fuchsia-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 text-xl focus:outline-none text-black placeholder-black"
              disabled
            >
            </textarea>
            <div class="mt-6 flex justify-evenly">
              <select
                v-model="translateTo"
                name="bhs"
                id="bhs"
                class="p-2 rounded-lg bg-gray-100 focus:outline-none"
              >
                <option value="" selected>Pilih Bahasa</option>
                <option value="english">ENGLISH</option>
                <option value="indonesian">INDONESIAN</option>
              </select>
              <button
                type="submit"
                @click="translateText()"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none"
              >
                Translate
              </button>
              <button
                type="submit"
                @click="speakTranslatedText()"
                class="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 focus:outline-none"
              >
                Speak
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.background-image {
  background-image: url("@/assets/BackgroundWeb.png");
  background-size: cover;
  background-position: center center;
}
</style>

<script>
import axios from "axios";
import DOMPurify from "dompurify";
import Speech from "speak-tts";
import Swal from "sweetalert2";
import translate from "translate";

export default {
  data() {
    return {
      url: "",
      textDefault: "",
      text: "",
      file: null,
      langOption: "",
      lang: null,
      voiceName: null,
      beforeTranslation: "",
      translateFrom: "",
      translateTo: "",
      afterTranslation: "",
      translateVoice: "",
      pause: true,
      selectedLanguage: "",
      voices: [],
      voice: "",
    };
  },
  created(){
    this.speech = new Speech();
    this.speech
      .init({
        volume: 0.5,
        lang: "en-GB",
        rate: 1,
        pitch: 1,
        listeners: {
          onvoiceschanged: (voices) => {
            console.log("Voices changed", voices);
            this.voices = voices;
          },
        },
      })
      .then((data) => {
        console.log("Speech is ready", data);
        this.supportText = "Hurray, your browser supports speech synthesis";
      })
      .catch((e) => {
        console.error("An error occured while initializing : ", e);
        this.supportText =
          "Your browser does NOT support speech synthesis. Try using Chrome of Safari instead !";
      });
  },
  methods: {
    async convertLink() {
      try {
        const response = await axios.get(this.url);
        const sanitizedHTML = DOMPurify.sanitize(response.data, {
          ALLOWED_TAGS: [],
        });
        this.textDefault = sanitizedHTML;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to Convert Website",
          text: "Sorry, but this website have a CORS policy",
        });
        console.error(error);
      }
    },
    async speechCreate() {
      console.log(this.selectedLanguage);
      // console.log(this.voice.option.value)

      const selectedVoice = document.getElementById("voice-select");
      const voice = selectedVoice.value.name;

      console.log(selectedVoice.name);
      try {
        let speech = new Speech();
        await speech.init({
          volume: 0.5,
          lang: this.selectedLanguage,
          rate: 1,
          pitch: 1,
          name: this.voiceName,
          voice: voice,
          splitSentences: true,
          maxLength: 500,
        });
        speech.speak({
          text: this.textDefault,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Pilih Bahasa",
          text: "kelihatannya kamu belum menentukan bahasamu",
        });
        console.error(error);
        console.log(error);
      }
    },
    pauseSpeech() {
      let speech = new Speech();
      speech.pause();
      this.pause = false;
    },
    resumeSpeech() {
      let speech = new Speech();
      speech.resume();
      this.pause = true;
    },
    stopSpeech() {
      let speech = new Speech();
      speech.cancel();
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
      let speech = new Speech();
      speech.cancel();
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
  },
};
</script>
