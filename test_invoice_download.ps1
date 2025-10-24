# Test Invoice Download with Consignment Filter
# Usage: ./test_invoice_download.ps1

# Replace these with your actual values
$INVOICE_ID = 1  # Get this from your database
$FRANCHISE_ID = 1  # Get this from your database
$CONSIGNMENT_NO = "CODIGIIX INFOTECH108"  # The specific consignment to test
$TOKEN = "your_jwt_token_here"  # Get from login response

$BASE_URL = "http://localhost:5000/api/invoices"

# Test 1: Download without consignment filter (should show all)
Write-Host "Test 1: Download full invoice (all consignments)..."
$url1 = "$BASE_URL/$INVOICE_ID/download"
Invoke-WebRequest -Uri $url1 `
    -Headers @{"Authorization" = "Bearer $TOKEN"} `
    -OutFile "invoice_all.pdf" `
    -ErrorAction SilentlyContinue

if (Test-Path "invoice_all.pdf") {
    Write-Host "✅ Full invoice downloaded (file size: $(Get-Item invoice_all.pdf | select -ExpandProperty Length) bytes)" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to download full invoice" -ForegroundColor Red
}

# Test 2: Download with consignment filter (should show only specific consignment)
Write-Host "`nTest 2: Download invoice for specific consignment: $CONSIGNMENT_NO..."
$url2 = "$BASE_URL/$INVOICE_ID/download?consignmentNo=$([System.Web.HttpUtility]::UrlEncode($CONSIGNMENT_NO))"
Invoke-WebRequest -Uri $url2 `
    -Headers @{"Authorization" = "Bearer $TOKEN"} `
    -OutFile "invoice_$($CONSIGNMENT_NO.Replace(' ', '_')).pdf" `
    -ErrorAction SilentlyContinue

if (Test-Path "invoice_$($CONSIGNMENT_NO.Replace(' ', '_')).pdf") {
    $size = (Get-Item "invoice_$($CONSIGNMENT_NO.Replace(' ', '_')).pdf" | select -ExpandProperty Length)
    Write-Host "✅ Filtered invoice downloaded (file size: $size bytes)" -ForegroundColor Green
    Write-Host "   If this file is significantly smaller than the full invoice, filtering is working!" -ForegroundColor Yellow
} else {
    Write-Host "❌ Failed to download filtered invoice" -ForegroundColor Red
}

Write-Host "`n📋 Summary:"
Write-Host "- Files saved in current directory"
Write-Host "- Compare file sizes to verify filtering works"
Write-Host "- Larger file = full invoice (all consignments)"
Write-Host "- Smaller file = filtered invoice (one consignment only)"