# Use the official Ubuntu image as the base
FROM ubuntu:latest

# Set environment variables to avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install sudo
RUN apt-get update && apt-get install -y sudo

# Create a new user with a home directory and add to sudoers
ARG USERNAME=lyuxinghe
RUN useradd -m -s /bin/bash $USERNAME && echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Set the default user
USER $USERNAME

# Set the working directory inside the container
WORKDIR /home/$USERNAME