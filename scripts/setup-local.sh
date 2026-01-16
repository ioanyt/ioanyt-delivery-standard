#!/bin/bash
#
# Local Development Setup Script
#
# This script sets up your local development environment
# for the IOanyT Delivery Standard reference project.
#

set -e

echo "=========================================="
echo "IOanyT Delivery Standard - Local Setup"
echo "=========================================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v 2>/dev/null || echo "not installed")

if [ "$NODE_VERSION" = "not installed" ]; then
    echo "Error: Node.js is not installed."
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Extract major version
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')

if [ "$MAJOR_VERSION" -lt 18 ]; then
    echo "Error: Node.js 18+ is required. Found: $NODE_VERSION"
    exit 1
fi

echo "Node.js version: $NODE_VERSION"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

echo ""
echo "Setup complete!"
echo ""
echo "Available commands:"
echo "  npm run dev      - Start development server with hot reload"
echo "  npm test         - Run all tests"
echo "  npm run lint     - Run linting"
echo "  npm run format   - Format code with Prettier"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
