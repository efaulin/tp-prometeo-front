import { Category, CategoryInterface } from "./categoryEntity";

export interface CollectionInterface {
    _id: string;
    name: string;
    description: string;
    categoriesRef: CategoryInterface[];
}

export class Collection {
    readonly id?: string;
    public name: string;
    public description: string;
    public categoriesRef: Category[]; //¿Public?

    /**
     * Utilizar unicamente para crear objetos nuevos o de llamadas directas de la clase, para su uso en relaciones/referencias utilizar el metodo de clase **Parse**(data).
     */
    constructor(collectionInterface?:CollectionInterface) {
        if (collectionInterface) {
            this.id = collectionInterface._id;
            this.name = collectionInterface.name;
            this.description = collectionInterface.description;

            const tmpCategoriesArray : Category[] = [];
            collectionInterface.categoriesRef.forEach((ctgInt) => {
                const tmpCtg = Category.Parse(ctgInt);
                if (tmpCtg) {
                    tmpCategoriesArray.push(tmpCtg);
                }
            })
            this.categoriesRef = tmpCategoriesArray;
        } else {
            this.id = undefined;
            this.name = "";
            this.description = "";
            this.categoriesRef = [];
        }
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
            return new Collection({_id: data._id, name:data.name, description: data.description, categoriesRef: data.categoriesRef});
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
            categoriesRef: this.categoriesRef.map(ctg => ctg.id!),
        };
    }
}