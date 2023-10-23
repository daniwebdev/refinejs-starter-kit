import { DataProvider } from "@refinedev/core";
import { BaseRecord, CreateManyParams, CreateManyResponse, CreateParams, CreateResponse, CustomParams, CustomResponse, DeleteManyParams, DeleteManyResponse, DeleteOneParams, DeleteOneResponse, GetListParams, GetListResponse, GetManyParams, GetManyResponse, GetOneParams, GetOneResponse, HttpError, IDataContextProvider, UpdateManyParams, UpdateManyResponse, UpdateParams, UpdateResponse } from "@refinedev/core/dist/interfaces";
import { stringify } from "query-string";
import axios from "axios";

// Error handling with axios interceptors
const axiosInstance = axios.create({
    headers: {
        "x-api-key": "sandbox"
    }
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const customError: HttpError = {
            ...error,
            message: error.response?.data?.message,
            statusCode: error.response?.status,
        };

        return Promise.reject(customError);
    },
);

// https://refine.dev/docs/tutorial/understanding-dataprovider/create-dataprovider/#getlist

export const customDataProvider = (apiUrl: string): DataProvider => ({
    getList: async ({ resource, pagination, meta }: GetListParams) => {
        const url = `${apiUrl}/${meta?.api}`;

        const { current = 1, pageSize = 10 } = pagination ?? {};

        const query: {
            _start?: number;
            _end?: number;
        } = {
            _start: (current - 1) * pageSize,
            _end: current * pageSize,
        };

        const { data, headers } = await axiosInstance.get(
            `${url}?${stringify(query)}`,
        );

        const total = +headers["x-total-count"];

        return {
            data,
            total,
        };
    },

    create: async ({ resource, variables }) => {
        const url = `${apiUrl}/${resource}`;

        const { data } = await axiosInstance.post(url, variables);

        return {
            data,
        };
    },

    update: async ({ resource, id, variables }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await axiosInstance.patch(url, variables);

        return {
            data,
        };
    },

    deleteOne: async ({ resource, id, variables }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await axiosInstance.delete(url, {
            data: variables,
        });

        return {
            data,
        };
    },

    getOne: async ({ resource, id, meta }) => {
        // const url = `${apiUrl}/${resource}/${id}`;
        const url = `${apiUrl}/${meta?.api}/${id}`;

        const { data } = await axiosInstance.get(url);

        return {
            data,
        };
    },

    getApiUrl: () => apiUrl,

});