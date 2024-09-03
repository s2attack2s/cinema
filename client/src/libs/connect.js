import React from "react";
import { connect as rdConnect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

export const useActions = (...actionsList) => {
  var allActions = {};

  actionsList.forEach((actions) => {
    allActions = {
      ...allActions,
      ...actions,
    };
  });
  const dispatch = useDispatch();
  return bindActionCreators(allActions, dispatch);
};

const REACT_FORWARD_REF_TYPE = 0xead0;

export const connect = (Component, mapStateToProp, actions, mapDispatchToProps) => {
  if (!Component) {
    throw new Error("Component can not be null");
  }

  const canForwardRef = typeof Component === REACT_FORWARD_REF_TYPE || Component.prototype?.render;

  const make = actions
    ? rdConnect(
        mapStateToProp,
        (dispatch) => {
          if (typeof mapDispatchToProps == "function") {
            return {
              actions: bindActionCreators(actions, dispatch),
              ...mapDispatchToProps(dispatch),
            };
          } else {
            return {
              actions: bindActionCreators(actions, dispatch),
            };
          }
        },
        null,
        { forwardRef: canForwardRef }
      )
    : rdConnect(mapStateToProp, mapDispatchToProps, null, { forwardRef: canForwardRef });

  return make(Component);
};

export { useSelector } from "react-redux";

export default connect;
