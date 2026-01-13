import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import QuoteRandom from "./QuoteRandom";

const DefaultLayout = () => {
  return (
    <>
      <Header />
      <Hero />
      <main>
        <Outlet />
      </main>
      <QuoteRandom />
      <Footer />
    </>
  );
};

export default DefaultLayout;
