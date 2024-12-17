import { Chapter, ChapterInterface } from "./chapterEntity";
import { User, UserInterface } from "./userEntity";

export interface ReplayInterface {
    _id?: string;
    userRef: UserInterface;
    chapterRef: ChapterInterface;
    watchedTimeInSec: number;
    rating?: number;
    review?: string;
}

export class Replay {
    readonly id?: string;
    public user: User | null;
    public chapter: Chapter | null;
    public watchedTimeInSec: number; //HACK Esto es calculado en base a cuantos segundos escucho del Audiolibro/Podcast
    public rating?: number;
    public review?: string;

    constructor(replay?:ReplayInterface){
        if (replay) {
            this.id = replay._id;
            this.user = User.Parse(replay.userRef);
            this.chapter = Chapter.Parse(replay.chapterRef);
            this.watchedTimeInSec = replay.watchedTimeInSec;
            this.rating = replay.rating;
            this.review = replay.review;
        } else {
            this.user = null;
            this.chapter = null;
            this.watchedTimeInSec = 0;
        }
    }

    public toAPI() {
        return {
            userRef: this.user!.id!,
            chapterRef: this.chapter!.id!,
            watchedTimeInSec: this.watchedTimeInSec,
            rating: this.rating,
            review: this.review,
        };
    }
}