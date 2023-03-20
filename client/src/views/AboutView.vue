<template>
  <div>
    <input v-model="url" placeholder="Masukkan URL">
    <button @click="convertLink">Ubah ke plaintext</button>
    <textarea v-model="plainText" id="" cols="30" rows="10"></textarea>
  </div>
</template>

<script>
import axios from 'axios';
import DOMPurify from 'dompurify';

export default {
  data() {
    return {
      url: '',
      plainText: '',
    };
  },
  methods: {
    async convertLink() {
      try {
        const response = await axios.get(this.url);
        const sanitizedHTML = DOMPurify.sanitize(response.data, { KEEP_FORMATTING: true });
        this.plainText = sanitizedHTML;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
