import { Host, HostInterface } from "../entities/hostEntity";
import axiosInstance from "../utils/axiosInstance";

export class HostRepository {
    static async GetAll(): Promise<Host[]> {
        const response = await axiosInstance.get('/host');
        return (response.data as HostInterface[]).map(obj => new Host(obj));
    }

    static async Create(obj:Host): Promise<Host> {
        const response = await axiosInstance.post(`/host`, obj.toAPI());
        return (new Host(response.data));
    }

    static async Update(obj:Host): Promise<Host> {
        const response = await axiosInstance.put(`/host/${obj.id!}`, obj.toAPI());
        return (new Host(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/host/${id}`));
    }
}