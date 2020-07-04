import axios from 'axios';
import {POSTER_TOKEN} from '../config/secrets';
import product, {Ingredient, Product} from '../models/Product';
import {Category} from '../models/Category';
import {IngredientResponse, ProductResponse} from "../models/ProductResponse";
import {CategoryResponse} from "../models/CategoryResponse";
import { Order } from '../models/Order';

const apiUrl = 'https://joinposter.com/api/';

const convertIngredient = (ingredient: IngredientResponse): Ingredient => {
  return {
    ingredientId: ingredient.ingredient_id,
    ingredientUnit: ingredient.ingredient_unit,
    ingredientName: ingredient.ingredient_name,
  }
}

const convertCategory = (category: CategoryResponse): Category => {
  return {
    categoryId: category.category_id,
    categoryName: category.category_name,
    photo: category.category_photo,
    photoOrigin: category.category_photo_origin,
    parentCategory: category.parent_category,
    isHidden: !!Number(category.category_hidden)
  }
}

const convertProduct = (product: ProductResponse): Product => {;
  return {
    categoryName: product.category_name,
    isHidden: !!Number(product.hidden),
    categoryId: product.menu_category_id,
    photo: product.photo,
    photoOrigin: product.photo_origin,
    price: Math.round(Number(product.price['1']) / 100),
    productId: product.product_id,
    productName: product.product_name,
    out: product.out,
    ingredients: (product.ingredients || []).map(convertIngredient)
  }
}

class Poster {
  constructor(private token: string) {
  }

  async getCategories(): Promise<Category[]> {
    const params = {
      token: this.token
    }
    const response = await axios.get(`${apiUrl}menu.getCategories`, {params});

    return response.data.response.map(convertCategory);
  }

  async getProductsByCategoryId(id: string): Promise<Product[]> {
    const params = {
      token: this.token,
      category_id: id
    }
    const response = await axios.get(`${apiUrl}menu.getProducts`, {params});
    return response.data.response.map(convertProduct);
  }

  async getProductById(id: string): Promise<Product> {
    const params = {
      token: this.token,
      product_id: id
    }

    const response = await axios.get(`${apiUrl}menu.getProduct`, {params});
    const product = response.data.response;

    if (!product) {
      return null;
    }

    return convertProduct(product);
  }

  async createOrder({
    phone,
    firstName,
    comment,
    products
  }: Order ): Promise<any> { // TODO add incomingOrder response interface
    const params = {
      token: this.token
    }

    const payload = {
      spot_id: 1,
      phone: phone,
      first_name: firstName,
      comment: comment,
      products: products.map(({id, amount}) => {
        return {
          product_id: id,
          count: amount
        }
      })
    }

    const response = await axios.post(`${apiUrl}incomingOrders.createIncomingOrder`, payload, {params});

    return response.data.response;
  }
}

export const PosterService = new Poster(POSTER_TOKEN);

