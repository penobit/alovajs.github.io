---
title: Send request
sidebar_position: 30
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Next, let's take a look at how to actually send the request. In `alova`, there are three use hooks `useRequest`, `useWatcher`, and `useFetcher` to implement the timing of the request. They control when the request should be sent, and at the same time It will create and maintain stateful request-related data for us, such as `loading`, `data`, `error`, etc. There is no need to maintain these states independently. Let's understand them below.

This time we first understand the first use hook, **useRequest**, which means sending a request. When `useRequest` is executed, a request will be sent by default. It is the most commonly used method when obtaining initial data on the page, and it also supports Turn off its default request sending, which is very useful in request scenarios triggered by click events such as submitting data.

## Initial data request

Let's get the page data for the todo list.

<Tabs groupId="framework">
<TabItem value="1" label="vue">

```html
<template>
  <!-- You can directly use data to render the todo list -->
  <div v-if="loading">Loading...</div>
  <div
    v-else-if="error"
    class="error">
    {{ error. message }}
  </div>
  <template v-else>
    <div v-for="todo in data">
      <div class="todo-title">{{ todo.title }}</div>
      <div class="todo-time">{{ todo.time }}</div>
    </div>
  </template>
</template>

<script setup>
  const {
    // loading is the loading status value, when it is loaded, its value is true, and it is automatically updated to false after the end
    // It is a value of type Ref, you can access it through loading.value, or directly bind to the interface
    loading,

    // Response data, also Ref value
    data,

    // request error object, Ref value, there is a value when the request is wrong, otherwise it is undefined
    error

    // Directly pass in the Method instance to send the request
  } = useRequest(todoListGetter, {
    // Before the request responds, the initial value of data
    initialData: []
  });
</script>
```

</TabItem>
<TabItem value="2" label="react">

```jsx
const App = () => {
  const {
    // loading is the loading status value, when it is loaded, its value is true, and it is automatically updated to false after the end
    // Its value is an ordinary boolean value, and the set function will be automatically called internally to update its value when the request state changes
    loading,

    // response data
    data,

    // request error object, there is a value when the request is wrong, otherwise it is undefined
    error

    // Directly pass in the Method instance to send the request
  } = useRequest(todoListGetter, {
    // Before the request responds, the initial value of data
    initialData: []
  });

  // You can directly use todoList to render the todo list
  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div class="error">{error.message}</div>;
  } else {
    return (
      <>
        <div v-for="todo in data">
          <div class="todo-title">{todo.title}</div>
          <div class="todo-time">{todo.time}</div>
        </div>
      </>
    );
  }
};
```

</TabItem>
<TabItem value="3" label="svelte">

```html
<script>
  const {
    // loading is the loading status value, when it is loaded, its value is true, and it is automatically updated to false after the end
    // It is a value of Writable type, it will be maintained internally
    loading,

    // response data
    data,

    // request error object, there is a value when the request is wrong, otherwise it is undefined
    error

    // Directly pass in the Method instance to send the request
  } = useRequest(todoListGetter, {
    // Before the request responds, the initial value of data
    initialData: []
  });
</script>

<!-- You can directly use todoList to render the todo list -->
{#if $loading}
<div>Loading...</div>
{:else if $error}
<div class="error">{ $error. message }</div>
{:else} {#each $data as todo}
<div>
  <div class="todo-title">{ todo. title }</div>
  <div class="todo-time">{ todo.time }</div>
</div>
{/each} {/if}
```

</TabItem>
</Tabs>

## Binding request callback

To set the request callback, you can also receive the callback setting function in the return parameter of useRequest, as follows:

```javascript
const {
  //...

  // successful callback binding
  onSuccess,

  // failure callback binding
  onError,

  // Complete the callback binding, the callback will be called on success or failure
  onComplete
} = useRequest(todoListGetter);
onSuccess(event => {
  console.log('The request is successful, the response data is:', event.data);
  console.log('The method instance of this request is:', event.method);
  console.log('is the response data from cache:', event.fromCache);
});
onError(event => {
  console.log('The request failed, the error message is:', event.error);
  console.log('The method instance of this request is:', event.method);
});
onComplete(event => {
  // event.status is success on success, error on failure
  console.log('The request is completed, the status is:', event.status);
  console.log('The method instance of this request is:', event.method);
  console.log('is the response data from cache:', event.fromCache);
  if (event.data) {
    console.log('request data:', event.data);
  } else if (event.error) {
    console.log('Error message:', event.error);
  }
});
```

## Manually send the request

When you need to create a new todo item, you can turn off the default sending request first, switch to manually triggering the request, and receive the `send` function in useRequest to manually send the request, and the `send` function will return a Promise with response data Instance, it will change to resolve state after request response.

```javascript
const {
  //...
  // Function for manual sender request, call to send request
  send: addTodo
} = useRequest(newTodo => alovaInstance.Post('/todo', newTodo), {
  // When immediate is false, it is not emitted by default
  immediate: false
});

// Manually send the request
const handleAddTodo = () => {
  const newTodo = {
    title: 'New todo item',
    time: new Date().toLocaleString()
  };
  // The send function returns a Promise object that can receive the response data
  addTodo(newTodo)
    .then(result => {
      console.log('The new todo item is successfully added, and the response data is:', result);
    })
    .catch(error => {
      console.log('Failed to add todo item, the error message is:', error);
    });
};
```

## Force send request

Caching data can improve application fluency and reduce server pressure, but there is also the problem of data expiration. When you want to penetrate the cache to obtain the latest data, you can set the `force` property in the configuration of use hooks. help you.

### Set static value

force is false by default. When set to true, the cache will be penetrated every time and a request will be sent

```javascript
useRequest(alovaInstance.Get('/todo'), {
  force: true
});
```

### Dynamically set the force value

In actual situations, we often need to set whether to force the request to be sent according to different situations. At this time, force can be set as a function, which can be passed in through the send function.

```javascript
const { send } = useRequest(alovaInstance.Get('/todo'), {
  force: id => {
    return !!id;
  }
});
send(1);
```

## Send function parameter passing rules

In the above example, the send function is called to manually trigger the request, which can accept any number of parameters, which will be received by the following 4 functions:

### Receive in the useRequest callback function

It can be received when the first parameter of useRequest is set as a callback function, which is usually useful when deleting list items, as follows:

```javascript
const { send } = useRequest(id => removeTodoPoster(id));
send(1); // id in the above callback function will receive 1
```

### Received in onSuccess, onError, onComplete callback functions

`event.sendArgs` in onSuccess, onError, and onComplete callback functions are received in the form of an array

```javascript
const { send, onSuccess, onError, onComplete } = useRequest(newTodo => alovaInstance.Post('/todo', newTodo));
onSuccess(event => {
  // The value of sendArgs is [1]
  console.log(event.sendArgs);
});
onError(event => {
  // The value of sendArgs is [1]
  console.log(event.sendArgs);
});
onComplete(event => {
  // The value of sendArgs is [1]
  console.log(event.sendArgs);
});

// send request
send(1);
```

### Received in the force function

```javascript
const { send } = useRequest(alovaInstance.Get('/todo'), {
  force: id => {
    return !!id;
  }
});
send(1);
```

## Set initial response data

Before a page obtains the initial data, it inevitably needs to wait for the response from the server. Before the response, it is generally necessary to initialize the state to an empty array or an empty object, so as not to cause an error on the page. We can use the second in `useRequest` parameter to set the initial data.

```javascript
// Set initial data in useRequest
const {
  // The initial value of data before the response is [], not undefined
  // highlight-start
  data
} = useRequest(todoListGetter, {
  initialData: []
});
// highlight-end
```

## Manually modify the status value

In alova, various states such as `data`, `loading`, and `error` returned by `useRequest` allow custom modification, which will become very convenient in some cases.

<Tabs groupId="framework">
<TabItem value="1" label="vue">

```javascript
const { data, loading, error } = useRequest(todoListGetter);

//...
// Modify the data value directly
data.value = {};
```

</TabItem>

<TabItem value="2" label="react">

In react, the returned state is data that can be used directly, so it needs to be modified by the `update` function.

```javascript
const { data, loading, error, update } = useRequest(todoListGetter);

//...
// Modify the data value through update
update({
  data: {}
});
```

</TabItem>

<TabItem value="3" label="svelte">

In svelte, the status returned by `useRequest` is of type `writable`.

```javascript
const { data, loading, error } = useRequest(todoListGetter);

//...
// Modify the data value directly
$data = {};
// or data.update(d => ({}));
```

</TabItem>
</Tabs>

:::caution Notes

1. The custom modified value will be overwritten by the internal state management mechanism of `useRequest`, for example, when you modify the `data` value, the `data` value will be assigned the latest response data after requesting again;
2. The state value modified directly will not modify the cached data synchronously. If you need to modify the cached data synchronously, it is recommended to use [updateState](/learning/update-response-data-across-modules)

:::

## Manual interrupt request

When the `timeout` parameter is not set, the request will never time out. If you need to manually interrupt the request, you can receive the `abort` method when the `useRequest` function is called.

```javascript
const {
  //...
  // highlight-start
  // abort function is used to interrupt request
  abort
  // highlight-end
} = useRequest(todoListGetter);

// highlight-start
// Call abort to interrupt the request
const handleCancel = () => {
  abort();
};
// highlight-end
```
