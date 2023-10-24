
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


const UserEdit: React.FC<IResourceComponentsProps> = () => {
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
            {/* <Controller
                control={control}
                name="status"
                rules={{ required: "This field is required" }}
                // eslint-disable-next-line
                defaultValue={null as any}
                render={({ field }) => (
                    <Autocomplete<IStatus>
                        id="status"
                        {...field}
                        options={["published", "draft", "rejected"]}
                        onChange={(_, value) => {
                            field.onChange(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Status"
                                margin="normal"
                                variant="outlined"
                                error={!!errors.status}
                                helperText={errors.status?.message}
                                required
                            />
                        )}
                    />
                )}
            />
            <Controller
                control={control}
                name="category"
                rules={{ required: "This field is required" }}
                // eslint-disable-next-line
                defaultValue={null as any}
                render={({ field }) => (
                    <Autocomplete<ICategory>
                        id="category"
                        {...autocompleteProps}
                        {...field}
                        onChange={(_, value) => {
                            field.onChange(value);
                        }}
                        getOptionLabel={(item) => {
                            return (
                                autocompleteProps?.options?.find(
                                    (p) =>
                                        p?.id?.toString() ===
                                        item?.id?.toString(),
                                )?.title ?? ""
                            );
                        }}
                        isOptionEqualToValue={(option, value) =>
                            value === undefined ||
                            option?.id?.toString() ===
                                (value?.id ?? value)?.toString()
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Category"
                                margin="normal"
                                variant="outlined"
                                error={!!errors.category}
                                helperText={errors.category?.message}
                                required
                            />
                        )}
                    />
                )}
            />
            <TextField
                id="content"
                {...register("content", {
                    required: "This field is required",
                })}
                error={!!errors.content}
                helperText={errors.content?.message}
                margin="normal"
                label="Content"
                multiline
                rows={4}
            /> */}
        </Box>
    </Edit>
);
};

export default UserEdit



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