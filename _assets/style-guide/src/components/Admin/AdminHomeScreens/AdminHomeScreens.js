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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import FormField from 'components/Admin/AdminUtils/FormField/FormField';
import NavMenu from 'components/NavMenu/NavMenu';

import HomeScreensItem from './HomeScreensItem';

/**
 * Admin Home Screens
 */
export default class AdminHomeScreens extends PureComponent {
  static propTypes = {
    homeScreens: PropTypes.array,

    addOns: PropTypes.array,

    legacy: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onChange: PropTypes.func,
    onAssignClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      createHomeScreens: 'Create Home Screen',
      homeScreens: 'Home Screens',
      webHomeScreens: 'Web Home Screens',
      name: 'Name',
      default: 'Default',
      edit: 'Edit',
      delete: 'Delete',
      homeScreenAddOns: 'Home Screen Add-ons',
      uploadAddOn: 'Upload Add-on',
      uploadHomeScreen: 'Upload Home Screen',
      attached: 'Attached',
      downloadSource: 'Download Source',
      legacyHomeScreens: 'Legacy Home Screens',
      homeScreenType: 'Home Screen Type',
      configurationBundle: 'Configuration Bundle',
      bridgeVersion: 'Type'
    },
    pages: [],
    addOns: [],
    legacy: []
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedUrl: '/web'
    };
    autobind(this);
  }

  handleNavItemClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    this.setState({
      selectedUrl: href
    });
  }

  render() {
    const {
      strings,
      onChange,
      pages,
      addOns,
      legacy,
      showDeviceHSUploadButton
    } = this.props;
    const { selectedUrl } = this.state;
    const menuList = [
      { name: 'Web', url: '/web' },
      { name: 'Mobile', url: '/mobile' }
    ];
    const styles = require('./AdminHomeScreens.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      HomeScreens: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <NavMenu
          list={menuList}
          selectedUrl={selectedUrl}
          horizontal
          secondary
          onItemClick={this.handleNavItemClick}
        />
        {this.state.selectedUrl && this.state.selectedUrl === '/web' && <React.Fragment>
          <section>
            <h5>{strings.webHomeScreenDescription}</h5>
            <FormField
              type="create"
              label={strings.createHomeScreens}
              dataKey="createHomeScreens"
              onChange={onChange}
            />
            {pages.length > 0 && <header className={styles.homeScreensHeader}>
              <div>{strings.name}</div>
              <div>{strings.configurationBundle}</div>
            </header>}
            <TransitionGroup>
              {pages.length > 0 && pages.map(item => (<CSSTransition
                key={item.id}
                classNames="fade"
                timeout={250}
                appear
              >
                <HomeScreensItem
                  name={item.name}
                  id={'pages-' + item.id}
                  edit
                  onAssignClick={this.props.onAssignClick}
                  numberOfConfigBundleAssign={item.numberOfConfigBundleAssign}
                  showConfigAssign
                  remove={!item.checked}
                  checked={_get(item, 'checked', false)}
                  strings={strings}
                  onChange={onChange}
                  type="web"
                />
              </CSSTransition>))}
            </TransitionGroup>
          </section>

          <section>
            <h3>{strings.homeScreenAddOns}</h3>
            <h5>{strings.homeScreenAddOnsDescription}</h5>
            <FormField
              type="create"
              label={strings.uploadAddOn}
              dataKey="uploadAddOn"
              onChange={onChange}
            />
            {addOns.length > 0 && <header className={styles.addOnsHeader}>
              <div>{strings.name}</div>
              <div>{strings.attached}</div>
              <div className={styles.download}>{strings.downloadSource}</div>
              <div className={styles.download}>{strings.preview}</div>
            </header>}
            <TransitionGroup>
              {addOns.length > 0 && addOns.map((item, i) => (<CSSTransition
                key={i}
                classNames="fade"
                timeout={250}
                appear
              >
                <HomeScreensItem
                  icon
                  name={item.name}
                  id={'addOns-' + item.id}
                  baseUrl={item.baseUrl}
                  downloadLink={item.link}
                  edit
                  remove
                  info={item.info}
                  progress={item.progress}
                  disabled={item.progress > 0}
                  strings={strings}
                  onChange={onChange}
                  type="addOns"
                />
              </CSSTransition>))}
            </TransitionGroup>
          </section>
        </React.Fragment>
        }

        {this.state.selectedUrl && this.state.selectedUrl === '/mobile' &&
          <section>
            <h5>{strings.deviceHomeScreenDescription}</h5>
            {showDeviceHSUploadButton && <FormField
              type="create"
              label={strings.uploadHomeScreen}
              dataKey="uploadHomeScreen"
              onChange={onChange}
            />}
            {legacy.length > 0 && <header className={styles.legacyHeader}>
              <div>{strings.name}</div>
              <div>{strings.bridgeVersion}</div>
              <div>{strings.configurationBundle}</div>
              <div className={styles.download}>{strings.downloadSource}</div>
            </header>}
            <TransitionGroup>
              {legacy.length > 0 && legacy.map((item, i) => (<CSSTransition
                key={i}
                classNames="fade"
                timeout={250}
                appear
              >
                <HomeScreensItem
                  id={'legacy-' + item.id}
                  name={item.name}
                  jsBridgeType={item.version}
                  downloadLink={item.link}
                  remove
                  onAssignClick={this.props.onAssignClick}
                  numberOfConfigBundleAssign={item.numberOfConfigBundleAssign}
                  showConfigAssign
                  progress={item.progress}
                  disabled={item.progress > 0}
                  strings={strings}
                  onChange={onChange}
                  type="mobile"
                />
              </CSSTransition>))}
            </TransitionGroup>
          </section>
        }
      </div>
    );
  }
}
