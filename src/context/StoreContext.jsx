import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../Service/Service";
import {
  addTocart,
  getcartItems,
  removeQtyFromCart,
} from "../Service/CartService";

export const StoreContext = createContext(null);
export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");

  const increaseQty = async (foodId) => {
    setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
    await addTocart(foodId, token);
  };

  const decreaseQty = async (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0,
    }));
    await removeQtyFromCart(foodId, token);
  };

  const removeFromCart = async (foodId) => {
    //try {
      //await removeFromCartApi(token);
      setQuantities((prev) => {
        const updatedQuantities = { ...prev };
        delete updatedQuantities[foodId];
        return updatedQuantities;
       });
    // } catch (error) {
    //   console.error("Failed to remove item from cart:", error);
    // }
  };

  const loadCartData = async (token) => {
    const items = await getcartItems(token);
    setQuantities(items);
  };
  const contextValue = {
    foodList,
    increaseQty,
    decreaseQty,
    quantities,
    removeFromCart,
    setQuantities,
    token,
    setToken,
    loadCartData,
  };

  useEffect(() => {
    async function loadData() {
      const data = await fetchFoodList();
      setFoodList(data);
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

