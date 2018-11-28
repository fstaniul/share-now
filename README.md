# share-now

> Cross platform app that makes sharing files on local network fast and easy.

#### RoadMap

- [ ] Add checking if clients are still online
- [ ] Add removing of old files with client
- [ ] Create UI
  - [x] Create first launch pages (shown when user starts the app for the first time)
  - [x] Main dashboard
    - [x] Add profiles of online users to main dashboard
    - [x] For each user add a profile page showing every file shared with this user, file states:
       - [x] In Progress
       - [x] Requested (with accept and reject actions)
       - [x] Completed
    - [ ] Add tasks bar to the main bashboard showing all files currently being shared
    - [x] Add loader shown when app is looking for currently online clients.
  - [x] Settings
    - [x] Changing of name and image.
    - [ ] Changing of default apps port used for communications.
  - [ ] Notifications
- [x] Create sharing module
  - [x] Define messaging protocol or use existing one (HTTPS)
  - [x] Add encryption for security
- [-] Add persistance of certain data stored in store. This one must be settings and first run also.
  - [ ] Add way to erase the data.
  - [ ] Store data in appData.
- [ ] Create auto-updating/updating module



#### Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test

# lint all JS/Vue component files in `src/`
npm run lint
```
