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
import React, { PropTypes, Component } from 'react';
//var ReactDOM = require('react-dom');
//var DropdownButton = require('react-bootstrap').DropdownButton;
//var SplitButton = require('react-bootstrap').DropdownButton;
//var FormGroup = require('react-bootstrap').FormGroup;
//var FormControl = require('react-bootstrap').FormControl;
//var InputGroup = require('react-bootstrap').InputGroup;
//var MenuItem = require('react-bootstrap').MenuItem;

export default class OctileDetails extends Component {
  render() {
    const { value } = this.props;

    return (
      <fieldset disabled>
        <div className="form-group disabled">
          <label className="col-sm-4 control-label disabled">Trx, tau, Tsky</label>{' '}
          <div className="col-sm-7 last">
            <input
              className="form-control"
              type="text"
              name="tau"
              value={value.result.tauAndTsky || 'Unknown'}
              readOnly
            />
          </div>{' '}
        </div>{' '}
        <div className="form-group disabled">
          <label className="col-sm-4 control-label" disabled>
            {' '}
            Tsys{' '}
          </label>{' '}
          <div className="col-sm-7 last">
            <input
              className="form-control"
              type="text"
              name="tsys"
              value={value.result.tsys || 'Unknown'}
              readOnly
            />
          </div>{' '}
        </div>{' '}
      </fieldset>
    );
  }
}

OctileDetails.propTypes = {
  value: PropTypes.object.isRequired
};
