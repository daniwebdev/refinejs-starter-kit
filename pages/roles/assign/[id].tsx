import React from "react";
import { useApiUrl, useCustom, useMany, useNotification } from "@refinedev/core";
import { List, useDataGrid, DateField, Header, Edit } from "@refinedev/mui";
import { DataGrid, GridCallbackDetails, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { IPermission } from "src/interfaces";
import { Box, Button } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { axiosInstance } from "src/utils";


const AssignPermissionToRole = () => {
    const router = useRouter()
    const [rows, setRows] = React.useState<IPermission[]>([])
    const apiURL = useApiUrl()
    const { dataGridProps } = useDataGrid();
    const { open } = useNotification();


    const { data: permissionData, isLoading: permissionsIsLoading } = useCustom({
        url: `${apiURL}/admin/permissions`,
        method: "get"
    })

    const columns = React.useMemo<GridColDef<IPermission>[]>(
        () => [
            {
                field: "id",
                headerName: "Id",
                type: "number",
                minWidth: 50,
            },
            {
                field: "name",
                headerName: "Name",
                minWidth: 250,
            },
            {
                field: "path",
                headerName: "Path",
                valueGetter: ({ row }) => {
                    const value = row?.path;

                    return value;
                },
                minWidth: 300
            },
            {
                field: "actions",
                headerName: "Actions",
                valueGetter: ({ row }) => {
                    const value = row?.actions;

                    return value;
                },
                minWidth: 200
            },
            {
                field: "createdAt",
                headerName: "Created At",
                minWidth: 250,
                renderCell: function render({ value }) {
                    return <DateField value={value} />;
                },
            },
        ],
        [permissionData?.data],
    );

    React.useEffect(() => {
        if(permissionData?.data) {
            setRows(permissionData?.data as IPermission[])
        }
    })

    const onSelectionModelChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails): void => {
        axiosInstance.patch(`/admin/roles/${router.query.id}/assign`, {
            ids: rowSelectionModel,
        }).then(() => {
            open?.({
                type: "success",
                message: "Hey",
                description: "I <3 Refine",
                key: "unique-id",
            });
        }).catch((e) => {
            open?.({
                type: "error",
                message: "Error",
                description: "I <3 Refine",
                key: "unique-id",
            });
        })
    }

    return (
        <>
            <Head>
                <title>Assign Permissions to Role</title>
            </Head>


            <Box display="flex" flexDirection="column" alignItems="center" width={'100%'}>
                <Box display="flex" flexDirection="row" alignItems={'center'} justifyContent='space-between' width={'100%'}>
                    <div>
                        <h1 style={{ margin: 0 }}>
                            Assign Permissions to Role
                        </h1>
                        <p style={{ margin: 0, marginBottom: '1rem' }}>Just checked the box to assign permissions</p>
                    </div>
                    <div>

                    </div>
                </Box>
                <Box width={'100%'}>
                    <DataGrid {...dataGridProps} rows={rows} loading={permissionsIsLoading} checkboxSelection columns={columns} autoHeight onRowSelectionModelChange={onSelectionModelChange} />
                </Box>
            </Box>
        </>
    );
};

export default AssignPermissionToRole;

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