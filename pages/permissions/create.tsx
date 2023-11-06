
import { HttpError, IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show } from "@components/crud/show";
import { Box, TextField, Grid, Select, MenuItem, FormControl, InputLabel, OutlinedInput } from '@mui/material'
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Create } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";
import { IPermission, Nullable } from "src/interfaces";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import React from "react";
import { authProvider } from "src/authProvider";

const actions = [
    'Create',
    'List',
    'Update',
    'Delete',
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
};

const FormCreate: React.FC<IResourceComponentsProps> = () => {
    const resourceName = 'permissions';

    const {
        saveButtonProps,
        refineCore: { queryResult },
        register,
        control,
        formState: { errors },
    } = useForm<IPermission, HttpError, Nullable<IPermission>>();


    return (
        <Create saveButtonProps={saveButtonProps}>
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
                            autoFocus
                        />
                    </Grid>
                    <Grid item md={4}>
                        <FormControl sx={{ mt: 2, width: '100%' }}>
                            <InputLabel id="actions">Actions</InputLabel>
                            <Select
                                {...register("actions")}
                                defaultValue={[]}
                                placeholder="Enter Car Brand"
                                multiple
                                name="actions[]"
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            >
                                <MenuItem key={'list'} value={'list'} >List</MenuItem>
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
        </Create>
    );
};

export default FormCreate



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