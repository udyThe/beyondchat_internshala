#!/bin/bash

echo "========================================="
echo "BeyondChats Application - Deployment Test"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check environment files
echo "📋 Test 1: Environment Files"
if [ -f "laravel-api/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env exists"
else
    echo -e "${RED}✗${NC} Backend .env missing"
fi

if [ -f "reactjs-frontend/.env" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env exists"
else
    echo -e "${RED}✗${NC} Frontend .env missing"
fi

if [ -f "nodejs-script/.env" ]; then
    echo -e "${GREEN}✓${NC} NodeJS script .env exists"
else
    echo -e "${RED}✗${NC} NodeJS script .env missing"
fi

echo ""

# Test 2: Check for hardcoded values
echo "🔍 Test 2: Hardcoded Values Check"
HARDCODED=$(grep -r "localhost:8000" --include="*.js" --include="*.jsx" laravel-api/server.js reactjs-frontend/src/*.jsx reactjs-frontend/src/**/*.jsx 2>/dev/null | grep -v "env\|process\|import\.meta" | wc -l)
if [ "$HARDCODED" -eq 0 ]; then
    echo -e "${GREEN}✓${NC} No hardcoded localhost:8000 found"
else
    echo -e "${YELLOW}⚠${NC} Found $HARDCODED potential hardcoded values"
fi

echo ""

# Test 3: Backend API Test
echo "🖥️  Test 3: Backend API"
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/articles 2>/dev/null)
if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓${NC} Backend API responding (HTTP 200)"
    ARTICLE_COUNT=$(curl -s http://localhost:8000/articles | grep -o '"id":' | wc -l)
    echo -e "${GREEN}✓${NC} Database has $ARTICLE_COUNT articles"
else
    echo -e "${RED}✗${NC} Backend API not responding"
fi

echo ""

# Test 4: Database Check
echo "💾 Test 4: Database"
if [ -f "laravel-api/database/database.sqlite" ]; then
    DB_SIZE=$(du -h laravel-api/database/database.sqlite | cut -f1)
    echo -e "${GREEN}✓${NC} Database file exists ($DB_SIZE)"
else
    echo -e "${RED}✗${NC} Database file missing"
fi

echo ""

# Test 5: Git Configuration
echo "📦 Test 5: Git Configuration"
if git check-ignore -q laravel-api/.env; then
    echo -e "${GREEN}✓${NC} .env files are gitignored"
else
    echo -e "${RED}✗${NC} .env files not in gitignore"
fi

if [ -f "laravel-api/.env.example" ] && [ -f "reactjs-frontend/.env.example" ] && [ -f "nodejs-script/.env.example" ]; then
    echo -e "${GREEN}✓${NC} All .env.example files committed"
else
    echo -e "${RED}✗${NC} Missing .env.example files"
fi

echo ""

# Test 6: Dependencies
echo "📚 Test 6: Dependencies"
if [ -d "laravel-api/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed"
fi

if [ -d "reactjs-frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed"
fi

if [ -d "nodejs-script/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Enhancement script dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Enhancement script dependencies not installed"
fi

echo ""

# Test 7: Documentation
echo "📖 Test 7: Documentation"
if [ -f "README.md" ]; then
    echo -e "${GREEN}✓${NC} README.md exists"
fi

if [ -f "DEPLOYMENT.md" ]; then
    echo -e "${GREEN}✓${NC} DEPLOYMENT.md exists"
fi

echo ""
echo "========================================="
echo "Test Complete!"
echo "========================================="
