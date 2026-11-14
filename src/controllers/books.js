import { getAllBooks, getBookById, authorExists, bookExists, createBook, updateBook, deleteBook } from "../models/books.js";

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('GET /books failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getBookByIdHandler = async (req, res) => {
    const requestedId = req.params.id;

    try {
        const book = await getBookById(requestedId);
        
        if (!book) {
            return res.status(404).json({ message: ' Book not found' });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('GET /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const createBookHandler = async (req, res) => {
    const { id, authorId, title, publicationDate } = req.body;

    if (
        typeof id !== 'string' || !id.trim() ||
        typeof authorId !== 'string' || !authorId.trim() ||
        typeof title !== 'string' || !title.trim() ||
        typeof publicationDate !== 'string' || !publicationDate.trim()
    ) {
        return res.status(400).json({
            message: 'id, authorId, title, and publicationDate are required and must be valid strings'
        });
    }

    try {
        const existingBook = await bookExists(id);

        if (existingBook) {
            return res.status(409).json({
                message: 'A book with this ID already exists'
            });
        }

        const existingAuthor = await authorExists(authorId);

        if (!existingAuthor) {
            return res.status(400).json({
                message: 'The specified author does not exist'
            });
        }

        const newBook = {
            id: id.trim(),
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate: publicationDate.trim()
        };

        const createdBook = await createBook(newBook);

        return res.status(201).json(createdBook);
    } catch (error) {
        console.error('POST /books failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateBookHandler = async (req, res) => {
    const requestedId = req.params.id;
    const { authorId, title, publicationDate } = req.body;

    if (
        typeof authorId !== 'string' || !authorId.trim() ||
        typeof title !== 'string' || !title.trim() ||
        typeof publicationDate !== 'string' || !publicationDate.trim()
    ) {
        return res.status(400).json({
            message: 'authorId, title, and publicationDate are required and must be valid strings'
        });
    }

    try {
        const existingBook = await getBookById(requestedId);

        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const existingAuthor = await authorExists(authorId);

        if (!existingAuthor) {
            return res.status(400).json({
                message: 'The specified author does not exist'
            });
        }

        const updatedData = {
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate: publicationDate.trim()
        };

        await updateBook(requestedId, updatedData);

        const updatedBook = await getBookById(requestedId);

        return res.status(200).json(updatedBook);
    } catch (error) {
        console.error('PUT /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteBookHandler = async (req, res) => {
    const requestedId = req.params.id;

    try {
        const existingBook = await getBookById(requestedId);

        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await deleteBook(requestedId);

        return res.status(204).send();
    } catch (error) {
        console.error('DELETE /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export { getBooksHandler, getBookByIdHandler, createBookHandler, updateBookHandler, deleteBookHandler };