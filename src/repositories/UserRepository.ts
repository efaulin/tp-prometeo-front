import { Replay, ReplayInterface } from "../entities/replayEntity";
import { User, UserInterface } from "../entities/userEntity";
import axiosInstance from "../utils/axiosInstance";

export class UserRepository {
    static async GetAll(): Promise<User[]> {
        const response = await axiosInstance.get('/user');
        return (response.data as UserInterface[]).map(obj => new User(obj));
    }

    static async Create(obj:User): Promise<User> {
        obj = User.FromExpectedUser(obj);
        const response = await axiosInstance.post(`/user`, obj.toAPI());
        return (new User(response.data));
    }

    static async FullyUpdate(obj:User): Promise<User> {
        obj = User.FromExpectedUser(obj);
        const response = await axiosInstance.put(`/user/${obj.id!}`, obj.toAPI());
        return (new User(response.data));
    }

    static async PartialUpdate(obj:Partial<User>): Promise<User> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateFields: any = {};
        if (obj.username) updateFields.username = obj.username;
        if (obj.password) updateFields.password = obj.password;
        if (obj.email) updateFields.email = obj.email;
        if (obj.role) updateFields.roleRef = obj.role.id!;
        if (obj.subscriptions) updateFields.subscriptionsRef = obj.subscriptions.map(usrScr => usrScr.toAPI());
        const response = await axiosInstance.put(`/user/${obj.id!}`, updateFields);
        return (new User(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/user/${id}`));
    }

    static async GetAllReplays(id:string): Promise<Replay[]> {
        const response = await axiosInstance.get(`/user/${id}/replays`);
        return (response.data as ReplayInterface[]).map(obj => new Replay(obj));
    }
}