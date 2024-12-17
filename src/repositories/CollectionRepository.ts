import { Collection, CollectionInterface } from "../entities/collectionEntity";
import axiosInstance from "../utils/axiosInstance";

export class CollectionRepository {
    static async GetAll(): Promise<Collection[]> {
        const response = await axiosInstance.get('/collection');
        return (response.data as CollectionInterface[]).map(obj => new Collection(obj));
    }

    static async Create(obj:Collection): Promise<Collection> {
        const response = await axiosInstance.post(`/collection`, obj.toAPI());
        return (new Collection(response.data));
    }

    static async Update(obj:Collection): Promise<Collection> {
        const response = await axiosInstance.put(`/collection/${obj.id!}`, obj.toAPI());
        return (new Collection(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/collection/${id}`));
    }
}