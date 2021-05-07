<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data Stock</b></p>
              <p class="card-description float-right">
                <b-button variant="success" v-if="stocks.length" v-b-modal.modalStock v-on:click="Add"> Buat Stock</b-button>&nbsp;
                <b-button variant="info" v-if="stocks.length" v-on:click="StockIn" v-b-modal.modalStock><i class="mdi mdi-plus btn-icon-prepend"></i> Stock</b-button>&nbsp;
                <b-button variant="danger" v-if="stocks.length" v-on:click="StockOut" v-b-modal.modalStock><i class="mdi mdi-minus btn-icon-prepend"></i> Stock</b-button>
              </p>
              <div class="table-responsive">
                <span v-if="!stocks.length ">
                  <!-- kalo table kosong -->
                    <div class="col" style="text-align: center">
                      <img src="../../public/img/logo.png" width="150px" style="margin-bottom: 10px" alt="logo empty table">
                      <br>
                      <p><b>Yahh belum ada stock nih..</b></p>
                      <b-button variant="success" v-on:click="Add"><i class="mdi mdi-plus btn-icon-prepend"></i> Stock</b-button>
                    </div>
                </span>
                <span v-else>
                  <div class="row">
                    <div class="col-6">
                      <b>Cari Material Code :</b>
                      <b-form-input type="text" @keyup.enter="searching" v-model="findByCode"
                      placeholder="Cari berdasarkan Material Code"
                      ></b-form-input>
                    </div>
                    <div class="col-6">
                      <b>Cari Tanggal :</b>
                      <b-form-input type="date" @change="searching" v-model="find"
                      placeholder="Cari berdasarkan tanggal"
                      ></b-form-input>
                    </div>
                  </div>
                  <br>
                  <b-table striped hover :items="stocks" :fields="fields" style="text-align:center">
                    <template v-slot:cell(harga)="data">
                      {{ data.item.harga | currency }}
                    </template>
                    <template v-slot:cell(tgl_input)="data">
                      {{ data.item.created_at | formatDate }}
                    </template>
                    <template v-slot:cell(last_update)="data">
                      {{ data.item.updated_at | formatDate }}
                    </template>
                    <template v-slot:cell(aksi)="data">
                      <b-button size="sm" variant="info" v-on:click="Edit(data.item)" v-b-modal.modalStock><i class="mdi mdi-pencil btn-icon-prepend"></i> Ubah</b-button>&nbsp;
                      <b-button size="sm" variant="danger" v-on:click="Drop(data.item.id_stock)"><i class="mdi mdi-delete btn-icon-prepend"></i> Hapus</b-button>&nbsp;
                    </template>
                  </b-table>
                  <b-pagination
                    v-model="currentPage"
                    :per-page="perPage"
                    :total-rows="rows"
                    align="center"
                    v-on:input="pagination">
                  </b-pagination>
                </span>
              </div>
              

              <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="success"></b-spinner>
                  <strong class="text-success">Loading...</strong>
                </b-toast>
                <!-- toast untuk tampilan message box -->
                <b-toast id="messageError" title="Message">
                  <span v-if="message.length == 1">
                    <strong class="text-success">{{ message[0][0] }}</strong>
                    <!-- [ "Supplier tidak bisa kosong" ] -->
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
                  id="modalStock"
                  @ok="Save"
                >
                  <template v-slot:modal-title>
                    Form Stock
                  </template>

                    <form ref="form">
                      <div v-if="action == 'stock_in'">
                        <div class="form-group">
                          <label for="supplier" class="col-form-label">Supplier</label>
                          <select id="supplier" class="form-control" v-model="id_supplier">
                            <option value="" selected disabled>Pilih Supplier</option>
                            <option :value="supplier.id_supplier" v-for="supplier in supplier" :key="supplier.id_supplier">{{supplier.nama}}</option>
                          </select>
                          <label for="stockIn" class="col-form-label">Stock Masuk</label>
                          <select id="stockIn" class="form-control" @change="getUnit" v-model="id_stock">
                            <option value="" selected disabled>Pilih Barang</option>
                            <option :value="stock.id_stock" v-for="stock in stocks" :key="stock.id_stock">{{stock.material_code}} - {{stock.description}}</option>
                          </select>
                          <!-- <div class="input-group mb-3"> -->
                            <label for="stock" class="col-form-label">Jumlah Stock Masuk</label>
                            <input type="number" class="form-control" id="stock" placeholder="Jumlah Stock Masuk" aria-describedby="basic-addon2" v-model="stock">
                            <!-- <span class="input-group-text" id="basic-addon2">{{unit}}</span> -->
                          <!-- </div> -->
                          <label for="tgl_input" class="col-form-label">Tanggal Input</label>
                          <input type="date" name="tgl_input" class="form-control" id="tgl_input" placeholder="Tanggal Input" v-model="tgl_input">
                        </div>
                      </div>
                      <div v-else-if="action == 'stock_out'">
                        <div class="form-group">
                          <label for="pelanggan" class="col-form-label">Pelanggan</label>
                          <select id="pelanggan" class="form-control" v-model="id_pelanggan">
                            <option value="" selected disabled>Pilih Pelanggan</option>
                            <option :value="pelanggan.id_pelanggan" v-for="pelanggan in pelanggan" :key="pelanggan.id_pelanggan">{{pelanggan.nama}}</option>
                          </select>
                          <label for="stockOut" class="col-form-label">Stock Keluar</label>
                          <select id="stockOut" class="form-control" @change="getUnit" v-model="id_stock">
                            <option value="" selected disabled>Pilih Barang</option>
                            <option :value="stock.id_stock" v-for="stock in stocks" :key="stock.id_stock">{{stock.material_code}} - {{stock.description}}</option>
                          </select>
                          <!-- <div class="input-group mb-3"> -->
                            <label for="stock" class="col-form-label">Jumlah Stock Keluar</label>
                            <input type="number" class="form-control" id="stock" placeholder="Jumlah Stock Keluar" aria-describedby="basic-addon2" v-model="stock">
                            <!-- <span class="input-group-text" id="basic-addon2">{{unit}}</span> -->
                          <!-- </div> -->
                          <label for="tgl_input" class="col-form-label">Tanggal Input</label>
                          <input type="date" name="tgl_input" class="form-control" id="tgl_input" placeholder="Tanggal Input" v-model="tgl_input">
                        </div>
                      </div>
                      <div v-else>
                        <div class="form-group">
                          <label for="tgl_input" class="col-form-label">Tanggal Input</label>
                          <input type="date" name="tgl_input" class="form-control" id="tgl_input" placeholder="Tanggal Input" v-model="tgl_input">
                        </div>
                        <div class="form-group">
                            <label for="description" class="col-form-label">Description</label>
                            <input type="text" name="description" class="form-control" id="description" placeholder="Description" v-model="description">
                        </div>
                        <div class="form-group">
                          <label for="stock" class="col-form-label">Stock</label>
                          <input type="number" name="stock" class="form-control" id="stock" placeholder="Stock" v-model="stock">
                        </div>
                        <div class="form-group">
                          <label for="harga" class="col-form-label">Harga</label>
                          <input type="number" name="harga" class="form-control" id="harga" placeholder="Harga" v-model="harga">
                        </div>
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
export default {
  data : function(){
    return {
      findByCode: "",
      find: "",
      startFrom: "",
      until: "",
      id_stock: "",
      id_supplier: "",
      id_pelanggan: "",
      material_code: "",
      tgl_input: "",
      description: "",
      stock: "",
      unit: "",
      harga: "",
      note: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      stocks: [],
      supplier: [],
      pelanggan: [],
      fields: ["description", "stock", "harga", "tgl_input", "last_update", "Aksi"],
    }
  },

  methods: {
    getData : function(){
      let offset = (this.currentPage - 1) * this.perPage;
      let conf = { headers : {"Authorization" : "Bearer " + localStorage.getItem("Authorization")} };
      this.$bvToast.show("loadingToast");
      this.axios.get("/stock/" + this.perPage + "/" + offset, conf)
      .then(response => {
        if(response.data.success == true){
          this.$bvToast.hide("loadingToast")
          this.stocks = response.data.data.stock
          this.rows = response.data.data.count
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data stock."
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }
        
      })
      .catch(error => {
        console.log(error);
      });
    },
    getSupplier() {
      let offset = (this.currentPage - 1) * this.perPage;
      let conf = { headers : {"Authorization" : "Bearer " + localStorage.getItem("Authorization")} };
      this.axios.get('/supplier/' + this.perPage + "/" + offset, conf)
      .then(response => {
        this.supplier = response.data.data.supplier
      }).catch(error => {
        console.log(error);
      })
    },
    getPelanggan() {
      let offset = (this.currentPage - 1) * this.perPage;
      let conf = { headers : {"Authorization" : "Bearer " + localStorage.getItem("Authorization")} };
      this.axios.get('/pelanggan/' + this.perPage + "/" + offset, conf)
      .then(response => {
        this.pelanggan = response.data.data.pelanggan
      }).catch(error => {
        console.log(error);
      })
    },
    searching: function() {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
        let form = {
          find: this.find,
          findByCode: this.findByCode,
        }
      this.axios.post("/findStock/" + this.perPage + "/" + offset ,form, conf)
        .then(response => {
          if (response.data.success) {
            this.$bvToast.hide("loadingToast");
            this.stocks = response.data.data.stock;
          } else {
            // window.location = "/transaksi";
          }
        })
        .catch(error => {
          console.log(error);
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
      // if (this.supplier.length < 1) {
      //   this.message = 'Supplier belum tersedia'
      //   // $bvToast.show('message') // kalo toastnya mau dipanggil 1 doang, just in case
      //   const h = this.$createElement
      //   const message = h(
      //     'strong',
      //     { class: 'text-success'},this.message
      //   )
      //   this.$bvToast.toast(message, {
      //     title: 'Message',
      //     autoHideDelay: 5000,
      //     appendToast: false
      //   })
      // } else {
        this.$bvModal.show('modalStock')
        this.action = "insert";
        this.material_code = "";
        this.tgl_input = "";
        this.description = "";
        this.stock = ""; 
        this.unit = ""; 
        this.harga = ""; 
        this.note = ""; 
    },
    Edit : function(item){
      this.action = "update";
      this.id_stock = item.id_stock;
      this.material_code = item.material_code;
      this.tgl_input = item.updated_at;
      this.description = item.description;
      this.stock = item.stock;
      this.unit = item.unit;
      this.harga = item.harga;
      this.note = item.note;
    },
    getUnit() {
    },
    StockIn(item) {
      this.action = "stock_in"
      this.stock = "",
      this.tgl_input = ""
    },
    StockOut(item) {
      this.action = "stock_out"
      this.stock = "",
      this.tgl_input = ""
    },
    Save : function(){
      this.$bvToast.show("loadingToast");
      let conf = { headers : {"Authorization" : "Bearer " + localStorage.getItem("Authorization")} };
      const form = {
          // id_supplier: this.id_supplier,
          material_code: this.material_code,
          created_at: this.tgl_input,
          description: this.description,
          stock: this.stock,
          unit: this.unit,
          harga: this.harga,
          note: this.note,
      }
      if(this.action === "insert"){
        this.axios.post("/stock", form, conf)
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
      } else if (this.action === "update") {
        {
        let form = {
          material_code: this.material_code,
          updated_at: this.tgl_input,
          description: this.description,
          stock: this.stock,
          unit: this.unit,
          harga: this.harga,
          note: this.note,
        }
        this.axios.put("/stock/" + this.id_stock, form, conf)
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
          console.log(this.message);
          this.$bvToast.show("messageError");
        });
        }
      } else if (this.action === "stock_in") {
        const stock_in = {
          id_stock: this.id_stock,
          id_supplier: this.id_supplier,
          stock: this.stock,
          created_at: this.tgl_input,
        }
        this.axios.post('stockIn', stock_in, conf).then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        }).catch(error => {
          console.log(error.response);
        })
      } else {
        const stock_out = {
          id_stock: this.id_stock,
          id_pelanggan: this.id_pelanggan,
          stock: this.stock,
          created_at: this.tgl_input,
        }
        this.axios.post('stockOut', stock_out, conf).then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        }).catch(error => {
          console.log(error.response);
        })
      }
    },
    Drop : function(id){
      let conf = { headers: { "Authorization" : "Bearer " + this.key} };
      if(confirm('Apakah anda yakin ingin menghapus data ini?')){
        this.$bvToast.show("loadingToast");
        this.axios.delete("/stock/" + id, conf)
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
    this.getSupplier();
    this.getPelanggan();
  }
}
</script>