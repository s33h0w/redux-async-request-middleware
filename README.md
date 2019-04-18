# redux-async-middleware

## Usage

configureStore.js

```
import { createStore, applyMiddleware } from 'redux'
import { reduxAsyncMiddleware } from 'redux-async-middleware'

...

export default function configureStore() {
  const store = createStore(
    reducer,
    initalState,
    composeWithDevTools(applyMiddleware(reduxAsyncMiddleware))
  )
  return store
}
```

user.js

```
import { createRSAA } from 'redux-async-middleware'

const getUserAPI = (id) => get(`api/user/get?id=${id}`)

export getUser = createRSAA('getUser', getUserAPI)
```

Component.js

```
import React from 'react'
import { connect } from 'react-redux'
import { getUser } from './user.js'

class Component extends React.Component{
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
export default connect(null, mapDispatchToProps)(Component)
```
