$ErrorActionPreference = 'Stop'

$version = 'v24.21.0'
$folder = "node-$version-win-x64"
$archiveName = "$folder.zip"
$expectedHash = '158f7685b44de51f6c0df1d153526cbcd3e1bc739a8dfc607721cef75de9e541'
$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeRoot = Join-Path $projectRoot '.portable-node'
$runtimeFolder = Join-Path $runtimeRoot $folder
$nodeExe = Join-Path $runtimeFolder 'node.exe'
$npmCmd = Join-Path $runtimeFolder 'npm.cmd'
$archivePath = Join-Path $runtimeRoot $archiveName

if ((Test-Path -LiteralPath $nodeExe) -and (Test-Path -LiteralPath $npmCmd)) {
  Write-Host 'Portable Laufzeit ist bereits vorhanden.'
  exit 0
}

try {
  if (-not [Environment]::Is64BitOperatingSystem) {
    throw 'Diese lokale Demo benoetigt 64-Bit-Windows.'
  }
  New-Item -ItemType Directory -Path $runtimeRoot -Force | Out-Null
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  $url = "https://nodejs.org/dist/$version/$archiveName"
  Write-Host "Lade Node.js $version von nodejs.org herunter (etwa 38 MB) ..."
  Invoke-WebRequest -Uri $url -OutFile $archivePath -UseBasicParsing -TimeoutSec 300
  $actualHash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash
  if ($actualHash -ine $expectedHash) {
    throw 'Die Pruefsumme des Downloads stimmt nicht. Die Datei wird nicht ausgefuehrt.'
  }
  Write-Host 'Pruefsumme OK. Entpacke die portable Laufzeit ...'
  Expand-Archive -LiteralPath $archivePath -DestinationPath $runtimeRoot -Force
  if (-not ((Test-Path -LiteralPath $nodeExe) -and (Test-Path -LiteralPath $npmCmd))) {
    throw 'Die portable Laufzeit wurde nicht vollstaendig entpackt.'
  }
  Write-Host 'Portable Laufzeit bereit. Es wurde nichts systemweit installiert.'
  exit 0
} catch {
  Write-Error $_
  exit 1
} finally {
  Remove-Item -LiteralPath $archivePath -Force -ErrorAction SilentlyContinue
}
