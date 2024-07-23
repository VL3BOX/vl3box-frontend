import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let store = {
    state: {
        type : 'all',
        q : '',
    },
    mutations: {
        changeQuery : function (state,payload){
            state.q = payload
        },
        changeType : function (state,payload){
            state.type = payload
        },
    },
    getters: {
    },
    actions: {},
    modules: {}
};

export default new Vuex.Store(store);
