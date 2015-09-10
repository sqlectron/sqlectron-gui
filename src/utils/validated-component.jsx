import React from 'react';

export default process.env.NODE_ENV === 'production' ? React.Component : class PureComponent extends React.Component {

  componentWillMount() {
    this.validateProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.validateProps(nextProps);
  }

  validateProps(props) {
    const {displayName, name, propTypes} = this.constructor;
    const componentName = displayName || name;
    if (!propTypes) {
      console.warn(`There are no PropTypes specified on component "${componentName}". Cannot validate props. The given props are: `, props);
      return;
    }
    for (let prop in props) {
      if (!propTypes[prop]) {
        console.warn(`You set a property "${prop}" on Component "${componentName}" but did not provide a PropType declaration for this prop.`);
      }
    }
  }

}
