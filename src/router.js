import express from 'express';
import { getBooksHandler, getBookByIdHandler, createBookHandler, updateBookHandler, deleteBookHandler } from './controllers/books.js';
import { getAuthorsHandler, getAuthorByIdHandler, createAuthorHandler, updateAuthorHandler, deleteAuthorHandler } from './controllers/authors.js';

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - id
 *         - authorId
 *         - title
 *         - publicationDate
 *       properties:
 *         id:
 *           type: string
 *           example: b1
 *         authorId:
 *           type: string
 *           example: a1
 *         title:
 *           type: string
 *           example: 1984
 *         publicationDate:
 *           type: string
 *           example: "1949-06-08"
 *     Author:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - birthYear
 *       properties:
 *         id:
 *           type: string
 *           example: a1
 *         name:
 *           type: string
 *           example: George Orwell
 *         birthYear:
 *           type: integer
 *           example: 1903
 */

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Books returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Unable to retrieve books
 */
router.get('/books', getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get one book by id
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom book id, such as b1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           aplication/json:
 *             schema:
 *               $ref: '#components/schemas/book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Unable to retrieve book
 */
router.get('/books/:id', getBookByIdHandler);

/**
 * @openapi
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *           example:
 *             id: b4
 *             authorId: a1
 *             title: Animal Farm
 *             PublicationDate: "1945-08-17"
 *     responses:
 *       201:
 *         description: Book successfully created
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Book'
 *       400:
 *         description: Missing or invalid fields or author does not exist
 *       409:
 *         description: A book with this ID already exists
 *       500:
 *         description: Internal Server Error
 */
router.post('/books', createBookHandler);

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     summary: Update an existing book
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom book ID
 *         schema:
 *           type: string
 *         example: b1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authorId
 *               - title
 *               - publicationDate
 *             properties:
 *               authorId:
 *                 type: string
 *                 example: a1
 *               title:
 *                 type: string
 *                 example: Nineteen Eighty-Four
 *               publicationDate:
 *                 type: string
 *                 example: "1949-06-08"
 *           example:
 *             authorId: a1
 *             title: Nineteen Eighty-Four
 *             publicationDate: "1949-06-08"
 *     responses:
 *       200:
 *         description: Book successfully updated
 *         content:
 *            application/json:
 *               shcema:
 *                  $ref: '#/components/schemas/Book'
 *       400:
 *         description: Missing or invalid fields or author does not exist
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/books/:id', updateBookHandler);

/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom book ID
 *         schema:
 *           type: string
 *         example: b1
 *     responses:
 *       204:
 *         description: Book successfully deleted
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/books/:id', deleteBookHandler);

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: A list of authors
 *       500:
 *         description: Internal Server Error
 */
router.get('/authors', getAuthorsHandler);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Get an author by ID
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The author's custom ID
 *         example: a1
 *     responses:
 *       200:
 *         description: Author found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid author ID
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/authors/:id", getAuthorByIdHandler);

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Create a new author
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - birthYear
 *             properties:
 *               id:
 *                 type: string
 *                 example: a4
 *               name:
 *                 type: string
 *                 example: Ernest Hemingway
 *               birthYear:
 *                 type: integer
 *                 example: 1899
 *           example:
 *             id: a4
 *             name: Ernest Hemingway
 *             birthYear: 1899
 *     responses:
 *       201:
 *         description: Author successfully created
 *       400:
 *         description: Missing or invalid author fields
 *       409:
 *         description: An author with this ID already exists
 *       500:
 *         description: Internal Server Error
 */
router.post("/authors", createAuthorHandler);

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     summary: Update an existing author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The author's custom ID
 *         example: a1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthYear
 *             properties:
 *               name:
 *                 type: string
 *                 example: George Orwell
 *               birthYear:
 *                 type: integer
 *                 example: 1903
 *           example:
 *             name: George Orwell
 *             birthYear: 1903
 *     responses:
 *       200:
 *         description: Author successfully updated
 *       400:
 *         description: Missing or invalid author fields
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/authors/:id", updateAuthorHandler);

/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The author's custom ID
 *         example: a1
 *     responses:
 *       204:
 *         description: Author successfully deleted
 *       400:
 *         description: Invalid author ID
 *       404:
 *         description: Author not found
 *       409:
 *         description: Author cannot be deleted because they still have books
 *       500:
 *         description: Internal Server Error
 */
router.delete("/authors/:id", deleteAuthorHandler);


export default router;