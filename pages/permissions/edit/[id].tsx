
import { HttpError, IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show } from "@components/crud/show";
import { Table, TableRow, TableCell, TableHead, TableBody, Autocomplete, Box, TextField, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectProps } from '@mui/material'
import { UsersShow } from "@components/users";
import UserList from "..";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Edit } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";
import { IPermission, IUser, Nullable } from "src/interfaces";
import { authProvider } from "src/authProvider";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const EditForm: React.FC<IResourceComponentsProps> = () => {
const {
    saveButtonProps,
    refineCore: { queryResult },
    register,
    control,
    formState: { errors, isLoading },
} = useForm<IPermission, HttpError, Nullable<IPermission>>();

const postData = queryResult?.data?.data;

return (
    <Edit saveButtonProps={saveButtonProps} isLoading={isLoading}>
        <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column" }}
            autoComplete="off"
        >
                <Grid container spacing={3}>
                    <Grid item md={4}>
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
                    </Grid>
                    <Grid item md={4}>
                        <TextField
                            id="key"
                            {...register("path", {
                                required: "This field is required",
                            })}
                            error={!!errors.path}
                            helperText={errors.path?.message}
                            margin="normal"
                            fullWidth
                            label="Path"
                            name="path"
                        />
                    </Grid>
                    <Grid item md={4}>
                        <FormControl sx={{ mt: 2, width: '100%' }}>
                            <InputLabel id="actions">Actions</InputLabel>
                            <Select
                                {...register("actions")}
                                value={postData?.actions ?? []}
                                placeholder="Actions"
                                multiple
                                name="actions[]"
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            >
                                <MenuItem key={'list'} value={'list'} >List</MenuItem>
                                <MenuItem key={'blank'} value={'blank'} >Blank</MenuItem>
                                <MenuItem key={'show'} value={'show'} >Show</MenuItem>
                                <MenuItem key={'create'} value={'create'} >Create</MenuItem>
                                <MenuItem key={'update'} value={'update'} >Update</MenuItem>
                                <MenuItem key={'delete'} value={'delete'} >Delete</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <TextField
                    id="description"
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    margin="normal"
                    fullWidth
                    label="Description"
                    name="description"
                    autoComplete="off"
                />
        </Box>
    </Edit>
);
};

export default EditForm



export const getServerSideProps: GetServerSideProps = async (context) => {
    const { authenticated, redirectTo } = await authProvider.check(context);

    if (!authenticated) {
        return {
            props: {},
            redirect: {
                destination: redirectTo ?? '/login',
                permanent: false,
            },
        };
    }
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