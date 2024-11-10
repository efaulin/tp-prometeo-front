//Esto simula crear un token con JWT
export const fakeToken = () => {
    const payload = {
        userId: "1",
        username: "admin",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour expiration
    };
    // Para simular la creación de un JWT, puedes convertir el payload a Base64
    return btoa(JSON.stringify(payload));
};