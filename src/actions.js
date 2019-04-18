// @flow
import { createAction } from 'redux-actions'
import { type RSAA_TYPE } from './RSAA'

const PENDING_SUFFIX = '_PENDING'
const RESOLVED_SUFFIX = '_RESOLVED'
const REJECTED_SUFFIX = '_REJECTED'

const getActionTypeWithSuffix = (
  action: RSAA_TYPE,
  suffix:
    | typeof PENDING_SUFFIX
    | typeof RESOLVED_SUFFIX
    | typeof REJECTED_SUFFIX
) => action.payload.type + suffix

// Pending Action
type PENDING_ACTION_TYPE = {
  type: string,
  payload: Promise<any>,
}

// 生成RSAA对应的Pending Action
export function createPendingAction(action: RSAA_TYPE): PENDING_ACTION_TYPE {
  const type = getActionTypeWithSuffix(action, PENDING_SUFFIX)
  const executor = createAction(type)
  return executor(action.payload.promise)
}

// Resolved Action
type RESOLVED_ACTION_TYPE = {
  type: string,
  payload: any,
  meta?: Function,
}

// 生成RSAA对应的Resolved Action
export function createResolvedAction(
  action: RSAA_TYPE,
  response: any
): RESOLVED_ACTION_TYPE {
  const type = getActionTypeWithSuffix(action, RESOLVED_SUFFIX)
  const resolve = createAction(
    type + RESOLVED_SUFFIX,
    res => res,
    () => action.meta && action.meta.onResolved
  )
  return resolve(response)
}

// Rejected Action
type REJECTED_ACTION_TYPE = {
  type: string,
  payload: Error,
  meta?: Function,
  error: true,
}

// 生成RSAA对应的Rejected Action
export function createRejectedAction(
  action: RSAA_TYPE,
  error: Error
): REJECTED_ACTION_TYPE {
  const type = getActionTypeWithSuffix(action, REJECTED_SUFFIX)
  const reject = createAction(
    type + REJECTED_SUFFIX,
    err => err,
    () => action.meta && action.meta.onRejected
  )
  return reject(error)
}
