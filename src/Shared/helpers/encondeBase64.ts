export const encodeBase64 = (file: any) => {
    try {
        const bufferFile = Buffer.from(file).toString("base64");
        return {
            data: bufferFile
        };
    } catch (e) {
        return {
            error: `ERROR: ${e}`
        };
    }
};
