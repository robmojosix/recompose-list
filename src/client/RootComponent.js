import React from "react";
import { User, List } from "./components/";

export default class Root extends React.Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({
    //     users: [{ name: "Henry Johnson", id: 1 }, { name: "Ben Smith", id: 2 }]
    //   });
    // }, 1000);
  }

  render() {
    return (
      <div>
        <User name={"Rob"} />
        <List list={this.state.users} />
      </div>
    );
  }
}
