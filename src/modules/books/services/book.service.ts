class BookService {
    createBook(data: object) {
        return {
            success: true,
            statusCode: 201,
            message: "User created successfully.",
            token: "",
        };
    }
}

const bookService = new BookService();

export { bookService };

/*
TODO
# Book Table fields
- id
- title
- auther
- genre
- coverImage
- file
- createdAt
- updatedAt
*/
