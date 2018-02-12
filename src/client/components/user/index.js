import React from "react";
import { string } from "prop-types";
import { compose, withState, withHandlers, mapProps, withProps, lifecycle, branch, renderComponent } from "recompose";

const displayName = "User";

const propTypes = {
  name: string
}

// examples of HOCs without using recompose

// a basic stateless functional component
const User = ({ name }) => (
  <div>
    User: {name}
  </div>
);

//                    For overridding => the stateless   => the props
//                                       component          passed to base component
const overrideProps = (overrideProps) => (BaseComponent) => (props) =>
  <BaseComponent {...props} {...overrideProps} />;

// set up override
const OverRiddenProp = overrideProps({name: "coming from override"});

// wrap with a User component
const OverRiddenUser = OverRiddenProp(User);

const neverReRender = (BaseComponent) => (
  class extends React.Component {
    shouldComponentUpdate() {
      return false;
    }
    render() {
      return <BaseComponent {...this.props} />;
    }
  }
);

const DontRenderUser = () => <User name={"no re render"} />
const DontRenderUserWrapped = neverReRender(DontRenderUser);


// HOCs using Recompose
const withToggle = compose(
  withState('toggledOn', 'toggle', false),
  withHandlers({
    show: ({ toggle }) => (e) => toggle(true),
    hide: ({ toggle }) => (e) => toggle(false),
    toggle: ({ toggle }) => (e) => toggle((current) => !current)
  })
);

//using a reducer instead
// const withToggle = compose(
//   withReducer('toggledOn', 'dispatch', (state, action) => {
//     switch(action.type) {
//       case 'SHOW':
//         return true;
//       case 'HIDE':
//         return false;
//       case 'TOGGLE':
//         return !state;
//       default:
//         return state;
//     }
//   }, false),
//   withHandlers({
//     show: ({ dispatch }) => (e) => dispatch({ type: 'SHOW' }),
//     hide: ({ dispatch }) => (e) => dispatch({ type: 'HIDE' }),
//     toggle: ({ dispatch }) => (e) => dispatch({ type: 'TOGGLE' })
//   })
// );

const StatusList = () =>
  <div className="StatusList">
    <div>pending</div>
    <div>inactive</div>
    <div>active</div>
  </div>;

const Status = withToggle(({ status, toggledOn, toggle }) =>
  <span onClick={ toggle }>
    { status }
    { toggledOn && <StatusList /> }
  </span>
);

const Tooltip = withToggle(({ text, children, toggledOn, show, hide }) =>
  <span>
    { toggledOn && <div className="Tooltip">{ text }</div> }
    <span onMouseEnter={ show } onMouseLeave={ hide }>{ children }</span>
  </span>
);

const HoverUser = ({ name, status }) =>
  <div className="User">
    <Tooltip text="Cool Dude!">{ name }</Tooltip>—
    <Status status={ status } />
  </div>;



// filter user list bu different status using mapProps form recompose
const users = [
  {name: "rob", status: 'active'},
  {name: "ben", status: 'active'},
  {name: "dan", status: 'inactive'},
  {name: "rick", status: 'pending'},
];

const filterActiveUsers = (status) => mapProps(
  ({users}) => ({
    status,
    users: users.filter((user) => user.status === status)
  })
)

const UserList = ({ users }) => (
  <ul>
    {users.map((user, i) => (
      <li key={i}>{user.name}</li>
    ))}
  </ul>
);

const ActiveUsers = filterActiveUsers('active')(UserList);
const PendingUsers = filterActiveUsers('pending')(UserList);


// use withProps to decorate components with extra props
const LinkTagWithParam = withProps(({ query }) => ({ href: '#/?query=' + query }))('a');
const LinkTag = withProps({ href: '#/link-to-page' })('a');


// use lifecycle to add fetch to dubm component
// use branch to choose different rneder hi jack
// use renderComponent in branch to render hijack and display something
// use composse to compose both methods together

const withUserData = lifecycle({
  state: { loading: true, user: [] },
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loading: false,
        user: { name: "Henry Johnson", status: 'active' }
      });
    }, 1000);
  }
});

const Spinner = () =>
  <div className="Spinner">
    <div className="loader">Loading...</div>
  </div>;

const isLoading = ({ loading }) => loading;
const withSpinnerWhileLoading = branch(
  isLoading,
  renderComponent(Spinner)
);

const enhance = compose(
  withUserData,
  withSpinnerWhileLoading
);

const UserAfterRenderHiJackForLoadingSpinner = enhance(({ user }) => {
  return (
    <div className="User">{ user.name }—{ user.status }</div>
  )
});

// Simple example of withState and withHandlers
// for adding and controlling state in a statless component
// const counterEnhance =  compose(
//   withState('counter', 'setCounter', 0),
//   withHandlers({
//     increment: ({ setCounter }) => () => setCounter(n => n + 1),
//     decrement: ({ setCounter }) => () =>  setCounter(n => n - 1),
//     reset: ({ setCounter }) => () => setCounter(0),
//   }))
// );

// exporting all examples for ease
const component = () => (
  <div>
    <UserAfterRenderHiJackForLoadingSpinner />
    <LinkTagWithParam query={"queryParam"}>Link to page with param</LinkTagWithParam>
    <LinkTag>Link to page</LinkTag>
    <ActiveUsers users={users} />
    <PendingUsers users={users} />
    <HoverUser name="Tim" status="active" />
    <DontRenderUserWrapped />
    <OverRiddenUser />
    <User name={"Robert"}/>
  </div>
);

component.displayName = displayName;
component.propTypes = propTypes;
export default component;
