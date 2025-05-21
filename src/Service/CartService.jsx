import axios from "axios";

const Api_url = "http://localhost:8081/api/cart";

export const addTocart = async (foodId, token) => {
  try {
    await axios.post(
      Api_url,
      { foodId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Erroe while adding qty the cart ", error);
  }
};

export const removeQtyFromCart = async (foodId, token) => {
  try {
    await axios.post(
      Api_url + "/remove",
      { foodId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Erroe while removing qty the cart", error);
  }
};

export const getcartItems = async (token) => {
  try {
    const response = await axios.get(Api_url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.items;
  } catch (error) {
    console.error("Erroe while fetching the  cart data", error);
  }
};

export const removeFromCartApi = async ( foodId,token) => {
  try {
    await axios.delete(Api_url+"/delete/item", {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { foodId },
    });
  } catch (error) {
    console.error("Error while removing item from cart entire", error);
  }
};

