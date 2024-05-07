import {BrowserRouter, Route, Routes} from "react-router-dom"
import {ToastContainer} from "react-toastify"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import ActiveTodos from "./pages/ActiveTodos"
import UsersPage from "./pages/UsersPage"
import "react-toastify/dist/ReactToastify.css"

import ProtectedRoute from "./ProtectedRoute"
import CompeletedTodos from "./pages/CompeletedTodos"

const Routing = () => {
  return (
    <>
      <div>
        <BrowserRouter>
          <ToastContainer
            autoClose={2000}
            position={"top-center"}
            hideProgressBar={false}
          />
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="signUp" element={<SignUp />} />
            <Route
              path="active"
              element={
                <ProtectedRoute>
                  <ActiveTodos />
                </ProtectedRoute>
              }
            />
            <Route
              path="completed"
              element={
                <ProtectedRoute>
                  <CompeletedTodos />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ActiveTodos />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}
export default Routing
