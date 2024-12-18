import { Role, RoleInterface } from "./roleEntity";
import { Subscription, SubscriptionInterface } from "./subscriptionEntity";

export interface UserSubscriptionInterface {
    _id?: string;
    startDate: string;
    endDate: string;
    subscriptionRef: SubscriptionInterface;
}

export interface UserInterface {
    _id?: string;
    username: string;
    password: string;
    email: string;
    roleRef: RoleInterface;
    subscriptionsRef: UserSubscriptionInterface[];
}

export class UserSubscription {
    //Estos valores pueden ser solo lectura
    public startDate: Date;
    public endDate: Date;
    public subscription: Subscription | null;

    constructor(usrScr?:UserSubscriptionInterface, startDate?:Date, endDate?:Date, subscription?:Subscription) {
        if (usrScr) {
            this.startDate = new Date(usrScr.startDate);
            this.endDate = new Date(usrScr.endDate);
            this.subscription = Subscription.Parse(usrScr.subscriptionRef);
        } else if (startDate && endDate && subscription) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.subscription = subscription;
        } else {
            this.startDate = new Date();
            this.endDate = new Date();
            this.subscription = null;
        }
    }
    
    /**
     * Devuelve un Object valido para enviar en las peticiones al servidor API Rest.
     */
    public toAPI() {
        return {
            startDate: this.startDate.toISOString(),
            endDate: this.endDate.toISOString(),
            subscriptionRef: this.subscription!.id!,
        };
    }
}

export class User {
    readonly id?: string;
    public username: string;
    public password: string;
    public email: string;
    public role: Role | null;
    public subscriptions: UserSubscription[];

    constructor(user?:UserInterface) {
        if (user) {
            this.id = user._id;
            this.username = user.username;
            this.password = user.password;
            this.email = user.email;
            this.role = Role.Parse(user.roleRef);
            this.subscriptions = user.subscriptionsRef.map(usrScr => new UserSubscription(usrScr));
        } else {
            this.id = undefined;
            this.username = "";
            this.password = "";
            this.email = "";
            this.role = null;
            this.subscriptions = [];
        }
    }

    public toAPI() {
        return {
            username: this.username,
            password: this.password,
            email: this.email,
            roleRef: this.role!.id!,
            subscriptionsRef: this.subscriptions.map(usrScr => usrScr.toAPI()),
        };
    }

    /**
     * Con lo recibido de la peticion HTTP, devuelve un objeto con los tipos de objetos correctos para su manejo en el UI.
     * Usar para las refrencias.
     * @param data 
     * @returns 
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static Parse(data:any): User | null {
        if (data && typeof data === "object" && "username" in data) {
            return new User(data);
        }
        return null;
    }
}