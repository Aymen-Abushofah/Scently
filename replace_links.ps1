$dataFiles = Get-ChildItem -Path . -Filter *.html | Where-Object { 
    @("index.html", "fragrances.html", "dupes.html", "form.html", "sign-up.html", "Best-Dupes.html", "Top-Rated.html", "Trending.html") -notcontains $_.Name -and $_.Name -ne "fragrance.html" 
}

$filesToUpdate = @(
    "fragrances.html", "dupes.html", "Top-Rated.html", "Trending.html", "Best-Dupes.html", "js\search.js"
)

foreach ($target in $filesToUpdate) {
    if (Test-Path $target) {
        $content = Get-Content $target -Raw -Encoding UTF8
        
        foreach ($f in $dataFiles) {
            $oldName = $f.Name
            $baseName = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
            $id = ($baseName -replace "\s+","-").ToLower()
            $newUrl = "fragrance.html?id=$id"
            
            # Replace in HTML hrefs and onclicks, also replace in search.js url properties
            $content = $content -replace [regex]::Escape($oldName), $newUrl
        }
        
        $content | Out-File -FilePath $target -Encoding utf8
    }
}
