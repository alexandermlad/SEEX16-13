/*
 * ALMA - Atacama Large Millimeter Array
 * Copyright (c) UKATC - UK Astronomy Technology Centre, Science and Technology Facilities Council, 2011
 * (in the framework of the ALMA collaboration).
 * All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307  USA
 */
import React, { Component, PropTypes } from 'react';
//var ReactDOM=require('react-dom');
var FormGroup = require('react-bootstrap').FormGroup;
var FormControl = require('react-bootstrap').FormControl;
var HelpBlock = require('react-bootstrap').HelpBlock;

export default class Antennas extends Component {
  /**
   * Check value is an integer and if coerced that the value
   * is the same as the one displayed
   *
   * @param  {[type]} value to check
   * @return {Boolean} true if an integer
   */
  isAnInteger(value) {
    const intValue = parseInt(value, 10);
    return intValue === +value && intValue > 0;
  }

  /**
   * Standardised check used for field level validation
   * The number of antennas should always be a positive whole number
   *  (this may need to be constrained by max antennas available in finished calc)
   *
   * Note: if invalid value.validationError should be set to indicate the reason
   * for the failure
   *
   * @return {[string]} 'success' if valid / 'error' if invalid
   */
  getValidationState() {
    const { value } = this.props;

    //point value is always acceptible
    if (this.isAnInteger(value.value)) {
      value.validationError = null;
      return 'success';
    }

    value.validationError = 'Must be a positive integer';
    return 'error';
  }

  /**
   * Renders the Antenna element
   * @see Antenna.propTypes for detaiols of the expected inputs
   *
   * @return {[type]} Rendered element
   */
  render() {
    const { value, onChange } = this.props;

    return (
      <FormGroup validationState={this.getValidationState()}>
        <FormControl
          type="text"
          className="col-sm-12 last"
          placeholder="No. Of Antennas"
          name="Antennas"
          onChange={e => onChange(e.target.value)}
          value={value.value}
        />{' '}
        <FormControl.Feedback />
        <HelpBlock>
          {' '}
          {this.getValidationState() === 'success' ? null : value.validationError}{' '}
        </HelpBlock>{' '}
      </FormGroup>
    );
  }
}

/**
 * Expects an object consisting of a 'value' object representing the number of antennas and
 * an 'onChange' method that will be called each time the value is updated.
 *
 * value  - an object consisting of:
 *    value - the current value
 *    validationError - a description of any validation issues relating to the current value
 *
 * onChange - method called whenever the value is updated on the UI
 *
 * TODO - tighten the propTypes
 *
 * @type {Object}
 */
Antennas.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
