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
import React, { Component, PropTypes } from 'react';

//var ReactDOM=require('react-dom');
//var DropdownButton=require('react-bootstrap').DropdownButton;
var SplitButton = require('react-bootstrap').DropdownButton;
//var FormGroup=require('react-bootstrap').FormGroup;
var FormControl = require('react-bootstrap').FormControl;
var InputGroup = require('react-bootstrap').InputGroup;
var MenuItem = require('react-bootstrap').MenuItem;

export default class Frequency extends Component {
  render() {
    const { value, onChange, onChangeUnit } = this.props;

    var markAsValid = value.isValid;
    var markAsRequired = value.required && !value;
    var className = '';

    if (markAsRequired) {
      className += 'has-warning';
    } else if (!markAsValid) {
      className += 'has-error';
    }

    return (
      <div className="col-sm-7 last">
        <InputGroup className={className}>
          <FormControl
            type="text"
            min="0"
            value={value.value}
            onChange={e => onChange(e.target.value, e.eventKey)}
            id="ofValue"
          />
          <SplitButton
            componentClass={InputGroup.Button}
            id="units"
            title={value.unit}
            onSelect={e => onChangeUnit(e)}
            pullRight
          >
            <MenuItem eventKey={'Hz'}> Hz </MenuItem> <MenuItem eventKey={'kHz'}> kHz </MenuItem>{' '}
            <MenuItem eventKey={'MHz'}> MHz </MenuItem> <MenuItem eventKey={'GHz'}> GHz </MenuItem>{' '}
          </SplitButton>
        </InputGroup>{' '}
        <span> {markAsValid || markAsRequired ? null : value.validationError} </span>{' '}
      </div>
    );
  }
}

Frequency.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
