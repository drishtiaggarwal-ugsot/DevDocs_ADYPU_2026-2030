# Docker Cheat Sheet

Docker packages an application and its dependencies into portable containers. This quick reference covers the commands you will use most often.

## Build and manage images

```bash
# Build an image from the Dockerfile in the current directory
docker build -t <image-name>:<tag> .

# List local images
docker images

# Download an image from a registry
docker pull <image-name>:<tag>

# Add another name or tag to an image
docker tag <source-image>:<tag> <new-image>:<tag>

# Remove an unused local image
docker rmi <image-name>:<tag>
```

## Run and manage containers

```bash
# Run a container in the background and publish a port
docker run --name <container-name> -d -p <host-port>:<container-port> <image-name>:<tag>

# Run an interactive shell and remove the container when it exits
docker run --rm -it <image-name>:<tag> sh

# List running containers (add -a to include stopped containers)
docker ps
docker ps -a

# Start, stop, or restart a container
docker start <container-name>
docker stop <container-name>
docker restart <container-name>

# Remove a stopped container
docker rm <container-name>
```

## Inspect and troubleshoot

```bash
# View a container's output; -f follows new log entries
docker logs -f <container-name>

# Open a shell in a running container
docker exec -it <container-name> sh

# Show detailed configuration and runtime information
docker inspect <container-name-or-image>

# Show CPU, memory, and network usage for running containers
docker stats
```

## Volumes and networks

```bash
# Mount the current directory into a container
docker run --rm -v "$(pwd):/app" <image-name>:<tag>

# List and remove named volumes
docker volume ls
docker volume rm <volume-name>

# List and create networks
docker network ls
docker network create <network-name>
```

## Docker Compose

```bash
# Start the services defined in compose.yaml
docker compose up -d

# Rebuild images and start services
docker compose up -d --build

# View service logs and stop services
docker compose logs -f
docker compose down
```

## Clean up unused resources

```bash
# Remove stopped containers, unused networks, and dangling images
docker system prune

# Also remove unused images and volumes (review the prompt carefully)
docker system prune -a --volumes
```

> Tip: Replace values in angle brackets, such as `<image-name>`, with names from your own project.
