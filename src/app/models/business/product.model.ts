
/**
 * Model of basic product 
 */
export interface productI {
    id: number | string;
    name: string;
    model: string;
    mark: string;
    year: string | number;
    state: string | undefined;
    ownerName: string | undefined;
    ownerPhone: number;
    milliage:number;
    sellPrice:number;
    description:string;
    reference: string;
    ownerEmail:string;
    accessories:string;
    registrationNumber:string;

}