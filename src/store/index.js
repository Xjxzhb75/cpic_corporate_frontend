import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import MenuStore from './MenuStore'
const store = new Vuex.Store({
    modules: {
        MenuStore
    }
    
})

export default store