import { Box, Typography, Paper, Button } from "@mui/material";

import { useParams, Link } from "react-router";
import { useFetchOrderDetailedQuery } from "./orderApi";

export default function OrderConfirmation() {
    const { id } = useParams(); // get order id from route
    const { data: order, isLoading, error } = useFetchOrderDetailedQuery(Number(id));

    if (isLoading) return <Typography>Loading order...</Typography>;
    if (error) return <Typography>Error loading order.</Typography>;

    return (
        <Box maxWidth="md" mx="auto" mt={4}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Thank you for your order!
                </Typography>

                <Typography variant="body1" gutterBottom>
                    Your order number is <strong>{order?.id}</strong>.
                </Typography>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                    A confirmation email has been sent to {order?.buyerEmail}.
                </Typography>

                <Box mt={3}>
                    <Typography variant="h6">Order Summary</Typography>
                    <Typography>Items: {order?.orderItems.length}</Typography>
                    <Typography>Subtotal: ${order?.subtotal}</Typography>
                    <Typography>Delivery Fee: ${order?.deliveryFee}</Typography>
                    <Typography>Total: ${order?.total}</Typography>
                </Box>

                <Box mt={4} display="flex" gap={2}>
                    <Button component={Link} to="/catalog" variant="contained">
                        Continue Shopping
                    </Button>

                    <Button component={Link} to={`/orders/${order?.id}`} variant="outlined">
                        View Order Details
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
