export function typeTextContent(
    content: string,
    callback: (char: string) => void,
    delay: number,
    onComplete?: () => void // Callback opcional
) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < content.length) {
            callback(content.charAt(i));
            i++;
        } else {
            clearInterval(interval);
            if (onComplete) {
                onComplete(); // Ejecutar el callback opcional al finalizar
            }
        }
    }, delay);
}
