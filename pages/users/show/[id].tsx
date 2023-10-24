
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show } from "@components/crud/show";
import { Table, TableRow, TableCell, TableHead, TableBody } from '@mui/material'
import { UsersShow } from "@components/users";
import UserList from "..";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export interface IUser {
  id: string;
  name: string;
  email: string;
}

const UserShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<IUser>();
  const { data, isLoading } = queryResult;
  const record: any = data?.data;
  const fields = [];

  for(let r in record) {
    fields.push(
      <TableRow>
        <TableCell>{r}</TableCell>
        <TableCell>{record[r] ?? '0'}</TableCell>
      </TableRow>
    );
  }
  
  return (
    <Show dataProviderName="customDataProvider" isLoading={isLoading} resource="users">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>

        
        <TableBody>
          {fields}
        </TableBody>
      </Table>
    </Show>
    // <Show isLoading={isLoading}>
      
    // </Show>
  );
};

export default UserShow



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