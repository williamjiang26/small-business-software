"use client";
import { useGetProductsQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "productId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Product Name", width: 200 },
  {
    field: "price",
    headerName: "Price",
    width: 110,
    type: "number",
    valueGetter: (value, row) => `$${row.price}`,
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 110,
    type: "number",
    valueGetter: (value, row) => (row.rating ? row.rating : "N/A"),
  },
  {
    field: "stockQuantity",
    headerName: "Stock Quantity",
    width: 150,
    type: "number",
  },
  {
    field: "section",
    headerName: "Section",
    width: 100,
    type: "text",
  },
  {
    field: "row",
    headerName: "Row",
    width: 100,
    type: "text",
  },
  
];

const Inventory = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }
  return (
    // card
    <div>
    {products?.map((product) => (
      <div>
        {product.id} | {product.type} | {product.size} | {product.price}
      </div>
    ))}
  </div>
  );
};
export default Inventory;
