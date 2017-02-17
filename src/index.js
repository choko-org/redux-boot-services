import { BOOT } from 'redux-boot'
import createContainer from 'cartola'

export const CONTAINER_INIT = 'redux-boot/services/CONTAINER_INIT'

const servicesModule = {
  middleware: ({ getState, dispatch }) => {
    const container = createContainer()

    return next => async action => {
      if (action.type === BOOT) {
        dispatch({
          type: CONTAINER_INIT,
          payload: { container }
        })
      }

      if (typeof action === 'function') {
        const { getService } = container
        const servicesApi = {
          dispatch,
          getState,
          getService,
        }

        return next(await action(servicesApi))
      }

      return next(action)
    }
  }
}

export default servicesModule
