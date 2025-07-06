import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router";
import ListOfOrchids from "./components/ListOfOrchids";
import EditOrchid from "./components/EditOrchid";
import HomeScreen from "./components/HomeScreen";
import NavBar from "./components/NavBar";
import ListOfEmployees from "./components/ListOfEmployees";
import DetailOrchid from "./components/DetailOrchid";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<ListOfOrchids />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/orchids" element={<ListOfEmployees />} />
        <Route path="/detail/:id" element={<DetailOrchid />} />
        <Route path="/edit/:id" element={<EditOrchid />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </>
  );
}

export default App;
