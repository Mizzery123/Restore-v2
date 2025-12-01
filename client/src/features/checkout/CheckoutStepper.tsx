import { Box, Button, Paper, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { useState } from "react"
import { useCreateOrderMutation } from "../../features/orders/orderApi";
import { useNavigate } from "react-router";
import type { PaymentSummary, ShippingAddress } from "../../app/models/order";


const steps = ['Address', 'Payment', 'Review'];




export default function CheckoutStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        name: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: ""
    });

    const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({
        last4: 0,
        brand: "",
        expMonth: 0,
        expYear: 0
    });


    const handleNext = async () => {
        if (activeStep === steps.length - 1) {

            const orderPayload = {
                shippingAddress,
                paymentSummary
            };

            try {
                const order = await createOrder(orderPayload).unwrap();

                // Redirect to confirmation page
                navigate(`/order-confirmation/${order.id}`);
            } catch (err) {
                console.error("Order creation failed:", err);
            }

            return;
        }

        setActiveStep(step => step + 1);
    };


    const handleBack = () => {
        setActiveStep(step => step - 1);
    }


    // Input change handlers
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
        setPaymentSummary({ ...paymentSummary, [e.target.name]: value });
    };


    return (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    return (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>

            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
                    <TextField fullWidth label="Full Name" name="name" value={shippingAddress.name} onChange={handleAddressChange} />
                    <TextField fullWidth label="Address Line 1" name="line1" value={shippingAddress.line1} onChange={handleAddressChange} />
                    <TextField fullWidth label="Address Line 2" name="line2" value={shippingAddress.line2} onChange={handleAddressChange} />
                    <TextField fullWidth label="City" name="city" value={shippingAddress.city} onChange={handleAddressChange} />
                    <TextField fullWidth label="State" name="state" value={shippingAddress.state} onChange={handleAddressChange} />
                    <TextField fullWidth label="Postal Code" name="postal_code" value={shippingAddress.postal_code} onChange={handleAddressChange} />
                    <TextField fullWidth label="Country" name="country" value={shippingAddress.country} onChange={handleAddressChange} />
                </Box>
                <Box sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
                    <TextField fullWidth label="Card Brand" name="brand" value={paymentSummary.brand} onChange={handlePaymentChange} />
                    <TextField fullWidth label="Last 4 Digits" name="last4" type="number" value={paymentSummary.last4} onChange={handlePaymentChange} />
                    <TextField fullWidth label="Expiry Month" name="expMonth" type="number" value={paymentSummary.expMonth} onChange={handlePaymentChange} />
                    <TextField fullWidth label="Expiry Year" name="expYear" type="number" value={paymentSummary.expYear} onChange={handlePaymentChange} />
                </Box>
                <Box sx={{ display: activeStep === 2 ? 'block' : 'none' }}>
                    <Typography variant="h6">Shipping Address</Typography>
                    <Typography>{shippingAddress.name}</Typography>
                    <Typography>{shippingAddress.line1}, {shippingAddress.line2}</Typography>
                    <Typography>{shippingAddress.city}, {shippingAddress.state}, {shippingAddress.postal_code}</Typography>
                    <Typography>{shippingAddress.country}</Typography>

                    <Typography variant="h6" mt={2}>Payment Summary</Typography>
                    <Typography>{paymentSummary.brand} ending with {paymentSummary.last4}</Typography>
                    <Typography>Expires {paymentSummary.expMonth}/{paymentSummary.expYear}</Typography>
                </Box>
            </Box>

            <Box display='flex' paddingTop={2} justifyContent='space-between'>
                <Button onClick={handleBack} disabled={activeStep === 0}>Back</Button>
                <Button onClick={handleNext} disabled={isLoading}>
                    {activeStep === steps.length - 1 ? "Submit Order" : "Next"}
                </Button>
            </Box>
        </Paper>
    )
}