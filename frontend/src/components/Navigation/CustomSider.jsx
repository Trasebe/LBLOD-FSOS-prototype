import React, { Component } from "react";
import { Layout } from "antd";

import "./CustomSider.css";
import MenuRoutes from "./MenuRoutes";

const { Sider } = Layout;

class CustomSider extends Component {
  state = {
    collapsed: false
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;

    return (
      <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        <MenuRoutes />
      </Sider>
    );
  }
}

export default CustomSider;
