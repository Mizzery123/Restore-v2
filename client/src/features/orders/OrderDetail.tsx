import { Box, Paper, Typography, Divider } from "@mui/material";
import { useParams } from "react-router";
import { useFetchOrderDetailedQuery } from "./orderApi";
import { currencyFormat } from "../../lib/util";

export default function OrderDetail() {
    const { id } = useParams();
    const { data: order, isLoading, error } = useFetchOrderDetailedQuery(Number(id));

    if (isLoading) return <Typography>Loading order...</Typography>;
    if (error || !order) return <Typography>Error loading order.</Typography>;

    return (
        <Box maxWidth="md" mx="auto" mt={4}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Order #{order.id}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Status: {order.orderStatus} | Ordered on: {new Date(order.orderDate).toLocaleDateString()}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Shipping Address</Typography>
                <Typography>{order.shippingAddress.name}</Typography>
                <Typography>{order.shippingAddress.line1} {order.shippingAddress.line2}</Typography>
                <Typography>{order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.postal_code}</Typography>
                <Typography>{order.shippingAddress.country}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Payment Summary</Typography>
                <Typography>{order.paymentSummary.brand} ending with {order.paymentSummary.last4}</Typography>
                <Typography>Expires {order.paymentSummary.expMonth}/{order.paymentSummary.expYear}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Items</Typography>
                {order.orderItems.map(item => (
                    <Box key={item.productId} display="flex" justifyContent="space-between" mb={1}>
                        <Typography>{item.name} x {item.quantity}</Typography>
                        <Typography>{currencyFormat(item.price * item.quantity)}</Typography>
                    </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between">
                    <Typography>Subtotal</Typography>
                    <Typography>{currencyFormat(order.subtotal)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Typography>Delivery Fee</Typography>
                    <Typography>{currencyFormat(order.deliveryFee)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" fontWeight="bold">
                    <Typography>Total</Typography>
                    <Typography>{currencyFormat(order.total)}</Typography>
                </Box>
            </Paper>
        </Box>
    );
}
