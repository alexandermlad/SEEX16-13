/*******************************************************************************
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
 *******************************************************************************/
import React, {
  //Component,
  PropTypes
} from 'react';
import {
  //checkBoundsDDMMSS,
  //regenerateDeclinationValues,
  milliarcsecondsToString
  //reformatFormattedValue,
  //stringToMilliarcsecNoColons,
  //MILLISECS_PER_UNIT,
  //velocityToGHz
} from '../utilities/converters';

//var ReactDOM = require('react-dom');
//var DropdownButton = require('react-bootstrap').DropdownButton;
//var SplitButton = require('react-bootstrap').DropdownButton;
var FormGroup = require('react-bootstrap').FormGroup;
var FormControl = require('react-bootstrap').FormControl;
//var InputGroup = require('react-bootstrap').InputGroup;
//var MenuItem = require('react-bootstrap').MenuItem;
var HelpBlock = require('react-bootstrap').HelpBlock;

export default class Declination extends React.Component {
  getValidationState() {
    const { value } = this.props;

    if (!value.isValid) {
      return 'error';
    }

    if (value.inDegrees > 66.5) {
      value.validationError =
        'Source at declination ' + milliarcsecondsToString(value.mas) + ' is not visible.';
      return 'error';
    }

    const length = value.length;
    if (length === 0) {
      return 'error';
    }

    return 'success';
  }

  render() {
    const { value, onChange, onBlur } = this.props;

    return (
      <FormGroup controlId="declination" validationState={this.getValidationState()}>
        <FormControl
          type="text"
          className="col-sm-7 last"
          placeholder="Declination"
          name="Dec"
          onChange={e => onChange(e.target.value)}
          onBlur={e => onBlur(e.target.value)}
          value={value.formattedValue}
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

Declination.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
};
