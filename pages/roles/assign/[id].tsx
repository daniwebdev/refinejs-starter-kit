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
    const apiURL = useApiUrl()

    const { dataGridProps } = useDataGrid();
    const { open } = useNotification();

    const [rows, setRows] = React.useState<IPermission[]>([])
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const [isInitialize, setIsInitialize] = React.useState<boolean>(() => false);

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
    
        console.log('test')
        
        if(!isInitialize) {
            axiosInstance.get(`admin/roles/${router.query.id}/permissions`).then(async (response) => {
                console.log(response.data.map((item: any) => item.permission.id))
                if(response.data.length) {
                    setRowSelectionModel(response.data.map((item: any) => item.permission.id) as GridRowSelectionModel);
                    // rowSelectionModel.push(...response.data.map((item: any) => item.permission.id))
                }
                setIsInitialize(true);
                console.log('k')
            });
        }

        // setRowSelectionModel([] as GridRowSelectionModel);

    }, [permissionData]);

    React.useEffect(() => {

        if(isInitialize) {
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
    }, [rowSelectionModel]);


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
                    <DataGrid 
                    rows={rows} 
                    checkboxSelection
                    rowSelectionModel={rowSelectionModel} 
                    loading={!isInitialize}
                    columns={columns} 
                    autoHeight 
                    onRowSelectionModelChange={setRowSelectionModel}
                     />
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