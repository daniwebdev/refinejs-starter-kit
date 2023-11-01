import React from "react";
import { useApiUrl, useCustom, useMany } from "@refinedev/core";
import { List, useDataGrid, DateField } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { IPermission } from "src/interfaces";

const AssignPermissionToRole = () => {
    const [rows, setRows] = React.useState<IPermission[]>([])
    const apiURL = useApiUrl()
    const { dataGridProps } = useDataGrid();

    const { data: permissionData, isLoading: permissionsIsLoading } = useCustom({
        url: `${apiURL}/admin/permissions`,
        method: "get"
    })

    console.log(permissionData)

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
                minWidth: 200,
            },
            {
                field: "path",
                headerName: "Path",
                valueGetter: ({ row }) => {
                    const value = row?.id;

                    return value;
                },
                minWidth: 300
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

    return (
        <List>
            <DataGrid {...dataGridProps} rows={rows} loading={permissionsIsLoading} columns={columns} autoHeight />
        </List>
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