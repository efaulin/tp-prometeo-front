import { Language, LanguageInterface } from "../entities/languageEntity";
import axiosInstance from "../utils/axiosInstance";

export class LanguageRepository {
    static async GetAll(): Promise<Language[]> {
        const response = await axiosInstance.get('/language');
        return (response.data as LanguageInterface[]).map(obj => new Language(obj));
    }

    static async Create(obj:Language): Promise<Language> {
        const response = await axiosInstance.post(`/language`, obj.toAPI());
        return (new Language(response.data));
    }

    static async Update(obj:Language): Promise<Language> {
        const response = await axiosInstance.put(`/language/${obj.id!}`, obj.toAPI());
        return (new Language(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/language/${id}`));
    }
}