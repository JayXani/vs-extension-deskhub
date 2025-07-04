import { IDataRequest } from "../interfaces/IDataRequest";
import { messages } from "../utils/messages";

export const postListMaestro = async (dataRequest: IDataRequest) => {
    try {
        const response = await fetch(dataRequest.url, {
            body: JSON.stringify(dataRequest.bodyList),
            headers: {
                "Content-type": "application/json",
                "Authorization": dataRequest.authorizationToken
            }
        });
        if (!response.ok) { return messages.errors.http_list_maestro_fail; }
    } catch (e) {
        return messages.errors.http_list_maestro_exception.concat(`${e}`);
    }
};