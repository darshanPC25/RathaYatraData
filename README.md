# Ratha Yatra Donations Management System

A full-stack web application for managing Ratha Yatra donations, built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## Features

- **Donation Entry**
  - Booklet and Serial Number management
  - Block, Floor, and Quarter Number tracking
  - Amount and Payment Mode recording
  - Validation for duplicate entries

- **Booklet Wise View**
  - Total amount per booklet
  - List of all serials with donation details
  - Empty slot tracking

- **Block Wise View**
  - Grid layout for each block
  - Floor and Quarter Number organization
  - Visual indicators for donated slots
  - Detailed view on click

- **Delete Entries**
  - Delete by Serial Number
  - Delete All Entries (password protected)

## Tech Stack

- **Frontend**
  - Next.js 14 with App Router
  - TypeScript
  - Tailwind CSS
  - React Hot Toast for notifications

- **Backend**
  - Next.js API Routes
  - MongoDB with Mongoose
  - TypeScript

## Prerequisites

- Node.js 18.17 or later
- MongoDB (local or Atlas)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ratha-yatra-donations
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/dbAGV
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Donation Entry**
   - Select a booklet number (1-10)
   - Choose a serial number based on the booklet
   - Fill in block, floor, and quarter details
   - Enter amount and payment mode
   - Click "Save Donation"

2. **Booklet Wise**
   - View donations organized by booklet
   - See total amount per booklet
   - Check individual donation details

3. **Block Wise**
   - View donations in a grid layout
   - Green cells indicate donated slots
   - Click on a cell to see donation details

4. **Delete Entries**
   - Delete individual donations by serial number
   - Delete all entries using admin password

## Development

- Run tests:
  ```bash
  npm test
  ```

- Build for production:
  ```bash
  npm run build
  ```

- Start production server:
  ```bash
  npm start
  ```

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
