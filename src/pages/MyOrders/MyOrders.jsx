import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import {StoreContext} from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import "./Myorders.css";

const MyOrders = () => {
   const {token} =useContext(StoreContext);
   const[data,setData] =useState([]);

   const fetchOrders= async ()=>{
    const response= await axios.get("http://localhost:8081/api/order",{headers:{'Authorization':`Bearer ${token}`},});
    setData(response.data);

   };
   useEffect(()=>{
if(token){
    fetchOrders();
}
   },[token]);
  return (
    <div className="container">
        <div className="py-5 row justify-content-center">
            <div className="col-11 card">
                <table className='table table-responsive'> 
                    <tbody>
                        {
                            data.map((order,index)=>{
                                return(
                                    <tr key={index}>
                                      <td>
                                        <img src={assets.Delivered}  alt="" height={48} width={58}/>
                                      </td>
                                      <td>
                                        {order.orderedItems.map((item,index)=>{
                                            if(index===order.orderedItems.length-1)
                                            {
                                                return item.name+" X "+item.quantity;
                                            }
                                            else{
                                                return item.name +" X "+item.quantity+ " ,";
                                            }
                                        })}
                                      </td>
                                     <td>&#8377;{order.amount?.toFixed(2) ?? "0.00"}</td>
                                      <td>Items:{order.orderedItems.length}</td>
                                      <td className="fw-bold text-capitalize">&#x25cf;{order.orderStatus}</td>
                                      <td>
                                        <button className="btn btn-sm btn-warning" onClick={fetchOrders}>
                                            <i className="bi bi-arrow-clockwise"></i>
                                        </button>
                                      </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>

  )
}

export default MyOrders;
