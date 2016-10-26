# Redux Boot Services
Dependency injection of statefull Services for [Redux Boot](https://github.com/choko-org/redux-boot),
using the [Cartola](https://github.com/choko-org/cartola) dependency container.

## Example:
**API's Service Creator**
```js
// @file: /modules/api/serviceCreators.js

import superagentUse from 'superagent-use'
import superagent from 'superagent'

// Universal CMS API Service.
export const cmsApi = ({ host, key }) => {
  const request = superagentUse(superagent)

  request.use(req => {
    // Prefix the host in the url.
    req.url = host + '/' + req.url

    // Presets the Authorization Barer for all requests.
    req.set('Authorization', 'Barer ' + key)
    return req
  })

  return request
}
```
**API Module**
```js
// @file: /modules/api/index.js

import { CONTAINER_INIT } from 'redux-boot-services'
import { cmsApi } from './serviceCreators'

export default {
  middleware: {
    [CONTAINER_INIT]: store => next => action => {

      // Define the Service.

      const { container } = action.payload

      container.defineService(cmsApi, {
        host: 'https://localhost',
        key: '3asd765a7sd5'
      })

      return next(action)
    }
  }
}

// Fetch User action.
const FETCH_USER = 'redux-boot/api/user/FETCH'
const FETCH_USER_SUCCESS = 'redux-boot/api/user/FETCH_SUCCESS'
const FETCH_USER_FAILED = 'redux-boot/api/user/FETCH_FAILED'

export const fetchUserAction = userId => async ({ dispatch, getService }) => {
  dispatch({ type: FETCH_USER, payload: { userId } })

  try {
    // Here's the magic.
    const client = getService(cmsApi)

    const { body: user } = await client.get('users/' + userId)

    return {
      type: FETCH_USER_SUCCESS,
      payload: { user },
    }
  }
  catch (error) {
    dispatch({ type: FETCH_USER_FAILED, payload: { error } })
  }
}
```
**Boot the App**
```js
// @file: /index.js

import boot from 'redux-boot'
import servicesModule from 'redux-boot-services'

import apiModule, { fetchUserAction } from './modules/api'

const modules = [servicesModule, apiModule]

const app = boot({}, modules)

app.then(({ store }) => {
  const userId = 42
  store.dispatch(fetchUserAction(userId))
})
```
