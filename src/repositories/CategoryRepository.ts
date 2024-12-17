import { Category, CategoryInterface } from "../entities/categoryEntity";
import axiosInstance from "../utils/axiosInstance";

export class CategoryRepository {
    static async GetAll(): Promise<Category[]> {
        const response = await axiosInstance.get('/category');
        return (response.data as CategoryInterface[]).map(obj => new Category(obj));
    }

    static async Create(obj:Category): Promise<Category> {
        const response = await axiosInstance.post(`/category`, obj.toAPI());
        return (new Category(response.data));
    }

    static async Update(obj:Category): Promise<Category> {
        const response = await axiosInstance.put(`/category/${obj.id!}`, obj.toAPI());
        return (new Category(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/category/${id}`));
    }
}