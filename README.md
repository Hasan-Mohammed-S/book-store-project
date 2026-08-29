# 📚 Let's Read

![App Screenshot](./public/images/screenshot.png)

---

## 📖 Background & Description

**Let's Read** is an interactive web platform designed for book lovers and readers, allowing users to share book recommendations, manage their personal digital libraries, and engage with the reading community.

### 🌟 Why I Built This:
**Let's Read** was created to provide a clean, user-friendly, and structured space for readers to organize their favorite books, discover new recommendations shared by fellow readers, and easily manage their personal reading lists.

### ✨ Key Features & Functionality:
* **User Authentication:** Secure user sign-up, sign-in, and session management.
* **Personal Library Management (My Books):** Full CRUD functionality to add, view, update, and delete personal books.
* **Community Recommendations:** Browse books shared by other community members with clear authorship (`Posted by`).
* **Share a Book:** An intuitive form to post new books including book title, author, price, description, and cover image.
* **Cloud-based Image Uploads:** Seamless image upload and storage integration using Cloudinary.

---

## 🚀 Getting Started

* 🌐 **Deployed Application (Live App):**it's not public
* 📋 **Planning Materials:** [View Trello / Figma Board]

---

## 📐 Planning & Database Architecture

### 🗄️ Entity Relationship Diagram (ERD):
Below is the database architecture schema outlining the relationships between models:

![ERD Diagram](./public/images/erd-diagram.png)

* **Users:** Stores user profiles (`firstName`, `lastName`, `e-mail`).
* **Books:** Contains book attributes (`name`, `writer`, `price`, `description`, `image`) linked to the creator.
* **Orders:** Manages purchase requests and items (`items: []`, `address`).

### 🖼️ Wireframes & UI Layouts:
Initial layout concepts and UI flow diagrams created during the planning phase:

![Wireframes](./public/images/wireframes.png)

1. **Personal Library (My Books):** Displaying personal book cards.
2. **Community Recommendations:** Public feed displaying books from all users.
3. **Add Book Form:** Form interface for inserting new book details and cover images.

---

## 🖼️ Application Screenshots

### 1. Community Recommendations
![Community Recommendations](./public/images/screenshot-community.jpg)

### 2. My Books Page
![My Books Page](./public/images/screenshot-my-books.jpg)

### 3. Add New Book Form
![Add Book Form](./public/images/screenshot-add-book.jpg)

---

## 🛠️ Technologies Used

* **Core Language:** JavaScript (Node.js)
* **Backend Framework:** Express.js
* **Database & ORM:** MongoDB & Mongoose
* **Frontend Templating:** EJS (Embedded JavaScript), HTML5, CSS3
* **Image Upload & Storage:** Cloudinary API & Multer
* **Authentication & Security:** Express-Session & Bcrypt

---

## 🔗 Attributions

* **Cloudinary:** For cloud image storage and asset management.
* **Node.js Open Source Ecosystem:** Various npm packages enabling session management, password hashing, and database ORM.

---

## 🔮 Next Steps (Stretch Goals)

* [ ] Add interactive book reviews and comments section.
* [ ] Implement a star rating system for books.
* [ ] Add search and filter functionality by category, title, or author.
* [ ] Introduce a "Want to Read" / Wishlist feature.
