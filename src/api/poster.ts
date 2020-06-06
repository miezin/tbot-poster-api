import axios from 'axios';
import { POSTER_TOKEN } from '../config/secrets';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

const apiUrl = 'https://joinposter.com/api/';

class Poster {
    constructor(private token: string) {}

    async getCategories(): Promise<Category[]> {
        const params = {
            token: this.token
        }
        const repsonse = await axios.get(`${apiUrl}menu.getCategories`, { params });

        return repsonse.data.response;
    }

    async getProductsByCategoryId(id: string): Promise<Product[]> {
        const params = {
            token: this.token,
            category_id: id
        }

        const response = await axios.get(`${apiUrl}menu.getProducts`, { params });
        return response.data.response;

    }

    async getProductById(id: string): Promise<Product> {
        const params = {
            token: this.token,
            product_id: id
        }

        const response = await axios.get(`${apiUrl}menu.getProduct`, { params });
        return response.data.response;
    }
}

export const PosterService = new Poster(POSTER_TOKEN);
