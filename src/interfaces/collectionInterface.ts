import { CategoryInterface } from "./categoryInterface";

export interface CollectionInterface {
    _id: string;
    name: string;
    description: string;
    categories: CategoryInterface[];
}