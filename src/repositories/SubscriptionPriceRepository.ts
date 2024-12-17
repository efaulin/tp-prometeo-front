import { SubscriptionPrice, SubscriptionPriceInterface } from "../entities/subscriptionEntity";
import axiosInstance from "../utils/axiosInstance";

export class SubscriptionPriceRepository {
    static async GetAll(): Promise<SubscriptionPrice[]> {
        const response = await axiosInstance.get('/subscriptionprice');
        return (response.data as SubscriptionPriceInterface[]).map(obj => new SubscriptionPrice(obj));
    }

    static async Create(obj:SubscriptionPrice): Promise<SubscriptionPrice> {
        const response = await axiosInstance.post(`/subscriptionprice`, obj.toAPI());
        return (new SubscriptionPrice(response.data));
    }

    static async Update(obj:SubscriptionPrice): Promise<SubscriptionPrice> {
        const response = await axiosInstance.put(`/subscriptionprice/${obj.id!}`, obj.toAPI());
        return (new SubscriptionPrice(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/subscriptionprice/${id}`));
    }
}