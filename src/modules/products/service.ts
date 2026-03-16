import { ProductRepository } from "./repository";
import { CreateProductInput, UpdateProductInput } from "./validation";

export class ProductService {
  static async createProduct(data: CreateProductInput) {
    const product = await ProductRepository.create(data);
    return JSON.parse(JSON.stringify(product));
  }

  static async getProducts(filters?: { categoryId?: string; isActive?: boolean; limit?: number; ids?: string[] }) {
    const products = await ProductRepository.findMany(filters);
    return JSON.parse(JSON.stringify(products));
  }

  static async getProductById(id: string) {
    const product = await ProductRepository.findById(id);
    
    if (!product) {
      throw new Error("Product not found");
    }
    
    return JSON.parse(JSON.stringify(product));
  }

  static async updateProduct(id: string, data: UpdateProductInput) {
    const product = await ProductRepository.update(id, data);
    return JSON.parse(JSON.stringify(product));
  }

  static async deleteProduct(id: string) {
    return ProductRepository.delete(id);
  }
}
