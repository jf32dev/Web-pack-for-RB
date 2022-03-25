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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Yi Zhang <yi.zhang@bigtincan.com>
 */

import ApiClient from 'helpers/ApiClient';

const createError = (errorMessage) => new Error(JSON.stringify(errorMessage));

const tryParseJson = (data) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
};

const getFileShareStatus = (typeCode, typeSavedInServer, shareStatus) => {
  switch (typeCode) {
    case 0:
      return 'blocked';
    case 1:
      return 'optional';
    case 2:
      return 'mandatory';
    default:
      // if there is no file type return from server and no sharingType provided in JSB params either, use default settings
      return typeSavedInServer || shareStatus;
  }
};

const getFileObject = (tempURL) => {
  const fileName = tempURL.split(',')[0].split(':')[1];
  const blobURL = tempURL.split(',')[1];

  return new Promise((resolveFile, rejectFile) => {
    const xhr = new XMLHttpRequest();

    xhr.responseType = 'blob';
    xhr.open('GET', blobURL, true);
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState === 4) {
        resolveFile({
          fileName,
          fileExt: e.target.response.type.split('/')[1],
          blob: e.target.response
        });
      }
    };
    xhr.onerror = () => rejectFile(xhr.statusText);
    xhr.send();
  });
};

const getTags = async (tagsNeedToAdd) => {
  const client = new ApiClient();
  const tags = [];
  let paramFileTags = tagsNeedToAdd;

  const searchTagRequests = [];

  for (const paramTag of tagsNeedToAdd) {
    // search existing tags
    searchTagRequests.push(client.get(`/tags/search?q=${paramTag}`));
  }

  const searchTagResponses = await Promise.all(searchTagRequests);

  searchTagResponses.forEach(async (searchTagResponse) => {
    if (searchTagResponse.body.length > 0 && searchTagResponse.body.findIndex(resTag => paramFileTags.includes(resTag.name)) !== -1) {
      // tag is found in DB
      const { id, name } = searchTagResponse.body.find(resTag => paramFileTags.includes(resTag.name));
      paramFileTags = paramFileTags.filter(tagName => tagName !== name);
      tags.push({ id, name });
    }
  });

  if (paramFileTags.length > 0) {
    const createNewTagRequests = paramFileTags.map((paramTag) => client.post('/tags', 'webapi', { body: { name: paramTag } }));

    const createNewTagResponses = await Promise.all(createNewTagRequests);

    createNewTagResponses.forEach(createTagResponse => {
      const { id, name } = createTagResponse.body;
      tags.push({ id, name });
    });
  }

  return tags;
};

const generateFile = (paramFile, storyId, fileDefaults, storyDetail) => {
  return new Promise(async (resolve, reject) => {
    const client = new ApiClient();
    try {
      // attach local file
      if (paramFile.tempURL) {
        let fileObject = null;
        try {
          fileObject = await getFileObject(paramFile.tempURL);
        } catch (err) {
          throw createError({ code: 102, message: `Invalid Parameter: tempURL ${paramFile.tempURL}` });
        }

        const { fileExt } = fileObject;
        // eslint-disable-next-line no-param-reassign
        fileObject.blob.filename = `${fileObject.fileName}.${fileExt === 'plain' ? 'txt' : fileExt}`;
        // eslint-disable-next-line no-param-reassign
        fileObject.blob.description = `${fileObject.fileName}.${fileExt === 'plain' ? 'txt' : fileExt}`;

        const uploadFileResponse = await client.post('/story/uploadFile', 'webapi', {
          params: {  // should be named data
            upload_type: 'file',
            uploadData: {
              file: [fileObject.blob]
            }
          }
        });

        // file with tags
        let tags = [];

        try {
          if (paramFile.tags) tags = await getTags(paramFile.tags);
        } catch (error) {
          throw error;
        }

        resolve({
          ...uploadFileResponse.body[0],
          ...paramFile,
          tags: paramFile.tags ? tags : uploadFileResponse.body[0].tags,
          shareStatus: getFileShareStatus(paramFile.sharingType, uploadFileResponse.body[0].shareStatus, fileDefaults.shareStatus),
          hasWatermark: fileDefaults.hasWatermark || false,
          convertSettings: fileDefaults.convertSettings
        });
      }

      // attach hub file
      if (paramFile.sourceFileId || paramFile.id) {
        const fileId = paramFile.id || paramFile.sourceFileId;

        // this message will be sent to client, if source file could be loaded.
        const errMsg = { code: 102, message: `Invalid ${paramFile.sourceFileId ? 'sourceFileId' : 'File Id'}: ${fileId}` };

        // 1. get file detail
        let fileDetail = null;

        if (paramFile.id && storyDetail) {
          const storyExistingFiles = storyDetail.files;
          fileDetail = storyExistingFiles.find(exF => exF.id === fileId);

          if (!fileDetail) throw createError(errMsg);
        }

        try {
          if (!fileDetail) {
            const getfileDetailResponse = await client.get(`/file/get?id=${fileId}&include_story=1`);
            fileDetail = getfileDetailResponse.body;
          }
        } catch (error) {
          throw createError(errMsg);
        }

        // validation - the file with sourceFileId cannot be from same story
        if (paramFile.sourceFileId && storyId && fileDetail.story.id === storyId) {
          throw createError({ code: 102, message: `sourceFileId (${paramFile.sourceFileId}) cannot be added since it is from the same story` });
        }
        // validation - source file cannot have sharingType blocked which is 0
        if (paramFile.sourceFileId && fileDetail.shareStatus === 'blocked') {
          throw createError({ code: 102, message: `sourceFileId (${paramFile.sourceFileId}) cannot be added since it has shareStatus of blocked` });
        }

        // final tags result container
        let tags = [];

        if (paramFile.tags) {
          // save existing tags to tags result container
          tags = fileDetail.tags.filter(t => paramFile.tags.includes(t.name));

          // compare with JSB file tags and file tags in DB, found tags need to add
          const tagsNeedToAdd = paramFile.tags.filter(t => fileDetail.tags.findIndex(ft => ft.name === t) === -1);

          const newTags = await getTags(tagsNeedToAdd);
          tags = [...tags, ...newTags];
        }

        // 2. merge API response data with JSB params values
        resolve({
          ...fileDetail,
          ...paramFile,
          tags: paramFile.tags ? tags : fileDetail.tags,
          // For modifying an existing file (file id is specified in id attribute), if the sharingType is not specified then it should use the previous value
          // For a new file object, if value is not specified, then it should use the story/file defaults for sharing type
          shareStatus: getFileShareStatus(paramFile.sharingType, paramFile.id ? fileDetail.shareStatus : null, fileDefaults.shareStatus)
        });
      }
    } catch (error) {
      reject(tryParseJson(error.message));
    }
  });
};

const generateFiles = (paramFiles, storyId, fileDefaults, storyDetail) => {
  const promiseArray = [];

  for (const paramFile of paramFiles) {
    promiseArray.push(generateFile(paramFile, storyId, fileDefaults, storyDetail));
  }

  return Promise.all(promiseArray);
};

export default generateFiles;
