/* eslint-disable */
import React from "react";

import { Icon, Menu } from "antd";
import { Link } from "react-router-dom";

const { Item, SubMenu } = Menu;

const MenuRoutes = () => (
  <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
    {/* ==================
        Query
    ================== */}
    <Item key="home">
      <Icon type="question-circle-o" />
      <span>HOME</span>
      <Link to="/" />
    </Item>
  </Menu>
);

export default MenuRoutes;
