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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  addTag,
  deleteTag,
  loadCompanyImages,
  loadUnsplashImages,
  reset,
  resetTags,
  selectSingleImage,
  setThumbnailTags,
  uploadThumbnail
} from 'redux/modules/browser';
import { createPrompt } from 'redux/modules/prompts';

import Blankslate from 'components/Blankslate/Blankslate';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Btn from 'components/Btn/Btn';
import ImageCrop from 'components/ImageCrop/ImageCrop';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';
import Tags from 'components/Tags/Tags';
import Text from 'components/Text/Text';

const messages = defineMessages({
  coverArtLibrary: { id: 'cover-art-library', defaultMessage: 'Cover Art Library' },
  featuredLibrary: { id: 'featured-image-library', defaultMessage: 'Featured Image Library' },
  loading: { id: 'loading', defaultMessage: 'Loading' },
  done: { id: 'done', defaultMessage: 'Done' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  select: { id: 'select', defaultMessage: 'Select' },
  upload: { id: 'upload', defaultMessage: 'Upload' },
  gallery: { id: 'gallery', defaultMessage: 'Gallery' },
  companyImages: { id: 'company-images', defaultMessage: 'Company Images' },
  repositionAndScale: { id: 'reposition-scale', defaultMessage: 'Reposition & Scale' },
  searchOnUnsplash: { id: 'search-on-unsplash', defaultMessage: 'Search on Unsplash.com...' },
  searchCompanyImages: { id: 'search-company-images', defaultMessage: 'Search Company Images...' },
  tags: { id: 'tags', defaultMessage: 'Tags' },

  uploadImage: { id: 'upload-image', defaultMessage: 'Upload Image' },

  noImagesMessage: { id: 'no-images-available', defaultMessage: 'No images available' },

  addImageTagsNote: { id: 'add-image-tags-note', defaultMessage: 'Add tags to this image to make it easier to find later.' },
  searchPlaceholder: { id: 'tag-search-placeholder', defaultMessage: 'New Tag...' },
});

// 384 (Merck / MSD Animal Health)
// 426 (Merck and MSD BigTinCan)
const companyIds = [384, 426];

class ImageItem extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    url: PropTypes.string.isRequired,
    author: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    category: PropTypes.string,
    tags: PropTypes.array,
    isSelected: PropTypes.bool,
    authString: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleLink(event) {
    event.stopPropagation();
  }

  handleClick(event) {
    // Propagate event
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event, this);
    }
  }

  render() {
    const { url, author, isSelected, authString, category } = this.props;
    const styles = require('./ImagePickerModal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ImageItem: true,
      isSelected: isSelected,
      isFeatured: category === 'featured_story_image'
    });

    return (
      <div
        className={classes}
        onClick={this.handleClick}
        style={{
          backgroundImage: 'url(' + url + authString + ')'
        }}
      >
        {author && author.name && <div className={styles.author}>
          <p>
            <a
              href={author.profile_url}
              rel="noopener noreferrer"
              target="_blank"
              onClick={this.handleLink}
            >
              <span>{author.name}</span>
            </a>
          </p>
        </div>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { browser, settings } = state;
  const images = browser.images.map(id => browser.imagesById[id]);
  const unsplash = browser.unsplash.map(id => browser.imagesById[id]);

  // Find selected images
  const selectedImages = [];
  const selectedCompany = images.find(img => img.isSelected);
  const selectedUnsplash = unsplash.find(img => img.isSelected);
  if (selectedCompany) {
    selectedImages.push(selectedCompany);
  }
  if (selectedUnsplash) {
    selectedImages.push(selectedUnsplash);
  }

  return {
    ...browser,
    company: settings.company,
    images: images,
    unsplash: unsplash,
    selectedImages: selectedImages
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    addTag,
    deleteTag,
    loadCompanyImages,
    loadUnsplashImages,
    reset,
    resetTags,
    selectSingleImage,
    setThumbnailTags,
    uploadThumbnail,

    createPrompt
  })
)
export default class ImagePickerModal extends Component {
  static propTypes = {
    category: PropTypes.oneOf(['cover_art', 'featured_story_image']),
    images: PropTypes.array,
    unsplash: PropTypes.array,

    unsplashEnabled: PropTypes.bool,

    // Canvas size
    width: PropTypes.number,
    height: PropTypes.number,

    // File Drag n dropped
    imageDropped: PropTypes.object,
    resetImageDropped: PropTypes.func,

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    images: [],
    unsplash: [],
    unsplashEnabled: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentTagSearch: '',
      searchValue: '',
      selectedCat: props.unsplashEnabled && !(window.location.hostname.includes('.com') && companyIds.includes(props.company.id)) ? 'unsplash' : 'company',
      uploadActive: false,
      tagActive: false,
      imageUploaded: '',
      base64Image: ''
    };
    autobind(this);

    // refs
    this.fileSelector = null;
  }

  UNSAFE_componentWillMount() {
    if (!this.props.images.length && !this.props.imagesLoading) {
      this.props.loadCompanyImages(this.props.category);
    }
    if (this.props.unsplashEnabled && !this.props.unsplash.length && !this.props.unsplashLoading) {
      this.props.loadUnsplashImages(this.props.category);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.state.imageUploaded && nextProps.imageDropped && nextProps.imageDropped.preview) {
      this.setState({
        imageUploaded: nextProps.imageDropped.preview,
        uploadActive: true,
        tagActive: false
      });
    }
  }

  componentDidUpdate() {
    const { tagActive, uploadActive } = this.state;

    if (uploadActive && !tagActive && this.props.thumbnailComplete) {
      this.handleTagSection();
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  handleCatClick(event) {
    const id = event.target.dataset.id;
    this.setState({ selectedCat: id });
  }

  handleSearchChange(event) {
    const value = event.target.value;
    this.setState({ searchValue: value });
  }

  handleKeyUp(event) {
    const value = event.target.value;
    // On press enter make a search
    if (event.which === 13 || event.keyCode === 13) {
      this.props.reset();
      this.props.loadUnsplashImages(this.props.category, value);
      this.props.loadCompanyImages(this.props.category, value);
    }
  }

  handleImageClick(event, image) {
    event.preventDefault();
    this.props.selectSingleImage(image.props.id);
  }

  handleTagDelete(event) {
    event.preventDefault();
    const tagIndex = event.currentTarget.dataset.index;

    this.props.deleteTag(tagIndex);
  }

  handleTagInputChange(event) {
    const value = event.target.value;

    this.setState({
      currentTagSearch: value
    });
  }

  handleTagInputKeyDown(event) {
    const tagName = event.target.value;

    // handle return clicked
    if ((event.keyCode === 13 || event.keyCode === 32) && !event.shiftKey && /\S/.test(tagName)) {
      event.preventDefault();

      this.setState({ currentTagSearch: '' });
      this.props.addTag(tagName);
    }
  }

  handleListScroll(event) {
    const target = event.target;
    const { selectedCat, searchValue } = this.state;
    const {
      images,
      unsplash,
      imagesLoading,
      unsplashLoading,
      unsplashComplete,
      imagesComplete
    } = this.props;

    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left
    const activeCategoryNotLoading = (selectedCat === 'unsplash' && !unsplashLoading) ||
      (selectedCat === 'company' && !imagesLoading);

    // Don't trigger if already loading
    if (scrollBottom >= loadTrigger && activeCategoryNotLoading) {
      // Load more
      if (selectedCat === 'unsplash' && !unsplashComplete) {
        this.props.loadUnsplashImages(this.props.category, searchValue, unsplash.length);
      } else if (selectedCat === 'company' && !imagesComplete) {
        this.props.loadCompanyImages(this.props.category, searchValue, images.length);
      }
    }
  }


  // Upload Image functions
  handleUploadClick() {
    this.fileSelector.click();
  }

  handleFileUploadSelected(event) {
    const files = event.target.files; // FileList object

    if (files.length && files[0].size <= 1024 * 1024 * 1) { // not bigger than 1MB
      this.processFileUpload(files[0]);
      this.setState({ uploadActive: true, tagActive: false });
    } else {
      this.handleCancelUploadClick();

      const imageSizeErrorMesage = (<FormattedMessage
        id="image-size-should-be-less-n"
        defaultMessage="Images size should be less than 1MB"
        values={{ size: '1MB' }}
      />);

      this.props.createPrompt({
        id: uniqueId(),
        type: 'warning',
        title: 'Warning',
        message: imageSizeErrorMesage,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  processFileUpload(f) {
    const self = this;
    const reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function() {
      return function(e) {
        self.setState({ imageUploaded: e.target.result });
      };
    }(f));

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }

  // Cropping Image result
  handleOnImageChange(image) {
    this.setState({ base64Image: image });
  }

  handleCancelUploadClick() {
    this.setState({ uploadActive: false, tagActive: false, currentTagSearch: '' });
    this.props.resetImageDropped(); // reset parent dropped file
    this.props.resetTags();
    this.fileSelector.value = '';
  }

  handleTagSection() {
    this.setState({ uploadActive: false, tagActive: true });
  }

  handleSaveClick(event) {
    const { uploadActive, tagActive, selectedCat } = this.state;
    if (!uploadActive && !tagActive) {
      this.props.onSave(event, this.props.selectedImages, selectedCat);
    } else if (uploadActive && !tagActive) {
      if (!this.props.thumbnailUploading) {
        this.props.uploadThumbnail(this.props.category, this.state.base64Image);
      }
    } else if (!uploadActive && tagActive) {
      this.props.setThumbnailTags(this.props.category, this.props.thumbnailId, this.props.tags);
      // Back and select new Image
      this.setState({ selectedCat: 'company', currentTagSearch: '' });
      this.handleCancelUploadClick();
    }
    //upload the same image twice

    this.fileSelector.value = '';
  }

  handleBreadcrumbClick(event) {
    event.preventDefault();
    this.handleCancelUploadClick();
  }

  render() {
    const { authString } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const {
      category,
      images,
      unsplash,
      onClose,
      thumbnailUploading,
      company,
    } = this.props;
    const { selectedCat, searchValue, uploadActive, tagActive } = this.state;
    const styles = require('./ImagePickerModal.less');
    const cx = classNames.bind(styles);

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Search placeholder
    const searchPlaceholder = selectedCat === 'unsplash' ? strings.searchOnUnsplash : strings.searchCompanyImages;

    // Loading
    const activeCategoryLoading = selectedCat === 'unsplash' && this.props.unsplashLoading && !unsplash.length ||
        selectedCat === 'company' && this.props.imagesLoading && !images.length;

    const activeCategoryImgLength = selectedCat === 'unsplash' ? unsplash.length : images.length;
    const errorMsg = selectedCat === 'unsplash' ? this.props.unsplashError : this.props.imagesError;

    const listWrapClasses = cx({
      listWrap: true,
      loading: activeCategoryLoading
    });

    const imageWrapClasses = cx({
      avatar: !category || category === 'cover_art',
      featured: category === 'featured_story_image'
    });

    // Header breadcrumbs
    let paths = [{
      name: this.props.category === 'featured_story_image' ? strings.featuredLibrary : strings.coverArtLibrary,
      path: ''
    }];

    // Upload menu active
    if (uploadActive) {
      paths = [{
        name: strings.repositionAndScale,
        path: ''
      }];
    } else if (tagActive) {
      paths.push({
        name: strings.upload,
        path: ''
      });
    }

    return (
      <Modal
        id="image-picker"
        backdropClosesModal
        escClosesModal
        isVisible={this.props.isVisible}
        headerChildren={(
          <div>
            <Breadcrumbs paths={paths} onPathClick={this.handleBreadcrumbClick} className={styles.headerCrumbs} />
            <input
              ref={(c) => { this.fileSelector = c; }}
              name="files"
              id="files"
              type="file"
              onChange={this.handleFileUploadSelected}
              style={{ display: 'none', opacity: 0 }}
              accept="image/*"
            />
          </div>
        )}
        footerChildren={(
          <div>
            <Btn
              data-id="cancel"
              large
              alt
              onClick={uploadActive || tagActive ? this.handleCancelUploadClick : onClose}
            >
              {strings.cancel}
            </Btn>
            <Btn
              data-id="select"
              large
              inverted
              onClick={this.handleSaveClick}
              disabled={!uploadActive && !tagActive && this.props.selectedImages.length === 0 || thumbnailUploading}
            >
              {thumbnailUploading && strings.loading}
              {!thumbnailUploading && uploadActive && !tagActive && strings.upload}
              {!thumbnailUploading && !uploadActive && tagActive && strings.done}
              {!thumbnailUploading && !uploadActive && !tagActive && strings.select}
            </Btn>
          </div>
        )}
        className={styles.ImagePickerModal}
        headerClassName={styles.header}
        bodyClassName={styles.body}
        footerClassName={styles.footer}
        onClose={onClose}
      >
        {!uploadActive && !tagActive && <div className={styles.bodyWrap}>
          <div className={styles.navWrap}>
            <nav className={styles.catNav}>
              <ul>
                {!(window.location.hostname.includes('.com') && companyIds.includes(company.id)) && <li data-id="unsplash" className={selectedCat === 'unsplash' ? styles.active : ''} onClick={this.handleCatClick}>{strings.gallery}</li>}
                <li data-id="company" className={selectedCat === 'company' ? styles.active : ''} onClick={this.handleCatClick}>{strings.companyImages}</li>
                <li data-id="upload" onClick={this.handleUploadClick}>{strings.upload}</li>
              </ul>
            </nav>
            <Text placeholder={searchPlaceholder} value={searchValue} onChange={this.handleSearchChange} onKeyUp={this.handleKeyUp} className={styles.search} />
          </div>
          {!activeCategoryLoading && <div className={listWrapClasses} onScroll={this.handleListScroll}>
            {errorMsg && activeCategoryImgLength === 0 && <Blankslate middle icon="error" message={errorMsg || 'Unknown error'} />}
            {!errorMsg && activeCategoryImgLength === 0 && <Blankslate middle icon="content" heading={strings.noImagesMessage} />}
            {images.length > 0 && <ul data-id="company-image-list" className={styles.imageList} style={{ display: selectedCat === 'company' ? 'block' : 'none' }}>
              {images.map(img => (<li key={img.id}>
                <ImageItem
                  {...img}
                  category={this.props.category}
                  authString={authString}
                  styles={styles}
                  onClick={this.handleImageClick}
                />
              </li>))}
            </ul>}
            {unsplash.length > 0 && <ul data-id="unsplash-image-list" className={styles.imageList} style={{ display: selectedCat === 'unsplash' ? 'block' : 'none' }}>
              {unsplash.map(img => (<li key={img.id}>
                <ImageItem
                  {...img}
                  category={this.props.category}
                  authString="" // Do no attach token to Unsplash images
                  styles={styles}
                  onClick={this.handleImageClick}
                />
              </li>))}
            </ul>}
          </div>}
          {activeCategoryLoading && <div className={styles.loading}><Loader type="content" /></div>}
        </div>}

        {!uploadActive && tagActive && <div>
          <div className={styles.imageCrop}>
            <span className={imageWrapClasses} style={{ backgroundImage: 'url(' + this.props.thumbnail + '&access_token=' + authString + ')' }} />
            <p className={styles.tagsInfo}>{strings.addImageTagsNote}</p>
          </div>
          <div className={styles.StoryEditTags}>
            <h3>{strings.tags}</h3>
            <div className={styles.tagSearch}>
              <Tags
                strings={strings}
                list={this.props.tags}
                onItemDeleteClick={this.handleTagDelete}
                className={styles.tagList}
                enableInput
                currentSearch={this.state.currentTagSearch}
                onInputKeyDown={this.handleTagInputKeyDown}
                onInputChange={this.handleTagInputChange}
              />
            </div>
          </div>
        </div>}

        {!tagActive && uploadActive && <div className={styles.imageCrop}>
          <ImageCrop
            image={this.state.imageUploaded}
            width={this.props.width}
            height={this.props.height}
            resize={this.props.resize}
            resizeWidth={this.props.resizeWidth}
            resizeHeight={this.props.resizeHeight}
            showZoom
            onImageChange={this.handleOnImageChange}
          />
        </div>}
      </Modal>
    );
  }
}
