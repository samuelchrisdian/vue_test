<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data Karyawan</b></p>
              <p class="card-description float-right">
                <b-button variant="success" v-if="user.length" v-b-modal.modalTatib v-on:click="Add"><i class="mdi mdi-plus btn-icon-prepend"></i> Karyawan</b-button>
              </p>

              <div class="table-responsive">
                <div v-if="!user.length">
                  <!-- kalo table kosong -->
                    <div class="col" style="text-align: center">
                      <img src="../../public/img/logo.png" width="150px" style="margin-bottom: 10px" alt="logo empty table">
                      <br>
                      <p><b>Yahh belum ada karyawan nih..</b></p>
                      <b-button variant="success" v-b-modal.modalTatib v-on:click="Add"><i class="mdi mdi-plus btn-icon-prepend"></i> Karyawan</b-button>
                    </div>
                </div>
                <div v-else>
                  <!-- wanna use filter? -->
                  
                  <!-- <div class="row">
                    <div class="col-6">
                      <h7>Cari Pelanggan :</h7>
                      <b-form-select name="id_pelanggan" id="id_pelanggan" v-model="id_pelanggan" @change="searching">
                          <option value="" disabled selected>Pilih Pelanggan</option>
                          <option :value="pelanggan.id_pelanggan" v-for="pelanggan in pelanggan" :key="pelanggan.id_pelanggan">{{pelanggan.nik}} - {{pelanggan.nama}}</option>
                      </b-form-select>
                    </div>
                    <div class="col-6">
                      <h7>Cari berdasarkan Tanggal :</h7>
                      <b-form-input type="date" @change="searching" v-model="search"
                      placeholder="Cari berdasarkan tanggal"
                      ></b-form-input>
                    </div>
                  </div> -->
                  <!-- <br> -->
                  <b-table striped hover :items="user" :fields="fields">
                  <template v-slot:cell(level)="data">
                    <b-badge variant="warning">{{ data.item.level }}</b-badge>
                  </template>
                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" variant="info" v-on:click="Edit(data.item)" v-b-modal.modalTatib><i class="mdi mdi-pencil btn-icon-prepend"></i> Ubah</b-button>&nbsp;
                    <b-button size="sm" variant="danger" v-on:click="Drop(data.item.id)"><i class="mdi mdi-delete btn-icon-prepend"></i> Hapus</b-button>
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="rows"
                  align="center"
                  v-on:input="pagination">
                </b-pagination>
                </div>
              </div>
              
              <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="success"></b-spinner>
                  <strong class="text-success">Loading...</strong>
                </b-toast>

                <!-- toast untuk tampilan message box -->
                <b-toast id="messageError" title="Message">
                  <span v-if="message.length == 1">
                    <strong class="text-success">{{ message[0][0] }}</strong>
                  </span>
                  <span v-else>
                    <ul>
                      <li v-for="(message, index) in message" :key="index">
                        <strong class="text-success">{{ message[0] }}</strong>
                      </li>
                    </ul>
                  </span>
                </b-toast>

                <!-- toast untuk tampilan message box -->
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>

                <b-modal 
                  id="modalTatib"
                  @ok="Save"
                >
                  <template v-slot:modal-title>
                    Form Karyawan
                  </template>
                    <form ref="form">
                      <div class="form-group">
                        <label for="nama" class="col-form-label">Nama Karyawan</label>
                        <input type="text" name="nama" class="form-control" id="nama" placeholder="Nama Karyawan" v-model="nama">
                      </div>
                      <div class="form-group">
                        <label for="nik" class="col-form-label">NIK</label>
                        <input type="number" name="nik" class="form-control" id="nik" placeholder="NIK" v-model="nik">
                      </div>
                      <div class="form-group">
                        <label for="nis" class="col-form-label">Username</label>
                        <input type="text" name="username" class="form-control" id="username" placeholder="Username" v-model="username">
                      </div>
                      <div class="form-group">
                        <label for="password" class="col-form-label">Kata Sandi</label>
                        <input type="password" name="password" class="form-control" id="password" placeholder="Kata Sandi" v-model="password">
                      </div>
                      <div class="form-group">
                        <label for="telp" class="col-form-label">Telepon</label>
                        <input type="number" name="telp" class="form-control" id="telp" placeholder="Telepon" v-model="telp">
                      </div>
                      <div class="form-group">
                        <label for="alamat" class="col-form-label">Alamat</label>
                        <input type="text" name="alamat" class="form-control" id="alamat" placeholder="Alamat" v-model="alamat">
                      </div>
                    </form>
                </b-modal>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data : function(){
    return {
      search: "",
      id: "",
      nama: "",
      nik: "",
      username: "",
      password: "",
      telp: "",
      alamat: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      user: [],
      fields: ["id", "nama", "nik", "username", "telp", "alamat", "Aksi"],
    }
  },

  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios.get("/karyawan/" + this.perPage + "/" + offset, conf)
      .then(response => {
        if(response.data.success == true){
          this.$bvToast.hide("loadingToast");
          this.user = response.data.data.user;
          this.rows = response.data.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data Karyawan."
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }
        
      })
      .catch(error => {
        console.log(error.response);
      });
    },

    pagination : function(){
      if(this.search == ""){
        this.getData();
      } else {
        this.searching();
      }
    },

    Add : function(){
      this.action = "insert";
      this.nama = "";
      this.nik = "";
      this.username = "";
      this.password = ""; 
      this.telp = ""; 
      this.level = "";
      this.alamat = "";
    },

    Edit : function(item){
      this.action = "update";
      this.id = item.id;
      this.nik = item.nik;
      this.nama = item.nama;
      this.username = item.username;
      this.password = item.password;
      this.telp = item.telp;
      this.alamat = item.alamat;
    },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      if(this.action === "insert"){
        let form = new FormData();
        form.append("id", this.id);
        form.append("nama", this.nama);
        form.append("nik", this.nik);
        form.append("username", this.username);
        form.append("password", this.password);
        form.append("telp", this.telp);
        form.append("level", this.level);
        form.append("alamat", this.alamat);

        this.axios.post("/karyawan", form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          this.$bvToast.hide("loadingToast");
          const err = error.response.data.errors
          this.message = Object.values(err);
          this.$bvToast.show("messageError");
        })
        .catch(error => {
          console.log(error.response);
        });
      } else {
        let form = {
          nama: this.nama,
          nik: this.nik,
          username: this.username,
          password: this.password,
          telp: this.telp,
          level: this.level,
          alamat: this.alamat
        }
        this.axios.put("/karyawan/" + this.id, form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },

    Drop : function(id){
      let conf = { headers: { "Authorization" : "Bearer " + this.key} };
      if(confirm('Apakah anda yakin ingin menghapus data ini?')){
        this.$bvToast.show("loadingToast");
        this.axios.delete("/karyawan/" + id, conf)
        .then(response => {
            this.getData();
            this.$bvToast.hide("loadingToast");
            this.message = response.data.message;
            this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
  },
  mounted(){
    this.key = localStorage.getItem("Authorization");
    this.getData();
  }
}
</script>