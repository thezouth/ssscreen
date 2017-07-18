import axios from 'axios'

export const stockService = axios.create({baseURL: 'http://localhost:5000'})
