import {emojiMap} from "../config/emojiMap";

export interface Price {
  [key: string]: string;
}

export interface Profit {
  [key: string]: string;
}

export interface Spot {
  spot_id: string;
  price: string;
  profit: string;
  profit_netto: string;
  visible: string;
}

export interface IngredientResponse {
  structure_id: string;
  ingredient_id: string;
  pr_in_clear: string;
  pr_in_cook: string;
  pr_in_fry: string;
  pr_in_stew: string;
  pr_in_bake: string;
  structure_unit: string;
  structure_type: string;
  structure_brutto: number;
  structure_netto: number;
  structure_lock: string;
  structure_selfprice: string;
  structure_selfprice_netto: string;
  ingredient_name: string;
  ingredient_unit: string;
  ingredient_weight: string;
  ingredients_losses_clear: string;
  ingredients_losses_cook: string;
  ingredients_losses_fry: string;
  ingredients_losses_stew: string;
  ingredients_losses_bake: string;
};

export interface ProductResponse {
  barcode: string;
  category_name:  keyof typeof emojiMap;
  unit: string;
  cost: string;
  cost_netto: string;
  fiscal: string;
  hidden: string;
  menu_category_id: string;
  workshop: string;
  nodiscount: string;
  photo: string;
  photo_origin: string,
  price: Price,
  product_code: string;
  product_id: string;
  product_name: string;
  profit: Profit,
  sort_order:string;
  tax_id: string;
  product_tax_id: string;
  type: string;
  weight_flag: string;
  color: string;
  spots: Spot[],
  cooking_time: string;
  out: number
  ingredients: IngredientResponse[]
}
