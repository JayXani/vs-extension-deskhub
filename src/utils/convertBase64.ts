export const convertBase64 = (fileString: string) => {
    try {
        const fileConverted = Buffer.from(fileString, "base64").toString("utf-8");
        return {
            data: fileConverted
        };
    } catch (e) {
        return {
            error: `ERROR: ${e}`
        };
    }
};