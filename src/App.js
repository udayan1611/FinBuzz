// import React from 'react'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Header from './components/Header'
// import Home from './components/Home'
// import Coins from './components/Coins'
// import Exchanges from './components/Exchanges'
// import CoinDetails from './components/CoinDetails'
// import Footer from './components/Footer'


// function App() {
//   return (
//     <BrowserRouter>
//       <Header />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/coins" element={<Coins />} />
//         <Route path="/exchanges" element={<Exchanges />} />
//         <Route path="/coin/:id" element={<CoinDetails />} />
//       </Routes>
//       <Footer />
//     </BrowserRouter>
//   )
// }

// export default App

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Coins from "./components/Coins";
import Exchanges from "./components/Exchanges";
import CoinDetails from "./components/CoinDetails";
import Footer from "./components/Footer";
import Compare from "./components/Compare";
import Stocks from "./components/Stocks";
import Signup from "./components/Signup";
import Login from "./components/Login";
import CompareStocks from "./components/Comparestocks";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/exchanges" element={<Exchanges />} />
        <Route path="/coin/:id" element={<CoinDetails />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/comparestocks" element={<CompareStocks />} />
        
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;