import { emojiMap } from "../config/emojiMap";

export interface Category {
  category_id: string;
  category_name: keyof typeof emojiMap;
  category_photo: string;
  category_photo_origin: string;
  parent_category: string;
  category_color: string;
  category_hidden: string;
  sort_order: string;
  fiscal: string;
  nodiscount: string;
  tax_id: string;
  left: string;
  right: string;
  level: string;
  category_tag: null;
  visible: [];
}

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

export interface Product {
  barcode: string;
  category_name: string;
  unit: string;
  cost: string;
  cost_netto: string;
  fiscal: string;
  hidden: string;
  menu_category_id: string;
  workshop: string;
  nodiscount: string;
  photo: string;
  photo_origin: null,
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
  ingredient_id: string;
  cooking_time: string;
  out: number
}