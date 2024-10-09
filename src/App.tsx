import React, { useState, useEffect } from "react";
import axios from "axios";
import ChildComponent from "./components/ChildComponent";
import ParentComponent from "./components/ParentComponent";
import "./styles/parentComponent.scss";
const App = () => {
  return (
    <>
      <ParentComponent />
    </>
  );
};

export default App;
