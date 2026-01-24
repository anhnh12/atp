.PHONY: help install dev dev-clean build build-clean preview test test-watch test-coverage lint lint-fix type-check format deploy deploy-preview clean update

# Default target
help:
	@echo "ATP Website - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev           - Start development server"
	@echo "  make dev-clean     - Clean cache and start dev server"
	@echo ""
	@echo "Building:"
	@echo "  make build         - Build for production"
	@echo "  make build-clean   - Clean and build"
	@echo "  make preview       - Preview production build locally"
	@echo ""
	@echo "Testing:"
	@echo "  make test          - Run all tests"
	@echo "  make test-watch    - Run tests in watch mode"
	@echo "  make test-coverage - Run tests with coverage"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint          - Run linter"
	@echo "  make lint-fix      - Fix linting issues"
	@echo "  make type-check    - Check TypeScript types"
	@echo "  make format        - Format code"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy        - Deploy to GitHub Pages"
	@echo "  make deploy-preview - Preview deployment"
	@echo ""
	@echo "Maintenance:"
	@echo "  make install       - Install dependencies"
	@echo "  make update        - Update dependencies"
	@echo "  make clean         - Remove build artifacts and cache"
	@echo "  make help          - Show this help message"

# Installation
install:
	@echo "Installing dependencies..."
	npm install --legacy-peer-deps

update:
	@echo "Updating dependencies..."
	npm update

# Development
dev:
	@echo "Starting development server..."
	npm start

dev-clean: clean
	@echo "Cleaning and starting development server..."
	npm start

# Building
build:
	@echo "Building for production..."
	npm run build
	@echo "Build complete! Output in ./build"

build-clean: clean
	@echo "Cleaning and building..."
	npm run build
	@echo "Build complete! Output in ./build"

preview: build
	@echo "Starting preview server on http://localhost:3000..."
	@echo "Press Ctrl+C to stop"
	npx serve -s build -l 3000

# Testing
test:
	@echo "Running tests..."
	npm test

test-watch:
	@echo "Running tests in watch mode..."
	npm run test:watch

test-coverage:
	@echo "Running tests with coverage..."
	npm run test:coverage

# Code Quality
lint:
	@echo "Running linter..."
	npm run lint

lint-fix:
	@echo "Fixing linting issues..."
	npm run lint:fix

type-check:
	@echo "Checking TypeScript types..."
	npm run type-check

format:
	@echo "Formatting code..."
	npm run format

# Deployment
deploy:
	@echo "Deploying to GitHub Pages..."
	@echo "Note: This requires gh-pages package. Install with: npm install --save-dev gh-pages"
	npm run deploy

deploy-preview:
	@echo "Previewing deployment..."
	npm run deploy:preview

# Maintenance
clean:
	@echo "Cleaning build artifacts and cache..."
	rm -rf build
	rm -rf node_modules/.cache
	rm -rf .eslintcache
	@echo "Clean complete!"