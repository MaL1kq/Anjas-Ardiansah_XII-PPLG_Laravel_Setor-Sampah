$wdFormatPDF = 17
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $docxPath = (Resolve-Path "Dokumentasi_Web_Setor_Sampah.docx").Path
    $pdfPath = [System.IO.Path]::ChangeExtension($docxPath, ".pdf")
    Write-Host "Opening: $docxPath"
    $doc = $word.Documents.Open($docxPath)
    Write-Host "Saving to: $pdfPath"
    $doc.SaveAs([ref]$pdfPath, [ref]$wdFormatPDF)
    $doc.Close()
    Write-Host "SUCCESS: PDF created at $pdfPath"
} catch {
    Write-Error $_
} finally {
    $word.Quit()
}
