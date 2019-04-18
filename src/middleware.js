// @flow
import { isRSAA, type RSAA_TYPE } from './RSAA'

import {
  createPendingAction,
  createResolvedAction,
  createRejectedAction,
} from './actions'

function reduxAsyncMiddleware({
  dispatch,
  getState,
}: {
  dispatch: Function,
  getState: Function,
}) {
  return (next: Function) => (action: RSAA_TYPE) => {
    // 判断是否为RSAA类型的action
    if (!isRSAA(action)) {
      return next(action)
    }
    return () => {
      // TODO 无效的RSAA处理
      // TODO 防抖
      // Promise pending
      const pendingAction = createPendingAction(action)
      next(pendingAction)
      return (
        pendingAction.payload
          .then(
            // Promise resolved
            response => {
              const resolvedAction = createResolvedAction(action, response)
              return next(resolvedAction)
            },
            // Promise rejected
            error => {
              const rejectedAction = createRejectedAction(action, error)
              return next(rejectedAction)
            }
          )
          //  error
          .catch(error => {
            const rejectedAction = createRejectedAction(action, error)
            return next(rejectedAction)
          })
      )
    }
  }
}

export default reduxAsyncMiddleware
