import {Route, Routes, Navigate} from 'react-router-dom'
import Header from "@pages/Header/Header"
import Footer from "@pages/Footer/Footer"

import InfoPage from "@pages/InfoPage/InfoPage"
import StationsPage from "@pages/StationsPage/StationsPage"
import AccessPage from "@pages/AccessPage/AccessPage"
import Login from "@pages/Authorization/Login/Login"
import Registration from "@pages/Authorization/Registration/Registration"
import "@pages/Authorization/Authorization.scss"
import axios from 'axios';


function App() {
  
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/Information" replace />} />
        <Route path='/Information' element={<InfoPage />} />
        <Route path="/Stations" element={<StationsPage />} />
        <Route path="/Access" element={<AccessPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registration" element={<Registration />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App;
