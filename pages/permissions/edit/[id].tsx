
import { HttpError, IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show } from "@components/crud/show";
import { Table, TableRow, TableCell, TableHead, TableBody, Autocomplete, Box, TextField } from '@mui/material'
import { UsersShow } from "@components/users";
import UserList from "..";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Edit } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";
import { IUser, Nullable } from "src/interfaces";


const EditForm: React.FC<IResourceComponentsProps> = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult },
    register,
    control,
    formState: { errors },
} = useForm<IUser, HttpError, Nullable<IUser>>();

return (
    <Edit saveButtonProps={saveButtonProps}>
        <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column" }}
            autoComplete="off"
        >
            <TextField
                id="name"
                {...register("name", {
                    required: "This field is required",
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                margin="normal"
                fullWidth
                label="Name"
                name="name"
                autoFocus
            />
            <TextField
                id="email"
                {...register("email", {
                    required: "This field is required",
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                margin="normal"
                fullWidth
                label="Email"
                name="email"
            />
        </Box>
    </Edit>
);
};

export default EditForm



export const getServerSideProps: GetServerSideProps = async (context) => {
  const translateProps = await serverSideTranslations(
      context.locale ?? "en",
      ["common"],
  );

  return {
      props: {
          ...translateProps,
      },
  };
};