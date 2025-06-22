import Header from "./Header";
import { Outlet, useNavigation } from "react-router";
import Footer from "./Footer";
import Loader from "../Loader";

export default function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const isHomePage = location.pathname === "/";

  return (
    <div>
      {isLoading && <Loader />}

      <Header />

      <div className="">
        <main className={isHomePage ? '' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12'}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
