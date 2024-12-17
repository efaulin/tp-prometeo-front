import { User, UserInterface } from "../entities/userEntity";
import axiosInstance from "../utils/axiosInstance";

export class UserRepository {
    static async GetAll(): Promise<User[]> {
        const response = await axiosInstance.get('/user');
        return (response.data as UserInterface[]).map(usr => new User(usr));
    }

    static async Create(usr:User): Promise<User> {
        const response = await axiosInstance.post(`/user`, usr.toAPI());
        return (new User(response.data));
    }

    static async Update(usr:User): Promise<User> {
        const response = await axiosInstance.put(`/user/${usr.id!}`, usr.toAPI());
        return (new User(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/user/${id}`));
    }
}