import { messages } from "../utils/messages";

export const apiDeskManager = async (
    endpoint: string,
    body: any,
    authorization: string,
    contentType: string = "application/json",
    method: string = "POST",
    url: string = "https://api.desk.ms"
) => {
    try {
        // Corrige possíveis barras duplicadas
        url = url.replace(/\/$/, '');
        endpoint = endpoint.replace(/^\//, '');

        const fullUrl = `${url}/${endpoint}`;

        const response = await fetch(fullUrl, {
            body: JSON.stringify(body),
            headers: {
                "Content-type": contentType,
                "Authorization": authorization
            },
            method: method
        });

        if (!response.ok) {
            return messages.errors.http_list_maestro_fail;
        }
        const dataResponse = await response.json();
        return dataResponse;

    } catch (e) {
        return {
            erro: messages.errors.http_list_maestro_exception.concat(`${e}`)
        };
    }
};
