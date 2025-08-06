export enum ProductEnum {
  Single = "Single",
  Double = "Double",
}
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
