# ROUTES

Public routes are defined in `index.js` and private are defined in `Auth.js`.

## Private Routes

### Company
- /
- /web
- /people
  - /people/all
  - /people/:id
  - /people/:id/published
  - /people/:id/following
  - /people/:id/following

### Content
- /content
  - /content/tab/:tabId
  - /content/tab/:tabId/channel/:channelId
  - /content/personal/files
  - /content/personal/channel/:channelId

### Chat
- /chat
  - /chat/:recipientId

### Activity
- /activity

### Me
- /me
  - /bookmarks
  - /comments
  - /drafts
  - /liked
  - /notes
    - /note/new
    - /note/:noteId/edit
  - /published
  - /profile
  - /recent/files
  - /recent/stories
  - /shares
  - /settings
    - /settings/general
    - /settings/interest-areas
    - /settings/notifications
    - /settings/subscriptions
      - /settings/subscriptions/stories
    - /settings/support
    - /settings/legal

### Forms
- /forms

### Archive
- /archive
  - /archive/tab/:tabId
  - /archive/tab/:tabId/channel/:channelId
  - /archive/tab/:tabId/channel/:channelId/story/:storyId

### Reports
- /reports

### Admin
- /admin

### Story
- /story/new
- /story/edit/:storyId
- /story/:storyId
- /story/:storyId/share
- /story/:storyId?meeting=:meetingId
- /story/:storyId/?rev=:revId
- /story/:storyId/?rev=:revId&meeting=:meetingId

### Search
- /search

### Share
- /share/new

### File
- /file/p/:fileId
- /file/:fileId

## Public Routes

### Broadcast
- /pshare/:publicBroadcastId

### Files
- /pfiles/:publicFilesId

### PAFS
- /pafs/:publicFilesId
