<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title float-left"><b>Data History</b></p>
              <p class="card-description float-right">
                <button v-if="history.length" class="btn btn-info" v-b-modal.modalReport><i class="mdi mdi-file-chart btn-icon-prepend"></i> Report</button>

              </p>
              <div class="table-responsive">
                <span v-if="!history.length">
                    <div class="col" style="text-align: center">
                      <img src="../../public/img/logo.png" width="150px" style="margin-bottom: 10px" alt="logo empty table">
                      <br>
                      <p><b>Yahh belum ada data riwayat nih..</b></p>
                    </div>
                </span>
                <span v-else>
                  <div class="row">
                    <div class="col">
                      <b>Tipe :</b>
                      <b-form-select name="sortBy" id="sortBy" v-model="sortBy" @change="sortHistory">
                          <option value="" disabled selected>Pilih Tipe</option>
                          <option value="stock_in">Stock Masuk</option>
                          <option value="stock_out">Stock Keluar</option>
                      </b-form-select>
                    </div>
                    <div class="col">
                      <div v-if="this.sortBy == 'stock_in'">
                        <b>Cari Supplier</b>
                        <b-form-select id="supplier" v-model="id_supplier" @change="sortHistory">
                            <option value="" disabled selected>Pilih Suplier</option>
                            <option :value="supplier.id_supplier" v-for="supplier in supplier" :key="supplier.id_supplier">{{supplier.nama}}</option>
                        </b-form-select>
                      </div>
                      <div v-else>
                        <b>Cari Pelanggan</b>
                        <b-form-select id="pelanggan" v-model="id_pelanggan" @change="sortHistory">
                            <option value="" disabled selected>Pilih Pelanggan</option>
                            <option :value="pelanggan.id_pelanggan" v-for="pelanggan in pelanggan" :key="pelanggan.id_pelanggan">{{pelanggan.nama}}</option>
                        </b-form-select>
                      </div>
                    </div>
                    <div class="col">
                      <b>Cari Tanggal :</b>
                      <b-form-input type="date" @change="sortHistory" v-model="sortByDate"
                      placeholder="Cari berdasarkan tanggal"
                      ></b-form-input>
                    </div>
                  </div>
                  <br>
                  <b-table v-if="sortBy == 'stock_in' && stockIn" striped hover :items="history" :fields="fields" style="text-align:center">
                    <template v-slot:cell(no)="data">
                      {{ data.index+1 }}
                    </template>
                    <template v-slot:cell(nama_supplier)="data">
                      {{ data.item.supplier.nama }}
                    </template>
                    <template v-slot:cell(type)>
                      <b-badge variant="success">Stock Masuk</b-badge>
                    </template>
                    <template v-slot:cell(tgl_input)="data">
                      {{ data.item.created_at | formatDate }}
                    </template>
                    <template v-slot:cell(satuan)="data">
                      <b-badge variant="warning">{{data.item.unit}}</b-badge>
                    </template>
                    <template v-slot:cell(harga)="data">
                      {{ data.item.harga | currency }}
                    </template>
                    <template v-slot:cell(note)="data">
                      <span v-if="data.item.note">
                        {{data.item.note}}
                      </span>
                      <span v-else>
                        -
                      </span>
                    </template>
                    <template v-slot:cell(aksi)="data">
                      <b-button size="sm" variant="success" v-on:click="generateReportById(data.item.id_history)"><i class="mdi mdi-note btn-icon-prepend"></i> Report</b-button>&nbsp;
                    </template>
                  </b-table>

                  <b-table v-if="sortBy == 'stock_out' && !stockIn" striped hover :items="history" :fields="fieldsStockOut" style="text-align:center">
                    <template v-slot:cell(no)="data">
                      {{ data.index+1 }}
                    </template>
                    <template v-slot:cell(nama_pelanggan)="data">
                      {{ data.item.pelanggan.nama }}
                    </template>
                    <template v-slot:cell(type)>
                      <b-badge variant="danger">Stock Keluar</b-badge>
                    </template>
                    <template v-slot:cell(tgl_input)="data">
                      {{ data.item.created_at | formatDate }}
                    </template>
                    <template v-slot:cell(satuan)="data">
                      <b-badge variant="warning">{{data.item.unit}}</b-badge>
                    </template>
                    <template v-slot:cell(harga)="data">
                      {{ data.item.harga | currency }}
                    </template>
                    <template v-slot:cell(note)="data">
                      <span v-if="data.item.note">
                        {{data.item.note}}
                      </span>
                      <span v-else>
                        -
                      </span>
                    </template>
                    <template v-slot:cell(aksi)="data">
                      <b-button size="sm" variant="success" v-on:click="generateReportById(data.item.id_history)"><i class="mdi mdi-note btn-icon-prepend"></i> Report</b-button>&nbsp;
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
              <vue-html2pdf
                  :show-layout="false"
                  :float-layout="true"
                  :enable-download="false"
                  :preview-modal="true"
                  :paginate-elements-by-height="2000"
                    filename="ReportHistory"
                  :pdf-quality="2"
                  :manual-pagination="false"
                    pdf-format="letter"
                    pdf-orientation="landscape"
                    pdf-content-width="1050px"
 
                    @hasStartedGeneration="hasStartedGeneration()"
                    @hasGenerated="hasGenerated($event)"
                    ref="html2pdfAll" >
                <section slot="pdf-content">
                  <div v-if="report.length">
                    <div id="header">INVOICE</div>
                    <span v-if="sortBy == 'stock_in'">
                    <div id="identity">                    
                      <div id="address">
                        {{reportSupplierAll.nama}}<br>
                        {{reportSupplierAll.alamat}}<br>
                        {{reportSupplierAll.telp}}
                      </div>
                      <div id="logo">
                        <img id="image" width="80px" src="../../public/img/logo.png" alt="logo" />
                      </div>                    
                    </div>
		                <div style="clear:both"></div>		
                    <div id="customer">
                      <div id="customer-title">
                        Rumah Tani<br>
                        Ds Tempurejo RT. 06 RW. 01<br>
                        Purwodadi Gambiran
                      </div>
                      <table id="meta">
                        <tr>
                          <td class="meta-head">Invoice #</td>
                          <td><div>{{reportSupplierAll.id_supplier}}/{{bulan}}/{{tahun}}/RumahTani</div></td>
                        </tr>
                        <tr>
                          <td class="meta-head">Date</td>
                           <td><div id="date">{{hari}}</div></td>
                        </tr>
                      </table>
                    </div>		
                    </span>
                    <span v-else>
                      <div id="identity">                    
                      <div id="address">
                        {{reportPelangganAll.nama}}<br>
                        {{reportPelangganAll.alamat}}<br>
                        {{reportPelangganAll.nik}}<br>
                        {{reportPelangganAll.no_rekening}}
                      </div>
                      <div id="logo">
                        <img id="image" width="80px" src="../../public/img/logo.png" alt="logo" />
                      </div>                    
                    </div>
		                <div style="clear:both"></div>		
                    <div id="customer">
                      <div id="customer-title">
                        Rumah Tani<br>
                        Ds Tempurejo RT. 06 RW. 01<br>
                        Purwodadi Gambiran
                      </div>
                      <table id="meta">
                        <tr>
                          <td class="meta-head">Invoice #</td>
                          <td><div>{{reportPelangganAll.id_pelanggan}}/{{bulan}}/{{tahun}}/RumahTani</div></td>
                        </tr>
                        <tr>
                          <td class="meta-head">Date</td>
                           <td><div id="date">{{hari}}</div></td>
                        </tr>
                      </table>
                    </div>		
                    </span>
                    <table id="items">
                      <tr>
                        <th class="text-center">ID</th>
                        <th class="text-center">TANGGAL</th>
                        <th class="text-center">DESCRIPTION</th>
                        <th class="text-center">STOCK</th>
                        <th class="text-center">HARGA</th>
                        <th class="text-center">TOTAL</th>
                      </tr>                      
                      <tr v-for="(report) in report" :key="report.id_history" >
                        <td class="no text-center">{{report.id_history}}</td>
                        <td class="qty text-center">{{report.created_at | formatDate}}</td>
                        <td class="qty text-center">{{report.description}}</td>
                        <td class="qty text-center">{{report.stock}}</td>
                        <td class="qty text-center">{{report.harga | currency}}</td>
                        <td class="total text-center">
                          <span v-if="report.type === 'stock_out'">{{report.total | currency}}
                          </span>
                          <span v-else>
                            -
                          </span>
                        </td>  
                      </tr>
                      <tr id="hiderow"></tr>       
                    </table>
                    <br>
                    <div class="notices" style="float: right; font-weight: bold;"> 
                      <div>HORMAT KAMI :</div>
                      <div class="notice"></div>
                    </div>
                    <br>
                    <br>
                    <br>
                    <br>
                    <div class="" style="float: right; font-weight: bold;"> 
                      <a>_____________________</a>
                    </div>  
                  </div>
                </section>
              </vue-html2pdf>
              <vue-html2pdf
                  :show-layout="false"
                  :float-layout="true"
                  :enable-download="false"
                  :preview-modal="true"
                  :paginate-elements-by-height="2000"
                    filename="ReportHistory"
                  :pdf-quality="2"
                  :manual-pagination="false"
                    pdf-format="letter"
                    pdf-orientation="landscape"
                    pdf-content-width="1050px"
 
                    @hasStartedGeneration="hasStartedGeneration()"
                    @hasGenerated="hasGenerated($event)"
                    ref="html2Pdf" >
                <section slot="pdf-content">
                  <div v-if="reportById.length">
                    <div id="header">INVOICE</div>
                    <span v-if="sortBy == 'stock_in'">
                    <div id="identity">                    
                      <div id="address">
                        {{reportSupplier.nama}}<br>
                        {{reportSupplier.alamat}}<br>
                        {{reportSupplier.telp}}
                      </div>
                      <div id="logo">
                        <img id="image" width="80px" src="../../public/img/logo.png" alt="logo" />
                      </div>                    
                    </div>
		                <div style="clear:both"></div>		
                    <div id="customer">
                      <div id="customer-title">
                        Rumah Tani<br>
                        Ds Tempurejo RT. 06 RW. 01<br>
                        Purwodadi Gambiran
                      </div>
                      <table id="meta">
                        <tr>
                          <td class="meta-head">Invoice #</td>
                          <td><div>{{reportSupplier.id_supplier}}/{{bulan}}/{{tahun}}/RumahTani</div></td>
                        </tr>
                        <tr>
                          <td class="meta-head">Date</td>
                           <td><div id="date">{{hari}}</div></td>
                        </tr>
                      </table>
                    </div>		
                    </span>
                    <span v-else>
                      <div id="identity">                    
                      <div id="address">
                        {{reportPelanggan.nama}}<br>
                        {{reportPelanggan.alamat}}<br>
                        {{reportPelanggan.nik}}<br>
                        {{reportPelanggan.no_rekening}}
                      </div>
                      <div id="logo">
                        <img id="image" width="80px" src="../../public/img/logo.png" alt="logo" />
                      </div>                    
                    </div>
		                <div style="clear:both"></div>		
                    <div id="customer">
                      <div id="customer-title">
                        Rumah Tani<br>
                        Ds Tempurejo RT. 06 RW. 01<br>
                        Purwodadi Gambiran
                      </div>
                      <table id="meta">
                        <tr>
                          <td class="meta-head">Invoice #</td>
                          <td><div>{{reportPelanggan.id_pelanggan}}/{{bulan}}/{{tahun}}/RumahTani</div></td>
                        </tr>
                        <tr>
                          <td class="meta-head">Date</td>
                           <td><div id="date">{{hari}}</div></td>
                        </tr>
                      </table>
                    </div>		
                    </span>
                    <table id="items">
                      <tr>
                        <th class="text-center">ID</th>
                        <th class="text-center">TANGGAL</th>
                        <th class="text-center">DESCRIPTION</th>
                        <th class="text-center">STOCK</th>
                        <th class="text-center">HARGA</th>
                        <th class="text-center">TOTAL</th>
                      </tr>                      
                      <tr v-for="(reportById) in reportById" :key="reportById.id_history" >
                        <td class="no text-center">{{reportById.id_history}}</td>
                        <td class="qty text-center">{{reportById.created_at | formatDate}}</td>
                        <td class="qty text-center">{{reportById.description}}</td>
                        <td class="qty text-center">{{reportById.stock}}</td>
                        <td class="qty text-center">{{reportById.harga | currency}}</td>
                        <td class="total text-center">
                          <span v-if="reportById.type === 'stock_out'">{{reportById.total | currency}}
                          </span>
                          <span v-else>
                            -
                          </span>
                        </td>  
                      </tr>
                      <tr id="hiderow"></tr>       
                    </table>
                    <br>
                    <div class="notices" style="float: right; font-weight: bold;"> 
                      <div>HORMAT KAMI :</div>
                      <div class="notice"></div>
                    </div>
                    <br>
                    <br>
                    <br>
                    <br>
                    <div class="" style="float: right; font-weight: bold;"> 
                      <a>_____________________</a>
                    </div>  
                  </div>
                </section>
              </vue-html2pdf>

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
                  id="modalReport"
                  @ok="generateReport"
                >
                  <template v-slot:modal-title>
                    Form Report
                  </template>

                    <form>
                          <span v-if="sortBy == 'stock_in'">  
                          <div class="form-group">
                            <label for="id_supplier" class="col-form-label">Pilih Supplier</label>
                            <div v-if="!supplier.length">
                              <input type="text" class="form-control" name="id_supplier" id="id_supplier" placeholder="Supplier belum tersedia" disabled>
                            </div> 
                            <div v-else >
                              <select class="form-control" name="id_supplier" id="id_supplier" v-model="id_supplier" >
                                <option value="" disabled selected>Pilih Supplier</option>
                                <option :value="supplier.id_supplier" v-for="supplier in supplier" :key="supplier.id_supplier">{{supplier.nama}}</option>
                              </select>
                            </div>
                          </div>
                          </span>
                          
                          <span v-else>  
                            <div class="form-group">
                              <label for="id_pelanggan" class="col-form-label">Pilih Pelanggan</label>
                              <div v-if="!pelanggan.length">
                                <input type="text" class="form-control" name="id_pelanggan" id="id_pelanggan" placeholder="Pelanggan belum tersedia" disabled>
                              </div> 
                              <div v-else >
                                <select class="form-control" name="id_pelanggan" id="id_pelanggan" v-model="id_pelanggan" >
                                  <option value="" disabled selected>Pilih Pelanggan</option>
                                  <option :value="pelanggan.id_pelanggan" v-for="pelanggan in pelanggan" :key="pelanggan.id_pelanggan">{{pelanggan.nik}} - {{pelanggan.nama}}</option>
                                </select>
                              </div>
                            </div>
                          </span>
                          <div class="form-group">
                            <label for="startFrom" class="col-form-label">Transaksi dari :</label>
                            <input type="date" name="startFrom" class="form-control" id="startFrom" placeholder="Start From" v-model="startFrom">
                          </div>
                          <div class="form-group">
                            <label for="until" class="col-form-label">Sampai :</label>
                            <input type="date" name="until" class="form-control" id="until" placeholder="Until" v-model="until">
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
import VueHtml2pdf from 'vue-html2pdf'
import moment from 'moment'

export default {
  components: {
        VueHtml2pdf
  },
  data : function(){
    return {
      stockIn: true,
      sortBy: "",
      sortByDate: "",
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
      type: "",
      note: "",
      reportSupplier: "",
      reportSupplierAll: "",
      reportPelanggan: "",
      reportPelangganAll: "",
      hari: "",
      bulan: "",
      tahun: "",
      grandTotal: 0,
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      history: [],
      supplier: [],
      pelanggan: [],
      report: [],
      reportById: [],
      fields: ["no", "id_history", "type", "nama_supplier", "tgl_input", "description", "stock", "harga", "note", "Aksi"],
      fieldsStockOut: ["no", "id_history", "type", "nama_pelanggan", "tgl_input", "description", "stock", "harga", "note", "Aksi"],
    }
  },

  methods: {
    getHistoryByType : function(){
      let offset = (this.currentPage - 1) * this.perPage;
      let conf = { headers : {"Authorization" : "Bearer " + localStorage.getItem("Authorization")} };
      this.$bvToast.show("loadingToast");
      this.sortBy = 'stock_in'
      this.axios.get("history/"+this.sortBy, conf)
      .then(response => {
        if(response.data.success){
          this.$bvToast.hide("loadingToast") 
          this.history = response.data.data.history
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data history."
          this.$bvToast.show("message");
          // this.$router.push({name: "login"})
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    getSupplier() {
      let conf = { headers : {"Authorization" : "Bearer " + localStorage.getItem("Authorization")} };
      this.axios.get('supplier', conf).then(response => {
        this.supplier = response.data.data.supplier
      }).catch(error => {
        console.log(error);
      })
    },
    getPelanggan() {
      let conf = { headers : {"Authorization" : "Bearer " + localStorage.getItem("Authorization")} };
      this.axios.get('pelanggan', conf).then(response => {
        this.pelanggan = response.data.data.pelanggan
      }).catch(error => {
        console.log(error);
      })
    },
    sortHistory: function() {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.$bvToast.show("loadingToast");
        let form = {
          sortBy: this.sortBy,
          id_supplier: this.id_supplier,
          id_pelanggan: this.id_pelanggan,
          sortByDate: this.sortByDate,
        }
      this.axios.post("/sortHistory/", form, conf)
        .then(response => {
          if (response.data.success) {
            this.$bvToast.hide("loadingToast");
            this.history = response.data.data.history;
            this.sortBy == 'stock_in' ? this.stockIn = true : this.stockIn = false
          } else {
            this.$bvToast.hide("loadingToast");
            this.message = "Gagal menampilkan data history."
            this.$bvToast.show("message");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    pagination : function(){
      if(this.sortBy == ""){
        this.getHistoryByType();
      } else {
        this.sortBy();
      }
    },
    Drop : function(id){
      let conf = { headers: { "Authorization" : "Bearer " + this.key} };
      if(confirm('Apakah anda yakin ingin menghapus data ini?')){
        this.$bvToast.show("loadingToast");
        this.axios.delete("/stock/" + id, conf)
        .then(response => {
            this.getHistoryByType();
            this.$bvToast.hide("loadingToast");
            this.message = response.data.message;
            this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
    generateReport() {
      this.$bvToast.show("loadingToast");
      let conf = { headers : {"Authorization" : "Bearer " + localStorage.getItem("Authorization")} };
      let form = {
        sortBy: this.sortBy,
        id_pelanggan: this.id_pelanggan,
        id_supplier: this.id_supplier,
        sortByDate: this.sortByDate,
        startFrom: this.startFrom,
        until: this.until,
      }
      this.axios.post('report', form, conf).then(response => {
        this.report = response.data.report
        this.reportSupplierAll = response.data.report[0].supplier
        this.reportPelangganAll = response.data.report[0].pelanggan
        this.hari = moment().format('DD MMM YYYY')
        this.bulan = moment().format('MM')
        this.tahun = moment().format('y')
        for (let i = 0; i < this.report.length; i++) {
          this.grandTotal += this.report[i].total
        }
        this.$bvToast.hide("loadingToast");
        if (this.report.length > 0) {
          this.$refs.html2pdfAll.generatePdf()
        } else {
          this.message = 'Data tidak ditemukan';
          this.$bvToast.show("message");
        }
      }).catch(error => {
        console.log(error.response)
        this.message = 'Terdapat Kesalahan';
        this.$bvToast.show("message");
      })
    },
    generateReportById (id) {
       let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
       this.$bvToast.show("loadingToast");
       this.axios.get("/getHistoryById/" + id, conf)
       .then(response => {
          if(response.data.success){
            this.reportById = response.data.data.history;
            this.reportSupplier = response.data.data.history[0].supplier;
            this.reportPelanggan = response.data.data.history[0].pelanggan;
            this.hari = moment().format('DD MMM YYYY')
            this.bulan = moment().format('MM')
            this.tahun = moment().format('y')
            this.$refs.html2Pdf.generatePdf()
            this.$bvToast.hide("loadingToast");
          } else {
            this.message = "Gagal generate report history."
            this.$bvToast.show("message");
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
  },
  mounted(){
    this.key = localStorage.getItem("Authorization");
    this.getHistoryByType();
    this.getSupplier();
    this.getPelanggan();
  }
}
</script>

<style scoped>
/*
	 CSS-Tricks Example
	 by Chris Coyier
	 http://css-tricks.com
*/

* { margin: 0; padding: 0; }
body { font: 14px/1.4 Georgia, serif; }
#page-wrap { width: 800px; margin: 0 auto; }

textarea { border: 0; font: 14px Georgia, Serif; overflow: hidden; resize: none; }
table { border-collapse: collapse; }
table td, table th { border: 1px solid black; padding: 5px; }

#header { height: 5px; width: 100%; margin: 5px 0; background: #fff; text-align: center; color: black; font: bold 15px Helvetica, Sans-Serif; text-decoration: uppercase; letter-spacing: 20px; padding: 8px 0px; }

#address { width: 250px; height: 100px; float: left; font-weight: bold;}
#customer { overflow: hidden; }

#logo { text-align: right; float: right; position: relative; border: 1px solid #fff; max-width: 540px; max-height: 100px; overflow: hidden; }
#customer-title { font-size: 15px; font-weight: bold; float: left; }

#meta { margin-top: 1px; width: 300px; float: right; }
#meta td { text-align: right;  font-weight: bold}
#meta td.meta-head { text-align: left; background: #fff; }
#meta td textarea { width: 100%; height: 20px; text-align: right; }

#items { clear: both; width: 100%; margin: 5px 0 0 0; border: 1px solid black; font-weight: bold; }
#items th { background: #fff; }
#items textarea { width: 80px; height: 50px; }
#items tr.item-row td { border: 0; vertical-align: top; }
#items td.description { width: 300px; }
#items td.item-name { width: 175px; }
#items td.description textarea, #items td.item-name textarea { width: 100%; }
#items td.total-line { border-right: 0; text-align: right; }
#items td.total-value { border-left: 0; padding: 10px; }
#items td.total-value textarea { height: 20px; background: none; }
#items td.balance { background: #fff; }
#items td.blank { border: 0; }

#terms { text-align: center; margin: 20px 0 0 0; }
#terms h5 { text-transform: uppercase; font: 13px Helvetica, Sans-Serif; letter-spacing: 10px; border-bottom: 1px solid black; padding: 0 0 8px 0; margin: 0 0 8px 0; }
#terms textarea { width: 100%; text-align: center;}

textarea:hover, textarea:focus, #items td.total-value textarea:hover, #items td.total-value textarea:focus, .delete:hover { background-color:#EEFF88; }

.delete-wpr { position: relative; }
.delete { display: block; color: #000; text-decoration: none; position: absolute; background: #EEEEEE; font-weight: bold; padding: 0px 3px; border: 1px solid; top: -6px; left: -22px; font-family: Verdana; font-size: 12px; }
</style>
