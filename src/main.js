// The Vue build version to load with the `import` command
import Vue from 'vue'
import App from './App'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import './assets/css/iview.css';
import store from './vuex'
import VueQuillEditor from "vue-quill-editor";
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import router from './router'
Vue.use(VueQuillEditor)
Vue.use(iView)
Vue.config.productionTip = false
var EventBus = new Vue();
//事件$bus
Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function () {
            return EventBus
        }
    }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
