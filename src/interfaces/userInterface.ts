import { RoleInterface } from "./roleInterface";
import { SuscriptionInterface } from "./suscriptionInterface";

export interface UserSuscriptionInterface {
    _id: string;
    startDate: Date;
    endDate: Date;
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