$ErrorActionPreference = "Stop"

$excludeFiles = @(
    "index.html", 
    "fragrances.html", 
    "dupes.html", 
    "form.html", 
    "sign-up.html", 
    "Best-Dupes.html", 
    "Top-Rated.html", 
    "Trending.html",
    "fragrance.html"
)

$htmlFiles = Get-ChildItem -Path . -Filter *.html | Where-Object { $excludeFiles -notcontains $_.Name }

$allData = @{}

foreach ($file in $htmlFiles) {
    # File name without extension to use as ID
    $id = [System.IO.Path]::GetFileNameWithoutExtension($file.Name) -replace "\s+","-"
    $id = $id.ToLower()
    
    $html = Get-Content -Path $file.FullName -Raw -Encoding UTF8

    $data = @{}
    $data.Id = $id
    
    # Title and Category
    if ($html -match '<h1>(.*?)</h1>') { $data.Title = $matches[1].Trim() }
    if ($html -match '<span class="fragrance-category">(.*?)</span>') { $data.Category = $matches[1].Trim() }

    # Fragrance Image
    if ($html -match '<div class="fragrance-image-container">\s*<img src="(.*?)"') { $data.Image = $matches[1] }

    # Rating
    if ($html -match '<div class="rating-score">(.*?)</div>') { $data.RatingScore = $matches[1] }
    if ($html -match '<div class="rating-stars">(.*?)</div>') { $data.RatingStars = $matches[1] }
    if ($html -match '<div class="rating-count">\((.*?)\)</div>') { $data.RatingCount = $matches[1] }

    # Brand Logo
    if ($html -match '<div class="brand-logo-container">\s*<img src="(.*?)"') { $data.BrandLogo = $matches[1] }

    # Main Notes
    $data.MainNotes = @()
    $mainNotesRegex = '<div class="note-slider" style="--percentage:\s*(.*?);\s*--color:\s*(.*?);".*?<span class="note-name">(.*?)</span>'
    $mainNotesMatches = [regex]::Matches($html, $mainNotesRegex, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    foreach ($m in $mainNotesMatches) {
        $data.MainNotes += @{
            Percentage = $m.Groups[1].Value
            Color = $m.Groups[2].Value
            Name = $m.Groups[3].Value.Trim()
        }
    }

    # Occasions
    $data.Occasions = @{}
    $occRegex = '<div class="icon-wrapper (high|medium|low)"><img src="icons/(.*?).png".*?<span>(.*?)</span>'
    $occMatches = [regex]::Matches($html, $occRegex, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    foreach ($m in $occMatches) {
        $data.Occasions[$m.Groups[2].Value] = @{
            Level = $m.Groups[1].Value
            Name = $m.Groups[3].Value
        }
    }

    # Performance
    $data.Performance = @()
    $perfRegex = '<div class="circular-progress" style="--value:\s*(.*?);\s*--color:\s*(.*?);"[^>]*>\s*<span class="progress-value">(.*?)</span>\s*</div>\s*<span class="performance-label">(.*?)</span>'
    $perfMatches = [regex]::Matches($html, $perfRegex, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    foreach ($m in $perfMatches) {
        $data.Performance += @{
            Value = $m.Groups[1].Value
            Color = $m.Groups[2].Value
            ProgressText = $m.Groups[3].Value
            Label = $m.Groups[4].Value
        }
    }

    # Description
    if ($html -match '<p class="intro-paragraph">\s*(.*?)\s*</p>') { $data.Description = $matches[1] }

    # Meta Item / Perfumer Details
    $data.Meta = @()
    $metaRegex = '<div class="meta-item">\s*<strong>(.*?)</strong>\s*<span>(.*?)</span>'
    $metaMatches = [regex]::Matches($html, $metaRegex, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    foreach ($m in $metaMatches) {
        $data.Meta += @{
            Label = $m.Groups[1].Value.Replace(":","").Trim()
            Value = $m.Groups[2].Value.Trim()
        }
    }

    # Notes Hierarchy
    $data.NotesHierarchy = @{}
    $groupsRegex = '<div class="notes-group">\s*<h3>(.*?)</h3>(.*?)</div>\s*(?=<div class="notes-group">|</section>)'
    $groupsMatches = [regex]::Matches($html, $groupsRegex, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    foreach ($g in $groupsMatches) {
        $groupName = $g.Groups[1].Value
        $groupHtml = $g.Groups[2].Value
        $notes = @()
        $noteRegex = '<div class="note-image-container">\s*<img src="(.*?)"[^>]*>\s*</div>\s*<span>(.*?)</span>'
        $noteMatches = [regex]::Matches($groupHtml, $noteRegex, [System.Text.RegularExpressions.RegexOptions]::Singleline)
        foreach ($n in $noteMatches) {
            $notes += @{
                Image = $n.Groups[1].Value
                Name = $n.Groups[2].Value.Trim()
            }
        }
        $data.NotesHierarchy[$groupName] = $notes
    }

    # Dupes
    $data.Dupes = @()
    $dupeRegex = '<div class="dupe-card" onclick="window.location.href=''(.*?)''">\s*<div class="dupe-image-container">\s*<img src="(.*?)"[^>]*>\s*</div>\s*<div class="dupe-info">\s*<h4 class="dupe-name">(.*?)</h4>\s*<p class="dupe-brand">(.*?)</p>'
    $dupeMatches = [regex]::Matches($html, $dupeRegex, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    foreach ($d in $dupeMatches) {
        $data.Dupes += @{
            Url = $d.Groups[1].Value
            Image = $d.Groups[2].Value
            Name = $d.Groups[3].Value.Trim()
            Brand = $d.Groups[4].Value.Trim()
        }
    }

    $allData[$id] = $data
}

$jsonOutput = $allData | ConvertTo-Json -Depth 10

# Output to js/fragrances-data.js so it can be loaded directly via script tag
"window.fragrancesData = $jsonOutput;" | Out-File -FilePath "js\fragrances-data.js" -Encoding utf8
