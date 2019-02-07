import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { Breadcrumb, Layout, notification } from "antd";

import "./AppContainer.css";

import CustomSider from "../../components/Navigation/CustomSider";

import Routing from "../../components/Routing/Routing";
import ChainService from "../../Services/ChainService";

const { Content, Footer } = Layout;
const { Item } = Breadcrumb;

const MyContent = ({ appState }) => (
  <Content style={{ margin: "0 16px" }}>
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Item>My</Item>
      <Item>Breadcrumb</Item>
      <Item>Path</Item>
    </Breadcrumb>
    <div style={{ minHeight: "90vh", padding: 24, background: "#fff" }}>
      <Routing appState={appState} />
    </div>
  </Content>
);

MyContent.propTypes = {
  appState: PropTypes.object
};

MyContent.defaultProps = {
  appState: {}
};

const MyFooter = () => (
  <Footer style={{ textAlign: "center", padding: 0, paddingBottom: 5 }}>
    <b>Alle getoonde data is fictief</b> - Bewire ©2018 Created by Trase
  </Footer>
);

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.chainService = new ChainService();
  }

  openNotification = (title, message) => {
    const args = {
      message: title,
      description: message,
      duration: 5
    };
    notification.open(args);
  };

  render() {
    return (
      <Layout style={{ width: "auto", minHeight: "100vh" }}>
        <CustomSider {...this.props} />
        <Layout>
          <MyContent appState={this.state} />
          <MyFooter />
        </Layout>
      </Layout>
    );
  }
}

AppContainer.propTypes = {
  appState: PropTypes.object
};

AppContainer.defaultProps = {
  appState: {}
};

export default withRouter(AppContainer);
