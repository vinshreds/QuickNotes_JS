# QuickNotes

A simple browser-based note-taking application built with TypeScript. This application is intentionally designed with security vulnerabilities for educational purposes.

## ⚠️ Security Warning

This application contains intentionally insecure practices and should **NOT** be used in production. It is designed for educational purposes to demonstrate common web security vulnerabilities.

## Features

- User registration and login (using localStorage)
- Create, edit, and delete personal notes
- Export notes as CSV or TXT files
- Simple and intuitive interface

## Intentionally Implemented Security Vulnerabilities

This application includes several security vulnerabilities for educational purposes:

1. **Cross-Site Scripting (XSS)**
   - User input is rendered directly using `innerHTML` without sanitization
   - Notes content is vulnerable to XSS attacks
   - Marked with `// TODO: sanitize this` comments

2. **Insecure Authentication**
   - Simple flag-based authentication using localStorage
   - No proper session management
   - Passwords stored in plaintext
   - Marked with `// Insecure login method` comments

3. **Insecure Data Storage**
   - All data stored in localStorage in plaintext
   - No encryption of sensitive information
   - Credentials and notes are easily accessible

4. **CSV Injection**
   - Raw note content included in CSV exports without sanitization
   - Vulnerable to CSV injection attacks
   - Marked with `// TODO: sanitize this` comments

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/QuickNotes_JS.git
   cd QuickNotes_JS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile TypeScript:
   ```bash
   ./compile.sh
   ```

4. Open `index.html` in your browser

## Development

The application is built with:
- TypeScript
- Vanilla JavaScript
- HTML5
- No external dependencies

## Security Scanning

This project includes Veracode security scanning in its CI/CD pipeline:

- Static Analysis scanning for code vulnerabilities
- Software Composition Analysis (SCA) for dependency vulnerabilities
- Automated scanning on every push to main branch

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is for educational purposes only. The intentionally implemented security vulnerabilities should not be replicated in production applications. Always follow security best practices in real-world applications. 