import { Box, Paper, Typography, Button } from "@mui/material";
import { useFetchOrdersQuery } from "./orderApi";
import { Link } from "react-router";
import { currencyFormat } from "../../lib/util";

export default function OrderHistory() {
    const { data: orders, isLoading, error } = useFetchOrdersQuery();

    if (isLoading) return <Typography>Loading orders...</Typography>;
    if (error || !orders) return <Typography>No orders found.</Typography>;

    return (
        <Box maxWidth="md" mx="auto" mt={4}>
            <Typography variant="h4" gutterBottom>My Orders</Typography>
            {orders.length === 0 && <Typography>You have not placed any orders yet.</Typography>}

            {orders.map(order => (
                <Paper key={order.id} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="subtitle1">Order #{order.id}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Status: {order.orderStatus} | Ordered on: {new Date(order.orderDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2">
                                Total: {currencyFormat(order.total)}
                            </Typography>
                        </Box>
                        <Button
                            component={Link}
                            to={`/orders/${order.id}`}
                            variant="contained"
                            size="small"
                        >
                            View Details
                        </Button>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}
