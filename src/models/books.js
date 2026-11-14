import { getDb } from "../db/connect.js";

const getAllBooks = async () => {
    const db = getDb();
    const collection = db.collection('books');
    const books = await collection.find({}).toArray();
    return books;
}

const getBookById = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');
    const book = await collection.findOne({ id: bookId });
    return book;
}

const authorExists = async (authorId) => {
    const db = getDb();
    const collection = db.collection('authors');
    const author = await collection.findOne({ id: authorId });
    return Boolean(author);
};

const bookExists = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');
    const book = await collection.findOne({ id: bookId });
    return Boolean(book);
};

const createBook = async (bookData) => {
    const db = getDb();
    const collection = db.collection('books');

    const result = await collection.insertOne(bookData);

    return await collection.findOne({ _id: result.insertedId });
};

const updateBook = async (bookId, bookData) => {
    const db = getDb();
    const collection = db.collection('books');

    const result = await collection.updateOne(
        { id: bookId },
        { $set: bookData }
    );

    return result;
};

const deleteBook = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');

    const result = await collection.deleteOne({ id: bookId });

    return result;
};

export { getAllBooks, getBookById, authorExists, bookExists, createBook, updateBook, deleteBook };