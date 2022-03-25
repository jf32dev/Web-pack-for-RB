/**
 *
 * BIGTINCAN - CONFIDENTIAL
 *
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of BigTinCan Mobile Pty Ltd and its suppliers,
 * if any. The intellectual and technical concepts contained herein are proprietary to BigTinCan Mobile Pty Ltd and its
 * suppliers and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or
 * copyright law. Dissemination of this information or reproduction of this material is strictly forbidden unless prior
 * written permission is obtained from BigTinCan Mobile Pty Ltd.
 *
 * @package style-guide
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

/**
 * Support for CSS variables
 * http://caniuse.com/#search=css%20variables
 */
export function checkCssVarSupport() {
  const platform = require('platform');
  const name = platform.name.toLowerCase();
  const version = parseFloat(platform.version, 10);

  let supported = true;
  switch (name) {
    case 'chrome':
      if (version < 49) {
        supported = false;
      }
      break;
    case 'firefox':
      if (version < 31) {
        supported = false;
      }
      break;
    case 'microsoft edge':
      if (version < 15.15063) {
        supported = false;
      }
      break;
    case 'safari':
      // Mobile Safari
      if (platform.os.family === 'iOS') {
        if (version < 9.3) {
          supported = false;
        }

      // Desktop Safari
      } else if (version < 9.1) {
        supported = false;
      }
      break;
    default:
      supported = false;
      break;
  }
  return supported;
}

/**
 * Convert camelCase to dashed
 * e.g. baseColor -> base-color
 */
function camelCaseToDash(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Handles dynamic theming using CSS Variables.
 * Requires selector data from <code>postcss-extract-custom-properties</code> for fallback.
 * Note: This does not support server-side rendering.
 */
export default class ColourScheme extends PureComponent {
  static propTypes = {
    /** Selector data from <code>postcss-extract-custom-properties</code> */
    varSelectors: PropTypes.object,

    /** Force the selector-based fallback - useful for testing */
    forceFallback: function(props) {
      if (props.forceFallback && !props.varSelectors) {
        return new Error('varSelectors is required if forceFallback is enabled');
      }
      return null;
    },

    /** Values of camelCased variables */
    vars: PropTypes.object
  };

  static defaultProps = {
    forceFallback: false,

    vars: {
      baseColor: '#F26724',
      darkBaseColor: '#B03100',
      lightBaseColor: '#FBD4BF',
      accentColor: '#43b7f1',
      baseText: '#ffffff',
      textIcons: '#ffffff',

      backgroundColor: '#ffffff',
      primaryText: '#000000',
      secondaryText: '#666666',
      descriptionText: '#222222',
      dividerColor: '#dddddd',
      disabledColor: '#999999',

      destructiveColor: '#FF0000',
      infoColor: '#ffe5a7',
      successColor: '#04d97e',
    }
  };

  constructor(props) {
    super(props);
    autobind(this);

    // Does browser support CSS variables?
    this.useFallback = !checkCssVarSupport();
  }

  UNSAFE_componentWillMount() {
    const { forceFallback, varSelectors } = this.props;
    this.cssStrings = {};  // css strings by varName
    this.styleElems = {};  // style elements by varName
    /**
     * CSS Variables falback
     * Generate <style> elements from varSelectors
     */
    if (this.useFallback || forceFallback && varSelectors) {
      // Generate CSS from varSelectors
      for (const varName in varSelectors) {
        if (Object.prototype.hasOwnProperty.call(varSelectors, varName)) {
          const dashedVarName = camelCaseToDash(varName);

          // Comment original variable name
          // e.g. --base-color
          this.cssStrings[varName] = `/*var(--${dashedVarName})*/`;

          for (const prop in varSelectors[varName]) {
            if (Object.prototype.hasOwnProperty.call(varSelectors[varName], prop)) {
              this.cssStrings[varName] += varSelectors[varName][prop] + '{' + prop + ':@' + varName + ';} ';
            }
          }
        }
      }

      // Append <style> for each varName
      for (const varName in varSelectors) {
        if (Object.prototype.hasOwnProperty.call(varSelectors, varName)) {
          const styleElement = document.createElement('style');
          styleElement.setAttribute('type', 'text/css');
          this.styleElems[varName] = styleElement;
          this.updateStyle(varName);
        }
      }

    /**
     * CSS Variables Supported
     * Use :root <style> element
     */
    } else {
      this.cssStrings.root = this.getRootStyle();

      // Create :root style element
      const rootStyleElem = document.createElement('style');
      rootStyleElem.setAttribute('type', 'text/css');
      this.styleElems.root = rootStyleElem;
      this.updateRootStyle();
    }
  }

  componentDidMount() {
    // Append style elements to DOM
    for (const varName in this.styleElems) {
      if (Object.prototype.hasOwnProperty.call(this.styleElems, varName)) {
        document.head.appendChild(this.styleElems[varName]);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { vars, forceFallback } = this.props;
    let hasChanged = false;

    // Detect value change
    if (vars !== prevProps.vars) {
      for (const varName in this.props.vars) {
        // varName has changed
        if (Object.prototype.hasOwnProperty.call(vars, varName) !== prevProps.vars[varName]) {
          hasChanged = true;

          // Update <style> if supported or forceFallback
          if (this.useFallback || forceFallback) {
            this.updateStyle(varName);
          }
        }
      }

      // Update :root <style> if any changes
      if (hasChanged && !this.useFallback && !forceFallback) {
        this.updateRootStyle();
      }
    }
  }

  componentWillUnmount() {
    // Remove <style> elements from DOM
    for (const varName in this.styleElems) {
      if (Object.prototype.hasOwnProperty.call(this.styleElems, varName)) {
        document.head.removeChild(this.styleElems[varName]);
      }
    }
  }

  // Returns a :root CSS selector string
  getRootStyle() {
    const { vars } = this.props;
    let rootStyle = ':root{';
    for (const varName in vars) {
      if (Object.prototype.hasOwnProperty.call(vars, varName)) {
        rootStyle += `--${camelCaseToDash(varName)}:${vars[varName]};`;
      }
    }
    rootStyle += '}';
    return rootStyle;
  }

  updateRootStyle() {
    if (this.styleElems.root) {
      this.styleElems.root.innerHTML = this.getRootStyle();
    }
  }

  updateStyle(varName) {
    // Only update if varName exists in varSelectors
    if (this.cssStrings[varName]) {
      const re = new RegExp('@' + varName, 'g');
      const newString = this.cssStrings[varName].replace(re, this.props.vars[varName]);
      this.styleElems[varName].innerHTML = newString;
    }
  }

  render() {
    return null;
  }
}
