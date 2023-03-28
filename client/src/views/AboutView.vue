<template>
  <div class="background-image">
    <!-- konten komponen Vue.js Anda -->

    <header>
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container-fluid">
        <!-- <a class="navbar-brand " href="#">
          <img src="../assets/logo.png" width="30" height="30" alt="Logo">
          Cakara
        </a> -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about">About</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <div class="about-container">
    <!-- <h1>About Our Website</h1> -->
    <img class="about-image" src="../assets/about.png" width="500" height="60"  alt="About Us Image">
    <br>
    <img class="about-image" src="../assets/cakara.png" alt="About Us Image">
    <div >
      <!-- <div class="col-lg-6">
        <img class="about-image" src="../assets/foto_rara.jpg" alt="About Us Image">
      </div> -->
      <div class="col-lg-12">
        <div class="logo-cakra">
          <img class="about-image" src="../assets/logo.png" alt="About Us Image">
        </div>
      </div>
      <div class="col-lg-12">
        <p class="about-description">Membaca seringkali merupakan perjuangan berat bagi orang-orang dengan gangguan seperti disleksia, ADHD, dan ketidakmampuan visual atau belajar. Tidak sedikit pelajar yang sering merasa tertinggal karena perbedaan tersebut yang menyebabkan kurangnya kepercayaan diri. Belum lagi orang dewasa yang telah mengatasi kekurangannya tetapi masih merasa kesulitan membaca dan berimbas pada produktifitas kerja.</p>
        <p class="about-description">Untungnya, kemajuan teknologi telah berevolusi. Dengan adanya teknologi text to speech (TTS), kita dapat mengasah kemampuan membaca dan meningkatkan produktivitas dalam segala bidang. Hal tersebut dapat terpenuhi dengan beberapa fitur pada aplikasi Hahahahah ini, yaitu text to speech, terjemahan berbagai bahasa, input file text document dari penyimpanan, input langsung melalui link website, serta fitur stop, pause, resume dan clear audio.</p>
        <p class="about-description">Tujuan dan Manfaat dari aplikasi ini tidak tertuju pada suatu kalangan tertentu. Aplikasi ini dapat bermanfaat untuk kumpulan orang yang memiliki gangguan untuk membaca seperti pengidap disleksia maupun para anak kecil yang baru belajar membaca. Selain itu, aplikasi ini dapat meningkatkan produktivitas banyak golongan orang dengan dapat “membaca” apapun yang ingin kita baca sesuai dengan kebutuhan masing masing, seperti contoh berita terkini, resep masakan, maupun dokumen kerja yang belum sempat kita review.</p>
      </div>
    </div>
    <br>
    <div class="b">
      <!-- <h1>Meet Our Team</h1> -->
      <img class="about-image" src="../assets/meet.png" width="400" height="50" alt="About Us Image">
    </div>
    <br><br>
    <div class="row">
      <!-- <div class="col-md-4">
          <div class="card">
            <img class="card-img-top" src="../assets/foto_rara.jpg" alt="Team Member">
            <div class="card-body">
              <h5 class="card-title">John Doe</h5>
              <p class="card-text">Team Member</p>
            </div>
          </div>
      </div> -->

      <div class="col-md-3">
        <div class="team-member">
          <img src="../assets/foto_aqil.jpg" alt="Team Member 1">
          <h4>Aqil Sulthan Yuki Maye</h4>
          <p>5027211007</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="team-member">
          <img src="../assets/foto_rehan.jpg" alt="Team Member 2">
          <h4>Athaya Reyhan Nugroho</h4>
          <p>5027221067</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="team-member">
          <img src="../assets/foto_defa.jpg" alt="Team Member 3">
          <h4>Adimasdeftara Bimasena S.</h4>
          <p>5027211040</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="team-member">
          <img src="../assets/foto_arkan.jpg" alt="Team Member 1">
          <h4>Arkan Hendri Abdul G. B.</h4>
          <p>5027211026</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="team-member">
          <img src="../assets/foto_diba.jpg" alt="Team Member 2">
          <h4>Adiba Zalfa Camilla</h4>
          <p>5027211060</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="team-member">
          <img src="../assets/foto_rara.jpg" alt="Team Member 3">
          <h4>Annisa Rahmapuri</h4>
          <p>5027211018</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="team-member">
          <img src="../assets/foto_poni.jpg" alt="Team Member 1">
          <h4>M. Hilmy Adhi Pradityo</h4>
          <p>5027211053</p>
        </div>
      </div> 
      <div class="col-lg-12">
        <br>
        <p class="about-description">Website ini dibuat sebgai tugas 3 Konsep Dasar Multimedia dari Mata Kuliah Teknologi Multimedia</p>
        <p class="about-description">Dosen Pengampu  Ibu Henning Titi Ciptaningtyas S.Kom, M.Kom</p>
        </div>
    </div>
  </div>
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


<style>
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'); */

  .background-image {
    background-image: url('../assets/background2.png');
    background-size: cover;
    background-position: center center;
    font-family: 'Poppins';
    font-weight: 400;
    font-size: 18px;
    color: #3D366B;
    
  }
  .about-container {
  max-width: 1500px;
  margin: auto;
  padding: 40px;
  text-align: center;
}

.navbar-nav {
  display: flex;
  justify-content: flex-end;
  margin: 0 0 0 1100px;
  font-weight: 600;
  color: #3D366B;
}

.navbar-nav a {
  color: #3D366B;
}



.logo-cakra img {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.container-fluid img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.card {
  width: 200px;
}


.team-member {
  text-align: center;
}

.team-member img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}

</style>
