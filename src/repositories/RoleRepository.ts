import { Role, RoleInterface } from "../entities/roleEntity";
import axiosInstance from "../utils/axiosInstance";

export class RoleRepository {
    static async GetAll(): Promise<Role[]> {
        const response = await axiosInstance.get('/role');
        return (response.data as RoleInterface[]).map(obj => new Role(obj));
    }

    static async Create(obj:Role): Promise<Role> {
        const response = await axiosInstance.post(`/role`, obj.toAPI());
        return (new Role(response.data));
    }

    static async Update(obj:Role): Promise<Role> {
        const response = await axiosInstance.put(`/role/${obj.id!}`, obj.toAPI());
        return (new Role(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/role/${id}`));
    }
}