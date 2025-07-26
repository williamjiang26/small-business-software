import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import HeroPhoto from "../../../assets/tdcdashboard.png";

const HeroSection = () => {
  return (
    <div className="relative h-screen w-screen">
      <Image
        src={HeroPhoto}
        alt="Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />

      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/60" />

      <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="">
            <h1 className="text-5xl font-bold text-white mb-4">
              Tools to <span className="underline">Manage</span> Your Small Business Operations
            </h1>
            <p className="text-xl text-white mb-8">
              Reliable tools and systems that you can trust and successfully
              operate any business
            </p>
            <Button
              onClick={() => {}}
              className="bg-secondary-500 text-white rounded-xl border-2 hover:bg-white hover:text-black h-12"
            >
              Book a Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
