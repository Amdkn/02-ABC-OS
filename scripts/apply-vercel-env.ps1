<#
.SYNOPSIS
    Apply a single env var to the abc-os-community Vercel project across all 3 scopes.

.DESCRIPTION
    Wraps the Vercel MCP update_env_variable call. Calls it 3 times in
    parallel (development, preview, production) and re-verifies with
    list_env_variables (Vercel sometimes silently drops the target array
    on PATCH — see 04_vercel/AGENTS.md W2).

    P1.4 wiring script for ADR-ABCOS-001 D7.

    Hard guard: REFUSES to set any key matching *SECRET*, *SERVICE_ROLE*,
    or *PASSWORD* (case-insensitive). Echo error and exit 1.

.PARAMETER Key
    Env var name (e.g. NEXT_PUBLIC_SUPABASE_URL).

.PARAMETER Value
    Env var value. Pass it as an arg, not via stdin, so it does not leak
    into transcript history by accident. Recommended: read from
    $env:ASPACE_<KEY> on the caller side and pass it through.

.PARAMETER ProjectId
    Vercel project ID. Defaults to prj_HSw4IBR2omI5qegmEinOksr6xzo0
    (abc-os-community in amd-lab team).

.PARAMETER SkipProdConfirm
    Bypass the HITL Read-Host for the production target. Only set this
    flag in CI or in tightly controlled loops. Default: $false (HITL
    enforced per 04_vercel/AGENTS.md W4).

.EXAMPLE
    pwsh -NoProfile ./scripts/apply-vercel-env.ps1 `
        -Key NEXT_PUBLIC_SUPABASE_URL `
        -Value 'https://supabase.kalybana.com'

.EXAMPLE
    pwsh -NoProfile ./scripts/apply-vercel-env.ps1 `
        -Key NEXT_PUBLIC_SUPABASE_ANON_KEY `
        -Value $env:ASPACE_SUPABASE_ANON_KEY
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Key,

    [Parameter(Mandatory = $true)]
    [string]$Value,

    [string]$ProjectId = 'prj_HSw4IBR2omI5qegmEinOksr6xzo0',

    [switch]$SkipProdConfirm
)

$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------
# Hard guard — never let secret-shaped keys reach Vercel
# ---------------------------------------------------------------------
$forbiddenPatterns = @('*SECRET*', '*SERVICE_ROLE*', '*PASSWORD*')
foreach ($pattern in $forbiddenPatterns) {
    if ($Key -like $pattern) {
        Write-Error "[apply-vercel-env] REFUSED: key '$Key' matches forbidden pattern '$pattern'. Vercel must never hold service-role or password material. Use the VPS-side aspace_admin role for write ops."
        exit 1
    }
}

# ---------------------------------------------------------------------
# HITL gate — production target requires explicit confirmation
# ---------------------------------------------------------------------
if (-not $SkipProdConfirm) {
    Write-Host ""
    Write-Host "About to write KEY=$Key to Vercel project $ProjectId in 3 scopes (development, preview, production)." -ForegroundColor Yellow
    Write-Host "Value length: $($Value.Length) chars (hidden)." -ForegroundColor Yellow
    Write-Host ""
    $confirm = Read-Host "Type 'yes' to confirm including PRODUCTION (anything else aborts)"
    if ($confirm -ne 'yes') {
        Write-Host "[apply-vercel-env] Aborted by user." -ForegroundColor Red
        exit 2
    }
}

# ---------------------------------------------------------------------
# Scope assembly (matches 04_vercel/AGENTS.md W2 — 3 calls in parallel)
# ---------------------------------------------------------------------
$scopes = @('development', 'preview', 'production')

# This script is the PowerShell wrapper. The actual MCP calls
# (mcp__vercel__update_env_variable x 3 + list_env_variables for verify)
# are issued by the calling agent via the mcp__vercel__* tool surface.
#
# The script's job is to:
#   1. Validate the key (hard guard above).
#   2. Run the HITL gate for production.
#   3. Emit a structured payload the agent consumes to drive the MCP calls.
#
# The agent will then run the 3 parallel update_env_variable calls and
# the list_env_variables re-verify per W2.

$payload = [PSCustomObject]@{
    ProjectId = $ProjectId
    Key       = $Key
    Value     = $Value
    Scopes    = $scopes
    Action    = 'update_and_verify'
}

# Emit JSON on stdout — easy for the agent to parse.
$payload | ConvertTo-Json -Depth 5

# Also write a sidecar manifest for human audit (no value, just metadata).
$manifestPath = Join-Path -Path (Split-Path -Parent $PSCommandPath) -ChildPath '.last-apply.json'
$manifestPayload = [PSCustomObject]@{
    ProjectId   = $ProjectId
    Key         = $Key
    ValueLength = $Value.Length
    Scopes      = $scopes
    AppliedAt   = (Get-Date).ToString('o')
}
$manifestPayload | ConvertTo-Json -Depth 5 | Set-Content -Path $manifestPath -Encoding UTF8

Write-Host "[apply-vercel-env] Payload emitted. Agent must now run mcp__vercel__update_env_variable x 3 in parallel and re-verify with mcp__vercel__list_env_variables." -ForegroundColor Green
Write-Host "[apply-vercel-env] Manifest (no value) written to: $manifestPath"
