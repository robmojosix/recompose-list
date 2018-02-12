import React from "react";
import { array } from "prop-types";
import styles from "./styles.scss";

const displayName = "Product";

const defaultProps = {
  list: []
};

const propTypes = {
  list: array
};

const component = ({ list }) => (
  <div className={styles.hello}>
    <h1>List of people:</h1>
    <ul>{list.map((item, i) => <li key={i}>{item.name}</li>)}</ul>
  </div>
);

component.displayName = displayName;
component.defaultProps = defaultProps;
component.propTypes = propTypes;
export default component;
