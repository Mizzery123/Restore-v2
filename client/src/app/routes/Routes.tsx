// Links which page to which url like a navigation blueprint
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import RequireAuth from "./RequireAuth";
import OrderConfirmation from "../../features/orders/OrderConfirmation";
import OrderDetail from "../../features/orders/OrderDetail";
import OrderHistory from "../../features/orders/OrderHistory";
import InventoryPage from "../../features/admin/InventoryPage";



export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <RequireAuth />, children: [ //Pages to protect with authentication
                    { path: 'checkout', element: <CheckoutPage /> },
                    { path: "order-confirmation/:id", element: <OrderConfirmation /> },
                    { path: "orders/:id", element: <OrderDetail /> },
                    { path: "orders", element: <OrderHistory /> },
                    { path: "inventory", element: <InventoryPage /> },
                ]
            },
            { path: '', element: <HomePage /> },
            { path: 'catalog', element: <Catalog /> },
            { path: 'catalog/:id', element: <ProductDetails /> },
            { path: 'about', element: <AboutPage /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'basket', element: <BasketPage /> },
            { path: 'server-error', element: <ServerError /> },
            { path: 'login', element: <LoginForm /> },
            { path: 'register', element: <RegisterForm /> },
            { path: 'not-found', element: <NotFound /> },
            { path: '*', element: <Navigate replace to='/not-found' /> } //For any other links will be redirected
        ]
    }
], {
    future: { v7_relativeSplatPath: true }
})