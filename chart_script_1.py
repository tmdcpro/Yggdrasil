import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

# Since Mermaid is having network issues, let's create a directory structure using Plotly
# We'll use a treemap to show the hierarchical structure

# Define the directory structure data
directories = [
    # Main project root
    'knowledge-graph-platform',
    
    # Main service directories
    'knowledge-graph-platform/backend',
    'knowledge-graph-platform/frontend', 
    'knowledge-graph-platform/scraping-service',
    'knowledge-graph-platform/ai-service',
    
    # Support directories
    'knowledge-graph-platform/docs',
    'knowledge-graph-platform/scripts',
    'knowledge-graph-platform/infrastructure',
    'knowledge-graph-platform/logs',
    'knowledge-graph-platform/checkpoints',
    
    # Backend structure
    'knowledge-graph-platform/backend/app',
    'knowledge-graph-platform/backend/tests',
    'knowledge-graph-platform/backend/requirements',
    'knowledge-graph-platform/backend/app/api',
    'knowledge-graph-platform/backend/app/core',
    'knowledge-graph-platform/backend/app/models',
    'knowledge-graph-platform/backend/app/services',
    'knowledge-graph-platform/backend/app/utils',
    'knowledge-graph-platform/backend/app/api/v1',
    'knowledge-graph-platform/backend/app/api/v1/endpoints',
    
    # Frontend structure
    'knowledge-graph-platform/frontend/src',
    'knowledge-graph-platform/frontend/public',
    'knowledge-graph-platform/frontend/src/components',
    'knowledge-graph-platform/frontend/src/pages',
    'knowledge-graph-platform/frontend/src/hooks',
    'knowledge-graph-platform/frontend/src/services',
    'knowledge-graph-platform/frontend/src/store',
    'knowledge-graph-platform/frontend/src/types',
    'knowledge-graph-platform/frontend/src/utils',
    
    # Scraping service
    'knowledge-graph-platform/scraping-service/src',
    'knowledge-graph-platform/scraping-service/tests',
    'knowledge-graph-platform/scraping-service/src/scrapers',
    'knowledge-graph-platform/scraping-service/src/extractors',
    'knowledge-graph-platform/scraping-service/src/queue',
    'knowledge-graph-platform/scraping-service/src/utils',
    
    # AI service
    'knowledge-graph-platform/ai-service/src',
    'knowledge-graph-platform/ai-service/tests',
    'knowledge-graph-platform/ai-service/src/processors',
    'knowledge-graph-platform/ai-service/src/models',
    'knowledge-graph-platform/ai-service/src/embeddings',
    'knowledge-graph-platform/ai-service/src/ontology',
    
    # Documentation
    'knowledge-graph-platform/docs/architecture',
    'knowledge-graph-platform/docs/api',
    'knowledge-graph-platform/docs/deployment',
    'knowledge-graph-platform/docs/development',
    'knowledge-graph-platform/docs/user-guides',
    
    # Infrastructure
    'knowledge-graph-platform/infrastructure/k8s',
    'knowledge-graph-platform/infrastructure/helm',
    'knowledge-graph-platform/infrastructure/monitoring',
    'knowledge-graph-platform/infrastructure/backup',
]

# Files
files = [
    'knowledge-graph-platform/README.md',
    'knowledge-graph-platform/backend/Dockerfile',
    'knowledge-graph-platform/backend/app/api/v1/api.py',
    'knowledge-graph-platform/frontend/package.json',
    'knowledge-graph-platform/frontend/vite.config.ts',
    'knowledge-graph-platform/frontend/Dockerfile',
    'knowledge-graph-platform/scraping-service/package.json',
    'knowledge-graph-platform/scraping-service/Dockerfile',
    'knowledge-graph-platform/scripts/setup-dev.sh',
    'knowledge-graph-platform/scripts/run-tests.sh',
    'knowledge-graph-platform/scripts/backup.sh',
]

# Prepare data for treemap
all_paths = directories + files
labels = []
parents = []
values = []

for path in all_paths:
    parts = path.split('/')
    label = parts[-1]
    labels.append(label)
    
    if len(parts) == 1:
        parents.append("")  # Root
        values.append(10)  # Higher value for root
    else:
        parent_path = '/'.join(parts[:-1])
        parent_label = parent_path.split('/')[-1]
        parents.append(parent_label)
        values.append(1)

# Create treemap
fig = go.Figure(go.Treemap(
    labels=labels,
    parents=parents,
    values=values,
    textinfo="label",
    hovertemplate='<b>%{label}</b><extra></extra>',
    maxdepth=4,
    pathbar_textfont_size=12,
))

fig.update_layout(
    title="Knowledge Graph Platform Structure",
    font_size=10,
)

# Save as PNG and SVG
fig.write_image("directory_structure.png")
fig.write_image("directory_structure.svg", format="svg")

print("Directory structure chart created successfully!")
print("Files saved: directory_structure.png and directory_structure.svg")