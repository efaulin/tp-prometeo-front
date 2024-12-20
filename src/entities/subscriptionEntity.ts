export interface SubscriptionPriceInterface{
    _id?: string;
    startDate: string;
    amount: number;
    subscriptionRef: SubscriptionInterface;
}

export interface SubscriptionInterface {
    _id?: string;
    type: string;
}

export class SubscriptionPrice {
    readonly id?: string;
    private startDate: Date;
    private amount: number;
    private subscriptionId: Subscription | null;

    constructor({_id, startDate, amount, subscriptionRef}:SubscriptionPriceInterface) {
        this.id = _id;
        this.startDate = new Date(startDate);
        this.amount = amount;
        this.subscriptionId = Subscription.Parse(subscriptionRef);
    }
    
    public getStartDate() {
        return this.startDate;
    }

    public getAmount() {
        return this.amount;
    }

    public getSubscription() {
        return this.subscriptionId;
    }

    /**
     * Devuelve un Object valido para enviar en las peticiones al servidor API Rest.
     */
    public toAPI() {
        return {
            startDate: this.startDate.toISOString(),
            amount: this.amount,
            subscriptionRef: this.subscriptionId!.id!,
        };
    }
}

export class Subscription {
    readonly id?: string;
    public type: string;

    /**
     * Utilizar unicamente para crear objetos nuevos, para su uso en peticiones HTTP utilizar el metodo de clase **Parse**(data).
     */
    constructor({_id, type}:SubscriptionInterface) {
        this.id = _id;
        this.type = type;
    }

    /**
     * Con lo recibido de la peticion HTTP, devuelve un objeto con los tipos de objetos correctos para su manejo en el UI
     * @param data 
     * @returns 
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static Parse(data:any): Subscription | null {
        if (data && typeof data === "object" && "type" in data) {
            return new Subscription({_id: data._id, type: data.type});
        }
        return null;
    }

    /**
     * Devuelve un Object valido para enviar en las peticiones al servidor API Rest.
     */
    public toAPI() {
        return {
            type: this.type,
        };
    }
}