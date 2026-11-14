# Books API Week 02 Spec - Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:

- `id`: string, required, unique custom ID such as `b1`.

- `authorId`: string, required, references the custom `id` of an existing author document.

- `title`: string, required.

- `publicationDate`: string, required, using the 
`YYYY-MM-DD` format.

Books will continue to use custom string IDs instead of MongoDB `_id` values for route parameters.

### Relationship to Authors

Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API must verify that the submitted `authorId` belongs to an existing author.

If the author does not exist, the API must reject the request with a `400` status code.

When deleting a book, the associated author must not be deleted. Only the selected book document will be removed.

### Data Validation

The API must validate all submitted book information.

- `id` must be a non-empty string and must be unique.

- `authorId` must be a non-empty string matching an existing author.

- `title` must be a non-empty string.

- `publicationDate` must be a valid date in `YYYY-MM-DD` format.

Required fields cannot be missing or empty.

Clients cannot modify MongoDB internal fields directly.

Invalid request bodies must return a `400` status code.

### Routes

#### GET /books

Purpose: Return all books.

Success:

Status code: `200`

Response body: an array of book objects.

If no books exist, return an empty array ([]).

Example response:

[
  {
    "id": "b1",
    "authorId": "a1",
    "title": "Example Book",
    "publicationDate": "2026-01-15"
  }
]

Errors:

`500` if an unexpected server or database error occurs.

#### GET /books/:id

Purpose: Return one book by its custom ID.

Success:

Status code: `200`

Response body: the matching book object.

Errors:

`404` if no book exists with that ID.

`500` if an unexpected server or database error occurs.

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

Status code: `201`

Response body: the newly created book object.

Errors:

`400` if a required field is missing or invalid.

`400` if the authorId does not match an existing author.

`409` if the book ID already exists.

`500` if an unexpected server or database error occurs.

#### PUT /books/:id

Purpose: Update an existing book.

Request body:

{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}

Success:

Status code: `200`

Response body: the updated book object.

The custom book ID will not be changed when updating a book.

Errors:

`400` if a required field is missing or invalid.

`400` if the authorId does not match an existing author.

`404` if no book exists with that ID.

`500` if an unexpected server or database error occurs.

#### DELETE /books/:id

Purpose: Delete an existing book.

Success:

Status code: `204`

Response body: none.

Errors:

`404` if no book exists with that ID.

`500` if an unexpected server or database error occurs.

### Standard Error Response Format

All error responses must use a consistent JSON format.

Example:

{
  "error": "Book not found."
}

The error message should describe the problem without exposing database credentials, connection strings, stack traces, or other sensitive server information.

### Database Requirements

Create a unique index on the custom `id` field in the `books` collection.

Create an index on the `authorId` field to improve searches for books belonging to an author.

Database queries must use the custom `id` field when searching for books.

Use appropriate MongoDB queries to validate and modify book documents.

### Security Requirements

Validate all request bodies before inserting or updating documents.

Reject invalid data types and empty required fields.

Do not allow clients to submit MongoDB operators or modify internal database fields.

Do not expose sensitive database or server information in error responses.

### Swagger Documentation

Swagger must document every book route, including:

HTTP method and endpoint.

Route parameters and their descriptions.

Required request body fields and data types.

Request body examples.

Successful response status codes and examples.

Possible error status codes and JSON response examples.

All book endpoints must be available for testing through the Swagger UI at `/api-docs`.

### Deployment Expectations

After implementation, all book routes must work locally and from the deployed Render application.

The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser, including creating, retrieving, updating, and deleting books.

## Feature 2: Author CRUD Operations

### Goal

Create an authors API that allows clients to create, read, update, and delete author records. Each author will have a custom string ID, a name, and a birth year. The API must also maintain the relationship between authors and books.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

`id`: string, required, unique custom ID such as a1.

`name`: string, required.

`birthYear`: number, required, must be a positive integer.

Authors will use custom string IDs instead of MongoDB `_id` values for route parameters.

Example author document:

{
  "id": "a1",
  "name": "John Smith",
  "birthYear": 1980
}

### Relationship to Books

Each book will reference an author through its `authorId` field.

The `authorId` value in a book must match the custom `id` of an existing author document.

When creating or updating a book, the API must verify that the referenced author exists.

When deleting an author, the API must check whether any books have an `authorId` matching that author's custom ID.

If the author still has books associated with them, the API must reject the deletion with a `409` status code.

The client must first update those books to reference another existing author or delete the associated books.

The API must not automatically delete books when an author is deleted.

### Data Validation

The API must validate all submitted author information.

`id` must be a non-empty string and must be unique.

`name` must be a non-empty string.

`birthYear` must be a positive integer.

`birthYear` cannot be greater than the current year.

Required fields cannot be missing or empty.

Clients cannot modify MongoDB internal fields directly.

Invalid request bodies must return a `400` status code.

### Routes

#### GET /authors

Purpose: Return all authors.

Success:

Status code: `200`

Response body: an array of author objects.

If no authors exist, return an empty array ([]).

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

`500` if an unexpected server or database error occurs.

#### GET /authors/:id

Purpose: Return one author by their custom ID.

Success:

Status code: `200`

Response body: the matching author object.

Example response:

{
  "id": "a1",
  "name": "John Smith",
  "birthYear": 1980
}

Errors:

`404` if no author exists with that ID.

`500` if an unexpected server or database error occurs.

#### POST /authors

Purpose: Create a new author.

Request body:

{
  "id": "a3",
  "name": "Robert Brown",
  "birthYear": 1975
}

Success:

Status code: `201`

Response body: the newly created author object.

Errors:

`400` if a required field is missing or invalid.

`409` if the author ID already exists.

`500` if an unexpected server or database error occurs.

#### PUT /authors/:id

Purpose: Update an existing author.

Request body:

{
  "name": "Robert Brown Updated",
  "birthYear": 1978
}

Success:

Status code: `200`

Response body: the updated author object.

Example response:

{
  "id": "a3",
  "name": "Robert Brown Updated",
  "birthYear": 1978
}

The custom author ID will not be changed when updating an author.

Both `name` and `birthYear` are required in the update request.

Errors:

`400` if a required field is missing or invalid.

`404` if no author exists with that ID.

`500` if an unexpected server or database error occurs.

#### DELETE /authors/:id

Purpose: Delete an existing author.

Before deleting the author, the API must check whether any books have an `authorId` matching the author's custom ID.

The API should use MongoDB's `findOne()` method to check whether an associated book exists instead of retrieving every book.

Success:

Status code: `204`

Response body: none.

Errors:

`404` if no author exists with that ID.

`409` if the author still has books associated with them.

`500` if an unexpected server or database error occurs.

### Standard Error Response Format

All error responses must use a consistent JSON format.

Examples:

Invalid request:

{
  "error": "Name and birthYear are required."
}

Author not found:

{
  "error": "Author not found."
}

Author still has associated books:

{
  "error": "Cannot delete author because books are associated with this author."
}

Internal server error:

{
  "error": "Internal server error."
}

Error messages must not expose database credentials, connection strings, stack traces, or sensitive server information.

### Database Requirements

Create a unique index on the custom `id` field in the `authors` collection.

Use the custom `id` field when searching for authors.

Use `findOne()` on the `books` collection to check for associated books before deleting an author.

Validate author references when creating or updating books.

Handle duplicate ID errors consistently.

### Security Requirements

Validate all request bodies before inserting or updating documents.

Reject empty names, invalid birth years, and incorrect data types.

Do not allow clients to submit MongoDB operators or modify internal database fields.

Do not expose sensitive database or server information in error responses.

Database connection credentials must remain in environment variables and must never be committed to GitHub.

Authentication and authorization are not required for this assignment unless specifically requested by the instructor.

### Swagger Documentation

Swagger must document every author route, including:

HTTP method and endpoint.

Route parameters and their descriptions.

Required request body fields and data types.

Request body examples.

Successful response status codes and examples.

Possible error status codes and JSON response examples.

All author endpoints must be available for testing through the Swagger UI at `/api-docs`.

### Deployment Expectations

After implementation, all author routes must work locally and from the deployed Render application.

The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser, including creating, retrieving, updating, and deleting authors.

### Final Implementation Checklist

The following tasks must be completed to consider Week 02 finished.

#### Books API

Update book documents to include `authorId`.

Validate that the referenced author exists.

Implement GET all books.

Implement GET book by custom ID.

Implement POST book.

Implement PUT book.

Implement DELETE book.

Validate all book fields.

Create a unique index for book IDs.

Create an index for `authorId`.

Document all book routes in Swagger.

#### Authors API

Create the `authors` collection.

Implement GET all authors.

Implement GET author by custom ID.

Implement POST author.

Implement PUT author.

Implement DELETE author.

Prevent deletion of authors with associated books.

Validate all author fields.

Create a unique index for author IDs.

Document all author routes in Swagger.

#### Testing and Deployment

Test all endpoints locally.

Test successful responses and error responses.

Verify that duplicate IDs are rejected.

Verify that invalid author references are rejected.

Verify that authors with associated books cannot be deleted.

Verify that Swagger documents and tests every endpoint.

Deploy the updated API to Render.

Test all endpoints using the deployed `/api-docs` page.