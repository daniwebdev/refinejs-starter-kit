import { Stack } from "@mui/material";
import { useMany, useTable, useTranslate } from "@refinedev/core";
import { DateField, EditButton, List, ShowButton, useDataGrid } from "@refinedev/mui";
import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IUser } from "src/interfaces";
import { authProvider } from "src/authProvider";

export default function UserList() {
    const t = useTranslate();

    const { dataGridProps } = useDataGrid();


    const { data: userData } = useMany({
        resource: "users",
        ids: dataGridProps?.rows?.map((item: any) => item?.category?.id) ?? [],
        queryOptions: {
            enabled: !!dataGridProps?.rows,
        },
    });


    const columns = React.useMemo<GridColDef<any>[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                type: "number",
                minWidth: 50,
            },
            {
                field: "name",
                headerName: "Name",
                minWidth: 200,
            },
            {
                field: "username",
                headerName: "Username",
                minWidth: 200,
            },
            {
                field: "email",
                headerName: "Email",
                minWidth: 250,
            },
            {
                field: "updated_at",
                headerName: "Updated At",
                minWidth: 200,
                renderCell: function render({ value }) {
                    return <DateField value={value} />;
                },
            },
            {
                field: "created_at",
                headerName: "Created At",
                minWidth: 200,
                renderCell: function render({ value }) {
                    return <DateField value={value} />;
                },
            },
            {
                field: "actions",
                headerName: "Actions",
                disableColumnMenu: true,
                // width: 200,
                renderCell: function render ({value, row}) {
                    return (
                        <Stack direction={'row'}>
                            <ShowButton hideText recordItemId={row.id}>{t('buttons.show')}</ShowButton>
                            <EditButton hideText recordItemId={row.id}>{t('buttons.edit')}</EditButton>
                        </Stack>
                    )
                }
            }
        ],
        [userData?.data],
    );

    const {
        tableQueryResult: { data, isLoading },
    } = useTable<IUser>();


    const tableData = data?.data;

    return (
        <List 
        createButtonProps={{ size: "small" }}
        resource="users" title={<div>
            <h2 style={{ margin: '0px', }}>{t('users.users')}</h2>
            <p style={{ margin: '0', fontSize: '1rem' }}>Lorem ipsum dolor sit amet.</p>
        </div>}>
            <DataGrid {...dataGridProps} columns={columns} autoHeight />
        </List>
    );
}


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