import "./App.css";
import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { IAuthUser } from "./entities/Auth";
import { Toaster } from 'react-hot-toast';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import routes from './routes';
import Loader from "./components/common/Loader/index.tsx";


const DefaultLayout = lazy(() => import('./components/containers/default/DefaultLayout.tsx'));
const AdminLayout = lazy(() => import('./layout/AdminLayout.tsx'));
const Login = lazy(() => import('./components/auth/login'));
const Register = lazy(() => import('./components/auth/register/RegisterPage.tsx'));
function App() {
  // const { user, isAuth } = useSelector((store: any) => store.auth as IAuthUser);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
      setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
) : (
    <>
        <Toaster position='top-right' reverseOrder={false} containerClassName='overflow-auto'/>

        <Routes>


            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />

            <Route path={"/"} element={<DefaultLayout/>}>
                <Route path={"login"}
                       element={
                           <Suspense fallback={<Loader/>}>
                               <Login/>
                           </Suspense>
                       }/>
                <Route path={"register"}
                       element={
                           <Suspense fallback={<Loader/>}>
                               <Register/>
                           </Suspense>
                       }/>
            </Route>
            <Route path={"/admin"} element={<AdminLayout />}>
                <Route index element={<ECommerce />} />
                {routes.map(({ path, component: Component }, index) => (
                    <Route
                        key={index}
                        path={path}
                        element={
                            <Suspense fallback={<Loader />}>
                                <Component />
                            </Suspense>
                        }
                    />
                ))}
            </Route>
        </Routes>
    </>
);
}

export default App;
