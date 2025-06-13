import {
  Wifi,
  Waves,
  Dumbbell,
  Car,
  PawPrint,
  Tv,
  Thermometer,
  Cigarette,
  Cable,
  Maximize,
  Bath,
  Phone,
  Sprout,
  Hammer,
  Bus,
  Mountain,
  VolumeX,
  Home,
  Warehouse,
  Building,
  Castle,
  Trees,
  LucideIcon,
} from "lucide-react";

export enum ProductEnum {
  SingleDoor = "SingleDoor",
  DoubleDoor = "DoubleDoor",
  Canopy = "Canopy",
  Railing = "Railing",
}
export const ProductIcons: Record<ProductEnum, LucideIcon> = {
  SingleDoor: Waves,
  DoubleDoor: Thermometer,
  Canopy: Waves,
  Railing: Wifi,
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
