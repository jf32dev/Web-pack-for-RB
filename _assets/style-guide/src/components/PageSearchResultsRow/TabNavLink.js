/**
 *
 * BIGTINCAN - CONFIDENTIAL
 *
 * This component is ONLY used as a child component in <PageSearchResultsRow /> for rendering navigation tab
 *
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of BigTinCan Mobile Pty Ltd and its suppliers,
 * if any. The intellectual and technical concepts contained herein are proprietary to BigTinCan Mobile Pty Ltd and its
 * suppliers and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or
 * copyright law. Dissemination of this information or reproduction of this material is strictly forbidden unless prior
 * written permission is obtained from BigTinCan Mobile Pty Ltd.
 *
 * @package hub-web-app-v5
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Yi Zhang <yi.zhang@bigtincancom>
 */

import React from 'react';
import { NavLink } from 'react-router-dom';

const TabNavLink = ({ to, isActive, onClick, className, label, count }) => (<li className={className}>
  <NavLink
    to={to}
    activeClassName="active"
    isActive={isActive}
    onClick={onClick}
  >
    {label} {count === 0 ? '(0)' : !!count && `(${count})`}
  </NavLink>
</li>);

export default TabNavLink;
