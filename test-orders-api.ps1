
$BASE = "http://localhost:8085/api/orders"
$pass = 0; $fail = 0
function Test-Case($name, $condition) {
  if ($condition) { Write-Host "  [PASS] $name" -ForegroundColor Green; $script:pass++ }
  else            { Write-Host "  [FAIL] $name" -ForegroundColor Red;   $script:fail++ }
}

Write-Host "`n===== ORDER MANAGEMENT API TEST SUITE =====" -ForegroundColor Cyan

# 1. Health Check
Write-Host "`n[1] Health Check" -ForegroundColor Yellow
$h = Invoke-RestMethod -Uri "$BASE/health" -Method GET -ErrorAction Stop
Test-Case "status == UP"      ($h.status -eq "UP")
Test-Case "service name set"  ($h.service -ne $null)

# 2. GET All Orders
Write-Host "`n[2] GET All Orders" -ForegroundColor Yellow
$all = Invoke-RestMethod -Uri "$BASE" -Method GET -ErrorAction Stop
Test-Case "returns a list" ($all -ne $null)
Write-Host "     Orders in DB: $($all.Count)"

# 3. POST Create Order
Write-Host "`n[3] POST Create Order" -ForegroundColor Yellow
$body = @{
  customerId      = 101
  createdByUserId = 5
  shippingAddress = "123 Main Street, Apt 4B"
  shippingCity    = "Colombo"
  notes           = "Test order created by automated test"
  items = @(
    @{ productId = 201; quantity = 2; unitPriceAtOrder = 1500.00; discountPercent = 10 },
    @{ productId = 202; quantity = 1; unitPriceAtOrder = 3000.00; discountPercent = 0  }
  )
} | ConvertTo-Json -Depth 5

$created = Invoke-RestMethod -Uri "$BASE" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
Test-Case "success == true"             ($created.success -eq $true)
Test-Case "orderNumber returned"        ($created.orderNumber -ne $null)
Test-Case "order.status == PENDING"     ($created.order.status -eq "PENDING")
Test-Case "order.customerId == 101"     ($created.order.customerId -eq 101)
Test-Case "order.items.Count == 2"      ($created.order.items.Count -eq 2)
Test-Case "totalAmount > 0"             ($created.order.totalAmount -gt 0)

$orderId     = $created.order.orderId
$orderNumber = $created.order.orderNumber
Write-Host "     Created: orderId=$orderId  orderNumber=$orderNumber  totalAmount=$($created.order.totalAmount)"

# 4. GET by ID
Write-Host "`n[4] GET Order by ID" -ForegroundColor Yellow
$byId = Invoke-RestMethod -Uri "$BASE/$orderId" -Method GET -ErrorAction Stop
Test-Case "orderId matches"     ($byId.orderId -eq $orderId)
Test-Case "orderNumber matches" ($byId.orderNumber -eq $orderNumber)
Test-Case "items present"       ($byId.items.Count -eq 2)
Test-Case "shippingCity = Colombo" ($byId.shippingCity -eq "Colombo")

# 5. GET by order number
Write-Host "`n[5] GET Order by orderNumber" -ForegroundColor Yellow
$byNum = Invoke-RestMethod -Uri "$BASE/number/$orderNumber" -Method GET -ErrorAction Stop
Test-Case "orderId matches"     ($byNum.orderId -eq $orderId)

# 6. GET customer history
Write-Host "`n[6] GET Order History (customerId=101)" -ForegroundColor Yellow
$hist = Invoke-RestMethod -Uri "$BASE/customer/101/history" -Method GET -ErrorAction Stop
Test-Case "returns a list"             ($hist -ne $null)
Test-Case "contains the new order"     (@($hist | Where-Object { [string]$_.orderId -eq [string]$orderId }).Count -gt 0)

# 7. GET by status PENDING
Write-Host "`n[7] GET Orders by Status=PENDING" -ForegroundColor Yellow
$byStatus = Invoke-RestMethod -Uri "$BASE/status/PENDING" -Method GET -ErrorAction Stop
Test-Case "returns a list"             ($byStatus -ne $null)
Test-Case "new order in PENDING list"  (@($byStatus | Where-Object { [string]$_.orderId -eq [string]$orderId }).Count -gt 0)

# 8. GET recent orders
Write-Host "`n[8] GET Recent Orders" -ForegroundColor Yellow
$recent = Invoke-RestMethod -Uri "$BASE/recent" -Method GET -ErrorAction Stop
Test-Case "recent returns a list"    ($recent -ne $null)
Test-Case "new order in recent list" (@($recent | Where-Object { [string]$_.orderId -eq [string]$orderId }).Count -gt 0)

# 9. PUT status PENDING -> SHIPPED
Write-Host "`n[9] PUT Update Status PENDING -> SHIPPED" -ForegroundColor Yellow
$upd1 = Invoke-RestMethod -Uri "$BASE/$orderId/status" -Method PUT `
  -Body '{"status":"SHIPPED"}' -ContentType "application/json" -ErrorAction Stop
Test-Case "success == true"         ($upd1.success -eq $true)
Test-Case "status == SHIPPED"       ($upd1.order.status -eq "SHIPPED")

# 10. PUT status SHIPPED -> DELIVERED
Write-Host "`n[10] PUT Update Status SHIPPED -> DELIVERED" -ForegroundColor Yellow
$upd2 = Invoke-RestMethod -Uri "$BASE/$orderId/status" -Method PUT `
  -Body '{"status":"DELIVERED"}' -ContentType "application/json" -ErrorAction Stop
Test-Case "success == true"           ($upd2.success -eq $true)
Test-Case "status == DELIVERED"       ($upd2.order.status -eq "DELIVERED")

# 11. Confirm delivered order appears in DELIVERED filter
Write-Host "`n[11] GET Orders by Status=DELIVERED" -ForegroundColor Yellow
$delivered = Invoke-RestMethod -Uri "$BASE/status/DELIVERED" -Method GET -ErrorAction Stop
Test-Case "order now in DELIVERED list" (@($delivered | Where-Object { [string]$_.orderId -eq [string]$orderId }).Count -gt 0)

# 12. POST Cancel (create fresh order first)
Write-Host "`n[12] POST Cancel Order" -ForegroundColor Yellow
$c2 = Invoke-RestMethod -Uri "$BASE" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
$cancelId = $c2.order.orderId
$cancelBody = '{"cancellationReason":"Cancelled during automated test"}'
$cancel = Invoke-RestMethod -Uri "$BASE/$cancelId/cancel" -Method POST `
  -Body $cancelBody -ContentType "application/json" -ErrorAction Stop
Test-Case "cancel success == true"          ($cancel.success -eq $true)
Test-Case "status == CANCELLED"             ($cancel.order.status -eq "CANCELLED")
Test-Case "cancellationReason captured"     ($cancel.order.cancellationReason -eq "Cancelled during automated test")
Test-Case "cancelledAt is set"              ($cancel.order.cancelledAt -ne $null)

# 13. DELETE Order
Write-Host "`n[13] DELETE Order" -ForegroundColor Yellow
$del = Invoke-RestMethod -Uri "$BASE/$cancelId" -Method DELETE -ErrorAction Stop
Test-Case "delete success == true" ($del.success -eq $true)

try {
  Invoke-RestMethod -Uri "$BASE/$cancelId" -Method GET -ErrorAction Stop
  Test-Case "deleted order returns 404" $false
} catch {
  Test-Case "deleted order returns 404" ($_.Exception.Response.StatusCode.value__ -eq 404)
}

# 14. Frontend proxy via Next.js rewrite
Write-Host "`n[14] Frontend Proxy Rewrite (localhost:3000 -> :8085)" -ForegroundColor Yellow
$proxy = Invoke-RestMethod -Uri "http://localhost:3000/api/orders/health" -Method GET -ErrorAction Stop
Test-Case "proxy health status == UP"   ($proxy.status -eq "UP")
$proxyAll = Invoke-RestMethod -Uri "http://localhost:3000/api/orders" -Method GET -ErrorAction Stop
Test-Case "proxy GET /api/orders works" ($proxyAll -ne $null)

# 15. Validation errors
Write-Host "`n[15] Validation Error (missing required fields)" -ForegroundColor Yellow
try {
  Invoke-RestMethod -Uri "$BASE" -Method POST -Body '{}' -ContentType "application/json" -ErrorAction Stop
  Test-Case "400 for empty POST body" $false
} catch {
  Test-Case "400 for empty POST body" ($_.Exception.Response.StatusCode.value__ -eq 400)
}

try {
  Invoke-RestMethod -Uri "$BASE/999999" -Method GET -ErrorAction Stop
  Test-Case "404 for non-existent order" $false
} catch {
  Test-Case "404 for non-existent order" ($_.Exception.Response.StatusCode.value__ -eq 404)
}

# Summary
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "  TOTAL Tests: $($pass + $fail)"
Write-Host "  Passed:      $pass" -ForegroundColor Green
Write-Host "  Failed:      $fail" -ForegroundColor Red
Write-Host "=========================================" -ForegroundColor Cyan
