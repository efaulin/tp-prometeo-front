import { Subscription, SubscriptionInterface, SubscriptionPrice, SubscriptionPriceInterface } from "../entities/subscriptionEntity";
import axiosInstance from "../utils/axiosInstance";

export class SubscriptionRepository {
    static async GetAll(): Promise<Subscription[]> {
        const response = await axiosInstance.get('/subscription');
        return (response.data as SubscriptionInterface[]).map(scp => new Subscription(scp));
    }

    static async Create(obj:Subscription): Promise<Subscription> {
        const response = await axiosInstance.post(`/subscription`, obj.toAPI());
        return (new Subscription(response.data));
    }

    static async Update(obj:Subscription): Promise<Subscription> {
        const response = await axiosInstance.put(`/subscription/${obj.id!}`, obj.toAPI());
        return (new Subscription(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/subscription/${id}`));
    }

    static async CreatePrice(subscriptionId:string, obj:SubscriptionPrice): Promise<SubscriptionPrice> {
        const response = await axiosInstance.post(`/subscription/${subscriptionId}/prices`, obj.toAPI());
        return (new SubscriptionPrice(response.data));
    }

    static async GetAllPrices(obj:Subscription): Promise<SubscriptionPrice[]> {
        const response = await axiosInstance.get(`/subscription/${obj.id!}/prices`);
        return (response.data as SubscriptionPriceInterface[]).map(scp => new SubscriptionPrice(scp));
    }
}