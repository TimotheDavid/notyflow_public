import {defineStore} from "pinia";


export const getUserStore = defineStore('user', {

    state: () => ({
        userId: '',
        code: '',
        status: 'INIT'
    }),

    getters: {
        getUser: (state) => state
    }
})