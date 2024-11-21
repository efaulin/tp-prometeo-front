export interface RoleInterface {
    _id?: string;
    name: string;
}

export class Role {
    readonly id?: string;
    public name: string;

    constructor({_id, name}:RoleInterface) {
        this.id = _id;
        this.name = name;
    }
    //TODO Testear esto
    static New({_id, name}:RoleInterface): Role | null {
        if (!name) return null;
        return new Role({_id, name});
    }

    public toAPI() {
        return {
            name: this.name,
        };
    }
}