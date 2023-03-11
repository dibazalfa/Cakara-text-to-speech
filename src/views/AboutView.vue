<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>

  <input type="file" ref="doc" @change="readFile()" id="upload">
  <div>{{ content }}</div>

  <div>
    <input id="html" type="text" v-html="htmlCode">
    <!-- <div v-html="htmlCode"></div> -->
    <button @click="convertToText">Konversi ke Teks</button>
    <p>Hasil: {{ text }}</p>
  </div>
</template>

<script>
  export default {
    name: "App",

    data() {
      return {
        file: null,
        content: null,
        htmlCode: '',
        text: ''
      };
    },
    methods: {
      readFile() {
        this.file = this.$refs.doc.files[0];
        const reader = new FileReader();
        if (this.file.name.includes(".txt")) {
          reader.onload = (res) => {
            this.content = res.target.result;
          };
          reader.onerror = (err) => console.log(err);
          reader.readAsText(this.file);
        } else {
          this.content = "check the console for file output";
          reader.onload = (res) => {
            console.log(res.target.result);
          };
          reader.onerror = (err) => console.log(err);
          reader.readAsText(this.file);
        }
      },
      convertToText() {
        let el = document.createElement('html')
        el.innerHTML = this.htmlCode
        this.text = el.innerText
      }
    }
  }
</script>
