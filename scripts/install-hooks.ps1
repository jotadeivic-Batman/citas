$ErrorActionPreference = 'Stop'
$workspaceRoot = Split-Path -Parent $PSScriptRoot
$hookDirectory = Join-Path $workspaceRoot '.githooks'

foreach ($repository in 'citas-api', 'citas-web') {
    $repositoryPath = Join-Path $workspaceRoot $repository
    if (-not (Test-Path (Join-Path $repositoryPath '.git'))) {
        throw "No se encontró el repositorio $repositoryPath"
    }

    git -C $repositoryPath config --local core.hooksPath $hookDirectory
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo instalar el hook en $repository"
    }
    Write-Host "Hook local configurado para $repository."
}

Write-Host 'El hook revisa secretos staged y ejecuta las verificaciones del repositorio.'
Write-Host 'Autoprueba del escáner: node scripts/check-staged-secrets.mjs --self-test'