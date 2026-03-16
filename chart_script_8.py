import plotly.graph_objects as go
import plotly.express as px
import networkx as nx
import numpy as np

# Create a network graph for the ERD
G = nx.Graph()

# Add entities as nodes with their positions
entities = {
    'Users': {'attributes': ['id (PK)', 'email', 'name', 'created_at', 'updated_at'], 'pos': (0, 2)},
    'Nodes': {'attributes': ['id (PK)', 'title', 'type', 'content', 'user_id (FK)', 'created_at', 'updated_at'], 'pos': (2, 2)},
    'Files': {'attributes': ['id (PK)', 'filename', 'file_path', 'file_size', 'node_id (FK)', 'uploaded_at'], 'pos': (4, 2)},
    'Relationships': {'attributes': ['id (PK)', 'from_node_id (FK)', 'to_node_id (FK)', 'rel_type', 'created_at'], 'pos': (2, 0)},
    'Tags': {'attributes': ['id (PK)', 'name', 'color', 'created_at'], 'pos': (0, 0)},
    'NodeTags': {'attributes': ['node_id (FK)', 'tag_id (FK)'], 'pos': (1, 1)},
    'AuditLog': {'attributes': ['id (PK)', 'entity_type', 'entity_id', 'action', 'changes', 'user_id (FK)', 'created_at'], 'pos': (3, 0)}
}

# Add nodes to the graph
for entity, data in entities.items():
    G.add_node(entity, **data)

# Add edges (relationships)
relationships = [
    ('Users', 'Nodes', '1:N creates'),
    ('Users', 'AuditLog', '1:N performs'),
    ('Nodes', 'Files', '1:N has'),
    ('Nodes', 'Relationships', '1:N from'),
    ('Nodes', 'Relationships', '1:N to'),
    ('Nodes', 'NodeTags', '1:N'),
    ('Tags', 'NodeTags', '1:N'),
]

for source, target, label in relationships:
    G.add_edge(source, target, label=label)

# Get positions
pos = nx.get_node_attributes(G, 'pos')

# Create edge traces
edge_x = []
edge_y = []
edge_info = []

for edge in G.edges():
    x0, y0 = pos[edge[0]]
    x1, y1 = pos[edge[1]]
    edge_x.extend([x0, x1, None])
    edge_y.extend([y0, y1, None])

edge_trace = go.Scatter(x=edge_x, y=edge_y,
                       line=dict(width=2, color='#888'),
                       hoverinfo='none',
                       mode='lines')

# Create node traces
node_x = []
node_y = []
node_text = []
node_info = []
node_colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C', '#B4413C', '#964325']

for i, node in enumerate(G.nodes()):
    x, y = pos[node]
    node_x.append(x)
    node_y.append(y)
    
    # Create hover text with attributes
    attributes = G.nodes[node]['attributes']
    hover_text = f"<b>{node}</b><br>"
    hover_text += "<br>".join(attributes)
    node_info.append(hover_text)
    
    node_text.append(node)

node_trace = go.Scatter(x=node_x, y=node_y,
                       mode='markers+text',
                       hoverinfo='text',
                       text=node_text,
                       textposition="middle center",
                       textfont=dict(size=12, color="white"),
                       hovertext=node_info,
                       marker=dict(
                           size=[60, 80, 60, 80, 60, 70, 80],
                           color=[node_colors[i % len(node_colors)] for i in range(len(node_x))],
                           line=dict(width=2, color="white")))

# Add relationship labels as annotations
annotations = []
for i, (source, target, data) in enumerate(G.edges(data=True)):
    x0, y0 = pos[source]
    x1, y1 = pos[target]
    x_mid = (x0 + x1) / 2
    y_mid = (y0 + y1) / 2
    
    label = data.get('label', '')
    annotations.append(
        dict(
            x=x_mid, y=y_mid,
            text=label,
            showarrow=False,
            font=dict(size=10, color="#666"),
            bgcolor="rgba(255,255,255,0.8)",
            bordercolor="#666",
            borderwidth=1
        )
    )

# Create figure with proper title configuration
fig = go.Figure(data=[edge_trace, node_trace])

fig.update_layout(
    title=dict(
        text='Entity Relationship Diagram',
        x=0.5,
        font=dict(size=16)
    ),
    showlegend=False,
    hovermode='closest',
    annotations=annotations,
    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    plot_bgcolor='white'
)

# Save the chart
fig.write_image("erd_diagram.png")
fig.write_image("erd_diagram.svg", format="svg")

print("ERD diagram created successfully!")