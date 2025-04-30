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
import fetch from 'isomorphic-fetch';

import {
  regenerateDeclinationValues,
  reformatFormattedValue,
  velocityToGHz
} from './utilities/converters';

import { FluxConversions } from './utilities/fluxConversions';

export const REQUEST_OCTILE = 'REQUEST_OCTILE';
export const RECEIVE_OCTILE = 'RECEIVE_OCTILE';
export const FAILED_OCTILE = 'FAILED_OCTILE';
export const SELECT_OCTILE = 'SELECT_OCTILE';
export const UPDATE_DECLINATION = 'UPDATE_DECLINATION';
export const UPDATE_FREQUENCY = 'UPDATE_FREQUENCY';
export const UPDATE_FREQUENCY_UNIT = 'UPDATE_FREQUENCY_UNIT';
export const RESCALE_FREQUENCY_UNIT = 'RESCALE_FREQUENCY_UNIT';
export const UPDATE_BANDWIDTH = 'UPDATE_BANDWIDTH';
export const UPDATE_BANDWIDTH_UNIT = 'UPDATE_BANDWIDTH_UNIT';
export const RESCALE_BANDWIDTH_UNIT = 'RESCALE_BANDWIDTH_UNIT';
export const UPDATE_POLARISATION = 'UPDATE_POLARISATION';
export const UPDATE_OCTILE_SELECTION_OPTION = 'UPDATE_OCTILE_SELECTION_OPTION';

//array definitions - determine which column  of individual parameters the action applies to
export const ARRAY_12M = 'ARRAY_12M';
export const ARRAY_7M = 'ARRAY_7M';
export const ARRAY_TP = 'ARRAY_TP';

export const UPDATE_SENSITIVITY = 'UPDATE_SENSITIVITY';
export const UPDATE_SENSITIVITY_UNIT = 'UPDATE_SENSITIVITY_UNIT';
export const UPDATE_SENSITIVITY_AND_UNIT = 'UPDATE_SENSITIVITY_AND_UNIT';
export const RESCALE_SENSITIVITY_UNIT = 'RESCALE_SENSITIVITY_UNIT';

export const UPDATE_TIME = 'UPDATE_TIME';
export const UPDATE_TIME_UNIT = 'UPDATE_TIME_UNIT';
export const UPDATE_TIME_AND_UNIT = 'UPDATE_TIME_AND_UNIT';
export const RESCALE_TIME_UNIT = 'RESCALE_TIME_UNIT';

export const UPDATE_RESOLUTION = 'UPDATE_RESOLUTION';
export const UPDATE_RESOLUTION_UNIT = 'UPDATE_RESOLUTION_UNIT';
export const RESCALE_RESOLUTION_UNIT = 'RESCALE_RESOLUTION_UNIT';

export const UPDATE_TOTAL_POWER_ANTENNAS = 'UPDATE_TOTAL_POWER_ANTENNAS';
export const UPDATE_SEVEN_ANTENNAS = 'UPDATE_SEVEN_ANTENNAS';
export const UPDATE_TWELVE_ANTENNAS = 'UPDATE_TWELVE_ANTENNAS';

export const REQUEST_SENSITIVITY = 'REQUEST_SENSITIVITY';
export const RECEIVE_SENS_CALC = 'RECEIVE_SENS_CALC';
export const FAILED_SENS_CALC = 'FAILED_SENS_CALC';

export const REQUEST_TIME = 'REQUEST_TIME';
export const RECEIVE_TIME_CALC = 'RECEIVE_TIME_CALC';
export const FAILED_TIME_CALC = 'FAILED_TIME_CALC';

export const UPDATE_SENSITIVITY_UNIT_OPTION = 'UPDATE_SENSITIVITY_UNIT_OPTION';
export const UPDATE_INTEGRATION_UNIT_OPTION = 'UPDATE_INTEGRATION_UNIT_OPTION';

export const UPDATE_UNIT_RESCALE_MODE = 'UPDATE_UNIT_RESCALE_MODE';

export const SELECT_BAND = 'SELECT_BAND';
export const REQUEST_BAND = 'REQUEST_BAND';
export const RECEIVE_BAND = 'RECEIVE_BAND';
export const FAILED_BAND = 'FAILED_BAND';

//handle the trigger for a change of any of the fields
//one of these methods per field
export function selectOctile(octile) {
  return {
    type: SELECT_OCTILE,
    octile
  };
}

export function selectBand(band) {
  return {
    type: SELECT_BAND,
    band
  };
}

function constructDeclination(declinationString) {
  var declination = {
    formattedValue: declinationString,
    isValid: true
  };
  declination = regenerateDeclinationValues(declination);
  return declination;
}

export function updateDeclination(newDeclinationString) {
  //the declination has changed so we build a new one based on the
  //new string.

  const declination = constructDeclination(newDeclinationString);
  return {
    type: UPDATE_DECLINATION,
    declination
  };
}

export function formatDeclination(newDeclinationString, oldDeclination) {
  var declination = constructDeclination(newDeclinationString);

  //have left field so can reformat the value without messing up
  //any editing going on
  declination = reformatFormattedValue(declination);
  return {
    type: UPDATE_DECLINATION,
    declination
  };
}

export function updateFrequency(value) {
  return {
    type: UPDATE_FREQUENCY,
    value
  };
}
export function updateFrequencyUnit(unit, shouldScaleValue) {
  if (shouldScaleValue)
    return {
      type: RESCALE_FREQUENCY_UNIT,
      unit
    };
  else
    return {
      type: UPDATE_FREQUENCY_UNIT,
      unit
    };
}
export function updateBandwidth(value) {
  return {
    type: UPDATE_BANDWIDTH,
    value
  };
}
export function updateBandwidthUnit(unit, shouldScaleValue) {
  if (shouldScaleValue)
    return {
      type: RESCALE_BANDWIDTH_UNIT,
      unit
    };
  else
    return {
      type: UPDATE_BANDWIDTH_UNIT,
      unit
    };
}
export function updatePolarisation(value) {
  return {
    type: UPDATE_POLARISATION,
    value
  };
}

function isTempUnit(unit) {
  return unit === 'K' || unit === 'mK';
}

function updateSensitivity(arrayInstance, sensitivity, newValue, frequency, resolution) {
  const frequencyGHz = frequency.value * frequency.scale;
  const beamArcsec = resolution.value * resolution.scale;
  var altValue = sensitivity.altValue;
  var altUnit = sensitivity.altUnit;

  //deliberately allow zeroish values for  blank scenario
  // eslint-disable-next-line
  if (newValue == 0) {
    return {
      type: UPDATE_SENSITIVITY,
      arrayInstance: arrayInstance,
      value: newValue,
      altValue: 0,
      altUnit: altUnit
    };
  }

  //handle the zero resolution case as well
  if (resolution === 0) {
    return {
      type: UPDATE_SENSITIVITY,
      arrayInstance: arrayInstance,
      value: newValue,
      altValue: null,
      altUnit: altUnit
    };
  }

  if (isTempUnit(sensitivity.unit)) {
    const tempInK = newValue * sensitivity.scale;
    altValue = FluxConversions.toFluxSensitivity(tempInK, frequencyGHz, beamArcsec);
    altValue = FluxConversions.round(altValue, 6);
    altUnit = sensitivity.altUnit;
  } else {
    const sensitivityJy = newValue * sensitivity.scale;
    altValue = FluxConversions.toBrightnessTemp(sensitivityJy, frequencyGHz, beamArcsec);
    altUnit = 'K';
  }

  return {
    type: UPDATE_SENSITIVITY,
    arrayInstance: arrayInstance,
    value: newValue,
    altValue: altValue,
    altUnit: altUnit
  };
}

//Triggered after any of the sensitivity, frequency or resolution change
function refreshAltSensitivity(
  arrayInstance,
  sensitivity,
  frequency,
  resolution,
  sensitivityUnitOption
) {
  const frequencyGHz = frequency.value * frequency.scale;
  const beamArcsec = resolution.value * resolution.scale;

  //we try and work from the main unit becasue the alt may not have been set yet
  var sensitivityIsTemp = isTempUnit(sensitivity.unit);

  var altValue = sensitivity.altValue;
  var altUnit = sensitivity.altUnit;

  if (sensitivityIsTemp) {
    const tempInK = sensitivity.value * sensitivity.scale;
    altValue = FluxConversions.toFluxSensitivity(tempInK, frequencyGHz, beamArcsec);
    altUnit = 'Jy';
  } else {
    const sensitivityJy = sensitivity.value * sensitivity.scale;
    altValue = FluxConversions.toBrightnessTemp(sensitivityJy, frequencyGHz, beamArcsec);
    altUnit = 'K';
  }

  const hasSwappedBetweenFluxAndSensitivity =
    isTempUnit(sensitivity.altUnit) !== isTempUnit(altUnit);

  if (sensitivityUnitOption === 'Automatic' || hasSwappedBetweenFluxAndSensitivity) {
    const sensitivityUnitArray = [
      { unit: 'uJy', scale: 1.0e-6 },
      { unit: 'mJy', scale: 0.001 },
      { unit: 'Jy', scale: 1 }
    ];
    const tempUnitArray = [{ unit: 'mK', scale: 0.001 }, { unit: 'K', scale: 1 }];
    const scaleValueByUnit = function(value) {
      return unitScale => {
        const scaledValue = value / unitScale.scale;
        return { unit: unitScale.unit, value: scaledValue, mag: -Math.log10(scaledValue) };
      };
    };

    const scaledUnitsWithMagnatude = sensitivityIsTemp
      ? sensitivityUnitArray.map(scaleValueByUnit(altValue))
      : tempUnitArray.map(scaleValueByUnit(altValue));

    const bestFitBasedOnSignificantDigits = scaledUnitsWithMagnatude.reduce(function(prev, curr) {
      //slightly favour showing greater precison for small units (ie +1 rather than -1)
      return Math.abs(curr.mag + 1) < Math.abs(prev.mag + 1) ? curr : prev;
    });

    altUnit = bestFitBasedOnSignificantDigits.unit;
    altValue = FluxConversions.round(bestFitBasedOnSignificantDigits.value, 6);
  } else {
    altValue = getSensitivityInUnit(altValue, altUnit, sensitivity.altUnit);
    altValue = FluxConversions.round(altValue, 6);
    altUnit = sensitivity.altUnit;
  }

  return {
    type: UPDATE_SENSITIVITY,
    arrayInstance: arrayInstance,
    value: sensitivity.value,
    unit: sensitivity.unit,
    altValue: altValue,
    altUnit: altUnit
  };
}

function updateSensitivityUnit(arrayInstance, unit, shouldScaleValue) {
  return shouldScaleValue
    ? {
        arrayInstance: arrayInstance,
        type: RESCALE_SENSITIVITY_UNIT,
        unit
      }
    : {
        arrayInstance: arrayInstance,
        type: UPDATE_SENSITIVITY_UNIT,
        unit
      };
}

function updateResolutionUnit(arrayInstance, unit, shouldScaleValue) {
  return shouldScaleValue
    ? {
        arrayInstance: arrayInstance,
        type: RESCALE_RESOLUTION_UNIT,
        unit
      }
    : {
        arrayInstance: arrayInstance,
        type: UPDATE_RESOLUTION_UNIT,
        unit
      };
}

export function updateOctileSelectionOption(value) {
  return {
    type: UPDATE_OCTILE_SELECTION_OPTION,
    value
  };
}

//TODO push the arrayType back to the CalculatorApp to remove the remaining duplication

export function updateTwelveSensitivity(sensitivity, newValue, frequency, resolution) {
  return updateSensitivity(ARRAY_12M, sensitivity, newValue, frequency, resolution);
}
export function refreshTwelveAltSensitivity(
  sensitivity,
  frequency,
  resolution,
  sensitivityUnitOption
) {
  return refreshAltSensitivity(
    ARRAY_12M,
    sensitivity,
    frequency,
    resolution,
    sensitivityUnitOption
  );
}
export function updateTwelveSensitivityUnit(unit, shouldScaleValue) {
  return updateSensitivityUnit(ARRAY_12M, unit, shouldScaleValue);
}

export function updateSevenSensitivity(sensitivity, newValue, frequency, resolution) {
  return updateSensitivity(ARRAY_7M, sensitivity, newValue, frequency, resolution);
}
export function refreshSevenAltSensitivity(
  sensitivity,
  frequency,
  resolution,
  sensitivityUnitOption
) {
  return refreshAltSensitivity(ARRAY_7M, sensitivity, frequency, resolution, sensitivityUnitOption);
}
export function updateSevenSensitivityUnit(unit, shouldScaleValue) {
  return updateSensitivityUnit(ARRAY_7M, unit, shouldScaleValue);
}

export function updateTotalPowerSensitivity(sensitivity, newValue, frequency, resolution) {
  return updateSensitivity(ARRAY_TP, sensitivity, newValue, frequency, resolution);
}
export function refreshTotalPowerAltSensitivity(
  sensitivity,
  frequency,
  resolution,
  sensitivityUnitOption
) {
  return refreshAltSensitivity(ARRAY_TP, sensitivity, frequency, resolution, sensitivityUnitOption);
}
export function updateTotalPowerSensitivityUnit(unit, shouldScaleValue) {
  return updateSensitivityUnit(ARRAY_TP, unit, shouldScaleValue);
}

export function updateTwelveResolution(value) {
  return {
    arrayInstance: ARRAY_12M,
    type: UPDATE_RESOLUTION,
    value
  };
}

export function updateTotalPowerResolution(value) {
  return {
    arrayInstance: ARRAY_TP,
    type: UPDATE_RESOLUTION,
    value
  };
}




export function updateTwelveResolutionUnit(unit, shouldScaleValue) {
  return updateResolutionUnit(ARRAY_12M, unit, shouldScaleValue);
}
export function updateSevenResolution(value) {
  return {
    arrayInstance: ARRAY_7M,
    type: UPDATE_RESOLUTION,
    value
  };
}
export function updateSevenResolutionUnit(unit, shouldScaleValue) {
  return updateResolutionUnit(ARRAY_7M, unit, shouldScaleValue);
}
export function updateTotalPowerResolutionUnit(unit, shouldScaleValue) {
  return updateResolutionUnit(ARRAY_TP, unit, shouldScaleValue);
}


function updateTimeUnit(arrayInstance, unit, shouldScaleValue) {
  return shouldScaleValue
    ? {
        arrayInstance: arrayInstance,
        type: RESCALE_TIME_UNIT,
        unit
      }
    : {
        arrayInstance: arrayInstance,
        type: UPDATE_TIME_UNIT,
        unit
      };
}

export function updateTwelveTime(value) {
  return {
    arrayInstance: ARRAY_12M,
    type: UPDATE_TIME,
    value
  };
}
export function updateTwelveTimeUnit(unit, shouldScaleValue) {
  return updateTimeUnit(ARRAY_12M, unit, shouldScaleValue);
}
export function updateSevenTime(value) {
  return {
    arrayInstance: ARRAY_7M,
    type: UPDATE_TIME,
    value
  };
}
export function updateSevenTimeUnit(unit, shouldScaleValue) {
  return updateTimeUnit(ARRAY_7M, unit, shouldScaleValue);
}
export function updateTotalPowerTime(value) {
  return {
    arrayInstance: ARRAY_TP,
    type: UPDATE_TIME,
    value
  };
}
export function updateTotalPowerTimeUnit(unit, shouldScaleValue) {
  return updateTimeUnit(ARRAY_TP, unit, shouldScaleValue);
}

export function updateTwelveAntennas(value) {
  return {
    type: UPDATE_TWELVE_ANTENNAS,
    value
  };
}
export function updateSevenAntennas(value) {
  return {
    type: UPDATE_SEVEN_ANTENNAS,
    value
  };
}
export function updateTotalPowerAntennas(value) {
  return {
    type: UPDATE_TOTAL_POWER_ANTENNAS,
    value
  };
}

export function updateIntegrationUnitOption(value) {
  return {
    type: UPDATE_INTEGRATION_UNIT_OPTION,
    value
  };
}
export function updateSensitivityUnitOption(value) {
  return {
    type: UPDATE_SENSITIVITY_UNIT_OPTION,
    value
  };
}

//State change to show new octile details have been requested
//but not yet received
function requestOctileDetails(octile, declination, frequency) {
  return {
    type: REQUEST_OCTILE,
    octile,
    declination,
    frequency
  };
}


//State change to show new receiving band details have been requested
//but not yet received
function requestObservingBands(frequency) {
  return {
    type: REQUEST_BAND,
    frequency
  };
}


//State change to show new receiving band details have been requested
//but not yet received
function receivedObservingBands(frequency, result, type) {
  return {
    type,
    frequency,
    observingBandDetails: {
      result: result,
      receivedAt: Date.now()
    }
  };
}

//State change to show new octile details have been received
//update the received at for the octile details
function receiveOctileDetails(octile, declination, frequency, result, type) {
  return {
    type,
    octile,
    declination,
    octileDetails: {
      result: result,
      receivedAt: Date.now()
    }
  };
}

//fetch the octile details from the server by calling the service
function fetchOctileDetails(octile, declination, frequency, selectedBand, octileSelectionOption) {
  const freqInGHz = frequency.value * frequency.scale;

  const callingWithDefinedOctile = `./webapi/atmDetailsForBand/${selectedBand}/${octile}/${freqInGHz}/${
    declination.inDegrees
  }`;
  const callingForBestOctile = `./webapi/atmDetailsForBand/${selectedBand}/${freqInGHz}/${
    declination.inDegrees
  }`;

  const urlString =
    octileSelectionOption === 'Manual' ? callingWithDefinedOctile : callingForBestOctile;

  return dispatch => {
    dispatch(requestOctileDetails(urlString));

    return fetch(urlString).then(response => {
      if (response.ok) {
        response
          .json()
          .then(result =>
            dispatch(receiveOctileDetails(octile, declination, frequency, result, RECEIVE_OCTILE))
          );
      } else {
        response
          .json()
          .then(result =>
            dispatch(receiveOctileDetails(octile, declination, frequency, result, FAILED_OCTILE))
          );
      }
    });
  };
}


//fetch the current receiverBands  by calling the service
function fetchCurrentReceiverBands(freqInGHz) {

  const url = `./webapi/receiverBand/${freqInGHz}`;

  return dispatch => {
    dispatch(requestObservingBands(url));

    return fetch(url).then(response => {
      if (response.ok) {
        response
          .json()
          .then(result =>
            dispatch(receivedObservingBands(freqInGHz, result, RECEIVE_BAND))
          );
      } else {
        response
          .json()
          .then(result =>
            dispatch(receivedObservingBands(freqInGHz, result, FAILED_BAND))
          );
      }
    });
  };
}


function sensitivityUnitToScale(unit) {
  switch (unit) {
    case 'uJy':
      return 1.0e-6;
    case 'mJy':
      return 0.001;
    case 'Jy':
      return 1;
    case 'K':
      return 1;
    case 'mK':
      return 0.001;
    default:
      return 1;
  }
}

//Note this is only valid for units of the same type it doesn't convert to or from temp
function getSensitivityInUnit(sensitivityValue, currentUnit, desiredUnit) {
  const scaleFactor = sensitivityUnitToScale(currentUnit) / sensitivityUnitToScale(desiredUnit);
  const newValue = sensitivityValue * scaleFactor;
  return newValue;
}

//State change to show new sensitivity details have been received
function receiveSensitivityDetails(
  array,
  frequency,
  resolution,
  result,
  sensitivityUnitOption,
  previousSensitivity,
  type
) {
  const janskyValue = result.sensitivityInJ;
  const janskyUnit = 'Jy';
  const frequencyGHz = frequency.value * frequency.scale;
  const beamArcsec = resolution.value * resolution.scale;
  const tempValue = FluxConversions.toBrightnessTemp(janskyValue, frequencyGHz, beamArcsec);
  const tempUnit = 'K';

  const sensitivityUnitArray = [
    { unit: 'uJy', scale: 1.0e-6 },
    { unit: 'mJy', scale: 0.001 },
    { unit: 'Jy', scale: 1 }
  ];
  const tempUnitArray = [{ unit: 'mK', scale: 0.001 }, { unit: 'K', scale: 1 }];
  const scaleValueByUnit = function(value) {
    return unitScale => {
      const scaledValue = value / unitScale.scale;
      return { unit: unitScale.unit, value: scaledValue, mag: -Math.log10(scaledValue) };
    };
  };

  //might as well assume the most likely case
  //no scaling of alt units needed at this stage as they will be scaled when refreshed

  let scaledUnitsWithMagnatude = sensitivityUnitArray.map(scaleValueByUnit(janskyValue));
  let newAltUnit = tempUnit;
  let newAltValue = tempValue;
  let value = janskyValue;
  let unit = janskyUnit;

  if (isTempUnit(previousSensitivity.unit)) {
    scaledUnitsWithMagnatude = tempUnitArray.map(scaleValueByUnit(tempValue));
    newAltUnit = janskyUnit;
    newAltValue = janskyValue;
    value = tempValue;
    unit = tempUnit;
  }

  if (sensitivityUnitOption === 'Automatic') {
    //however we do need to scale the primary senitivity unit here
    const bestFitBasedOnSignificantDigits = scaledUnitsWithMagnatude.reduce(function(prev, curr) {
      //slightly favour showing greater precison for small units (ie +1 rather than -1)
      return Math.abs(curr.mag + 1) < Math.abs(prev.mag + 1) ? curr : prev;
    });

    unit = bestFitBasedOnSignificantDigits.unit;
    value = bestFitBasedOnSignificantDigits.value;
  } else {
    value = getSensitivityInUnit(value, unit, previousSensitivity.unit);
    unit = previousSensitivity.unit;
  }

  return {
    arrayInstance: array,
    type: UPDATE_SENSITIVITY_AND_UNIT,
    value: value,
    unit: unit,
    altValue: newAltValue,
    altUnit: newAltUnit
  };
}

function sensitivityConversionValid(sensitivity, resolution) {
  console.log('Testing: ', sensitivity.unit, resolution.value);
  if (isTempUnit(sensitivity.unit) && resolution.value === 0) {
    //invalid becuse sensitivity can't be converted
    return false;
  }

  //dealing in flux so we dont mind about the resolution
  return true;
}

export function calculateAllTheSensitivities(
  bandwidth,
  declination,
  frequency,
  octile,
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
) {
  //handle speed units
  var bandwidthInGHz = bandwidth.scale * bandwidth.value;
  const obsFreqInGHz = frequency.scale * frequency.value;

  if (bandwidth.unit === 'km/s') {
    bandwidthInGHz = velocityToGHz(bandwidth.value, obsFreqInGHz);
  } else if (bandwidth.unit === 'm/s') {
    bandwidthInGHz = velocityToGHz(bandwidth.value / 1000, obsFreqInGHz);
  }
  console.log('******** Bandwidth is :', bandwidthInGHz, bandwidth.value);

  return dispatch => {
    if (sensitivityConversionValid(twelveSensitivity, twelveResolution)) {
      dispatch(
        calculateSensitivity(
          bandwidthInGHz,
          declination,
          frequency,
          octile,
          polarisation,
          ARRAY_12M,
          twelveAntennas,
          twelveResolution,
          twelveTime,
          sensitivityUnitOption,
          twelveSensitivity,
          selectedBand
        )
      );
    } else {
      console.log(
        'No calculation done for 12m as the combination of Sensitivity Unit and Resolution is not valid'
      );
    }
    if (sensitivityConversionValid(sevenSensitivity, sevenResolution)) {
      dispatch(
        calculateSensitivity(
          bandwidthInGHz,
          declination,
          frequency,
          octile,
          polarisation,
          ARRAY_7M,
          sevenAntennas,
          sevenResolution,
          sevenTime,
          sensitivityUnitOption,
          sevenSensitivity,
          selectedBand
        )
      );
    } else {
      console.log(
        'No calculation done for 7m as the combination of Sensitivity Unit and Resolution is not valid'
      );
    }

    //TP is fixed resolution so is always valid
    dispatch(
      calculateSensitivity(
        bandwidthInGHz,
        declination,
        frequency,
        octile,
        polarisation,
        ARRAY_TP,
        totalPowerAntennas,
        totalPowerResolution,
        totalPowerTime,
        sensitivityUnitOption,
        totalPowerSensitivity,
        selectedBand
      )
    );
  };
}

//request a sensitivity calculation we make three asynchronous requests and tie the replies back to the individual array
function calculateSensitivity(
  bandwidthInGHz,
  declination,
  frequency,
  octile,
  polarisation,
  array,
  numberOfAntennas,
  resolution,
  time,
  sensitivityUnitOption,
  previousSensitivity,
  selectedBand
) {
  const beamsizeInArcsecs = resolution.value * resolution.scale;
  const integrationTimeInSec = time.value * time.scale;
  const observingFrequencyInGHZ = frequency.value * frequency.scale;
  const dec = declination.inDegrees;
  const pols = polarisation === '1' ? 'SINGLE' : 'DUAL';
  const antennaArray = array;
  const body = JSON.stringify({
    beamsizeInArcsecs: beamsizeInArcsecs,
    integrationTimeInSec: integrationTimeInSec,
    observingFrequencyInGHZ: observingFrequencyInGHZ,
    bandwidth: bandwidthInGHz,
    dec: dec,
    numberOfAntennas: numberOfAntennas.value,
    antennaArray: antennaArray,
    polarization: pols,
    wvIndex: octile,
    receiverBand: selectedBand
  });
  return dispatch => {
    dispatch(requestSensitivityForArray(antennaArray));
    const headers = new Headers({
      'Content-Type': ' application/json'
    });
    return fetch('./webapi/sensitivity', {
      headers: headers,
      method: 'post',
      body: body
    }).then(response => {
      if (response.ok) {
        response
          .json()
          .then(result =>
            dispatch(
              receiveSensitivityDetails(
                array,
                frequency,
                resolution,
                result,
                sensitivityUnitOption,
                previousSensitivity,
                RECEIVE_SENS_CALC
              )
            )
          );
      } else {
        response
          .json()
          .then(result =>
            dispatch(
              receiveSensitivityDetails(
                array,
                frequency,
                resolution,
                result,
                sensitivityUnitOption,
                previousSensitivity,
                FAILED_SENS_CALC
              )
            )
          );
      }
    });
  };
}

//State change to show new sensitivity details have been requested
//but not yet received
function requestSensitivityForArray(array) {
  return {
    type: REQUEST_SENSITIVITY,
    array
  };
}

//State change to show new sensitivity details have been requested
//but not yet received
function requestTimeForArray(array) {
  return {
    type: REQUEST_TIME,
    array
  };
}

/**
 *	Handle any work required to the time units that are received
 * 	from the time calculation. Times are always returned in seconds
 *  so this mostly consists of translating them into an appropriate
 *  unit
 *
 *  If the 'Automatic' option has been selected on the display the
 *  units are scaled otherwise we preserve the last unit displayed
 *
 * [receiveTimeDetails description]
 * @param  {[type]} array                 [array instance used by reducers to update the right time value (12M_Array | 7M Array | TP)]
 * @param  {[type]} result                [calculation result (struture containting integrationTimeInSec)]
 * @param  {[type]} oldTime               [previously displayed time contains the 'unit' ]
 * @param  {[type]} integrationUnitOption [Whether the units are scaled or or not (either set to 'Automatic' or 'Manual')]
 * @param  {[type]} type                  [description]
 * @return {[type]}                       [UPDATE_TIME_AND_UNIT message for the received integration time]
 */
export function receiveTimeDetails(array, result, oldTime, integrationUnitOption, type) {
  const timeUnitToScale = { ns: 1.0e-9, us: 1.0e-6, ms: 0.001, s: 1, min: 60, h: 3600, d: 86400 };

  var newUnit = oldTime.unit;
  var newValue = FluxConversions.round(
    result.integrationTimeInSec / timeUnitToScale[oldTime.unit],
    5
  );

  if (integrationUnitOption === 'Automatic') {
    const timeUnitArray = [
      { unit: 'ns', scale: 1.0e-9 },
      { unit: 'us', scale: 1.0e-6 },
      { unit: 'ms', scale: 0.001 },
      { unit: 's', scale: 1 },
      { unit: 'min', scale: 60 },
      { unit: 'h', scale: 3600 },
      { unit: 'd', scale: 86400 }
    ];

    const scaleValueByUnit = function(value) {
      return unitScale => {
        const scaledValue = value / unitScale.scale;
        return { unit: unitScale.unit, value: scaledValue, mag: -Math.log10(scaledValue) };
      };
    };

    const scaledUnitsWithMagnatude = timeUnitArray.map(
      scaleValueByUnit(result.integrationTimeInSec)
    );
    const bestFitBasedOnSignificantDigits = scaledUnitsWithMagnatude.reduce(function(prev, curr) {
      //slightly favour showing greater precison for small units (ie +1 rather than -1)
      return Math.abs(curr.mag + 1) < Math.abs(prev.mag + 1) ? curr : prev;
    });
    newUnit = bestFitBasedOnSignificantDigits.unit;
    newValue = FluxConversions.round(bestFitBasedOnSignificantDigits.value, 5);
  }
  return {
    arrayInstance: array,
    type: UPDATE_TIME_AND_UNIT,
    value: newValue,
    unit: newUnit
  };
}

/**
 * request a time calculation we make three asynchronous requests and tie the replies back to the individual array
 */
function calculateTime(
  bandwidthInGHz,
  declination,
  frequency,
  octile,
  polarisation,
  array,
  numberOfAntennas,
  resolution,
  sensitivity,
  oldTime,
  integrationUnitOption,
  selectedBand
) {
  const beamsizeInArcsecs = resolution.value * resolution.scale;
  const observingFrequencyInGHZ = frequency.value * frequency.scale;

  //Always calculate using Jy - if the user has specified in temp we need to recalculate
  //because the alt value is a rounded one for display purposes.
  var sensitivityInJ = isTempUnit(sensitivity.unit)
    ? FluxConversions.toFluxSensitivity(
        sensitivity.value * sensitivity.scale,
        observingFrequencyInGHZ,
        beamsizeInArcsecs
      )
    : sensitivity.value * sensitivity.scale;

  const dec = declination.inDegrees;
  const pols = polarisation === '1' ? 'SINGLE' : 'DUAL';
  const antennaArray = array;
  const body = JSON.stringify({
    beamsizeInArcsecs: beamsizeInArcsecs,
    sensitivityInJ: sensitivityInJ,
    observingFrequencyInGHZ: observingFrequencyInGHZ,
    bandwidth: bandwidthInGHz,
    dec: dec,
    numberOfAntennas: numberOfAntennas.value,
    antennaArray: antennaArray,
    polarization: pols,
    wvIndex: octile,
    receiverBand: selectedBand
  });
  return dispatch => {
    dispatch(requestTimeForArray(antennaArray));
    const headers = new Headers({
      'Content-Type': ' application/json'
    });
    return fetch('./webapi/time', {
      headers: headers,
      method: 'post',
      body: body
    }).then(response => {
      if (response.ok) {
        response
          .json()
          .then(result =>
            dispatch(
              receiveTimeDetails(array, result, oldTime, integrationUnitOption, RECEIVE_TIME_CALC)
            )
          );
      } else {
        response
          .json()
          .then(result =>
            dispatch(
              receiveTimeDetails(array, result, oldTime, integrationUnitOption, FAILED_TIME_CALC)
            )
          );
      }
    });
  };
}

export function calculateAllTheTimes(
  bandwidth,
  declination,
  frequency,
  octile,
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
) {
  //handle speed units
  var bandwidthInGHz = bandwidth.scale * bandwidth.value;
  const obsFreqInGHz = frequency.scale * frequency.value;

  if (bandwidth.unit === 'km/s') {
    bandwidthInGHz = velocityToGHz(bandwidth.value, obsFreqInGHz);
  } else if (bandwidth.unit === 'm/s') {
    bandwidthInGHz = velocityToGHz(bandwidth.value / 1000, obsFreqInGHz);
  }

  return dispatch => {
    if (sensitivityConversionValid(twelveSensitivity, twelveResolution)) {
      dispatch(
        calculateTime(
          bandwidthInGHz,
          declination,
          frequency,
          octile,
          polarisation,
          ARRAY_12M,
          twelveAntennas,
          twelveResolution,
          twelveSensitivity,
          twelveTime,
          integrationUnitOption,
          selectedBand
        )
      );
    } else {
      console.log(
        'No calculation done for 12m as the combination of Sensitivity Unit and Resolution is not valid'
      );
    }
    if (sensitivityConversionValid(sevenSensitivity, sevenResolution)) {
      dispatch(
        calculateTime(
          bandwidthInGHz,
          declination,
          frequency,
          octile,
          polarisation,
          ARRAY_7M,
          sevenAntennas,
          sevenResolution,
          sevenSensitivity,
          sevenTime,
          integrationUnitOption,
          selectedBand
        )
      );
    } else {
      console.log(
        'No calculation done for 7m as the combination of Sensitivity Unit and Resolution is not valid'
      );
    }
    dispatch(
      calculateTime(
        bandwidthInGHz,
        declination,
        frequency,
        octile,
        polarisation,
        ARRAY_TP,
        totalPowerAntennas,
        totalPowerResolution,
        totalPowerSensitivity,
        totalPowerTime,
        integrationUnitOption,
        selectedBand
      )
    );
  };
}

export function fetchCurrentReceiverBandsIfNeeded(frequency) {
  return (dispatch, getState) => {
    return dispatch(fetchCurrentReceiverBands(frequency));
  };
}

export function fetchOctileDetailsIfNeeded(octile, declination, frequency, selectedBand, octileSelectionOption) {
  return (dispatch, getState) => {
    return dispatch(fetchOctileDetails(octile, declination, frequency, selectedBand, octileSelectionOption));
  };
}
