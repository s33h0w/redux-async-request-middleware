// @flow
const RSAA = '@@redux-async-middleware/REDUX_STANDARD_ASYNC_ACTION'

// Redux Standard Async Action
export type RSAA_TYPE = {
  type: typeof RSAA,
  payload: {
    type: string,
    promise: Promise<any>,
  },
}

export const isRSAA = (action: RSAA_TYPE) => {
  return action.type === RSAA
}

const createRSAA = (type: string, asyncFunction: () => Promise<any>) => (
  ...args: any
) => {
  return {
    type: RSAA,
    payload: {
      type,
      promise: asyncFunction(...args),
    },
  }
}
export default createRSAA
