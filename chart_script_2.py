import plotly.graph_objects as go
import numpy as np

# Create a more organized layout with clear service groupings
fig = go.Figure()

# Define service groups with better positioning
services = {
    'Docker Compose': (0, 0),
    'FastAPI': (-3, 2),
    'Scraping Svc': (0, 3),
    'AI Service': (3, 2),
    'Frontend': (0, -2)
}

# Dependencies grouped by service with closer positioning
dependencies = {
    # FastAPI group
    'Neo4j': (-4, 3),
    'Redis': (-1, 1),
    'Pydantic': (-4, 1),
    'Uvicorn': (-2, 3),
    
    # Scraping group  
    'Playwright': (-1, 4),
    'Puppeteer': (1, 4),
    'Express': (0, 4),
    
    # AI group
    'LangChain': (4, 3),
    'Hugging Face': (3, 3),
    'OpenAI API': (4, 1),
    'Anthropic API': (2, 3),
    
    # Frontend group
    'React': (-1, -3),
    'D3.js': (0, -3),
    'Cytoscape': (1, -3),
    'React Query': (-1, -1),
    'Axios': (1, -1),
    'TailwindCSS': (0, -4)
}

# Infrastructure and monitoring
infrastructure = {
    'Infrastructure': (-2, -1),
    'Kubernetes': (-3, -2),
    'Helm': (-1, -2),
    'Monitoring': (2, -1),
    'Grafana': (3, -2),
    'Prometheus': (1, -2)
}

# Combine all nodes
all_nodes = {**services, **dependencies, **infrastructure}

# Define main service connections (thicker lines)
main_connections = [
    ('Docker Compose', 'FastAPI'),
    ('Docker Compose', 'Scraping Svc'),
    ('Docker Compose', 'AI Service'),
    ('Docker Compose', 'Frontend'),
]

# Service to dependency connections (medium lines)
service_deps = [
    ('FastAPI', 'Neo4j'),
    ('FastAPI', 'Redis'),
    ('FastAPI', 'Pydantic'),
    ('FastAPI', 'Uvicorn'),
    
    ('Scraping Svc', 'Playwright'),
    ('Scraping Svc', 'Puppeteer'),
    ('Scraping Svc', 'Redis'),
    ('Scraping Svc', 'Express'),
    
    ('AI Service', 'LangChain'),
    ('AI Service', 'Hugging Face'),
    ('AI Service', 'OpenAI API'),
    ('AI Service', 'Anthropic API'),
    ('AI Service', 'Redis'),
    
    ('Frontend', 'React'),
    ('Frontend', 'D3.js'),
    ('Frontend', 'Cytoscape'),
    ('Frontend', 'React Query'),
    ('Frontend', 'Axios'),
    ('Frontend', 'TailwindCSS'),
]

# Infrastructure connections (thin lines)
infra_connections = [
    ('Infrastructure', 'Docker Compose'),
    ('Infrastructure', 'Kubernetes'),
    ('Infrastructure', 'Helm'),
    ('Monitoring', 'FastAPI'),
    ('Monitoring', 'Scraping Svc'),
    ('Monitoring', 'AI Service'),
    ('Monitoring', 'Grafana'),
    ('Monitoring', 'Prometheus'),
]

# Add main service connections (thick, primary color)
for from_node, to_node in main_connections:
    from_pos = all_nodes[from_node]
    to_pos = all_nodes[to_node]
    fig.add_trace(go.Scatter(
        x=[from_pos[0], to_pos[0]],
        y=[from_pos[1], to_pos[1]],
        mode='lines',
        line=dict(color='#1FB8CD', width=4),
        showlegend=False,
        hoverinfo='none'
    ))

# Add service dependency connections (medium thickness)
for from_node, to_node in service_deps:
    from_pos = all_nodes[from_node]
    to_pos = all_nodes[to_node]
    fig.add_trace(go.Scatter(
        x=[from_pos[0], to_pos[0]],
        y=[from_pos[1], to_pos[1]],
        mode='lines',
        line=dict(color='#666666', width=2),
        showlegend=False,
        hoverinfo='none'
    ))

# Add infrastructure connections (thin)
for from_node, to_node in infra_connections:
    from_pos = all_nodes[from_node]
    to_pos = all_nodes[to_node]
    fig.add_trace(go.Scatter(
        x=[from_pos[0], to_pos[0]],
        y=[from_pos[1], to_pos[1]],
        mode='lines',
        line=dict(color='#999999', width=1.5),
        showlegend=False,
        hoverinfo='none'
    ))

# Add nodes with different colors for different types
# Core services (large, primary colors)
for node, pos in services.items():
    colors = {'Docker Compose': '#1FB8CD', 'FastAPI': '#DB4545', 
              'Scraping Svc': '#2E8B57', 'AI Service': '#5D878F', 'Frontend': '#D2BA4C'}
    fig.add_trace(go.Scatter(
        x=[pos[0]], y=[pos[1]],
        mode='markers+text',
        marker=dict(size=30, color=colors[node], line=dict(width=3, color='white')),
        text=node,
        textposition='middle center',
        textfont=dict(size=12, color='white', family='Arial Black'),
        showlegend=False,
        hoverinfo='text',
        hovertext=f'{node} (Service)'
    ))

# Dependencies (medium, secondary colors)
for node, pos in dependencies.items():
    fig.add_trace(go.Scatter(
        x=[pos[0]], y=[pos[1]],
        mode='markers+text',
        marker=dict(size=20, color='#B4413C', line=dict(width=2, color='white')),
        text=node,
        textposition='middle center',
        textfont=dict(size=10, color='white'),
        showlegend=False,
        hoverinfo='text',
        hovertext=f'{node} (Dependency)'
    ))

# Infrastructure (medium, infrastructure color)
for node, pos in infrastructure.items():
    fig.add_trace(go.Scatter(
        x=[pos[0]], y=[pos[1]],
        mode='markers+text',
        marker=dict(size=22, color='#964325', line=dict(width=2, color='white')),
        text=node,
        textposition='middle center',
        textfont=dict(size=10, color='white'),
        showlegend=False,
        hoverinfo='text',
        hovertext=f'{node} (Infrastructure)'
    ))

# Add legend manually using invisible traces
legend_items = [
    ('Core Services', '#1FB8CD', 30),
    ('Dependencies', '#B4413C', 20),
    ('Infrastructure', '#964325', 22)
]

for name, color, size in legend_items:
    fig.add_trace(go.Scatter(
        x=[None], y=[None],
        mode='markers',
        marker=dict(size=size/2, color=color, line=dict(width=2, color='white')),
        name=name,
        showlegend=True
    ))

# Update layout with better positioning
fig.update_layout(
    title='System Dependencies',
    showlegend=True,
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.02,
        xanchor='center',
        x=0.5
    ),
    xaxis=dict(
        showgrid=False, 
        zeroline=False, 
        showticklabels=False,
        range=[-5, 5]
    ),
    yaxis=dict(
        showgrid=False, 
        zeroline=False, 
        showticklabels=False,
        range=[-5, 5]
    ),
    plot_bgcolor='white',
    paper_bgcolor='white'
)

# Save both PNG and SVG
fig.write_image('system_dependencies.png')
fig.write_image('system_dependencies.svg', format='svg')
print("Improved chart saved successfully")