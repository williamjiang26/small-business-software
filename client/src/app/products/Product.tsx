import Door from "../../assets/door.png";
import { useNavigate } from "react-router-dom";
const Product = ({ product }: { product: any }) => {
  // const navigate = useNavigate()
  return (
    <div
      className="bg-white width-full shadow-md rounded-lg p-4 flex flex-col sm:flex-row items-center sm:items-start justify-between space-y-4 sm:space-y-0 sm:space-x-4"
      onClick={() => {}}
    >
      {product.productId}
      <div className="w-32 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg overflow-hidden flex items-center">
        {/* <img
          src={Door.src}
          alt={product.name}
          className="object-cover w-full h-full"
        /> */}
      </div>
      <h3 className="text-xl font-semibold">{product.name}</h3>

      <p className="text-gray-700 mt-1">{product.color}</p>

      <p className="text-gray-700 mt-1">{product.height}</p>
      <p className="text-gray-700 mt-1">{product.width}</p>
      <p className="text-gray-700 mt-1">{product.length}</p>

      <p className="text-gray-700 mt-1">${product.price}</p>

      <div className="flex flex-col items-center sm:items-end mt-4 sm:mt-0">
        <span className="text-lg font-semibold text-gray-800">
          Qty: {product.quantity}
        </span>
      </div>
    </div>
  );
};

export default Product;
