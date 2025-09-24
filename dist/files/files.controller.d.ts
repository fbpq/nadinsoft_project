import { FilesService } from './files.service';
import { Response } from 'express';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    downloadTaskAttachment(id: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
