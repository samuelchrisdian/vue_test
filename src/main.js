import Vue from 'vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import VueCurrencyFilter from 'vue-currency-filter'
import moment from 'moment'
//load CSS
import '../public/css/materialdesignicons.min.css'
import '../public/css/vendor.bundle.base.css'
import '../public/css/style.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

//load js
import '../public/js/vendor.bundle.base.js'
import '../public/js/polyfill.min.js'

Vue.use(BootstrapVue)
Vue.use(VueCookies)
Vue.use(VueAxios, axios)
Vue.use(VueFilterDateFormat);
Vue.use(VueCurrencyFilter,
  {
    symbol : 'Rp.',
    thousandsSeparator: '.',
    fractionCount: 0,
    fractionSeparator: ',',
    symbolPosition: 'front',
    symbolSpacing: true
  })
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:8000/api' 
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';

Vue.filter('formatDate', function(value) {
    if (value) {
      return moment(String(value)).locale('id').format('DD/MM/YYYY')
    }
})
axios.defaults.headers.common['Accept'] = 'application/json'
new Vue({
  
  router,
  store,
  methods: {
    isAuthenticate : function(){
      if(localStorage.getItem("Authorization")){
        let conf = { headers : {"Authorization" : "Bearer " + localStorage.getItem("Authorization")} };
        axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("Authorization")

        axios.get("/login/check", conf)
        .then(response => {
          if(response.data.success){
            this.$store.commit('userDetail', response.data.data)
          } else {
            this.$store.commit('logout')
            router.push('/login') 
          }
        })
        .catch(error => {
          this.$store.commit('logout')
        });
      } else {
        this.$store.commit('logout')
      }
    },
  },
  mounted(){
    this.isAuthenticate()
  },
  render: h => h(App)
}).$mount('#app')
