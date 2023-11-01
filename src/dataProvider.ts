/* 
    CUSTOM DATA PROVIDER
*/

import { DataProvider } from "@refinedev/core";
import { BaseRecord, CreateManyParams, CreateManyResponse, CreateParams, CreateResponse, CrudFilters, CustomParams, CustomResponse, DeleteManyParams, DeleteManyResponse, DeleteOneParams, DeleteOneResponse, GetListParams, GetListResponse, GetManyParams, GetManyResponse, GetOneParams, GetOneResponse, HttpError, IDataContextProvider, UpdateManyParams, UpdateManyResponse, UpdateParams, UpdateResponse } from "@refinedev/core/dist/interfaces";
import { stringify } from "query-string";
import axios, { AxiosError } from "axios";
import React from "react";
import { mapOperator } from "@refinedev/simple-rest";


const generateFilters = (filters?: CrudFilters) => {
    const queryFilters: { [key: string]: string } = {};

    filters?.map((filter): void => {
    if ("field" in filter) {
        const { field, operator, value } = filter;
        const mappedOperator = mapOperator(operator);
        queryFilters[`${field}${mappedOperator}`] = value;
    }
    });

    return queryFilters;
};

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

    create: async ({ resource, variables, meta }) => {
        // const url = `${apiUrl}/${resource}`;
        try {
            const url = `${apiUrl}/${meta?.api}`;

            const { data } = await axiosInstance.post(url, variables);
            
    
            return {
                data,
            };
        } catch (error) {
            
            const err = error as AxiosError
            const response = err.response ?? undefined;

            if(response == undefined) {
                return {
                    data: {}
                };
            }

            let message = "";
    
            for(let m of response.data.error ?? []) {
                message += m + "\n";
            }
            
            const e: HttpError = {
                message: message.trim(),
                statusCode: response.status,
            };
            return Promise.reject(e);
        }
    },

    update: async ({ resource, id, variables, meta }) => {
        // const url = `${apiUrl}/${resource}/${id}`;
        const url = `${apiUrl}/${meta?.api}/${id}`;


        const { data } = await axiosInstance.patch(url, variables);

        return {
            data,
        };
    },

    deleteOne: async ({ resource, id, variables, meta }) => {
        // const url = `${apiUrl}/${resource}/${id}`;
        const url = `${apiUrl}/${meta?.api}/${id}`;

        const { data } = await axiosInstance.delete(url, {
            data: variables,
        });

        return {
            data,
        };
    },

    getOne: async ({ resource, id, meta }) => {
        // const url = `${apiUrl}/${resource}/${id}`;
        if(id == undefined) return {
            data: {}
        };
        
        const url = `${apiUrl}/${meta?.api}/${id}`;

        const { data } = await axiosInstance.get(url);

        return {
            data,
        };
    },

    getApiUrl: () => apiUrl,

    custom: async ({
        url,
        method,
        filters,
        sorters,
        payload,
        query,
        headers,
    }) => {
        let requestUrl = `${url}?`;

        if (sorters && sorters.length > 0) {
            const sortQuery = {
                _sort: sorters[0].field,
                _order: sorters[0].order,
            };
            requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
        }

        if (filters) {
            const filterQuery = generateFilters(filters);
            requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
        }

        if (query) {
            requestUrl = `${requestUrl}&${stringify(query)}`;
        }

        let axiosResponse;
        switch (method) {
            case "put":
            case "post":
            case "patch":
                axiosResponse = await axiosInstance[method](url, payload, {
                    headers,
                });
                break;
            case "delete":
                axiosResponse = await axiosInstance.delete(url, {
                    data: payload,
                    headers: headers,
                });
                break;
            default:
                axiosResponse = await axiosInstance.get(requestUrl, {
                    headers,
                });
                break;
        }

        const { data } = axiosResponse;

        return { data };
    },
});