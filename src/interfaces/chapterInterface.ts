import { Author, AuthorInterface } from "./authorInterface";
import { Host, HostInterface } from "./hostInterface";
import { Language, LanguageInterface } from "./idiomaInterface";
import { Narrator, NarratorInterface } from "./narradorInterface";

export interface ChapterInterface {
    _id: string;
    coleccionId: string;
    name: string;
    authors: AuthorInterface[];
    narrator: NarratorInterface;
    hosts: HostInterface[];
    durationInSeconds: number;
    language: LanguageInterface;
    description: string;
    uploadDate: Date;
    publicationDate: Date;
}

export class Chapter {
    //ASK ¿Todos public?
    readonly id?: string;
    public name: string;
    public collectionID: string;
    readonly durationInSeconds: number; //Duracion del audio.
    public description: string;
    readonly uploadDate: Date; //Fecha de carga del audio
    public publicationDate: Date;
    public language: Language | null;
    //Podcast -> Hosts
    private hosts: Host[] | null;
    //Audiolibro -> Authors & Narrator
    private authors: Author[] | null;
    private narrator: Narrator | null;

    /**
     * Utilizar unicamente para crear objetos nuevos o de llamadas directas de la clase, para su uso en relaciones/referencias utilizar el metodo de clase **Parse**(data).
     */
    constructor(chapter:ChapterInterface) {
        this.id = chapter._id;
        this.name = chapter.name;
        this.collectionID = chapter.coleccionId;
        this.durationInSeconds = chapter.durationInSeconds;
        this.description = chapter.description;
        this.uploadDate = new Date(chapter.uploadDate);
        this.publicationDate = new Date(chapter.publicationDate);
        this.language = Language.Parse(chapter.language);

        //Podcast -> Hosts
        //Audiolibro -> Authors & Narrator
        if (chapter.hosts.length > 0) {
            const tmpHosts:Host[] = [];
            chapter.hosts.forEach((hst) => {
                const tmp = Host.Parse(hst);
                if (tmp) {
                    tmpHosts.push(tmp);
                }
            });
            this.hosts = tmpHosts;
            this.authors = null;
            this.narrator = null;
        } else {
            const tmpAuthors:Author[] = [];
            chapter.authors.forEach((ath) => {
                const tmp = Author.Parse(ath);
                if (tmp) {
                    tmpAuthors.push(tmp);
                }
            });
            this.authors = tmpAuthors;
            this.narrator = Narrator.Parse(chapter.narrator);
            this.hosts = null;
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
        if (this.hosts) {
            return true;
        }
        return false;
    }

    public isAudiobook() : boolean {
        if (this.authors && this.narrator) {
            return true;
        }
        return false;
    }
    
    public getHosts() {
        return this.hosts;
    }

    public getAuthors() {
        return this.authors;
    }

    public getNarrator() {
        return this.narrator;
    }

    public setHosts(hosts:Host[]) {
        this.hosts = hosts;
        this.authors = null;
        this.narrator = null;
    }

    public setNarratorAndAuthors(nrt: Narrator, aths: Author[]) {
        this.narrator = nrt;
        this.authors = aths;
        this.hosts = null;
    }

    /**
     * No usar si el capitulo es un Podcast. En ese caso utilizar **setNarratorAndAuthors**.
     * @param authors 
     */
    public setAuthors(authors:Author[]) {
        this.setNarratorAndAuthors(this.narrator!, authors);
    }

    /**
     * No usar si el capitulo es un Podcast. En ese caso utilizar **setNarratorAndAuthors**.
     * @param authors 
     */
    public setNarrator(narrator:Narrator) {
        this.setNarratorAndAuthors(narrator, this.authors!);
    }

    /**
     * Devuelve un Object valido para enviar en las peticiones al servidor API Rest.
     */
    public toAPI() {
        return {
            name: this.name,
            coleccionId: this.collectionID,
            durationInSeconds: this.durationInSeconds,
            description: this.description,
            uploadDate: this.uploadDate.toISOString(),
            publicationDate: this.publicationDate.toISOString(),
            language: this.language!.id!,
            //Podcast -> Hosts
            hosts: this.hosts?.map(hst => hst.id!),
            //Audiolibro -> Authors & Narrator
            authors: this.authors?.map(ath => ath.id!),
            narrator: this.narrator?.id, //TODO Teastear, no me acuerdo como lo manejaba el back
        };
    }
}