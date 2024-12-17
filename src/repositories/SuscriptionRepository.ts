import { Subscription, SubscriptionInterface } from "../entities/subscriptionEntity";
import axiosInstance from "../utils/axiosInstance";

export class SubscriptionRepository {
    static async GetAll(): Promise<Subscription[]> {
        const response = await axiosInstance.get('/subscription');
        return (response.data as SubscriptionInterface[]).map(scp => new Subscription(scp));
    }
}