import { Suscription, SuscriptionInterface } from "../entities/suscriptionEntity";
import axiosInstance from "../utils/axiosInstance";

export class SuscriptionRepository {
    static async GetAll(): Promise<Suscription[]> {
        const response = await axiosInstance.get('/suscripcion');
        return (response.data as SuscriptionInterface[]).map(scp => new Suscription(scp));
    }
}