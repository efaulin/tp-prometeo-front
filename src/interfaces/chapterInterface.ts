import { AuthorInterface } from "./authorInterface";
import { HostInterface } from "./hostInterface";
import { LanguageInterface } from "./languageInterface";
import { NarratorInterface } from "./narratorInterface";

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