# cihm-file-access

cihm-file-access is a web service providing Canadiana TDR file access to authenticated requests.

## Configuration

The service currently expects a `config.json` file in the root directory, with the following contents:

    {
        "repositoryBase": $REPOSITORY_BASE_DIRECTORY,
        "secrets": {"$SECRET_KEY_ID": "$SECRET_KEY"}
    }

Use `docker-compose.dev.yml` for on-the fly development.
