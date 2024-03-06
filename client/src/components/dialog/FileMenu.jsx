import { Menu, formLabelClasses } from "@mui/material";
import React from "react";

const FileMenu = ({ anchor }) => {
  console.log("anchor:", anchor);
  return (
    <Menu anchorEl={anchor} open={false}>
      <div style={{ width: "10rem" }}>
        nsdklhgiuhsngiudfsngiufhksdngilufhdngiluhngilukhfjngiluhkfsngusjknjhlndslhjn
      </div>
    </Menu>
  );
};

export default FileMenu;
