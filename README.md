# Ordinary Web Calculator 

A lightweight web application that emulates the behavior of a traditional office calculator. Built with MVC architecture and focused on intuitive user interaction. 

## Features 

- Supports basic operations: addition, subtraction, multiplication, division, modulus 
- Includes advanced functions: square root, power of two, negate 
- Memory operations: MS, MR, M+, M−, MC 
- Responsive display formatting with exponential fallback for long results 

## Tech Stack 

- **TypeScript** 
- **HTML5 & SASS** 

## Project Structure 

```
├── model/
│   └── calculation.ts       # Core arithmetic logic
├── controller/
│   └── controller.ts        # Input handling and UI state management
├── view/
│   └── index.ts             # DOM bindings and event listeners
├── settings.ts              # Constants, regex patterns, and shared types
```

## Getting Started

Clone the repo, install dependencies, and launch the app:
```bash 
git clone https://github.com/your-username/ordinary-web-calculator.git
cd ordinary-web-calculator
npm install
npm start
```

## License

This project is open-source and available under the MIT License.