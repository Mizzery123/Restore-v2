import { useParams } from "react-router-dom";
import { Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material"; //Using Grid 2
import { useFetchProductDetailsQuery } from "./catalogAPi";
import { useAddBasketItemMutation, useFetchBasketQuery, useRemoveBasketItemMutation } from "../basket/basketApi";
import { useState, type ChangeEvent } from "react";

export default function ProductDetails() {

    const {id} = useParams();
    const [removeBasketItem] = useRemoveBasketItemMutation();
    const [addBasketItem] = useAddBasketItemMutation();
    const {data: basket} = useFetchBasketQuery(); // data: basket means take the data and stored it in a variable called basket!
    const item = basket?.items.find(x => x.productId === +id!); // +id! means convert id to a number and will not be null!
    const [quantity, setQuantity] = useState(item ? item.quantity : 0); // As useEffect cause errors!

    // useEffect(() => {
    //     if (item) setQuantity(item.quantity); // can ignore error
    // }, [item]);


    const {data: product, isLoading} = useFetchProductDetailsQuery(id ? +id : 0) // +id is same as parseInt(id)!



    if (!product || isLoading) return <div>Loading...</div>

    const handleUpdateBasket = () => {
        const updatedQuantity = item ? Math.abs(quantity - item.quantity) : quantity //abs means absolute, changes negative number to positive!
        if (!item || quantity > item.quantity){
            addBasketItem({product, quantity: updatedQuantity})
        } else {
            removeBasketItem({productId: product.id, quantity: updatedQuantity})
        }
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = +event.currentTarget.value;
        if(value >= 0) setQuantity(value)
    }

    const productDetails = [
            {label:'Name', value: product.name},
            {label:'Description', value: product.description},
            {label:'Type', value: product.type},
            {label:'Brand', value: product.brand},
            {label:'Quantity in stock', value: product.quantityInStock},
        ]
  return (
    // <div>{product?.name}</div> ? is auto as declared above Product | null

    <Grid container spacing ={6} maxWidth='lg' sx={{mx: 'auto'}}>
        <Grid size={6}>
            <img src={product?.pictureUrl} alt={product.name} style={{width: '100%'}} />
        </Grid>
        <Grid size={6}>
            <Typography variant="h3">{product.name}</Typography>
            <Divider sx={{mb: 2}}/>
            <Typography variant="h4" color='secondary'>${(product.price / 100).toFixed(2)}</Typography>
            <TableContainer>
                <Table sx={{
                    '& td': {fontSize: '1rem'}
                }}>
                    <TableBody>
                        {productDetails.map((detail, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{fontWeight: 'bold'}}>{detail.label}</TableCell>
                                 <TableCell>{detail.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container spacing={2} marginTop={3}>
                <Grid size={6}>
                    <TextField
                    variant="outlined" type="number" label="Quantity in basket" fullWidth value={quantity}
                    onChange={handleInputChange}>

                    </TextField>
                </Grid>

            <Grid size={6}>
                <Button
                onClick={handleUpdateBasket}
                disabled={quantity === item?.quantity || !item && quantity === 0}
                sx={{height: '55px'}}
                color="primary" size="large" variant="contained" fullWidth>
                    {item ? 'Update Quantity' : 'Add to basket'}
                </Button>
            </Grid>
            </Grid>
        </Grid>
    </Grid>
  )
}