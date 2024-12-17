import { Narrator, NarratorInterface } from "../entities/narratorEntity";
import axiosInstance from "../utils/axiosInstance";

export class NarratorRepository {
    static async GetAll(): Promise<Narrator[]> {
        const response = await axiosInstance.get('/narrator');
        return (response.data as NarratorInterface[]).map(obj => new Narrator(obj));
    }

    static async Create(obj:Narrator): Promise<Narrator> {
        const response = await axiosInstance.post(`/narrator`, obj.toAPI());
        return (new Narrator(response.data));
    }

    static async Update(obj:Narrator): Promise<Narrator> {
        const response = await axiosInstance.put(`/narrator/${obj.id!}`, obj.toAPI());
        return (new Narrator(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/narrator/${id}`));
    }
}