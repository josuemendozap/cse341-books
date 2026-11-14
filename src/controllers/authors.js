import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor, authorHasBooks } from "../models/authors.js";

const getAuthorsHandler = async (req, res) => {
    try {
        const authors = await getAllAuthors();
        return res.status(200).json(authors);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Errors.' })
    }
};

const getAuthorByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !id.trim()) {
            return res.status(400).json({ error: 'A valid author ID is required' });
        }

        const author = await getAuthorById(id);

        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }

        return res.status(200).json(author);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
};

const createAuthorHandler = async (req, res) => {
    try {
        const { id, name, birthYear } = req.body;

        if (
            typeof id !== "string" || !id.trim() ||
            typeof name !== "string" || !name.trim() ||
            !Number.isInteger(birthYear) ||
            birthYear <= 0 ||
            birthYear > new Date().getFullYear()
        ) {
            return res.status(400).json({
                error: 'Please provide a valid ID, name, and birth year.'
            });
        }

        const author = await createAuthor({
            id: id.trim(),
            name: name.trim(),
            birthYear
        });

        return res.status(201).json(author);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'An author with this ID already exists.'
            });
        }

        return res.status(500).json({
            error: 'Internal server error.'
        });
    }
};

const updateAuthorHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, birthYear } = req.body;

        if (!id || !id.trim()) {
            return res.status(400).json({
                error: "A valid author ID is required."
            });
        }

        if (
            typeof name !== "string" || !name.trim() ||
            !Number.isInteger(birthYear) ||
            birthYear <= 0 ||
            birthYear > new Date().getFullYear()
        ) {
            return res.status(400).json({
                error: "Please provide a valid name and birth year."
            });
        }

        const updatedAuthor = await updateAuthor(id, {
            name: name.trim(),
            birthYear
        });

        if (!updatedAuthor) {
            return res.status(404).json({
                error: "Author not found."
            });
        }

        return res.status(200).json(updatedAuthor);
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error."
        });
    }
};

const deleteAuthorHandler = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !id.trim()) {
            return res.status(400).json({
                error: "A valid author ID is required."
            });
        }

        const author = await getAuthorById(id);

        if (!author) {
            return res.status(404).json({
                error: "Author not found."
            });
        }

        const hasBooks = await authorHasBooks(id);

        if (hasBooks) {
            return res.status(409).json({
                error: "This author cannot be deleted because they still have books."
            });
        }

        await deleteAuthor(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error."
        });
    }
};


export { getAuthorsHandler, getAuthorByIdHandler, createAuthorHandler, updateAuthorHandler, deleteAuthorHandler };