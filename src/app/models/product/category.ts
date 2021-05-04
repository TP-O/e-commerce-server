import { model } from '@modules/helper';
import { Product } from '@app/models/product/product';

const Category = model({
  table: 'product_categories',
  // prettier-ignore
  columns: [
    'id',
    'name',
    'left',
    'right',
    'level',
    'createdAt',
    'updatedAt',
  ],
  // prettier-ignore
  fillable: [
    'name',
    'left',
    'right',
    'level',
  ],
});

Category.hasMany({
  name: 'products',
  foreignKey: 'categoryId',
  relatedModel: Product,
});

export { Category };
