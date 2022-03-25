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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

const CrmOpportunity = props => {
  const {
    opportunity,
    variant,
    stage,
    crmIcon,
    strings,
    className,
  } = props;

  const styles = require('./CrmOpportunity.less');

  const cx = classNames.bind(styles);

  const opportunityContainer = cx({
    crmOpportunity: true,
    [variant]: true,
  }, className);

  const sfIcon = cx({
    [`icon-${crmIcon}`]: true,
    icon: true,
  }, className);

  return (
    <section className={opportunityContainer}>
      <div className={styles.opportunityWrapper}>
        <span>{strings.relatedTo}:</span>
        <div className={styles.opportunity}>
          <i className={sfIcon} />
          <p>{opportunity}</p>
        </div>
      </div>
      <div>
        <span>{strings.stage}:</span>
        <p>{stage}</p>
      </div>
    </section>
  );
};

CrmOpportunity.propTypes = {
  opportunity: PropTypes.string,
  stage: PropTypes.string,

  /** pass 'long' to change the layout into single row */
  variant: PropTypes.string,
  strings: PropTypes.object,
  className: PropTypes.string,
};

CrmOpportunity.defaultProps = {
  strings: {
    relatedTo: 'Related to',
    stage: 'Stage',
  },
};


export default CrmOpportunity;
