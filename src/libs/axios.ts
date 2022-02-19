import Vue from 'vue'
import { MAIN_API_URL } from '@/config/main.ts';

// axios
import axios from 'axios'


const instance = axios.create({
  // timeout: 1000,
  baseURL: MAIN_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-type': 'application/json',
  },
  responseType: 'json',
})

Vue.prototype.$http = instance

export default instance
