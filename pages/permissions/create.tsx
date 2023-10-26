
import { HttpError, IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show } from "@components/crud/show";
import { Box, TextField, Grid, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Create } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";
import { IPermission, Nullable } from "src/interfaces";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import React from "react";


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
                    <Grid item xs={6}>
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
                            name="path"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                <TextField
                    id="description"
                    {...register("description", {
                        required: "This field is required",
                    })}
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