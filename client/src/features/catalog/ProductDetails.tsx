import { useEffect, useState } from "react";
import type { Product } from "../../app/models/product";
import { useParams } from "react-router-dom";
import { Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material"; //Using Grid 2

export default function ProductDetails() {

    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(()=> {
        fetch(`https://localhost:5001/api/products/${id}`)
        .then(Response => Response.json())
        .then(data => setProduct(data))
        .catch(error => console.log(error))
    }, [id]) //if id changes, useeffect gets executed and synchronize effectively with api server


        if (!product) return <div>Loading...</div>

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
                    variant="outlined" type="number" label="Quantity in basket" fullWidth defaultValue={1}>

                    </TextField>
                </Grid>

            <Grid size={6}>
                <Button
                sx={{height: '55px'}}
                color="primary" size="large" variant="contained" fullWidth>
                    Add to basket
                </Button>
            </Grid>
            </Grid>
        </Grid>
    </Grid>
  )
}