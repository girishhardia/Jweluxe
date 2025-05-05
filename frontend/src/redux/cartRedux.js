import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const cartSlice = createSlice({
    name: "cart",
    "initialState": {
        products: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
        // products: [],
        cartTotalQuantity: 0,
        cartTotalAmount: 0,
        qty: 0
    },
    reducers: {
        addProduct: (state, action) => {
            const itemIndex = state.products.findIndex((item) => item.jewellery_id === action.payload.jewellery_id);
            if (itemIndex >= 0) {
                state.products[itemIndex].cartQuantity += 1;
            } else {
                const tempProd = { ...action.payload, cartQuantity: 1 };
                state.products.push(tempProd);
                toast.success(`${action.payload.jewellery_name} Added to the Cart`);
            }
            localStorage.setItem("cart", JSON.stringify(state.products));
            // state.total += action.payload.price;
            // state.quantity += 1;
            // state.itemCounter += 1;
            state.qty += 1;
        },
        removeProduct: (state, action) => {
            const nextCartItems = state.products.filter((item) =>
                item.jewellery_id !== action.payload.jewellery_id
            );
            state.products = nextCartItems;
            localStorage.setItem("cart", JSON.stringify(state.products));
            // state.quantity -= 1;
            state.qty -= 1;
            // state.products.pop();
            // state.total -= action.payload.price;
            // state.itemCounter -= 1;
        },
        decreaseCart: (state, action) => {
            const itemIndex = state.products.findIndex(
                cartItem => cartItem.jewellery_id === action.payload.jewellery_id
            );
            if (state.products[itemIndex].cartQuantity > 1) {
                state.products[itemIndex].cartQuantity -= 1;
            } else if (state.products[itemIndex].cartQuantity === 1) {
                const nextCartItems = state.products.filter((item) =>
                    item.jewellery_id !== action.payload.jewellery_id
                );
                state.products = nextCartItems;
            }
            localStorage.setItem("cart", JSON.stringify(state.products));
        },
        getTotals: (state, action) => {
            let { total, quantity } = state.products.reduce((cartTotal, cartItem) => {
                const { jewellery_price, cartQuantity } = cartItem;
                const itemTotal = jewellery_price * cartQuantity;
                cartTotal.total += itemTotal;
                cartTotal.quantity += cartQuantity;
                return cartTotal;
            }, {
                total: 0,
                quantity: 0
            });
            state.cartTotalQuantity = quantity;
            state.cartTotalAmount = total;
        },
        emptyCart: (state, action) => {
            localStorage.removeItem("cart");
            state.products = [];
            state.products.length = 0;
            state.cartTotalQuantity = 0;
            state.cartTotalAmount = 0;
        }
    }
});
export const { addProduct, removeProduct, decreaseCart, getTotals, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
