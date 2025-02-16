import axios from 'axios';
import { POSTER_TOKEN } from '../config/secrets';
import { Ingredient, ProductInterface } from '../models/Product';
import { CategoryInterface } from '../models/Category';
import { IngredientResponse, ProductResponse, Spot } from '../models/ProductResponse';
import { CategoryResponse } from '../models/CategoryResponse';
import { OrderInterface } from '../models/Order';

const apiUrl = 'https://joinposter.com/api/';

const convertIngredient = (ingredient: IngredientResponse): Ingredient => {
  return {
    ingredientId: ingredient.ingredient_id,
    ingredientUnit: ingredient.ingredient_unit,
    ingredientName: ingredient.ingredient_name
  };
};

const convertCategory = (category: CategoryResponse): CategoryInterface => {
  return {
    categoryId: category.category_id,
    categoryName: category.category_name,
    photo: category.category_photo,
    photoOrigin: category.category_photo_origin,
    parentCategory: category.parent_category,
    isHidden: !!Number(category.category_hidden)
  };
};

const excludeHiddenProducts = (products: ProductResponse[], spotId: string): ProductResponse[] => {
  return products.filter((product: ProductResponse) => {
    const spot = product.spots.find((spotItem: Spot) => {
      return spotItem.spot_id === spotId;
    });

    if (spot && Number(spot.visible)) {
      return product;
    }
  });
};

const convertProduct = (product: ProductResponse): ProductInterface => {
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
  };
};

class Poster {
  constructor(private token: string) {
  }

  async getCategories(): Promise<CategoryInterface[]> {
    const params = {
      token: this.token
    };
    const response = await axios.get(`${apiUrl}menu.getCategories`, { params });

    return response.data.response.map(convertCategory);
  }

  async getProductsByCategoryId(id: string): Promise<ProductInterface[]> {
    const params = {
      token: this.token,
      category_id: id
    };
    const response = await axios.get(`${apiUrl}menu.getProducts`, { params });
    const filteredProducts = excludeHiddenProducts(response.data.response, '1');

    return filteredProducts.map(convertProduct);
  }

  async getProductById(id: string): Promise<ProductInterface> {
    const params = {
      token: this.token,
      product_id: id
    };

    const response = await axios.get(`${apiUrl}menu.getProduct`, { params });
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
  }: OrderInterface): Promise<any> { // TODO add incomingOrder response interface
    const params = {
      token: this.token
    };

    const payload = {
      spot_id: 1,
      phone,
      first_name: firstName,
      comment,
      products: products.map(({ id, amount }) => {
        return {
          product_id: id,
          count: amount
        };
      })
    };

    // const response = await axios.post(`${apiUrl}incomingOrders.createIncomingOrder`, payload, { params });

    // return response.data.response;
    return { incoming_order_id: 1 };
  }
}

export const PosterService = new Poster(POSTER_TOKEN);

