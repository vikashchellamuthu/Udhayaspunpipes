Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param (
        [string]$SourcePath,
        [string]$DestPath,
        [int]$MaxWidth,
        [int]$MaxHeight,
        [int]$Quality = 82
    )

    if (-not (Test-Path $SourcePath)) {
        Write-Error "Source file not found: $SourcePath"
        return
    }

    $destDir = Split-Path $DestPath
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }

    $sourceBytes = [System.IO.File]::ReadAllBytes($SourcePath)
    $ms = New-Object System.IO.MemoryStream($sourceBytes, 0, $sourceBytes.Length)
    $origImage = [System.Drawing.Image]::FromStream($ms)

    $origWidth = $origImage.Width
    $origHeight = $origImage.Height

    $ratioX = $MaxWidth / $origWidth
    $ratioY = $MaxHeight / $origHeight
    $ratio = [Math]::Min($ratioX, $ratioY)
    if ($ratio -gt 1.0) { $ratio = 1.0 }

    $newWidth = [int][Math]::Round($origWidth * $ratio)
    $newHeight = [int][Math]::Round($origHeight * $ratio)

    $destBitmap = New-Object System.Drawing.Bitmap($newWidth, $newHeight, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)

    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $graphics.DrawImage($origImage, 0, 0, $newWidth, $newHeight)

    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)

    $tempFile = [System.IO.Path]::GetTempFileName()
    $destBitmap.Save($tempFile, $jpegCodec, $encoderParams)

    $graphics.Dispose()
    $destBitmap.Dispose()
    $origImage.Dispose()
    $ms.Dispose()

    Move-Item -Path $tempFile -Destination $DestPath -Force

    $destSize = (Get-Item $DestPath).Length
    Write-Host "Processed: $(Split-Path -Leaf $DestPath) -> ${newWidth}x${newHeight} ($([Math]::Round($destSize/1024)) KB)"
}

$srcDir = "c:\Users\user\Pictures\pipes images"
$targetBase = "c:\Users\user\OneDrive\Documents\antigravity\udhaya-spun-pipes\assets\images"

$taskList = @(
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 13.46.48.jpeg"; Dest = "$targetBase\hero.jpg"; MaxW = 1440; MaxH = 1080; Quality = 82 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 14.23.34 (1).jpeg"; Dest = "$targetBase\about.jpg"; MaxW = 1080; MaxH = 810; Quality = 82 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 13.54.43.jpeg"; Dest = "$targetBase\products\np2-pipes.jpg"; MaxW = 1000; MaxH = 750; Quality = 82 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 14.24.00 (2).jpeg"; Dest = "$targetBase\products\np3-pipes.jpg"; MaxW = 1000; MaxH = 750; Quality = 82 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 13.48.34 (2).jpeg"; Dest = "$targetBase\products\np4-pipes.jpg"; MaxW = 1000; MaxH = 750; Quality = 82 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 14.23.50 (1).jpeg"; Dest = "$targetBase\manufacturing\stage3-moulding.jpg"; MaxW = 800; MaxH = 600; Quality = 80 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 14.23.31.jpeg"; Dest = "$targetBase\manufacturing\stage4-curing.jpg"; MaxW = 800; MaxH = 600; Quality = 80 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 14.23.41.jpeg"; Dest = "$targetBase\manufacturing\stage5-inspection.jpg"; MaxW = 800; MaxH = 600; Quality = 80 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 14.23.57.jpeg"; Dest = "$targetBase\manufacturing\stage6-dispatch.jpg"; MaxW = 800; MaxH = 600; Quality = 80 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 14.23.35.jpeg"; Dest = "$targetBase\gallery\gallery-1.jpg"; MaxW = 1280; MaxH = 960; Quality = 82 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 13.48.31.jpeg"; Dest = "$targetBase\gallery\gallery-2.jpg"; MaxW = 1200; MaxH = 1200; Quality = 82 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 13.55.27.jpeg"; Dest = "$targetBase\gallery\gallery-3.jpg"; MaxW = 1080; MaxH = 1440; Quality = 82 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 14.23.46.jpeg"; Dest = "$targetBase\gallery\gallery-4.jpg"; MaxW = 1280; MaxH = 960; Quality = 82 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 13.46.47.jpeg"; Dest = "$targetBase\gallery\gallery-5.jpg"; MaxW = 1080; MaxH = 1440; Quality = 82 },
    @{ Src = "$srcDir\WhatsApp Image 2026-11-01 at 13.48.32.jpeg"; Dest = "$targetBase\gallery\gallery-6.jpg"; MaxW = 1200; MaxH = 1200; Quality = 82 }
)

Write-Host "Starting batch image optimization..."
foreach ($task in $taskList) {
    Optimize-Image -SourcePath $task.Src -DestPath $task.Dest -MaxWidth $task.MaxW -MaxHeight $task.MaxH -Quality $task.Quality
}
Write-Host "All images successfully processed!"
