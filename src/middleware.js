// @flow
import RSAA from './RSAA'

type FSA_Action = {
  type: string,
  payload: any,
  meta?: any,
  error?: boolean,
}

type RSAA_Action = {
  type: RSAA,
  payload: {
    type: string,
    promise: Promise<any>,
  },
  meta?: {
    onResolved: Function,
    onRejected: Function,
  },
}

type Request_FSA = {
  type: string,
  payload: Promise<any>,
}

type Success_FSA = {
  type: string,
  payload: any,
  meta?: Function,
}

type Failure_FSA = {
  type: string,
  payload: Error,
  meta?: Function,
  error: true,
}

function isRSAA(action) {
  return action.type === RSAA
}

const createRSAA = (type: string, asyncFunction: () => Promise<any>) => (
  ...args: any
) => (onResolved: Function, onRejected: Function): RSAA_Action => {
  return {
    type: RSAA,
    payload: {
      type,
      promise: asyncFunction(...args),
    },
    meta: {
      onResolved,
      onRejected,
    },
  }
}

// 生成RSAA对应的FSA(R)
function createRequestAction(action: RSAA_Action): Request_FSA {
  const { type, promise } = action.payload
  return {
    type: type + '_REQUEST',
    payload: promise,
  }
}

// 生成RSAA对应的FSA(S)
function createSuccessAction(action: RSAA_Action, response): Success_FSA {
  const { type } = action.payload
  return {
    type: type + '_SUCCESS',
    payload: response,
    meta: action.meta && action.meta.onResolved,
  }
}

// 生成RSAA对应的FSA(F)
function createFailureAction(action: RSAA_Action, error): Failure_FSA {
  const { type } = action.payload
  return {
    type: type + '_FAILURE',
    payload: error,
    meta: action.meta && action.meta.onRejected,
    error: true,
  }
}

function reduxAsyncMiddleware({
  dispatch,
  getState,
}: {
  dispatch: Function,
  getState: Function,
}) {
  return (next: Function) => (action: FSA_Action) => {
    // 判断是否为RSAA类型的action
    if (!isRSAA(action)) {
      return next(action)
    }
    return () => {
      // TODO 无效的RSAA处理
      // TODO 防抖
      // 生成 FSA(R)，dispatch 该 FSA(R)
      const requestAction = createRequestAction(action)
      next(requestAction)
      return (
        requestAction.payload
          .then(
            // Promise resolved 生成 FSA(S), dispatch
            response => {
              const successAction = createSuccessAction(action, response)
              return next(successAction)
            },
            // Promise rejected 生成 FSA(F), dispatch
            error => {
              const failureAction = createFailureAction(action, error)
              return next(failureAction)
            }
          )
          // Error 生成 FSA(F), dispatch
          .catch(error => {
            const failureAction = createFailureAction(action, error)
            return next(failureAction)
          })
      )
    }
  }
}

export default reduxAsyncMiddleware
