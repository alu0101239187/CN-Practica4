import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Service from "./views/Service";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services/:name" element={<Service />} />
    </Routes>
  );
}
