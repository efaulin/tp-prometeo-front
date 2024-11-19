export interface SuscriptionPriceInterface{
    _id: string;
    startDate: string;
    amount: number;
    suscripcionId: string;
}

export interface SuscriptionInterface {
    _id: string;
    type: string;
}

export class SuscriptionPrice {
    //ASK ¿Y si quiero crear uno nuevo, osea sin id?
    readonly _id: string;
    private startDate: Date;
    private amount: number;
    private suscripcionId: string;

    constructor({_id, startDate, amount, suscripcionId}:SuscriptionPriceInterface) {
        this._id = _id;
        this.startDate = new Date(startDate);
        this.amount = amount;
        this.suscripcionId = suscripcionId;
    }
}

export class Suscription {
    //ASK ¿Y si quiero crear uno nuevo, osea sin id?
    readonly _id: string;
    private type: string;
    //ASK Ahhh y esto? A ver, MANEJALO
    private prices: SuscriptionPrice[];

    constructor({_id, type}:SuscriptionInterface) {
        this._id = _id;
        this.type = type;
    }
}