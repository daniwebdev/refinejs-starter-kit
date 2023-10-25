import { Stack } from "@mui/material";
import { useMany, useTable, useTranslate } from "@refinedev/core";
import { DateField, EditButton, List, ShowButton, useDataGrid } from "@refinedev/mui";
import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IUser } from "src/interfaces";

export default function UserList() {
    const t = useTranslate();
    const resourceName = 'roles';

    const { dataGridProps } = useDataGrid();


    const { data: listData } = useMany({
        resource: resourceName,
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
                type: "string",
                minWidth: 120,
            },
            {
                field: "description",
                headerName: "Description",
                type: "string",
                minWidth: 120,
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
        [listData?.data],
    );

    const {
        tableQueryResult: { data, isLoading },
    } = useTable<IUser>();


    const tableData = data?.data;

    return (
        <List 
        createButtonProps={{ size: "small" }}
        resource={resourceName} title={<div>
            <h2 style={{ margin: '0px', }}>{t('roles.titles.list')}</h2>
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