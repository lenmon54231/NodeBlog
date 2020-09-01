import Vue from 'vue'
import Vuex from 'vuex'
<<<<<<< HEAD
=======
import { mapState } from 'vuex'
>>>>>>> 39a14467ea9c416559e284c28b2181acfb29080f

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeIndex: '1',//导航选中
    isSignIn: 0,//0未登录，1admin，2游客
  },
  mutations: {
    changeIndex(state, n) {
<<<<<<< HEAD
=======
      state.activeIndex = n
>>>>>>> 39a14467ea9c416559e284c28b2181acfb29080f
    },
    changeIsSignIn(state, n) {
      state.isSignIn = n
    }
  }
})