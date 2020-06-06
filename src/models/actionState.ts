import { Product } from "./poster";

export interface ActionState {
  catId?: string,
  prId?: string,
  products?: Product[],
  cart?: string;
  reference?: string;
  categoryName?: string;
}
