import { Role, RoleInterface } from "../entities/roleEntity";
import axiosInstance from "../utils/axiosInstance";

export class RoleRepository {
    static async GetAll(): Promise<Role[]> {
        const response = await axiosInstance.get('/role');
        return (response.data as RoleInterface[]).map(usr => new Role(usr));
    }

    static async Create(role:Role): Promise<Role> {
        const response = await axiosInstance.post(`/role`, role.toAPI());
        return (new Role(response.data));
    }

    static async Update(role:Role): Promise<Role> {
        const response = await axiosInstance.put(`/role/${role.id!}`, role.toAPI());
        return (new Role(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/role/${id}`));
    }
}