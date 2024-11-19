export interface SuscriptionPriceInterface{
    _id?: string;
    startDate: string;
    amount: number;
    suscripcionId: SuscriptionInterface;
}

export interface SuscriptionInterface {
    _id?: string;
    type: string;
}

export class SuscriptionPrice {
    readonly id?: string;
    public startDate: Date;
    public amount: number;
    public suscripcionId: Suscription | null;

    constructor({_id, startDate, amount, suscripcionId}:SuscriptionPriceInterface) {
        this.id = _id;
        this.startDate = new Date(startDate);
        this.amount = amount;
        this.suscripcionId = Suscription.New(suscripcionId);
    }

    public toAPI() {
        return {
            startDate: this.startDate.toISOString(),
            amount: this.amount,
            suscricionId: this.suscripcionId!.id!,
        };
    }
}

export class Suscription {
    readonly id?: string;
    public type: string;

    constructor({_id, type}:SuscriptionInterface) {
        this.id = _id;
        this.type = type;
    }

    //TODO Testear esto
    static New({_id, type}:SuscriptionInterface): Suscription | null {
        if (!type) return null;
        return new Suscription({_id, type});
    }

    public toAPI() {
        return {
            type: this.type,
        };
    }
}