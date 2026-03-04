# Customer Service Integration Test Script
# Purpose: Test all CRUD operations for Customer Service
# Backend: http://localhost:8081

$baseUrl = "http://localhost:8081/api/v1/customers"
$testResults = @()

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CUSTOMER SERVICE INTEGRATION TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Get all customers
Write-Host "[TEST 1] GET /api/v1/customers - Get all customers" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method GET
    if ($response.success -eq $true) {
        Write-Host "[SUCCESS] Retrieved $($response.data.content.Count) customers" -ForegroundColor Green
        Write-Host "  Total Elements: $($response.data.totalElements)" -ForegroundColor Gray
        $testResults += @{Test = "GET All Customers"; Status = "PASS"}
    }
} catch {
    Write-Host "[FAILED] $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test = "GET All Customers"; Status = "FAIL"}
}
Write-Host ""

# Test 2: Create a new customer
Write-Host "[TEST 2] POST /api/v1/customers - Create new customer" -ForegroundColor Yellow
$newCustomer = @{
    email = "test.customer.$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    firstName = "Test"
    lastName = "Customer"
    phone = "+1234567890"
    addressLine1 = "123 Test Street"
    city = "Test City"
    state = "Test State"
    country = "Test Country"
    postalCode = "12345"
    dateOfBirth = "1990-01-15"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $newCustomer -ContentType "application/json"
    if ($response.success -eq $true) {
        $createdCustomerId = $response.data.customerId
        Write-Host "[SUCCESS] Customer created with ID: $createdCustomerId" -ForegroundColor Green
        Write-Host "  Name: $($response.data.firstName) $($response.data.lastName)" -ForegroundColor Gray
        Write-Host "  Email: $($response.data.email)" -ForegroundColor Gray
        $testResults += @{Test = "POST Create Customer"; Status = "PASS"}
        
        # Test 3: Get customer by ID
        Write-Host ""
        Write-Host "[TEST 3] GET /api/v1/customers/$createdCustomerId - Get customer by ID" -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$baseUrl/$createdCustomerId" -Method GET
        if ($response.success -eq $true -and $response.data.customerId -eq $createdCustomerId) {
            Write-Host "[SUCCESS] Retrieved customer ID $createdCustomerId" -ForegroundColor Green
            $testResults += @{Test = "GET Customer by ID"; Status = "PASS"}
        }
        
        # Test 4: Update customer
        Write-Host ""
        Write-Host "[TEST 4] PUT /api/v1/customers/$createdCustomerId - Update customer" -ForegroundColor Yellow
        $updateCustomer = @{
            firstName = "Updated"
            lastName = "TestCustomer"
            phone = "+9876543210"
            city = "Updated City"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$baseUrl/$createdCustomerId" -Method PUT -Body $updateCustomer -ContentType "application/json"
        if ($response.success -eq $true) {
            Write-Host "[SUCCESS] Customer updated" -ForegroundColor Green
            Write-Host "  New Name: $($response.data.firstName) $($response.data.lastName)" -ForegroundColor Gray
            Write-Host "  New Phone: $($response.data.phone)" -ForegroundColor Gray
            $testResults += @{Test = "PUT Update Customer"; Status = "PASS"}
        }
        
        # Test 5: Search customers
        Write-Host ""
        Write-Host "[TEST 5] GET /api/v1/customers?search=Updated - Search customers" -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$baseUrl`?search=Updated" -Method GET
        if ($response.success -eq $true) {
            Write-Host "[SUCCESS] Search returned $($response.data.content.Count) results" -ForegroundColor Green
            $testResults += @{Test = "GET Search Customers"; Status = "PASS"}
        }
        
        # Test 6: Delete customer
        Write-Host ""
        Write-Host "[TEST 6] DELETE /api/v1/customers/$createdCustomerId - Delete customer" -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$baseUrl/$createdCustomerId" -Method DELETE
        if ($response.success -eq $true) {
            Write-Host "[SUCCESS] Customer deleted" -ForegroundColor Green
            $testResults += @{Test = "DELETE Customer"; Status = "PASS"}
        }
        
        # Test 7: Verify customer is deleted (should not be found)
        Write-Host ""
        Write-Host "[TEST 7] GET /api/v1/customers/$createdCustomerId - Verify deletion" -ForegroundColor Yellow
        try {
            $response = Invoke-RestMethod -Uri "$baseUrl/$createdCustomerId" -Method GET
            Write-Host "[FAILED] Customer still exists after deletion" -ForegroundColor Red
            $testResults += @{Test = "Verify Deletion"; Status = "FAIL"}
        } catch {
            if ($_.Exception.Response.StatusCode -eq 404) {
                Write-Host "[SUCCESS] Customer not found (correctly deleted)" -ForegroundColor Green
                $testResults += @{Test = "Verify Deletion"; Status = "PASS"}
            } else {
                Write-Host "[FAILED] Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
                $testResults += @{Test = "Verify Deletion"; Status = "FAIL"}
            }
        }
    }
} catch {
    Write-Host "[FAILED] $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test = "POST Create Customer"; Status = "FAIL"}
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $testResults.Count

foreach ($result in $testResults) {
    $color = if ($result.Status -eq "PASS") { "Green" } else { "Red" }
    Write-Host "$($result.Status): $($result.Test)" -ForegroundColor $color
}

Write-Host ""
Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host ""
    Write-Host "ALL TESTS PASSED! Backend integration is working perfectly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend Access:" -ForegroundColor Cyan
    Write-Host "  Visit http://localhost:3000/dashboard/customers to view the Customer Management UI" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Some tests failed. Please check the errors above." -ForegroundColor Yellow
}
