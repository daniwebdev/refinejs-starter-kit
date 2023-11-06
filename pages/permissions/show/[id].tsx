
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show } from "@components/crud/show";
import { Table, TableRow, TableCell, TableHead, TableBody } from '@mui/material'
import { UsersShow } from "@components/users";
import UserList from "..";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IPermission, IRole } from "src/interfaces";
import { authProvider } from "src/authProvider";


const ShowView: React.FC<IResourceComponentsProps> = () => {
  const resourceName = 'permissions';

  const { queryResult } = useShow<IPermission>();
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
    <Show dataProviderName="customDataProvider" isLoading={isLoading} resource={resourceName}>
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
  );
};

export default ShowView



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