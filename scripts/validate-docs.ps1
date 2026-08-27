[CmdletBinding()]
param(
    [string]$RepositoryRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath $RepositoryRoot).Path
$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

$excludedDirectories = '[\\/](\.git|node_modules|dist|dist-github-pages|\.next|\.wrangler)[\\/]'
$markdownFiles = Get-ChildItem -LiteralPath $root -Recurse -File -Filter '*.md' |
    Where-Object { $_.FullName -notmatch $excludedDirectories }

if ($markdownFiles.Count -eq 0) {
    throw 'No Markdown files found.'
}

# Reject invisible control characters that can corrupt LaTeX commands (for
# example, a backspace produced by an incorrectly escaped `\beta`). Tabs and
# normal line endings remain valid.
$invalidControlPattern = [regex]'[\x00-\x08\x0B\x0C\x0E-\x1F]'
foreach ($file in $markdownFiles) {
    $content = Get-Content -Raw -LiteralPath $file.FullName
    foreach ($match in $invalidControlPattern.Matches($content)) {
        $lineNumber = 1 + ([regex]::Matches($content.Substring(0, $match.Index), "`n")).Count
        $relativeFile = [System.IO.Path]::GetRelativePath($root, $file.FullName)
        $codePoint = [int][char]$match.Value[0]
        $errors.Add("Invalid control character U+$($codePoint.ToString('X4')) in ${relativeFile}:${lineNumber}")
    }
}

# Validate relative Markdown links. External URLs and same-page anchors are
# outside this local check.
$linkPattern = [regex]'\[[^\]]+\]\((?<target>[^)]+)\)'
foreach ($file in $markdownFiles) {
    $content = Get-Content -Raw -LiteralPath $file.FullName
    foreach ($match in $linkPattern.Matches($content)) {
        $target = $match.Groups['target'].Value.Trim()
        if ($target -match '^(https?://|mailto:|#)') { continue }

        # Remove an optional quoted title and fragment.
        $target = ($target -split '\s+"', 2)[0]
        $pathPart = ($target -split '#', 2)[0]
        if ([string]::IsNullOrWhiteSpace($pathPart)) { continue }

        $decoded = [System.Uri]::UnescapeDataString($pathPart)
        if ($decoded.StartsWith('/')) {
            $candidate = Join-Path $root $decoded.TrimStart('/')
        } else {
            $candidate = Join-Path $file.DirectoryName $decoded
        }

        if (-not (Test-Path -LiteralPath $candidate)) {
            $relativeFile = [System.IO.Path]::GetRelativePath($root, $file.FullName)
            $errors.Add("Broken link in ${relativeFile}: ${target}")
        }
    }
}

# Validate stable claim IDs used by canonical material.
$claimsPath = Join-Path $root 'research/claims.md'
if (-not (Test-Path -LiteralPath $claimsPath)) {
    $errors.Add('Missing research/claims.md')
} else {
    $claimsText = Get-Content -Raw -LiteralPath $claimsPath
    $definedClaims = [System.Collections.Generic.HashSet[string]]::new()
    $previousClaimNumber = $null
    foreach ($match in [regex]::Matches($claimsText, '(?m)^### (C-\d{3,4})\s*$')) {
        $claimId = $match.Groups[1].Value
        $claimNumber = [int]$claimId.Substring(2)
        if (-not $definedClaims.Add($claimId)) {
            $errors.Add("Duplicate claim definition in research/claims.md: ${claimId}")
        }
        if ($null -ne $previousClaimNumber -and $claimNumber -le $previousClaimNumber) {
            $errors.Add("Claim definitions are out of numeric order in research/claims.md: ${claimId} follows C-$($previousClaimNumber.ToString('000'))")
        }
        $previousClaimNumber = $claimNumber
    }

    $canonicalFiles = $markdownFiles | Where-Object {
        $_.FullName -notmatch '[\\/]sources[\\/]'
    }
    foreach ($file in $canonicalFiles) {
        $content = Get-Content -Raw -LiteralPath $file.FullName
        foreach ($match in [regex]::Matches($content, '\bC-\d{3,4}\b')) {
            if (-not $definedClaims.Contains($match.Value)) {
                $relativeFile = [System.IO.Path]::GetRelativePath($root, $file.FullName)
                $errors.Add("Undefined claim $($match.Value) in ${relativeFile}")
            }
        }

        foreach ($match in [regex]::Matches($content, 'claims\.md#(?<anchor>c-\d{3,4})', 'IgnoreCase')) {
            $anchorClaim = $match.Groups['anchor'].Value.ToUpperInvariant()
            if (-not $definedClaims.Contains($anchorClaim)) {
                $relativeFile = [System.IO.Path]::GetRelativePath($root, $file.FullName)
                $errors.Add("Undefined claim anchor $($match.Groups['anchor'].Value) in ${relativeFile}")
            }
        }

        foreach ($match in [regex]::Matches($content, '\[(?<label>C-\d{3,4})\]\([^)]*claims\.md#(?<anchor>c-\d{3,4})\)', 'IgnoreCase')) {
            if ($match.Groups['label'].Value.ToLowerInvariant() -ne $match.Groups['anchor'].Value.ToLowerInvariant()) {
                $relativeFile = [System.IO.Path]::GetRelativePath($root, $file.FullName)
                $errors.Add("Claim link label/anchor mismatch in ${relativeFile}: $($match.Value)")
            }
        }
    }

    if ($definedClaims.Count -lt 1) {
        $errors.Add('No claim definitions found in research/claims.md')
    }
}

# Validate stable principle IDs and ensure every canonical use resolves to the
# deduplicated registry.
$principlesPath = Join-Path $root 'research/principle-registry.md'
if (-not (Test-Path -LiteralPath $principlesPath)) {
    $errors.Add('Missing research/principle-registry.md')
} else {
    $principlesText = Get-Content -Raw -LiteralPath $principlesPath
    $definedPrinciples = [System.Collections.Generic.HashSet[string]]::new()
    foreach ($match in [regex]::Matches($principlesText, '(?m)^## (P-\d{3})\b')) {
        [void]$definedPrinciples.Add($match.Groups[1].Value)
    }

    $canonicalFiles = $markdownFiles | Where-Object {
        $_.FullName -notmatch '[\\/]sources[\\/]'
    }
    foreach ($file in $canonicalFiles) {
        $content = Get-Content -Raw -LiteralPath $file.FullName
        foreach ($match in [regex]::Matches($content, '\bP-\d{3}\b')) {
            if (-not $definedPrinciples.Contains($match.Value)) {
                $relativeFile = [System.IO.Path]::GetRelativePath($root, $file.FullName)
                $errors.Add("Undefined principle $($match.Value) in ${relativeFile}")
            }
        }
    }

    if ($definedPrinciples.Count -lt 1) {
        $errors.Add('No principle definitions found in research/principle-registry.md')
    }
}

# Validate that each canonical chapter follows the agreed chapter contract.
$requiredSections = @(
    '## Scope',
    '## Biological observation',
    '## Proposed AI translation',
    '## Efficiency mechanism',
    '## Evidence status',
    '## Speculative extensions',
    '## Failure modes',
    '## Measurable predictions'
)
$chapters = Get-ChildItem -LiteralPath (Join-Path $root 'concept') -File -Filter '*.md' |
    Where-Object { $_.Name -match '^\d{2}-' }
foreach ($chapter in $chapters) {
    $content = Get-Content -Raw -LiteralPath $chapter.FullName
    foreach ($section in $requiredSections) {
        if (-not $content.Contains($section)) {
            $errors.Add("Missing '${section}' in concept/$($chapter.Name)")
        }
    }
}

# Validate bibliography keys referenced in the claim ledger.
$bibPath = Join-Path $root 'research/references.bib'
if (-not (Test-Path -LiteralPath $bibPath)) {
    $errors.Add('Missing research/references.bib')
} elseif (Test-Path -LiteralPath $claimsPath) {
    $bibText = Get-Content -Raw -LiteralPath $bibPath
    $bibKeys = [System.Collections.Generic.HashSet[string]]::new()
    foreach ($match in [regex]::Matches($bibText, '(?m)^@\w+\{([^,]+),')) {
        $bibKey = $match.Groups[1].Value
        if (-not $bibKeys.Add($bibKey)) {
            $errors.Add("Duplicate bibliography key in research/references.bib: ${bibKey}")
        }
    }

    $claimsText = Get-Content -Raw -LiteralPath $claimsPath
    $primarySourcePattern = [regex]'(?ms)^- \*\*Primary(?:/authoritative)? sources?:\*\*\s*(?<value>.*?)(?=^- \*\*|\z)'
    foreach ($sourceField in $primarySourcePattern.Matches($claimsText)) {
        foreach ($match in [regex]::Matches($sourceField.Groups['value'].Value, '`([^`]+)`')) {
            $key = $match.Groups[1].Value
            if (-not $bibKeys.Contains($key)) {
                $errors.Add("Claim ledger references missing bibliography key: ${key}")
            }
        }
    }
}

# Guard against the strongest unsupported phrases from the imported draft
# reappearing in canonical prose.
$bannedPhrases = @(
    'eradicates hallucinations',
    'eradicating pure-text hallucinations',
    'zero-energy physical reflex',
    '95% to 98%',
    'upwards of 70%'
)
$canonicalText = ($markdownFiles | Where-Object {
    $_.FullName -notmatch '[\\/]sources[\\/]'
} | ForEach-Object { Get-Content -Raw -LiteralPath $_.FullName }) -join "`n"
foreach ($phrase in $bannedPhrases) {
    if ($canonicalText.Contains($phrase, [System.StringComparison]::OrdinalIgnoreCase)) {
        $errors.Add("Unsupported inherited phrase found in canonical material: '${phrase}'")
    }
}

# Mermaid sources must begin with a supported graph declaration and contain at
# least one edge. Rendering remains GitHub's responsibility.
$mermaidFiles = Get-ChildItem -LiteralPath (Join-Path $root 'assets/diagrams') -File -Filter '*.mmd'
foreach ($diagram in $mermaidFiles) {
    $content = Get-Content -Raw -LiteralPath $diagram.FullName
    if ($content -notmatch '^\s*(flowchart|graph|sequenceDiagram|stateDiagram)\b') {
        $errors.Add("Unrecognized Mermaid declaration in assets/diagrams/$($diagram.Name)")
    }
    if ($content -notmatch '(-->|---|==>)') {
        $warnings.Add("No edge found in assets/diagrams/$($diagram.Name)")
    }
}

foreach ($warning in $warnings) {
    Write-Warning $warning
}

if ($errors.Count -gt 0) {
    Write-Host "Documentation validation failed with $($errors.Count) error(s):" -ForegroundColor Red
    foreach ($validationError in $errors) {
        Write-Host " - $validationError" -ForegroundColor Red
    }
    exit 1
}

Write-Host "Documentation validation passed: $($markdownFiles.Count) Markdown files, $($chapters.Count) chapters, $($mermaidFiles.Count) Mermaid sources." -ForegroundColor Green
