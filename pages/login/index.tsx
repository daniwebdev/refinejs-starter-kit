import { AuthPage } from "@refinedev/mui";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { authProvider } from "src/authProvider";

export default function Login() {
  return (
    <>
      <Head>
        <title>Login | Starter Kit</title>
      </Head>
      <AuthPage
        type="login"
        formProps={{
          // defaultValues: { email: "demo@refine.dev", password: "demodemo" },
        }}
      />
    </>
  );
}

Login.noLayout = true;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (authenticated) {
    return {
      props: {},
      redirect: {
        destination: redirectTo ?? "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};
