
import { HttpError, IResourceComponentsProps, useSelect, useShow } from "@refinedev/core";
import { Show } from "@components/crud/show";
import { Table, TableRow, TableCell, TableHead, TableBody, Autocomplete, Box, TextField, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Select, MenuItem } from '@mui/material'
import { UsersShow } from "@components/users";
import UserList from "..";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Edit } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";
import { IRole, IUser, Nullable } from "src/interfaces";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import React from "react";


const UserEdit: React.FC<IResourceComponentsProps> = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult },
    register,
    control,
    formState: { errors },
} = useForm<IUser, HttpError, Nullable<IUser>>();

const { options } = useSelect<IRole>({
    resource: "roles",
    optionLabel: 'name',
    optionValue: 'id',
});

const [roleId, setRoleId] = React.useState<number>(() => 0);


const [showPassword, setShowPassword] = React.useState(false);
const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

const handleClickShowPassword = () => setShowPassword((show) => !show);
const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
};
const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
};

React.useEffect(() => {
    setRoleId(queryResult?.data?.data?.role_id ?? 0);
}, [queryResult?.data?.data?.role_id])

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
                id="username"
                {...register("username", {
                    required: "This field is required",
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                margin="normal"
                fullWidth
                label="Username"
                name="username"
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

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FormControl variant="outlined"  sx={{ mt: 2, width: '100%' }} >
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            error={!!errors.password}
                            // {...register("password", {
                            //     required: "This field is required",
                            // })}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            name="password"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl variant="outlined"  sx={{ mt: 2, width: '100%' }} >
                        <InputLabel htmlFor="password">Confirm Password</InputLabel>
                        <OutlinedInput
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            error={!!errors.confirmPassword}
                            // {...register("confirmPassword", {
                            //     required: "This field is required",
                            // })}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle Confirm Password visibility"
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownConfirmPassword}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Confirm Password"
                            name="confirmPassword"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel id="user-role_id-label">Choose Role</InputLabel>
                        <Select
                            labelId="user-role_id-label"
                            id="user-role_id"
                            label="Role"
                            {...register("role_id", {
                                required: "This field is required",
                            })}
                            value={roleId}
                        >
                            {
                                options.map((option) => (
                                    <MenuItem value={option.value}>{option.label}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
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