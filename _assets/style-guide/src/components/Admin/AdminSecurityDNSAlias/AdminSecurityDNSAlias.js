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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Yi Zhang <yi.zhang@bigtincan.com>
 */
import React, { useReducer, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';

import Text from 'components/Text/Text';
import Dialog from 'components/Dialog/Dialog';
import Btn from 'components/Btn/Btn';

const editDNSAliasReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const editDNSAliasInitState = {
  inputAlias: '',
  originalAlias: '',
  isEditing: false,
  showingSaveDnsDialogue: false,
  showingDeleteDnsDialogue: false
};

const EditDNSAlias = ({
  alias,
  styles,
  strings,
  onValidation,
  dnsAvailability,
  onDeleteClick,
  onSave,
  isBtnDisabled,
  resetErrorMessage,
  setHasUnsavedDnsAlias
}) => {
  const [state, dispatch] = useReducer(editDNSAliasReducer, editDNSAliasInitState);
  const { inputAlias, originalAlias, isEditing, showingSaveDnsDialogue, showingDeleteDnsDialogue } = state;
  const { urls: dnsAliasUrls, alias: aliasName } = alias;
  const inputRef = React.createRef();

  const setData = (data) => {
    dispatch({ type: 'SET', payload: data });
  };

  const handleOnInputChange = (e) => {
    const { value } = e.target;

    if (value === originalAlias) {
      setHasUnsavedDnsAlias(false);
    } else {
      setHasUnsavedDnsAlias(true);
    }
    setData({ inputAlias: value });

    if (value !== originalAlias) {
      onValidation({ id: alias.id, alias: value });
    }
  };

  const handleOnInputChangeDebounce = _compose(
    _debounce(handleOnInputChange, 300),
    _clone
  );

  const handleInputOnFocus = () => {
    setData({ isEditing: true });
  };

  const handleCancelBtnOnClick = () => {
    if (!inputRef) return;
    inputRef.current.text.value = originalAlias;
    setHasUnsavedDnsAlias(false);
    setData({ inputAlias: originalAlias, isEditing: false });
    resetErrorMessage(alias.id);
  };

  useEffect(() => {
    setData({ originalAlias: aliasName, inputAlias: aliasName });
  }, [alias.id, aliasName]);

  const handleSaveBtnOnClick = (e) => {
    e.preventDefault();
    setData({ showingSaveDnsDialogue: true });
  };

  const handleDnsDialogueCancel = (e) => {
    e.preventDefault();
    setData({ showingSaveDnsDialogue: false });
  };

  const handleSaveDNSAlias = () => {
    setData({ showingSaveDnsDialogue: false });
    onSave({ id: alias.id, newAlias: inputAlias });
  };

  const handleDeleteBtnOnClick = () => {
    setData({ showingDeleteDnsDialogue: true });
  };

  const handleDeleteDnsDialogueCancel = () => {
    setData({ showingDeleteDnsDialogue: false });
  };

  const handleDeleteDNSAlias = () => {
    setData({ showingDeleteDnsDialogue: false });
    onDeleteClick();
  };

  const handleOnKeyDown = (e) => {
    if (isBtnDisabled) return;

    if (e.keyCode === 13 && inputAlias === originalAlias) {
      handleCancelBtnOnClick();
      if (inputRef) inputRef.current.text.blur();
      return;
    }

    if (e.keyCode === 13 && dnsAvailability) {
      // user Pressed Enter
      setData({ showingSaveDnsDialogue: true });
    }

    if (e.keyCode === 27) {
      // user Pressed ESC
      if (inputRef) inputRef.current.text.blur();
      handleCancelBtnOnClick();
    }
  };

  return (
    <div className={styles.listItem}>
      <Dialog
        isVisible={showingSaveDnsDialogue}
        title={strings.warning}
        message={strings.saveDnsWarningMessage}
        onCancel={handleDnsDialogueCancel}
        onConfirm={handleSaveDNSAlias}
      />
      <Dialog
        isVisible={showingDeleteDnsDialogue}
        onCancel={handleDeleteDnsDialogueCancel}
        onConfirm={handleDeleteDNSAlias}
        confirmText={strings.delete}
        title={<FormattedMessage
          id="remove-dns-alias-warning-title"
          defaultMessage="Are you sure you want to delete “{alias}”"
          values={{ alias: inputAlias }}
        />}
        message={strings.removeDNSAliasWarningMessage}
      />
      <h3 style={{ marginTop: '0.625rem', marginBottom: '0.5rem' }}>{strings.dnsAlias}</h3>
      <div className={styles.listItemBody}>
        <div className={styles.flexWrap}>
          <Text
            id={`dns-alias-${alias.id}`}
            ref={inputRef}
            onChange={handleOnInputChangeDebounce}
            onFocus={handleInputOnFocus}
            defaultValue={originalAlias}
            showWarning={!dnsAvailability}
            onKeyDown={handleOnKeyDown}
          />

          {!dnsAvailability && <span>{strings.dnsValidationFail}</span>}
        </div>

        {dnsAliasUrls.length > 0 && <ul className={styles.domainList}>
          {dnsAliasUrls.map(url => (<li key={url}>{`${inputAlias}${url.substr(url.indexOf('.'))}`}</li>))}
        </ul>}

        <div className={styles.buttonGroup}>
          <Btn
            inverted
            small
            borderless
            disabled={inputAlias === originalAlias || isBtnDisabled || inputAlias === ''}
            onClick={handleSaveBtnOnClick}
            style={{ padding: '0 0.9375rem' }}
          >
            {strings.save}
          </Btn>
          <Btn
            small
            borderless
            disabled={isBtnDisabled}
            onClick={isEditing && inputAlias !== originalAlias ? handleCancelBtnOnClick : handleDeleteBtnOnClick}
            style={{ padding: '0 0.9375rem', marginLeft: '0.625rem' }}
            alt={isEditing && inputAlias !== originalAlias}
            remove={!(isEditing && inputAlias !== originalAlias)}
          >
            {isEditing && inputAlias !== originalAlias ? strings.cancel : strings.delete}
          </Btn>
        </div>
      </div>
    </div>);
};

const CreateDNSAlias = ({
  strings,
  onSave,
  styles,
  onValidation,
  dnsAvailability,
  resetErrorMessage,
  setHasUnsavedDnsAlias,
  setDNSAliasSuccessed
}) => {
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleOnBlur = () => {
    if (inputValue === '') {
      setShowForm(false);
      resetErrorMessage('new');
      setHasUnsavedDnsAlias(false);
    }
  };

  const handleChange = (e) => {
    const { value } = e.currentTarget;
    if (value === '') {
      setHasUnsavedDnsAlias(false);
    } else {
      setHasUnsavedDnsAlias(true);
    }
    setInputValue(value);
    if (value === '') return;
    onValidation({ id: 'new', alias: value });
  };

  const handleChangeDebounce = _compose(
    _debounce(handleChange, 300),
    _clone
  );

  const handleSaveBtnOnClick = () => {
    onSave(inputValue);
  };

  const handleOnCancelClick = () => {
    setShowForm(false);
    setInputValue('');
    resetErrorMessage('new');
    setHasUnsavedDnsAlias(false);
  };

  const handleOnKeyDown = (e) => {
    if (dnsAvailability) {
      if (e.keyCode === 13 && inputValue === '') {
        // user Pressed Enter when input is empty
        setShowForm(false);
        setHasUnsavedDnsAlias(false);
        return;
      }

      if (e.keyCode === 13) {
        // user Pressed Enter
        handleSaveBtnOnClick();
      }
    }

    if (e.keyCode === 27) {
      // user Pressed ESC
      handleOnCancelClick();
    }
  };

  useEffect(() => {
    if (setDNSAliasSuccessed) {
      handleOnCancelClick();
    }
  }, [setDNSAliasSuccessed]);

  return !showForm ? (
    <div className={styles.listItem} onClick={() => setShowForm(true)}>
      <div className={styles.addNew}>
        <div
          data-id="dns-add"
          className={styles.add}
        />
        <span>
          {strings.addDnsAlias}
        </span>
      </div>
    </div>
  ) : (
    <div className={styles.listItem}>
      <h3 style={{ marginTop: '0.625rem', marginBottom: '0.5rem' }}>{strings.dnsAlias}</h3>
      <div className={styles.listItemBody}>
        <div className={styles.flexWrap}>
          <Text
            onChange={handleChangeDebounce}
            onBlur={handleOnBlur}
            showWarning={!dnsAvailability}
            onKeyDown={handleOnKeyDown}
            autoFocus
          />
          <div
            data-id="dns-warning"
            className={styles.dnsValidationWarning}
          />
          {!dnsAvailability && <span>{strings.dnsValidationFail}</span>}
        </div>
        <div className={styles.buttonGroup}>
          <Btn
            inverted
            small
            borderless
            disabled={!dnsAvailability || inputValue === ''}
            onClick={handleSaveBtnOnClick}
            style={{ padding: '0 0.9375rem' }}
          >
            {strings.save}
          </Btn>
          <Btn
            small
            borderless
            onClick={handleOnCancelClick}
            style={{ padding: '0 0.9375rem', marginLeft: '0.625rem' }}
            alt
          >
            {strings.cancel}
          </Btn>
        </div>
      </div>
    </div>
  );
};

const AdminSecurityDNSAlias = (props) => {
  if (props.type === 'EDIT') {
    return <EditDNSAlias {...props} />;
  }
  return <CreateDNSAlias {...props} />;
};

export default AdminSecurityDNSAlias;
