type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type IRole = {
    id: string;
    name: string;
    key: string;
    description: string;
}

export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
