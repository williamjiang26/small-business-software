import Door from '../../assets/door.png'

const Product = ({ product }: { product: any }) => {
  console.log(product.photoUrls)
  return (
    <div className="bg-white width-full shadow-md rounded-lg p-4 flex flex-col sm:flex-row items-center sm:items-start justify-between space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={product.photoUrls ? product.photoUrls[0] : Door.src}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex justify-between space-y-3 ">
        <h3 className="text-xl font-semibold">{product.name}</h3>
        <p className="text-gray-500 mt-2">{product.color}</p>
        <p className="text-gray-700 mt-1">Height: {product.height} cm</p>
        <p className="text-gray-700 mt-1">Width: {product.width} cm</p>
        <p className="text-gray-700 mt-1">Length: {product.length} cm</p>
        <p className="text-gray-700 mt-1">Price: ${product.price}</p>
      </div>
      <div className="flex flex-col items-center sm:items-end mt-4 sm:mt-0">
        <span className="text-lg font-semibold text-gray-800">
          Qty: {product.quantity}
        </span>
        <span className="text-sm text-gray-400">{product.rating} ⭐</span>
      </div>
    </div>
  );
};

export default Product;
