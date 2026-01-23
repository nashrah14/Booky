import express from 'express';
import Book from '../models/Book.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all books with optional search
router.get('/', optionalAuth, async (req, res) => {
  try {
    // Auto-initialize if no books exist
    const count = await Book.countDocuments();
    if (count === 0) {
      console.log('Auto-initializing books...');
      const sampleBooks = [
        {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81QuEGw8VPL.jpg',
          description: 'A classic American novel about the Jazz Age, following Nick Carraway as he becomes drawn into the world of his mysterious neighbor Jay Gatsby.',
          genres: ['Classics', 'Fiction'],
          average_rating: 4.5,
          total_ratings: 1250,
        },
        {
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81aY1lxk+9L.jpg',
          description: 'A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.',
          genres: ['Classics', 'Fiction'],
          average_rating: 4.8,
          total_ratings: 2100,
        },
        {
          title: '1984',
          author: 'George Orwell',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81StSOpmkjL.jpg',
          description: 'A dystopian social science fiction novel about totalitarian surveillance and thought control in a future society.',
          genres: ['Science Fiction', 'Dystopian'],
          average_rating: 4.7,
          total_ratings: 1800,
        },
        {
          title: 'Pride and Prejudice',
          author: 'Jane Austen',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg',
          description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet, the dynamic protagonist.',
          genres: ['Romance', 'Classics'],
          average_rating: 4.6,
          total_ratings: 1650,
        },
        {
          title: 'The Catcher in the Rye',
          author: 'J.D. Salinger',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/91HPG31dTwL.jpg',
          description: 'A controversial novel about teenage rebellion and alienation, following Holden Caulfield in New York City.',
          genres: ['Fiction', 'Classics'],
          average_rating: 4.3,
          total_ratings: 980,
        },
        {
          title: 'Lord of the Flies',
          author: 'William Golding',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81WUAoL-wFL.jpg',
          description: 'A story about a group of boys stranded on an island and their descent into savagery.',
          genres: ['Fiction', 'Adventure'],
          average_rating: 4.2,
          total_ratings: 750,
        },
        {
          title: 'Harry Potter and the Sorcerer\'s Stone',
          author: 'J.K. Rowling',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg',
          description: 'The first book in the beloved Harry Potter series, following a young wizard\'s journey at Hogwarts School of Witchcraft and Wizardry.',
          genres: ['Fantasy', 'Young Adult'],
          average_rating: 4.9,
          total_ratings: 3500,
        },
        {
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/712cDO7d73L.jpg',
          description: 'A fantasy novel about Bilbo Baggins, a hobbit who goes on an unexpected journey to help a group of dwarves.',
          genres: ['Fantasy', 'Adventure'],
          average_rating: 4.7,
          total_ratings: 2200,
        },
        {
          title: 'The Hunger Games',
          author: 'Suzanne Collins',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/61JfGcL2ljL.jpg',
          description: 'A dystopian novel about Katniss Everdeen, who volunteers to take her sister\'s place in a deadly televised competition.',
          genres: ['Science Fiction', 'Young Adult', 'Dystopian'],
          average_rating: 4.6,
          total_ratings: 2800,
        },
        {
          title: 'The Book Thief',
          author: 'Markus Zusak',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
          description: 'A story set in Nazi Germany, narrated by Death, about a young girl who steals books and shares them with others.',
          genres: ['Historical Fiction', 'Fiction'],
          average_rating: 4.8,
          total_ratings: 1900,
        },
        {
          title: 'The Fault in Our Stars',
          author: 'John Green',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/8170lGXy+mL.jpg',
          description: 'A heart-wrenching love story between two teenagers who meet in a cancer support group.',
          genres: ['Romance', 'Young Adult', 'Fiction'],
          average_rating: 4.5,
          total_ratings: 2400,
        },
        {
          title: 'The Alchemist',
          author: 'Paulo Coelho',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg',
          description: 'A philosophical novel about a young Andalusian shepherd who travels from Spain to Egypt in search of treasure.',
          genres: ['Fiction', 'Philosophy'],
          average_rating: 4.4,
          total_ratings: 1700,
        },
        {
          title: 'The Kite Runner',
          author: 'Khaled Hosseini',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
          description: 'A powerful story of friendship, betrayal, and redemption set against the backdrop of Afghanistan.',
          genres: ['Fiction', 'Historical Fiction'],
          average_rating: 4.7,
          total_ratings: 2100,
        },
        {
          title: 'The Girl with the Dragon Tattoo',
          author: 'Stieg Larsson',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
          description: 'A crime thriller about a journalist and a hacker investigating a decades-old disappearance.',
          genres: ['Mystery', 'Thriller', 'Crime'],
          average_rating: 4.5,
          total_ratings: 1600,
        },
        {
          title: 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe',
          author: 'C.S. Lewis',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
          description: 'Four siblings discover a magical world through a wardrobe and help save it from an evil witch.',
          genres: ['Fantasy', 'Children\'s Literature'],
          average_rating: 4.6,
          total_ratings: 1950,
        },
        {
          title: 'The Handmaid\'s Tale',
          author: 'Margaret Atwood',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
          description: 'A dystopian novel about a theocratic society where women are subjugated and used for reproduction.',
          genres: ['Dystopian', 'Science Fiction', 'Fiction'],
          average_rating: 4.6,
          total_ratings: 1800,
        },
        {
          title: 'The Da Vinci Code',
          author: 'Dan Brown',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
          description: 'A mystery thriller about a symbologist who uncovers a conspiracy involving the Catholic Church.',
          genres: ['Mystery', 'Thriller'],
          average_rating: 4.2,
          total_ratings: 1400,
        },
        {
          title: 'The Shining',
          author: 'Stephen King',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
          description: 'A horror novel about a writer who becomes caretaker of an isolated hotel and slowly descends into madness.',
          genres: ['Horror', 'Thriller'],
          average_rating: 4.5,
          total_ratings: 1650,
        },
        {
          title: 'The Seven Husbands of Evelyn Hugo',
          author: 'Taylor Jenkins Reid',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
          description: 'A captivating story about a reclusive Hollywood icon who finally decides to tell her life story to an unknown journalist.',
          genres: ['Fiction', 'Romance', 'Historical Fiction'],
          average_rating: 4.7,
          total_ratings: 2300,
        },
        {
          title: 'Project Hail Mary',
          author: 'Andy Weir',
          cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
          description: 'A science fiction novel about a lone astronaut who must save humanity from an extinction-level event.',
          genres: ['Science Fiction', 'Fiction'],
          average_rating: 4.8,
          total_ratings: 2100,
        },
      ];
      await Book.insertMany(sampleBooks);
      console.log(`Initialized ${sampleBooks.length} books.`);
    }

    const { search, genre, sort = 'title' } = req.query;
    let query = {};

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Genre filter
    if (genre && genre !== 'all') {
      query.genres = genre;
    }

    let sortOption = {};
    switch (sort) {
      case 'rating':
        sortOption = { average_rating: -1 };
        break;
      case 'author':
        sortOption = { author: 1 };
        break;
      default:
        sortOption = { title: 1 };
    }

    const books = await Book.find(query).sort(sortOption);
    res.json({ data: books, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single book
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ data: book, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create book (admin or for adding new books)
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({ data: book, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize with sample books
router.post('/initialize', async (req, res) => {
  try {
    const count = await Book.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Books already initialized', data: count });
    }

    const sampleBooks = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81QuEGw8VPL.jpg',
        description: 'A classic American novel about the Jazz Age, following Nick Carraway as he becomes drawn into the world of his mysterious neighbor Jay Gatsby.',
        genres: ['Classics', 'Fiction'],
        average_rating: 4.5,
        total_ratings: 1250,
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81aY1lxk+9L.jpg',
        description: 'A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.',
        genres: ['Classics', 'Fiction'],
        average_rating: 4.8,
        total_ratings: 2100,
      },
      {
        title: '1984',
        author: 'George Orwell',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81StSOpmkjL.jpg',
        description: 'A dystopian social science fiction novel about totalitarian surveillance and thought control in a future society.',
        genres: ['Science Fiction', 'Dystopian'],
        average_rating: 4.7,
        total_ratings: 1800,
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg',
        description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet, the dynamic protagonist.',
        genres: ['Romance', 'Classics'],
        average_rating: 4.6,
        total_ratings: 1650,
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/91HPG31dTwL.jpg',
        description: 'A controversial novel about teenage rebellion and alienation, following Holden Caulfield in New York City.',
        genres: ['Fiction', 'Classics'],
        average_rating: 4.3,
        total_ratings: 980,
      },
      {
        title: 'Lord of the Flies',
        author: 'William Golding',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81WUAoL-wFL.jpg',
        description: 'A story about a group of boys stranded on an island and their descent into savagery.',
        genres: ['Fiction', 'Adventure'],
        average_rating: 4.2,
        total_ratings: 750,
      },
      {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg',
        description: 'The first book in the beloved Harry Potter series, following a young wizard\'s journey at Hogwarts School of Witchcraft and Wizardry.',
        genres: ['Fantasy', 'Young Adult'],
        average_rating: 4.9,
        total_ratings: 3500,
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/712cDO7d73L.jpg',
        description: 'A fantasy novel about Bilbo Baggins, a hobbit who goes on an unexpected journey to help a group of dwarves.',
        genres: ['Fantasy', 'Adventure'],
        average_rating: 4.7,
        total_ratings: 2200,
      },
      {
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/61JfGcL2ljL.jpg',
        description: 'A dystopian novel about Katniss Everdeen, who volunteers to take her sister\'s place in a deadly televised competition.',
        genres: ['Science Fiction', 'Young Adult', 'Dystopian'],
        average_rating: 4.6,
        total_ratings: 2800,
      },
      {
        title: 'The Book Thief',
        author: 'Markus Zusak',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
        description: 'A story set in Nazi Germany, narrated by Death, about a young girl who steals books and shares them with others.',
        genres: ['Historical Fiction', 'Fiction'],
        average_rating: 4.8,
        total_ratings: 1900,
      },
      {
        title: 'The Fault in Our Stars',
        author: 'John Green',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/8170lGXy+mL.jpg',
        description: 'A heart-wrenching love story between two teenagers who meet in a cancer support group.',
        genres: ['Romance', 'Young Adult', 'Fiction'],
        average_rating: 4.5,
        total_ratings: 2400,
      },
      {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg',
        description: 'A philosophical novel about a young Andalusian shepherd who travels from Spain to Egypt in search of treasure.',
        genres: ['Fiction', 'Philosophy'],
        average_rating: 4.4,
        total_ratings: 1700,
      },
      {
        title: 'The Kite Runner',
        author: 'Khaled Hosseini',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
        description: 'A powerful story of friendship, betrayal, and redemption set against the backdrop of Afghanistan.',
        genres: ['Fiction', 'Historical Fiction'],
        average_rating: 4.7,
        total_ratings: 2100,
      },
      {
        title: 'The Girl with the Dragon Tattoo',
        author: 'Stieg Larsson',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
        description: 'A crime thriller about a journalist and a hacker investigating a decades-old disappearance.',
        genres: ['Mystery', 'Thriller', 'Crime'],
        average_rating: 4.5,
        total_ratings: 1600,
      },
      {
        title: 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe',
        author: 'C.S. Lewis',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
        description: 'Four siblings discover a magical world through a wardrobe and help save it from an evil witch.',
        genres: ['Fantasy', 'Children\'s Literature'],
        average_rating: 4.6,
        total_ratings: 1950,
      },
      {
        title: 'The Handmaid\'s Tale',
        author: 'Margaret Atwood',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
        description: 'A dystopian novel about a theocratic society where women are subjugated and used for reproduction.',
        genres: ['Dystopian', 'Science Fiction', 'Fiction'],
        average_rating: 4.6,
        total_ratings: 1800,
      },
      {
        title: 'The Da Vinci Code',
        author: 'Dan Brown',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
        description: 'A mystery thriller about a symbologist who uncovers a conspiracy involving the Catholic Church.',
        genres: ['Mystery', 'Thriller'],
        average_rating: 4.2,
        total_ratings: 1400,
      },
      {
        title: 'The Shining',
        author: 'Stephen King',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
        description: 'A horror novel about a writer who becomes caretaker of an isolated hotel and slowly descends into madness.',
        genres: ['Horror', 'Thriller'],
        average_rating: 4.5,
        total_ratings: 1650,
      },
      {
        title: 'The Seven Husbands of Evelyn Hugo',
        author: 'Taylor Jenkins Reid',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
        description: 'A captivating story about a reclusive Hollywood icon who finally decides to tell her life story to an unknown journalist.',
        genres: ['Fiction', 'Romance', 'Historical Fiction'],
        average_rating: 4.7,
        total_ratings: 2300,
      },
      {
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81F5t5V5+3L.jpg',
        description: 'A science fiction novel about a lone astronaut who must save humanity from an extinction-level event.',
        genres: ['Science Fiction', 'Fiction'],
        average_rating: 4.8,
        total_ratings: 2100,
      },
    ];

    await Book.insertMany(sampleBooks);
    res.json({ message: 'Sample books initialized', data: sampleBooks.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
