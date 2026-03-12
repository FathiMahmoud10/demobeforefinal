import React, { useEffect, useState } from "react";

export default function Products() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://takamulerp.runasp.net/Products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-4">

      <h1 className="text-xl font-bold mb-4">الاصناف</h1>

      <div className="grid grid-cols-4 gap-4">

        {products.map((product) => (

          <div key={product.id} className="border p-3 rounded shadow">

            <img
              src={product.imageUrl}
              className="w-full h-32 object-cover mb-2"
            />

            <h3 className="font-bold">
              {product.productNameAr}
            </h3>

            <p className="text-green-600">
              {product.sellingPrice} جنيه
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}