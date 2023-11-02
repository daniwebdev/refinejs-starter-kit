import nookies from "nookies";


export function getAuthToken(key='access_token') {
    try {
        const auth = JSON.parse(nookies.get()["auth"])
        console.log("Access Token: " + auth.tokens.access_token)
        return auth.tokens[key];
    } catch (error) {
        return null;
    }
}