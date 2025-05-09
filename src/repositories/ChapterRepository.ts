import { Chapter, ChapterInterface } from "../entities/chapterEntity";
import { Replay, ReplayInterface } from "../entities/replayEntity";
import axiosInstance from "../utils/axiosInstance";

export class ChapterRepository {
    static async GetAll(): Promise<Chapter[]> {
        const response = await axiosInstance.get('/chapter');
        return (response.data as ChapterInterface[]).map(obj => new Chapter(obj));
    }

    static async Create(obj:Chapter): Promise<Chapter> {
        const response = await axiosInstance.post(`/chapter`, obj.toAPI());
        return (new Chapter(response.data));
    }

    static async Update(obj:Partial<Chapter>): Promise<Chapter> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateFilds: any = {};
        if (obj.name) updateFilds.name = obj.name;
        if (obj.collectionId) updateFilds.collectionRef = obj.collectionId;
        if (obj.description) updateFilds.description = obj.description;
        if (obj.publicationDate) updateFilds.publicationDate = obj.publicationDate.toISOString();
        if (obj.languageRef) updateFilds.languageRef = obj.languageRef!.id!;
        if (obj.authorsRef || obj.narratorRef) {
            //Audiolibro -> Authors & Narrator
            if (obj.authorsRef) updateFilds.authorsRef = obj.authorsRef.map(ath => ath.id!);
            if (obj.narratorRef) updateFilds.narratorRef = obj.narratorRef.id!;
        } else {
            //Podcast -> Hosts
            if (obj.hostsRef) updateFilds.hostsRef = obj.hostsRef.map(hst => hst.id!);
        }
        
        const response = await axiosInstance.put(`/chapter/${obj.id!}`, updateFilds);
        return (new Chapter(response.data));
    }

    static async Delete(id:string): Promise<boolean> {
        return (await axiosInstance.delete(`/chapter/${id}`));
    }

    static async GetAllReplays(id:string): Promise<Replay[]> {
        const response = await axiosInstance.get(`/chapter/${id}/replays`);
        return (response.data as ReplayInterface[]).map(obj => new Replay(obj));
    }
}