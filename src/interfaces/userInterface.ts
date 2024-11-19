import { RoleInterface } from "./roleInterface";
import { SuscriptionInterface } from "./suscriptionInterface";

export interface UserSuscriptionInterface {
    _id: string;
    startDate: string;
    endDate: string;
    suscripcionId: SuscriptionInterface;
}

export interface UserInterface {
    _id: string;
    username: string;
    password: string;
    email: string;
    role: RoleInterface;
    suscripcions: UserSuscriptionInterface[];
}

export class UserSuscription {
    //ASK ¿Y si quiero crear uno nuevo, osea sin id?
    readonly _id: string;
    private startDate: string;
    private endDate: string;
    private suscripcionId: SuscriptionInterface;

    constructor({_id, startDate, endDate, suscripcionId}:UserSuscriptionInterface) {
        this._id = _id;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.suscripcionId = suscripcionId;//Clase
    }
}

export class User {
    //ASK ¿Y si quiero crear uno nuevo, osea sin id?
    readonly _id?: string;
    public username: string;
    public password: string;
    public email: string;
    private role: RoleInterface;
    private suscripcions: UserSuscriptionInterface[];

    constructor({_id, username, password, email, role, suscripcions}:UserInterface) {
        if (_id != "") this._id = _id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        if (suscripcions.length >= 1) {
            
        }
        this.suscripcions = suscripcions;
    }
}