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

    static async Update(obj:Chapter): Promise<Chapter> {
        const response = await axiosInstance.put(`/chapter/${obj.id!}`, obj.toAPI());
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