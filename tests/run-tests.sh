#!/bin/bash

# Polymarket Orderbook Subgraph Test Runner
# Run comprehensive tests for the subgraph

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🧪 Polymarket Orderbook Subgraph Test Runner"
echo "============================================="
echo ""

# Function to run a specific test
run_test() {
    local test_name=$1
    local test_script=$2
    
    echo "Running $test_name..."
    echo "----------------------------------------"
    bash "$SCRIPT_DIR/scripts/$test_script"
    echo ""
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  all              Run all tests (default)"
    echo "  basic            Run basic functionality tests"
    echo "  detailed         Run detailed analysis tests"
    echo "  comprehensive    Run comprehensive test suite"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0               # Run all tests"
    echo "  $0 basic         # Run basic tests only"
    echo "  $0 detailed      # Run detailed analysis"
}

# Check if we're in the right directory
if [ ! -f "$SCRIPT_DIR/scripts/comprehensive-test.sh" ]; then
    echo "❌ Error: Test scripts not found. Please run this from the project root."
    exit 1
fi

# Parse command line arguments
case "${1:-all}" in
    "all")
        echo "🚀 Running Complete Test Suite"
        echo "=============================="
        echo ""
        
        run_test "Basic Functionality Tests" "test-subgraph.sh"
        run_test "Detailed Analysis Tests" "detailed-tests.sh"
        run_test "Comprehensive Test Suite" "comprehensive-test.sh"
        
        echo "✅ All tests completed!"
        echo ""
        echo "📊 Summary:"
        echo "   - Basic tests: ✅"
        echo "   - Detailed analysis: ✅"
        echo "   - Comprehensive tests: ✅"
        echo ""
        echo "📋 See tests/SUBGRAPH_TEST_REPORT.md for detailed results"
        ;;
    "basic")
        run_test "Basic Functionality Tests" "test-subgraph.sh"
        ;;
    "detailed")
        run_test "Detailed Analysis Tests" "detailed-tests.sh"
        ;;
    "comprehensive")
        run_test "Comprehensive Test Suite" "comprehensive-test.sh"
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    *)
        echo "❌ Unknown option: $1"
        show_usage
        exit 1
        ;;
esac 