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
    readonly id?: string;
    private startDate: Date;
    private endDate: Date;
    private suscripcionId: Suscription | null; //[ ] Probando el null

    constructor({_id, startDate, endDate, suscripcionId}:UserSuscriptionInterface) {
        this.id = _id;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.suscripcionId = Suscription.Parse(suscripcionId);
    }

    public getStartDate() {
        return this.startDate;
    }

    public getEndDate() {
        return this.endDate;
    }

    public getSuscription() {
        return this.suscripcionId;
    }
    /**
     * Devuelve un Object valido para enviar en las peticiones al servidor API Rest.
     */
    public toAPI() {
        return {
            startDate: this.startDate.toISOString(),
            endDate: this.endDate.toISOString(),
            suscripcionId: this.suscripcionId!.id!,
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

    constructor({_id, username, password, email, role, suscripcions}:UserInterface) {
        this.id = _id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = Role.Parse(role);
        this.suscripcions = suscripcions.map(usrScr => new UserSuscription(usrScr));
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