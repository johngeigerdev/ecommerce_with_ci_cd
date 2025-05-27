import axios from 'axios'; //axiosResponse creates the interface for the response for us so we don't have to create manually
import { type Product } from '../types/types';
import { type Category } from '../types/types';

const api = axios.create({
    baseURL: 'https://fakestoreapi.com'
})

//fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
    const res = await api.get<Product[]>('/products');
    return res.data;
};

//fetch products by category
export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
    const res = await api.get<Product[]>(`/products/category/${category}`);
    return res.data;
};

//fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
    const res = await api.get<Category[]>('/products/categories');
    return res.data;
};