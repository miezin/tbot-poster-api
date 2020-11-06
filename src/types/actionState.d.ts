import { ProductInterface } from '../models/Product';


export interface ActionState {
  catId?: string,
  prId?: string,
  products?: ProductInterface[],
  cart?: string;
  reference?: string;
  categoryName?: string;
}
