# redux-async-request-middleware

Handling of asynchronous request in [Redux](https://redux.js.org/). You can create Redux Standard Async Action(RSAA) by `createRSAA` which will be catched by `redux-async-request-middleware` and then dispatches Flux Standard Action(FSA) after the asynchronous work done.

---

## Installation

```
npm install --save redux-async-request-middleware
```

or use `yarn`

```
yarn add redux-async-request-middleware
```

## Usage

**configureStore.js**

```
import { createStore, applyMiddleware } from 'redux'
import { reduxAsyncMiddleware } from 'redux-async-request-middleware'
import reducers from './reducers'

export default function configureStore(initialState) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(reduxAsyncMiddleware)
  )
  return store
}
```

**api/user.js**

```
import { createRSAA } from 'redux-async-request-middleware'

const getUserAPI = (id) => get(`api/user/get?id=${id}`)

export const getUser = createRSAA('@@user/getUser', getUserAPI)
```

**UserComponent.js**

```
import React from 'react'
import { connect } from 'react-redux'
import { getUser } from './user.js'

class UserComponent extends React.Component{
  state = {
    user: null,
  }
  componentDidMount() {
    const { getUser } = this.props
    const onSuccess = (res) => {
      this.setState({
        user: res.data,
      })
    }
    const onFailure = (err) => {
      console.log(err.message)
    }
    getUser(123)(onSuccess, onFailure)
    // if you dont need callback for `getUser`, use like this:
    // getUser(123)
  }
  render() {
    const { user } = this.state
    return (
      <div>{user}</div>
    )
  }
}

const mapDispatchToProps = {
  getUser: getUser
}

export default connect(null, mapDispatchToProps)(UserComponent)
```

## Test

TODO

## API

### `createRSAA`

The `createRSAA` generates RSAA.

- Methods

  - `createRSAA(type, asyncFunction)(...asyncFunctionArguments)`
  - `createRSAA(type, asyncFunction)(...asyncFunctionArguments)(onResolved, onRejected)`

- Parameters

  - `type(String)`: defines the unique type of the related async actions. e.g.: `type_PENDING`, `type_RESOLVED`, `type_REJECTED`
  - `asyncFunction(Function)`: function which returns Promise
  - `...asyncFunctionArguments(arguments)`: arguments will call by `asyncFunction`
  - `onResolved(Function?: (response, { getState }) => {})`: function which will be called when resolved
  - `onRejected(Function?: : (error, { getState }) => {})`: function which will be called when rejected

`onResolved` and `onRejected` receives `response`(or`error`) and Redux Store's `getState` as arguments. They are usually used as callback function of the asynchronous work.

### `reduxAsyncMiddelware`

Redux middleware

### `getMiddleActionTypes(type)`

You can get each action type by `getMiddleActionTypes` with the paramter `type` which same passed to `createdRSAA`. This will be useful if you want to reduce the actions created by RSAA in redux reducers.

e.g.

```
const [
    pendingType,  // pending action's type
    resolvedType, // resolved action's type
    rejectedType, // rejected action's type
  ] = getMiddleActionTypes(type)
```

## License

MIT
