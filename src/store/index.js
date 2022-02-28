import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectDataArray: [],
  },
  getters: {
    getPreviousState: s => {
      if (s.selectDataArray && s.selectDataArray.length > 0) {
        return s.selectDataArray[s.selectDataArray.length - 1];
      }
    },
    getSelectDataLength: s => s.selectDataArray.length,
  },
  mutations: {
    setDataState(state, dataState) {
      if (state.selectDataArray.length === 10) {
        state.selectDataArray.shift();
      }
      state.selectDataArray.push(dataState);
    },
    setNewDataState(state, data) {
      if (state.selectDataArray.length) {
        state.selectDataArray = data
      }
    },
  },
  actions: {
    updateDataState(context, dataState) {
      context.commit('setDataState', dataState);
    },
    popPrevDataState(context) {
      // console.log(context.state.selectDataArray)
      if (context.state.selectDataArray.length !== 0){
        let stateData = context.state.selectDataArray
        stateData.pop()
        console.log(stateData)
        context.commit('setNewDataState', stateData);
      }
    },
  },
  modules: {},
});
