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

    //ASK ¿Me sirve pasar un id de un "Role" que ya no existe?
    // public getId(): string {
    //     if (typeof this.role == "string") {
    //         return this.role;
    //     }
    //     return this.role._id!;
    // }

    // public getRoleName(): string | null {
    //     if (typeof this.role == "string") {
    //         return null;
    //     }
    //     return this.role.name;
    // }

    public toAPI() {
        return {
            name: this.name,
        };
    }
}