export const createContentJsonata = (content: string) => {
    return `
    import jsonata from "jsonata";
                            
    const data = [];
    const run = async () => {
        const expression = jsonata('${content}');
        return await expression.evaluate(data);
        };
        
    run();
    `;
};