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
    private startDate: Date;
    private amount: number;
    private suscripcionId: Suscription | null;

    constructor({_id, startDate, amount, suscripcionId}:SuscriptionPriceInterface) {
        this.id = _id;
        this.startDate = new Date(startDate);
        this.amount = amount;
        this.suscripcionId = Suscription.Parse(suscripcionId);
    }
    
    public getStartDate() {
        return this.startDate;
    }

    public getAmount() {
        return this.amount;
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
            amount: this.amount,
            suscricionId: this.suscripcionId!.id!,
        };
    }
}

export class Suscription {
    readonly id?: string;
    public type: string;

    /**
     * Utilizar unicamente para crear objetos nuevos, para su uso en peticiones HTTP utilizar el metodo de clase **Parse**(data).
     */
    constructor({_id, type}:SuscriptionInterface) {
        this.id = _id;
        this.type = type;
    }

    /**
     * Con lo recibido de la peticion HTTP, devuelve un objeto con los tipos de objetos correctos para su manejo en el UI
     * @param data 
     * @returns 
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static Parse(data:any): Suscription | null {
        if (data && typeof data === "object" && "type" in data) return null;
        return new Suscription({_id: data._id, type: data.type});
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