import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Firebase from './BD/Firebase';
import firebase from 'firebase/compat/app';
import  'firebase/compat/database';
import "firebase/compat/auth";
import {Modal, ModalBody, ModalHeader,ModalFooter} from 'reactstrap';
function App() {
  var tutorialsRef = firebase.database().ref("/carrito");

  const img1="https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/gr/images/product-images/img_large/00750105536561L.jpg";
  const img2="https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/gr/images/product-images/img_large/00750105530007L.jpg";
  const img3="https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/gr/images/product-images/img_large/00750107112009L.jpg";
  const img4="https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/gr/images/product-images/img_large/00750105534998L.jpg";
 
  const dataProductos = [
    { id: 1, imagen: img1, nombre: "Yoli", descripcion: "Refresco Yoli sabor limón 355ml", precio: 15},
    { id: 2, imagen: img2, nombre: "Coca-Cola", descripcion: "Refresco Coca Cola lata de 355ml", precio: 16},
    { id: 3, imagen: img3, nombre: "Squirt", descripcion: "Refresco Squirt sabor toronja 355ml", precio: 12},
    { id: 4, imagen: img4, nombre: "Sidral Mundet", descripcion: "Refresco Sidral Mundet sabor manzana 235ml", precio: 10},
  ];
  
  var cart = JSON.parse(sessionStorage.getItem("items"));
  if (cart == null) {
    cart = [];
  }
  function deleteProductInCart(pos) {
    cart.splice(pos, 1)
    sessionStorage.setItem("items", JSON.stringify(cart));
    alert("Producto eliminado");
    setModalCarrito(false)

  }
  const [data, setData] = useState(dataProductos);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalCarrito, setModalCarrito] = useState(false);
  const [prodSelec, setProducSelec] = useState({
    id: '',
    imagen:'',
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: 0
  });
  const handleChange=e=>{
    const {name, value}=e.target;
    setProducSelec((prevState)=>({
      ...prevState,
      [name]: value
    }));
  }
  const addToCartBebida =()=>{
    if(prodSelec.cantidad==0 || prodSelec.cantidad==undefined){
      console.log(prodSelec.cantidad);
      alert("Debes añadir al menos 1 producto")
    }else{
      var total = (parseFloat(prodSelec.cantidad) * parseFloat(prodSelec.precio));
      let itemCart = {
        "id": prodSelec.id,
        "nombre": prodSelec.nombre,
        "imagen":prodSelec.imagen,
        "descripcion": prodSelec.descripcion,
        "cantidad": prodSelec.cantidad,
        "precio": prodSelec.precio,
        "total": total,
      }
      cart.push(itemCart);
      sessionStorage.setItem("items", JSON.stringify(cart));
      setModalAgregar(false);
      console.log(cart[0]);
    }
  }
 
  
  const insertToFirebase=()=>{
    //insertar a firebase el carrito
    tutorialsRef.push({cart});
    for(var i=0;i<cart.length;i++){
      cart.pop();
    }
    sessionStorage.setItem("items", JSON.stringify(cart));

    setModalCarrito(false);
  }

  const seleccionarProducto=(elemento)=>{
    setProducSelec(elemento);
    setModalAgregar(true);
  }

  return (
    <div className="App">
      <p class="p-2 bg-success text-white"><h2>VENTA DE REFRESCOS 🥤</h2></p>
      <div className="fila row p-4 justify-content-center">
          {data.map(elemento=>(
            <div className=" col tarjeta card p-2 " style={{width: "18rem", marginRight : "20px",marginBottom : "10px"}}>
            <img  style={{width : '200px', height: "100px" }} src={elemento.imagen} className="imagen card-img-top" alt="..."/>
                <div class="card-body bg-light ">
                    <h5 class="card-title bg-light">{elemento.nombre}</h5>
                    <p class="card-text">{elemento.descripcion}</p>
                    <p class="card-text"><h5>${elemento.precio}.00</h5></p>
                    <button className="btn btn-primary" onClick={()=>seleccionarProducto(elemento)}>Comprar</button>
                    
               </div>
            </div>              
          ))
          }
      </div>
      <button type="button" class="btn btn-secondary btn-lg btn-block" onClick={()=>setModalCarrito(true)}>Carrito🛒</button>

      <Modal isOpen={modalAgregar}>
        <ModalHeader>
          <div>
            <h3>Agregar al Carrito: {prodSelec && prodSelec.nombre}</h3>
          </div>
        </ModalHeader>
        <ModalBody>

          <div className="form-group">
              <div className="row">
          
              <div className="col-4">
                <label></label>
                <input
                  className="form-control"
                 readOnly
                  type="hidden"
                  name="id"
                  value={prodSelec && prodSelec.id}
                  onChange={handleChange}

                />
                <br />
                <img  src={prodSelec && prodSelec.imagen} onChange={handleChange} className="imagen card-img-top" alt="..."/>
                <br />
              </div>
            
            <div className="col-6">
              <label>Producto </label>
              <input
                className="form-control"
                readOnly
                type="text"
                name="nombre"
                value={prodSelec && prodSelec.nombre}
                onChange={handleChange}
              />
              <br />

              <label>Descripcion</label>
              <input
                className="form-control"
                readOnly
                type="text"
                name="descripcion"
                value={prodSelec && prodSelec.descripcion}
                onChange={handleChange}
              />
              <br />

              <label>Precio</label>
              <input
                className="form-control"
                readOnly
                type="number"
                name="precio"
                value={prodSelec && prodSelec.precio}  
                onChange={handleChange}
              />
              <br />
              <label>Cantidad </label>
              <input
                className="form-control"
                type="number"
                name="cantidad"
                value={prodSelec && prodSelec.cantidad}  
                min="1" 
                max="20"
                onChange={handleChange}
              />
              <br />
            </div>
            
          </div>
        </div>
          
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>addToCartBebida()}>
            Agregar 
          </button>
          <button className="btn btn-danger" onClick={()=>setModalAgregar(false)}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalCarrito} size="xl" >
        <ModalHeader>
          <div>
            <h3>Carrito</h3>
          </div>
        </ModalHeader>
        <ModalBody>
        <div>
        <table className="table table-bordered" id="lista-Empleados">
        <thead>
          <tr>
            <th>Id</th>
            <th>Fotografia</th>
            <th>Producto</th>
            <th>Descripcion</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Acciones</th>

          </tr>
        </thead>
        <tbody>
          {cart.map((elemento,index)=>(
            <tr>
              <td>{elemento.id}</td>
              <td><img style={{width : '50px'}} src={elemento.imagen}></img> </td>
              <td>{elemento.nombre}</td>
              <td>{elemento.descripcion}</td>
              <td>{elemento.precio}</td>
              <td>{elemento.cantidad}</td>
              <td>{elemento.total}</td>
              <td><button className="btn btn-danger" onClick={()=>deleteProductInCart(index)}>Eliminar</button></td>

            </tr>
          ))
          }
        </tbody>
      </table>  
        </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>insertToFirebase()}>
            Pagar
          </button>
          <button className="btn btn-danger" onClick={()=>setModalCarrito(false)}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </div>
    
  );
}

export default App;