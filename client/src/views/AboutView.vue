<template>
  <div>
    <div class="container text-center mb-3 pb-3">
      <h1>Tekmul woy</h1>
    </div>
    <div class="container text-center mt-2 pt-2">
      <div class="col">
        <div class="card">
          <div class="card-header">Text-to-speech</div>
          <div class="card-body grid gap-0 column-gap-2 p-2 m-2 g-col-6">
            <div class="input-group input-group-sm mb-3">
              <button @click="convertLink()" class="input-group-text btn btn-primary">Convert to Text</button>
              <input type="text" class="form-control" v-model="url" placeholder="Masukkan URL Website">
            </div>
            <textarea 
              placeholder="Masukkan Text"
              class="form-control" 
              style="height: 500px;" 
              v-model="textDefault">
            </textarea>
            <br>
            <div class="d-flex gap-2 lang-select">
              <button @click="speechCreate()" class="btn btn-primary">
                Speak
              </button>
              <select class="form-select" 
                aria-label="Default select example"
                v-model="langOption"
                >
                <option selected disabled>Select a languange</option>
                <option value="ID">Bahasa Indonesia</option>
                <option value="EN">Bahasa Inggris</option>
                <option value="JV">Bahasa Jawa</option>
                <option value="FR">Bahasa Perancis</option>
              </select>
              <div class="doc-select">
                <input 
                  type="file"
                  class="form-control"
                  id="formFile"
                  ref="doc"
                  @change="readFile()">
              </div>
              <div class="d-flex flex-row">
                <button @click="clearText()" class="btn btn-primary">
                  Clear
                </button>
                <div>
                  <button v-if="pause" @click="pauseSpeech()" class="btn btn-primary">
                    Pause
                  </button>
                  <button v-else @click="resumeSpeech()" class="btn btn-primary">
                    Resume
                  </button>
                </div>
                <button @click="stopSpeech()" class="btn btn-primary">
                  Stop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    <!-- Translate dari TTS -->
    <br><br>
      <div class="col">
        <div class="card w-100">
          <div class="card-body">
            <h5 class="card-title">Terjemahkan ke bahasa lain</h5>
            <div class="form-floating pb-3">
              <textarea 
                class="form-control"
                style="height: 100px"
                v-model="afterTranslationDefault"
                disabled
              ></textarea>
            </div>
            <!-- select languange -->
            <div class="d-flex flex-row w-60 gap-2">
              <select
                class="form-select"
                v-model="translateToDefault"
              >
                <option value="indonesian">Bahasa Indonesia</option>
                <option value="english">Bahasa Inggris</option>
                <option value="javanese">Bahasa Jawa</option>
                <option value="sundanese">Bahasa Sunda</option>
              </select>
              <div class="d-flex flex-row justify-content-end">
                <a class="btn btn-primary" @click="translateTextDefault()">Translate</a>
              </div>
              <div class="d-flex flex-row justify-content-end">
                <a class="btn btn-primary" @click="speakTranslatedTextDefault()">Speak</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Translate -->
      <br /><br />

    <div class="row">
      <div class="col">
        <div class="card w-100">
          <div class="card-body">
            <h5 class="card-title">From</h5>
            <div class="form-floating pb-3">
                  <textarea
                    placeholder="Masukkan Teks"
                    class="form-control"
                    id="floatingTextarea2"
                    style="height: 100px"
                    v-model="beforeTranslation"
                  ></textarea>
                </div>
                <div class="d-flex flex-row gap-2 w-50">
                  <select
                      class="form-select"
                      aria-label="Default select example"
                      v-model="translateFrom"
                    >
                      <option value="indonesian">Bahasa Indonesia</option>
                      <option value="english">Bahasa Inggris</option>
                      <option value="javanese">Bahasa Jawa</option>
                      <option value="sundanese">Bahasa Sunda</option>
                    </select>
                  </div>
          </div>
        </div>
      </div>
  
      <div class="col">
        <div class="card w-100">
          <div class="card-body">
            <h5 class="card-title">To</h5>
            <div class="form-floating pb-3">
                  <textarea
                    class="form-control"
                    id="floatingTextarea2"
                    style="height: 100px"
                    v-model="afterTranslation"
                    disabled
                  ></textarea>
                </div>
                <!-- select language -->
                <div class="d-flex flex-row w-60 gap-2">
                  <select
                      class="form-select"
                      aria-label="Default select example"
                      v-model="translateTo"
                    >
                      <option value="indonesian">Bahasa Indonesia</option>
                      <option value="english">Bahasa Inggris</option>
                      <option value="javanese">Bahasa Jawa</option>
                      <option value="sundanese">Bahasa Sunda</option>
                    </select>
                    <div class="d-flex flex-row justify-content-end">
                      <a class="btn btn-primary" @click="translateText()">Translate</a>
                    </div>
                    <div class="d-flex flex-row justify-content-end">
                      <a class="btn btn-primary" @click="speakTranslatedText()">Speak</a>
                    </div>
                </div>
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
      langOption: null,
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
      this.afterTranslationDefault = "";
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
