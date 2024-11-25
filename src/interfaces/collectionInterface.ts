import { Category, CategoryInterface } from "./categoryInterface";

export interface CollectionInterface {
    _id: string;
    name: string;
    description: string;
    categories: CategoryInterface[];
}

export class Collection {
    readonly id?: string;
    public name: string;
    public description: string;
    public categories: Category[]; //¿Public?

    /**
     * Utilizar unicamente para crear objetos nuevos o de llamadas directas de la clase, para su uso en relaciones/referencias utilizar el metodo de clase **Parse**(data).
     */
    constructor({_id, name, description, categories}:CollectionInterface) {
        this.id = _id;
        this.name = name;
        this.description = description;

        const tmpCategoriesArray : Category[] = [];
        categories.forEach((ctgInt) => {
            const tmpCtg = Category.Parse(ctgInt);
            if (tmpCtg) {
                tmpCategoriesArray.push(tmpCtg);
            }
        })
        this.categories = tmpCategoriesArray;
    }
    
    /**
     * Con lo recibido de la peticion HTTP, devuelve un objeto con los tipos de objetos correctos para su manejo en el UI.
     * Usar para las refrencias.
     * @param data 
     * @returns 
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static Parse(data:any): Collection | null {
        if (data && typeof data === "object" && "name" in data) {
            return new Collection({_id: data._id, name:data.name, description: data.description, categories: data.categories});
        }
        return null;
    }
    
    /**
     * Devuelve un Object valido para enviar en las peticiones al servidor API Rest.
     */
    public toAPI() {
        return {
            name: this.name,
            description: this.description,
            categories: this.categories.map(ctg => ctg.id!),
        };
    }
}