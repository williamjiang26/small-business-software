import Landing from "@/app/(nondashboard)/landing/page";
import Navbar from "./(components)/Navbar";
export default function Home() {
  return (
    <div className="h-full w-full ">
      <Navbar />

      <main
        className={`h-full flex w-full flex-col`}
        style={{ paddingTop: `58px` }}
      >
        <Landing />
      </main>
    </div>
  );
}
