# Use an official Rust image to build the Solana program
FROM rust:1.70 as builder

# Install Solana tools with the correct version
RUN apt-get update && apt-get install -y wget xz-utils curl bzip2  # Added bzip2 for tar extraction

# Manually download and install Solana v1.18.22
RUN wget https://github.com/solana-labs/solana/releases/download/v1.18.22/solana-release-x86_64-unknown-linux-gnu.tar.bz2 && \
    tar -xjf solana-release-x86_64-unknown-linux-gnu.tar.bz2 && \
    ./solana-release/bin/solana-install init v1.18.22 && \
    rm -rf solana-release-x86_64-unknown-linux-gnu.tar.bz2 solana-release
ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Install additional dependencies for Anchor
RUN apt-get update && apt-get install -y pkg-config build-essential libudev-dev libssl-dev

# Install AVM and Anchor CLI
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
RUN avm install latest && avm use latest

# Set the working directory
WORKDIR /usr/src/blockchain

# Copy program files
COPY programs/cnft-program/src ./programs/cnft-program/src
COPY programs/cnft-program/Cargo.toml ./programs/cnft-program/Cargo.toml
COPY migrations ./migrations
COPY Anchor.toml .

# Build the Solana program
RUN anchor build

# Runtime Image
FROM debian:buster-slim

# Install Solana tools on the runtime image
RUN apt-get update && apt-get install -y wget xz-utils curl bzip2  # Added bzip2 for tar extraction

# Manually download and install Solana v1.18.22
RUN wget https://github.com/solana-labs/solana/releases/download/v1.18.22/solana-release-x86_64-unknown-linux-gnu.tar.bz2 && \
    tar -xjf solana-release-x86_64-unknown-linux-gnu.tar.bz2 && \
    ./solana-release/bin/solana-install init v1.18.22 && \
    rm -rf solana-release-x86_64-unknown-linux-gnu.tar.bz2 solana-release
ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Install Rust and Cargo for Anchor CLI installation
RUN apt-get update && apt-get install -y curl build-essential libssl-dev libudev-dev pkg-config && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    . "$HOME/.cargo/env" && \
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force && \
    avm install latest && avm use latest

# Set the working directory
WORKDIR /usr/src/blockchain

# Copy the built binaries and deploy scripts
COPY --from=builder /usr/src/blockchain/target /usr/src/blockchain/target
COPY --from=builder /usr/src/blockchain/Anchor.toml /usr/src/blockchain/Anchor.toml
COPY --from=builder /usr/src/blockchain/migrations /usr/src/blockchain/migrations
COPY scripts ./scripts

# Expose Solana and Anchor ports
EXPOSE 8899 8900

# Command to run the Solana test validator
CMD ["solana-test-validator", "--ledger", "/root/validator-ledger", "--reset"]
