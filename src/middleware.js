// @flow
import { isRSAA, type RSAA_TYPE } from './RSAA'

import {
  createPendingAction,
  createResolvedAction,
  createRejectedAction,
} from './actions'

function reduxAsyncMiddleware({ getState }: { getState: Function }) {
  return (next: Function) => (action: RSAA_TYPE) => {
    // 判断是否为RSAA类型的action
    if (!isRSAA(action)) {
      return next(action)
    }
    // Promise resolved
    const handleResolve = response => {
      const resolvedAction = createResolvedAction(action, response)
      const onResolved = action.meta && action.meta.onResolved
      if (onResolved && typeof onResolved === 'function') {
        onResolved(response, { getState })
      }
      return next(resolvedAction)
    }
    // Promise rejected
    const handleReject = error => {
      const rejectedAction = createRejectedAction(action, error)
      const onRejected = action.meta && action.meta.onRejected
      if (onRejected && typeof onRejected === 'function') {
        onRejected(error, { getState })
      }
      return next(rejectedAction)
    }

    return () => {
      // TODO 无效的RSAA处理
      // TODO 防抖
      // Promise pending
      const pendingAction = createPendingAction(action)
      next(pendingAction)
      return pendingAction.payload
        .then(handleResolve, handleReject)
        .catch(handleReject)
    }
  }
}

export default reduxAsyncMiddleware
