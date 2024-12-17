export interface SuscriptionPriceInterface{
    _id: string;
    startDate: Date;
    amount: number;
    suscripcionId: string;
}

export interface SuscriptionInterface {
    _id: string;
    type: string;
}