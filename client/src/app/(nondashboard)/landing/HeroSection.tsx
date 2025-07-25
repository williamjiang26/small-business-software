import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import  HeroPhoto  from "../../../assets/door2.JPG";

const HeroSection = () => {
  return (
    <div className="relative h-screen">
      <Image
        src={HeroPhoto}
        alt="Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/60" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-center"
      >
        <div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Start your journey to finding the perfect place to call home.
          </h1>
          <p className="text-xl text-white mb-8">
            Explore our wide range of properties to fit your lifestyle and
            needs!
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => {}}
              className="bg-secondary-500 text-white rounded-none rounded-r-xl border-none hover:bg-secondary-600 h-12"
            >
              Book Demo
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
