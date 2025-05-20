import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import './Fooditem.css';


const FoodItem = ({imageUrl,description,price,name,id}) =>
  {
    const {increaseQty,decreaseQty,quantities}=useContext(StoreContext);
  return (
   
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
    
    <div className="card" style={{ "maxWidth": "320px" }}>
        <Link to={`/food/${id}`}>
        <img src={imageUrl} className="card-img-top" alt="Product Image" width={60} height={250}/>
        </Link>
        <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p className="card-text">{description}</p>
            <div className="d-flex justify-content-between align-items-center">
                <span className="h5 mb-0">&#8377;{price}</span>
                <div>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-half text-warning"></i>
                    <small className="text-muted">(4.5)</small>
                </div>
            </div>
        </div>
        <div className="card-footer d-flex justify-content-between bg-light">
        <Link className="btn btn-primary fs-6" to={`/food/${id}`}>View Food</Link>
          {
            quantities[id]>0 ?(
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btnnn" onClick={()=>decreaseQty(id)}><i className="bi bi-dash-square"></i></button>
                  <span className="fw-bold">{quantities[id]}</span>
                  <button className="btn btnn"  onClick={()=>increaseQty(id)}><i className="bi bi-plus-square"></i></button>
                </div>
            ):
            (
                <button className="btn btn-primary btn-sm" style={{"backgroundColor": "black","color":"white"}} onClick={()=>increaseQty(id)}>
                    Add</button>
            )}     
        </div>
    </div>
      </div>
     
  )
}

export default FoodItem;
