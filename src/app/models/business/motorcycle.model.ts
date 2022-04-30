import { List } from "lodash";
import { Brand } from "./brand.model";
import { GenericLists } from "./generic.model";
import { Image } from "./image.model";

/**
* Model of motorcycle
*/
export class Motorcycle{
    id: number;
    brand: Brand
    reference: GenericLists;
    year: string;
    cc: number;
    power: string;
    torque: string;
    weigth: number;
    fuelCapacity: number;
    ignitionType: GenericLists;
    frontBrake: GenericLists;
    backBrake: GenericLists;
    frontSuspension: GenericLists;
    rearSuspension: GenericLists;
    frontTire: string;
    rearTire: string;
    accessories: string;
    dateSoat: string;
    dateTecno: string;
    registrationNumber: string;
    milliage: number;
    description: string;
    accesories: string;
    sellValue: number;
    minimumSaleValue: number;
    commissionValue: number;
    ownersName: string;
    ownerEmail: string;
    ownerPhoneNumber: string;
    principalImage: string;
    state: GenericLists;
    images: Array<Image>;
}