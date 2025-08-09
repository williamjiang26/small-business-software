import {
  Single,
  Double,
  RoundTop,
  RoundTopDouble,
  Window,
  Railing,
} from "@/app/(components)/icons";
export enum ProductEnum {
  Single = "Single",
  Double = "Double",
  RoundTop = "RoundTop",
  RoundTopDouble = "RoundTopDouble",
  Window = "Window",
  Railing = "Railing",
}
export const ProductTypeIcons: Record<
  ProductEnum,
  React.FC<{ size?: number; color?: string }>
> = {
  Single: Single,
  Double: Double,
  RoundTop: RoundTop,
  RoundTopDouble: RoundTopDouble,
  Window: Window,
  Railing: Railing,
};

export enum ProductColorEnum {
  Black = "Black",
  LightCopper = "LightCopper",
  MediumCopper = "MediumCopper",
  HeavyCopper = "HeavyCopper",
  White = "White",
}

export enum OrderStatusEnum {
  CREATEORDER = "CREATEORDER",
  ORDERPLACED = "ORDERPLACED",
  ORDERSHIPPED = "ORDERSHIPPED",
  ORDERRECEIVED = "ORDERRECEIVED",
  ORDERDELIVERED = "ORDERDELIVERED",
}

export enum ProductOrderStatusEnum {
  PROCESSING = "PROCESSING",
  ORDERPLACED = "ORDERPLACED",
  ENROUTE = "ENROUTE",
  RECEIVED = "RECEIVED",
  INSTOCK = "INSTOCK",
  DELIVERED = "DELIVERED",
}
