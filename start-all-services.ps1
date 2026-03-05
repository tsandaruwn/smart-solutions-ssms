# ============================================
# Start All 10 SSMS Microservices
# ============================================
# Each service opens in its own terminal window.
# Close all with: Get-Process java | Stop-Process -Force

$root = "E:\smart-solutions-ssms\ssms"

$services = @(
    # Batch 1 - Independent services
    @{ Name = "User Management";        Port = 8080; Dir = "user-management" }
    @{ Name = "Product Management";     Port = 8082; Dir = "product-management" }
    @{ Name = "Inventory Management";   Port = 8083; Dir = "inventory-management" }
    @{ Name = "Order Management";       Port = 8084; Dir = "order-management" }
    @{ Name = "Payment Management";     Port = 8086; Dir = "payment-management" }
    @{ Name = "Digital Marketing";      Port = 8087; Dir = "digital-marketing" }
    @{ Name = "Supplier Management";    Port = 8088; Dir = "supplier-management" }
    @{ Name = "Installation Management";Port = 8089; Dir = "installation-management" }
    # Batch 2 - Dependent services (started last)
    @{ Name = "Customer Service";       Port = 8081; Dir = "customer-service" }
    @{ Name = "Billing & Invoice";      Port = 8085; Dir = "billing-and-invoice" }
)

Write-Host "Starting all 10 SSMS services..." -ForegroundColor Cyan
Write-Host ""

foreach ($svc in $services) {
    $path = Join-Path $root $svc.Dir
    $title = "$($svc.Name) (:$($svc.Port))"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$path'; `$host.UI.RawUI.WindowTitle = '$title'; Write-Host 'Starting $title...' -ForegroundColor Green; ./mvnw spring-boot:run"
    Write-Host "  Started: $title" -ForegroundColor Green
    # Small delay between launches to avoid port conflicts
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "All 10 services launched!" -ForegroundColor Cyan
Write-Host "Wait ~30-60 seconds for all services to be ready." -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop all: Get-Process java | Stop-Process -Force" -ForegroundColor Red
