import { Collection, CollectionInterface } from "../entities/collectionEntity";
import axiosInstance from "../utils/axiosInstance";

export class CollectionRepository {
    static async GetAll(): Promise<Collection[]> {
        const response = await axiosInstance.get('/collection');
        return (response.data as CollectionInterface[]).map(obj => new Collection(obj));
    }

    static async Create(obj:Collection): Promise<Collection> {
        console.log(obj);
        const response = await axiosInstance.post(`/collection`, obj.toAPI());
        return (new Collection(response.data));
    }

    static async Update(obj:Partial<Collection>): Promise<Collection> {
        const updateFields: any = {};
        if (obj.name) updateFields.name = obj.name;
        if (obj.description) updateFields.description = obj.description;
        if (obj.categoriesRef) updateFields.categoriesRef = obj.categoriesRef.map(_category => _category.id!);
        const response = await axiosInstance.put(`/collection/${obj.id!}`, updateFields);
        return (new Collection(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/collection/${id}`));
    }
}