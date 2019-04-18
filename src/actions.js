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
) => action.payload.type.toUpperCase() + suffix

const getActionTypeByRSAA = (action: RSAA_TYPE): Array<string> =>
  [PENDING_SUFFIX, RESOLVED_SUFFIX, REJECTED_SUFFIX].map(suffix =>
    getActionTypeWithSuffix(action, suffix)
  )

// Pending Action
type PENDING_ACTION_TYPE = {
  type: string,
  payload: Promise<any>,
}

// 生成RSAA对应的Pending Action
export function createPendingAction(action: RSAA_TYPE): PENDING_ACTION_TYPE {
  const type = getActionTypeByRSAA[0]
  const executor = createAction(type)
  return executor(action.payload.promise)
}

// Resolved Action
type RESOLVED_ACTION_TYPE = {
  type: string,
  payload: any,
}

// 生成RSAA对应的Resolved Action
export function createResolvedAction(
  action: RSAA_TYPE,
  response: any
): RESOLVED_ACTION_TYPE {
  const type = getActionTypeByRSAA[1]
  const resolve = createAction(type)
  return resolve(response)
}

// Rejected Action
type REJECTED_ACTION_TYPE = {
  type: string,
  payload: Error,
  error: true,
}

// 生成RSAA对应的Rejected Action
export function createRejectedAction(
  action: RSAA_TYPE,
  error: Error
): REJECTED_ACTION_TYPE {
  const type = getActionTypeByRSAA[2]
  const reject = createAction(type)
  return reject(error)
}

export default getActionTypeByRSAA
