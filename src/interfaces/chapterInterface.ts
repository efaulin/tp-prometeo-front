import { AuthorInterface } from "./authorInterface";
import { HostInterface } from "./hostInterface";
import { idiomaInterface as LanguageInterface } from "./idiomaInterface";
import { narradorInterface as NarratorInterface } from "./narradorInterface";

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