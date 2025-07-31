import { IMaestroResponse } from '../interfaces/IMaestroRequests';
import { recursiveSearch } from './recursiveSearch';


export const builderMaestroJSON = (maestro: IMaestroResponse, basePath: string) => {
    console.log(basePath);
    //const maestroPath = recursiveSearch(basePath, String(maestro.TMaestro.Chave));
    //console.log(maestroPath);
    return {};
};
