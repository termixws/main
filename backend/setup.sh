#!/bin/bash

echo "=== Salon Natasha Backend Setup ==="
echo ""

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your Supabase credentials."
else
    echo "⚠️  .env file already exists. Skipping..."
fi

echo ""
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo "1. Edit the .env file with your Supabase database URL"
echo "2. Run the server: python -m uvicorn server:app --reload"
echo "3. Visit http://localhost:8000/docs for API documentation"
echo ""
