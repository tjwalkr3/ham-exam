using System.IO;
using Aspire.Hosting;
using Aspire.Hosting.ApplicationModel;

var builder = DistributedApplication.CreateBuilder(args);

var repoRoot = Path.GetFullPath(Path.Combine(builder.AppHostDirectory!, "..", ".."));

string ResolvePath(params string[] segments)
{
	var current = repoRoot;
	foreach (var segment in segments)
	{
		current = Path.Combine(current, segment);
	}
	return current;
}

static string EnsureScratchDir(string root, string name)
{
	var path = Path.Combine(root, name);
	Directory.CreateDirectory(path);
	return path;
}

var serverPath = ResolvePath("server");
var clientPath = ResolvePath("client");
var schemaPath = ResolvePath("config", "schema.sql");
var scratchRoot = ResolvePath(".containers");
Directory.CreateDirectory(scratchRoot);
var apiNodeModulesPath = EnsureScratchDir(scratchRoot, "api-node_modules");
var webNodeModulesPath = EnsureScratchDir(scratchRoot, "web-node_modules");

const string postgresUser = "appuser";
const string postgresPassword = "apppassword";
const string postgresDatabase = "appdb";
const int postgresPort = 5432;
const string postgresHost = "postgres";

var jwkUri = Environment.GetEnvironmentVariable("JWK_URI") ?? string.Empty;
var databaseUrl = $"postgres://{postgresUser}:{postgresPassword}@{postgresHost}:{postgresPort}/{postgresDatabase}";

var postgres = builder.AddContainer(postgresHost, "postgres", "18-alpine3.22")
	.WithEnvironment("POSTGRES_USER", postgresUser)
	.WithEnvironment("POSTGRES_PASSWORD", postgresPassword)
	.WithEnvironment("POSTGRES_DB", postgresDatabase)
	.WithBindMount(schemaPath, "/docker-entrypoint-initdb.d/schema.sql")
	.WithEndpoint(port: postgresPort, targetPort: postgresPort)
	.WithLifetime(ContainerLifetime.Session);

var api = builder.AddContainer("api", "node", "25-alpine3.22")
	.WithHttpEndpoint(port: 4444, targetPort: 4444)
	.WithBindMount(serverPath, "/app")
	.WithBindMount(apiNodeModulesPath, "/app/node_modules")
	.WithEnvironment("PORT", "4444")
	.WithEnvironment("NODE_ENV", "development")
	.WithEnvironment("DATABASE_URL", databaseUrl)
	.WithEnvironment("JWK_URI", jwkUri)
	.WithEntrypoint("sh")
	.WithArgs("-c", "cd /app && npm install -g pnpm && pnpm install && pnpm exec tsx server.ts");

builder.AddContainer("web", "node", "25-alpine3.22")
	.WithHttpEndpoint(port: 5173, targetPort: 5173)
	.WithBindMount(clientPath, "/app")
	.WithBindMount(webNodeModulesPath, "/app/node_modules")
	.WithEnvironment("NODE_ENV", "development")
	.WithEntrypoint("sh")
	.WithArgs("-c", "cd /app && npm install -g pnpm && pnpm install && pnpm run dev -- --host");

builder.Build().Run();
