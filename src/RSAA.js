// @flow
const RSAA = '@@redux-async-middleware/REDUX_STANDARD_ASYNC_ACTION'

// Redux Standard Async Action
export type RSAA_TYPE = {
  type: typeof RSAA,
  payload: {
    type: string,
    promise: Promise<any>,
  },
  meta?: {
    onResolved?: (response: any, store?: { getState: Function }) => void,
    onRejected?: (error: Error, store?: { getState: Function }) => void,
  },
}

export const isRSAA = (action: RSAA_TYPE) => {
  return action.type === RSAA
}

const createRSAA = (type: string, asyncFunction: () => Promise<any>) => (
  ...args: any
) => {
  if (typeof createRSAA(type, asyncFunction)(...args) === 'function') {
    return function(onResolved: Function, onRejected: Function): RSAA_TYPE {
      return {
        type: RSAA,
        payload: {
          type,
          promise: asyncFunction(...args),
        },
        meta: {
          onResolved: onResolved,
          onRejected: onRejected,
        },
      }
    }
  }
  return {
    type: RSAA,
    payload: {
      type,
      promise: asyncFunction(...args),
    },
  }
}
export default createRSAA
