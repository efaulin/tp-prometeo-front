import { Role, RoleInterface } from "./roleInterface";
import { SuscriptionInterface } from "./suscriptionInterface";

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
    public startDate: Date;
    public endDate: Date;
    private suscripcionId: SuscriptionInterface | string;

    constructor({_id, startDate, endDate, suscripcionId}:UserSuscriptionInterface) {
        this.id = _id;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.suscripcionId = suscripcionId;
    }

    public getSuscription() : SuscriptionInterface | null {
        if (typeof this.suscripcionId == "string") {
            return null;
        }
        return this.suscripcionId;
    }
    //ASK ¿Me sirve pasar un id de una "Suscription" que ya no existe?
    public getSuscriptionId() : string {
        if (typeof this.suscripcionId == "string") {
            return this.suscripcionId;
        }
        return this.suscripcionId._id!;
    }

    public getSuscriptionType() : string | null {
        if (typeof this.suscripcionId == "string") {
            return null;
        }
        return this.suscripcionId.type;
    }

    public toAPI() {
        return {
            startDate: this.startDate.toISOString(),
            endDate: this.endDate.toISOString(),
            suscripcionId: this.getSuscriptionId(),
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
        this.role = Role.New(role);
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