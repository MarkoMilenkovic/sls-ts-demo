import { DataMapper } from "@aws/dynamodb-data-mapper";
import gen2array from "../libs/array-helper";
import { Category } from "../models/category";

class CategoryService {
    constructor(
        private readonly mapper: DataMapper
    ) { }

    async createCategories(categories: Category[]): Promise<Category[]> {
        const categoriesToSave = categories.map(category => {
            const c = new Category();
            c.name = category.name;
            c.description = category.description;
            return c;
        });
        
        return await gen2array(this.mapper.batchPut(categoriesToSave));
    }

    async getCategories(): Promise<Category[]> {
        return await gen2array(this.mapper.scan(Category));
    }

    async getCategoriesByNames(categories: string[]): Promise<Category[]> {
        const categoriesToGet = categories.map(category => {
            const c = new Category();
            c.name = category;
            return c;
        });
        return await gen2array(this.mapper.batchGet(categoriesToGet));
    }

}

export default CategoryService;
