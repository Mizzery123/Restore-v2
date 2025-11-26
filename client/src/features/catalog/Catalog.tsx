

import ProductList from "./ProductList";
import { useFetchProductsQuery } from "./catalogAPi";


export default function Catalog() {
  const {data, isLoading} =  useFetchProductsQuery(); //isLoading tells us if actually loading or going out to get data from API
  if (isLoading || !data) return <div>Loading...</div>
  
  return (
    <>
      <ProductList products={data}/>

      </>
  )
}
