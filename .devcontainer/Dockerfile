FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    build-essential \
    curl \
    git \
    gnupg \
    lsb-release \
    python3-pip \
    python3-dev \
    python3-venv \
    postgresql-client \
    redis-tools \
    graphviz \
    ffmpeg \
    chromium \
    chromium-driver \
    # Needed for jujutsu
    libssl-dev \
    pkg-config \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Rust (needed for some Python packages and jujutsu)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install jujutsu (jj) from source for latest features
RUN cargo install --locked jj-cli

# Install global Node packages
RUN npm install -g \
    pnpm \
    yarn \
    typescript \
    ts-node \
    nodemon \
    concurrently \
    @nestjs/cli \
    create-react-app \
    vite \
    @playwright/test \
    verdaccio

# Install Python packages globally
RUN pip3 install --upgrade pip setuptools wheel \
    && pip3 install \
    poetry \
    black \
    flake8 \
    mypy \
    pytest \
    pytest-asyncio \
    pytest-cov \
    ipython \
    jupyter \
    pandas \
    numpy \
    scikit-learn \
    fastapi \
    uvicorn \
    sqlalchemy \
    alembic \
    neo4j \
    redis \
    celery \
    playwright \
    beautifulsoup4 \
    scrapy \
    selenium \
    langchain \
    chromadb \
    sentence-transformers \
    transformers \
    torch \
    torchvision \
    networkx \
    matplotlib \
    plotly

# Install Playwright browsers
RUN playwright install chromium firefox webkit

# Create workspace directory
WORKDIR /workspace

# Configure jj
RUN jj config set --user user.name "Developer" \
    && jj config set --user user.email "dev@knowledgegraph.local" \
    && jj config set --user ui.color "always" \
    && jj config set --user ui.pager "less -FRX"

# Create useful aliases for jj
RUN echo 'alias js="jj status"' >> /root/.bashrc \
    && echo 'alias jl="jj log"' >> /root/.bashrc \
    && echo 'alias jd="jj diff"' >> /root/.bashrc \
    && echo 'alias jn="jj new"' >> /root/.bashrc \
    && echo 'alias je="jj edit"' >> /root/.bashrc \
    && echo 'alias jc="jj describe"' >> /root/.bashrc

# Set up development environment variables
ENV NODE_ENV=development \
    PYTHONPATH=/workspace/src:$PYTHONPATH \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Expose common development ports
EXPOSE 3000 5000 5173 8000 8080 9229

# Keep container running
CMD ["sleep", "infinity"]