type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
