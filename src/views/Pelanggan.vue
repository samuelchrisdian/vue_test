<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data Pelanggan</b></p>
              <p class="card-description float-right">
                <b-button variant="success" v-if="pelanggan.length " v-b-modal.modalPelanggan v-on:click="Add"><i class="mdi mdi-plus btn-icon-prepend"></i> Pelanggan</b-button>
              </p>

              <div class="table-responsive">
                <div v-if="!pelanggan.length ">
                  <!-- kalo table kosong -->
                    <div class="col" style="text-align: center">
                      <img src="../../public/img/logo.png" width="150px" style="margin-bottom: 10px" alt="logo empty table">
                      <br>
                      <p><b>Yahh belum ada pelanggan nih..</b></p>
                      <b-button variant="success" v-b-modal.modalPelanggan v-on:click="Add"><i class="mdi mdi-plus btn-icon-prepend"></i> Pelanggan</b-button>
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
                  <b-table striped hover :items="pelanggan" :fields="fields">
                  <template v-slot:cell(level)="data">
                    <b-badge variant="warning">{{ data.item.level }}</b-badge>
                  </template>
                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" variant="info" v-on:click="Edit(data.item)" v-b-modal.modalPelanggan><i class="mdi mdi-pencil btn-icon-prepend"></i> Ubah</b-button>&nbsp;
                    <b-button size="sm" variant="danger" v-on:click="Drop(data.item.id_pelanggan)"><i class="mdi mdi-delete btn-icon-prepend"></i> Hapus</b-button>
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
                    <!-- [ "Pelanggan tidak bisa kosong" ] -->
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
                  id="modalPelanggan"
                  @ok="Save"
                >
                  <template v-slot:modal-title>
                    Form Pelanggan
                  </template>
                    <form ref="form">
                      <div class="form-group">
                        <label for="nama" class="col-form-label">Nama Pelanggan</label>
                        <input type="text" name="nama" class="form-control" id="nama" placeholder="Nama Pelanggan" v-model="nama">
                      </div>
                      <div class="form-group">
                        <label for="nik" class="col-form-label">NIK</label>
                        <input type="number" name="nik" class="form-control" id="nik" placeholder="NIK" v-model="nik">
                      </div>
                      <div class="form-group">
                        <label for="no_rekening" class="col-form-label">No Rekening</label>
                        <input type="text" name="no_rekening" class="form-control" id="no_rekening" placeholder="No Rekening" v-model="no_rekening">
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
      id_pelanggan: "",
      nama: "",
      nik: "",
      no_rekening: "",
      telp: "",
      alamat: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      pelanggan: [],
      fields: ["id_pelanggan", "nama", "nik", "no_rekening", "telp", "alamat", "Aksi"],
    }
  },

  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios.get("/pelanggan/" + this.perPage + "/" + offset, conf)
      .then(response => {
        if(response.data.success == true){
          this.$bvToast.hide("loadingToast");
          this.pelanggan = response.data.data.pelanggan;
          this.rows = response.data.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data pelanggan."
          this.$bvToast.show("message");
          console.log(response);
          this.$router.push({name: "login"})
        }
      })
      .catch(error => {
        this.$bvToast.hide("loadingToast");
        this.message = error.response.message
        this.$bvToast.show("message");
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
      this.no_rekening = "";
      this.telp = ""; 
      this.alamat = "";
    },

    Edit : function(item){
      this.action = "update";
      this.id_pelanggan = item.id_pelanggan;
      this.nik = item.nik;
      this.no_rekening = item.no_rekening;
      this.nama = item.nama;
      this.telp = item.telp;
      this.alamat = item.alamat;
    },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      if(this.action === "insert"){
        let form = new FormData();
        form.append("id_pelanggan", this.id_pelanggan);
        form.append("nama", this.nama);
        form.append("nik", this.nik);
        form.append("no_rekening", this.no_rekening);
        form.append("telp", this.telp);
        form.append("alamat", this.alamat);

        this.axios.post("/pelanggan", form, conf)
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
        });
      } else {
        let form = {
          nama: this.nama,
          nik: this.nik,
          no_rekening: this.no_rekening,
          telp: this.telp,
          alamat: this.alamat
        }
        this.axios.put("/pelanggan/" + this.id_pelanggan, form, conf)
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
        this.axios.delete("/pelanggan/" + id, conf)
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