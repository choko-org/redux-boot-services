import test from 'tape'
import boot from 'redux-boot'
import servicesModule, { CONTAINER_INIT } from '../index'

test('Define a Service creator.', assert => {
  assert.plan(2)

  const mockServiceCreator = ({ host, key }) => {
    assert.pass('Service creator has been called once.')

    return { host, key, initiated: true }
  }

  const mockCustomModule = {
    middleware: {
      [CONTAINER_INIT]: store => next => action => {
        const { container } = action.payload

        container.defineService(mockServiceCreator, {
          host: 'localhost'
        })

        return next(action)
      }
    }
  }

  const modules = [servicesModule, mockCustomModule]
  const app = boot({}, modules)

  const mockAction = ({ getService }) => {
    const service = getService(mockServiceCreator)

    assert.isEqual(service.host, 'localhost')

    return { type: 'MOCK_ACTION', payload: {} }
  }

  app.then(({ store }) => {
    store.dispatch(mockAction)
    assert.end()
  })
})
