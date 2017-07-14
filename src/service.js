import axios from 'axios'

export const stockService = axios.create({baseURL: 'http://192.168.0.17:5000'})
