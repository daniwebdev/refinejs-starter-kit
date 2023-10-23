import { Button, ButtonGroup, Typography } from "@mui/material";
import { useMany, useTable, useTranslate } from "@refinedev/core";
import { Breadcrumb, DateField, DeleteButton, EditButton, List, MarkdownField, ShowButton, Title, useDataGrid } from "@refinedev/mui";
import Link from "next/link";
import React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type IUser = {
    id: string;
    name: string;
    email: string;
};

export default function UserList() {
    const t = useTranslate();

    const { dataGridProps } = useDataGrid();

    const { data: userData, isLoading: categoryIsLoading } = useMany({
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
                field: "email",
                headerName: "Email",
                minWidth: 200,
            },
            {
                field: "updated_at",
                headerName: "Updated At",
                minWidth: 250,
                renderCell: function render({ value }) {
                    return <DateField value={value} />;
                },
            },
            {
                field: "created_at",
                headerName: "Created At",
                minWidth: 250,
                renderCell: function render({ value }) {
                    return <DateField value={value} />;
                },
            },
            {
                field: "actions",
                headerName: "Actions",
                renderCell: function render ({value, row}) {
                    return <ShowButton recordItemId={row.id}>{t('buttons.show')}</ShowButton>
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