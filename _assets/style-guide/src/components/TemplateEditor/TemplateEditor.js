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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import ReactGridLayout from 'react-grid-layout';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import Dialog from 'components/Dialog/Dialog';
import Text from 'components/Text/Text';

import AddModuleMenu from './AddModuleMenu/AddModuleMenu';

import TemplateEditorAddOnModal from './TemplateEditorAddOnModal';
import TemplateEditorItem from './TemplateEditorItem';
import TemplateEditorEditItem from './TemplateEditorEditItem';

// react-grid-layout styles
require('!style-loader!css-loader!react-grid-layout/css/styles.css');
require('!style-loader!css-loader!react-resizable/css/styles.css');

const messages = defineMessages({
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  clear: { id: 'clear', defaultMessage: 'Clear' },
  save: { id: 'save', defaultMessage: 'Save' },
  edit: { id: 'edit', defaultMessage: 'Edit' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  yesClearAll: { id: 'yes-clear-all', defaultMessage: 'Yes, clear all' },
  no: { id: 'no', defaultMessage: 'No' },
  close: { id: 'close', defaultMessage: 'Close' },
  moduleTitle: { id: 'module-title', defaultMessage: 'Module Title' },
  storySource: { id: 'story-source', defaultMessage: '{story} Source' },
  peopleSource: { id: 'people-source', defaultMessage: 'People Source' },
  fileSource: { id: 'file-source', defaultMessage: 'File Source' },
  bookmarkSource: { id: 'bookmark-source', defaultMessage: 'Bookmark Source' },

  itemsDisplayed: { id: 'items-displayed', defaultMessage: 'Items Displayed' },
  grid: { id: 'grid', defaultMessage: 'Grid' },
  list: { id: 'list', defaultMessage: 'List' },
  card: { id: 'card', defaultMessage: 'Card' },
  view: { id: 'view', defaultMessage: 'View' },
  editStoriesModule: { id: 'edit-stories-module', defaultMessage: 'Edit {stories} Module' },
  editFilesModule: { id: 'edit-files-module', defaultMessage: 'Edit Files Module' },
  editPeopleModule: { id: 'edit-people-module', defaultMessage: 'Edit People Module' },
  editBookmarkModule: { id: 'edit-bookmark-module', defaultMessage: 'Edit Bookmark Module' },

  noFilesToDisplay: { id: 'no-files-to-display', defaultMessage: 'No files to display' },
  noStoriesToDisplay: { id: 'no-stories-to-display', defaultMessage: 'No {stories} to display' },
  noPeopleToDisplay: { id: 'no-people-to-display', defaultMessage: 'No people to display' },
  noBookmarkToDisplay: { id: 'no-bookmark-to-display', defaultMessage: 'No bookmarks to display' },
  moduleEmptyListMessage: { id: 'module-empty-list-message', defaultMessage: 'Select a source to populate this module' },
  bookmarkEmptyListMessage: { id: 'bookmark-empty-list-message', defaultMessage: 'Bookmark some content to populate this module' },

  top: { id: 'top', defaultMessage: 'Top' },
  latest: { id: 'latest', defaultMessage: 'Latest' },
  mostViewed: { id: 'most-viewed', defaultMessage: 'Most Viewed' },
  recommended: { id: 'recommended', defaultMessage: 'Recommended' },
  recentlyViewed: { id: 'recently-viewed', defaultMessage: 'Recently Viewed' },
  liked: { id: 'liked', defaultMessage: 'Liked' },
  leaderboard: { id: 'leaderboard', defaultMessage: 'Leaderboard' },
  bookmarked: { id: 'bookmarked', defaultMessage: 'Bookmarked' },
  popular: { id: 'popular', defaultMessage: 'Popular' },

  addYourFirstModule: { id: 'add-your-first-module', defaultMessage: 'Add your first module' },
  confirmClear: { id: 'confirm-clear', defaultMessage: 'Confirm Clear' },
  confirmModuleClearMessage: { id: 'confirm-module-clear-message', defaultMessage: 'Are you sure you want to clear all modules?' },
  unsavedChanges: { id: 'unsaved-changes', defaultMessage: 'Unsaved Changes' },
  unsavedChangesMessage: { id: 'unsaved-changes-message', defaultMessage: 'You have unsaved content, are you sure you want to leave?' },
  exitWithoutSaving: { id: 'exit-without-saving', defaultMessage: 'Exit without Saving' },

  selectAddOn: { id: 'select-add-on', defaultMessage: 'Select Add-On' },
  searchAddOns: { id: 'search-add-ons', defaultMessage: 'Search Add-Ons' },
  noAddOnsAvailable: { id: 'no-add-ons-available', defaultMessage: 'No Add-Ons Available' },
  noAddOnsMessage: { id: 'no-add-ons-message', defaultMessage: 'Upload your Add-Ons in Home Screen Administration' },
});

/**
 * TemplateEditor renders full screen.
 */
export default class TemplateEditor extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    items: PropTypes.array,

    /** BTCA files available for use in Template */
    addOns: PropTypes.array,

    /** Maximum modules */
    maxItems: PropTypes.number,

    /** Applies fixed fullscreen CSS */
    fullscreen: PropTypes.bool,

    authString: PropTypes.string,

    onNameChange: PropTypes.func.isRequired,
    onAddItemClick: PropTypes.func.isRequired,
    onDeleteItemClick: PropTypes.func.isRequired,
    onEditItemClick: PropTypes.func.isRequired,
    onItemOptionChange: PropTypes.func.isRequired,
    onItemEditCloseClick: PropTypes.func.isRequired,

    /** Triggers on dragStop or resize */
    onLayoutChange: PropTypes.func.isRequired,

    /** Called when item is mounted */
    onGetItemData: PropTypes.func.isRequired,

    onCloseClick: PropTypes.func.isRequired,
    onClearClick: PropTypes.func.isRequired,
    onSaveClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object,
    settings: PropTypes.object
  };

  static defaultProps = {
    name: 'Untitled Homescreen',
    items: [],
    addOns: [],
    maxItems: 5,
    authString: ''
  };

  constructor(props) {
    super(props);

    // Set types that can be edited
    this.editTypes = ['file-list', 'story-list', 'user-list'];

    this.state = {
      canSave: false,
      editItem: props.items.find(i => i.edit),
      editItemPosition: { x: 100, y: 0 },
      editName: false,
      isDragging: false,
      showClearDialog: false,
      showCloseDialog: false,
      showAddOnPicker: false,
      width: window.innerWidth
    };
    autobind(this);

    // refs
    this.container = null;
    this.contentWrapper = null;
    this.homeWrapper = null;
    this.nameInput = null;
  }

  UNSAFE_componentWillMount() {
    document.body.style.overflow = 'hidden';
  }

  componentDidMount() {
    this.handleResize();

    // Listen to window resize
    window.addEventListener('resize', this.handleResize);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.items.length) {
      // At least one item must have a source
      this.setState({
        canSave: nextProps.items.find(i => i.source !== ''),
        editItem: nextProps.items.find(i => i.edit)
      });
    } else if (!nextProps.items.length) {
      this.setState({
        canSave: false,
        editItem: null
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Focus name input field
    if (this.state.editName && !prevState.editName) {
      this.nameInput.select();
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
    window.removeEventListener('resize', this.handleResize);
  }

  toggleClearDialog() {
    this.setState({ showClearDialog: !this.state.showClearDialog });
  }

  toggleCloseDialog() {
    this.setState({ showCloseDialog: !this.state.showCloseDialog });
  }

  toggleAddOnPickerModal() {
    this.setState({ showAddOnPicker: !this.state.showAddOnPicker });
  }

  handleNameClick() {
    this.setState({ editName: true });
  }

  handleNameBlur() {
    this.setState({ editName: false });
  }

  handleNameKeyUp(event) {
    if (event.keyCode === 13) {
      this.setState({ editName: false });
    }
  }

  handleResize() {
    this.setState({
      width: this.container.clientWidth
    });
  }

  handleCloseClick(event) {
    // Display confirmation
    if (this.state.canSave) {
      this.setState({ showCloseDialog: true });

    // Propagate event
    } else {
      this.props.onCloseClick(event);
    }
  }

  handleClearClick() {
    this.toggleClearDialog();
  }

  handleClearCancelClick() {
    this.toggleClearDialog();
  }

  handleClearConfirmClick(event) {
    this.toggleClearDialog();
    this.props.onClearClick(event);
  }

  handleCloseCancelClick() {
    this.toggleCloseDialog();
  }

  handleCloseConfirmClick(event) {
    this.toggleCloseDialog();
    this.props.onCloseClick(event);
  }

  handleAddOnCloseClick() {
    this.toggleAddOnPickerModal();
  }

  handleSaveClick(event) {
    event.preventDefault();
    const { name, items } = this.props;
    const filteredItems = [];

    // home template schema
    // TODO: sort by x/y order
    items.forEach(item => {
      // Filter deleted & items without source
      if (!item.deleted && item.source !== '') {
        filteredItems.push({
          i: item.i,
          layout: {
            x: item.layout.x,
            y: item.layout.y,
            h: item.layout.h,
            w: item.layout.w,
          },
          type: item.type,
          title: item.title,
          source: item.source,
          limit: item.limit,
          showThumb: item.showThumb,
          grid: item.grid,
          isNewDesign: item.isNewDesign || false,
          view: item.view || 'grid'
        });
      }
    });

    const data = {
      name: name,
      items: filteredItems
    };

    this.props.onSaveClick(data);
  }

  handleAddItemClick(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type;

    // Show picker if selecting Add-On
    if (type === 'btca') {
      this.toggleAddOnPickerModal();
      return;
    }

    // All other types added automatically
    this.props.onAddItemClick(type);
  }

  handleEditorEditItemDragStop(event, data) {
    this.setState({
      editItemPosition: {
        x: data.x,
        y: data.y
      }
    });
  }

  handleEditItemChange(elem) {
    const contentWrapperBounds = this.contentWrapper.getBoundingClientRect();
    const elemBounds = elem.getBoundingClientRect();

    // TemplateEditorEditItem dimensions
    const itemWidth = 288;

    // Module dimensions
    const moduleWidth = elemBounds.width;

    // this.contentWrapper offsets
    const offsetLeft = contentWrapperBounds.left;
    const offsetTop = contentWrapperBounds.top;
    const padding = 10;

    let newX = (elemBounds.x - offsetLeft) + moduleWidth + padding;
    const newY = elemBounds.y - offsetTop;

    // Determine if overflowing container
    if ((newX + moduleWidth) > this.container.clientWidth) {
      newX = elemBounds.x - (itemWidth + padding);

      // Prevent negative values
      if (newX < 0) {
        newX = moduleWidth - itemWidth - (padding * 7);
      }
    }

    this.setState({
      editItemPosition: {
        x: newX,
        y: newY
      }
    });
  }

  handleEditItemClick(i, event) {
    event.preventDefault();
    this.props.onEditItemClick(i);
  }

  handleAddOnClick(event, item) {
    event.preventDefault();
    this.props.onAddItemClick('btca', { source: item.props.id, baseUrl: item.props.baseUrl });
    this.toggleAddOnPickerModal();
  }

  handleDragStart(layout, oldItem) {
    // Clear editItem if dragging another item
    const item = this.props.items.find(o => o.i === oldItem.i && o.edit);
    if (!item && this.state.editItem) {
      this.props.onItemEditCloseClick(this.state.editItem.i);
    }

    this.setState({
      isDragging: true
    });
  }

  handleDragStop(layout) {
    this.handleLayoutChange(layout);

    // Allow react-grid animation to end
    setTimeout(() => {
      this.setState({ isDragging: false });
    }, 200);
  }

  handleLayoutChange(layout) {
    const { items } = this.props;
    const newItems = [];

    layout.forEach(newItem => {
      const existing = items.find(i => i.i === newItem.i);
      if (existing) {
        newItems.push({
          ...existing,
          layout: {
            x: newItem.x,
            y: newItem.y,
            w: newItem.w,
            h: newItem.h,
            minW: newItem.minW,
            maxW: newItem.maxW,
            minH: newItem.minH,
            maxH: newItem.maxH,
          }
        });
      }
    });

    this.setState({ canSave: true });
    this.props.onLayoutChange(newItems);
  }

  handleItemScrollTo(elem) {
    if (this.homeWrapper) {
      const bounds = elem.getBoundingClientRect();
      const scrollTop = bounds.y + bounds.height;
      this.homeWrapper.scrollTop = scrollTop;
    }
  }

  handleContainerMount(node) {
    this.container = node;
    return this.container;
  }

  handleContentWrapperMount(node) {
    this.contentWrapper = node;
    return this.contentWrapper;
  }

  handleHomeWrapperMount(node) {
    this.homeWrapper = node;
    return this.homeWrapper;
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const { items, name, authString } = this.props;
    const { canSave, editItem, editItemPosition, editName, isDragging } = this.state;
    const styles = require('./TemplateEditor.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      TemplateEditor: true,
      fullscreen: this.props.fullscreen
    }, this.props.className);
    const homeWrapperClasses = cx({
      homeWrapper: true,
      isEmpty: !items.length,
      editMode: editItem && editItem.type
    });

    // Only one FeaturedSlider allowed
    const hasFeaturedItem = items.findIndex(e => e.type === 'featured-list') > -1;

    // BTCA limit
    const canAddBtca = items.filter(e => e.type === 'btca').length < 4;

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    const layouts = items.map(item => item.layout);

    return (
      <div className={classes} ref={this.handleContainerMount}>
        <header id="template-editor-header" className={styles.editHeader}>
          <div className={styles.wrapper}>
            <div className={styles.actions}>
              <Btn
                aria-label={strings.clear}
                icon="eraser"
                warning
                large
                disabled={!items.length}
                className={styles.clearBtn}
                onClick={this.handleClearClick}
              />
              <AddModuleMenu
                btca={canAddBtca}
                files
                stories
                users
                featuredStories={!hasFeaturedItem}
                onItemClick={this.handleAddItemClick}
                className={styles.addModuleMenu}
              />
              {!editName && <span className={styles.name} onClick={this.handleNameClick}>{name}</span>}
              {editName && <Text
                ref={(c) => { this.nameInput = c; }}
                value={name}
                maxLength={40}
                autosize
                onBlur={this.handleNameBlur}
                onKeyUp={this.handleNameKeyUp}
                onChange={this.props.onNameChange}
              />}
            </div>
            <div className={styles.actions}>
              <Btn
                data-id="cancel"
                aria-label={strings.cancel}
                alt
                large
                onClick={this.handleCloseClick}
              >
                {strings.cancel}
              </Btn>
              <Btn
                data-id="save"
                aria-label={strings.save}
                inverted
                large
                disabled={!canSave}
                loading={this.props.saving}
                onClick={this.handleSaveClick}
              >
                {strings.save}
              </Btn>
            </div>
          </div>
        </header>

        <div
          ref={this.handleContentWrapperMount}
          className={styles.contentWrapper}
        >
          <div
            ref={this.handleHomeWrapperMount}
            className={homeWrapperClasses}
          >
            {!items.length && <Blankslate message={strings.addYourFirstModule} icon="browser" />}
            {items.length > 0 && <ReactGridLayout
              cols={12}
              rowHeight={120}  // match HomeTemplate
              margin={items[0].isNewDesign ? [0, 0] : [20, 20]}
              containerPadding={[16, 2]}
              width={this.state.width}
              onDragStart={this.handleDragStart}
              onDragStop={this.handleDragStop}
              onResizeStop={this.handleLayoutChange}
              layout={layouts}
            >
              {items.map(item => (
                <div key={item.i} data-grid={item.layout}>
                  <TemplateEditorItem
                    {...item}
                    strings={strings}
                    authString={authString}
                    onGetData={this.props.onGetItemData}
                    onEditChange={this.handleEditItemChange}
                    onEditClick={this.handleEditItemClick}
                    onDeleteClick={this.props.onDeleteItemClick}
                    onScrollTo={this.handleItemScrollTo}
                  />
                </div>
              ))}
            </ReactGridLayout>}
          </div>
          {(editItem && this.editTypes.indexOf(editItem.type) > -1 && !isDragging) &&
          <TemplateEditorEditItem
            {...editItem}
            strings={strings}
            position={editItemPosition}
            onDragStop={this.handleEditorEditItemDragStop}
            onOptionChange={this.props.onItemOptionChange}
            onCloseClick={this.props.onItemEditCloseClick}
          />}
        </div>

        <Dialog
          title={strings.confirmClear}
          message={strings.confirmModuleClearMessage}
          isVisible={this.state.showClearDialog}
          cancelText={strings.cancel}
          confirmText={strings.yesClearAll}
          onCancel={this.handleClearCancelClick}
          onConfirm={this.handleClearConfirmClick}
        />

        <Dialog
          title={strings.unsavedChanges}
          message={strings.unsavedChangesMessage}
          isVisible={this.state.showCloseDialog}
          cancelText={strings.no}
          confirmText={strings.close}
          onCancel={this.handleCloseCancelClick}
          onConfirm={this.handleCloseConfirmClick}
        />

        <TemplateEditorAddOnModal
          isVisible={this.state.showAddOnPicker}
          addOns={this.props.addOns}
          onAddClick={this.handleAddOnClick}
          onClose={this.handleAddOnCloseClick}
        />
      </div>
    );
  }
}
