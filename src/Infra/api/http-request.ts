import { MaestroHTTPError } from "../../Domain/errors/MaestroHTTPError";
import { ErrorCodes } from "../../Shared/constants/ErrorCodes";
import { messagesV2 } from "../../Shared/constants/messages-v2";

export const apiDeskManager = async (
    endpoint: string,
    body: any,
    authorization: string,
    contentType: string = "application/json",
    method: string = "POST",
    url: string = "https://api.desk.ms"
) => {

    // Corrige possíveis barras duplicadas
    url = url.replace(/\/$/, '');
    endpoint = endpoint.replace(/^\//, '');

    const fullUrl = `${url}/${endpoint}`;
    const response = await fetch(fullUrl, {
        body: typeof body === "string" ? body : JSON.stringify(body),
        headers: {
            "Content-type": contentType,
            "Authorization": authorization
        },
        method: method
    });

    if (!response.ok) { throw new MaestroHTTPError(messagesV2.errors[ErrorCodes.MAESTRO_HTTP_ERROR]); }
    let dataResponse = await response.text();
    try {
        const jsonMatch = dataResponse.match(/^\{.*\}/g);
        if (jsonMatch) { return JSON.parse(jsonMatch[0]); }
    } catch (e) { }
    return dataResponse;
};
