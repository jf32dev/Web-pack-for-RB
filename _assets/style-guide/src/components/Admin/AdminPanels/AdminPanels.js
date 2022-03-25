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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Draggable from 'react-draggable';

const messages = defineMessages({
  visualizeRelationships: { id: 'visualize-relationships', defaultMessage: 'Visualize Relationships' },
});

export default class AdminPanels extends React.PureComponent {
  static propTypes = {
    primaryPanel: PropTypes.node.isRequired,
    secondaryPanel: PropTypes.node.isRequired,
    headerHeight: PropTypes.number,

    onDragResize: PropTypes.func,
    onClose: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    headerHeight: 60,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      clientHeight: 0,
      controlledPosition: {
        x: 0, y: 0
      }
    };
    autobind(this);

    //this.wrapper = null;
    this.panelWrapper = null;
  }

  UNSAFE_componentWillMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentDidMount() {
    // Get panel Height
    // Set wrapper height so we can calculate where to display the title bar at the middle
    this.timer = setTimeout(() => {
      this.setState({ // eslint-disable-line react/no-did-mount-set-state
        controlledPosition: {
          x: 0, y: this.panelWrapper.clientHeight / 2
        },
        clientHeight: this.panelWrapper.clientHeight
      });
    }, 50);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  /////////////////////////
  // Drag actions
  onControlledDrag(e, position) {
    const { y } = position;
    this.setState({
      controlledPosition: { x: 0, y }
    });
  }

  handleDblClick(e) {
    const { clientHeight, controlledPosition } = this.state;
    this.onControlledDrag(e, {
      y: controlledPosition.y ? 0 : clientHeight - this.props.headerHeight
    });
  }

  handleStopClickEvent(event) {
    event.stopPropagation();
  }

  handleDrag(e, position) {
    this.onControlledDrag(e, position);

    if (typeof this.props.onDragResize === 'function') {
      this.props.onDragResize(position);
    }
  }

  handleStop(e, position) {
    this.onControlledDrag(e, position);
    this.setState({ isDragging: false });
  }

  handleStart() {
    this.setState({ isDragging: true });
  }

  handleResize() {
    if (this.panelWrapper) {
      this.setState({
        controlledPosition: {
          x: 0, y: this.panelWrapper.clientHeight / 2
        },
        clientHeight: this.panelWrapper.clientHeight
      });
    }
  }

  render() {
    const {
      primaryPanel,
      secondaryPanel,
      headerHeight,
      className,
    } = this.props;

    const {
      controlledPosition
    } = this.state;

    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);
    const styles = require('./AdminPanels.less');

    const cx = classNames.bind(styles);
    const mainClasses = cx({
      panelWrapper: true,
    }, className);

    const handleClasses = cx({
      handle: true,
      handleDraging: this.state.isDragging,
    });

    const panelSize = controlledPosition.y ? `${controlledPosition.y}px` : 0;
    const secondaryPanelSize = controlledPosition.y ? `calc(100% - ${(controlledPosition.y + headerHeight)}px)` : '100%';

    const primaryPaneStyle = {
      height: panelSize,
      maxHeight: `calc(100% - ${headerHeight}px)`,
    };

    const secondaryPaneStyle = {
      height: secondaryPanelSize,
    };

    return (
      <div
        ref={(node) => { this.panelWrapper = node; }}
        className={mainClasses}
      >
        <Draggable
          axis="y"
          grid={[1, 1]}
          handle=".handle"
          bounds="parent"
          onStart={this.handleStart}
          onStop={this.handleStop}
          onDrag={this.handleDrag}
          position={this.state.controlledPosition}
        >
          <header className={styles.Header}>
            <span
              key="drag-handler"
              onClick={this.handleStopClickEvent}
              onDoubleClick={this.handleDblClick}
              className={handleClasses + ' handle'}
            />
            <h3>{strings.visualizeRelationships}</h3>
            <span className={styles.close} onClick={this.props.onClose} />
          </header>
        </Draggable>

        <div
          //ref={(node) => { this.wrapper = node; }}
          className={styles.primaryPanel}
          style={primaryPaneStyle}
        >
          {primaryPanel}
        </div>

        <div className={styles.secondaryPanel} style={secondaryPaneStyle}>
          {secondaryPanel}
        </div>
      </div>
    );
  }
}
