
const storage = localStorage.getItem('keepLogin')

export const MAIN_API_URL = `${process.env.VUE_APP_API_URL}/`;

export const myStorage = storage ? localStorage : sessionStorage;
