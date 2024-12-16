import { Role, RoleInterface } from "./roleEntity";
import { Suscription, SuscriptionInterface } from "./suscriptionEntity";

export interface UserSuscriptionInterface {
    _id?: string;
    startDate: string;
    endDate: string;
    suscripcionId: SuscriptionInterface;
}

export interface UserInterface {
    _id?: string;
    username: string;
    password: string;
    email: string;
    role: RoleInterface;
    suscripcions: UserSuscriptionInterface[];
}

export class UserSuscription {
    readonly startDate: Date;
    readonly endDate: Date;
    readonly suscripcion: Suscription | null;

    constructor(usrScr?:UserSuscriptionInterface, startDate?:Date, endDate?:Date, suscription?:Suscription) {
        if (usrScr) {
            this.startDate = new Date(usrScr.startDate);
            this.endDate = new Date(usrScr.endDate);
            this.suscripcion = Suscription.Parse(usrScr.suscripcionId);
        } else if (startDate && endDate && suscription) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.suscripcion = suscription;
        } else {
            this.startDate = new Date();
            this.endDate = new Date();
            this.suscripcion = null;
        }
    }
    
    /**
     * Devuelve un Object valido para enviar en las peticiones al servidor API Rest.
     */
    public toAPI() {
        return {
            startDate: this.startDate.toISOString(),
            endDate: this.endDate.toISOString(),
            suscripcionId: this.suscripcion!.id!,
        };
    }
}

export class User {
    readonly id?: string;
    public username: string;
    public password: string;
    public email: string;
    public role: Role | null;
    public suscripcions: UserSuscription[];

    constructor(user?:UserInterface) {
        if (user) {
            this.id = user._id;
            this.username = user.username;
            this.password = user.password;
            this.email = user.email;
            this.role = Role.Parse(user.role);
            this.suscripcions = user.suscripcions.map(usrScr => new UserSuscription(usrScr));
        } else {
            this.id = undefined;
            this.username = "";
            this.password = "";
            this.email = "";
            this.role = null;
            this.suscripcions = [];
        }
    }

    public toAPI() {
        return {
            username: this.username,
            password: this.password,
            email: this.email,
            role: this.role!.id!,
            suscripcions: this.suscripcions.map(usrScr => usrScr.toAPI()),
        };
    }
}