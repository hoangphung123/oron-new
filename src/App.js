import Register from "./pages/register/Register.jsx";
import Login from "./pages/login/Login.jsx";
import Pagefriend from "./pages/listFriendPage/friend.jsx";
import Forgotpassword from "./pages/forgotpassword/forgotpassword.jsx";
import Ranking from "./pages/ranking/Ranking.jsx";
import Reportadmin from "./pages/reportadmin/Reportadmin.jsx";
import DetailRegistation from "./pages/detailRegister/detail.jsx";
import DetailSavePost from "./pages/detailSavePost/detailSavePosr.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import SettingsPage from "./pages/admin/SettingsPage.jsx";
import LoginAdmin from "./pages/admin/loginAdmin/LoginAdmin.jsx";
import UsersPage from "./pages/admin/UsersPage.jsx";
import RankingNew from "./pages/rankingNew/rankingNew.jsx";
import AdvertisePage from "./pages/advertise/advertise.jsx";
import Post from "./pages/reaction/reaction.jsx";
import LuckyWheel from "./components/luckyWheel/LuckyWheel.jsx";
import Loading from "./components/loading/Loading.jsx";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import NavBar from "./components/navbar/NavBar.jsx";
import LeftBar from "./components/leftbar/LeftBar.jsx";
import RightBar from "./components/rightbar/RightBar.jsx";
import Home from "./pages/home/Home.jsx";
import Profile from "./pages/profile/Profile.jsx";
import ProfileFriends from "./pages/profileFriends/profileFriends.jsx";
import ProductsPage from "./pages/admin/ProductsPage.jsx";
import AdvertisesPage from "./pages/admin/AdvertisePage.jsx";
// import Carousel from './components/carousel/Carousel.jsx';
import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext.js";
import { AuthContext } from "./context/authContext.js";
import * as UserServices from "./server/userstore.js";
import {
  getAndSendTokenToBackend,
  messaging,
} from "./pages/nofication/filebase.js";
import { onMessage } from "firebase/messaging";
import toast, { Toaster } from "react-hot-toast";

function App() {
  // useEffect(() => {
  //   console.log("useEffect has been triggered.");
  //   onMessage(messaging, (payload) => {
  //     console.log("Full Payload:", payload);
  //     // if (payload) {
  //     //   console.log("Notification body:", payload.notification.body);
  //     // } else {
  //     //   console.log("Notification data:", payload.data); // Kiểm tra dữ liệu trong trường hợp không có `notification`
  //     // }
  //     toast.success("No body found");
  //   });
  // }, []);
  //common layout

  //not login
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext);

  const fecheslogin = async () => {
    const accessToken = JSON.parse(localStorage.getItem("access_token"));
    const profileUser = await UserServices.getProfile(accessToken);
    setCurrentUser(profileUser);
    console.log(currentUser.data.username);
  };

  // useEffect(() => {
  //   fecheslogin();
  // }, []);

  const Layout = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <NavBar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div className="Home-post" style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
    );
  };

  const Layouts = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <NavBar />
        <div style={{ display: "flex" }}>
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
        </div>
      </div>
    );
  };

  const LayoutRanking = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <NavBar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div className="Home-post" style={{ flex: 6 }}>
            <Outlet />
          </div>
        </div>
      </div>
    );
  };

  const LayoutAdmin = () => {
    return (
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        {/* BG */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>
        <Sidebar />
        <Outlet />
      </div>
    );
  };

  //Protected Route (check login or not yet)
  const ProtectedRoute = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const [isDelayed, setIsDelayed] = useState(true); // Trạng thái để trì hoãn kiểm tra

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsDelayed(false); // Sau 1 giây, cho phép kiểm tra `currentUser`
      }, 100); // 1000ms = 1 giây

      return () => clearTimeout(timer); // Dọn dẹp timer khi component bị unmount
    }, []);

    // Trong thời gian trì hoãn, hiển thị trạng thái loading
    if (isDelayed) {
      return; // Bạn có thể thay bằng spinner
    }

    // Sau khi hết thời gian trì hoãn, kiểm tra `currentUser`
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const ProtectedRouteAdmin = ({ children }) => {
    const [isDelayed, setIsDelayed] = useState(true); // Trạng thái để trì hoãn kiểm tra

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsDelayed(false); // Sau 1 giây, cho phép kiểm tra `access_token_admin`
      }, 100); // 100ms = 0.1 giây

      return () => clearTimeout(timer); // Dọn dẹp timer khi component bị unmount
    }, []);

    // Trong thời gian trì hoãn, hiển thị trạng thái loading
    if (isDelayed) {
      return <div>Loading...</div>; // Bạn có thể thay bằng spinner
    }

    // Sau khi hết thời gian trì hoãn, kiểm tra `access_token_admin`
    const accessTokenAdmin = localStorage.getItem("access_token_admin");
    console.log("accessTokenAdmin", accessTokenAdmin);
    if (!accessTokenAdmin) {
      return <Navigate to="/loginAdmin" />;
    }

    return children;
  };

  //router
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        // {
        //   path: "/profile/:id",
        //   element: <Profile />,
        // },
        // {
        //   path: "/ranking",
        //   element: <Ranking />,
        // },
        // {
        //   path: "/reportadmin",
        //   element: <Reportadmin />,
        // },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/loginAdmin",
      element: <LoginAdmin />,
    },
    // {
    //   path: "/profile/:id",
    //   element: <Profile />,
    // },
    {
      path: "/detailSavePort",
      element: <DetailSavePost />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/friends",
      element: <Pagefriend />,
    },
    {
      path: "/forgotpassword",
      element: <Forgotpassword />,
    },
    // {
    //   path: "/ranking",
    //   element: <RankingNew />,
    // },
    // {
    //   path: "/reportadmin",
    //   element: <Reportadmin />,
    // },
    {
      path: "/detailRegistation",
      element: <DetailRegistation />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layouts />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/profileFriends",
          element: <ProfileFriends />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/post",
          element: <Post />,
        },
        {
          path: "/loading",
          element: <Loading />,
        },
      ],
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <LayoutRanking />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/ranking",
          element: <RankingNew />,
        },
        {
          path: "/advertise",
          element: <AdvertisePage />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <ProtectedRouteAdmin>
            <LayoutAdmin />
          </ProtectedRouteAdmin>
        </ProtectedRoute>
      ),
      children: [
        // {
        //   path: "/users",
        //   element: <ProfileFriends />,
        // },
        {
          path: "setting",
          element: <SettingsPage />,
        },
        {
          path: "users",
          element: <UsersPage />,
        },
        {
          path: "",
          element: <ProductsPage />,
        },
        {
          path: "advertise",
          element: <AdvertisesPage />,
        },
      ],
    },
  ]);
  //

  return (
    <div>
      <Toaster className="sssss" position="top-right" />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
