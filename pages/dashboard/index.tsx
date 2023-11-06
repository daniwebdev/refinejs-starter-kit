
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    Grid,
    Paper,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";

const Dashboard = () => {
    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
        <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
                <Paper sx={{ p: 2 }}>
                    <Box>
                        {/* Add your dashboard content here */}
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <Paper sx={{ p: 2 }}>
                    <Box>
                        {/* Add your dashboard content here */}
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <Paper sx={{ p: 2 }}>
                    <Box>
                        {/* Add your dashboard content here */}
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    </Container>
    );
};

export default Dashboard;


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