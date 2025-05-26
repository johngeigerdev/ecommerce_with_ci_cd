import axios, { type AxiosResponse } from 'axios'; //axiosResponse creates the interface for the response for us so we don't have to create manually
import { type Product } from '../types/types';
import { type Category } from '../types/types';

const apiClient = axios.create({
    baseURL: 'https://fakestoreapi.com'
})

export const fetchProducts = (): Promise<AxiosResponse<Product[]>> => apiClient.get<Product[]>('/products')  //could do this just using fetch instead of axios
export const fetchCategories = (): Promise<AxiosResponse<Category[]>> => apiClient.get<Category[]>('/products/categories') //this will fetch the categories from the api
