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
            <!-- <input class="form-control" v-model="url" placeholder="Masukkan URL Website"> -->
            <!-- <button @click="convertLink" class="btn btn-primary">Ubah ke plaintext</button> -->
            <textarea 
              placeholder="Masukkan Text"
              class="form-control" 
              style="height: 500px;" 
              v-model="textDefault">
            </textarea>
            <br>
            <br>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <p>{{ plainText }}</p> -->
  </div>
</template>

<script>
import axios from 'axios';
import DOMPurify from 'dompurify';
import Speech from "speak-tts";
import Swal from 'sweetalert2';

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
    },
  },
};
</script>
