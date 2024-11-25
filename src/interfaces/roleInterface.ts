export interface RoleInterface {
    _id?: string;
    name: string;
}

export class Role {
    readonly id?: string;
    public name: string;

    /**
     * Utilizar unicamente para crear objetos nuevos o de llamadas directas de la clase, para su uso en relaciones/referencias utilizar el metodo de clase **Parse**(data).
     */
    constructor({_id, name}:RoleInterface) {
        this.id = _id;
        this.name = name;
    }
    //TODO Hacer un metodo Parce(data) para todos los objetos que vengan de la API.
    //[X] Funciona!
    /**
     * Con lo recibido de la peticion HTTP, devuelve un objeto con los tipos de objetos correctos para su manejo en el UI.
     * Usar para las refrencias.
     * @param data 
     * @returns 
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static Parse(data:any): Role | null {
        if (data && typeof data === "object" && "name" in data) {
            return new Role({_id: data._id, name:data.name});
        }
        return null;
    }
    
    /**
     * Devuelve un Object valido para enviar en las peticiones al servidor API Rest.
     */
    public toAPI() {
        return {
            name: this.name,
        };
    }
}