import { GitHubBanner, Refine, useCustom } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  RefineSnackbarProvider,
  ThemedLayoutV2,
  notificationProvider,
} from "@refinedev/mui";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/nextjs-router";
import type { NextPage } from "next";
import { AppProps } from "next/app";
import nookies from "nookies";

import { Header } from "@components/header";
import { ColorModeContextProvider } from "@contexts";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import dataProvider from "@refinedev/simple-rest";
import { appWithTranslation, useTranslation } from "next-i18next";
import { authProvider } from "src/authProvider";
import { customDataProvider } from "src/dataProvider";
import { StringAdapter, newEnforcer } from "casbin";
import { model, adapter } from "src/accessControl";
import { API_URL, axiosInstance } from "src/utils/axios";


// const API_URL = "http://localhost:8611";
// const API_URL = "https://api.fake-rest.refine.dev";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  let currentRole = "admin";
  let permissionAdapter: any = null;

  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    return (
      <ThemedLayoutV2 Header={() => <Header sticky />}>
        <Component {...pageProps} />
      </ThemedLayoutV2>
    );
  };

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return <>
    {/* <GitHubBanner /> */}
    <RefineKbarProvider>
      <ColorModeContextProvider>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineSnackbarProvider>
          <DevtoolsProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={customDataProvider(API_URL)}
              notificationProvider={notificationProvider}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              accessControlProvider={{
                can: async ({ action, params, resource }) => {
                    if(permissionAdapter == null) {
                      const { data } = (await axiosInstance.get('/misc/permissions'));

                      if(data.role != undefined) {
                        permissionAdapter = data.casbin_permission_adapter.trim()
                        currentRole = data.role
                      } else {
                        permissionAdapter = data.trim()
                        currentRole = 'admin'
                      }
                    }
                    

                    const enforcer = await newEnforcer(
                        model,
                        // adapter,
                        new StringAdapter(permissionAdapter),
                    );
                    
                    if (
                        action === "delete" ||
                        action === "edit" ||
                        action === "show"
                    ) {
                        return Promise.resolve({
                            can: await enforcer.enforce(
                                currentRole,
                                `${resource}/${params?.id}`,
                                action,
                            ),
                        });
                    }
                    if (action === "field") {
                        return Promise.resolve({
                            can: await enforcer.enforce(
                                currentRole,
                                `${resource}/${params?.field}`,
                                action,
                            ),
                        });
                    }
                    return {
                        can: await enforcer.enforce(
                            currentRole,
                            resource,
                            action,
                        ),
                    };
                },
              }}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "flNgGT-n3Xi9y-tuG8vb",
              }}
              resources={[
                {
                  name: "users",
                  list: "/users",
                  create: "/users/create",
                  edit: "/users/edit/:id",
                  show: "/users/show/:id",
                  meta: {
                    api: 'admin/users',
                    canDelete: true,
                    icon: <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.55 11.5C8.30736 11.5 7.3 10.4926 7.3 9.25C7.3 8.00736 8.30736 7 9.55 7C10.7926 7 11.8 8.00736 11.8 9.25C11.8 10.4926 10.7926 11.5 9.55 11.5ZM10 19.748V16.4C10 15.9116 10.1442 15.4627 10.4041 15.0624C10.1087 15.0213 9.80681 15 9.5 15C7.93201 15 6.49369 15.5552 5.37091 16.4797C6.44909 18.0721 8.08593 19.2553 10 19.748ZM4.45286 14.66C5.86432 13.6168 7.61013 13 9.5 13C10.5435 13 11.5431 13.188 12.4667 13.5321C13.3447 13.1888 14.3924 13 15.5 13C17.1597 13 18.6849 13.4239 19.706 14.1563C19.8976 13.4703 20 12.7471 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 12.9325 4.15956 13.8278 4.45286 14.66ZM18.8794 16.0859C18.4862 15.5526 17.1708 15 15.5 15C13.4939 15 12 15.7967 12 16.4V20C14.9255 20 17.4843 18.4296 18.8794 16.0859ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM15.5 12.5C14.3954 12.5 13.5 11.6046 13.5 10.5C13.5 9.39543 14.3954 8.5 15.5 8.5C16.6046 8.5 17.5 9.39543 17.5 10.5C17.5 11.6046 16.6046 12.5 15.5 12.5Z"></path></svg></>
                  }
                },
                {
                  name: "access_control",
                  meta: {
                    icon: <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 4.60434V13.7889C5 15.1263 5.6684 16.3752 6.7812 17.1171L12 20.5963L17.2188 17.1171C18.3316 16.3752 19 15.1263 19 13.7889V4.60434L12 3.04879L5 4.60434ZM3.78307 2.82598L12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598ZM12 13.5L9.06107 15.0451L9.62236 11.7725L7.24472 9.45492L10.5305 8.97746L12 6L13.4695 8.97746L16.7553 9.45492L14.3776 11.7725L14.9389 15.0451L12 13.5Z"></path></svg></>
                  }
                },
                {
                  name: "roles",
                  list: "/roles",
                  create: "/roles/create",
                  edit: "/roles/edit/:id",
                  show: "/roles/show/:id",
                  meta: {
                    api: 'admin/roles',
                    canDelete: true,
                    parent: "access_control",
                    icon: <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 18H21V6H3V18ZM1 5C1 4.44772 1.44772 4 2 4H22C22.5523 4 23 4.44772 23 5V19C23 19.5523 22.5523 20 22 20H2C1.44772 20 1 19.5523 1 19V5ZM9 10C9 9.44772 8.55228 9 8 9C7.44772 9 7 9.44772 7 10C7 10.5523 7.44772 11 8 11C8.55228 11 9 10.5523 9 10ZM11 10C11 11.6569 9.65685 13 8 13C6.34315 13 5 11.6569 5 10C5 8.34315 6.34315 7 8 7C9.65685 7 11 8.34315 11 10ZM8.0018 16C7.03503 16 6.1614 16.3907 5.52693 17.0251L4.11272 15.6109C5.10693 14.6167 6.4833 14 8.0018 14C9.52031 14 10.8967 14.6167 11.8909 15.6109L10.4767 17.0251C9.84221 16.3907 8.96858 16 8.0018 16ZM16.2071 14.7071L20.2071 10.7071L18.7929 9.29289L15.5 12.5858L13.7071 10.7929L12.2929 12.2071L14.7929 14.7071L15.5 15.4142L16.2071 14.7071Z"></path></svg></>
                  }
                },
                {
                  name: "permissions",
                  list: "/permissions",
                  create: "/permissions/create",
                  edit: "/permissions/edit/:id",
                  show: "/permissions/show/:id",
                  meta: {
                    api: 'admin/permissions',
                    canDelete: true,
                    parent: "access_control",
                    icon: <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598L12 1ZM12 3.04879L5 4.60434V13.7889C5 15.1263 5.6684 16.3752 6.7812 17.1171L12 20.5963L17.2188 17.1171C18.3316 16.3752 19 15.1263 19 13.7889V4.60434L12 3.04879ZM12 7C13.1046 7 14 7.89543 14 9C14 9.73984 13.5983 10.3858 13.0011 10.7318L13 15H11L10.9999 10.7324C10.4022 10.3866 10 9.74025 10 9C10 7.89543 10.8954 7 12 7Z"></path></svg></>
                  }
                },
              ]}>
              {renderComponent()}
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </RefineSnackbarProvider>
      </ColorModeContextProvider>
    </RefineKbarProvider>
  </>;
}

export default appWithTranslation(MyApp);
