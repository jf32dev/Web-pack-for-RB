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
 * @package hub-web-app-v5
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React, { Component, Suspense, lazy, Fragment } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import {
  setData as setShareData
} from 'redux/modules/share';
import {
  loadShares,
  loadShareDetails,
  loadUsersTimeOnPageStatsForFile,
  loadSelectedUserTimeOnPageStatsForFiles,
  setHubShareFileThumbnails
} from 'redux/modules/me';

import {
  loadHtmlData,
} from 'redux/modules/viewer';

import AccessDenied from 'components/AccessDenied/AccessDenied';
import AppHeader from 'components/AppHeader/AppHeader';
import Blankslate from 'components/Blankslate/Blankslate';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import TriggerList from 'components/TriggerList/TriggerList';
import SVGIcon from 'components/SVGIcon/SVGIcon';

import Loader from 'components/Loader/Loader';

const ShareDetail = lazy(() => import('components/Share/ShareDetail'));

const messages = defineMessages({
  me: { id: 'me', defaultMessage: 'Me' },
  shares: { id: 'shares', defaultMessage: 'Shares' },
  people: { id: 'people', defaultMessage: 'People' },
  noHubSharesHeading: { id: 'no-hubshares-heading', defaultMessage: 'No HubShares' },
  noHubSharesMessage: { id: 'no-hubshares-message', defaultMessage: 'When you send HubShares you can view stats here.' },
  newHubShare: { id: 'new-hubshare', defaultMessage: 'New HubShare' },

  noSharesSelectedHeading: { id: 'no-shares-selected-heading', defaultMessage: 'Select a Share' },
  noSharesSelectedMessage: { id: 'no-shares-selected-message', defaultMessage: 'Select a share to view details.' },

  noSharedFilesHeading: { id: 'no-shared-files-heading', defaultMessage: 'No files' },
  noSharedFilesMessage: { id: 'no-shared-files-message', defaultMessage: 'This share does not contain any files.' },

  noSubject: { id: 'no-subject', defaultMessage: 'No Subject' }
});


function mapStateToProps(state, ownProps) {
  const { me, entities, settings, share } = state;
  const shares = me.shares.map(id => me.sharesById[id]);
  const shareId = ownProps.match.params.shareId;

  const selectedShare = {
    ...me.sharesById[shareId],
    timeOnPageStatsByFileId: {
      ...me.usersTimeOnPageStats[shareId]
    },
    userTimeOnPageStatsForFiles: {
      ...me.userTimeOnPageStatsForFiles[shareId]
    }
  };

  return {
    ...me,
    filesEntity: entities.files,
    shares,
    selectedShare,
    languages: settings.languages,

    shareSent: share.sent
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    loadShares,
    setShareData,
    loadShareDetails,
    loadUsersTimeOnPageStatsForFile,
    loadSelectedUserTimeOnPageStatsForFiles,
    setHubShareFileThumbnails,
    loadHtmlData
  })
)
export default class Shares extends Component {
  static propTypes = {
    shares: PropTypes.array,
    sharesLoaded: PropTypes.bool,
    sharesLoading: PropTypes.bool,
    sharesComplete: PropTypes.bool,

    loadShares: PropTypes.func.isRequired,
    loadSelectedUserTimeOnPageStatsForFiles: PropTypes.func.isRequired,
    setHubShareFileThumbnails: PropTypes.func.isRequired,

    loadUsersTimeOnPageStatsForFile: PropTypes.func.isRequired,

    onAnchorClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    shares: [],
  };

  constructor(props) {
    super(props);
    this.myAppHeaderRef = React.createRef();
    autobind(this);
  }

  componentDidMount() {
    if (this.props.match.params.shareId) {
      this.props.loadShareDetails(this.props.match.params.shareId);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Selected Share changed
    if (nextProps.match.params.shareId && nextProps.match.params.shareId !== this.props.match.params.shareId) {
      this.props.loadShareDetails(nextProps.match.params.shareId);
    }
    // new share created - reload shares
    if (nextProps.shareSent === true && this.props.shareSent === false) {
      this.props.loadShares();
    }
  }

  handleSharesLoad(offset) {
    this.props.loadShares(offset);
  }

  handleCloseClick(event) {
    event.preventDefault();
    this.props.history.push('/');
  }

  handleShareClick({ shareSessionId }) {
    this.props.history.push(`/share/${shareSessionId}`);
  }

  handleLoadSelectedUserTimeOnPageStatsForFiles(shareSessionId, userShareId) {
    this.props.loadSelectedUserTimeOnPageStatsForFiles(shareSessionId, userShareId);
  }

  handleLoadUsersTimeOnPageStatsForFile(shareId, fileId) {
    this.props.loadUsersTimeOnPageStatsForFile(shareId, fileId);
  }

  handleSetHubShareThumbnails(sharedFileId, thumbnails, fileCategory) {
    this.props.setHubShareFileThumbnails(sharedFileId, thumbnails, fileCategory);
  }

  handleLoadHtmlData(fileId) {
    this.props.loadHtmlData(fileId);
  }

  handleOpenShareModal() {
    this.props.setShareData({
      id: 0,
      isVisible: true,
      name: '',
      showMoreOptions: true, // go to advance share when enabled
      files: [],
      url: '',
      subject: this.context.settings.sharing.defaultSubject,
      sharingPublic: this.context.settings.storyDefaults.sharingPublic,
      sharingFacebookDescription: '',
      sharingLinkedinDescription: '',
      sharingTwitterDescription: '',
    });
  }

  handleFileClick(event) {
    event.preventDefault();
  }

  getCrumbWrapStyle() {
    const dom = this.myAppHeaderRef.current;
    let style = null;
    if (dom) {
      const { width } = dom.getBoundingClientRect();
      style = { paddingRight: `calc(${width}px - 3.125rem)` };
    }

    return style;
  }

  render() {
    const { userCapabilities, authString, fileSettings } = this.context.settings;
    const { hasShare } = userCapabilities;
    const { formatMessage } = this.context.intl;
    const { shares, selectedShare, onAnchorClick, languages, hubShareFileThumbnails, filesEntity } = this.props;

    // No Shares available
    const noShares = !shares.length && this.props.sharesLoaded;

    const styles = require('./Shares.less');
    const cx = classNames.bind(styles);
    const sharesListClasses = cx({
      sharesList: true,
      sharesListEmpty: noShares
    });

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Check user permission
    if (!hasShare) {
      return (
        <AccessDenied
          heading="Access Denied"
          message="You are not allowed to view Shares"
          onCloseClick={this.handleCloseClick}
        />
      );
    }

    // Me > Shares
    const path = [{
      name: strings.me,
      path: '/me'
    }, {
      name: strings.shares,
      path: '/shares'
    }];

    return (
      <div className="listContainer">
        <Helmet>
          <title>{strings.shares}</title>
        </Helmet>
        <AppHeader myAppHeaderRef={this.myAppHeaderRef} />
        <div className={sharesListClasses}>
          <header className={styles.crumbWrap}>
            <Breadcrumbs
              paths={path}
              onPathClick={onAnchorClick}
            />
          </header>
          {noShares && <Blankslate
            altMessage="There are no hubshares."
            icon={<SVGIcon type="email" style={{ marginTop: '-0.25rem' }} />}
            middle
            heading={strings.noHubSharesHeading}
            message={strings.noHubSharesMessage}
            btnMessage={strings.newHubShare}
            onClickHandler={this.handleOpenShareModal}
          />}
          {!noShares && <div className={styles.listWrapper}>
            <div className={styles.sharesWrap}>
              <TriggerList
                list={shares}
                isLoaded={shares.length > 1}
                isLoading={this.props.sharesLoading}
                isLoadingMore={this.props.sharesLoading && shares.length > 0}
                isComplete={this.props.sharesComplete}
                onGetList={this.handleSharesLoad}
                style={{ height: '100%' }}
                listProps={{
                  fileSettings: fileSettings,
                  type: 'share',
                  activeId: selectedShare ? selectedShare.shareSessionId : 0,
                  showThumb: true,
                  thumbSize: 'small',
                  emptyHeading: strings.noHubSharesHeading,
                  emptyMessage: strings.noHubSharesMessage,
                  onItemClick: this.handleShareClick,
                }}
              />
            </div>
          </div>}
        </div>

        {!noShares && <div className={styles.shareInfoList}>
          {selectedShare && !selectedShare.shareSessionId && <Blankslate
            icon="content"
            middle
            heading={strings.noSharesSelectedHeading}
            message={strings.noSharesSelectedMessage}
          />}
          {selectedShare && selectedShare.shareSessionId && selectedShare.shareDetailsLoading && <Loader type="content" style={{ margin: '0 auto', height: '100%' }} />}
          {selectedShare && selectedShare.shareSessionId && !selectedShare.shareDetailsLoading && (
          <Fragment>
            <header className={styles.crumbWrap} style={this.getCrumbWrapStyle()}>
              <h3>{selectedShare.subject || `(${strings.noSubject})`}</h3>
            </header>
            <Suspense fallback={<Loader type="content" />}>
              {selectedShare && selectedShare.shareSessionId && <ShareDetail
                authString={authString}
                {...selectedShare}
                {...{ languages }}
                {...{ authString }}
                {...{ hubShareFileThumbnails }}
                {...{ filesEntity }}
                {...{ fileSettings }}
                onShareRecipientClick={this.handleLoadSelectedUserTimeOnPageStatsForFiles}
                onSetHubShareThumbnails={this.handleSetHubShareThumbnails}
                onLoadHtmlData={this.handleLoadHtmlData}
                onLoadUsersTimeOnPageStatsForFile={this.handleLoadUsersTimeOnPageStatsForFile}
              />}
            </Suspense>
          </Fragment>
          )}
        </div>}
      </div>
    );
  }
}
