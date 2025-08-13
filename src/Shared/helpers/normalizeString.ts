export function normalizeToUnderscore(text: string): string {
    return text
        .normalize("NFD")                     // separa acento das letras
        .replace(/[\u0300-\u036f]/g, "")      // remove os acentos
        .replace(/\s+/g, "_")                 // troca espaços por _
        .replace(/[^\w]/g, "_")               // troca qualquer caractere não alfanumérico por _
        .replace(/_+/g, "_")                  // substitui múltiplos _ por um só
        .replace(/^_+|_+$/g, "")              // remove _ do início/fim
        .toUpperCase().trim();                       // opcional: tudo maiúsculo
}

export function escapeRegex(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
