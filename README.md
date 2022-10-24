# Quick API Client

[![npm version](https://img.shields.io/npm/v/quick-api-client)](https://www.npmjs.com/package/quick-api-client)
[![Downloads](https://img.shields.io/npm/dm/quick-api-client)](https://www.npmjs.com/package/quick-api-client)

Quick API Client is made to be a lightweight wrapper for using Rest API's without needing to write a whole API client. This client also supports pagination using query parameters so you do not need to handle that in your app.

## Installing

For the latest version:

```bash
npm install quick-api-client
```

```bash
yarn add quick-api-client
```

## Usage

```typescript
// Create a new client and add any auth headers required
const client = createQuickApiClient({
  baseUrl: 'https://example.com/api',
  headers: {
    Authorization: `Bearer abc123`,
  }
});

// you can then use the verb needed to make a request
// optionally supports type passing in TypeScript to declare the return type

// make a get request
const item = await client.get<Item>(
  {
    endpoint: 'item/100001',
    params: {active: 'true'}
  }
)

// make a put request
const updatedItem = await client.put<Item>(
  {
    endpoint: 'items/100001',
    body: JSON.stringify({description: 'Updated Item'})
  }
)

// make a delete request
await client.del(
  {endpoint: 'items/100001'}
)

// make a post request
const newItem = await client.post<Item>(
  {
    endpoint: 'items',
    body: JSON.stringify({description: 'New Item'})
  }
)
```

### Pagination

This client is able to handle pagination as long as the pagination occurs using query params.

You can specify pagination options when creating the client

```typescript
const client = createQuickApiClient({
  baseUrl: 'https://example.com/api',
  headers: {
    Authorization: `Bearer abc123`,
  },
  paginationOptions: {
    pageParam: 'page', // defaults to page if not specified
    resultKey: 'records' // optional key of the array of records so they can be extracted and passed directly
  }
});
```

Example usage

```typescript
// pagination is handled using a callback that returns each page
client.getPaginated<Item[]>(
  {endpoint: 'items', params: {active: 'true'}},
  (page, rawResponse) => {
    // the page is an array of Item records
    page.forEach(item => {
      console.log(`Item # ${item.id}`)
    })
  }
)
```

### Query params

You can specify query params at the client level that get passed to each request, and also per-request which will override the client level params if there is a conflict. The query params object can optionally include keys with `[]` in them containing an array of values to support API's that utilize the `key[]=` syntax with mutliple identical keys.

Example usage

```typescript
client.get(
  {
    endpoint: 'items',
    params: {
      active: true,
      'fields[]': ['description', 'cost', 'price']
    }
  }
)
// This will build the query string `items?active=true&fields[]=description&fields[]=cost&fields[]=price`

```
