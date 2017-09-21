import React, { Component } from 'react'

export default class Roles extends Component {
  render() {
    return (
      <div className="roles">
        <h1>
          {this.props.role}
        </h1>
      </div>
    );
  }
}
