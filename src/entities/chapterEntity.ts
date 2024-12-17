import { Author, AuthorInterface } from "./authorEntity";
import { Host, HostInterface } from "./hostEntity";
import { Language, LanguageInterface } from "./languageEntity";
import { Narrator, NarratorInterface } from "./narratorEntity";

export interface ChapterInterface {
    _id: string;
    collectionRef: string;
    name: string;
    authorsRef: AuthorInterface[];
    narratorRef: NarratorInterface;
    hostsRef: HostInterface[];
    durationInSeconds: number;
    languageRef: LanguageInterface;
    description: string;
    uploadDate: Date;
    publicationDate: Date;
}

export class Chapter {
    //ASK ¿Todos public?
    readonly id?: string;
    public name: string;
    public collectionId: string; //Se decidio que CollectionRef devolvera unicamente su ID.
    readonly durationInSeconds: number; //Duracion del audio.
    public description: string;
    readonly uploadDate: Date; //Fecha de carga del audio
    public publicationDate: Date;
    public languageRef: Language | null;
    //Podcast -> Hosts
    private hostsRef: Host[] | null;
    //Audiolibro -> Authors & Narrator
    private authorsRef: Author[] | null;
    private narratorRef: Narrator | null;

    /**
     * Utilizar unicamente para crear objetos nuevos o de llamadas directas de la clase, para su uso en relaciones/referencias utilizar el metodo de clase **Parse**(data).
     */
    constructor(chapter?:ChapterInterface) {
        if (chapter) {
            this.id = chapter._id;
            this.name = chapter.name;
            this.collectionId = chapter.collectionRef;
            this.durationInSeconds = chapter.durationInSeconds;
            this.description = chapter.description;
            this.uploadDate = new Date(chapter.uploadDate);
            this.publicationDate = new Date(chapter.publicationDate);
            this.languageRef = Language.Parse(chapter.languageRef);

            //Podcast -> Hosts
            //Audiolibro -> Authors & Narrator
            if (chapter.hostsRef.length > 0) {
                const tmpHosts:Host[] = [];
                chapter.hostsRef.forEach((hst) => {
                    const tmp = Host.Parse(hst);
                    if (tmp) {
                        tmpHosts.push(tmp);
                    }
                });
                this.hostsRef = tmpHosts;
                this.authorsRef = null;
                this.narratorRef = null;
            } else {
                const tmpAuthors:Author[] = [];
                chapter.authorsRef.forEach((ath) => {
                    const tmp = Author.Parse(ath);
                    if (tmp) {
                        tmpAuthors.push(tmp);
                    }
                });
                this.authorsRef = tmpAuthors;
                this.narratorRef = Narrator.Parse(chapter.narratorRef);
                this.hostsRef = null;
            }
        } else {
            this.name = "";
            this.collectionId = "";
            this.durationInSeconds = 0;
            this.description = "";
            this.uploadDate = new Date();
            this.publicationDate = new Date();
            this.languageRef = null;
            this.hostsRef = null;
            this.authorsRef = null;
            this.narratorRef = null;
        }
    }
    
    /**
     * Con lo recibido de la peticion HTTP, devuelve un objeto con los tipos de objetos correctos para su manejo en el UI.
     * Usar para las refrencias.
     * @param data 
     * @returns 
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static Parse(data:any): Chapter | null {
        if (data && typeof data === "object" && "name" in data) {
            return new Chapter({...data});
        }
        return null;
    }

    public isPodcast() : boolean {
        if (this.hostsRef) {
            return true;
        }
        return false;
    }

    public isAudiobook() : boolean {
        if (this.authorsRef && this.narratorRef) {
            return true;
        }
        return false;
    }
    
    public getHosts() {
        return this.hostsRef;
    }

    public getAuthors() {
        return this.authorsRef;
    }

    public getNarrator() {
        return this.narratorRef;
    }

    public setHosts(hosts:Host[]) {
        this.hostsRef = hosts;
        this.authorsRef = null;
        this.narratorRef = null;
    }

    public setNarratorAndAuthors(nrt: Narrator, aths: Author[]) {
        this.narratorRef = nrt;
        this.authorsRef = aths;
        this.hostsRef = null;
    }

    /**
     * No usar si el capitulo es un Podcast. En ese caso utilizar **setNarratorAndAuthors**.
     * @param authors 
     */
    public setAuthors(authors:Author[]) {
        this.setNarratorAndAuthors(this.narratorRef!, authors);
    }

    /**
     * No usar si el capitulo es un Podcast. En ese caso utilizar **setNarratorAndAuthors**.
     * @param authors 
     */
    public setNarrator(narrator:Narrator) {
        this.setNarratorAndAuthors(narrator, this.authorsRef!);
    }

    /**
     * Devuelve un Object valido para enviar en las peticiones al servidor API Rest.
     */
    public toAPI() {
        return {
            name: this.name,
            collectionRef: this.collectionId,
            durationInSeconds: this.durationInSeconds,
            description: this.description,
            uploadDate: this.uploadDate.toISOString(),
            publicationDate: this.publicationDate.toISOString(),
            languageRef: this.languageRef!.id!,
            //Podcast -> Hosts
            hostsRef: this.hostsRef?.map(hst => hst.id!),
            //Audiolibro -> Authors & Narrator
            authorsRef: this.authorsRef?.map(ath => ath.id!),
            narratorRef: this.narratorRef?.id, //TODO Teastear, no me acuerdo como lo manejaba el back
        };
    }
}