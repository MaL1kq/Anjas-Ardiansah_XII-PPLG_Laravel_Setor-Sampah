param($file = "test_simple.docx")
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $fullPath = (Resolve-Path $file).Path
    Write-Host "Trying to open: $fullPath"
    $doc = $word.Documents.Open($fullPath)
    Write-Host "Success! Opened $file"
    $doc.Close()
} catch {
    Write-Host "Error: $_"
} finally {
    $word.Quit()
}
