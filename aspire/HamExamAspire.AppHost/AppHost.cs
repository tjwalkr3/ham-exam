using System.IO;
using Aspire.Hosting;
using Aspire.Hosting.ApplicationModel;

var builder = DistributedApplication.CreateBuilder(args);
var repoRoot = Path.GetFullPath(Path.Combine(builder.AppHostDirectory!, "..", ".."));

var serverPath = Path.Combine(repoRoot, "server");
var clientPath = Path.Combine(repoRoot, "client");
var schemaPath = Path.Combine(repoRoot, "database", "schema.sql");
var keycloakImportPath = Path.Combine(repoRoot, "keycloak", "AppRealm.json");
var scratchRoot = Path.Combine(repoRoot, ".containers");
var apiNodeModulesPath = Path.Combine(scratchRoot, "api-node_modules");
var webNodeModulesPath = Path.Combine(scratchRoot, "web-node_modules");
Directory.CreateDirectory(apiNodeModulesPath);
Directory.CreateDirectory(webNodeModulesPath);

const string postgresUser = "appuser";
const string postgresPassword = "apppassword";
const string postgresDatabase = "appdb";
const int postgresPort = 5432;
const string postgresHost = "postgres";
const string keycloakHost = "keycloak";
const int keycloakPort = 8080;
const string keycloakRealm = "AppRealm";

var defaultJwkUri = $"http://{keycloakHost}:{keycloakPort}/realms/{keycloakRealm}/protocol/openid-connect/certs";
var jwkUri = Environment.GetEnvironmentVariable("JWK_URI") ?? defaultJwkUri;
var keycloakAuthority = $"http://localhost:{keycloakPort}/realms/{keycloakRealm}";
var databaseUrl = $"postgres://{postgresUser}:{postgresPassword}@{postgresHost}:{postgresPort}/{postgresDatabase}";

// AI Server configuration
var aiServerUrl = Environment.GetEnvironmentVariable("AI_SERVER");
var aiToken = Environment.GetEnvironmentVariable("AI_TOKEN");

var postgres = builder.AddContainer(postgresHost, "postgres", "18-alpine3.22")
	.WithEnvironment("POSTGRES_USER", postgresUser)
	.WithEnvironment("POSTGRES_PASSWORD", postgresPassword)
	.WithEnvironment("POSTGRES_DB", postgresDatabase)
	.WithBindMount(schemaPath, "/docker-entrypoint-initdb.d/schema.sql")
	.WithEndpoint(port: postgresPort, targetPort: postgresPort)
	.WithLifetime(ContainerLifetime.Session);

builder.AddContainer(keycloakHost, "keycloak/keycloak", "26.4")
	.WithBindMount(keycloakImportPath, "/opt/keycloak/data/import/AppRealm.json")
	.WithEnvironment("KC_BOOTSTRAP_ADMIN_USERNAME", "admin")
	.WithEnvironment("KC_BOOTSTRAP_ADMIN_PASSWORD", "password123")
	.WithEnvironment("KC_HOSTNAME_STRICT", "false")
	.WithEnvironment("KC_HOSTNAME_STRICT_HTTPS", "false")
	.WithHttpEndpoint(port: keycloakPort, targetPort: keycloakPort)
	.WithArgs("start-dev", "--import-realm");

var api = builder.AddContainer("api", "node", "25-alpine3.22")
	.WithHttpEndpoint(port: 4444, targetPort: 4444)
	.WithBindMount(serverPath, "/app")
	.WithBindMount(apiNodeModulesPath, "/app/node_modules")
	.WithEnvironment("PORT", "4444")
	.WithEnvironment("NODE_ENV", "development")
	.WithEnvironment("DATABASE_URL", databaseUrl)
	.WithEnvironment("JWK_URI", jwkUri)
	.WithEnvironment("AI_SERVER", aiServerUrl)
	.WithEnvironment("AI_TOKEN", aiToken)
	.WithEntrypoint("sh")
	.WithArgs("-c", "cd /app && npm install -g pnpm && pnpm install && pnpm exec tsx server.ts");

builder.AddContainer("web", "node", "25-alpine3.22")
	.WithHttpEndpoint(port: 5173, targetPort: 5173)
	.WithBindMount(clientPath, "/app")
	.WithBindMount(webNodeModulesPath, "/app/node_modules")
	.WithEnvironment("NODE_ENV", "development")
	.WithEnvironment("VITE_KEYCLOAK_AUTHORITY", keycloakAuthority)
	.WithEntrypoint("sh")
	.WithArgs("-c", "cd /app && npm install -g pnpm && pnpm install && pnpm run dev -- --host");

builder.Build().Run();
