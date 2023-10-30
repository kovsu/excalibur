import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import ErrorPage from "@/ErrorPage";
import Footer from "@/components/Footer";
import Detail from "@/pages/Detail";
import Commits from "@/pages/Commits";
import Search from "@/pages/Search";
import Header from "@/components/Header";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Search />,
    errorElement: <ErrorPage />,
  },
  {
    path: "detail",
    element: <Detail />,
    errorElement: <ErrorPage />,
  },
  {
    path: "commits",
    element: <Commits />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <>
      <div className="px-48 min-h-screen flex flex-col">
        <Header />
        <RouterProvider router={router} />
        <Footer />
      </div>
    </>
  );
}

export default App;
