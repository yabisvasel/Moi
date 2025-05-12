#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Banner
print_banner() {
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════╗"
    echo "║         AWS Key Scanner v2.0          ║"
    echo "╚═══════════════════════════════════════╝"
    echo -e "${NC}"
}

# Error handling
set -e
trap 'echo -e "${RED}Error: Command failed at line $LINENO${NC}" >&2' ERR

# Function to validate URLs
validate_url() {
    if [[ ! "$1" =~ ^https?:// ]]; then
        echo -e "${RED}Invalid URL format: $1${NC}" >&2
        return 1
    fi
    return 0
}

# Function to scan a single URL
scan_url() {
    local url="$1"
    local temp_dir="$2"
    local output_dir="$3"
    local timestamp=$(date +%s)
    
    echo -e "${YELLOW}Scanning: $url${NC}"
    
    # Create unique ID for this scan
    local scan_id=$(echo "$url$timestamp" | md5sum | cut -d' ' -f1)
    local js_files="$temp_dir/js_files_$scan_id.txt"
    local aws_keys="$temp_dir/aws_keys_$scan_id.txt"
    local sendgrid_keys="$temp_dir/sendgrid_keys_$scan_id.txt"
    
    # Extract JavaScript files
    curl -sL "$url" | grep -Eo 'src="[^"]*\.js"' | cut -d'"' -f2 > "$js_files"
    
    # Process each JavaScript file
    while read -r js_file; do
        # Handle relative paths
        if [[ "$js_file" =~ ^// ]]; then
            js_file="https:$js_file"
        elif [[ "$js_file" =~ ^/ ]]; then
            js_file="${url%/}$js_file"
        elif [[ ! "$js_file" =~ ^https?:// ]]; then
            js_file="${url%/}/$js_file"
        fi
        
        echo -e "${BLUE}Analyzing: $js_file${NC}"
        
        # Download and scan JS file
        curl -sL "$js_file" 2>/dev/null | {
            # Look for AWS keys
            grep -E "AKIA[A-Z0-9]{16}" > >(tee -a "$aws_keys") || true
            # Look for SendGrid keys
            grep -E "SG\.[0-9A-Za-z\-_]{22}\.[0-9A-Za-z\-_]{43}" > >(tee -a "$sendgrid_keys") || true
        }
    done < "$js_files"
    
    # Save results if keys were found
    if [[ -s "$aws_keys" || -s "$sendgrid_keys" ]]; then
        local result_file="$output_dir/scan_${scan_id}_$(date +%Y%m%d_%H%M%S).txt"
        {
            echo "Scan Results for $url"
            echo "Timestamp: $(date)"
            echo "----------------------------------------"
            if [[ -s "$aws_keys" ]]; then
                echo -e "\nAWS Keys Found:"
                cat "$aws_keys"
            fi
            if [[ -s "$sendgrid_keys" ]]; then
                echo -e "\nSendGrid Keys Found:"
                cat "$sendgrid_keys"
            fi
        } > "$result_file"
        echo -e "${GREEN}Keys found! Results saved to: $result_file${NC}"
    else
        echo -e "${GREEN}No keys found.${NC}"
    fi
}

# Main function
main() {
    print_banner
    
    # Check arguments
    if [ "$#" -lt 1 ]; then
        echo -e "${RED}Usage: $0 <url_list_file> [threads]${NC}"
        exit 1
    fi
    
    local url_file="$1"
    local threads=${2:-10}  # Default to 10 threads
    
    # Validate input file
    if [ ! -f "$url_file" ]; then
        echo -e "${RED}Error: URL file not found${NC}"
        exit 1
    fi
    
    # Create output directories
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local temp_dir="/tmp/keyscan_$timestamp"
    local output_dir="results_$timestamp"
    mkdir -p "$temp_dir" "$output_dir"
    
    # Count total URLs
    local total_urls=$(wc -l < "$url_file")
    echo -e "${BLUE}Starting scan of $total_urls URLs using $threads threads${NC}"
    
    # Process URLs in parallel
    export -f scan_url
    export -f validate_url
    export RED GREEN BLUE YELLOW NC
    
    cat "$url_file" | xargs -I {} -P "$threads" bash -c \
        'validate_url "{}" && scan_url "{}" "'$temp_dir'" "'$output_dir'"'
    
    # Cleanup
    rm -rf "$temp_dir"
    
    echo -e "${GREEN}Scan complete! Results are in: $output_dir${NC}"
}

main "$@"