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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames';
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom';

import routes from './routes';
import Readme from 'containers/Readme/Readme';  // Index page
import MediaContext from 'components/MediaContext/MediaContext';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';

// White BTC logo
const BtcSvg = (props) => (
  <svg
    viewBox="0 0 512 512" className={props.className} style={props.style}
    width="64px"
  >
    <g id="icon-btc" transform="translate(32.000000, 36.000000)">
      <path d="M189,307.301587 C274.051851,307.301587 343,238.509784 343,153.650794 C343,68.7918035 274.051851,0 189,0 C103.948149,0 35,68.7918035 35,153.650794 C35,238.509784 103.948149,307.301587 189,307.301587 L189,307.301587 Z M189,296.058846 C110.171455,296.058846 46.2682927,232.300589 46.2682927,153.650794 C46.2682927,75.0009979 110.171455,11.242741 189,11.242741 C267.828545,11.242741 331.731707,75.0009979 331.731707,153.650794 C331.731707,232.300589 267.828545,296.058846 189,296.058846 L189,296.058846 Z" fill="#bbb" />
      <path d="M182,405.079365 C282.515824,405.079365 364,323.779961 364,223.492063 C364,123.204166 282.515824,41.9047619 182,41.9047619 C81.4841755,41.9047619 0,123.204166 0,223.492063 C0,323.779961 81.4841755,405.079365 182,405.079365 L182,405.079365 Z M182,375.12682 C98.0641053,375.12682 30.0206186,307.237627 30.0206186,223.492063 C30.0206186,139.7465 98.0641053,71.8573065 182,71.8573065 C265.935895,71.8573065 333.979381,139.7465 333.979381,223.492063 C333.979381,307.237627 265.935895,375.12682 182,375.12682 L182,375.12682 Z" fill="#ccc" />
      <path d="M259,440 C363.381818,440 448,355.573696 448,251.428571 C448,147.283447 363.381818,62.8571429 259,62.8571429 C154.618182,62.8571429 70,147.283447 70,251.428571 C70,355.573696 154.618182,440 259,440 L259,440 Z M259,391.45686 C181.488749,391.45686 118.653465,328.76406 118.653465,251.428571 C118.653465,174.093083 181.488749,111.400283 259,111.400283 C336.511251,111.400283 399.346535,174.093083 399.346535,251.428571 C399.346535,328.76406 336.511251,391.45686 259,391.45686 L259,391.45686 Z" fill="#fff" />
    </g>
  </svg>
);

export default class App extends Component {
  static childContextTypes = {
    settings: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      navHidden: false
    };
    autobind(this);
  }

  // Emulate settings context
  // for custom naming
  getChildContext() {
    return {
      settings: {
        company: {
          fileWatermarkText: 'styleguide'
        },
        naming: {
          tab: 'Custom Tab',
          tabs: 'Custom Tabs',
          channel: 'Custom Channel',
          channels: 'Custom Channels',
          story: 'Custom Story',
          stories: 'Custom Stories',
        },
        theme: {
          darkBaseColor: '#B03100',
          baseColor: '#F26724',
          backgroundColor: '#ffffff',
          lightBaseColor: '#FBD4BF',
          baseText: '#ffffff',
          accentColor: '#1e70c9',
          primaryText: '#000000',
          descriptionText: '#222222',
          secondaryText: '#777777',
          dividerColor: '#dddddd',
          destructiveColor: '#FF0000'
        }
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  handleToggleNavClick() {
    this.setState({ navHidden: !this.state.navHidden });

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  render() {
    const containerClasses = classNames({
      container: true,
      navHidden: this.state.navHidden
    });

    return (
      <Router>
        <ScrollToTop>
          <MediaContext>
            <div className="wrapper">
              <header id="page-header" onClick={this.handleToggleNavClick}>
                <BtcSvg />
                <h1>Web App Style Guide</h1>
              </header>

              <div className={containerClasses}>
                <div id="page-nav">
                  {routes.map(s => (
                    <nav key={s.id} className="menu">
                      <h3>{s.title}</h3>
                      <ul>
                        {s.id === 'general' && <li><NavLink to="/" exact activeClassName="active">README.md</NavLink></li>}
                        {s.routes.map(r => (
                          <li key={r.to}><NavLink to={r.to} activeClassName="active">{r.name}</NavLink></li>
                        ))}
                      </ul>
                    </nav>
                  ))}
                </div>

                <div id="page-content">
                  <Route exact path="/" component={Readme} />
                  {routes.map(s => (
                    s.routes.map(r => (
                      <Route
                        key={r.to}
                        path={r.to}
                        component={r.comp}
                      />
                    ))
                  ))}
                </div>
              </div>

              <footer id="page-footer">
                <p>Copyright &copy; Bigtincan {new Date().getFullYear()}</p>
              </footer>
            </div>
          </MediaContext>
        </ScrollToTop>
      </Router>
    );
  }
}
