import { Product } from "../models/Product";


export interface ActionState {
  catId?: string,
  prId?: string,
  products?: Product[],
  cart?: string;
  reference?: string;
  categoryName?: string;
}
