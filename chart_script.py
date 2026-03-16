import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

# Create a network-style diagram using Plotly
fig = go.Figure()

# Define node positions for three main sections
user_flow_nodes = {
    'User': (1, 8),
    'React UI': (2, 8),
    'FastAPI': (3, 8),
    'Neo4j DB': (4, 9),
    'AI Service': (4, 8),
    'Scraper': (4, 7),
    'LangChain': (5, 8),
    'Playwright': (5, 7)
}

file_structure_nodes = {
    'Project Root': (1, 5),
    'backend/': (2, 6),
    'frontend/': (2, 5),
    'scraping-svc/': (2, 4),
    'ai-service/': (2, 3),
    'docs/': (2, 2),
    'scripts/': (2, 1),
    'api/routes/': (3, 6),
    'src/components/': (3, 5),
    'scrapers/': (3, 4),
    'models/': (3, 3)
}

tech_stack_nodes = {
    'FastAPI Core': (1, -1),
    'Redis Cache': (2, 0),
    'Neo4j Graph': (2, -1),
    'React App': (2, -2),
    'HTTP Client': (3, -2),
    'Web Scraping': (3, 0),
    'OpenAI API': (3, -1),
    'Graph Storage': (4, -1),
    'Cache Layer': (4, 0)
}

all_nodes = {**user_flow_nodes, **file_structure_nodes, **tech_stack_nodes}

# Create node traces
x_coords = [pos[0] for pos in all_nodes.values()]
y_coords = [pos[1] for pos in all_nodes.values()]
node_names = list(all_nodes.keys())

# Color nodes by section
colors = []
for name in node_names:
    if name in user_flow_nodes:
        colors.append('#1FB8CD')  # Cyan for user flow
    elif name in file_structure_nodes:
        colors.append('#2E8B57')  # Green for file structure
    else:
        colors.append('#DB4545')  # Red for tech stack

# Add node trace
fig.add_trace(go.Scatter(
    x=x_coords,
    y=y_coords,
    mode='markers+text',
    text=node_names,
    textposition='middle center',
    textfont=dict(size=10, color='white'),
    marker=dict(
        size=30,
        color=colors,
        line=dict(width=2, color='white')
    ),
    hoverinfo='text',
    hovertext=node_names,
    showlegend=False
))

# Define connections
connections = [
    # User flow connections
    ('User', 'React UI'),
    ('React UI', 'FastAPI'),
    ('FastAPI', 'Neo4j DB'),
    ('FastAPI', 'AI Service'),
    ('FastAPI', 'Scraper'),
    ('AI Service', 'LangChain'),
    ('Scraper', 'Playwright'),
    
    # File structure connections
    ('Project Root', 'backend/'),
    ('Project Root', 'frontend/'),
    ('Project Root', 'scraping-svc/'),
    ('Project Root', 'ai-service/'),
    ('Project Root', 'docs/'),
    ('Project Root', 'scripts/'),
    ('backend/', 'api/routes/'),
    ('frontend/', 'src/components/'),
    ('scraping-svc/', 'scrapers/'),
    ('ai-service/', 'models/'),
    
    # Tech stack connections
    ('FastAPI Core', 'Redis Cache'),
    ('FastAPI Core', 'Neo4j Graph'),
    ('React App', 'HTTP Client'),
    ('Redis Cache', 'Cache Layer'),
    ('Neo4j Graph', 'Graph Storage'),
    ('Web Scraping', 'OpenAI API')
]

# Add edge traces
for start, end in connections:
    if start in all_nodes and end in all_nodes:
        x0, y0 = all_nodes[start]
        x1, y1 = all_nodes[end]
        
        fig.add_trace(go.Scatter(
            x=[x0, x1, None],
            y=[y0, y1, None],
            mode='lines',
            line=dict(width=2, color='#333333'),
            showlegend=False,
            hoverinfo='skip'
        ))

# Add section labels
fig.add_annotation(
    x=2.5, y=9.5,
    text="User Interaction Flow",
    font=dict(size=16, color='#1FB8CD'),
    showarrow=False
)

fig.add_annotation(
    x=2, y=6.5,
    text="Project File Structure",
    font=dict(size=16, color='#2E8B57'),
    showarrow=False
)

fig.add_annotation(
    x=2.5, y=1,
    text="Technology Dependencies",
    font=dict(size=16, color='#DB4545'),
    showarrow=False
)

# Update layout
fig.update_layout(
    title="System Architecture Overview",
    showlegend=False,
    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    plot_bgcolor='rgba(0,0,0,0)',
    margin=dict(t=50, l=20, r=20, b=20)
)

# Save both PNG and SVG
fig.write_image("system_arch.png")
fig.write_image("system_arch.svg", format="svg")

print("System architecture diagram created successfully!")