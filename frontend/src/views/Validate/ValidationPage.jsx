import React, { Component } from "react";
import { notification } from "antd";

import ChainService from "../../Services/ChainService";
import DataDisplay from "../../components/DataDisplay/DataDisplay.validation";

class ValidationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resources: [],
      showValidation: false
    };

    this.chainService = new ChainService();
  }

  async componentDidMount() {
    const response = await this.chainService.validateAll();
    this.setState({ resources: response.responses, showValidation: true });
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
    const { resources, showValidation } = this.state;
    return (
      <div>
        {showValidation === true ? (
          <DataDisplay asset={resources} title="Hash comparison" />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default ValidationPage;
