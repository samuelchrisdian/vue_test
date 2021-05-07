<template>
    <div class="horizontal-menu">
        <nav class="navbar top-navbar col-lg-12 col-12 p-0">
        <div class="nav-top flex-grow-1">
            <div class="container d-flex flex-row h-100 align-items-center">
            <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                <a class="navbar-brand brand-logo" href="/"><img src="../../../public/img/logo.png"></a>
                <a class="navbar-brand brand-logo-mini" href="/"><img src="../../../public/img/logo.png"></a> 
            </div>
            <div class="navbar-menu-wrapper d-flex align-items-center justify-content-end flex-grow-1">
                <ul class="navbar-nav navbar-nav-right">
                <li class="nav-item nav-profile dropdown">
                    <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown">
                    Menu
                    </a>
                    <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                    <span @click="karyawan" class="dropdown-item">
                        <i class="mdi mdi-account-outline text-primary"></i>
                        Karyawan
                    </span>
                    <span @click="pelanggan" class="dropdown-item">
                        <i class="mdi mdi-account-multiple-outline text-primary"></i>
                        Pelanggan
                    </span>
                    <span @click="supplier" class="dropdown-item">
                        <i class="mdi mdi-bookmark-outline text-primary"></i>
                        Supplier
                    </span>
                    <span @click="stock" class="dropdown-item">
                        <i class="mdi mdi-cube-outline text-primary"></i>
                        Stock
                    </span>
                    <span @click="history" class="dropdown-item">
                        <i class="mdi mdi-cube-send text-primary"></i>
                        History
                    </span>
                    <span @click="logout" class="dropdown-item">
                        <i class="mdi mdi-logout text-primary"></i>
                        Logout
                    </span>
                    </div>
                </li>
                </ul>
                <button class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="horizontal-menu-toggle">
                <span class="mdi mdi-menu"></span>
                </button>
            </div>
            </div>
        </div>
        </nav>
        <nav class="bottom-navbar">
        <div class="container">
            <ul class="nav page-navigation">
                <li class="nav-item">
                    <router-link to="/" class="nav-link">
                        <i class="mdi mdi-view-dashboard-outline menu-icon"></i>
                        <span class="menu-title">Beranda</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/karyawan" class="nav-link">
                        <i class="mdi mdi-account-outline menu-icon"></i>
                        <span class="menu-title">Karyawan</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/pelanggan" class="nav-link">
                        <i class="mdi mdi-account-multiple-outline menu-icon"></i>
                        <span class="menu-title">Pelanggan</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/supplier" class="nav-link">
                        <i class="mdi mdi-bookmark-outline menu-icon"></i>
                        <span class="menu-title">Supplier</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/stock" class="nav-link">
                        <i class="mdi mdi-cube-outline menu-icon"></i>
                        <span class="menu-title">Stock</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/history" class="nav-link">
                        <i class="mdi mdi-cube-send menu-icon"></i>
                        <span class="menu-title">History</span>
                    </router-link>
                </li>
            </ul>
        </div>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'navbar',
    computed : {
        isLoggedIn : function(){ return this.$store.getters.isLoggedIn},
        nama : function(){ return this.$store.getters.userDetail},
        level : function(){ return this.$store.getters.userDetail.level}
    },
    methods:{
      getData:function(){
        let conf = { headers : {"Authorization" : "Bearer " + localStorage.getItem("Authorization")} }; 
        this.level = localStorage.getItem("UserLevel");
        console.log(this.level);
      },
      logout:function(){
          let conf = { headers : {"Authorization" : "Bearer " + localStorage.getItem("Authorization")} };
          this.axios.post('/logout', conf).then(response => {
            if (response.data.success === false || response.data.status === 0) {
                this.$store.commit('logout')
                localStorage.removeItem("Authorization")
                this.$router.push({name: 'login'})
            }
          }).catch(error => {

        });
      },
      karyawan:function() {
          this.$router.push({name: 'karyawan'})
      },
      pelanggan:function() {
          this.$router.push({name: 'pelanggan'})
      },
      supplier:function() {
          this.$router.push({name: 'supplier'})
      },
      stock:function() {
          this.$router.push({name: 'stock'})
      },
      history:function() {
          this.$router.push({name: 'history'})
      },
  },
}
</script>
<style>
.nav-item .router-link-exact-active .menu-title, .nav-item .router-link-exact-active i:before{
  color: #5f6be3;
}
</style>