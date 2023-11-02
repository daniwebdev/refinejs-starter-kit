import { AuthBindings, useCustom } from "@refinedev/core";
import nookies from "nookies";
import axios, { AxiosError } from "axios";
import { customDataProvider } from "./dataProvider";


const signIn = async (email: string, password: string)  => {
  const client = axios.create({
    headers: {
      "x-api-key": "sandbox"
    }
  });
const API_URL = "http://localhost:8611";
  return client.post(API_URL + "/auth/login", {
    "identity": email,
    "password": password,
    "device": {
      "id": "we7r12i",
      "name": "Iphone 14 Pro Max",
      "brand": "Apple",
      "os": "iOS 17"
    }
  }).then(res => res.data.data)
}

export const authProvider: AuthBindings = {
  login: async ({ email, username, password, remember }) => {
    // Suppose we actually send a request to the back end here.
    let user = null;

    try {
      user = (await signIn(email, password));

    } catch (error) {
      
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Invalid username or password",
        },
      }
    }

    const userData = {
      ...user.user,
      tokens: user.tokens,
    }

    console.log(userData);

    if (user) {
      nookies.set(null, "auth", JSON.stringify(userData), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      return {
        success: true,
        redirectTo: "/users",
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    nookies.destroy(null, "auth");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async (ctx: any) => {
    const cookies = nookies.get(ctx);
    if (cookies["auth"]) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const auth = nookies.get()["auth"];
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser.roles;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = nookies.get()["auth"];
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser;
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
