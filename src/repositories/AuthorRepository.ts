import { Author, AuthorInterface } from "../entities/authorEntity";
import axiosInstance from "../utils/axiosInstance";

export class AuthorRepository {
    static async GetAll(): Promise<Author[]> {
        const response = await axiosInstance.get('/author');
        return (response.data as AuthorInterface[]).map(obj => new Author(obj));
    }

    static async Create(obj:Author): Promise<Author> {
        const response = await axiosInstance.post(`/author`, obj.toAPI());
        return (new Author(response.data));
    }

    static async Update(obj:Author): Promise<Author> {
        const response = await axiosInstance.put(`/author/${obj.id!}`, obj.toAPI());
        return (new Author(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/author/${id}`));
    }
}