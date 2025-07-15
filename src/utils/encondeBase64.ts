export const encodeBase64 = (fileString: any) => {
    try {
        const jsonEncoded = JSON.stringify(fileString);
        return {
            data: btoa(jsonEncoded) // Converte o objeto novamente para base64
        };
    } catch (e) {
        return {
            error: `ERROR: ${e}`
        };
    }
};