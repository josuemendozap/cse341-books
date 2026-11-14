# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal
Create an authors API that allows clients to create, read, update, and delete author records. Each author will have a custom string ID, a name, and a birth year. The API must also maintain the relationship between authors and books.

### Data Model
Author documents will be stored in the authors collection.

Required author fields:

- `id`: string, required, custom id such as `a1`

- `name`: string, required

- `birthYear`: number, required

Authors will use custom string IDs instead of MongoDB `_id` values for route parameters.

### Relationship to Books
Each book references an author through its `authorId` field.

The `authorId` value in a book must match the custom `id` of an existing author document.

When deleting an author, the API must check whether any books reference that author.

If the author still has books associated with them, the API must reject the deletion with a `409` status code. The client must first update those books to reference another author or delete the associated books.

### Routes

#### GET /authors

purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of authors objects

Example response:
[
  {
    "id": "a1",
    "name": "John Smith",
    "birthYear": 1980
  },
  {
    "id": "a2",
    "name": "Mary Johnson",
    "birthYear": 1990
  }
]

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id

Purpose: Return one author by their custom id.

Seccess:
- Status Code: `200`
- Response body: the matching author object

Example response:
{
  "id": "a1",
  "name": "John Smith",
  "birthYear": 1980
}

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors

Purpose: Create a new author.

Request body:
{
  "id": "a3",
  "name": "Robert Brown",
  "birthYear": 1975
}

Success:
- Status Code: `201`
- Response body: the newñy created author object

Errors:
- `400` if a required field is missing or invalid
- `400` if the author `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:
{
  "name": "Robert Brown Updated",
  "birthYear": 1978
}

Success:
- Status Code: `200`
- Response body: the updated author object

Example response:
{
  "id": "a3",
  "name": "Robert Brown Updated",
  "birthYear": 1978
}

Errors:
- `400` if a required field is missing or invalid
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

The custom author ID will not be changed when updating an author.

#### DELETE /authors/:id
Purpose: Delete an existing author

Before deleting the author, the API must check whether any book have an `authorId` matching the author's custom `id`.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if the author still has books associated with them
- `500` if an unexpected server or database error occurs

### SWAGGER DOCUMENTATION
Swagger must document every author route, including the request body schemas, response examples, and possible error status codes.

All author endpoints must be available for testing through the Swagger UI at `/api-docs`.

### DEPLOYMENT EXPECTATIONS
After implementation, all author routes must work locally and from the deployed Render application.

The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser, including creating, retrieving, updating, and deleting authors.