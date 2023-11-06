type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    role_id: number;
    confirmPassword: string;
};

type IRole = {
    id: string;
    name: string;
    key: string;
    description: string;
}

type IPermission = {
    id: string;
    name: string;
    path: string;
    actions: string[];
    description: string;
}

export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
