import { Wifi, Waves, Thermometer, LucideIcon } from "lucide-react";

export enum ProductEnum {
  Single = "Single",
  Double = "Double",
}
export const ProductIcons: Record<ProductEnum, LucideIcon> = {
  Single: Waves,
  Double: Thermometer,
};
export enum ProductColorEnum {
  Black = "Black",
  LightCopper = "LightCopper",
  MediumCopper = "MediumCopper",
  HeavyCopper = "HeavyCopper",
  White = "White",
}
export const ProductColorIcons: Record<ProductEnum, LucideIcon> = {
  Black: Waves,
  LightCopper: Thermometer,
  MediumCopper: Waves,
  HeavyCopper: Wifi,
  White: Wifi,
};
export enum OrderStatusEnum {
  CREATEORDER = "CREATEORDER",
  ORDERPLACED = "ORDERPLACED",
  ORDERSHIPPED = "ORDERSHIPPED",
  ORDERRECEIVED = "ORDERRECEIVED",
  ORDERDELIVERED = "ORDERDELIVERED"
}
