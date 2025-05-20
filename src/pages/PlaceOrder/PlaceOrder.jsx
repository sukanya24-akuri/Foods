import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculatorCartTotals } from "../../util/CartUtils";
import axios from "axios";
import { toast } from "react-toastify";
import { razorpay_key } from "../../util/Constants";
import { Await, useNavigate } from "react-router-dom";
import Razorpay from "razorpay";

const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } =
    useContext(StoreContext);

  const navigate = useNavigate();
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    phoneNumber: "",
    state: "",
    city: "",
    zipcode: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const orderData = {
      userAddress: `${data.firstname} ${data.lastname} ${data.state} ${data.city} ${data.address} ${data.zipcode}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address:data.address,
      orderedItems: cartItems.map((item) => ({
        foodId: item.foodId,
        quantity: quantities[item.id],
        price: item.price * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
      })),
      amount: totalAmount.toFixed(2),
      orderStatus: "preparing food",
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/api/order",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Order response:", response);
      if (response.status === 200 && response.data.razorpayOrderId) {
        //initiate the payment
        initiateRazorpayPayment(response.data);
      } else {
        toast.error("unable to place order please try again razor");
      }
    } catch (error) {
      toast.error("unable to place order please try again");
    }
  };
  const initiateRazorpayPayment = (order) => {
    const options = {
      key: razorpay_key,
      amount: order.amount,
      currency: "INR",
      name: "FoodTest",
      description: "Food order payment",
      order_id: order.razorpayOrderId,
      handler: async function (razorpayResponse) {
        await verifyPayment(razorpayResponse);
      },
      redirect: true,
      prefill: {
        name: `${data.firstname} ${data.lastname} `,
        email: data.email,
        contact: data.phoneNumber,
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: async function () {
          toast.error("payment cancelled");
          await deleteOrder(order.id);
        },
      },
    };

    const rzpDashboard = new window.Razorpay(options);
    rzpDashboard.open(); //api verify...
  };
  const verifyPayment = async (razorpayResponse) => {
    const paymentData = {
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    };
    try {
      const response = await axios.post("http://localhost:8081/api/order/verify",paymentData,{ headers: { Authorization: `Bearer ${token}` }, }
      );
      if (response.status == 200) {
        toast.success("payment successfull");
        await clearCart();
        navigate("/myorders");
      } else {
        toast.error("payment failed..please try again");
        navigate("/");
      }
    } catch (error) {
      toast.error("payment failed..please try again");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete("http://localhost:8081/api/order/" + orderId, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:8081/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuantities({});
    } catch (error) {
      toast.error("error while clearing the cart");
    }
  };

  const cartItems = foodList.filter((food) => quantities[food.id] > 0);

  const { subTotal, shippingCharge, tax, totalAmount } = calculatorCartTotals(
    cartItems,
    quantities
  );

  return (
    <div className="container">
      <main>
        <div className="container">
          <img
            className="d-block mx-auto "
            src={assets.Logo}
            height="78"
            width="78"
            alt=""
          />
        </div>
        <div className="row g-5 mt-12">
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">
                {cartItems.length}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between lh-sm"
                >
                  <div>
                    <h6 className="my-0">{item.name}</h6>
                    <small className="text-body-secondary">
                      Qty:{quantities[item.id]}
                    </small>
                  </div>
                  <span className="text-body-secondary">
                    &#8377;{item.price * quantities[item.id]}
                  </span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between ">
                <div>
                  <span>Shipping Charges</span>
                </div>
                <span className="text-body-secondary">
                  &#8377;{subTotal === 0 ? 0.0 : shippingCharge.toFixed(2)}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <span>Tax</span>
                </div>
                <span className="text-body-secondary">{tax.toFixed(2)}</span>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <span>Total (INR)</span>
                <strong>&#8377;{totalAmount.toFixed(2)}</strong>
              </li>
            </ul>
          </div>
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation" onSubmit={onSubmitHandler}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">
                    First name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder=""
                    required
                    name="firstname"
                    onChange={onChangeHandler}
                    value={data.firstname}
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder=""
                    name="lastname"
                    onChange={onChangeHandler}
                    value={data.lastname}
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">@</span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="email"
                      required
                      name="email"
                      onChange={onChangeHandler}
                      value={data.email}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="Enter Your Address"
                    required
                    name="address"
                    onChange={onChangeHandler}
                    value={data.address}
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="phone" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    placeholder="Must be in 10 digits"
                    required
                    name="phoneNumber"
                    onChange={onChangeHandler}
                    value={data.phoneNumber}
                  />
                </div>

                <div className="col-md-5">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <select
                    className="form-select"
                    id="state"
                    required
                    name="state"
                    onChange={onChangeHandler}
                    value={data.state}
                  >
                    <option value="">Choose...</option>
                    <option>Andhra Pradesh</option>
                    <option>Telangana</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <select
                    className="form-select"
                    id="city"
                    name="city"
                    onChange={onChangeHandler}
                    value={data.city}
                    required
                  >
                    <option value="">Choose...</option>
                    <option>Machilipatnam</option>
                    <option>Hyderabad</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label">
                    Zip
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="zip"
                    required
                    name="zipcode"
                    onChange={onChangeHandler}
                    value={data.zipcode}
                  />
                </div>
              </div>
              <hr className="my-4" />
              <button
                className="w-100 btn btn-primary btn-lg"
                type="submit"
                disabled={cartItems.length === 0}
              >
                Continue to checkout
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceOrder;
