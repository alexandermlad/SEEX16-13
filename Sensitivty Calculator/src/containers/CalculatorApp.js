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
/* jshint node: true */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  selectOctile,
  selectBand,
  fetchOctileDetailsIfNeeded,
  fetchCurrentReceiverBandsIfNeeded,
  updateDeclination,
  formatDeclination,
  updateFrequency,
  updateFrequencyUnit,
  updateBandwidth,
  updateBandwidthUnit,
  updateTwelveSensitivity,
  updateTwelveSensitivityUnit,
  refreshTwelveAltSensitivity,
  updateSevenSensitivity,
  updateSevenSensitivityUnit,
  refreshSevenAltSensitivity,
  updateTotalPowerSensitivity,
  updateTotalPowerSensitivityUnit,
  refreshTotalPowerAltSensitivity,
  updateTwelveTime,
  updateTwelveTimeUnit,
  updateTwelveAntennas,
  updateSevenTime,
  updateSevenTimeUnit,
  updateSevenAntennas,
  updateTotalPowerTime,
  updateTotalPowerTimeUnit,
  updateTotalPowerAntennas,
  updateTwelveResolution,
  updateTwelveResolutionUnit,
  updateSevenResolution,
  updateSevenResolutionUnit,
  updateTotalPowerResolution,
  updateTotalPowerResolutionUnit,
  updatePolarisation,
  updateOctileSelectionOption,
  calculateAllTheSensitivities,
  calculateAllTheTimes,
  updateIntegrationUnitOption,
  updateSensitivityUnitOption
} from '../actions';

import { MODIFIER_KEY } from '../components/CalcConstants';
import { FluxConversions } from '../utilities/fluxConversions';

// Custom components
import Picker from '../components/Picker';
import OctileDetails from '../components/OctileDetails';
import Declination from '../components/Declination';
import Frequency from '../components/Frequency';
import OctileOption from '../components/OctileOption';
import Resolution from '../components/Resolution';
import Sensitivity from '../components/Sensitivity';
import Time from '../components/Time';
import Antennas from '../components/Antennas';
import Bandwidth from '../components/Bandwidth';

var FormGroup = require('react-bootstrap').FormGroup;

/**
 * @class
 *
 * The main Sensitivity Calculator component
 *
 * Most of the methods relate to the application level notifications
 *
 */
class CalculatorApp extends Component {
  /**
   * This is where we ensure that all
   * the functions are bound to the same 'this' so that they have access
   * to the same set of shared properties
   *
   * <br>
   *
   * Note: Every time we add a function that makes use of the props it needs to be added
   * into here
   *
   * @param  {properties} props - the properties for the calculator
   */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleNewDec = this.handleNewDec.bind(this);
    this.handleNewBand = this.handleNewBand.bind(this);
    this.reformatDec = this.reformatDec.bind(this);
    this.handleNewFreq = this.handleNewFreq.bind(this);
    this.handleNewFreqUnit = this.handleNewFreqUnit.bind(this);
    this.handleNewBandwidth = this.handleNewBandwidth.bind(this);
    this.handleNewBandwidthUnit = this.handleNewBandwidthUnit.bind(this);
    this.handleNewPolarisation = this.handleNewPolarisation.bind(this);
    this.handleNewOctileSelectionOption = this.handleNewOctileSelectionOption.bind(this);
    this.handleNewTwelveSensitivity = this.handleNewTwelveSensitivity.bind(this);
    this.handleNewTwelveResolution = this.handleNewTwelveResolution.bind(this);
    this.handleNewTwelveTime = this.handleNewTwelveTime.bind(this);
    this.handleNewTwelveAntennas = this.handleNewTwelveAntennas.bind(this);
    this.handleNewTwelveSensitivityUnit = this.handleNewTwelveSensitivityUnit.bind(this);
    this.handleNewTwelveResolutionUnit = this.handleNewTwelveResolutionUnit.bind(this);
    this.handleNewTwelveTimeUnit = this.handleNewTwelveTimeUnit.bind(this);
    this.handleNewSevenSensitivity = this.handleNewSevenSensitivity.bind(this);
    this.handleNewSevenResolution = this.handleNewSevenResolution.bind(this);
    this.handleNewSevenTime = this.handleNewSevenTime.bind(this);
    this.handleNewSevenAntennas = this.handleNewSevenAntennas.bind(this);
    this.handleNewSevenSensitivityUnit = this.handleNewSevenSensitivityUnit.bind(this);
    this.handleNewSevenResolutionUnit = this.handleNewSevenResolutionUnit.bind(this);
    this.handleNewSevenTimeUnit = this.handleNewSevenTimeUnit.bind(this);
    this.handleNewTotalPowerSensitivity = this.handleNewTotalPowerSensitivity.bind(this);
    this.handleNewTotalPowerResolution = this.handleNewTotalPowerResolution.bind(this);
    this.handleNewTotalPowerTime = this.handleNewTotalPowerTime.bind(this);
    this.handleNewTotalPowerAntennas = this.handleNewTotalPowerAntennas.bind(this);
    this.handleNewTotalPowerSensitivityUnit = this.handleNewTotalPowerSensitivityUnit.bind(this);
    this.handleNewTotalPowerResolutionUnit = this.handleNewTotalPowerResolutionUnit.bind(this);
    this.handleNewTotalPowerTimeUnit = this.handleNewTotalPowerTimeUnit.bind(this);
    this.calculateSensitivity = this.calculateSensitivity.bind(this);
    this.calculateIntegrationTime = this.calculateIntegrationTime.bind(this);
    this.handleNewIntegrationUnitOption = this.handleNewIntegrationUnitOption.bind(this);
    this.handleNewSensitivityUnitOption = this.handleNewSensitivityUnitOption.bind(this);

    this.checkIfModifierKeyPressed = this.checkIfModifierKeyPressed.bind(this);
    this.checkIfModifierKeyReleased = this.checkIfModifierKeyReleased.bind(this);
    this.updateResolutionWhenFrequencyChanged = this.updateResolutionWhenFrequencyChanged.bind(
      this
    );
    this.state = { unitsShouldBeScaled: false };
  }

  /**
   * Called after the calculator is mounted
   *
   * At this point all the calculator properties should  have been constructed so we can populate
   * a request for the latest octile details from the service.
   *
   * @see fetchOctileDetailsIfNeeded
   *
   */
  componentDidMount() {
    const { dispatch, selectedOctile, declination, frequency, selectedBand, octileSelectionOption } = this.props;
    dispatch(
      fetchOctileDetailsIfNeeded(selectedOctile, declination, frequency, selectedBand, octileSelectionOption)
    );
  }

  /**
   * Any change in the observing frequency will affect the beamsize
   * so we need to recalculate the automatically generated beamsize used for the Total Power.
   *
   * Since the 7m and 12m array beamsizes are set by the user they have no equivalent method.
   *
   * @param {number} frequencyInGHz - the new observing frequency in GHz
   *
   * @see  FluxConversions.calculateBeamsize for the beamwidth calculation
   *
   */
  updateResolutionWhenFrequencyChanged(frequencyInGHz) {
    if (frequencyInGHz > 0) {
      const newResolution = FluxConversions.calculateBeamsize(frequencyInGHz);
      this.props.dispatch(updateTotalPowerResolution(newResolution));
    }
  }


    /**
   * Any change in the observing frequency may change the observing band
   * so we need to query to get the current list of bands available
   *
   * Since the 7m and 12m array beamsizes are set by the user they have no equivalent method.
   *
   * @param {number} frequencyInGHz - the new observing frequency in GHz
   *
   */
  updateReceiverBandWhenFrequencyChanged(frequencyInGHz) {
    if (frequencyInGHz > 0) {
      this.props.dispatch(fetchCurrentReceiverBandsIfNeeded(frequencyInGHz)
      );
    }
  }

  /**
   * Invoked any time the properties for the calculator have changed. Used as a placeholder
   * for logic that needs to be triggered after the value of the new properties
   * is known, but before the components have been updated.
   *
   * At the moment the scenarios are:
   *
   * <ul>
   * <li>Whenever the sensitivity or the alternative sensitivity values have changed for any array</li>
   * <li>Whenever the observing frequency has changed and so the sensitivity needs recalculated</li>
   * <li>Whenever the 12m or 7m resolution has changed</li>
   * <li>Whenever  the RA or Selected Octile have changed which could change the current octile</li>
   * </ul>
   *
   * @todo now that this logic is stable it should be refactored into separate methods
   * @params {props} nextProps - the new values for all of the properties
   *
   */
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedOctile !== this.props.selectedOctile ||
      nextProps.declination.inDegrees !== this.props.declination.inDegrees ||
      nextProps.frequency.value !== this.props.frequency.value ||
      nextProps.frequency.unit !== this.props.frequency.unit ||
      nextProps.selectedBand !== this.props.selectedBand ||
      nextProps.octileSelectionOption !== this.props.octileSelectionOption
    ) {
      const { dispatch, selectedOctile, declination, frequency, selectedBand, octileSelectionOption } = nextProps;
      dispatch(
        fetchOctileDetailsIfNeeded(selectedOctile, declination, frequency, selectedBand, octileSelectionOption)
      );
    }

    /**
     * Triggered recalculation of the alt values if  any of the sensitivity, frequency or resolution change
     */
    if (
      nextProps.twelveSensitivity.value !== this.props.twelveSensitivity.value ||
      nextProps.twelveSensitivity.unit !== this.props.twelveSensitivity.unit ||
      nextProps.frequency.value !== this.props.frequency.value ||
      nextProps.frequency.unit !== this.props.frequency.unit ||
      nextProps.twelveResolution.value !== this.props.twelveResolution.value ||
      nextProps.twelveResolution.unit !== this.props.twelveResolution.unit
    ) {
      const {
        dispatch,
        frequency,
        twelveSensitivity,
        twelveResolution,
        sensitivityUnitOption
      } = nextProps;
      if (isNaN(nextProps.twelveSensitivity.value)) {
        console.log(
          "WARNING @ 12m Recalculation : Reached here and bombed out because the 12 sensitivity value is NaN  - shouldn't be happening ",
          nextProps.twelveSensitivity.value,
          nextProps.twelveSensitivity.altValue
        );
      } else {
        dispatch(
          refreshTwelveAltSensitivity(
            twelveSensitivity,
            frequency,
            twelveResolution,
            sensitivityUnitOption
          )
        );
      }
    }

    /**
     * Triggered recalculation of the alt values if  the altSensitivity has been recalculated to a different valid value for the 7m (i.e needs resecaled)
     */

    if (
      (nextProps.sevenSensitivity.altValue !== this.props.sevenSensitivity.altValue ||
        nextProps.sevenSensitivity.altUnit !== this.props.sevenSensitivity.altUnit) &&
      nextProps.sevenSensitivity.altValue === this.props.sevenSensitivity.altValue
    ) {
      const {
        dispatch,
        frequency,
        sevenSensitivity,
        sevenResolution,
        sensitivityUnitOption
      } = nextProps;
      dispatch(
        refreshSevenAltSensitivity(
          sevenSensitivity,
          frequency,
          sevenResolution,
          sensitivityUnitOption
        )
      );
    }

    /**
     * Triggered recalculation of the alt values if  the altSensitivity has been recalculated to a different valid value for the TP (i.e needs resecaled)
     */
    if (
      (nextProps.totalPowerSensitivity.altValue !== this.props.totalPowerSensitivity.altValue ||
        nextProps.totalPowerSensitivity.altUnit !== this.props.totalPowerSensitivity.altUnit) &&
      nextProps.totalPowerSensitivity.altValue === this.props.totalPowerSensitivity.altValue
    ) {
      const {
        dispatch,
        frequency,
        totalPowerSensitivity,
        totalPowerResolution,
        sensitivityUnitOption
      } = nextProps;
      dispatch(
        refreshTotalPowerAltSensitivity(
          totalPowerSensitivity,
          frequency,
          totalPowerResolution,
          sensitivityUnitOption
        )
      );
    }

    /**
     * Triggered if the 12m sensitivity, frequency or resolution have changed as the alternate value for the 12m array
     * will no longer be correct
     */
    if (
      (nextProps.twelveSensitivity.altValue !== this.props.twelveSensitivity.altValue ||
        nextProps.twelveSensitivity.altUnit !== this.props.twelveSensitivity.altUnit) &&
      nextProps.twelveSensitivity.altValue === this.props.twelveSensitivity.altValue
    ) {
      const {
        dispatch,
        frequency,
        twelveSensitivity,
        twelveResolution,
        sensitivityUnitOption
      } = nextProps;
      if (isNaN(nextProps.twelveSensitivity.altValue)) {
        console.log(
          "WARNING: @ 12m Alt Refresh : Reached here and bombed out because the 12 sensitivity value is NaN  - shouldn't be happening ",
          nextProps.twelveSensitivity.value,
          nextProps.twelveSensitivity.altValue
        );
      } else {
        dispatch(
          refreshTwelveAltSensitivity(
            twelveSensitivity,
            frequency,
            twelveResolution,
            sensitivityUnitOption
          )
        );
      }
    }

    /**
     * Triggered if the 7m sensitivity, frequency or resolution have changed as the alternate value for the 7m array
     * will no longer be correct
     */
    if (
      nextProps.sevenSensitivity.value !== this.props.sevenSensitivity.value ||
      nextProps.sevenSensitivity.unit !== this.props.sevenSensitivity.unit ||
      nextProps.frequency.value !== this.props.frequency.value ||
      nextProps.frequency.unit !== this.props.frequency.unit ||
      nextProps.sevenResolution.value !== this.props.sevenResolution.value ||
      nextProps.sevenResolution.unit !== this.props.sevenResolution.unit
    ) {
      const {
        dispatch,
        frequency,
        sevenSensitivity,
        sevenResolution,
        sensitivityUnitOption
      } = nextProps;
      dispatch(
        refreshSevenAltSensitivity(
          sevenSensitivity,
          frequency,
          sevenResolution,
          sensitivityUnitOption
        )
      );
    }

    /**
     * Triggered if the TP sensitivity, frequency or resolution have changed as the alternate value for the TP  array
     * will no longer be correct
     */
    if (
      nextProps.totalPowerSensitivity.value !== this.props.totalPowerSensitivity.value ||
      nextProps.totalPowerSensitivity.unit !== this.props.totalPowerSensitivity.unit ||
      nextProps.frequency.value !== this.props.frequency.value ||
      nextProps.frequency.unit !== this.props.frequency.unit ||
      nextProps.totalPowerResolution.value !== this.props.totalPowerResolution.value ||
      nextProps.totalPowerResolution.unit !== this.props.totalPowerResolution.unit
    ) {
      const {
        dispatch,
        frequency,
        totalPowerSensitivity,
        totalPowerResolution,
        sensitivityUnitOption
      } = nextProps;
      dispatch(
        refreshTotalPowerAltSensitivity(
          totalPowerSensitivity,
          frequency,
          totalPowerResolution,
          sensitivityUnitOption
        )
      );
    }
    if (
      nextProps.frequency.value !== this.props.frequency.value ||
      nextProps.frequency.unit !== this.props.frequency.unit
    ) {
      const oldFreqInGHz = this.props.frequency.value * this.props.frequency.scale;
      const newFreqInGHz = nextProps.frequency.value * nextProps.frequency.scale;
      if (oldFreqInGHz !== newFreqInGHz) {
        this.updateResolutionWhenFrequencyChanged(newFreqInGHz);
        this.updateReceiverBandWhenFrequencyChanged(newFreqInGHz);
      }
    }
  }

  /*
   * @todo Many of the 'handle*' methods are not doing any work - it should be possible
   * to invoke dispatch directly which would simplify a lot of this code.
   */

  /**
   * handle the update of the octile picker
   * @see  action.selectOctile
   *
   * @param  {string} nextOctile - octile key
   */
  handleChange(nextOctile) {
    this.props.dispatch(selectOctile(nextOctile));
  }

  /**
   * handle the update of the octile picker
   * @see  action.selectBand
   *
   * @param  {string} nextBand - observingBandKey
   */
  handleNewBand(nextBand) {
    this.props.dispatch(selectBand(nextBand));
  }





  /**
   * handle the update of the declination by calling the octile reducer
   *
   * @param  {string} nextOctile - octile key
   */
  handleNewDec(newDeclination, modifier) {
    this.props.dispatch(updateDeclination(newDeclination));
  }

  // handle the update of the declination by calling the
  // update declination reducer
  reformatDec(newDeclination) {
    const { declination } = this.props;
    this.props.dispatch(formatDeclination(newDeclination, declination));
  }

  // handle the update of the frequency by calling the
  // update bandwidth reducer
  handleNewBandwidth(bandwidth) {
    this.props.dispatch(updateBandwidth(bandwidth));
  }
  handleNewBandwidthUnit(bandwidthUnit) {
    const shouldBeScaled = this.state.unitsShouldBeScaled;
    this.props.dispatch(updateBandwidthUnit(bandwidthUnit, shouldBeScaled));
  }

  handleNewFreq(frequency) {
    this.props.dispatch(updateFrequency(frequency));
  }

  handleNewFreqUnit(unit) {
    const shouldBeScaled = this.state.unitsShouldBeScaled;
    this.props.dispatch(updateFrequencyUnit(unit, shouldBeScaled));
  }

  // handle the update of the sensitivity by calling the appropriate reducer
  handleNewTwelveSensitivity(newSensitivity) {
    const { twelveSensitivity, dispatch, frequency, twelveResolution } = this.props;
    dispatch(
      updateTwelveSensitivity(twelveSensitivity, newSensitivity, frequency, twelveResolution)
    );
  }

  handleNewSevenSensitivity(newSensitivity) {
    const { sevenSensitivity, dispatch, frequency, sevenResolution } = this.props;
    dispatch(updateSevenSensitivity(sevenSensitivity, newSensitivity, frequency, sevenResolution));
  }

  handleNewTotalPowerSensitivity(newSensitivity) {
    const { totalPowerSensitivity, dispatch, frequency, totalPowerResolution } = this.props;
    dispatch(
      updateTotalPowerSensitivity(
        totalPowerSensitivity,
        newSensitivity,
        frequency,
        totalPowerResolution
      )
    );
  }

  handleNewTwelveSensitivityUnit(sensitivityUnit) {
    const shouldBeScaled = this.state.unitsShouldBeScaled;
    this.props.dispatch(updateTwelveSensitivityUnit(sensitivityUnit, shouldBeScaled));
  }
  handleNewSevenSensitivityUnit(sensitivityUnit) {
    const shouldBeScaled = this.state.unitsShouldBeScaled;
    this.props.dispatch(updateSevenSensitivityUnit(sensitivityUnit, shouldBeScaled));
  }
  handleNewTotalPowerSensitivityUnit(sensitivityUnit) {
    const shouldBeScaled = this.state.unitsShouldBeScaled;
    this.props.dispatch(updateTotalPowerSensitivityUnit(sensitivityUnit, shouldBeScaled));
  }

  handleNewTwelveResolution(resolution) {
    this.props.dispatch(updateTwelveResolution(resolution));
  }
  handleNewTwelveResolutionUnit(resolution) {
    const shouldBeScaled = this.state.unitsShouldBeScaled;
    this.props.dispatch(updateTwelveResolutionUnit(resolution, shouldBeScaled));
  }
  handleNewSevenResolution(resolution) {
    this.props.dispatch(updateSevenResolution(resolution));
  }
  handleNewSevenResolutionUnit(resolution) {
    const shouldBeScaled = this.state.unitsShouldBeScaled;
    this.props.dispatch(updateSevenResolutionUnit(resolution, shouldBeScaled));
  }
  handleNewTotalPowerResolution(resolution) {
    this.props.dispatch(updateTotalPowerResolution(resolution));
  }
  handleNewTotalPowerResolutionUnit(resolution) {
    const shouldBeScaled = this.state.unitsShouldBeScaled;
    this.props.dispatch(updateTotalPowerResolutionUnit(resolution, shouldBeScaled));
  }

  handleNewTwelveTime(value) {
    this.props.dispatch(updateTwelveTime(value));
  }
  handleNewTwelveTimeUnit(unit) {
    const shouldBeScaled = this.state.unitsShouldBeScaled;
    this.props.dispatch(updateTwelveTimeUnit(unit, shouldBeScaled));
  }
  handleNewSevenTime(value) {
    this.props.dispatch(updateSevenTime(value));
  }
  handleNewSevenTimeUnit(unit) {
    const shouldBeScaled = this.state.unitsShouldBeScaled;
    this.props.dispatch(updateSevenTimeUnit(unit, shouldBeScaled));
  }
  handleNewTotalPowerTime(value) {
    this.props.dispatch(updateTotalPowerTime(value));
  }
  handleNewTotalPowerTimeUnit(unit) {
    const shouldBeScaled = this.state.unitsShouldBeScaled;
    this.props.dispatch(updateTotalPowerTimeUnit(unit, shouldBeScaled));
  }

  handleNewTwelveAntennas(value) {
    this.props.dispatch(updateTwelveAntennas(value));
  }
  handleNewSevenAntennas(value) {
    this.props.dispatch(updateSevenAntennas(value));
  }
  handleNewTotalPowerAntennas(value) {
    this.props.dispatch(updateTotalPowerAntennas(value));
  }

  // handle changes to the way units are displayed after calculation
  handleNewIntegrationUnitOption(integrationUnitOption) {
    this.props.dispatch(updateIntegrationUnitOption(integrationUnitOption));
  }
  handleNewSensitivityUnitOption(sensitivityUnitOption) {
    this.props.dispatch(updateSensitivityUnitOption(sensitivityUnitOption));
  }

  // handle the update of the frequency by calling the
  // update polarisation reducer
  handleNewPolarisation(newPolarisation) {
    this.props.dispatch(updatePolarisation(newPolarisation));
  }

  // handle the enablement of the octile selection
  handleNewOctileSelectionOption(newOctileSelection) {
    document.getElementById('OctileManualSelectionFieldset').disabled =
      newOctileSelection === 'Automatic';
    this.props.dispatch(updateOctileSelectionOption(newOctileSelection));
  }

  calculateSensitivity() {
    const {
      dispatch,
      bandwidth,
      declination,
      frequency,
      selectedOctile,
      polarisation,
      twelveAntennas,
      twelveResolution,
      twelveTime,
      twelveSensitivity,
      sevenAntennas,
      sevenResolution,
      sevenTime,
      sevenSensitivity,
      totalPowerAntennas,
      totalPowerResolution,
      totalPowerTime,
      totalPowerSensitivity,
      sensitivityUnitOption,
      selectedBand
    } = this.props;
    dispatch(
      calculateAllTheSensitivities(
        bandwidth,
        declination,
        frequency,
        selectedOctile,
        polarisation,
        twelveAntennas,
        twelveResolution,
        twelveTime,
        twelveSensitivity,
        sevenAntennas,
        sevenResolution,
        sevenTime,
        sevenSensitivity,
        totalPowerAntennas,
        totalPowerResolution,
        totalPowerTime,
        totalPowerSensitivity,
        sensitivityUnitOption,
        selectedBand
      )
    );
  }

  calculateIntegrationTime() {
    const {
      dispatch,
      bandwidth,
      declination,
      frequency,
      selectedOctile,
      polarisation,
      twelveAntennas,
      twelveResolution,
      twelveSensitivity,
      sevenAntennas,
      sevenResolution,
      sevenSensitivity,
      totalPowerAntennas,
      totalPowerResolution,
      totalPowerSensitivity,
      sevenTime,
      twelveTime,
      totalPowerTime,
      integrationUnitOption,
      selectedBand
    } = this.props;
    dispatch(
      calculateAllTheTimes(
        bandwidth,
        declination,
        frequency,
        selectedOctile,
        polarisation,
        twelveAntennas,
        twelveResolution,
        twelveSensitivity,
        sevenAntennas,
        sevenResolution,
        sevenSensitivity,
        totalPowerAntennas,
        totalPowerResolution,
        totalPowerSensitivity,
        sevenTime,
        twelveTime,
        totalPowerTime,
        integrationUnitOption,
        selectedBand
      )
    );
  }

  checkIfModifierKeyPressed(e) {
    if (e.keyCode === MODIFIER_KEY && this.state.unitsShouldBeScaled === false) {
      this.setState({ unitsShouldBeScaled: true });
    }
  }

  checkIfModifierKeyReleased(e) {
    if (e.keyCode === MODIFIER_KEY && this.state.unitsShouldBeScaled === true) {
      this.setState({ unitsShouldBeScaled: false });
    }
  }

  render() {
    const {
      selectedOctile,
      octileSelectionOption,
      octileDetails,
      declination,
      frequency,
      selectedBand,
      availableBands,
      polarisation,
      bandwidth,
      twelveSensitivity,
      sevenSensitivity,
      totalPowerSensitivity,
      twelveTime,
      sevenTime,
      totalPowerTime,
      twelveResolution,
      sevenResolution,
      totalPowerResolution,
      twelveAntennas,
      sevenAntennas,
      totalPowerAntennas
    } = this.props;

    const frequencyInGHz = frequency.value * frequency.scale;

    return (
      <div onKeyDown={this.checkIfModifierKeyPressed} onKeyUp={this.checkIfModifierKeyReleased}>
        <div className="panel panel-default">
          <div className="panel-heading">Common Parameters </div>{' '}
          <div className="panel-body">
            <form className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-4 control-label"> Declination </label>{' '}
                <div className="col-sm-7 last">
                  <Declination
                    value={declination}
                    onChange={this.handleNewDec}
                    onBlur={this.reformatDec}
                  />{' '}
                </div>{' '}
              </div>{' '}
              <div className="form-group">
                <label className="col-sm-4 control-label"> Polarisation </label>{' '}
                <div className="col-sm-7 last">
                  <Picker
                    value={polarisation}
                    onChange={this.handleNewPolarisation}
                    options={[['1', 'Single'], ['2', 'Dual']]}
                  />{' '}
                </div>{' '}
              </div>{' '}
              <FormGroup>
                <label className="col-sm-4 control-label"> Observing Frequency </label>{' '}
                <Frequency
                  value={frequency}
                  onChange={this.handleNewFreq}
                  onChangeUnit={this.handleNewFreqUnit}
                />{' '}
              </FormGroup>
              <fieldset id="ObservingBandSelectionFieldset" enabled>
                <div className="form-group">
                  <label className="col-sm-4 control-label"> Observing Band </label>
                  <div className="col-sm-7 last">
                    <Picker
                      value={selectedBand}
                      onChange={this.handleNewBand}
                      options={availableBands}
                    />
                  </div>
                </div>{' '}
              </fieldset>
              <FormGroup>
                <label className="col-sm-4 control-label"> Bandwidth per Polarization </label>{' '}
                <Bandwidth
                  value={bandwidth}
                  onChange={this.handleNewBandwidth}
                  onChangeUnit={this.handleNewBandwidthUnit}
                />{' '}
              </FormGroup>{' '}
              <OctileOption
                value={octileSelectionOption}
                onChange={this.handleNewOctileSelectionOption}
              />{' '}
              <fieldset id="OctileManualSelectionFieldset" disabled>
                <div className="form-group">
                  <label className="col-sm-4 control-label"> Column Density </label>{' '}
                  <div className="col-sm-7 last">
                    <Picker
                      value={selectedOctile}
                      onChange={this.handleChange}
                      options={[
                        ['0', '0.472mm (1st Octile)'],
                        ['1', '0.658mm (2nd Octile)'],
                        ['2', '0.913mm (3rd Octile)'],
                        ['3', '1.262mm (4th Octile)'],
                        ['4', '1.796mm (5th Octile)'],
                        ['5', '2.748mm (6th Octile)'],
                        ['6', '5.186mm (7th Octile)']
                      ]}
                    />{' '}
                  </div>{' '}
                </div>{' '}
                <OctileDetails value={octileDetails} />{' '}
              </fieldset>{' '}
            </form>{' '}
          </div>{' '}
        </div>{' '}
        <div className="panel panel-default">
          <div className="panel-heading">Individual Parameters </div>{' '}
          <div className="panel-body">
            <form className="form-horizontal">
              <div className="row">
                <div className="col-sm-3 col-sm-offset-3">
                  {' '}
                  <label> 12 m Array </label>
                </div>
                <div className="col-sm-3">
                  {' '}
                  <label> 7 m Array </label>
                </div>
                <div className="col-sm-3">
                  {' '}
                  <label> Total Power Array </label>
                </div>
              </div>{' '}
              <div className="row">
                {' '}
                <div className="col-sm-3">
                  {' '}
                  <label>Number of Antennas </label>
                </div>
                <div className="col-sm-3">
                  <Antennas value={twelveAntennas} onChange={this.handleNewTwelveAntennas} />{' '}
                </div>{' '}
                <div className="col-sm-3">
                  <Antennas value={sevenAntennas} onChange={this.handleNewSevenAntennas} />{' '}
                </div>{' '}
                <div className="col-sm-3">
                  <Antennas
                    value={totalPowerAntennas}
                    onChange={this.handleNewTotalPowerAntennas}
                  />{' '}
                </div>{' '}
              </div>{' '}
              <div className="row">
                {' '}
                <div className="col-sm-3">
                  {' '}
                  <label>Resolution </label>
                </div>
                <div className="col-sm-3">
                  <Resolution
                    value={twelveResolution}
                    frequencyInGHz={frequencyInGHz}
                    minBaselineM={120}
                    maxBaselineM={160000}
                    currentSensitivityType={twelveSensitivity.unit}
                    onChange={this.handleNewTwelveResolution}
                    onChangeUnit={this.handleNewTwelveResolutionUnit}
                  />
                </div>{' '}
                <div className="col-sm-3">
                  <Resolution
                    value={sevenResolution}
                    frequencyInGHz={frequencyInGHz}
                    minBaselineM={25}
                    maxBaselineM={60}
                    currentSensitivityType={sevenSensitivity.unit}
                    onChange={this.handleNewSevenResolution}
                    onChangeUnit={this.handleNewSevenResolutionUnit}
                  />{' '}
                </div>{' '}
                <div className="col-sm-3">
                  <fieldset disabled>
                    <Resolution
                      value={totalPowerResolution}
                      frequencyInGHz={frequencyInGHz}
                      // At the moment TP Sensitivity is a read only value so can set the bounds so that
                      // the validation is never triggered.
                      minBaselineM={0}
                      maxBaselineM={Infinity}
                      onChange={this.handleNewTotalPowerResolution}
                      onChangeUnit={this.handleNewTotalPowerResolutionUnit}
                      currentSensitivityType={totalPowerSensitivity.unit}
                    />{' '}
                  </fieldset>{' '}
                </div>{' '}
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <div className="form-group">
                    <label>Sensitivity (rms) </label>
                  </div>
                  <div className="form-group">&nbsp;</div>
                  <div className="form-group">
                    <label>Equivalent to</label>
                  </div>
                </div>
                <div className="col-sm-3">
                  <Sensitivity
                    value={twelveSensitivity}
                    onChange={this.handleNewTwelveSensitivity}
                    onChangeUnit={this.handleNewTwelveSensitivityUnit}
                  />
                </div>
                <div className="col-sm-3">
                  <Sensitivity
                    value={sevenSensitivity}
                    onChange={this.handleNewSevenSensitivity}
                    onChangeUnit={this.handleNewSevenSensitivityUnit}
                  />
                </div>
                <div className="col-sm-3">
                  <Sensitivity
                    value={totalPowerSensitivity}
                    onChange={this.handleNewTotalPowerSensitivity}
                    onChangeUnit={this.handleNewTotalPowerSensitivityUnit}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <label>Integration Time </label>
                </div>
                <div className="col-sm-3">
                  <Time
                    value={twelveTime}
                    onChange={this.handleNewTwelveTime}
                    onChangeUnit={this.handleNewTwelveTimeUnit}
                  />{' '}
                </div>{' '}
                <div className="col-sm-3">
                  <Time
                    value={sevenTime}
                    onChange={this.handleNewSevenTime}
                    onChangeUnit={this.handleNewSevenTimeUnit}
                  />{' '}
                </div>{' '}
                <div className="col-sm-3">
                  <Time
                    value={totalPowerTime}
                    onChange={this.handleNewTotalPowerTime}
                    onChangeUnit={this.handleNewTotalPowerTimeUnit}
                  />{' '}
                </div>{' '}
              </div>{' '}
              <div className="row">
                <div className="form-group">
                  <label className="col-sm-8 control-label">Integration Time Unit Option </label>{' '}
                  <div className="col-sm-4 last">
                    <select
                      className="form-control"
                      name="integrationUnitOption"
                      onChange={e => this.handleNewIntegrationUnitOption(e.target.value)}
                    >
                      <option value="Automatic"> Automatic </option>{' '}
                      <option value="Displayed"> Keep displayed unit </option>{' '}
                    </select>{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <div className="row">
                <div className="form-group">
                  <label className="col-sm-8 control-label"> Sensitivity Unit Option </label>{' '}
                  <div className="col-sm-4 last">
                    <select
                      className="form-control"
                      name="sensitivityUnitOption"
                      onChange={e => this.handleNewSensitivityUnitOption(e.target.value)}
                    >
                      <option value="Automatic"> Automatic </option>{' '}
                      <option value="Displayed"> Keep displayed unit </option>{' '}
                    </select>{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </form>{' '}
          </div>{' '}
        </div>{' '}
        <div className="btn-toolbar col-sm-11 pull-right">
          <button
            type="button"
            className="col-sm-4 btn btn-primary"
            onClick={this.calculateIntegrationTime}
          >
            {' '}
            Calculate Integration Time{' '}
          </button>{' '}
          <button
            type="button"
            className="col-sm-4 btn btn-primary"
            onClick={this.calculateSensitivity}
          >
            {' '}
            Calculate Sensitivity{' '}
          </button>{' '}
        </div>{' '}
      </div>
    );
  }
}

CalculatorApp.propTypes = {
  declination: PropTypes.object.isRequired,
  frequency: PropTypes.object.isRequired,
  bandwidth: PropTypes.object.isRequired,
  polarisation: PropTypes.string.isRequired,
  selectedOctile: PropTypes.string.isRequired,
  selectedBand: PropTypes.string.isRequired,
  octileSelectionOption: PropTypes.string.isRequired,
  octileDetails: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number
  }),
  twelveSensitivity: PropTypes.object.isRequired,
  sevenSensitivity: PropTypes.object.isRequired,
  totalPowerSensitivity: PropTypes.object.isRequired,
  twelveTime: PropTypes.object.isRequired,
  sevenTime: PropTypes.object.isRequired,
  totalPowerTime: PropTypes.object.isRequired,
  twelveResolution: PropTypes.object.isRequired,
  sevenResolution: PropTypes.object.isRequired,
  totalPowerResolution: PropTypes.object.isRequired,
  twelveAntennas: PropTypes.object.isRequired,
  sevenAntennas: PropTypes.object.isRequired,
  totalPowerAntennas: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const {
    selectedOctile,
    selectedBand,
    availableBands,
    octileDetails,
    octileSelectionOption,
    declination,
    polarisation,
    frequency,
    bandwidth,
    twelveSensitivity,
    sevenSensitivity,
    totalPowerSensitivity,
    twelveTime,
    sevenTime,
    totalPowerTime,
    twelveResolution,
    sevenResolution,
    totalPowerResolution,
    twelveAntennas,
    sevenAntennas,
    totalPowerAntennas,
    sensitivityUnitOption,
    integrationUnitOption,
    isUnitRescaleOn
  } = state;

  return {
    octileDetails,
    selectedOctile,
    selectedBand,
    availableBands,
    octileSelectionOption,
    declination,
    polarisation,
    frequency,
    bandwidth,
    twelveSensitivity,
    sevenSensitivity,
    totalPowerSensitivity,
    twelveTime,
    sevenTime,
    totalPowerTime,
    twelveResolution,
    sevenResolution,
    totalPowerResolution,
    twelveAntennas,
    sevenAntennas,
    totalPowerAntennas,
    sensitivityUnitOption,
    isUnitRescaleOn,
    integrationUnitOption
  };
}

/**
 * Overall calculator component
 *
 */
export default connect(mapStateToProps)(CalculatorApp);
